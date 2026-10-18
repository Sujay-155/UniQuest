import re
from typing import List, Optional

from bson import ObjectId
from fastapi import APIRouter, Query

from database import bootcamps_collection
from models.bootcamp import Bootcamp, BootcampsResponse, BootcampDetailResponse, ComparisonResponse, ComparisonMetrics

router = APIRouter()


def serialize_bootcamp(doc: dict) -> dict:
    doc = dict(doc)
    doc["id"] = str(doc.pop("_id"))
    return doc


def find_bootcamp_by_id(bootcamp_id: str) -> Optional[dict]:
    try:
        obj_id = ObjectId(bootcamp_id)
    except Exception:
        return None
    doc = bootcamps_collection.find_one({"_id": obj_id})
    return serialize_bootcamp(doc) if doc else None


@router.get("", response_model=BootcampsResponse)
def get_bootcamps(
    tech_stack: Optional[str] = Query(None, description="Comma-separated technologies, must all be present"),
    placement_guarantee: Optional[bool] = Query(None),
    isa_available: Optional[bool] = Query(None),
    max_price: Optional[int] = Query(None),
    search: Optional[str] = Query(None, description="Keyword search in name and provider"),
    sort_by: str = Query("rating_desc", description="rating_desc, rating_asc, price_asc, price_desc"),
):
    filter_query: dict = {}

    if tech_stack:
        tech_filters = [t.strip() for t in tech_stack.split(",") if t.strip()]
        if tech_filters:
            filter_query["$and"] = [
                {"tech_stack": {"$regex": f"^{re.escape(t)}$", "$options": "i"}} for t in tech_filters
            ]

    if placement_guarantee is not None:
        filter_query["placement_guarantee"] = placement_guarantee

    if isa_available is not None:
        filter_query["isa_available"] = isa_available

    if max_price is not None:
        filter_query["price_inr"] = {"$lte": max_price}

    if search:
        pattern = re.escape(search.strip())
        search_condition = {
            "$or": [
                {"name": {"$regex": pattern, "$options": "i"}},
                {"provider": {"$regex": pattern, "$options": "i"}},
                {"tech_stack": {"$elemMatch": {"$regex": pattern, "$options": "i"}}},
            ]
        }
        if "$and" in filter_query:
            filter_query["$and"].append(search_condition)
        else:
            filter_query.update(search_condition)

    cursor = bootcamps_collection.find(filter_query)

    sort_map = {
        "rating_desc": ("alumni_rating", -1),
        "rating_asc": ("alumni_rating", 1),
        "price_asc": ("price_inr", 1),
        "price_desc": ("price_inr", -1),
    }
    if sort_by in sort_map:
        field, direction = sort_map[sort_by]
        cursor = cursor.sort(field, direction)

    bootcamps = [serialize_bootcamp(doc) for doc in cursor]
    return {"success": True, "count": len(bootcamps), "data": bootcamps}


@router.get("/compare", response_model=ComparisonResponse)
def compare_bootcamps(
    b1: str = Query(..., description="First bootcamp id"),
    b2: str = Query(..., description="Second bootcamp id"),
):
    bootcamp1 = find_bootcamp_by_id(b1)
    if not bootcamp1:
        return {"success": False, "error": f"Bootcamp with ID '{b1}' not found"}

    bootcamp2 = find_bootcamp_by_id(b2)
    if not bootcamp2:
        return {"success": False, "error": f"Bootcamp with ID '{b2}' not found"}

    stack1 = set(bootcamp1.get("tech_stack", []))
    stack2 = set(bootcamp2.get("tech_stack", []))
    price1 = bootcamp1.get("price_inr", 0)
    price2 = bootcamp2.get("price_inr", 0)
    rating1 = bootcamp1.get("alumni_rating", 0.0)
    rating2 = bootcamp2.get("alumni_rating", 0.0)

    comparison = ComparisonMetrics(
        price_difference_inr=abs(price1 - price2),
        cheaper_bootcamp_id=bootcamp1["id"] if price1 <= price2 else bootcamp2["id"],
        rating_difference=round(abs(rating1 - rating2), 2),
        higher_rated_bootcamp_id=bootcamp1["id"] if rating1 >= rating2 else bootcamp2["id"],
        common_technologies=sorted(stack1 & stack2),
        unique_to_b1=sorted(stack1 - stack2),
        unique_to_b2=sorted(stack2 - stack1),
    )

    return {
        "success": True,
        "bootcamps": (Bootcamp(**bootcamp1), Bootcamp(**bootcamp2)),
        "comparison": comparison,
    }


@router.get("/{bootcamp_id}", response_model=BootcampDetailResponse)
def get_bootcamp_by_id(bootcamp_id: str):
    bootcamp = find_bootcamp_by_id(bootcamp_id)
    if not bootcamp:
        return {"success": False, "error": f"Bootcamp with ID '{bootcamp_id}' not found"}
    return {"success": True, "data": bootcamp}
