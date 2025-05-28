import { ConversationView } from "@/components/chat/conversation-view";
import { ChatInput } from "@/components/chat/chat-input";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useEffect, useRef, useMemo } from 'react'
import { useChatStore } from "@/stores/chat";
import { useParams } from 'next/navigation'

export default function Chat({ hidePanel }: { hidePanel: () => void }) {
  const { chatHistory, isLoading, chatDiagram } = useChatStore()
  const scrollRef = useRef<HTMLDivElement>(null)
  const params = useParams()

  // Obtener el nombre de la base de datos desde el diagrama actual
  const dbName = useMemo(() => {
    if (!chatDiagram) return 'Cargando...'
    try {
      const parsed = JSON.parse(chatDiagram)
      return parsed?.database?.name || 'Chat'
    } catch {
      return 'Chat'
    }
  }, [chatDiagram])

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
        <h2 className="text-lg font-medium truncate max-w-[70%]" title={dbName}>
          {dbName}
        </h2>
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
