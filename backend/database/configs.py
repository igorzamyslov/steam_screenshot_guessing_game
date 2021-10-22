from functools import cache
from typing import Any
from pydantic import BaseSettings


class SQLDatabaseConnectionConfig(BaseSettings):
    db: str

    class Config:
        env_prefix = "sqlite_"

    @property
    def connection_string(self):
        return f"sqlite+pysqlite:///{self.db}"


@cache
def get_sql_db_connection_config():
    """ Returns an instance of SQLDatabaseConnectionConfig """
    return SQLDatabaseConnectionConfig()