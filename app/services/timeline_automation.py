import logging
import asyncio
from app.storage.supabase_client import supabase
from app.runtime.engine import get_runtime
from typing import Dict, Any, List

logger = logging.getLogger(__name__)

class TimelineAutomationService:
    async def process_new_events(self, user_id: str, events: List[Dict[str, Any]]):
        """
        Main entry point for post-processing timeline events.
        Runs in background.
        """
        for event in events:
            try:
                await self._process_single_event(user_id, event)
            except Exception as e:
                logger.error(f"Error processing timeline event {event.get('id')}: {e}")

    async def _process_single_event(self, user_id: str, event: Dict[str, Any]):
        event_id = event.get("id")
        event_type = event.get("event_type")
        title = event.get("title", "")
        clinical_data = event.get("clinical_data", {})
        
        # 1. Detect if it's a diagnosis and generate an education card
        if event_type == "diagnosis":
            # Check if there's already any card for this diagnosis (active or stale) to determine version
            existing_cards_res = supabase.table("education_cards").select("id, version, status").eq("patient_id", user_id).eq("title", f"Understanding {title}").order("version", desc=True).limit(1).execute()
            
            new_version = 1
            previous_version_id = None
            
            if existing_cards_res.data:
                latest_card = existing_cards_res.data[0]
                new_version = latest_card.get("version", 0) + 1
                previous_version_id = latest_card.get("id")
                
                # Mark old active cards as stale if they are not already
                if latest_card.get("status") != "stale":
                    supabase.table("education_cards").update({"status": "stale"}).eq("patient_id", user_id).eq("title", f"Understanding {title}").neq("status", "stale").execute()
            
            # Note: This is an internal generation, typically triggered by an automated system clinician
            runtime = get_runtime()
            
            prompt = f"""
            Create a patient education card for the condition: {title}.
            Make it easy to understand, empathetic, and actionable. Format as Markdown.
            """
            
            try:
                response = runtime.provider.invoke(prompt)
                content_md = response.content if hasattr(response, 'content') else str(response)
                
                supabase.table("education_cards").insert({
                    "patient_id": user_id,
                    # Using system clinician ID or null
                    "title": f"Understanding {title}",
                    "content_md": content_md,
                    "status": "draft",
                    "version": new_version,
                    "previous_version_id": previous_version_id
                }).execute()
            except Exception as e:
                logger.error(f"Failed to auto-generate education card: {e}")

        # 2. Check for stale tasks
        # If this event is a lab result, we might supersede an existing 'lab_followup' task.
        if event_type in ["lab_result", "procedure", "vitals", "medication"]:
            # Find pending tasks
            pending_tasks_res = supabase.table("tasks").select("*").eq("user_id", user_id).eq("status", "pending").execute()
            if pending_tasks_res.data:
                for task in pending_tasks_res.data:
                    # Very basic heuristic: if the task title mentions something related to this event's title
                    # e.g., Task "Follow up on A1C" and Event "A1C Result"
                    # In a real system, we'd use an LLM or vector search to check relevance.
                    # For now, let's use a simple text overlap check
                    task_title = task.get("title", "").lower()
                    evt_title = title.lower()
                    
                    # If task is lab followup and we got a lab result
                    if task.get("type") == "lab_followup" and event_type == "lab_result":
                        # Mark stale
                        supabase.table("tasks").update({
                            "status": "stale",
                            "stale_reason": f"Superseded by new lab result: {title}"
                        }).eq("id", task["id"]).execute()
                        
                        # Mark the event as superseding
                        supabase.table("timeline_events").update({
                            "is_superseded": False # This event is new, the old one is superseded
                        }).eq("id", event_id).execute()
                        
                    # If task is medication change and we got a new medication event
                    elif task.get("type") == "medication_change" and event_type == "medication":
                        supabase.table("tasks").update({
                            "status": "stale",
                            "stale_reason": f"Superseded by new medication record: {title}"
                        }).eq("id", task["id"]).execute()
                        
                        supabase.table("timeline_events").update({
                            "is_superseded": False
                        }).eq("id", event_id).execute()

                    # If task is ask_doctor and we got a clinical note/consultation that addresses it
                    elif task.get("type") == "ask_doctor" and event_type in ["consultation", "diagnosis", "procedure"]:
                        supabase.table("tasks").update({
                            "status": "stale",
                            "stale_reason": f"Potentially addressed in recent record: {title}"
                        }).eq("id", task["id"]).execute()


timeline_automation = TimelineAutomationService()
