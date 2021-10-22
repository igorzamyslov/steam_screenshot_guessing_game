import random

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic.main import BaseModel

from models import AppInfo
from steam_handler import SteamStorePageParser, get_steam_apps

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
        app_info = SteamStorePageParser(random_app_id).get_app_info()
        if len(app_info.screenshots) == 0:
            continue
        elif not app_info.reviews_count or app_info.reviews_count < 2000:
            continue
        break
    return app_info


@app.get("/app/{app_id}", response_model=AppInfo,
         responses={404: {"model": ErrorResponse}})
async def get_app_info(app_id: int, all_apps=Depends(get_steam_apps)):
    """ Get information about the requested Steam app """
    if app_id not in all_apps:
        raise HTTPException(status_code=404, detail=f"App ID {app_id} is not found")
    return SteamStorePageParser(app_id).get_app_info()
