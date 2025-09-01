from fastapi import APIRouter, File, UploadFile, Depends
from services import process_image
from dependencies import get_models

router = APIRouter()

@router.post("/predict")
async def predict(file: UploadFile = File(...), models: dict = Depends(get_models)):
    return await process_image(file, models)
