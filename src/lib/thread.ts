'use server';

import Thread, { IThread } from "@/models/Thread";
import dbConnect from "./db";

export async function createThread(data: Partial<IThread>) {
  const thread = await Thread.create({
    chat_id: data.chat_id,
    diagram: data.diagram,
    schemas: {
      sql: data.schemas?.sql,
      mongodb: data.schemas?.mongodb
    },
    conversation: data.conversation
  })
  return true;
}

export async function getThread(chatId: string) {
  const thread = await Thread.findOne({ chat_id: chatId });
  return true;
}

export async function updateThread(chatId: string, data: Partial<IThread>) {
  const thread = await Thread.findOneAndUpdate(
    { chat_id: chatId },
    { $set: data },
    { new: true }
  );
  return true;
}