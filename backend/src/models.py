from datetime import date
from typing import List, Optional

from pydantic import BaseModel, Field, HttpUrl


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
    release_date: Optional[date] = Field(..., alias="releaseDate")
    reviews_count: Optional[int] = Field(..., alias="reviewsCount")

    class Config:
        allow_population_by_field_name = True
