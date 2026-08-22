"""
Phase 11 contract tests: data export and account deletion endpoints.
"""
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.api.auth import get_current_user
from tests.conftest import requires_supabase

client = TestClient(app)

# ── Helpers ────────────────────────────────────────────────────────────────

VALID_USER_ID = "00000000-0000-4000-a000-000000000000"


def _auth_override():
    """Return a valid UUID so Supabase doesn't reject the query."""
    return VALID_USER_ID


# ── Data Export ────────────────────────────────────────────────────────────


def test_export_my_data_unauthenticated():
    """Unauthenticated request must be rejected."""
    response = client.get("/api/export/my-data")
    assert response.status_code == 401


@requires_supabase
def test_export_my_data_authenticated():
    """Authenticated request must return a 200 JSON payload with the required keys."""
    app.dependency_overrides[get_current_user] = _auth_override
    try:
        response = client.get("/api/export/my-data")
        assert response.status_code == 200
        body = response.json()
        assert "exported_at" in body
        assert "user_id" in body
        assert "health_events" in body
        assert "profile" in body
        assert body["user_id"] == VALID_USER_ID
    finally:
        app.dependency_overrides.clear()


@requires_supabase
def test_export_my_data_content_disposition():
    """Response must include a Content-Disposition header for download."""
    app.dependency_overrides[get_current_user] = _auth_override
    try:
        response = client.get("/api/export/my-data")
        assert "content-disposition" in response.headers
        assert "attachment" in response.headers["content-disposition"]
    finally:
        app.dependency_overrides.clear()


# ── Account Deletion ───────────────────────────────────────────────────────


def test_delete_account_unauthenticated():
    """Unauthenticated DELETE must be rejected."""
    response = client.delete("/api/export/delete-account")
    assert response.status_code == 401


@requires_supabase
def test_delete_account_authenticated():
    """
    Authenticated DELETE must complete without a 5xx error.
    It may return 200 (if the test user has rows) or 200 with empty deletes — both are acceptable.
    A 500 would indicate a coding bug.
    """
    app.dependency_overrides[get_current_user] = _auth_override
    try:
        response = client.delete("/api/export/delete-account")
        # Must not be a server error
        assert response.status_code < 500
        if response.status_code == 200:
            body = response.json()
            assert body.get("status") == "deleted"
    finally:
        app.dependency_overrides.clear()
