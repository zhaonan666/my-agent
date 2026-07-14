"use client";

import { useState } from "react";
import InputContainer from "./_componets/InputContainer";
import LeftBar from "./_componets/LeftBar";
import MessageContainer from "./_componets/MessageContainer";

export default function Home() {
  const [messages, setMessages] = useState([]);
  return (
    <div className="flex w-screen h-screen">
      <LeftBar />
      <div className="h-full w-full">
        <div className="w-3/4 h-full mx-auto flex flex-col justify-between">
          <MessageContainer messages={messages} />

          <InputContainer setMessages={setMessages} />
        </div>
      </div>
    </div>
  );
}
