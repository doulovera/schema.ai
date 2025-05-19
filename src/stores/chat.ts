import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Roles, Message } from '@/types/chat'
import {
  sendUserMessage,
  normalizeChat,
  compareJsonSchemas,
} from '@/lib/gemini'
import { updateThread, getThread, createThread } from '@/lib/thread'

const ROLES: Record<string, Roles> = {
  user: 'user',
  assistant: 'model',
}

interface ErrorWithNumericCode extends Error {
  code: number
}

function isErrorWithNumericCode(e: unknown): e is ErrorWithNumericCode {
  return (
    e instanceof Error &&
    'code' in e &&
    typeof (e as { code: unknown }).code === 'number'
  )
}

interface ChatStore {
  conversations: string[]
  chatHistory: Message[] | null
  chatId: string | null
  chatDiagram: string | null
  chatSchemas: string | null
  isLoading: boolean

  addMessageToChat: (role: Roles, text: string, diagram?: string) => void
  handleSendMessage: (messageText: string, chatId: string) => Promise<void>
  loadChatThread: (chatId: string) => Promise<void>
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
            summaryForChatMessage = 'Initial diagram generated.'
          }

          addMessageToChat(
            ROLES.assistant,
            summaryForChatMessage,
            aiDiagramResponse,
          )

          set({ chatDiagram: aiDiagramResponse })

          const thread = await getThread(chatId)
          if (thread) {
            const updatedConversationHistory = get().chatHistory || []
            await updateThread(chatId, {
              diagram: aiDiagramResponse,
              conversation: updatedConversationHistory,
              schemas: {
                sql: thread.schemas.sql || '',
                mongodb: thread.schemas.mongodb || '',
              },
            })
          } else {
            const newThread = await createThread({
              chat_id: chatId,
              diagram: aiDiagramResponse,
              conversation: get().chatHistory || [],
              schemas: {
                sql: '',
                mongodb: '',
              },
            })
            set({ chatId: newThread.chat_id })
          }
        } catch (error: unknown) {
          console.error('Error sending message:', error)
          if (isErrorWithNumericCode(error) && error.code === 503) {
            addMessageToChat(
              ROLES.assistant,
              'Los servidores fallan. Parece que están echando una siesta... ¡pero nosotros no! Prueba de nuevo, a ver si se despiertan.',
            )
          } else if (error instanceof Error) {
            addMessageToChat(
              ROLES.assistant,
              `Lo siento, encontré un error: ${error.message}`,
            )
          } else {
            addMessageToChat(
              ROLES.assistant,
              'Lo siento, ocurrió un error desconocido al enviar el mensaje.',
            )
          }
        } finally {
          set({ isLoading: false })
        }
      },

      loadChatThread: async (chatId: string) => {
        set({ isLoading: true })
        try {
          const thread = await getThread(chatId)
          if (thread) {
            set({
              chatId: thread.chat_id,
              chatHistory: thread.conversation,
              chatDiagram: thread.diagram, // Load the latest overall diagram for the thread
              chatSchemas: JSON.stringify(thread.schemas), // For display of SQL/MongoDB schemas
              isLoading: false,
            })
          } else {
            set({
              chatId,
              chatHistory: [],
              chatDiagram: null,
              chatSchemas: null,
              isLoading: false,
            })
          }
        } catch (error) {
          console.error('Error loading chat thread:', error)
          set({
            chatId,
            chatHistory: [],
            chatDiagram: null,
            chatSchemas: null,
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
