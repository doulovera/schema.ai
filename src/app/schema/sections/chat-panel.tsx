import { ConversationView } from "@/components/chat/conversation-view";
import { ChatInput } from "@/components/chat/chat-input";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useEffect, useRef } from "react";
import { useChatStore } from "@/stores/chat";

const getChatTitle = (chatDiagram: any) => {
  if (chatDiagram) {
    const parsed = JSON.parse(chatDiagram);
    console.log(parsed);
    return parsed.database.name || "Chat";
  }
  return "Chat";
};

export default function Chat({ hidePanel }: { hidePanel: () => void }) {
  const { chatHistory, isLoading, chatDiagram } = useChatStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: no need
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [isLoading, chatHistory]);

  return (
    <div className="flex flex-col h-full border-r">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-medium">{getChatTitle(chatDiagram)}</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={hidePanel}
          aria-label="Ocultar Espacio 1"
        >
          <ChevronLeft className="" />
        </Button>
      </div>
      <div className="flex-1 overflow-auto p-4 flex items-center justify-center">
        <div className="flex flex-col h-full w-full">
          <div className="flex-1 overflow-auto px-2 pb-4" ref={scrollRef}>
            <ConversationView />
          </div>
          <div className="pt-4 px-2 border-t">
            <ChatInput />
          </div>
        </div>
      </div>
    </div>
  );
}
