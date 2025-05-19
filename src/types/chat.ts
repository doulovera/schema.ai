export interface MessageRole {
  user: "user";
  assistant: "model";
}

export interface GeminiMessage {
  role: "user" | "model";
  parts: {
    text: string;
  }[];
}

export interface Message {
  id: string;
  timestamp: Date;
  role: "user" | "model";
  content: string;
}

export interface Schemas {
  sql: string;
  prisma: string;
  mongoose: string;
}

export interface Conversation {
  id: string;
  title: string;
  description: string;
  schemas: Schemas;
  diagram: Record<string, unknown>;
  messages: Message[];
}

export interface ConversationHistory {
  id: string;
  role: string;
  content: string;
  timestamp: number;
}