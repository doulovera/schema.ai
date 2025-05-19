import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Roles, Message } from '@/types/chat'
import {
  sendUserMessage,
  normalizeChat,
  compareJsonSchemas,
  generateDatabaseScriptFromDiagram,
} from '@/lib/gemini'
import { updateThread, getThread, createThread } from '@/lib/thread'

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
  loadChatThread: (chatId: string) => Promise<void>
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      conversations: [],
      chatHistory: null,
      chatId: null,
      chatDiagram: null,
      chatSchemas: { sql: "", mongo: "" },
      isLoading: false,

      addMessageToChat: (role: Roles, text: string, diagram?: string) => {
        const { chatHistory } = get();
        const newMessage: Message = {
          id: Date.now().toString(),
          role,
          message: text, // Textual content (e.g., user query, AI summary)
          diagram: diagram || "", // Diagram JSON string, if this message includes/is a diagram
          timestamp: Date.now(),
        };
        set({ chatHistory: [...(chatHistory || []), newMessage] });
      },

      handleSendMessage: async (messageText: string, chatId: string) => {
        const {
          addMessageToChat,
          chatHistory: currentLocalHistory,
          chatDiagram: currentDiagramInStore,
        } = get();

        addMessageToChat(ROLES.user, messageText);
        set({ isLoading: true, chatId });

        const normalizedHistory = await normalizeChat(
          currentLocalHistory || []
        );

        try {
          const { responseText, updatedHistory: geminiHistory } =
            await sendUserMessage(normalizedHistory, messageText);
          console.log(responseText)
          let isDiagramPayload = true;
          try {
            JSON.parse(responseText); // Intenta parsear, si falla, no es un diagrama JSON
          } catch (e) {
            isDiagramPayload = false; // Es un mensaje de texto (error de validación o similar)
          }

          if (!isDiagramPayload) {
            // responseText es un mensaje de validación/error
            addMessageToChat(ROLES.assistant, responseText); // Muestra el mensaje en el chat

            // Actualiza el hilo en la base de datos con la conversación que incluye el mensaje
            const currentChatHistoryForDB = get().chatHistory || [];
            const threadExists = await getThread(chatId);
            if (threadExists) {
              await updateThread(chatId, {
                conversation: currentChatHistoryForDB,
                // No se actualiza el diagrama ni los esquemas si la entrada no fue válida
              });
            } else {
              await createThread({
                chat_id: chatId,
                conversation: currentChatHistoryForDB,
              });
            }
            set({ isLoading: false });
            return; // Termina el procesamiento aquí
          }

          // responseText es un diagrama (isDiagramPayload es true)
          const aiDiagramResponse = responseText; // Renombrar para claridad con el código existente

          let summaryForChatMessage = "Received new diagram.";
          if (
            currentDiagramInStore &&
            aiDiagramResponse &&
            currentDiagramInStore !== aiDiagramResponse
          ) {
            const comparisonResult = await compareJsonSchemas(
              currentDiagramInStore,
              aiDiagramResponse
            );
            summaryForChatMessage = comparisonResult.summary;
          } else if (aiDiagramResponse && !currentDiagramInStore) {
            summaryForChatMessage = "Initial diagram generated.";
          }

          // Añade el mensaje de resumen al chat, con el diagrama como payload
          addMessageToChat(
            ROLES.assistant,
            summaryForChatMessage,
            aiDiagramResponse // El string JSON del diagrama
          );

          const [sqlSchema, mongodbSchema] = await Promise.all([
            generateDatabaseScriptFromDiagram(aiDiagramResponse, "sql"),
            generateDatabaseScriptFromDiagram(aiDiagramResponse, "mongo"),
          ]);

          const newChatSchemas = {
            sql: sqlSchema || "",
            mongo: mongodbSchema || "",
          };
          set({
            chatSchemas: newChatSchemas,
          });

          set({ chatDiagram: aiDiagramResponse }); // Almacena el nuevo diagrama (string JSON)

          // Actualiza el hilo en la base de datos
          const finalChatHistoryForDB = get().chatHistory || [];
          const threadExists = await getThread(chatId);
          if (threadExists) {
            await updateThread(chatId, {
              diagram: aiDiagramResponse,
              conversation: finalChatHistoryForDB,
              schemas: newChatSchemas,
            });
          } else {
            const newThread = await createThread({
              chat_id: chatId,
              diagram: aiDiagramResponse,
              conversation: finalChatHistoryForDB,
              schemas: newChatSchemas,
            });
            // set({ chatId: newThread.chat_id }); // chatId ya está seteado
          }
        } catch (error) {
          console.error("Error sending message:", error);
          addMessageToChat(
            ROLES.assistant,
            `Sorry, I encountered an error: ${(error as Error).message}`
          );
        } finally {
          set({ isLoading: false });
        }
      },

      loadChatThread: async (chatId: string) => {
        set({ isLoading: true });
        try {
          const thread = await getThread(chatId);
          if (thread) {
            set({
              chatId: thread.chat_id,
              chatHistory: thread.conversation,
              chatDiagram: thread.diagram, // Load the latest overall diagram for the thread
              chatSchemas: thread.schemas, // For display of SQL/MongoDB schemas
              isLoading: false,
            });
          } else {
            set({
              chatId,
              chatHistory: [],
              chatDiagram: null,
              chatSchemas: { mongo: "", sql: "" },
              isLoading: false,
            });
          }
        } catch (error) {
          console.error("Error loading chat thread:", error);
          set({
            chatId,
            chatHistory: [],
            chatDiagram: null,
            chatSchemas: { mongo: "", sql: "" },
            isLoading: false,
          });
        }
      },
    }),
    {
      name: "chat-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
