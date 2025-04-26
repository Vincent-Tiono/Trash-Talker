# app/api/trash.py
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from ..deps import get_current_user_from_token
from ..core.bedrock_service import BedrockService
import json

router = APIRouter(prefix="/trash", tags=["trash"])
bedrock = BedrockService()


class ImageWithToken(BaseModel):
    access_token: str
    image_base64: str

@router.post("/scan_trash")
async def scan_trash(payload: ImageWithToken):
    # 1. 驗證 user
    user = get_current_user_from_token(payload.access_token)
    # 2. 處理影像
    b64 = payload.image_base64.split("base64,")[-1]
    try:
        resp = bedrock.classify_trash(b64)
        return resp
        # return {"user": user, **resp}
    except Exception as e:
        print(e)
        raise HTTPException(500, f"分類失敗: {e}")

@router.post("/prove_disposal")
async def prove_disposal(payload: ImageWithToken):
    user = get_current_user_from_token(payload.access_token)
    b64 = payload.image_base64.split("base64,")[-1]
    try:
        resp = bedrock.verify_disposal(b64)
        return resp
    except Exception as e:
        raise HTTPException(500, f"驗證失敗: {e}")
