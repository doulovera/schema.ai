import { ConversationHistory } from '@/types/chat';
import mongoose, { Schema, Document } from 'mongoose';

export interface IThread extends Document {
  chat_id: string;
  diagram: string;
  schemas: {
    sql: string;
    mongodb: string;
  };
  conversation: Array<ConversationHistory>;
  createdAt: Date;
  updatedAt: Date;
}

const ThreadSchema: Schema = new Schema(
  {
    chat_id: { type: String, required: true, unique: true },
    diagram: { type: String },
    schemas: {
      sql: { type: String },
      mongodb: { type: String },
    },
    conversation: [
      {
        id: { type: String, required: true },
        role: { type: String, required: true },
        content: { type: String, required: true },
        timestamp: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose?.models?.Thread || mongoose.model<IThread>('Thread', ThreadSchema);
