from functools import cache
from typing import Any
from pydantic import BaseSettings


class SQLiteConnectionConfig(BaseSettings):
    path: str

    class Config:
        env_prefix = "sqlite_"

    @property
    def connection_string(self):
        return f"sqlite+pysqlite:///{self.path}"


@cache
def get_sqlite_connection_config():
    """ Returns an instance of SQLiteConnectionConfig """
    return SQLiteConnectionConfig()