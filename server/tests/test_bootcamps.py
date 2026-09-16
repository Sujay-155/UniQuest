import json

def test_health_endpoint(client):
    """Test the /health and /api/v1/health endpoints."""
    res = client.get("/api/v1/health")
    assert res.status_code == 200
    data = res.get_json()
    assert data["status"] == "healthy"
    assert data["service"] == "UniQuest API"

def test_get_all_bootcamps(client):
    """Test fetching all bootcamps without filters."""
    res = client.get("/api/v1/bootcamps")
    assert res.status_code == 200
    data = res.get_json()
    assert data["success"] is True
    assert data["count"] == 5
    assert len(data["data"]) == 5
    first = data["data"][0]
    assert "id" in first
    assert "name" in first
    assert "provider" in first
    assert "tech_stack" in first
    assert "price_inr" in first
    assert "placement_guarantee" in first
    assert "isa_available" in first
    assert "alumni_rating" in first
    assert "affiliate_url" in first

def test_filter_by_tech_stack_react(client):
    """Test filtering by single tech stack query."""
    res = client.get("/api/v1/bootcamps?tech_stack=React")
    assert res.status_code == 200
    data = res.get_json()
    assert data["success"] is True
    # Scaler, 100xDevs, Masai, Newton use React (4 bootcamps)
    assert data["count"] == 4
    for b in data["data"]:
        assert any(t.lower() == "react" for t in b["tech_stack"])

def test_filter_by_tech_stack_python(client):
    """Test filtering by Python."""
    res = client.get("/api/v1/bootcamps?tech_stack=Python")
    assert res.status_code == 200
    data = res.get_json()
    assert data["success"] is True
    # Newton and Springboard use Python (2 bootcamps)
    assert data["count"] == 2
    for b in data["data"]:
        assert any(t.lower() == "python" for t in b["tech_stack"])

def test_filter_by_nonexistent_tech(client):
    """Test filtering by a technology not in the dataset."""
    res = client.get("/api/v1/bootcamps?tech_stack=Cobol")
    assert res.status_code == 200
    data = res.get_json()
    assert data["success"] is True
    assert data["count"] == 0

def test_filter_by_placement_and_isa(client):
    """Test boolean filters."""
    res = client.get("/api/v1/bootcamps?isa_available=true")
    assert res.status_code == 200
    data = res.get_json()
    # Masai and Newton have ISA
    assert data["count"] == 2
    for b in data["data"]:
        assert b["isa_available"] is True

def test_get_single_bootcamp(client):
    """Test fetching a single bootcamp by its ID."""
    all_res = client.get("/api/v1/bootcamps")
    bootcamp = all_res.get_json()["data"][0]
    b_id = bootcamp["id"]

    res = client.get(f"/api/v1/bootcamps/{b_id}")
    assert res.status_code == 200
    data = res.get_json()
    assert data["success"] is True
    assert data["data"]["id"] == b_id
    assert data["data"]["name"] == bootcamp["name"]

def test_get_single_bootcamp_not_found(client):
    """Test 404 for nonexistent bootcamp ID."""
    res = client.get("/api/v1/bootcamps/000000000000000000000000")
    assert res.status_code == 404
    data = res.get_json()
    assert data["success"] is False

def test_compare_bootcamps_success(client):
    """Test side-by-side comparison route."""
    all_res = client.get("/api/v1/bootcamps")
    bootcamps = all_res.get_json()["data"]
    b1_id = bootcamps[0]["id"]
    b2_id = bootcamps[1]["id"]

    res = client.get(f"/api/v1/bootcamps/compare?b1={b1_id}&b2={b2_id}")
    assert res.status_code == 200
    data = res.get_json()
    assert data["success"] is True
    assert len(data["bootcamps"]) == 2
    assert "comparison" in data
    comp = data["comparison"]
    assert "price_difference_inr" in comp
    assert "cheaper_bootcamp_id" in comp
    assert "rating_difference" in comp
    assert "higher_rated_bootcamp_id" in comp
    assert "common_technologies" in comp
    assert "unique_to_b1" in comp
    assert "unique_to_b2" in comp

def test_compare_missing_params(client):
    """Test compare validation with missing parameters."""
    res = client.get("/api/v1/bootcamps/compare?b1=123")
    assert res.status_code == 400
    data = res.get_json()
    assert data["success"] is False
    assert "Both 'b1' and 'b2'" in data["error"]

def test_compare_nonexistent_bootcamp(client):
    """Test compare with a nonexistent ID."""
    all_res = client.get("/api/v1/bootcamps")
    b1_id = all_res.get_json()["data"][0]["id"]
    fake_id = "000000000000000000000000"

    res = client.get(f"/api/v1/bootcamps/compare?b1={b1_id}&b2={fake_id}")
    assert res.status_code == 404
    data = res.get_json()
    assert data["success"] is False
