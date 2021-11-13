from datetime import datetime
from typing import Any

from sqlalchemy import (Column, DateTime, ForeignKey, Integer,
                        MetaData, String, create_engine)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Session, relationship, sessionmaker

from .config import get_connection_config

engine = create_engine(get_connection_config().connection_string)
DBSession = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base: Any = declarative_base(metadata=MetaData())


async def get_session() -> Session:
    session = DBSession()
    try:
        yield session
    finally:
        session.close()


class User(Base):
    """ User model """
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)


class Score(Base):
    """ Score model (achieved by finishing the game) """
    __tablename__ = "scores"
    id = Column(Integer, primary_key=True, index=True)
    score = Column(Integer, nullable=False)
    timestamp = Column(DateTime, nullable=False, default=datetime.utcnow)
    user_id = Column(ForeignKey("users.id"), index=True)

    user = relationship("User")
