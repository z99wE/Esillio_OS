import os
import uuid
import shutil

UPLOAD_FOLDER = "app/uploads"


class DocumentService:

    def save_document(self, file):

        os.makedirs(UPLOAD_FOLDER, exist_ok=True)

        extension = file.filename.split(".")[-1]

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