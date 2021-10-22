from functools import cache
from typing import List

import requests
from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from models import MinimalAppInfo, ParsedAppData
from steam_parser import SteamParser

app = FastAPI()
origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@cache
def get_steam_apps():
    """ Acquires all Steam apps """
    response = requests.get("https://api.steampowered.com/ISteamApps/GetAppList/v2")
    return [MinimalAppInfo(id=steam_app["appid"], name=steam_app["name"])
            for steam_app in response.json()["applist"]["apps"]]


@app.get("/apps", response_model=List[MinimalAppInfo])
async def get_apps(apps: List[MinimalAppInfo] = Depends(get_steam_apps)):
    """ Get all Steam apps """
    return apps


@app.get("/app/{app_id}", response_model=ParsedAppData)
async def get_app_info(app_id: int):
    """ Get information about the App """
    return SteamParser(app_id).get_enriched_app_info()
