import PageContent from "./page-content";
import { ChatProvider } from "@/context/chat/ChatContext";
// export default
export default async function TestPage() {
  // Page
  return (
    <ChatProvider>
      <PageContent />
    </ChatProvider>
  );
}
