'use server'

import Thread, { type IThread } from '@/models/Thread'
import dbConnect from './db'

export async function createThread(data: Partial<IThread>) {
  await dbConnect()
  const newThread = await Thread.create({
    chat_id: data.chat_id,
    diagram: data.diagram,
    schemas: {
      sql: data.schemas?.sql,
      mongo: data.schemas?.mongo,
    },
    conversation: data.conversation,
  });
  return JSON.parse(JSON.stringify(newThread))
}

export async function getThread(chatId: string): Promise<IThread | null> {
  await dbConnect()
  const foundThread = await Thread.findOne({ chat_id: chatId })
  if (!foundThread) {
    return null
  }
  return JSON.parse(JSON.stringify(foundThread))
}

export async function updateThread(chatId: string, data: Partial<IThread>) {
  await dbConnect()
  const updatedThread = await Thread.findOneAndUpdate(
    { chat_id: chatId },
    { $set: data },
    { new: true },
  )
  if (!updatedThread) {
    return null
  }
  return JSON.parse(JSON.stringify(updatedThread))
}
