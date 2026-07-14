from datetime import datetime

from langchain.tools import tool


@tool
def get_current_time() -> str:
    """返回服务器当前的日期和时间。当用户询问当前日期或时间时使用。"""
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")
