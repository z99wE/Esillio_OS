import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check_contract():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert "database" in data
    assert "ai_provider" in data
    assert "ai_ready" in data

def test_timeline_invalid_input_contract():
    # Attempting to post to timeline with invalid schema
    # The API should return 422 Unprocessable Entity
    headers = {"Authorization": "Bearer guest-token-123"}
    response = client.post(
        "/events/",
        headers=headers,
        json={"invalid_field": "data"}
    )
    assert response.status_code == 422
    assert "detail" in response.json()

def test_auth_invalid_input_contract():
    from app.api.auth import get_current_user
    app.dependency_overrides[get_current_user] = lambda: "00000000-0000-0000-0000-000000000000"
    try:
        # Attempting to post invalid AI configuration
        response = client.post(
            "/settings/ai",
            json={"email": "missing_password@example.com"}
        )
        assert response.status_code == 422
        assert "detail" in response.json()
    finally:
        app.dependency_overrides.clear()
