import uuid
import mimetypes
from app.config import settings
from app.storage.supabase_client import supabase

ALLOWED_EXTENSIONS = {"pdf", "png", "jpg", "jpeg", "txt", "csv"}
BUCKET_NAME = "esillio_documents"

class DocumentService:

    def save_document(self, file, patient_id: str):
        if not supabase:
            raise ValueError("Supabase client is not initialized")

        file_size = getattr(file, "size", None)
        if file_size is not None:
            max_bytes = settings.MAX_UPLOAD_MB * 1024 * 1024
            if file_size > max_bytes:
                raise ValueError(f"File too large. Max allowed is {settings.MAX_UPLOAD_MB} MB.")

        extension = file.filename.split(".")[-1].lower()
        if extension not in ALLOWED_EXTENSIONS:
            raise ValueError("Unsupported file type")

        # Determine mime type
        content_type, _ = mimetypes.guess_type(file.filename)
        if not content_type:
            content_type = "application/octet-stream"

        filename = f"{uuid.uuid4()}.{extension}"
        # path is namespaced by patient_id
        path_in_bucket = f"{patient_id}/{filename}"
        
        # Read file bytes
        file_bytes = file.file.read()

        try:
            # Upload to Supabase Storage
            _ = supabase.storage.from_(BUCKET_NAME).upload(
                file=file_bytes,
                path=path_in_bucket,
                file_options={"content-type": content_type}
            )
            
            # The Supabase URL can be constructed or requested
            # Get the public or signed URL if needed, but usually we just store the path
            
            # Insert into database to get a document_id
            doc_data = {
                "patient_id": patient_id,
                "file_name": file.filename,
                "file_path": path_in_bucket,
                "file_size_bytes": file_size,
                "content_type": content_type
            }
            db_res = supabase.table("documents").insert(doc_data).execute()
            doc_id = None
            if db_res.data:
                doc_id = db_res.data[0]["id"]

            return {
                "id": doc_id,
                "filename": filename,
                "path": path_in_bucket,
                "bucket": BUCKET_NAME
            }
        except Exception as e:
            raise ValueError(f"Failed to upload to Supabase: {str(e)}")

