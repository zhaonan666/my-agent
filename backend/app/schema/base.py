from typing import Any

from pydantic import BaseModel, Field


class BaseResponse(BaseModel):
    code: int = Field(..., description="响应状态码")
    message: str = Field(..., description="响应消息")
    data: str | dict[str, Any] | list[Any] | None = Field(
        default=None,
        description="响应数据",
    )
