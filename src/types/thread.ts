import type { IThread } from '@/models/Thread'
import type { Message } from '@/types/chat'

// Tipo extendido que incluye la conversación
export type ThreadWithConversation = IThread & { conversation?: Array<Message> }
