import type { ConversationHistory, Roles } from '@/types/chat'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

import {
  compareJsonSchemas,
  normalizeChat,
  initializeChat,
} from "@/lib/gemini";
import { createThread, updateThread, getThread } from "@/lib/thread";
import type { Chat } from "@google/genai";

/**
 * "chat" is the item of the conversations
 */

const ROLES: Record<string, Roles> = {
  user: "user",
  assistant: "model",
};

interface ChatStore {
  modelChat: Chat | null;
  conversations: string[]; // Array of chat IDs
  chatHistory: ConversationHistory[] | null;
  chatId: string | null;
  chatDiagram: string | null;
  chatSchemas: string | null;
  isLoading: boolean;

  addMessageToChat: (
    role: Roles,
    message: string
  ) => void;
  handleSendMessage: (message: string, chatId: string) => Promise<void>;
  loadChatThread: (chatId: string) => Promise<void>; // Add new function for loading thread
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      modelChat: null,
      conversations: [],
      chatHistory: null,
      chatId: null,
      chatDiagram: null,
      chatSchemas: null,
      isLoading: false,

      addMessageToChat: (
        role: Roles,
        message: string
      ) => {
        const { chatHistory } = get();
        const newMessage = {
          id: Date.now().toString(),
          role,
          content: message,
          timestamp: Date.now(),
        };
        set({ chatHistory: [...(chatHistory || []), newMessage] });
      },

      handleSendMessage: async (message: string, chatId: string) => {
        const { addMessageToChat, chatDiagram: currentChatDiagram } = get();
        addMessageToChat(ROLES.user, message);
        set({ isLoading: true, chatId });

        const initialResponse = await generateJsonFromDescription(message);

        if (
          initialResponse &&
          typeof initialResponse === "object" &&
          !("error" in initialResponse)
        ) {
          let newDiagramJson = JSON.stringify(initialResponse);
          let summaryMessage: string | null = null;

          if (currentChatDiagram) {
            try {
              // Ensure currentChatDiagram and newDiagramJson are valid JSON strings before parsing/comparing
              const { summary, newSchema } = await compareJsonSchemas(
                currentChatDiagram,
                newDiagramJson
              );
              if (summary && summary !== "No summary text from Gemini") {
                summaryMessage = summary;
              }
              if (
                newSchema &&
                typeof newSchema === "object" &&
                !("error" in newSchema)
              ) {
                newDiagramJson = JSON.stringify(newSchema);
              } else if (
                newSchema &&
                typeof newSchema === "object" &&
                "error" in newSchema
              ) {
                console.error(
                  "Error in new schema generation:",
                  (newSchema as { error: string }).error
                );
                addMessageToChat(
                  ROLES.assistant,
                  `Error al actualizar el diagrama: ${
                    (newSchema as { error: string }).error
                  }`
                );
              }
            } catch (error) {
              console.error("Error comparing JSON schemas:", error);
              addMessageToChat(
                ROLES.assistant,
                "Error al comparar los esquemas del diagrama."
              );
            }
          }

          if (summaryMessage) {
            addMessageToChat(ROLES.assistant, summaryMessage);
          } else {
            addMessageToChat(
              ROLES.assistant,
              "¡Diagrama generado/actualizado exitosamente!"
            );
          }

          set({
            chatDiagram: newDiagramJson,
            isLoading: false,
          });

          try {
            const latestChatHistory = get().chatHistory || [];
            const existingThread = await getThread(chatId);

            if (existingThread) {
              await updateThread(chatId, {
                conversation: latestChatHistory,
                diagram: newDiagramJson,
              });
            } else {
              await createThread({
                chat_id: chatId,
                diagram: newDiagramJson,
                schemas: {
                  sql: "",
                  mongodb: "",
                },
                conversation: latestChatHistory,
              });
            }
          } catch (error) {
            console.error("Error handling thread:", error);
            addMessageToChat(
              ROLES.assistant,
              "Error al guardar el hilo de conversación."
            );
          }
        } else {
          let errorMessage = "Hubo un error generando el diagrama.";
          if (
            initialResponse &&
            typeof initialResponse === "object" &&
            "error" in initialResponse
          ) {
            errorMessage = `Error generando el diagrama: ${
              (initialResponse as { error: string }).error
            }`;
          }
          addMessageToChat(ROLES.assistant, errorMessage);
          set({ isLoading: false });
        }
      },

      loadChatThread: async (chatId: string) => {
        const currentStoreState = get();
        // Prevent re-fetching if data for this chatId is already loaded and seems complete,
        // or if a load is already in progress for this exact chatId.
        if (currentStoreState.isLoading && currentStoreState.chatId === chatId)
          return;
        if (
          currentStoreState.chatId === chatId &&
          currentStoreState.chatHistory !== null
        ) {
          return;
        }

        set({
          isLoading: true,
          chatId: chatId,
          chatHistory: null,
          chatDiagram: null,
          chatSchemas: null,
        });
        try {
          const threadData = await getThread(chatId);
          if (threadData) {
            const normalizedHistory = normalizeChat(threadData.conversation);
            const chat = initializeChat(normalizedHistory);
            set({
              modelChat: chat,
              chatHistory: threadData.conversation,
              chatDiagram: threadData.diagram,
              chatSchemas: threadData.schemas
                ? JSON.stringify(threadData.schemas)
                : null,
              chatId: threadData.chat_id, // Ensure this is set from loaded data
              isLoading: false,
            });
          } else {
            // Thread not found in DB, reset relevant store fields for this chatId
            set({
              modelChat: null,
              chatHistory: null,
              chatDiagram: null,
              chatSchemas: null,
              // chatId is already set from the parameter
              isLoading: false,
            });
          }
        } catch (error) {
          console.error("Error loading thread:", error);
          set({
            modelChat: null,
            isLoading: false,
            chatId: chatId,
            chatHistory: null,
            chatDiagram: null,
            chatSchemas: null,
          }); // Reset on error
        }
      },
    }),
    {
      name: "chat-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
