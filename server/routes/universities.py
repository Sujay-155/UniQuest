from fastapi import APIRouter, Query
from typing import List, Optional
from database import universities_collection
from models.university import University

router = APIRouter()

@router.get("", response_model=List[University])
def get_universities(
    state: Optional[str] = Query(None, description="Filter by Indian State"),
    university_type: Optional[str] = Query(None, description="Filter by University Type (State, Central, Private)"),
    course: Optional[str] = Query(None, description="Filter by a specific course offered")
):
    query = {}
    
    if state:
        # Case insensitive exact match or regex
        query["state"] = {"$regex": f"^{state}$", "$options": "i"}
    if university_type:
        query["university_type"] = {"$regex": f"^{university_type}$", "$options": "i"}
    if course:
        query["courses_offered"] = {"$regex": course, "$options": "i"}
        
    cursor = universities_collection.find(query)
    
    universities = []
    for doc in cursor:
        doc.pop("_id", None) # Remove ObjectId since it's not strictly required in the Pydantic model for display
        universities.append(University(**doc))
        
    return universities

@router.get("/states", response_model=List[str])
def get_states():
    # Return distinct states available in the DB
    return universities_collection.distinct("state")

