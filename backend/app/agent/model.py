from app.config import settings
from langchain.chat_models import init_chat_model

model = init_chat_model(
    model=settings.model,
    model_provider="openai",
    api_key=settings.api_key.get_secret_value(),
    base_url=settings.base_url,
    temperature=0,
)
