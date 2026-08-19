import logging
from typing import List, Dict, Any
from app.storage.supabase_client import supabase
from app.config import settings
import openai

logger = logging.getLogger(__name__)

class TimelineService:
    def __init__(self):
        self.settings = settings
        if self.settings.OPENAI_API_KEY:
            self.openai_client = openai.Client(api_key=self.settings.OPENAI_API_KEY)
        else:
            self.openai_client = None

    def _get_embedding(self, text: str) -> List[float]:
        if not self.openai_client:
            return None
        try:
            response = self.openai_client.embeddings.create(
                input=text,
                model="text-embedding-3-small"
            )
            return response.data[0].embedding
        except Exception as e:
            logger.error(f"Embedding generation failed: {e}")
            return None

    def save_timeline_events(self, patient_id: str, document_id: str, events: List[Dict[str, Any]]):
        if not supabase:
            logger.warning("Supabase client not initialized, skipping timeline saving.")
            return

        for event in events:
            try:
                # Prepare event data
                event_data = {
                    "patient_id": patient_id,
                    "document_id": document_id,
                    "event_date": event.get("event_date"),
                    "event_type": event.get("event_type", "note"),
                    "title": event.get("title", "Clinical Event"),
                    "clinical_data": event.get("clinical_data", {})
                }

                # Generate semantic embedding based on title and data
                embedding_text = f"{event_data['title']}: {event_data['clinical_data']} (Type: {event_data['event_type']})"
                embedding = self._get_embedding(embedding_text)
                if embedding:
                    event_data["embedding"] = embedding

                # Insert timeline event
                res = supabase.table("timeline_events").insert(event_data).execute()
                if res.data:
                    event_id = res.data[0]["id"]
                    
                    # Insert insight provenance
                    provenance_data = {
                        "event_id": event_id,
                        "document_id": document_id,
                        "source_snippet": event.get("source_snippet", ""),
                        "confidence_score": event.get("confidence_score", 1.0)
                    }
                    supabase.table("insight_provenance").insert(provenance_data).execute()

            except Exception as e:
                logger.exception(f"Failed to save timeline event: {e}")

    def get_patient_timeline(self, patient_id: str):
        if not supabase:
            return []
        
        try:
            res = supabase.table("timeline_events")\
                .select("*, insight_provenance(*)")\
                .eq("patient_id", patient_id)\
                .order("event_date", desc=True)\
                .execute()
            return res.data
        except Exception as e:
            logger.error(f"Failed to fetch timeline: {e}")
            return []

timeline_service = TimelineService()
