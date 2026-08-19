import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.api.auth import get_current_user

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["product"] == "Esillio OS"
    assert response.json()["status"] == "running"

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_export_clinician_unauthorized():
    # Verify that the export route correctly enforces authentication
    response = client.get("/api/export/clinician")
    assert response.status_code == 401

from unittest.mock import patch

def test_export_clinician_authorized():
    # Mock the dependency to simulate a logged-in user
    app.dependency_overrides[get_current_user] = lambda: "00000000-0000-0000-0000-000000000000"
    
    with patch("app.api.export.supabase") as mock_supabase, \
         patch("app.api.export.audit_service") as mock_audit:
        # Create a fake response with empty data
        class FakeResponse:
            data = []
        
        mock_supabase.table().select().eq().order().execute.return_value = FakeResponse()
        
        response = client.get("/api/export/clinician")
    assert response.status_code == 200
    data = response.json()
    assert "patient" in data
    assert "summary" in data
    assert "timeline" in data
    app.dependency_overrides.clear()
