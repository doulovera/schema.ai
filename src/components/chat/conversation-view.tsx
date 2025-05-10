"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export function ConversationView({ messages }: { messages: Message[] }) {
  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <Card key={message.id} className={`p-3 ${message.role === "assistant" ? "bg-muted" : ""}`}>
          <div className="flex justify-between items-start mb-1">
            <Badge variant={message.role === "user" ? "default" : "secondary"}>
              {message.role === "user" ? "You" : "AI"}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
          <p className="text-sm">{message.content}</p>
        </Card>
      ))}
    </div>
  )
}
