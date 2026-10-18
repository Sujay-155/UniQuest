from pydantic import BaseModel, Field
from typing import List, Optional

class University(BaseModel):
    name: str
    state: str
    university_type: str
    courses_offered: List[str] = []
    official_website: Optional[str] = None
    admission_portal_link: Optional[str] = None
    application_deadline: Optional[str] = None
    established_year: Optional[int] = None
    location: Optional[str] = None
    specialization: Optional[str] = None
    fee_range: Optional[str] = None
    scholarships_available: List[str] = []
    data_source: Optional[str] = None

    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "name": "Delhi University",
                "state": "Delhi",
                "university_type": "Central",
                "courses_offered": ["B.Tech", "B.Sc", "BA"],
                "official_website": "http://du.ac.in",
                "admission_portal_link": "http://admission.uod.ac.in/",
                "application_deadline": "2026-08-15",
                "established_year": 1922,
                "location": "Delhi",
                "specialization": "General",
                "fee_range": None,
                "scholarships_available": [],
                "data_source": "Wikipedia: List of central universities in India"
            }
        }

