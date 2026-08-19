from app.storage.supabase_client import supabase

class Repository:
    def create_event(self, event, patient_id="00000000-0000-4000-a000-000000000000"):
        if not supabase:
            return
            
        data = {
            "id": event.id,
            "patient_id": patient_id,
            "title": event.title,
            "category": event.category,
            "source": event.source,
            "description": event.description,
            "timestamp": event.timestamp.isoformat(),
            "confidence": event.confidence
        }
        
        supabase.table("health_events").insert(data).execute()

    def list_events(self, patient_id="00000000-0000-4000-a000-000000000000"):
        if not supabase:
            return []
            
        response = supabase.table("health_events").select("*").eq("patient_id", patient_id).order("timestamp", desc=True).execute()
        return response.data

repository = Repository()
