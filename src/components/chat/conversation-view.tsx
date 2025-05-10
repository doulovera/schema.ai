"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export function ConversationView() {
  // Sample conversation data
  const messages: Message[] = [
    {
      id: "1",
      role: "user",
      content: "Create a database schema for a blog with users, posts, and comments",
      timestamp: new Date(2023, 4, 10, 14, 30),
    },
    {
      id: "2",
      role: "assistant",
      content:
        "I've created a schema with three tables: Users, Posts, and Comments. Users have a one-to-many relationship with Posts, and Posts have a one-to-many relationship with Comments.",
      timestamp: new Date(2023, 4, 10, 14, 31),
    },
    {
      id: "3",
      role: "user",
      content: "Add a categories table and link it to posts",
      timestamp: new Date(2023, 4, 10, 14, 32),
    },
  ]

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
