from sqlalchemy import Boolean, Column, Date, ForeignKey, Integer, String, Table
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

_app_categories = Table(
    "_application_categories",
    Base.metadata,
    Column("app_id", ForeignKey("applications.id"), primary_key=True, index=True),
    Column("category_id", ForeignKey("categories.id"), primary_key=True, index=True))

_app_developers = Table(
    "_application_developers",
    Base.metadata,
    Column("app_id", ForeignKey("applications.id"), primary_key=True, index=True),
    Column("developer_id", ForeignKey("developers.id"), primary_key=True, index=True))

_app_publishers = Table(
    "_application_publishers",
    Base.metadata,
    Column("app_id", ForeignKey("applications.id"), primary_key=True, index=True),
    Column("publisher_id", ForeignKey("publishers.id"), primary_key=True, index=True))

_app_genres = Table(
    "_application_genres",
    Base.metadata,
    Column("app_id", ForeignKey("applications.id"), primary_key=True, index=True),
    Column("genre_id", ForeignKey("genres.id"), primary_key=True, index=True))


class Application(Base):
    """ Steam application model """
    __tablename__ = "applications"
    id = Column(Integer, primary_key=True, autoincrement=False, index=True)  # Use Steam App ID
    name = Column(String, nullable=False)
    is_free = Column(Boolean)
    type_id = Column(Integer, ForeignKey("types.id"), index=True)
    description = Column(String)
    release_date = Column(Date)
    reviews_count = Column(Integer)

    categories = relationship("Category", secondary=_app_categories, back_populates="applications")
    developers = relationship("Developer", secondary=_app_developers, back_populates="applications")
    publishers = relationship("Publisher", secondary=_app_publishers, back_populates="applications")
    genres = relationship("Genre", secondary=_app_genres, back_populates="applications")
    screenshots = relationship("Screenshot")
    type = relationship("Type")


class Screenshot(Base):
    """ Screenshot model """
    __tablename__ = "screenshots"
    id = Column(Integer, primary_key=True, index=True)
    app_id = Column(Integer, ForeignKey("applications.id"), nullable=False, index=True)
    url = Column(String, nullable=False)  # not clear if URL can be persistent


class Category(Base):
    """
    Category of the application
    Observed values: Single-player, PvP, Co-op, etc.
    """
    __tablename__ = "categories"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True, index=True)

    applications = relationship("Application", secondary=_app_categories,
                                back_populates="categories")


class Developer(Base):
    """ Developer of the application """
    __tablename__ = "developers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True, index=True)

    applications = relationship("Application", secondary=_app_developers,
                                back_populates="developers")


class Publisher(Base):
    """ Publisher of the application """
    __tablename__ = "publishers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True, index=True)

    applications = relationship("Application", secondary=_app_publishers,
                                back_populates="publishers")


class Genre(Base):
    """
    Genre of the application
    Observed values: Indie, Simulation, Strategy, etc.
    """
    __tablename__ = "genres"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True, index=True)

    applications = relationship("Application", secondary=_app_genres,
                                back_populates="genres")


class Type(Base):
    """
    Type of the application
    Observed values: "game", "dlc", "demo", "advertising", "mod", "video"
    """
    __tablename__ = "types"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True, index=True)
