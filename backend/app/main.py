from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine
from app.db import base
from app.api import auth, blog, user

base.Base.metadata.create_all(bind=engine)

app = FastAPI()


# CORS (Allow Next.js frontend to communicate with FastAPI backend)
origins = [
    "http://localhost:3000",  # local Next.js
    "https://yourdomain.com",  # production domain
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from fastapi import Request
from fastapi.responses import JSONResponse
import traceback


@app.middleware("http")
async def log_exceptions_middleware(request: Request, call_next):
    try:
        return await call_next(request)
    except Exception as e:
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"detail": str(e)})


# Include all routes
app.include_router(auth.router)
app.include_router(blog.router)
app.include_router(user.router)


@app.get("/")
def root():
    return {"message": "Blog API is running"}
