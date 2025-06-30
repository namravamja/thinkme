from pydantic import BaseModel, EmailStr
from typing import Optional


class UserCreate(BaseModel):
    email: EmailStr
    name: str
    password: str


class UserRead(BaseModel):
    id: int
    email: EmailStr
    name: str
    bio: Optional[str] = None
    website: Optional[str] = None
    twitter: Optional[str] = None
    github: Optional[str] = None
    linkedin: Optional[str] = None
    profile_image: Optional[str] = None

    model_config = {"from_attributes": True}


class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    bio: Optional[str] = None
    website: Optional[str] = None
    twitter: Optional[str] = None
    github: Optional[str] = None
    linkedin: Optional[str] = None
