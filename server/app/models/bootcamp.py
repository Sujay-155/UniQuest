"""
Bootcamp model definitions, schema validation, and seed data.
"""

REQUIRED_FIELDS = [
    "name",
    "provider",
    "tech_stack",
    "price_inr",
    "placement_guarantee",
    "isa_available",
    "alumni_rating",
    "affiliate_url"
]

SAMPLE_BOOTCAMPS = [
    {
        "name": "Full Stack Specialization & System Design",
        "provider": "Scaler Academy",
        "tech_stack": ["React", "Node.js", "Java", "System Design", "MongoDB", "AWS"],
        "price_inr": 249000,
        "placement_guarantee": True,
        "isa_available": False,
        "alumni_rating": 4.8,
        "affiliate_url": "https://www.scaler.com/academy/?ref=uniquest",
        "duration_weeks": 36,
        "mode": "Live Online",
        "highlights": [
            "1:1 Mentorship from MAANG engineers",
            "Over 900+ hiring partners across India & global",
            "Mock interviews & end-to-end placement support"
        ],
        "description": "Comprehensive program designed for aspiring software engineers, focusing on DSA, scalable backend architecture, and modern full-stack systems."
    },
    {
        "name": "Full Stack Web Development & DevOps Cohort",
        "provider": "100xDevs",
        "tech_stack": ["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL", "Docker", "Kubernetes", "Web3"],
        "price_inr": 8499,
        "placement_guarantee": False,
        "isa_available": False,
        "alumni_rating": 4.9,
        "affiliate_url": "https://100xdevs.com/?ref=uniquest",
        "duration_weeks": 24,
        "mode": "Live Weekend & Self-paced",
        "highlights": [
            "Open-source contribution focus with Google Summer of Code mentors",
            "Advanced microservices, DevOps pipelines, and CI/CD",
            "High-signal community with thousands of active builders"
        ],
        "description": "Led by Harkirat Singh, focusing on zero-to-one engineering, production-grade DevOps deployments, and cutting-edge Web3 and Full Stack tech."
    },
    {
        "name": "Full Stack Software Development (Pay After Placement)",
        "provider": "Masai School",
        "tech_stack": ["React", "Node.js", "Express", "MongoDB", "JavaScript", "DSA"],
        "price_inr": 299000,
        "placement_guarantee": True,
        "isa_available": True,
        "alumni_rating": 4.6,
        "affiliate_url": "https://www.masaischool.com/?ref=uniquest",
        "duration_weeks": 30,
        "mode": "Live Full-time (9-9-6)",
        "highlights": [
            "Zero upfront fee option with Income Share Agreement (ISA)",
            "Intensive 9am-9pm rigorous project-based curriculum",
            "Dedicated soft skills and mock technical interview training"
        ],
        "description": "Outcome-driven military-style coding bootcamp focused on creating job-ready engineers with Pay After Placement guarantee."
    },
    {
        "name": "Full Stack Tech Career Track",
        "provider": "Newton School",
        "tech_stack": ["React", "Python", "Django", "Node.js", "MySQL", "AWS"],
        "price_inr": 175000,
        "placement_guarantee": True,
        "isa_available": True,
        "alumni_rating": 4.7,
        "affiliate_url": "https://www.newtonschool.co/?ref=uniquest",
        "duration_weeks": 28,
        "mode": "Live Online Evening",
        "highlights": [
            "Flexible payment options with Pay After Placement ISA",
            "Over 1500+ tech companies hiring graduates",
            "Dedicated personal counselor & resume building"
        ],
        "description": "Industry-vetted curriculum tailored for working professionals and college graduates transitioning to top tier product companies."
    },
    {
        "name": "AI & Data Engineering Career Track",
        "provider": "Springboard India",
        "tech_stack": ["Python", "PyTorch", "FastAPI", "Docker", "Apache Spark", "SQL", "LangChain"],
        "price_inr": 195000,
        "placement_guarantee": True,
        "isa_available": False,
        "alumni_rating": 4.8,
        "affiliate_url": "https://www.springboard.com/workshops/data-engineering/?ref=uniquest",
        "duration_weeks": 26,
        "mode": "Flexible Online with Weekly 1:1 Mentorship",
        "highlights": [
            "100% money-back job guarantee if not placed within 6 months",
            "Weekly video calls with dedicated Principal Data Engineer mentors",
            "Real-world capstone projects evaluated by industry leaders"
        ],
        "description": "Deep-dive specialization in production machine learning systems, data streaming pipelines, and applied GenAI development."
    }
]

def validate_bootcamp(data):
    """
    Validate that a dictionary contains all required fields and correct types.
    Returns (is_valid: bool, error_message: str | None).
    """
    if not isinstance(data, dict):
        return False, "Bootcamp payload must be a JSON object"

    for field in REQUIRED_FIELDS:
        if field not in data:
            return False, f"Missing required field: '{field}'"

    if not isinstance(data["name"], str) or not data["name"].strip():
        return False, "'name' must be a non-empty string"
    if not isinstance(data["provider"], str) or not data["provider"].strip():
        return False, "'provider' must be a non-empty string"
    if not isinstance(data["tech_stack"], list) or not all(isinstance(t, str) for t in data["tech_stack"]):
        return False, "'tech_stack' must be a list of strings"
    if not isinstance(data["price_inr"], (int, float)) or data["price_inr"] < 0:
        return False, "'price_inr' must be a non-negative integer/number"
    if not isinstance(data["placement_guarantee"], bool):
        return False, "'placement_guarantee' must be a boolean"
    if not isinstance(data["isa_available"], bool):
        return False, "'isa_available' must be a boolean"
    if not isinstance(data["alumni_rating"], (int, float)) or not (0 <= data["alumni_rating"] <= 5):
        return False, "'alumni_rating' must be a number between 0 and 5"
    if not isinstance(data["affiliate_url"], str) or not data["affiliate_url"].strip():
        return False, "'affiliate_url' must be a non-empty string"

    return True, None
