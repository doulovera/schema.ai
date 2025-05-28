import type { Message } from '@/types/chat'
import mongoose, { Schema, type Document } from 'mongoose'

export interface IConversation extends Document {
  thread_id: string
  messages: Array<Message>
  createdAt: string
  updatedAt: string
}

const MessageSchemaContents = {
  id: { type: String, required: true },
  timestamp: { type: Number, required: true },
  role: { type: String, required: true },
  message: { type: String, required: true },
  diagram: { type: String },
}

const ConversationSchema: Schema = new Schema(
  {
    thread_id: { type: String, required: true, index: true },
    messages: [new Schema(MessageSchemaContents, { _id: false })],
  },
  { timestamps: true },
)

export default mongoose?.models?.Conversation ||
  mongoose.model<IConversation>('Conversation', ConversationSchema)
