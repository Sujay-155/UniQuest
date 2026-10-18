from pydantic import BaseModel
from typing import Optional


class Fest(BaseModel):
    name: str
    host_institution: str
    state: Optional[str] = None
    location: Optional[str] = None
    festival_type: Optional[str] = None
    first_held: Optional[int] = None
    official_website: Optional[str] = None
    data_source: Optional[str] = None

    class Config:
        json_schema_extra = {
            "example": {
                "name": "Mood Indigo",
                "host_institution": "IIT Bombay",
                "state": "Maharashtra",
                "location": "Mumbai",
                "festival_type": "Cultural",
                "first_held": 1971,
                "official_website": None,
                "data_source": "Wikipedia: List of cultural, technical and sports festivals in IITs and NITs",
            }
        }
