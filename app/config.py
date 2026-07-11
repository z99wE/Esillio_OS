from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str = "Esillio OS"
    VERSION: str = "0.1.0"
    DESCRIPTION: str = "The Persistence Layer for Human Biology"
    DATABASE_URL: str = "sqlite:///./data/esillio.db"

    class Config:
        env_file = ".env"


settings = Settings()