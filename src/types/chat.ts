export interface MessageRole {
  user: 'user';
  assistant: 'assistant';
}

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
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