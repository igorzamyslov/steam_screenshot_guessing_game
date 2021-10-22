from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from configs import get_sql_db_connection_config

config = get_sql_db_connection_config()
engine = create_engine(config.connection_string)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)