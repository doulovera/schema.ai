import type { ConversationHistory } from '@/types/chat'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

import { generateJsonFromDescription } from "@/lib/gemini";
import { createThread, updateThread } from '@/lib/thread';

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
  createNewConversation: (message: string) => Promise<void>,
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
      createNewConversation: async (message: string) => {
        const { addMessageToChat, chatHistory } = get()

        addMessageToChat(ROLES.user, message)

        set({ isLoading: true })
        const response = await generateJsonFromDescription(message)

        if (response) {
          addMessageToChat(ROLES.assistant, '¡Diagrama generado exitosamente!')

          const chatId = crypto.randomUUID()

          const diagram = JSON.stringify(response)

          set({
            chatId,
            chatDiagram: diagram,
            isLoading: false
          })

          try {
            await createThread({
              chat_id: chatId,
              diagram: diagram,
              schemas: {
                sql: '',
                mongodb: ''
              },
              conversation: chatHistory || [],
            })
          } catch (error) {
            console.error('Error creating thread:', error)
          }
        }
      },
      sendMessageToConversation: async (message: string, chatId: string) => {
        const { addMessageToChat, chatHistory } = get()
        addMessageToChat(ROLES.user, message)

        set({ isLoading: true })
        const response = await generateJsonFromDescription(message)

        if (response) {
          addMessageToChat(ROLES.assistant, '¡Diagrama generado exitosamente!')
          const diagram = JSON.stringify(response)

          set({
            chatDiagram: diagram,
            isLoading: false
          })

          try {
            await updateThread(chatId, {
              conversation: [
                ...(chatHistory || []),
                {
                  id: Date.now().toString(),
                  role: ROLES.assistant,
                  content: '¡Diagrama generado exitosamente!',
                  timestamp: Date.now(),
                }
              ],
              diagram,
            })

          } catch (error) {
            console.error('Error updating thread:', error)
          }
        }
      }
    }),
    {
      name: 'chat-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
