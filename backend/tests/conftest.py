# tests/conftest.py
import pytest
from fastapi.testclient import TestClient
from app.main import app

@pytest.fixture
def client(monkeypatch):
    # mock JWT middleware，讓所有請求都有 user
    async def fake_current_user(request=None):
        return {"user_id": "test-user", "email": "test@example.com"}
    monkeypatch.setattr("app.deps.get_current_user", fake_current_user)

    # mock BedrockService 內 methods
    from app.core.bedrock_service import BedrockService
    class DummyService:
        def classify_trash(self, b64): return {"category": "Recyclable", "sub_category": "Plastic Bottle"}
        def verify_disposal(self, b64): return {"passed": True, "reason": "正確丟棄"}
    monkeypatch.setattr("app.api.trash.bedrock", DummyService())

    return TestClient(app)
