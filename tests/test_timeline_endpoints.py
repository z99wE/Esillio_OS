import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.api.auth import get_current_user

client = TestClient(app)

def mock_get_current_user():
    return "00000000-0000-0000-0000-000000000000"

@pytest.fixture(autouse=True)
def override_auth():
    app.dependency_overrides[get_current_user] = mock_get_current_user
    yield
    app.dependency_overrides.clear()

def test_get_timeline_diff(monkeypatch):
    # Mock timeline_service.get_timeline_diff
    mock_diff_data = {
        "diffs": [
            {"category": "New", "description": "Lisinopril 10mg started", "event_type": "medication"}
        ]
    }
    monkeypatch.setattr(
        "app.api.timeline.timeline_service.get_timeline_diff",
        lambda user_id, doc_a_id, doc_b_id: mock_diff_data
    )

    response = client.get("/timeline/diff?doc_a_id=123&doc_b_id=456")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "diffs" in data["data"]
    assert len(data["data"]["diffs"]) == 1
    assert data["data"]["diffs"][0]["category"] == "New"

def test_get_condition_summary(monkeypatch):
    # Mock timeline_service.get_condition_summary
    mock_summary_data = {
        "condition": "Hypertension",
        "summary": "Patient has stable hypertension.",
        "timeline": [
            {
                "date": "2023-01-01",
                "description": "Diagnosed with hypertension",
                "citations": [{"document_id": "123", "source_snippet": "BP 150/90"}]
            }
        ]
    }
    monkeypatch.setattr(
        "app.api.timeline.timeline_service.get_condition_summary",
        lambda user_id, condition: mock_summary_data
    )

    response = client.get("/timeline/summary?condition=Hypertension")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["data"]["condition"] == "Hypertension"
    assert "timeline" in data["data"]
    assert data["data"]["timeline"][0]["citations"][0]["document_id"] == "123"
