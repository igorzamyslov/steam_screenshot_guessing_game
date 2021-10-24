import random

from fastapi import Depends, FastAPI, HTTPException
from pydantic.main import BaseModel
from sqlalchemy.orm import selectinload
from sqlalchemy.sql.functions import func

from common import schema
from common.database import SessionLocal
from .models import AppInfo

app = FastAPI(servers=[{"url": "/api", "description": "Behind proxy"},
                       {"url": "/", "description": "Direct"}])

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
                 .join(schema.Screenshot)
                 .filter(schema.Application.reviews_count >= 100)
                 .group_by(schema.Application.id)
                 .having(func.count(schema.Screenshot.id) > 0))
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
