import re
from flask import Blueprint, request, jsonify
from app.db import get_bootcamps_collection, serialize_doc, parse_object_id
from app.models.bootcamp import validate_bootcamp

bootcamps_bp = Blueprint("bootcamps", __name__)

def find_bootcamp_by_id(bootcamp_id):
    """Find a bootcamp by ObjectId or string representation."""
    collection = get_bootcamps_collection()
    obj_id = parse_object_id(bootcamp_id)
    query = {"_id": obj_id} if obj_id else {"_id": bootcamp_id}
    doc = collection.find_one(query)
    return serialize_doc(doc)

@bootcamps_bp.route("", methods=["GET"])
@bootcamps_bp.route("/", methods=["GET"])
def get_bootcamps():
    """
    Fetch all bootcamps with optional filtering.
    Supported query parameters:
    - tech_stack: Filter by technology (single, comma-separated, or repeated param, case-insensitive)
    - placement_guarantee: Filter by 'true' or 'false'
    - isa_available: Filter by 'true' or 'false'
    - max_price: Filter bootcamps with price_inr <= max_price
    - search: Keyword search in name and provider
    - sort_by: 'rating_desc', 'rating_asc', 'price_asc', 'price_desc'
    """
    collection = get_bootcamps_collection()
    filter_query = {}

    # 1. Tech stack filtering
    raw_stacks = request.args.getlist("tech_stack")
    if not raw_stacks and "tech_stack" in request.args:
        raw_stacks = request.args.get("tech_stack", "").split(",")

    tech_filters = []
    for item in raw_stacks:
        for sub in item.split(","):
            cleaned = sub.strip()
            if cleaned:
                tech_filters.append(cleaned)

    if tech_filters:
        # Match documents where tech_stack contains all requested technologies (case-insensitive)
        filter_query["$and"] = [
            {"tech_stack": {"$regex": f"^{re.escape(t)}$", "$options": "i"}}
            for t in tech_filters
        ]

    # 2. Placement guarantee filter
    placement_param = request.args.get("placement_guarantee")
    if placement_param is not None:
        if placement_param.lower() in ("true", "1", "yes"):
            filter_query["placement_guarantee"] = True
        elif placement_param.lower() in ("false", "0", "no"):
            filter_query["placement_guarantee"] = False

    # 3. ISA available filter
    isa_param = request.args.get("isa_available")
    if isa_param is not None:
        if isa_param.lower() in ("true", "1", "yes"):
            filter_query["isa_available"] = True
        elif isa_param.lower() in ("false", "0", "no"):
            filter_query["isa_available"] = False

    # 4. Max price filter
    max_price_param = request.args.get("max_price")
    if max_price_param is not None:
        try:
            filter_query["price_inr"] = {"$lte": int(max_price_param)}
        except ValueError:
            return jsonify({"success": False, "error": "Invalid 'max_price' parameter, must be an integer"}), 400

    # 5. Search query
    search_param = request.args.get("search", "").strip()
    if search_param:
        regex_pattern = re.compile(re.escape(search_param), re.IGNORECASE)
        search_condition = {
            "$or": [
                {"name": {"$regex": regex_pattern}},
                {"provider": {"$regex": regex_pattern}},
                {"tech_stack": {"$elemMatch": {"$regex": regex_pattern}}}
            ]
        }
        if "$and" in filter_query:
            filter_query["$and"].append(search_condition)
        else:
            filter_query.update(search_condition)

    cursor = collection.find(filter_query)

    # 6. Sorting
    sort_by = request.args.get("sort_by", "rating_desc")
    if sort_by == "rating_desc":
        cursor = cursor.sort("alumni_rating", -1)
    elif sort_by == "rating_asc":
        cursor = cursor.sort("alumni_rating", 1)
    elif sort_by == "price_asc":
        cursor = cursor.sort("price_inr", 1)
    elif sort_by == "price_desc":
        cursor = cursor.sort("price_inr", -1)

    bootcamps = [serialize_doc(doc) for doc in cursor]

    return jsonify({
        "success": True,
        "count": len(bootcamps),
        "data": bootcamps
    }), 200

@bootcamps_bp.route("/compare", methods=["GET"])
def compare_bootcamps():
    """
    Accept two bootcamp IDs (?b1=id_1&b2=id_2) and return full details
    and comparison metrics for side-by-side comparison.
    """
    b1_id = request.args.get("b1", "").strip()
    b2_id = request.args.get("b2", "").strip()

    if not b1_id or not b2_id:
        return jsonify({
            "success": False,
            "error": "Both 'b1' and 'b2' query parameters are required for comparison (e.g., /compare?b1=id_1&b2=id_2)"
        }), 400

    bootcamp1 = find_bootcamp_by_id(b1_id)
    if not bootcamp1:
        return jsonify({
            "success": False,
            "error": f"Bootcamp with ID '{b1_id}' not found"
        }), 404

    bootcamp2 = find_bootcamp_by_id(b2_id)
    if not bootcamp2:
        return jsonify({
            "success": False,
            "error": f"Bootcamp with ID '{b2_id}' not found"
        }), 404

    # Calculate comparison analysis
    stack1 = set(bootcamp1.get("tech_stack", []))
    stack2 = set(bootcamp2.get("tech_stack", []))
    price1 = bootcamp1.get("price_inr", 0)
    price2 = bootcamp2.get("price_inr", 0)
    rating1 = bootcamp1.get("alumni_rating", 0.0)
    rating2 = bootcamp2.get("alumni_rating", 0.0)

    comparison_summary = {
        "price_difference_inr": abs(price1 - price2),
        "cheaper_bootcamp_id": b1_id if price1 <= price2 else b2_id,
        "rating_difference": round(abs(rating1 - rating2), 2),
        "higher_rated_bootcamp_id": b1_id if rating1 >= rating2 else b2_id,
        "common_technologies": sorted(list(stack1.intersection(stack2))),
        "unique_to_b1": sorted(list(stack1 - stack2)),
        "unique_to_b2": sorted(list(stack2 - stack1)),
    }

    return jsonify({
        "success": True,
        "bootcamps": [bootcamp1, bootcamp2],
        "comparison": comparison_summary
    }), 200

@bootcamps_bp.route("/<bootcamp_id>", methods=["GET"])
def get_bootcamp_by_id(bootcamp_id):
    """Fetch single bootcamp details."""
    bootcamp = find_bootcamp_by_id(bootcamp_id)
    if not bootcamp:
        return jsonify({
            "success": False,
            "error": f"Bootcamp with ID '{bootcamp_id}' not found"
        }), 404

    return jsonify({
        "success": True,
        "data": bootcamp
    }), 200

@bootcamps_bp.route("", methods=["POST"])
@bootcamps_bp.route("/", methods=["POST"])
def create_bootcamp():
    """Create a new bootcamp (supports future integrations and admin capabilities)."""
    payload = request.get_json(silent=True)
    if not payload:
        return jsonify({"success": False, "error": "Invalid or missing JSON body"}), 400

    is_valid, err_msg = validate_bootcamp(payload)
    if not is_valid:
        return jsonify({"success": False, "error": err_msg}), 400

    collection = get_bootcamps_collection()
    res = collection.insert_one(payload)
    created = collection.find_one({"_id": res.inserted_id})

    return jsonify({
        "success": True,
        "message": "Bootcamp created successfully",
        "data": serialize_doc(created)
    }), 201
