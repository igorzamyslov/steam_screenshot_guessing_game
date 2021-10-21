from datetime import date
from typing import List, Optional

from pydantic import BaseModel, HttpUrl


class MinimalAppInfo(BaseModel):
    """ Minimal information about a steam app """
    id: int
    name: str


class ParsedAppData(BaseModel):
    """
    Parsed data about a steam app
    Acquired by parsing the app's Steam Store page
    """
    id: int
    screenshots: List[HttpUrl]
    release_date: Optional[date]
    reviews_count: Optional[int]
