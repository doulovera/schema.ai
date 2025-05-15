"use client";
// imports
import { createContext, useState, useReducer, useEffect } from "react";
import { createConversation } from "@/lib/chat-utils";
import conversationReducer from "@/reducers/chat-reducer";
import { generateXML } from "@/lib/gemini-utils";
// creating context
export const ChatContext = createContext({});
// context provider
export const ChatProvider = ({ children }) => {
  const [xml, setXml] = useState("");
  const [conversation, conversationDispatch] = useReducer(
    conversationReducer,
    createConversation()
  );

  useEffect(() => {
    async function generateAndLogXML() {
      if (conversation.messages.length === 0) return;

      const lastMessage =
        conversation.messages[conversation.messages.length - 1].content;
      const generatedXml = await generateXML(lastMessage);

      setXml(generatedXml);
    }

    generateAndLogXML();
  }, [conversation]);

  return (
    <ChatContext.Provider value={{ xml, conversation, conversationDispatch }}>
      {children}
    </ChatContext.Provider>
  );
};
