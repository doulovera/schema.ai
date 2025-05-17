'use server';

import Thread, { IThread } from "@/models/Thread";

export async function createThread(data: Partial<IThread>) {
  const newThread = await Thread.create({
    chat_id: data.chat_id,
    diagram: data.diagram,
    schemas: {
      sql: data.schemas?.sql,
      mongodb: data.schemas?.mongodb
    },
    conversation: data.conversation
  });
  return JSON.parse(JSON.stringify(newThread));
}

export async function getThread(chatId: string): Promise<IThread | null> {
  const foundThread = await Thread.findOne({ chat_id: chatId });
  if (!foundThread) {
    return null;
  }
  return JSON.parse(JSON.stringify(foundThread));
}

export async function updateThread(chatId: string, data: Partial<IThread>) {
  const updatedThread = await Thread.findOneAndUpdate(
    { chat_id: chatId },
    { $set: data },
    { new: true }
  );
  if (!updatedThread) {
    return null;
  }
  return JSON.parse(JSON.stringify(updatedThread));
}