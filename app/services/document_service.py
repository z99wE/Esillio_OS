import os
import uuid
import shutil
from app.config import settings

UPLOAD_FOLDER = "app/uploads"
ALLOWED_EXTENSIONS = {"pdf", "png", "jpg", "jpeg", "txt", "csv"}


class DocumentService:

    def save_document(self, file):

        os.makedirs(UPLOAD_FOLDER, exist_ok=True)

        file_size = getattr(file, "size", None)
        if file_size is not None:
            max_bytes = settings.MAX_UPLOAD_MB * 1024 * 1024
            if file_size > max_bytes:
                raise ValueError(f"File too large. Max allowed is {settings.MAX_UPLOAD_MB} MB.")

        extension = file.filename.split(".")[-1].lower()
        if extension not in ALLOWED_EXTENSIONS:
            raise ValueError("Unsupported file type")

        filename = f"{uuid.uuid4()}.{extension}"

        filepath = os.path.join(
            UPLOAD_FOLDER,
            filename,
        )

        with open(filepath, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        return {
            "filename": filename,
            "path": filepath,
        }
