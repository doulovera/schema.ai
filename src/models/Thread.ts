import type { Message } from '@/types/chat'
import mongoose, { Schema, type Document } from 'mongoose'

export interface IThread extends Document {
  chat_id: string
  diagram: string // This stores the main diagram JSON string
  schemas: {
    sql: string
    mongodb: string
  }
  conversation: Array<Message>
}

const MessageSchemaContents = {
  id: { type: String, required: true },
  timestamp: { type: Number, required: true },
  role: { type: String, required: true },
  message: { type: String, required: true },
  diagram: { type: String },
}

const ThreadSchema: Schema = new Schema(
  {
    chat_id: { type: String, required: true, unique: true },
    diagram: { type: String, default: '' },
    schemas: {
      sql: { type: String, default: '' },
      mongodb: { type: String, default: '' },
    },
    conversation: [new Schema(MessageSchemaContents, { _id: false })],
  },
  { timestamps: true },
)

export default mongoose?.models?.Thread ||
  mongoose.model<IThread>('Thread', ThreadSchema)
