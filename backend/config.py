# app/core/config.py
from pydantic import BaseSettings, AnyHttpUrl, Field

class Settings(BaseSettings):
    # Supabase
    SUPABASE_URL: AnyHttpUrl
    SUPABASE_JWK_URL: AnyHttpUrl
    SUPABASE_AUDIENCE: str

    # AWS Bedrock
    AWS_REGION: str = Field("us-east-1", description="AWS 區域")
    BEDROCK_MODEL_ID: str = Field(
        "anthropic.claude-3-5-sonnet-20240620-v1:0",
        description="多模態模型 ID"
    )
    SYSTEM_PROMPT: str = Field(
        "你是一個垃圾分類助理，回覆必須嚴格以 JSON 格式。",
        description="LangChain System Prompt"
    )
    TEMPERATURE: float = Field(0.0, ge=0.0, le=1.0)

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()
