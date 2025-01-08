from typing import List

from fastapi import Depends, FastAPI, HTTPException
from pydantic.main import BaseModel

from common.steam_database import db as steam_db
from .models import LeaderboardEntry, Quiz
from .ssgg_database import db as ssgg_db
from .steam_db_operations import DatabaseOperationError, get_known_app_ids, get_random_application

app = FastAPI(servers=[{"url": "/api", "description": "Behind proxy"},
                       {"url": "/", "description": "Direct"}])


class ErrorResponse(BaseModel):
    """ Response for HTTPException """
    detail: str


@app.get("/quiz/random", response_model=Quiz,
         responses={500: {"model": ErrorResponse}})
async def get_random_quiz(session=Depends(steam_db.get_session),
                          filter_nudity: bool = True,
                          minimum_reviews: int = 400):
    """
    Generate a quiz for a random app.
    - A screenshot for the main app is chosen at random from the available pool
    - 3 similar apps are chosen at random from the available pool
    - The order of answers is randomized
    """
    known_app_ids = get_known_app_ids(session)
    while True:
        # Find random app with 3 or more known similar apps
        try:
            steam_app = get_random_application(session,
                                               filter_nudity=filter_nudity,
                                               minimum_reviews=minimum_reviews)
        except DatabaseOperationError as error:
            raise HTTPException(status_code=500, detail="No applications found") from error
        similar_app_ids = {a.id for a in steam_app.similar_apps}
        known_similar_app_ids = similar_app_ids & known_app_ids
        if len(known_similar_app_ids) >= 3:
            break
    return Quiz.from_db_app(session, steam_app, list(known_similar_app_ids))


@app.post("/update_leaderboard")
async def post_leaderboard(name: str, score: int, session=Depends(ssgg_db.get_session)):
    """
    Update leaderboard information
    Stupid endpoint to update leaderboard with whatever client sends
    """
    user = session.query(ssgg_db.User).filter_by(name=name).one_or_none()
    if user is None:
        user = ssgg_db.User(name=name)
    score = ssgg_db.Score(score=score, user=user)
    session.add(score)
    session.commit()


@app.get("/leaderboard", response_model=List[LeaderboardEntry])
async def get_leaderboard(session=Depends(ssgg_db.get_session)):
    """ Get leaderboard information """
    fields = ["name", "score", "timestamp"]
    entries = (
        session.query(ssgg_db.Score)
        .distinct()
        .join(ssgg_db.User)
        .with_entities(ssgg_db.User.name, ssgg_db.Score.score, ssgg_db.Score.timestamp)
        .order_by(ssgg_db.Score.score.desc(), ssgg_db.Score.timestamp.asc())
        .limit(10)
        .all())
    return [dict(zip(fields, entry)) for entry in entries]

app.mount("/api", app)
