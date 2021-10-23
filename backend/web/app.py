import random

from fastapi import Depends, FastAPI, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
from pydantic.main import BaseModel
from sqlalchemy.orm import selectinload

from .models import AppInfo
from common import schema
from common.database import SessionLocal
from common.steam_handler import SteamStorePageParser, get_steam_apps

app = FastAPI()

# app.add_middleware(CORSMiddleware, 
#                    allow_origins=["http://localhost:3000"], 
#                    allow_credentials=True, 
#                    allow_methods=["*"], 
#                    allow_headers=["*"])


class ErrorResponse(BaseModel):
    """ Response for HTTPException """
    detail: str


@app.get("/app/random", response_model=AppInfo)
async def get_random_app_info():
    """ 
    Get information about a random Steam app, which contains screenshots 
    NOTE: FIlters are hardcoded for now
    """
    with SessionLocal() as session:
        query = (session.query(schema.Application.id)
                 .filter(schema.Application.screenshots.any())
                 .filter(schema.Application.reviews_count >= 100))
        app_id = random.choice(query.all())
        return (session.query(schema.Application)
                .options(selectinload(schema.Application.screenshots))
                .get(app_id))


@app.get("/app/{app_id}", response_model=AppInfo,
         responses={404: {"model": ErrorResponse}})
async def get_app_info(app_id: int):
    """ Get information about the requested Steam app """
    with SessionLocal() as session:
        return (session.query(schema.Application)
                .options(selectinload(schema.Application.screenshots))
                .get(app_id))
