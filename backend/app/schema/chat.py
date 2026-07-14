from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    message: str = Field(..., description="用户输入的消息")


class ChatResponse(BaseModel):
    answer: str = Field(..., description="模型生成的回答")
    tools_used: list[str] = Field(..., description="模型使用的工具列表")
