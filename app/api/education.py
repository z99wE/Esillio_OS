from fastapi import APIRouter, Depends, HTTPException
from app.api.auth import get_current_user
from app.storage.supabase_client import supabase
from pydantic import BaseModel
from typing import Optional
import os
import logging
from openai import AsyncOpenAI

router = APIRouter(prefix="/education", tags=["education"])
logger = logging.getLogger(__name__)

# Basic system prompt for education
SYSTEM_PROMPT_EDUCATION = """You are a highly empathetic, expert medical communicator. 
Your task is to take a patient's medical condition and their timeline context, and generate a clear, reassuring, and easy-to-understand educational card.
Avoid overly complex jargon. Use bullet points for readability. Provide actionable next steps or lifestyle advice when appropriate.
Format the output strictly as Markdown."""

class GenerateEducationRequest(BaseModel):
    patient_id: str
    condition: str
    timeline_context: str

class UpdateEducationRequest(BaseModel):
    status: str
    content_md: Optional[str] = None

def get_user_role(user_id: str) -> str:
    if user_id == "00000000-0000-4000-a000-000000000000":
        return "patient"
    res = supabase.table("profiles").select("role").eq("id", user_id).execute()
    if res.data:
        return res.data[0].get("role", "patient")
    return "patient"

@router.post("/generate")
async def generate_education_content(
    req: GenerateEducationRequest,
    user_id: str = Depends(get_current_user)
):
    role = get_user_role(user_id)
    # Ensure user is clinician
    if role != "clinician":
        raise HTTPException(status_code=403, detail="Only clinicians can generate education cards.")
    
    # Call OpenAI to generate content
    client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    if not client.api_key:
        raise HTTPException(status_code=500, detail="OpenAI API key not configured")
        
    prompt = f"""
Create a patient education card for the condition: {req.condition}.
Use the following patient history context to personalize it slightly without being alarmist:
{req.timeline_context}

Make it easy to understand, empathetic, and actionable. Format as Markdown.
"""
    
    try:
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT_EDUCATION},
                {"role": "user", "content": prompt}
            ]
        )
        content_md = response.choices[0].message.content
        
        # Save to database as draft
        res = supabase.table("education_cards").insert({
            "patient_id": req.patient_id,
            "clinician_id": user_id,
            "title": f"Understanding {req.condition}",
            "content_md": content_md,
            "status": "draft"
        }).execute()
        
        if not res.data:
            raise Exception("Failed to insert into database")
            
        return {"status": "success", "data": res.data[0]}
    except Exception as e:
        logger.error(f"Failed to generate education: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/")
async def get_education_cards(
    patient_id: Optional[str] = None,
    status: Optional[str] = None,
    user_id: str = Depends(get_current_user)
):
    query = supabase.table("education_cards").select("*").order("created_at", desc=True)
    role = get_user_role(user_id)
    
    if role != "clinician":
        # Patients can only see their own approved cards
        query = query.eq("patient_id", user_id).eq("status", "approved")
    else:
        # Clinicians see all, can filter
        if patient_id:
            query = query.eq("patient_id", patient_id)
        if status:
            query = query.eq("status", status)
            
    try:
        res = query.execute()
        return {"status": "success", "data": res.data}
    except Exception as e:
        logger.error(f"Error fetching education cards: {e}")
        raise HTTPException(status_code=500, detail="Error fetching education cards")

@router.patch("/{card_id}")
async def update_education_card(
    card_id: str,
    req: UpdateEducationRequest,
    user_id: str = Depends(get_current_user)
):
    role = get_user_role(user_id)
    if role != "clinician":
        raise HTTPException(status_code=403, detail="Only clinicians can update education cards.")
        
    try:
        # Fetch the current card
        current_card_res = supabase.table("education_cards").select("*").eq("id", card_id).execute()
        if not current_card_res.data:
            raise HTTPException(status_code=404, detail="Card not found")
        current_card = current_card_res.data[0]
        
        update_data = {"status": req.status}
        if req.content_md is not None:
            update_data["content_md"] = req.content_md
            # If it's already approved and we are changing content, bump version
            if current_card["status"] == "approved" and req.content_md != current_card["content_md"]:
                update_data["version"] = current_card.get("version", 1) + 1
                
        res = supabase.table("education_cards").update(update_data).eq("id", card_id).execute()
        
        return {"status": "success", "data": res.data[0]}
    except Exception as e:
        logger.error(f"Error updating education card: {e}")
        raise HTTPException(status_code=500, detail="Error updating education card")
