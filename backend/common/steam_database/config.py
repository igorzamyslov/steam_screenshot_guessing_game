from functools import cache

from pydantic import BaseSettings


class SteamDBConnectionConfig(BaseSettings):
    path: str

    class Config:
        env_prefix = "sqlite_"

    @property
    def connection_string(self):
        return f"sqlite+pysqlite:///{self.path}"


@cache
def get_steam_db_connection_config():
    """ Returns an instance of SteamDBConnectionConfig """
    return SteamDBConnectionConfig()
