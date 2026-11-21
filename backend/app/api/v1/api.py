from fastapi import APIRouter
from app.api.v1.endpoints import moadian

api_router = APIRouter()
api_router.include_router(moadian.router)
