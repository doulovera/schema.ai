export type Roles = 'user' | 'model'

export interface MessageRole {
  user: 'user'
  assistant: 'model'
}

export interface GeminiMessage {
  role: Roles
  parts: {
    text: string
  }[]
}

export interface Message {
  id: string
  timestamp: number
  role: Roles
  diagram: string
  message: string
}

export interface Schemas {
  sql: string
  prisma: string
  mongoose: string
}

export interface Conversation {
  id: string
  title: string
  description: string
  schemas: Schemas
  diagram: Record<string, unknown>
  messages: Message[]
}

export interface ConversationHistory extends Message {}
