from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    MFC_URL: str = "http://localhost:8081"
    HV_URL:  str = "http://localhost:8082"
    VAC_URL: str = "http://localhost:8083"
    ORCH_PORT: int = 8090

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

settings = Settings()
