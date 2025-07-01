from fastapi import APIRouter, Depends, HTTPException, Request, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.session import SessionLocal
from app.db.models.blog import Blog
from app.schemas.blog import BlogRead
from app.core.security import decode_access_token
from app.config.cloudinary import upload_image  # assumes you configured cloudinary here
import random

router = APIRouter()


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_unique_blog_id(db: Session) -> int:
    while True:
        blog_id = random.randint(10**7, 10**8 - 1)
        if not db.query(Blog).filter(Blog.id == blog_id).first():
            return blog_id


def get_current_user_id(request: Request):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    payload = decode_access_token(token)
    return int(payload["sub"])


def get_blog_or_404(blog_id: int, db: Session) -> Blog:
    blog = db.query(Blog).filter(Blog.id == blog_id).first()
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    return blog


def verify_blog_ownership(blog: Blog, user_id: int):
    if blog.user_id != user_id:
        raise HTTPException(
            status_code=403, detail="Not authorized to access this blog"
        )


@router.post("/create", response_model=BlogRead)
async def create_blog(
    title: str = Form(...),
    content: str = Form(...),
    excerpt: str = Form(...),
    category: str = Form(...),
    tags: List[str] = Form(...),
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    if image.content_type not in ["image/jpeg", "image/png", "image/webp"]:
        raise HTTPException(
            status_code=400, detail="Only JPEG, PNG or WEBP images are allowed"
        )

    try:
        image_url = upload_image(image.file)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image upload failed: {str(e)}")

    blog_id = get_unique_blog_id(db)  # Generate unique 8-digit ID

    new_blog = Blog(
        id=blog_id,
        title=title,
        content=content,
        excerpt=excerpt,
        category=category,
        tags=tags,
        image=image_url,
        user_id=user_id,
    )
    db.add(new_blog)
    db.commit()
    db.refresh(new_blog)
    return new_blog


@router.put("/update/{blog_id}", response_model=BlogRead)
async def update_blog(
    blog_id: int,
    title: Optional[str] = Form(None),
    content: Optional[str] = Form(None),
    excerpt: Optional[str] = Form(None),
    category: Optional[str] = Form(None),
    tags: Optional[List[str]] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    blog = get_blog_or_404(blog_id, db)
    verify_blog_ownership(blog, user_id)

    if title is not None:
        blog.title = title
    if content is not None:
        blog.content = content
    if excerpt is not None:
        blog.excerpt = excerpt
    if category is not None:
        blog.category = category
    if tags is not None:
        blog.tags = tags

    if image:
        if image.content_type not in ["image/jpeg", "image/png", "image/webp"]:
            raise HTTPException(status_code=400, detail="Invalid image format")
        try:
            blog.image = upload_image(image.file)
        except Exception as e:
            raise HTTPException(
                status_code=500, detail=f"Image upload failed: {str(e)}"
            )

    db.commit()
    db.refresh(blog)
    return blog


@router.get("/all", response_model=List[BlogRead])
def get_all_blogs(db: Session = Depends(get_db)):
    blogs = db.query(Blog).order_by(Blog.id.desc()).all()
    return blogs


@router.get("/get/{blog_id}", response_model=BlogRead)
def get_blog_by_id(
    blog_id: int,
    db: Session = Depends(get_db),
):
    blog = get_blog_or_404(blog_id, db)
    return blog


@router.get("/my-blogs", response_model=List[BlogRead])
def get_user_blogs(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    blogs = (
        db.query(Blog).filter(Blog.user_id == user_id).order_by(Blog.id.desc()).all()
    )
    return blogs


# ✅ Delete blog
@router.delete("/delete/{blog_id}")
def delete_blog(
    blog_id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    blog = get_blog_or_404(blog_id, db)
    verify_blog_ownership(blog, user_id)

    db.delete(blog)
    db.commit()
    return {"message": "Blog deleted successfully"}
