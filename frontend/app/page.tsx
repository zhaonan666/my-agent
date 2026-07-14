"use client";
import { Input, Button } from "antd";
import { useState } from "react";

import { PlusOutlined } from "@ant-design/icons";

export default function Home() {
  const [messages, setMessages] = useState([
    { role: "ai", content: "你好" },
    { role: "human", content: "你是什么模型?" },
  ]);

  return (
    <div>
      <div>
        {messages.map((item, index) => {
          return <div>{item.content}</div>;
        })}
      </div>

      <div className="flex flex-col">
        <Input placeholder="要求后续变更" variant="borderless" />
        <div>
          <PlusOutlined />
        </div>
      </div>
    </div>
  );
}
