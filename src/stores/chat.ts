import type { ConversationHistory } from '@/types/chat'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

import { generateJsonFromDescription } from "@/lib/gemini";
import { createThread, updateThread, getThread } from '@/lib/thread';

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
  handleSendMessage: (message: string, chatId: string) => Promise<void>, 
  loadChatThread: (chatId: string) => Promise<void>; // Add new function for loading thread
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
      handleSendMessage: async (message: string, chatId: string) => {
        const { addMessageToChat } = get(); // Get only necessary functions initially
        addMessageToChat(ROLES.user, message);
        set({ isLoading: true, chatId });

        const response = await generateJsonFromDescription(message);

        if (response) {
          addMessageToChat(ROLES.assistant, '¡Diagrama generado exitosamente!');
          const newDiagram = JSON.stringify(response);

          set({
            chatDiagram: newDiagram,
            isLoading: false, // Set isLoading to false here after UI-related updates
          });

          try {
            // Get the latest chatHistory from the store *after* all messages for this turn are added
            const latestChatHistory = get().chatHistory || [];
            const existingThread = await getThread(chatId);

            if (existingThread) {
              await updateThread(chatId, {
                conversation: latestChatHistory, // Use latest chat history
                diagram: newDiagram,
              });
            } else {
              await createThread({
                chat_id: chatId,
                diagram: newDiagram,
                schemas: {
                  sql: '', 
                  mongodb: '' 
                },
                conversation: latestChatHistory, // Use latest chat history
              });
            }
          } catch (error) {
            console.error('Error handling thread:', error);
            // Optionally set an error state in the store
          }
        } else {
          // If diagram generation fails or returns no response
          set({ isLoading: false });
        }
      },

      loadChatThread: async (chatId: string) => {
        const currentStoreState = get();
        // Prevent re-fetching if data for this chatId is already loaded and seems complete,
        // or if a load is already in progress for this exact chatId.
        if (currentStoreState.isLoading && currentStoreState.chatId === chatId) return;
        if (currentStoreState.chatId === chatId && currentStoreState.chatHistory !== null) {
          return;
        }

        set({ isLoading: true, chatId: chatId, chatHistory: null, chatDiagram: null, chatSchemas: null });
        try {
          const threadData = await getThread(chatId);
          if (threadData) {
            set({
              chatHistory: threadData.conversation,
              chatDiagram: threadData.diagram,
              chatSchemas: threadData.schemas ? JSON.stringify(threadData.schemas) : null,
              chatId: threadData.chat_id, // Ensure this is set from loaded data
              isLoading: false,
            });
          } else {
            // Thread not found in DB, reset relevant store fields for this chatId
            set({
              chatHistory: null,
              chatDiagram: null,
              chatSchemas: null,
              // chatId is already set from the parameter
              isLoading: false,
            });
          }
        } catch (error) {
          console.error('Error loading thread:', error);
          set({ isLoading: false, chatId: chatId, chatHistory: null, chatDiagram: null, chatSchemas: null }); // Reset on error
        }
      },
    }),
    {
      name: 'chat-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)
