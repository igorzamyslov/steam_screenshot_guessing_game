import random

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic.main import BaseModel

from .models import AppInfo
from common.steam_handler import SteamStorePageParser, get_steam_apps

app = FastAPI()
origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ErrorResponse(BaseModel):
    """ Response for HTTPException """
    detail: str


@app.get("/app/random", response_model=AppInfo)
async def get_random_app_info(all_apps=Depends(get_steam_apps)):
    """ Get information about a random Steam app, which contains screenshots """
    while True:
        # Select an app fitting the filters
        random_app_id = random.choice(list(all_apps.keys()))
        app_parser = SteamStorePageParser(random_app_id)
        screenshots = app_parser.get_screenshot_urls()
        if len(screenshots) == 0:
            continue
        
        reviews_count = app_parser.get_reviews_count()
        if not reviews_count or reviews_count < 500:
            continue

        return AppInfo(id=app_parser.app_id,
                       name=app_parser.app_name,
                       screenshots=screenshots,
                       reviews_count=reviews_count,
                       release_date=app_parser.get_release_date())


@app.get("/app/{app_id}", response_model=AppInfo,
         responses={404: {"model": ErrorResponse}})
async def get_app_info(app_id: int, all_apps=Depends(get_steam_apps)):
    """ Get information about the requested Steam app """
    if app_id not in all_apps:
        raise HTTPException(status_code=404, detail=f"App ID {app_id} is not found")
    return SteamStorePageParser(app_id).get_app_info()
