from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
import os
from uuid import uuid4

IMAGE_PATH = "app/img/products/"

router = APIRouter()


@router.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):
    
    file_extension = file.filename.split(".")[-1]
    file_name = f"{uuid4()}.{file_extension}"
    file_path = os.path.join(IMAGE_PATH, file_name)
    with open(file_path, "wb") as f:
        f.write(await file.read())
    return {"filename": file_name}

@router.get("/upload-image/{filename}")
async def get_image(filename: str):
    file_path = os.path.join(IMAGE_PATH, filename)
    return FileResponse(file_path)

@router.delete("/upload-image/{filename}")
async def delete_image(filename: str):
    image_path = f"{IMAGE_PATH}{filename}"
    if os.path.exists(image_path):
        os.remove(image_path)
        return {"message": "Image deleted successfully"}
    else:
        raise HTTPException(status_code=404, detail="Image not found")