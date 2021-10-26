from fastapi import Depends, FastAPI, HTTPException
from pydantic.main import BaseModel
from sqlalchemy.orm import Session

import common.database as db
from .db_operations import get_application, get_known_app_ids, get_random_application
from .models import AppInfo, Quiz

app = FastAPI(servers=[{"url": "/api", "description": "Behind proxy"},
                       {"url": "/", "description": "Direct"}])


class ErrorResponse(BaseModel):
    """ Response for HTTPException """
    detail: str


async def get_session() -> Session:
    session = db.Session()
    try:
        yield session
    finally:
        session.close()


@app.get("/quiz/random", response_model=Quiz,
         responses={500: {"model": ErrorResponse}})
async def get_random_quiz(session=Depends(get_session)):
    """
    Generate a quiz for a random app.
    - A screenshot for the main app is chosen at random from the available pool
    - 3 similar apps are chosen at random from the available pool
    - The order of answers is randomized
    """
    known_app_ids = get_known_app_ids(session)
    while True:
        # Find random app with 3 or more known similar apps
        steam_app = get_random_application(session)
        if steam_app is None:
            raise HTTPException(status_code=500, detail="No applications found")
        similar_app_ids = {a.id for a in steam_app.similar_apps}
        known_similar_app_ids = similar_app_ids & known_app_ids
        if len(known_similar_app_ids) >= 3:
            break
    return Quiz.from_db_app(session, steam_app, list(known_similar_app_ids))


@app.get("/app/random", response_model=AppInfo,
         responses={500: {"model": ErrorResponse}})
async def get_random_app_info(session=Depends(get_session)):
    """
    Get information about a random Steam app, which contains screenshots
    NOTE: Filters are hardcoded for now
    """
    steam_app = get_random_application(session)
    if steam_app is None:
        raise HTTPException(status_code=500, detail="No applications found")
    return steam_app


@app.get("/app/{app_id}", response_model=AppInfo,
         responses={404: {"model": ErrorResponse}})
async def get_app_info(app_id: int, session=Depends(get_session)):
    """ Get information about the requested Steam app """
    steam_app = get_application(session, app_id)
    if steam_app is None:
        raise HTTPException(status_code=404, detail=f"Application with ID {app_id} not found")
    return steam_app
