from fastapi import APIRouter, UploadFile, File, Form, Depends
import csv
import io
import uuid
from datetime import datetime
from app.services.document_service import DocumentService
from app.services.text_extractor import TextExtractor
from app.services.document_parser import DocumentParser
from app.services.clinical_pipeline import pipeline

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

    document = service.save_document(file)

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

    ai_result = pipeline.process(text, patient_id=patient_id)

    ########################################################
    # Unified Response
    ########################################################

    return {

        "status": "success",

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

    }

@router.post("/csv")
async def upload_csv(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    """
    Parse a CSV file (Apple Health or Oura) and save events as biomarkers.
    """
    content = await file.read()
    decoded = content.decode("utf-8")
    reader = csv.DictReader(io.StringIO(decoded))
    
    events_created = 0
    patient_id = current_user.get("id") or "1"
    
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
                
            # Use repository to insert raw event if we had a proper model
            from app.storage.database import database
            cursor = database.connection.cursor()
            
            # Simple insert
            cursor.execute(
                """
                INSERT INTO health_events (id, patient_id, title, category, description, value, timestamp)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    str(uuid.uuid4()),
                    patient_id,
                    key.replace("_", " ").title(),
                    category,
                    f"Imported from {file.filename}",
                    str(value),
                    date_str
                )
            )
            events_created += 1
            
    database.connection.commit()
    
    return {
        "status": "success",
        "events_created": events_created,
        "message": f"Successfully parsed {events_created} wearable entries."
    }