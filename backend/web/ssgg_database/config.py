from functools import cache

from pydantic import BaseSettings


class ConnectionConfig(BaseSettings):
    path: str

    class Config:
        env_prefix = "ssgg_db_"

    @property
    def connection_string(self):
        return f"sqlite+pysqlite:///{self.path}"


@cache
def get_connection_config():
    """ Returns an instance of ConnectionConfig """
    return ConnectionConfig()
