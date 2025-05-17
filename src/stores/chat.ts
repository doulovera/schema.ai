import type { ConversationHistory } from '@/types/chat'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

import { generateXmlFromDescription } from "@/lib/gemini";

/**
 * "chat" is the item of the conversations
 */

const ROLES = {
  user: 'user',
  assistant: 'assistant',
}

interface ChatStore {
  conversations: string[], // Array of chat IDs
  chatHistory: ConversationHistory[] | null,
  chatId: string | null,
  chatDiagram: string | null,
  chatSchemas: string | null,
  isLoading: boolean,

  addMessageToChat: (role: typeof ROLES[keyof typeof ROLES], message: string) => void,
  createNewChat: (message: string) => Promise<void>,
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      conversations: [],
      chatHistory: null,
      chatId: null,
      chatDiagram: null,
      chatSchemas: null,
      isLoading: false,

      addMessageToChat: (role: typeof ROLES[keyof typeof ROLES], message: string) => {
        const { chatHistory } = get()
        const newMessage = {
          id: Date.now().toString(),
          role,
          content: message,
          timestamp: Date.now(),
        }
        set({ chatHistory: [...(chatHistory || []), newMessage] })
      },
      createNewChat: async (message: string) => {
        const { addMessageToChat } = get()

        addMessageToChat(ROLES.user, message)
        // store in DB

        set({ isLoading: true })
        const response = await generateXmlFromDescription(message)

        if (response) {
          addMessageToChat(ROLES.assistant, '¡Diagrama generado exitosamente!')
          // store in DB
          set({
            chatDiagram: response,
            isLoading: false
          })
        }
      },
    }),
    {
      name: 'chat-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
