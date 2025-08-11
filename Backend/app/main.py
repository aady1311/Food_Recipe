from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routes import auth
from app.routes import meals
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="FastAPI Authentication System",
    description="A secure authentication system with signup and signin functionality",
    version="1.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(meals.router, prefix="/meals", tags=["Meals"])


@app.get("/")
async def root():
    return {"message": "FastAPI Authentication System is running!"}


@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "API is working properly"}
