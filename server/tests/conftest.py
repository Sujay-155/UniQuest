import pytest
import mongomock
from app import create_app
from app.models.bootcamp import SAMPLE_BOOTCAMPS

@pytest.fixture
def app_instance(monkeypatch):
    """Create and configure a test Flask app using a fresh in-memory mongomock database."""
    mock_client = mongomock.MongoClient()
    test_db = mock_client["uniquest_test"]

    # Patch get_db to use test database
    import app.db
    monkeypatch.setattr(app.db, "get_db", lambda: test_db)
    monkeypatch.setattr(app.db, "_db", test_db)
    monkeypatch.setattr(app.db, "_client", mock_client)

    app = create_app({"TESTING": True})
    
    # Ensure fresh test data
    col = test_db["bootcamps"]
    col.delete_many({})
    col.insert_many([dict(b) for b in SAMPLE_BOOTCAMPS])

    yield app

@pytest.fixture
def client(app_instance):
    """A test client for the app."""
    return app_instance.test_client()
