"use client";

import { Message } from "./_types/chat";

const MessageContainer = ({ messages = [] }: { messages?: Message[] }) => {
  if (messages.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-full">
        <div>还没有消息</div>
        <div>输入问题，开始和 Agent 对话</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {messages.map((item, index) => {
        return (
          <div key={index}>
            <div
              className={`flex ${item.role === "ai" ? "justify-start" : "justify-end"} mb-2 items-center`}
            >
              <div
                className={`flex ${item.role === "ai" ? "flex-row" : "flex-row-reverse"} items-center`}
              >
                <div
                  className={`mx-2 ${item.role === "ai" ? "text-gray-500" : "text-blue-500"} border rounded-full px-2 py-1 text-sm font-semibold`}
                >
                  {item.role === "ai" ? "AI" : "你"}
                </div>
                <div
                  className={`p-2 rounded-lg ${item.role === "ai" ? "bg-gray-200" : "bg-blue-500 text-white"}`}
                >
                  {item.content}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageContainer;
