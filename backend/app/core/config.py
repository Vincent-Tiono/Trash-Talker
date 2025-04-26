# app/core/config.py
from pydantic import AnyHttpUrl, Field
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Supabase
    SUPABASE_URL: AnyHttpUrl = Field(..., description="Supabase project URL")
    SUPABASE_ANON_KEY: str = Field(..., description="Supabase anon/public key for token grant")
    SUPABASE_SERVICE_ROLE_KEY: str = Field(..., description="Supabase admin/service_role key for user verification")

    # AWS Bedrock
    AWS_ACCESS_KEY_ID: str = Field(..., description="AWS access key ID")
    AWS_SECRET_ACCESS_KEY: str = Field(..., description="AWS secret access key")
    AWS_SESSION_TOKEN: str = Field(..., description="AWS session token")
    AWS_REGION: str = Field("us-east-1", description="AWS region for Bedrock")
    BEDROCK_MODEL_ID: str = Field(..., description="Bedrock multimodal model ID")
    SYSTEM_PROMPT: str = Field(..., description="LangChain system prompt for the model")
    TEMPERATURE: float = Field(0.0, ge=0.0, le=1.0, description="Model temperature between 0 and 1")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

# Load settings from .env
settings = Settings()
