import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.api.auth import get_current_user
from tests.conftest import requires_supabase

client = TestClient(app)

def test_waitlist_contract():
    response = client.post("/api/admin/waitlist", json={"email": "test@investor.com"})
    assert response.status_code == 200
    assert response.json()["status"] == "success"

def test_admin_metrics_unauthorized():
    # Attempting to access admin metrics without token/auth
    response = client.get("/api/admin/metrics")
    assert response.status_code == 401

@requires_supabase
def test_admin_metrics_authorized_but_not_admin():
    # Attempting to access admin metrics with non-admin token
    app.dependency_overrides[get_current_user] = lambda: "00000000-0000-4000-a000-000000000000"
    try:
        response = client.get("/api/admin/metrics")
        assert response.status_code == 403
    finally:
        app.dependency_overrides.clear()
