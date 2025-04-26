# app/deps.py
from fastapi import Request, HTTPException, Depends
from jose import jwt, JWTError
from .core.config import settings
import requests

_cached_jwks = None
def get_jwks():
    global _cached_jwks
    if not _cached_jwks:
        _cached_jwks = requests.get(settings.SUPABASE_JWK_URL).json()
    return _cached_jwks

async def get_current_user(request: Request):
    token = request.cookies.get("sb_access_token") or ""
    if not token:
        raise HTTPException(401, "未提供 token")
    try:
        claims = jwt.decode(
            token,
            get_jwks(),
            audience=settings.SUPABASE_AUDIENCE,
            options={"verify_aud": True}
        )
    except JWTError:
        raise HTTPException(401, "Token 驗證失敗")
    return {"user_id": claims["sub"], "email": claims.get("email")}
