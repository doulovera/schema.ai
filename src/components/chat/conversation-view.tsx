"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useChatStore } from "@/stores/chat"

export function ConversationView() {
  const { chatHistory, isLoading } = useChatStore();
  
  return (
    <div className="space-y-4">
      {chatHistory?.map((message) => (
        <Card key={message.id} className={`p-3 ${message.role === "model" ? "bg-muted" : ""}`}>
          <div className="flex justify-between items-start mb-1">
            <Badge variant={message.role === "user" ? "default" : "secondary"}>
              {message.role === "user" ? "Tú" : "AI"}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {new Date(message.timestamp).toLocaleString("es-ES", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <p className="text-sm">{message.message}</p>
        </Card>
      ))}

      {
        isLoading && (
          <div className="flex justify-center items-center py-5">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-foreground" />
          </div>
        )
      }
    </div>
  )
}
