"use client";
// imports
import type { ReactNode } from "react";
import { createContext, useState, useReducer } from "react";
import { createConversation } from "@/lib/chat-utils";
import conversationReducer from "@/reducers/chat-reducer";
import { generateXML } from "@/lib/gemini-utils";
// creating context
export const ChatContext = createContext({});
// ChatProviderProps
type ChatProviderProps = {
  children: ReactNode;
};
// context provider
export const ChatProvider = ({ children }: ChatProviderProps) => {
  const [xml, setXml] = useState("");
  const [conversation, conversationDispatch] = useReducer(
    conversationReducer,
    createConversation()
  );

  return (
    <ChatContext.Provider value={{ xml, conversation, conversationDispatch }}>
      {children}
    </ChatContext.Provider>
  );
};
