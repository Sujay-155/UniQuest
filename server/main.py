import logging

logging.basicConfig(level=logging.INFO)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import universities, fests, bootcamps

app = FastAPI(title="UniQuest Indian Universities API")

# Configure CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(universities.router, prefix="/api/universities", tags=["Universities"])
app.include_router(fests.router, prefix="/api/fests", tags=["Fests"])
app.include_router(bootcamps.router, prefix="/api/bootcamps", tags=["Bootcamps"])

@app.get("/")
def read_root():
    return {"message": "Welcome to UniQuest API. Visit /docs for Swagger UI."}

