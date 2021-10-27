import random
from datetime import date
from typing import List, Optional
from urllib.parse import urljoin

from pydantic import BaseModel, Field, HttpUrl
from sqlalchemy.orm import Session

import common.database as db
from .db_operations import get_application

STEAM_STORE_URL = "https://store.steampowered.com/app"


class Screenshot(BaseModel):
    """ Model for an App screenshot """
    url: HttpUrl

    class Config:
        orm_mode = True


class AppInfo(BaseModel):
    """
    Parsed data about a steam app
    Acquired by parsing the app's Steam Store page
    """
    id: int
    name: str
    screenshots: List[Screenshot]
    release_date: Optional[date] = Field(..., alias="releaseDate")
    reviews_count: Optional[int] = Field(..., alias="reviewsCount")

    class Config:
        allow_population_by_field_name = True
        orm_mode = True


class QuizAnswer(BaseModel):
    """ One of the answers for a quiz """
    app_id: int = Field(..., alias="appId")
    app_name: str = Field(..., alias="appName")
    url: HttpUrl
    correct: bool

    class Config:
        allow_population_by_field_name = True


class Quiz(BaseModel):
    """
    Parsed data about a steam app
    Acquired by parsing the app's Steam Store page
    """
    screenshot_url: HttpUrl = Field(..., alias="screenshotUrl")
    answers: List[QuizAnswer]

    class Config:
        allow_population_by_field_name = True

    @classmethod
    def from_db_app(cls, session: Session, app: db.Application,
                    similar_app_ids: List[int]):
        """ Create a quiz from the DB App """
        random.shuffle(similar_app_ids)
        answer_apps = [(app, True)]  # App + Whether it is correct answer
        answer_apps.extend((get_application(session, app_id), False)
                           for app_id in similar_app_ids[:3])
        random.shuffle(answer_apps)
        answers = [QuizAnswer(app_id=app.id,
                              app_name=app.name,
                              url=urljoin(STEAM_STORE_URL, str(app.id)),
                              correct=is_correct)
                   for app, is_correct in answer_apps]
        return cls(screenshot_url=random.choice(app.screenshots).url, answers=answers)
