import re
from dataclasses import dataclass
from datetime import date, datetime
from typing import Dict, Optional, Set

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

    def get_name(self):
        """ Parse app data and return name """
        return self.app_data["name"]

    def get_screenshot_urls(self) -> Set[str]:
        """ Parse app data and return all screenshot URLs """
        return set(s["path_full"] for s in self.app_data.get("screenshots", []))

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

    def get_is_free(self) -> Optional[bool]:
        """ Parse app data and return whether the app is free """
        return self.app_data.get("is_free")

    def get_type(self) -> str:
        """ Parse app data and return the type of the app """
        return self.app_data["type"]

    def get_description(self) -> Optional[str]:
        """ Parse app data and return the type of the app """
        return self.app_data.get("short_description")

    def get_categories(self) -> Set[str]:
        """ Parse app data and return categories of the app """
        return set(c["description"] for c in self.app_data.get("categories", []))

    def get_developers(self) -> Set[str]:
        """ Parse app data and return developers of the app """
        return set(self.app_data.get("developers", []))

    def get_publishers(self) -> Set[str]:
        """ Parse app data and return publishers of the app """
        return set(self.app_data.get("publishers", []))

    def get_genres(self) -> Set[str]:
        """ Parse app data and return genres of the app """
        return set(c["description"] for c in self.app_data.get("genres", []))

    def get_similar_app_ids(self) -> Set[int]:
        """ Parse app store page ("More like this" section) to get similar app ids """
        response = requests.get(f"https://store.steampowered.com/app/{self.app_id}")
        ids_string_match = re.search(r"RenderMoreLikeThisBlock\( \[(.*?)]", response.text)
        if ids_string_match is None:
            raise RuntimeError("Similar apps not found in returned HTML")
        return set(map(int, re.findall(r"\"(.*?)\"", ids_string_match.group(0))))
