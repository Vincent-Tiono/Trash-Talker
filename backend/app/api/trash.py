# app/api/trash.py
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
import base64
from ..deps import get_current_user
from ..core.bedrock_service import BedrockService

router = APIRouter(prefix="/trash", tags=["trash"])
bedrock = BedrockService()

class ImagePayload(BaseModel):
    image_base64: str

@router.post("/scan_trash")
async def scan_trash(
    payload: ImagePayload,
    user=Depends(get_current_user)
):
    # 如果前端帶有 data URI 前綴，要去掉
    b64 = payload.image_base64.split("base64,")[-1]
    try:
        resp = await bedrock.classify_trash(b64)
        return resp
    except Exception as e:
        raise HTTPException(500, f"分類失敗: {e}")

@router.post("/prove_disposal")
async def prove_disposal(
    payload: ImagePayload,
    user=Depends(get_current_user)
):
    b64 = payload.image_base64.split("base64,")[-1]
    try:
        resp = await bedrock.verify_disposal(b64)
        return resp
    except Exception as e:
        raise HTTPException(500, f"驗證失敗: {e}")
