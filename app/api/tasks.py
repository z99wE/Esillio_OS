from fastapi import APIRouter, Depends, HTTPException
from typing import Optional
from pydantic import BaseModel

from app.storage.supabase_client import supabase
from app.api.auth import get_current_user
from app.runtime.engine import get_runtime

router = APIRouter()

class TaskUpdate(BaseModel):
    status: Optional[str] = None
    stale_reason: Optional[str] = None

class TaskGenerateRequest(BaseModel):
    source_record_id: str

@router.get("/")
async def get_tasks(user=Depends(get_current_user)):
    """
    Get all tasks for the authenticated user, ordered by creation date descending.
    Lazily generates tasks for any timeline events that don't have them yet.
    """
    try:
        # 1. Fetch all timeline events for this user
        events_res = supabase.table("timeline_events").select("id, title, clinical_data").eq("patient_id", user["id"]).execute()
        events = events_res.data or []
        
        # 2. Fetch all source_record_ids from tasks for this user
        tasks_res = supabase.table("tasks").select("source_record_id").eq("user_id", user["id"]).execute()
        existing_source_ids = {t["source_record_id"] for t in (tasks_res.data or []) if t.get("source_record_id")}
        
        # 3. Find events that don't have tasks generated yet
        unprocessed_events = [e for e in events if e["id"] not in existing_source_ids]
        
        if unprocessed_events:
            runtime = get_runtime()
            capability = runtime.capabilities.get("task_generator")
            if not capability:
                from app.runtime.capabilities.task_generator import TaskGeneratorCapability
                capability = TaskGeneratorCapability(llm=runtime.provider)
            
            for event in unprocessed_events:
                clinical_text = f"Title: {event.get('title', 'Unknown')}\n\nContent:\n{event.get('clinical_data', '')}"
                try:
                    result = capability.run(clinical_text=clinical_text)
                    tasks_to_insert = result.get("tasks", [])
                    
                    for task in tasks_to_insert:
                        task_type = task.get("task_type", "general")
                        if task_type not in ['appointment_prep', 'lab_followup', 'medication_change', 'ask_doctor', 'general']:
                            task_type = 'general'
                            
                        task_data = {
                            "user_id": user["id"],
                            "source_record_id": event["id"],
                            "title": task.get("title", "Follow-up Task"),
                            "description": task.get("description", ""),
                            "type": task_type,
                            "status": "pending",
                            "checklist": task.get("checklist", [])
                        }
                        supabase.table("tasks").insert(task_data).execute()
                except Exception as e:
                    print(f"Lazy generation failed for event {event['id']}: {e}")

        # 4. Return all tasks
        response = supabase.table("tasks").select("*").eq("user_id", user["id"]).order("created_at", desc=True).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate")
async def generate_tasks(req: TaskGenerateRequest, user=Depends(get_current_user)):
    """
    Generate follow-up tasks from a specific timeline record.
    """
    try:
        # 1. Fetch the timeline record
        record_res = supabase.table("timeline_events").select("title, clinical_data").eq("id", req.source_record_id).eq("patient_id", user["id"]).execute()
        
        if not record_res.data:
            raise HTTPException(status_code=404, detail="Timeline record not found")
            
        record = record_res.data[0]
        clinical_text = f"Title: {record.get('title', 'Unknown')}\n\nContent:\n{record.get('content', '')}"
        
        # 2. Invoke TaskGenerator
        runtime = get_runtime()
        capability = runtime.capabilities.get("task_generator")
        if not capability:
            # Fallback if not specifically registered in engine, instantiate directly
            from app.runtime.capabilities.task_generator import TaskGeneratorCapability
            capability = TaskGeneratorCapability(llm=runtime.provider)
            
        result = capability.run(clinical_text=clinical_text)
        tasks_to_insert = result.get("tasks", [])
        
        inserted_tasks = []
        for task in tasks_to_insert:
            # Ensure task_type is valid
            task_type = task.get("task_type", "general")
            if task_type not in ['appointment_prep', 'lab_followup', 'medication_change', 'ask_doctor', 'general']:
                task_type = 'general'
                
            task_data = {
                "user_id": user["id"],
                "source_record_id": req.source_record_id,
                "title": task.get("title", "Follow-up Task"),
                "description": task.get("description", ""),
                "type": task_type,
                "status": "pending",
                "checklist": task.get("checklist", [])
            }
            res = supabase.table("tasks").insert(task_data).execute()
            if res.data:
                inserted_tasks.extend(res.data)
                
        return {"status": "success", "generated_tasks": inserted_tasks}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.patch("/{task_id}")
async def update_task(task_id: str, update_data: TaskUpdate, user=Depends(get_current_user)):
    """
    Update a task (e.g., mark as completed or dismissed).
    """
    try:
        data_to_update = {}
        if update_data.status:
            if update_data.status not in ['pending', 'completed', 'dismissed', 'stale']:
                raise HTTPException(status_code=400, detail="Invalid status")
            data_to_update["status"] = update_data.status
        if update_data.stale_reason:
            data_to_update["stale_reason"] = update_data.stale_reason
            
        if not data_to_update:
            return {"status": "no changes"}
            
        res = supabase.table("tasks").update(data_to_update).eq("id", task_id).eq("user_id", user["id"]).execute()
        
        if not res.data:
            raise HTTPException(status_code=404, detail="Task not found or update failed")
            
        return res.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
