from fastapi import APIRouter, UploadFile, File

from app.services.document_service import DocumentService
from app.services.text_extractor import TextExtractor
from app.services.document_parser import DocumentParser
from app.storage.repository import repository

router = APIRouter(
    prefix="/upload",
    tags=["Upload"],
)

service = DocumentService()
extractor = TextExtractor()
parser = DocumentParser()


@router.post("/")
async def upload_document(file: UploadFile = File(...)):

    # Save uploaded document
    document = service.save_document(file)

    # Extract text
    text = extractor.extract(document["path"])

    # Convert text into health events
    events = parser.parse(text)

    # Store events in SQLite
    for event in events:
        repository.create_event(event)

    return {
        "status": "uploaded",
        "document": document,
        "events_created": len(events),
        "events": [
            {
                "title": event.title,
                "category": event.category,
                "confidence": event.confidence,
            }
            for event in events
        ],
    }