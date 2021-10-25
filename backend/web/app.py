import random

from fastapi import FastAPI, HTTPException
from pydantic.main import BaseModel
from sqlalchemy.orm import selectinload

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
    NOTE: Filters are hardcoded for now
    """
    with SessionLocal() as session:
        query = (session.query(schema.Application.id)
                 .join(schema.Screenshot, schema.Type)
                 .filter(schema.Type.name == "game")
                 .group_by(schema.Application.id))
        query_with_filters = query.filter(schema.Application.reviews_count >= 500)
        try:
            app_id = random.choice(query_with_filters.all())
        except IndexError:
            # For dev purposes:
            # If app with filters is not found - fallback to any app
            try:
                app_id = random.choice(query.all())
            except IndexError as error:
                raise HTTPException(status_code=500, detail="No applications found") from error

        return (session.query(schema.Application)
                .options(selectinload(schema.Application.screenshots))
                .get(app_id))


@app.get("/app/{app_id}", response_model=AppInfo,
         responses={404: {"model": ErrorResponse}})
async def get_app_info(app_id: int):
    """ Get information about the requested Steam app """

    with SessionLocal() as session:
        steam_app = (session.query(schema.Application)
                     .options(selectinload(schema.Application.screenshots))
                     .get(app_id))
    if steam_app is None:
        raise HTTPException(status_code=404, detail=f"Application with ID {app_id} not found")
    return steam_app
