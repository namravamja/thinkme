from sqlalchemy import Column, Integer, String, Text
from app.db.base import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    name = Column(String, nullable=False)
    bio = Column(Text, nullable=True)
    website = Column(String, nullable=True)
    twitter = Column(String, nullable=True)
    github = Column(String, nullable=True)
    linkedin = Column(String, nullable=True)
    profile_image = Column(String, nullable=True)
