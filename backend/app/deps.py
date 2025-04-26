# app/deps.py
import requests
from fastapi import HTTPException, Depends
from .core.config import settings

def get_current_user_from_token(access_token: str):
    if not access_token:
        raise HTTPException(401, "未提供 access_token")
    headers = {
        "apikey": settings.SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {access_token}"
    }
    r = requests.get(f"{settings.SUPABASE_URL}/auth/v1/user", headers=headers)
    if r.status_code != 200:
        raise HTTPException(401, "Token 驗證失敗或已過期")
    user = r.json()
    return {"user_id": user["id"], "email": user.get("email")}

