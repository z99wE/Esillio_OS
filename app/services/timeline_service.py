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

    def get_timeline_diff(self, patient_id: str, doc_a_id: str, doc_b_id: str) -> Dict[str, Any]:
        if not supabase:
            return {"diffs": []}
            
        try:
            # Fetch events for both documents
            res_a = supabase.table("timeline_events").select("*").eq("patient_id", patient_id).eq("document_id", doc_a_id).execute()
            res_b = supabase.table("timeline_events").select("*").eq("patient_id", patient_id).eq("document_id", doc_b_id).execute()
            
            events_a = res_a.data
            events_b = res_b.data
            
            from app.runtime.capabilities.clinical_diff import ClinicalDiffCapability
            diff_cap = ClinicalDiffCapability()
            return diff_cap.run(events_a, events_b)
        except Exception as e:
            logger.error(f"Failed to generate timeline diff: {e}")
            return {"diffs": []}

    def get_condition_summary(self, patient_id: str, condition: str) -> Dict[str, Any]:
        if not supabase:
            return {}
            
        try:
            # Generate embedding for the condition
            condition_embedding = self._get_embedding(condition)
            if not condition_embedding:
                return {}
                
            # Perform vector search using the match_timeline_events RPC function
            # We assume threshold 0.75 and max 20 events
            res = supabase.rpc(
                "match_timeline_events",
                {
                    "query_embedding": condition_embedding,
                    "match_threshold": 0.75,
                    "match_count": 20,
                    "p_id": patient_id
                }
            ).execute()
            
            related_events = res.data
            
            if not related_events:
                return {
                    "condition": condition,
                    "summary": "No related clinical history found.",
                    "timeline": []
                }
            
            # For each event, fetch its provenance
            event_ids = [evt["id"] for evt in related_events]
            prov_res = supabase.table("insight_provenance").select("*").in_("event_id", event_ids).execute()
            
            # Map provenance back to events
            prov_map = {}
            for prov in prov_res.data:
                if prov["event_id"] not in prov_map:
                    prov_map[prov["event_id"]] = []
                prov_map[prov["event_id"]].append(prov)
                
            for evt in related_events:
                evt["insight_provenance"] = prov_map.get(evt["id"], [])
            
            from app.runtime.capabilities.condition_summary import ConditionSummaryCapability
            summary_cap = ConditionSummaryCapability()
            return summary_cap.run(condition, related_events)
        except Exception as e:
            logger.error(f"Failed to generate condition summary: {e}")
            return {}

timeline_service = TimelineService()
