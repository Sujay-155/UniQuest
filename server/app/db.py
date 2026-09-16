import os
import logging
from bson import ObjectId
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError

logger = logging.getLogger(__name__)

_client = None
_db = None
_using_mock = False

def serialize_doc(doc):
    """Convert MongoDB document to a JSON-serializable dict with 'id' field."""
    if not doc:
        return None
    doc = dict(doc)
    if "_id" in doc:
        doc["id"] = str(doc["_id"])
        del doc["_id"]
    return doc

def get_db():
    """
    Get or initialize the MongoDB database connection.
    Attempts connection to MONGO_URI. If MongoDB is unreachable,
    falls back transparently to mongomock for reliable local development and testing.
    """
    global _client, _db, _using_mock
    if _db is not None:
        return _db

    mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/uniquest")
    db_name = os.getenv("MONGO_DB_NAME", "uniquest")

    try:
        # Fast timeout to check if real MongoDB is reachable
        client = MongoClient(mongo_uri, serverSelectionTimeoutMS=1200)
        client.admin.command('ping')
        _client = client
        _db = client[db_name]
        _using_mock = False
        logger.info("Successfully connected to live MongoDB at %s", mongo_uri)
    except (ConnectionFailure, ServerSelectionTimeoutError, Exception) as e:
        logger.warning(
            "Live MongoDB not available (%s). Initializing resilient mongomock in-memory database.", e
        )
        import mongomock
        _client = mongomock.MongoClient()
        _db = _client[db_name]
        _using_mock = True

    return _db

def is_using_mock():
    return _using_mock

def get_bootcamps_collection():
    db = get_db()
    return db["bootcamps"]

def parse_object_id(id_str):
    """Safely parse ObjectId or return string if invalid."""
    try:
        return ObjectId(id_str)
    except Exception:
        return None
