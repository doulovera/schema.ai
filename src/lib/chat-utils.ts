import type { Conversation, Message, MessageRole } from '@/types/chat';

export function createConversation({
  title = 'Nueva conversación',
  description = '',
}: {
  title?: string;
  description?: string;
} = {}): Conversation {
  return {
    id: crypto.randomUUID(), // o usa algún generador UUID de tu preferencia
    title,
    description,
    schemas: {
      sql: '',
      prisma: '',
      mongoose: '',
    },
    diagram: {},
    messages: [],
  };
}

export function addMessageToConversation(
  conversation: Conversation,
  role: MessageRole,
  content: string
): Conversation {
  const newMessage: Message = {
    id: crypto.randomUUID(),
    role,
    content,
    timestamp: new Date(),
  };
  return {
    ...conversation,
    messages: [...conversation.messages, newMessage],
  };
}
