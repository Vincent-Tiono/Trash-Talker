# app/api/trash.py
from fastapi import APIRouter, UploadFile, Depends, HTTPException
import base64
from ..deps import get_current_user
from ..core.bedrock_service import BedrockService

router = APIRouter(prefix="/trash", tags=["trash"])
bedrock = BedrockService()

@router.post("/scan_trash")
async def scan_trash(image: UploadFile, user=Depends(get_current_user)):
    data = await image.read()
    b64 = base64.b64encode(data).decode()
    try:
        return bedrock.classify_trash(b64)
    except Exception as e:
        raise HTTPException(500, f"分類失敗: {e}")

@router.post("/prove_disposal")
async def prove_disposal(image: UploadFile, user=Depends(get_current_user)):
    data = await image.read()
    b64 = base64.b64encode(data).decode()
    try:
        return bedrock.verify_disposal(b64)
    except Exception as e:
        raise HTTPException(500, f"驗證失敗: {e}")
