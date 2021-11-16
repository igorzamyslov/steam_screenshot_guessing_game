""" Includes common DB Operations relevant for the web application """
from typing import Set

from sqlalchemy import func
from sqlalchemy.exc import MultipleResultsFound, NoResultFound
from sqlalchemy.orm import Session, selectinload

from common.steam_database import db


class DatabaseOperationError(Exception):
    """ Raised in case there's a problem in database operations """


def get_known_app_ids(session: Session) -> Set[int]:
    """ Returns all APP IDs known to the database """
    return {_id for [_id] in session.query(db.Application.id).all()}


def get_application(session: Session, app_id: int) -> db.Application:
    """ Get application by its id """
    try:
        return (session.query(db.Application)
                .filter_by(id=app_id)
                .options(selectinload(db.Application.screenshots),
                         selectinload(db.Application.similar_apps))
                .one())
    except (NoResultFound, MultipleResultsFound) as error:
        raise DatabaseOperationError from error


def get_random_application(session: Session,
                           minimum_reviews: int,
                           filter_nudity: bool) -> db.Application:
    """ Get random application based on the filters """
    query = (session.query(db.Application)
             .join(db.Screenshot, db.Type)
             .filter(db.Type.name == "game")
             .filter(db.Application.reviews_count >= minimum_reviews)
             .group_by(db.Application.id)
             .order_by(func.random())
             .options(selectinload(db.Application.screenshots),
                      selectinload(db.Application.similar_apps)))
    if filter_nudity:
        query = query.join(db.Genre).filter(db.Genre.name not in ["Sexual Content", "Nudity"])
    app = query.first()
    if app is None:
        raise DatabaseOperationError("No applications found")
    return app
