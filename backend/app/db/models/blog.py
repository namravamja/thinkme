import random
from sqlalchemy import Column, Integer, String, ForeignKey, Text, DateTime, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base


class Blog(Base):
    __tablename__ = "blogs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=False)
    title = Column(String, index=True, nullable=False)
    content = Column(Text, nullable=False)
    excerpt = Column(Text, nullable=False)
    category = Column(String, nullable=False)
    tags = Column(JSON, default=list)
    image = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    author = relationship("User", backref="blogs")
