from sqlalchemy import Column, Date, Integer, String, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship


Base = declarative_base()


class Application(Base):
    """ Steam application model """
    __tablename__ = "applications"
    id = Column(Integer, primary_key=True, autoincrement=False)
    name = Column(String, nullable=False)
    reviews_count = Column(Integer)
    release_date = Column(Date)
    screenshots = relationship("Screenshot")


class Screenshot(Base):
    """ Screenshot model """
    __tablename__ = "screenshots"
    id = Column(Integer, primary_key=True)
    app_id = Column(Integer, ForeignKey("applications.id"), nullable=False)
    url = Column(String, nullable=False)  # not clear if URL can be persistent