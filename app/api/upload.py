from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
import csv
import io
import uuid
from datetime import datetime
from app.services.document_service import DocumentService
from app.services.text_extractor import TextExtractor
from app.services.document_parser import DocumentParser
from app.services.clinical_pipeline import pipeline
from app.services.usage_service import usage_service

from app.storage.repository import repository
from app.api.auth import get_current_user

router = APIRouter(
    prefix="/upload",
    tags=["Upload"],
)

service = DocumentService()

extractor = TextExtractor()

parser = DocumentParser()


@router.post("/")
async def upload_document(
    file: UploadFile = File(...),
    patient_id: str = Depends(get_current_user)
):
    """
    Upload a medical document and process it through
    the complete Esillio Clinical Intelligence Pipeline.
    """

    ########################################################
    # Save uploaded document
    ########################################################

    try:
        document = service.save_document(file, patient_id)
        
        # Log the upload action
        from app.services.audit_service import audit_service
        audit_service.log_action(
            user_id=patient_id,
            action="upload_document",
            resource_type="document",
            resource_id=document["filename"],
            metadata={"filename": file.filename, "size": getattr(file, "size", 0)}
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    ########################################################
    # Extract text
    ########################################################

    text = extractor.extract(
        document["path"]
    )

    ########################################################
    # Timeline Extraction
    ########################################################

    events = parser.parse(text)

    for event in events:

        repository.create_event(event, patient_id=patient_id)

    ########################################################
    # Clinical Intelligence Pipeline
    ########################################################

    ai_result = {}
    usage = usage_service.consume(
        user_id=patient_id,
        action="upload_document",
        credits=1,
        metadata={
            "filename": file.filename,
            "document_id": document["filename"],
        },
    )

    if usage["ok"]:
        ai_result = pipeline.process(text, patient_id=patient_id)
    else:
        ai_result = {
            "pipeline_status": "budget_limited",
            "errors": ["Daily usage limit reached. Document saved, extraction only."],
            "medical_extraction": {
                "summary": "Document saved successfully. AI processing is temporarily limited by your daily quota.",
            },
            "clinical_reasoning": {},
            "wellness": {},
            "guardian": {},
            "clinical_memory": {},
        }

    ########################################################
    # Unified Response
    ########################################################

    return {

        "status": "success",
        "usage": usage["usage"],

        "document": document,

        "timeline": {

            "events_created": len(events),

            "events": [

                {

                    "title": event.title,

                    "category": event.category,

                    "confidence": event.confidence,

                }

                for event in events

            ],

        },

        "clinical_intelligence": ai_result,

    }

@router.post("/csv")
async def upload_csv(
    file: UploadFile = File(...),
    user_id: str = Depends(get_current_user)
):
    """
    Parse a CSV file (Apple Health or Oura) and save events as biomarkers.
    """
    content = await file.read()
    decoded = content.decode("utf-8")
    reader = csv.DictReader(io.StringIO(decoded))
    
    events_created = 0
    patient_id = user_id
    
    for row in reader:
        # Simple heuristic mapping for CSV rows
        date_str = row.get("date") or row.get("timestamp") or datetime.now().isoformat()
        
        for key, value in row.items():
            key_lower = key.lower()
            if key_lower in ["date", "timestamp", "time"]:
                continue
                
            if not value or str(value).strip() == "":
                continue
                
            category = "biomarker"
            if any(term in key_lower for term in ["sleep", "steps", "activity", "calorie"]):
                category = "lifestyle"
                
            # Use supabase to insert raw event
            from app.storage.supabase_client import supabase
            if supabase:
                data = {
                    "id": str(uuid.uuid4()),
                    "patient_id": patient_id,
                    "title": key.replace("_", " ").title(),
                    "category": category,
                    "description": f"Imported from {file.filename}. Value: {str(value)}",
                    "timestamp": date_str
                }
                supabase.table("health_events").insert(data).execute()
                events_created += 1
    
    return {
        "status": "success",
        "events_created": events_created,
        "message": f"Successfully parsed {events_created} wearable entries."
    }
