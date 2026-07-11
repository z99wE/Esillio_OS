from fastapi import APIRouter, UploadFile, File

from app.services.document_service import DocumentService

router = APIRouter(
    prefix="/upload",
    tags=["Upload"],
)

service = DocumentService()


@router.post("/")
async def upload_document(file: UploadFile = File(...)):

    document = service.save_document(file)

    return {
        "status": "uploaded",
        "document": document,
    }