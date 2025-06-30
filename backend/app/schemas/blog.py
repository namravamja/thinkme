from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from typing import List, Optional


class BlogBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    content: str = Field(..., min_length=1)
    excerpt: str = Field(..., min_length=1, max_length=500)
    category: str = Field(..., min_length=1)
    tags: List[str]
    image: Optional[str]


class BlogCreate(BlogBase):
    pass


class BlogUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    content: Optional[str] = Field(None, min_length=1)
    excerpt: Optional[str] = Field(None, min_length=1)
    category: Optional[str] = Field(None, min_length=1)
    tags: Optional[List[str]] = None
    image: Optional[str] = None


class BlogRead(BlogBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
