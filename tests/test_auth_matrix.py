import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_unauthenticated_access_timeline():
    # Attempt to fetch timeline without auth token
    response = client.get("/timeline/")
    assert response.status_code == 401

def test_forged_token_access_timeline():
    # Attempt to fetch timeline with forged token
    headers = {"Authorization": "Bearer forged_fake_token"}
    response = client.get("/timeline/", headers=headers)
    assert response.status_code == 401

def test_unauthenticated_access_clinical_memory():
    # Attempt to fetch clinical memory without auth token
    response = client.get("/memory/")
    assert response.status_code == 401

def test_unauthenticated_access_settings():
    response = client.get("/settings/ai")
    assert response.status_code == 401

def test_unauthenticated_upload():
    response = client.post("/upload/", files={"file": ("test.pdf", b"test")})
    assert response.status_code == 401
