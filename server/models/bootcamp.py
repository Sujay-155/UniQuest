from pydantic import BaseModel
from typing import List, Optional, Tuple


class Bootcamp(BaseModel):
    id: str
    name: str
    provider: str
    tech_stack: List[str]
    price_inr: float
    placement_guarantee: bool
    isa_available: bool
    alumni_rating: float
    affiliate_url: str
    duration_weeks: Optional[int] = None
    mode: Optional[str] = None
    highlights: Optional[List[str]] = None
    description: Optional[str] = None


class BootcampsResponse(BaseModel):
    success: bool
    count: int
    data: List[Bootcamp]
    error: Optional[str] = None


class BootcampDetailResponse(BaseModel):
    success: bool
    data: Optional[Bootcamp] = None
    error: Optional[str] = None


class ComparisonMetrics(BaseModel):
    price_difference_inr: float
    cheaper_bootcamp_id: str
    rating_difference: float
    higher_rated_bootcamp_id: str
    common_technologies: List[str]
    unique_to_b1: List[str]
    unique_to_b2: List[str]


class ComparisonResponse(BaseModel):
    success: bool
    bootcamps: Optional[Tuple[Bootcamp, Bootcamp]] = None
    comparison: Optional[ComparisonMetrics] = None
    error: Optional[str] = None


REQUIRED_FIELDS = [
    "name", "provider", "tech_stack", "price_inr",
    "placement_guarantee", "isa_available", "alumni_rating", "affiliate_url",
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
            "Mock interviews & end-to-end placement support",
        ],
        "description": "Comprehensive program designed for aspiring software engineers, focusing on DSA, scalable backend architecture, and modern full-stack systems.",
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
            "High-signal community with thousands of active builders",
        ],
        "description": "Led by Harkirat Singh, focusing on zero-to-one engineering, production-grade DevOps deployments, and cutting-edge Web3 and Full Stack tech.",
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
            "Dedicated soft skills and mock technical interview training",
        ],
        "description": "Outcome-driven military-style coding bootcamp focused on creating job-ready engineers with Pay After Placement guarantee.",
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
            "Dedicated personal counselor & resume building",
        ],
        "description": "Industry-vetted curriculum tailored for working professionals and college graduates transitioning to top tier product companies.",
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
            "Real-world capstone projects evaluated by industry leaders",
        ],
        "description": "Deep-dive specialization in production machine learning systems, data streaming pipelines, and applied GenAI development.",
    },
]
