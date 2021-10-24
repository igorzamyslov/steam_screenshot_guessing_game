from dataclasses import dataclass
from datetime import date, datetime
from functools import cached_property
from typing import Dict, List, Optional

import requests


class SteamAppDataError(Exception):
    """ Raised in case acquired app data wasn't successful """


class SteamAppResponseError(Exception):
    """ Raised in case response wasn't successful """


@dataclass
class SteamAppHandler:
    app_id: int
    
    def __post_init__(self):
        """ Init app data """
        response = requests.get("https://store.steampowered.com/api/"
                                f"appdetails?appids={self.app_id}")
        try:
            response.raise_for_status()
        except Exception as error:
            raise SteamAppResponseError from error

        app_dict = response.json()[str(self.app_id)]
        if not app_dict["success"]:
            raise SteamAppDataError(f"Response for the app with ID {self.app_id} is not successful")
        self.app_data = app_dict["data"]

    @staticmethod
    def get_steam_apps() -> Dict[int, str]:
        """ Acquires all Steam apps and returns them as dictionary {id: name} """
        json_response = requests.get("https://api.steampowered.com/ISteamApps/GetAppList/v2").json()
        return {steam_app["appid"]: steam_app["name"]
                for steam_app in json_response["applist"]["apps"]}

    def get_screenshot_urls(self) -> List[str]:
        """ Parse app data and return all screenshot URLs """
        return [s["path_full"] for s in self.app_data.get("screenshots", [])]

    def get_reviews_count(self) -> Optional[int]:
        """ Parse app data and return reviews count """
        if (recs := self.app_data.get("recommendations")) is not None:
            return recs["total"]
        return None

    def get_release_date(self) -> Optional[date]:
        """ Parse app data and return release date """
        release_date_dict = self.app_data["release_date"]
        if not release_date_dict["coming_soon"]:
            try:
                return datetime.strptime(release_date_dict["date"], "%d %b, %Y").date()
            except ValueError:
                return None
        return None