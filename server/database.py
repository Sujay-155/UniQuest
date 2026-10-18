import os
import json
import logging
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
from dotenv import load_dotenv

from models.bootcamp import SAMPLE_BOOTCAMPS

load_dotenv()

logger = logging.getLogger(__name__)

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("MONGO_DB_NAME", "uniquest_db")

_using_mock = False

try:
    # Fast timeout so local dev never hangs waiting for a MongoDB that isn't running
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=1200)
    client.admin.command("ping")
    logger.info("Connected to live MongoDB at %s", MONGO_URI)
except (ConnectionFailure, ServerSelectionTimeoutError, Exception) as exc:
    logger.warning("Live MongoDB not available (%s). Falling back to in-memory mongomock.", exc)
    import mongomock

    client = mongomock.MongoClient()
    _using_mock = True

db = client[DB_NAME]
universities_collection = db.universities
fests_collection = db.fests
bootcamps_collection = db.bootcamps

SAMPLE_UNIVERSITIES = [
    {
        "name": "University of Delhi",
        "state": "Delhi",
        "university_type": "Central",
        "courses_offered": ["B.A.", "B.Sc.", "B.Com.", "M.A.", "PhD"],
        "official_website": "http://du.ac.in",
        "admission_portal_link": "https://admission.uod.ac.in/",
        "application_deadline": "2026-08-15",
    },
    {
        "name": "Jawaharlal Nehru University",
        "state": "Delhi",
        "university_type": "Central",
        "courses_offered": ["B.A. (Hons.)", "M.A.", "M.Phil", "PhD"],
        "official_website": "https://www.jnu.ac.in",
        "admission_portal_link": "https://jnuee.jnu.ac.in/",
        "application_deadline": "2026-07-20",
    },
    {
        "name": "Indian Institute of Technology Bombay",
        "state": "Maharashtra",
        "university_type": "Central",
        "courses_offered": ["B.Tech", "M.Tech", "MBA", "PhD"],
        "official_website": "https://www.iitb.ac.in",
        "admission_portal_link": "https://www.jeeadv.ac.in/",
        "application_deadline": "2026-06-10",
    },
    {
        "name": "Anna University",
        "state": "Tamil Nadu",
        "university_type": "State",
        "courses_offered": ["B.E.", "B.Tech", "M.E.", "MBA"],
        "official_website": "https://www.annauniv.edu",
        "admission_portal_link": "https://tneaonline.org/",
        "application_deadline": "2026-06-30",
    },
    {
        "name": "Savitribai Phule Pune University",
        "state": "Maharashtra",
        "university_type": "State",
        "courses_offered": ["B.A.", "B.Sc.", "MBA", "M.Sc.", "PhD"],
        "official_website": "http://www.unipune.ac.in",
        "admission_portal_link": "http://www.unipune.ac.in",
        "application_deadline": "2026-07-05",
    },
    {
        "name": "Manipal Academy of Higher Education",
        "state": "Karnataka",
        "university_type": "Deemed",
        "courses_offered": ["MBBS", "B.Tech", "MBA", "PhD"],
        "official_website": "https://manipal.edu",
        "admission_portal_link": "https://manipal.edu/mu/admission.html",
        "application_deadline": "2026-05-31",
    },
    {
        "name": "BITS Pilani",
        "state": "Rajasthan",
        "university_type": "Private",
        "courses_offered": ["B.E.", "M.E.", "MBA", "PhD"],
        "official_website": "https://www.bits-pilani.ac.in",
        "admission_portal_link": "https://www.bitsadmission.com/",
        "application_deadline": "2026-06-15",
    },
    {
        "name": "Amity University",
        "state": "Uttar Pradesh",
        "university_type": "Private",
        "courses_offered": ["BBA", "B.Tech", "MBA", "PhD"],
        "official_website": "https://www.amity.edu",
        "admission_portal_link": "https://www.amity.edu/admission.aspx",
        "application_deadline": "2026-07-31",
    },
    {
        "name": "Gujarat University",
        "state": "Gujarat",
        "university_type": "State",
        "courses_offered": ["B.A.", "B.Com.", "LLB", "M.Sc."],
        "official_website": "https://www.gujaratuniversity.ac.in",
        "admission_portal_link": "https://www.gujaratuniversity.ac.in",
        "application_deadline": "2026-07-10",
    },
]


DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
UNIVERSITIES_CRAWL_PATH = os.path.join(DATA_DIR, "state_universities.json")
FESTS_CRAWL_PATH = os.path.join(DATA_DIR, "college_fests.json")

SAMPLE_FESTS = [
    {
        "name": "Mood Indigo",
        "host_institution": "IIT Bombay",
        "state": "Maharashtra",
        "location": "Mumbai",
        "festival_type": "Cultural",
        "first_held": 1971,
        "official_website": None,
        "data_source": "demo fallback",
    },
    {
        "name": "Techfest",
        "host_institution": "IIT Bombay",
        "state": "Maharashtra",
        "location": "Mumbai",
        "festival_type": "Technical",
        "first_held": 1998,
        "official_website": None,
        "data_source": "demo fallback",
    },
    {
        "name": "Rendezvous",
        "host_institution": "IIT Delhi",
        "state": "Delhi",
        "location": "New Delhi",
        "festival_type": "Cultural",
        "first_held": 1976,
        "official_website": None,
        "data_source": "demo fallback",
    },
]


def is_using_mock() -> bool:
    return _using_mock


def _load_json_seed(crawl_path: str | None, demo_fallback: list, label: str) -> list:
    """Prefer real crawled data over the small hand-written demo list, which
    only exists as a bootstrap fallback when no crawl has been run yet."""
    if crawl_path and os.path.exists(crawl_path):
        try:
            with open(crawl_path, "r", encoding="utf-8") as f:
                crawled = json.load(f)
            if crawled:
                logger.info("Using %d crawled %s records from %s", len(crawled), label, crawl_path)
                return crawled
        except (json.JSONDecodeError, OSError) as exc:
            logger.warning("Could not read crawled %s data at %s (%s); using demo fallback.", label, crawl_path, exc)

    logger.info("No crawled %s data found; seeding the small built-in demo list instead.", label)
    return demo_fallback


def _seed_collection_if_empty(collection, crawl_path: str | None, demo_fallback: list, label: str) -> None:
    if collection.count_documents({}) == 0:
        seed_data = _load_json_seed(crawl_path, demo_fallback, label)
        collection.insert_many([dict(item) for item in seed_data])
        logger.info("Seeded %d %s into %s database.", len(seed_data), label, "mock" if _using_mock else "live")


_seed_collection_if_empty(universities_collection, UNIVERSITIES_CRAWL_PATH, SAMPLE_UNIVERSITIES, "universities")
_seed_collection_if_empty(fests_collection, FESTS_CRAWL_PATH, SAMPLE_FESTS, "fests")
_seed_collection_if_empty(bootcamps_collection, None, SAMPLE_BOOTCAMPS, "bootcamps")
