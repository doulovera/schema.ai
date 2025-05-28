'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Message, Roles } from '@/types/chat'
import type { IThread } from '@/models/Thread'
import type { ThreadWithConversation } from '@/types/thread'
import {
  sendUserMessage,
  normalizeChat,
  compareJsonSchemas,
  generateDatabaseScriptFromDiagram,
  validateUserIntent,
  getRandomWelcomeMessage,
} from '@/lib/gemini' // Asegúrate que la ruta sea correcta
import { getThread, updateThread, createThread } from '@/lib/thread'
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
  loadChatThread: (
    chatId: string,
    thread: ThreadWithConversation | null,
  ) => Promise<void>
  regenerateSchemasIfNeeded: (chatId: string, diagram: string) => Promise<void>
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

        // <<< VALIDAR INTENCIÓN DEL USUARIO
        const validationResult = await validateUserIntent(messageText)
        if (!validationResult.isValid) {
          addMessageToChat(ROLES.assistant, validationResult.message)
          set({ isLoading: false })
          return
        }
        // >>> FIN VALIDACIÓN

        const normalizedHistory = await normalizeChat(currentLocalHistory || [])

        try {
          const { responseText: aiDiagramResponse } = await sendUserMessage(
            normalizedHistory,
            messageText,
          )

          let summaryForChatMessage =
            'El diagrama se ha procesado y no presenta cambios respecto a la versión anterior.'
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
            summaryForChatMessage =
              'He generado el nuevo diagrama de acuerdo a tu solicitud.'
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

          const newSchemas = {
            sql: sqlSchema.replaceAll(';;', ';\n') || '',
            mongo: mongodbSchema || '',
          }

          set({
            chatSchemas: newSchemas,
          })

          set({ chatDiagram: aiDiagramResponse })

          const thread = await getThread(chatId)
          if (thread) {
            const updatedConversationHistory = get().chatHistory || []
            await updateThread(chatId, {
              diagram: aiDiagramResponse,
              conversation: updatedConversationHistory,
              schemas: newSchemas,
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
              schemas: newSchemas,
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

      // ✅ REEMPLAZAR loadChatThread con esta versión optimizada:
      loadChatThread: async (
        chatId: string,
        thread: ThreadWithConversation | null,
      ) => {
        const currentState = get()

        // ✅ Prevenir llamadas duplicadas
        if (currentState.isLoading && currentState.chatId === chatId) {
          console.log('🚫 LoadChatThread already in progress for:', chatId)
          return
        }

        // ✅ Si ya tenemos este chat cargado, no recargar
        if (
          currentState.chatId === chatId &&
          Array.isArray(currentState.chatHistory) &&
          currentState.chatHistory.length > 0
        ) {
          console.log('✅ Chat already loaded:', chatId)
          return
        }

        console.log('🔄 Loading chat thread:', chatId)
        set({ isLoading: true, chatId })

        try {
          if (thread) {
            set({
              chatId: thread.chat_id,
              chatHistory: thread.conversation || [],
              chatDiagram: thread.diagram,
              chatSchemas: thread.schemas || { mongo: '', sql: '' },
              isLoading: false,
            })

            // ✅ Regenerar esquemas automáticamente si es necesario
            await get().regenerateSchemasIfNeeded(
              thread.chat_id,
              thread.diagram,
            )
          } else {
            const welcome = await getRandomWelcomeMessage()
            set({
              chatId,
              chatHistory: [
                {
                  id: Date.now().toString(),
                  role: ROLES.assistant,
                  message: welcome,
                  diagram: '',
                  timestamp: Date.now(),
                },
              ],
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

      // ✅ Función auxiliar para regenerar esquemas si están vacíos
      regenerateSchemasIfNeeded: async (chatId: string, diagram: string) => {
        const { chatSchemas } = get()

        // Solo regenerar si no hay esquemas o están vacíos
        if (diagram && !chatSchemas.sql.trim() && !chatSchemas.mongo.trim()) {
          console.log('🔄 Regenerating missing schemas for existing thread')

          try {
            const [sqlSchema, mongodbSchema] = await Promise.all([
              generateDatabaseScriptFromDiagram(diagram, 'sql'),
              generateDatabaseScriptFromDiagram(diagram, 'mongo'),
            ])

            const newSchemas = {
              sql: sqlSchema.replaceAll(';;', ';\n') || '',
              mongo: mongodbSchema || '',
            }

            set({ chatSchemas: newSchemas })

            // Actualizar el thread en la base de datos
            await updateThread(chatId, { schemas: newSchemas })

            console.log('✅ Schemas regenerated successfully')
          } catch (error) {
            console.error('❌ Error regenerating schemas:', error)
          }
        }
      },
    }),
    {
      name: 'chat-storage',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)