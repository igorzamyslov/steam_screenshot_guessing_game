import time
from typing import Any, Dict, Optional, Set, Type, TypeVar

from sqlalchemy.exc import IntegrityError, OperationalError
from sqlalchemy.orm import Session

from common.steam_database import db
from .steam_handler import SteamAppDataError, SteamAppHandler, SteamAppResponseError

REQUESTS_DELAY = 0.0  # sec


def get_db_app_ids(with_no_tags: bool = False) -> Set[int]:
    """ Get all App IDs from the database """
    with db.DBSession() as session:
        query = session.query(db.Application.id)
        if with_no_tags:
            query = query.filter(~db.Application.tags.any())
        return {_id for [_id] in query.all()}


def init_parser(app_id: int) -> Optional[SteamAppHandler]:
    """
    Init and return Steam App parser, taking into account possible init errors.
    On "Too Many Requests" increases the global delay between requests for the app.
    """
    global_delay_increased = False
    parser: Optional[SteamAppHandler]
    while True:
        try:
            parser = SteamAppHandler(app_id)
            break
        except SteamAppResponseError:
            # Too Many Requests ban, try to wait it out for current app
            # + Increase global delay between requests
            if not global_delay_increased:
                global REQUESTS_DELAY
                REQUESTS_DELAY += 0.05
                global_delay_increased = True
                print(f"INFO: Delay increased, current delay: {REQUESTS_DELAY:.2f}s")
            time.sleep(30)  # sec
        except SteamAppDataError:
            parser = None
            break
    return parser


InputModel = TypeVar("InputModel", bound=db.Base)


def get_from_db_or_create(session: Session,
                          db_model: Type[InputModel],
                          filter_params: Dict[str, Any]) -> InputModel:
    """
    Get an instance of a <db_model> from the database based on the <filter_params>.
    If no instance is found - create one based on the <filter_params>.
    """
    db_instance = session.query(db_model).filter_by(**filter_params).one_or_none()
    if db_instance is None:
        db_instance = db_model(**filter_params)
    return db_instance


def populate_app_from_parser(app: db.Application, parser: SteamAppHandler):
    """ Populate DB App instance with additional data """
    # Populate direct fields in the app
    app.is_free = parser.get_is_free()
    app.description = parser.get_description()
    app.release_date = parser.get_release_date()
    app.reviews_count = parser.get_reviews_count()
    app.screenshots = [db.Screenshot(url=url) for url in parser.get_screenshot_urls()]
    # Populate dependent fields in the app
    with db.DBSession() as session:
        # Get existing db instances or create new ones if they don't exist
        app.type = get_from_db_or_create(session, db.Type, {"name": parser.get_type()})
        app.categories = [get_from_db_or_create(session, db.Category, {"name": c})
                          for c in parser.get_categories()]
        app.developers = [get_from_db_or_create(session, db.Developer, {"name": d})
                          for d in parser.get_developers()]
        app.publishers = [get_from_db_or_create(session, db.Publisher, {"name": p})
                          for p in parser.get_publishers()]
        app.genres = [get_from_db_or_create(session, db.Genre, {"name": g})
                      for g in parser.get_genres()]
        app.similar_apps = [db.ApplicationReference(id=s_app_id)
                            for s_app_id in parser.get_similar_app_ids()]
        app.tags = []
        for name, count in parser.get_tags():
            tag = get_from_db_or_create(session, db.Tag, {"name": name})
            app.tags.append(db.AppTag(tag=tag, count=count))


def create_db_app(app_id: int, app_name: str):
    """ Create app in the database """
    # Create db instance
    db_app = db.Application(id=app_id, name=app_name)
    if (parser := init_parser(app_id)) is not None:
        try:
            populate_app_from_parser(db_app, parser)
        except Exception as error:
            print(f"ERROR: Parse App ID {app_id}: {error}")
            return
    # Commit
    with db.DBSession() as session:
        session.merge(db_app)
        try:
            session.commit()
        except (IntegrityError, OperationalError) as error:
            print(f"ERROR: Commit App ID {app_id}: {error}")
            return
    # Log
    empty = "" if parser else " (empty)"
    print(f"INFO: Added to DB{empty}: App '{app_name}' (ID: {app_id})")


def update_db_app_tags(app_id: int):
    """ Parse application's page and get its user tags """
    parser = SteamAppHandler(app_id, populate_app_data=False)
    try:
        parsed_tags = parser.get_tags()
    except Exception as error:
        print(f"ERROR: Error while parsing tags for App ID {app_id}: {error}")
        return

    with db.DBSession() as session:
        app = session.query(db.Application).filter_by(id=app_id).one()
        app.tags = []
        for name, count in parsed_tags:
            tag = get_from_db_or_create(session, db.Tag, {"name": name})
            app.tags.append(db.AppTag(tag=tag, count=count))
        try:
            session.commit()
        except (IntegrityError, OperationalError) as error:
            print(f"ERROR: Update tags - Commit App ID {app_id}: {error}")
            return
        print(f"INFO: Tags added to the App '{app.name}' (ID: {app_id})")


def main():
    """
    1. Request apps from Steam
    2. Gradually populate database with unknown apps
    """
    while True:
        apps_to_update = get_db_app_ids(with_no_tags=True)
        while apps_to_update:
            # Update applications with no tags
            steam_app_id = apps_to_update.pop()
            update_db_app_tags(steam_app_id)

        added_apps = get_db_app_ids()
        steam_apps = SteamAppHandler.get_steam_apps()
        apps_to_add = list(set(steam_apps.keys()) - added_apps)
        while apps_to_add:
            steam_app_id = apps_to_add.pop()
            steam_app_name = steam_apps[steam_app_id]
            create_db_app(steam_app_id, steam_app_name)
            time.sleep(REQUESTS_DELAY)  # wait between apps (avoiding "Too Many Requests")
        time.sleep(2 * 60 * 60)  # 2 hours


if __name__ == "__main__":
    main()
