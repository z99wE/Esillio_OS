from fastapi import APIRouter, UploadFile, File, Form, Depends

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

        "clinical_intelligence": ai_result,

    }