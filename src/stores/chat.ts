'use client'

import type { IThread } from '@/models/Thread'
import type { Roles, Message } from '@/types/chat'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import {
  sendUserMessage,
  normalizeChat,
  compareJsonSchemas,
  generateDatabaseScriptFromDiagram,
} from '@/lib/gemini'
import { updateThread, getThread, createThread } from '@/lib/thread'
import { useConfigStore } from './config'

const ROLES: Record<string, Roles> = {
  user: 'user',
  assistant: 'model',
}

interface ChatStore {
  conversations: string[]
  chatHistory: Message[] | null
  chatId: string | null
  chatDiagram: string | null
  chatSchemas: { sql: string; mongo: string }
  isLoading: boolean

  addMessageToChat: (role: Roles, text: string, diagram?: string) => void
  handleSendMessage: (messageText: string, chatId: string) => Promise<void>
  loadChatThread: (chatId: string, thread: IThread | null) => Promise<void>
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      conversations: [],
      chatHistory: null,
      chatId: null,
      chatDiagram: null,
      chatSchemas: { sql: '', mongo: '' },
      isLoading: false,

      addMessageToChat: (role: Roles, text: string, diagram?: string) => {
        const { chatHistory } = get()
        const newMessage: Message = {
          id: Date.now().toString(),
          role,
          message: text, // Textual content (e.g., user query, AI summary)
          diagram: diagram || '', // Diagram JSON string, if this message includes/is a diagram
          timestamp: Date.now(),
        }
        set({ chatHistory: [...(chatHistory || []), newMessage] })
      },

      handleSendMessage: async (messageText: string, chatId: string) => {
        const {
          addMessageToChat,
          chatHistory: currentLocalHistory,
          chatDiagram: currentDiagramInStore,
          chatSchemas,
        } = get()

        addMessageToChat(ROLES.user, messageText)
        set({ isLoading: true, chatId })

        const normalizedHistory = await normalizeChat(currentLocalHistory || [])

        try {
          const { responseText: aiDiagramResponse } = await sendUserMessage(
            normalizedHistory,
            messageText,
          )

          let summaryForChatMessage = 'Received new diagram.'
          if (
            currentDiagramInStore &&
            aiDiagramResponse &&
            currentDiagramInStore !== aiDiagramResponse
          ) {
            const comparisonResult = await compareJsonSchemas(
              currentDiagramInStore,
              aiDiagramResponse,
            )
            summaryForChatMessage = comparisonResult.summary
          } else if (aiDiagramResponse && !currentDiagramInStore) {
            summaryForChatMessage = 'He generado el diagrama. ☝️🤓'
          }

          addMessageToChat(
            ROLES.assistant,
            summaryForChatMessage,
            aiDiagramResponse,
          )

          const [sqlSchema, mongodbSchema] = await Promise.all([
            generateDatabaseScriptFromDiagram(aiDiagramResponse, 'sql'),
            generateDatabaseScriptFromDiagram(aiDiagramResponse, 'mongo'),
          ])

          set({
            chatSchemas: {
              sql: sqlSchema || '',
              mongo: mongodbSchema || '',
            },
          })

          set({ chatDiagram: aiDiagramResponse })

          const thread = await getThread(chatId)
          if (thread) {
            const updatedConversationHistory = get().chatHistory || []
            await updateThread(chatId, {
              diagram: aiDiagramResponse,
              conversation: updatedConversationHistory,
              schemas: chatSchemas,
            })
          } else {
            const { userId } = useConfigStore.getState()
            if (!userId) {
              throw new Error('User ID is not set in the config store.')
            }
            const newThread = await createThread(userId, {
              chat_id: chatId,
              diagram: aiDiagramResponse,
              conversation: get().chatHistory || [],
              schemas: chatSchemas,
            })
            set({ chatId: newThread.chat_id })
          }
        } catch (error) {
          console.error('Error sending message:', error)
          addMessageToChat(
            ROLES.assistant,
            `Sorry, I encountered an error: ${(error as Error).message}`,
          )
        } finally {
          set({ isLoading: false })
        }
      },

      loadChatThread: async (chatId: string, thread: IThread | null) => {
        set({ isLoading: true })
        try {
          if (thread) {
            set({
              chatId: thread.chat_id,
              chatHistory: thread.conversation,
              chatDiagram: thread.diagram,
              chatSchemas: thread.schemas,
              isLoading: false,
            })
          } else {
            set({
              chatId,
              chatHistory: [],
              chatDiagram: null,
              chatSchemas: { mongo: '', sql: '' },
              isLoading: false,
            })
          }
        } catch (error) {
          console.error('Error loading chat thread:', error)
          set({
            chatId,
            chatHistory: [],
            chatDiagram: null,
            chatSchemas: { mongo: '', sql: '' },
            isLoading: false,
          })
        }
      },
    }),
    {
      name: 'chat-storage',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)
