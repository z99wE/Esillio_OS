import uuid
from app.storage.supabase_client import supabase

def seed_guest_if_needed(guest_id: str = "00000000-0000-4000-a000-000000000000"):
    if not supabase:
        return
        
    # Check if guest user already has events
    response = supabase.table("health_events").select("id").eq("patient_id", guest_id).limit(1).execute()
    if response.data and len(response.data) > 0:
        return
        
    # Seed dummy timeline events for guest
    events = [
        {
            "id": str(uuid.uuid4()),
            "patient_id": guest_id,
            "title": "Annual Physical Checkup",
            "category": "Visit",
            "source": "Clinic A",
            "description": "Routine physical examination. Patient reported feeling well. Vitals normal.",
            "timestamp": "2024-01-15T09:00:00",
            "confidence": 0.95
        },
        {
            "id": str(uuid.uuid4()),
            "patient_id": guest_id,
            "title": "Lab Results: Blood Panel",
            "category": "Lab",
            "source": "LabCorp",
            "description": "Complete blood count and metabolic panel. Cholesterol slightly elevated.",
            "timestamp": "2024-01-16T14:30:00",
            "confidence": 0.99
        },
        {
            "id": str(uuid.uuid4()),
            "patient_id": guest_id,
            "title": "Prescription Refill",
            "category": "Medication",
            "source": "Pharmacy",
            "description": "Lisinopril 10mg refilled for 90 days.",
            "timestamp": "2024-02-01T10:15:00",
            "confidence": 0.99
        }
    ]
    
    supabase.table("health_events").insert(events).execute()

