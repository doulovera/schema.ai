import type { Conversation, MessageRole } from "@/types/chat";
import { createConversation, addMessageToConversation } from "@/lib/chat-utils";
// types
type ConversationAction =
  | { type: "CREATE"; payload: { title?: string; description?: string } }
  | { type: "ADD_MESSAGE"; payload: { role: MessageRole; content: string } };
type ConversationState = Conversation;
// Reducer
export default function conversationReducer(
  state: ConversationState,
  action: ConversationAction
): ConversationState {
  switch (action.type) {
    case "CREATE":
      return createConversation(action.payload);
    case "ADD_MESSAGE":
      return addMessageToConversation(
        state,
        action.payload.role,
        action.payload.content
      );
    default:
      return state;
  }
}
