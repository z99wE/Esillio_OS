from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "Esillio OS"
    VERSION: str = "0.1.0"
    DESCRIPTION: str = "The Persistence Layer for Human Biology"
    JWT_SECRET_KEY: str = Field(default="dev-only-change-me")
    JWT_ACCESS_TOKEN_EXPIRE_DAYS: int = 7
    ENABLE_GUEST_LOGIN: bool = True
    FREE_DAILY_CREDITS: int = 5
    PAID_DAILY_CREDITS: int = 20
    MAX_UPLOAD_MB: int = 10
    ADMIN_EMAIL: str = ""
    SUPABASE_URL: str = ""
    SUPABASE_ANON_KEY: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
