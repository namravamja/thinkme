import cloudinary
import cloudinary.uploader
import os
from dotenv import load_dotenv

load_dotenv()

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True,
)


def upload_image(file):
    try:
        result = cloudinary.uploader.upload(file, folder="blogs")
        return result.get("secure_url")
    except Exception as e:
        import traceback

        traceback.print_exc()
        raise RuntimeError("Image upload failed")
