import datetime
import uuid
from app.storage.database import database

def seed_guest_if_needed(guest_id: str = "usr-demo-1"):
    cursor = database.connection.cursor()
    
    # Check if guest user exists
    cursor.execute("SELECT id FROM users WHERE id = ?", (guest_id,))
    if cursor.fetchone():
        return
        
    # Create guest user
    now = datetime.datetime.utcnow().isoformat()
    # using a dummy hash for guest
    dummy_hash = "guest_dummy_hash"
    cursor.execute(
        "INSERT INTO users (id, email, password_hash, created_at) VALUES (?, ?, ?, ?)",
        (guest_id, "guest@esillio.local", dummy_hash, now)
    )
    
    # Seed dummy timeline events for guest
    events = [
        {
            "id": str(uuid.uuid4()),
            "title": "Annual Physical Checkup",
            "category": "Visit",
            "source": "Clinic A",
            "description": "Routine physical examination. Patient reported feeling well. Vitals normal.",
            "timestamp": "2024-01-15T09:00:00",
            "confidence": 0.95
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Lab Results: Blood Panel",
            "category": "Lab",
            "source": "LabCorp",
            "description": "Complete blood count and metabolic panel. Cholesterol slightly elevated.",
            "timestamp": "2024-01-16T14:30:00",
            "confidence": 0.99
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Prescription Refill",
            "category": "Medication",
            "source": "Pharmacy",
            "description": "Lisinopril 10mg refilled for 90 days.",
            "timestamp": "2024-02-01T10:15:00",
            "confidence": 0.99
        }
    ]
    
    for e in events:
        cursor.execute(
            """
            INSERT INTO health_events 
            (id, patient_id, title, category, source, description, timestamp, confidence)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (e["id"], guest_id, e["title"], e["category"], e["source"], e["description"], e["timestamp"], e["confidence"])
        )
        
    database.connection.commit()
