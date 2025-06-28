from fastapi import APIRouter, Depends, Request, HTTPException
from app.core.security import decode_access_token
from app.db.models.user import User
from app.db.session import SessionLocal
from app.schemas.user import UserRead
from sqlalchemy.orm import Session

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
