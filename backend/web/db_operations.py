""" Includes common DB Operations relevant for the web application """
import random
from typing import Optional, Set

from sqlalchemy.orm import Session, selectinload

import common.database as db


def get_known_app_ids(session: Session) -> Set[int]:
    """ Returns all APP IDs known to the database """
    return {_id for [_id] in session.query(db.Application.id).all()}


def get_application(session: Session, app_id: int) -> Optional[db.Application]:
    """ Get application by its id """
    return (session.query(db.Application)
            .options(selectinload(db.Application.screenshots),
                     selectinload(db.Application.similar_apps))
            .get(app_id))


def get_random_application(session: Session) -> Optional[db.Application]:
    """
    Get random application based on the filters
    NOTE: Filters are hardcoded for now
    """
    query = (session.query(db.Application.id)
             .join(db.Screenshot, db.Type)
             .filter(db.Type.name == "game")
             .group_by(db.Application.id))
    query_with_filters = query.filter(db.Application.reviews_count >= 500)
    try:
        app_id = random.choice(query_with_filters.all())
    except IndexError:
        # For dev purposes:
        # If app with filters is not found - fallback to any app
        try:
            app_id = random.choice(query.all())
        except IndexError:
            return None
    return get_application(session, app_id)
