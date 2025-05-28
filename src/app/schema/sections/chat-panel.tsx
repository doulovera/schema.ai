import { ConversationView } from "@/components/chat/conversation-view";
import { ChatInput } from "@/components/chat/chat-input";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useEffect, useRef } from "react";
import { useChatStore } from "@/stores/chat";

export default function Chat({ hidePanel }: { hidePanel: () => void }) {
  const { chatHistory, isLoading } = useChatStore()
  const scrollRef = useRef<HTMLDivElement>(null)

  // biome-ignore lint/correctness/useExhaustiveDependencies: no need
  useEffect(() => {
    const scrollToBottom = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight
      }
    }

    // Múltiples intentos de scroll para asegurar que funcione
    scrollToBottom()
    const timeoutId1 = setTimeout(scrollToBottom, 50)
    const timeoutId2 = setTimeout(scrollToBottom, 200)

    return () => {
      clearTimeout(timeoutId1)
      clearTimeout(timeoutId2)
    }
  }, [chatHistory, isLoading])

  // También scroll cuando cambia específicamente la longitud del historial
  // biome-ignore lint/correctness/useExhaustiveDependencies: chatHistory?.length is intentional
  useEffect(() => {
    if (scrollRef.current && chatHistory) {
      // Usar requestAnimationFrame para asegurar que el DOM esté actualizado
      requestAnimationFrame(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
      })
    }
  }, [chatHistory?.length])

  return (
    <div className="flex flex-col h-full border-r">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-medium">Chat</h2>
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
          <div
            className="flex-1 overflow-y-auto overflow-x-hidden px-2 pb-4 scrollbar-thin scrollbar-thumb-primary scrollbar-track-transparent scrollbar-thumb-rounded"
            ref={scrollRef}
          >
            <ConversationView />
          </div>
          <div className="pt-4 px-2 border-t">
            <ChatInput />
          </div>
        </div>
      </div>
    </div>
  )
}
