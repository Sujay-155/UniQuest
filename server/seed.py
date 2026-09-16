import sys
import os

# Ensure the server root is in sys.path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

# Configure stdout for utf-8 on Windows
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

from app.db import get_bootcamps_collection, is_using_mock
from app.models.bootcamp import SAMPLE_BOOTCAMPS, validate_bootcamp

def seed_database():
    """Seed the database with 5 realistic tech bootcamp records."""
    print("[*] Starting database seed for UniQuest...")
    collection = get_bootcamps_collection()

    # Clear existing documents to guarantee clean state
    deleted_count = collection.delete_many({}).deleted_count
    print(f"[*] Cleared {deleted_count} existing records.")

    inserted_records = []
    for bootcamp in SAMPLE_BOOTCAMPS:
        is_valid, err = validate_bootcamp(bootcamp)
        if not is_valid:
            print(f"[!] Validation error for {bootcamp.get('name')}: {err}")
            sys.exit(1)

        result = collection.insert_one(dict(bootcamp))
        inserted_records.append({
            "id": str(result.inserted_id),
            "name": bootcamp["name"],
            "provider": bootcamp["provider"],
            "price_inr": bootcamp["price_inr"],
            "rating": bootcamp["alumni_rating"]
        })

    using_mock = is_using_mock()
    print(f"\n[+] Successfully seeded {len(inserted_records)} bootcamps!")
    print(f"[*] Storage engine: {'mongomock (in-memory)' if using_mock else 'MongoDB live database'}")
    print("\nSeeded Bootcamps:")
    for b in inserted_records:
        print(f"  - [{b['id']}] {b['name']} ({b['provider']}) - INR {b['price_inr']:,} | Rating: {b['rating']}")

if __name__ == "__main__":
    seed_database()
