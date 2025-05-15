import { useContext } from "react";
import PageContent from "./page-content";
import { ChatContext, ChatProvider } from "@/context/chat/ChatContext";
// export default
export default async function TestPage() {
  // Page
  return (
    <ChatProvider>
      <PageContent />
    </ChatProvider>
  );
}
