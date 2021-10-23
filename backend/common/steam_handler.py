from dataclasses import dataclass
from datetime import date, datetime
from functools import cache, cached_property
from typing import Dict, List, Optional

import requests
from bs4 import BeautifulSoup


def get_steam_apps() -> Dict[int, str]:
    """ Acquires all Steam apps and returns them as dictionary {id: name} """
    json_response = requests.get("https://api.steampowered.com/ISteamApps/GetAppList/v2").json()
    return {steam_app["appid"]: steam_app["name"]
            for steam_app in json_response["applist"]["apps"]}


@dataclass
class SteamStorePageParser:
    app_id: int

    @cached_property
    def app_store_page_soup(self) -> BeautifulSoup:
        """ Get HTML of the app page """
        page = requests.get(f"https://store.steampowered.com/app/{self.app_id}").text
        return BeautifulSoup(page, "html.parser")

    def get_screenshot_urls(self) -> List[str]:
        """ Parse app store page and return all screenshot URLs """
        elements = self.app_store_page_soup.find_all(
            "a", attrs={"class": "highlight_screenshot_link"})
        return [url for element in elements
                if (url := element.get("href")) is not None]

    def get_reviews_count(self) -> Optional[int]:
        """ Parse app store page and return reviews count """
        try:
            # reviews div can contain multiple elements, we n
            reviews_div = self.app_store_page_soup.find("div", string="All Reviews:")
            count_div = (reviews_div.next_sibling.next_sibling
                         .find("meta", attrs={"itemprop": "reviewCount"}))
            return int(count_div.get("content"))
        except (AttributeError, ValueError, TypeError):
            return None

    def get_release_date(self) -> Optional[date]:
        """ Parse app store page and return release date """
        try:
            date_div = (self.app_store_page_soup
                        .find("div", attrs={"class": "release_date"})
                        .find("div", attrs={"class": "date"}))
            return datetime.strptime(date_div.string, "%d %b, %Y").date()
        except (AttributeError, ValueError):
            return None