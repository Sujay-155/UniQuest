from fastapi import APIRouter, Query
from typing import List, Optional
from database import fests_collection
from models.fest import Fest

router = APIRouter()


@router.get("", response_model=List[Fest])
def get_fests(
    state: Optional[str] = Query(None, description="Filter by Indian State"),
    festival_type: Optional[str] = Query(None, description="Filter by festival type (Cultural, Technical, Sports)"),
    institution: Optional[str] = Query(None, description="Filter by host institution name"),
):
    query = {}

    if state:
        query["state"] = {"$regex": f"^{state}$", "$options": "i"}
    if festival_type:
        query["festival_type"] = {"$regex": festival_type, "$options": "i"}
    if institution:
        query["host_institution"] = {"$regex": institution, "$options": "i"}

    cursor = fests_collection.find(query)

    fests = []
    for doc in cursor:
        doc.pop("_id", None)
        fests.append(Fest(**doc))

    return fests


@router.get("/states", response_model=List[str])
def get_fest_states():
    return fests_collection.distinct("state")
