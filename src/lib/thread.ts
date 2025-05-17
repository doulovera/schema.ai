'use server';

import Thread, { IThread } from "@/models/Thread";
import dbConnect from "./db";

export async function createThread(data: Partial<IThread>) {
  await dbConnect();
  const thread = await Thread.create({
    chat_id: data.chat_id,
    diagram: data.diagram,
    schemas: {
      sql: data.schemas?.sql,
      mongodb: data.schemas?.mongodb
    },
    conversation: data.conversation
  })
  return thread;
}

export async function getThread(chatId: string) {
  await dbConnect();
  const thread = await Thread.findOne({ chat_id: chatId });
  return thread;
}

export async function updateThread(chatId: string, data: Partial<IThread>) {
  await dbConnect();
  const thread = await Thread.findOneAndUpdate(
    { chat_id: chatId },
    { $set: data },
    { new: true }
  );
  return thread;
}