from datetime import datetime
import time
from typing import Set

from requests.sessions import Request

from common.database import SessionLocal
from common import schema
from .steam_handler import SteamAppHandler, SteamAppDataError, SteamAppResponseError


REQUESTS_DELAY = 0.1


def get_db_app_ids() -> Set[int]:
    """ Get all App IDs from the database """
    with SessionLocal() as session:
        return {_id for [_id] in session.query(schema.Application.id).all()}


def create_db_app(app_id: int, app_name: str):
    """ Create app in the database """
    global_delay_increased = False
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

    db_app = schema.Application(id=app_id, name=app_name)
    if parser:
        try:
            db_app.reviews_count=parser.get_reviews_count()
            db_app.release_date=parser.get_release_date()
            db_app.screenshots=[schema.Screenshot(url=url) for url in parser.get_screenshot_urls()]
        except Exception as error:
            print(f"ERROR: App ID {app_id}: {error}")
            return

    with SessionLocal() as session:
        session.add(db_app)
        session.commit()
    empty = "" if parser else " (empty)"
    print(f"Added to DB{empty}: App '{app_name}' (ID: {app_id})")


def main():
    """ 
    1. Request apps from Steam
    2. Gradually populate database with unknown apps
    """
    while True:
        known_app_ids = get_db_app_ids()
        steam_apps = SteamAppHandler.get_steam_apps()
        for steam_app_id, steam_app_name in steam_apps.items():
            if steam_app_id in known_app_ids:
                continue
            create_db_app(steam_app_id, steam_app_name)
            time.sleep(REQUESTS_DELAY)  # wait between apps (avoiding "Too Many Requests")
        time.sleep(2 * 60 * 60)  # 2 hours


if __name__ == "__main__":
    main()