"""
Regression tests for API fixes:
- tasks endpoints must treat the current user as a string id (not user["id"])
- task status validation must surface 400, not be swallowed into 500
- shares list endpoint must return the granted/received shape
"""
from unittest.mock import patch

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.api.auth import get_current_user

client = TestClient(app)

GUEST = "00000000-0000-4000-a000-000000000000"


class FakeResponse:
    def __init__(self, data=None):
        self.data = data or []


@pytest.fixture()
def guest_user():
    app.dependency_overrides[get_current_user] = lambda: GUEST
    yield
    app.dependency_overrides.clear()


def test_get_tasks_with_string_user_id(guest_user):
    """Regression: get_current_user returns a string; user["id"] raised TypeError."""
    with patch("app.api.tasks.supabase") as mock_supabase:
        table = mock_supabase.table.return_value
        eq_chain = table.select.return_value.eq.return_value
        eq_chain.execute.return_value = FakeResponse()
        eq_chain.order.return_value.execute.return_value = FakeResponse()
        response = client.get("/api/tasks/")
    assert response.status_code == 200
    assert response.json() == []


def test_update_task_invalid_status_is_400_not_500(guest_user):
    """Regression: HTTPException(400) was re-wrapped by a blanket except into 500."""
    with patch("app.api.tasks.supabase"):
        response = client.patch(
            f"/api/tasks/{GUEST}", json={"status": "done"}
        )
    assert response.status_code == 400


def test_shares_list_shape(guest_user):
    """Regression: the profiles(email) embed requires an FK from patient_shares."""
    with patch("app.api.shares.supabase") as mock_supabase:
        table = mock_supabase.table.return_value
        table.select.return_value.eq.return_value.execute.return_value = FakeResponse()
        table.select.return_value.execute.return_value = FakeResponse()
        response = client.get("/api/shares")
    assert response.status_code == 200
    body = response.json()
    assert set(body.keys()) == {"granted_patient_shares", "received_patient_shares"}
