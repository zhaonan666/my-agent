import { Input, Button, message } from "antd";
import { useState } from "react";
import request from "../service/request";

import {
  PlusOutlined,
  AudioOutlined,
  ArrowUpOutlined,
} from "@ant-design/icons";
import { Message } from "./_types/chat";
import { streamChat } from "../service/stream-chat";

const InputContainer = ({
  setMessages,
}: {
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}) => {
  const [inputValue, setInputValue] = useState("");
  const handleSendMessage = async () => {
    if (inputValue.trim() === "") {
      return;
    }
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "human", content: inputValue },
    ]);
    setInputValue("");

    await streamChat(inputValue, "1", (content) => {
      setMessages((prevMessages) => {
        const lastMessage = prevMessages[prevMessages.length - 1];
        if (lastMessage.role === "ai") {
          // 如果最后一条消息是 ai 的，直接更新它的内容
          return [
            ...prevMessages.slice(0, -1),
            { ...lastMessage, content: lastMessage.content + content },
          ];
        } else {
          // 否则，添加一条新的 agent 消息
          return [...prevMessages, { role: "ai", content }];
        }
      });
    });
  };

  return (
    <div className="mb-5 flex shrink-0 items-center gap-2 rounded-xl border border-gray-300 bg-white p-2">
      <Button icon={<PlusOutlined />} type="text" />
      <Input
        placeholder="问问 Agent"
        variant="borderless"
        className="!border-none !shadow-none !outline-none"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onPressEnter={handleSendMessage}
      />
      <Button icon={<AudioOutlined />} type="text" />
      <Button
        icon={<ArrowUpOutlined />}
        type="text"
        onClick={handleSendMessage}
      />
    </div>
  );
};

export default InputContainer;
