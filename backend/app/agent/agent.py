from app.agent.memory import checkpointer
from app.agent.model import model
from app.agent.tools import get_current_time
from langchain.agents import create_agent

agent = create_agent(
    model=model,
    tools=[get_current_time],
    checkpointer=checkpointer,
)
