from datetime import date
from typing import List, Optional

from pydantic import BaseModel, Field, HttpUrl


class Screenshot(BaseModel):
    """ Model for an App screenshot """
    url: HttpUrl

    class Config:
        orm_mode = True


class AppInfo(BaseModel):
    """
    Parsed data about a steam app
    Acquired by parsing the app's Steam Store page
    """
    id: int
    name: str
    screenshots: List[Screenshot]
    release_date: Optional[date] = Field(..., alias="releaseDate")
    reviews_count: Optional[int] = Field(..., alias="reviewsCount")

    class Config:
        allow_population_by_field_name = True
        orm_mode = True
