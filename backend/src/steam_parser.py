from dataclasses import dataclass
from datetime import date, datetime
from functools import cached_property
from typing import List, Optional

import requests
from bs4 import BeautifulSoup

from models import ParsedAppData


@dataclass
class SteamParser:
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

    def get_enriched_app_info(self) -> ParsedAppData:
        """ Get enriched information about the application """
        return ParsedAppData(
            id=self.app_id,
            screenshots=self.get_screenshot_urls(),
            release_date=self.get_release_date(),
            reviews_count=self.get_reviews_count())
