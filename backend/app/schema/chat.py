from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    message: str = Field(..., description="用户输入的消息")
    thread_id: str = Field(..., description="会话线程ID")


class StreamEvent(BaseModel):
    type: str
    data: str
