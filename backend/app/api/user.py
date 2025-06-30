from fastapi import APIRouter, Depends, HTTPException, Request, UploadFile, File, Form
from app.core.security import decode_access_token
from app.db.models.user import User
from app.db.session import SessionLocal
from app.schemas.user import UserRead
from sqlalchemy.orm import Session
from typing import Optional
from app.config.cloudinary import upload_image

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(request: Request):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="No token")
    payload = decode_access_token(token)
    return int(payload["sub"])


@router.get("/me", response_model=UserRead)
def me(db: Session = Depends(get_db), user_id: int = Depends(get_current_user)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.put("/me/update", response_model=UserRead)
async def update_user_details(
    bio: Optional[str] = Form(None),
    website: Optional[str] = Form(None),
    twitter: Optional[str] = Form(None),
    github: Optional[str] = Form(None),
    linkedin: Optional[str] = Form(None),
    profile_image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if bio is not None:
        user.bio = bio
    if website is not None:
        user.website = website
    if twitter is not None:
        user.twitter = twitter
    if github is not None:
        user.github = github
    if linkedin is not None:
        user.linkedin = linkedin

    if profile_image:
        if profile_image.content_type not in ["image/jpeg", "image/png", "image/webp"]:
            raise HTTPException(status_code=400, detail="Invalid image format")
        try:
            user.profile_image = upload_image(profile_image.file)
        except Exception as e:
            raise HTTPException(
                status_code=500, detail=f"Image upload failed: {str(e)}"
            )

    db.commit()
    db.refresh(user)
    return user
