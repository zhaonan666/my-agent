from pydantic import Field, SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    api_key: SecretStr = Field(
        validation_alias="DASHSCOPE_API_KEY",
    )

    base_url: str = Field(
        validation_alias="DASHSCOPE_BASE_URL",
    )

    model: str = Field(
        validation_alias="DASHSCOPE_MODEL",
    )

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
