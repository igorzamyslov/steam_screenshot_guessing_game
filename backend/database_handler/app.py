import time
from typing import Set
from common.steam_handler import get_steam_apps, SteamStorePageParser
from common.database import SessionLocal
from common import schema


def get_db_app_ids() -> Set[int]:
    """ Get all App IDs from the database """
    with SessionLocal() as session:
        return {_id for [_id] in session.query(schema.Application.id).all()}


def create_db_app(app_id: int, app_name: str):
    """ Create app in the database """
    parser = SteamStorePageParser(app_id)
    db_app = schema.Application(id=app_id,
                                name=app_name, 
                                reviews_count=parser.get_reviews_count(), 
                                release_date=parser.get_release_date(), 
                                screenshots=[schema.Screenshot(url=url) 
                                             for url in parser.get_screenshot_urls()])
    with SessionLocal() as session:
        session.add(db_app)
        session.commit()
    print(f"App '{app_name}' (ID: {app_id}) added to DB")


def main():
    """ 
    1. Request apps from Steam
    2. Gradually populate database with unknown apps
    """
    while True:
        known_app_ids = get_db_app_ids()
        steam_apps = get_steam_apps()
        for steam_app_id, steam_app_name in steam_apps.items():
            if steam_app_id in known_app_ids:
                continue
            create_db_app(steam_app_id, steam_app_name)
            # time.sleep(2)  # wait between apps (being polite)
        time.sleep(2 * 60 * 60)  # 2 hours


if __name__ == "__main__":
    main()