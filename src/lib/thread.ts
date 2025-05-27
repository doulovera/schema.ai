'use server'

import Thread, { type IThread } from '@/models/Thread'
import Conversation, { type IConversation } from '@/models/Conversation'
import type { Message } from '@/types/chat'
import dbConnect from './db'

export async function createThread(
  userId: string,
  data: Partial<IThread> & { conversation?: Array<Message> },
) {
  await dbConnect()
  const newThread = await Thread.create({
    chat_id: data.chat_id,
    user_id: userId,
    diagram: data.diagram,
    schemas: {
      sql: data.schemas?.sql,
      mongo: data.schemas?.mongo,
    },
  })
  if (data.conversation && data.conversation.length > 0) {
    await Conversation.create({
      thread_id: newThread.chat_id,
      messages: data.conversation,
    })
  }
  return JSON.parse(JSON.stringify(newThread))
}

export async function getThread(
  chatId: string,
): Promise<(IThread & { conversation?: Array<Message> }) | null> {
  await dbConnect()

  // Obtiene el hilo principal de la base de datos.
  const foundThread = await Thread.findOne({ chat_id: chatId }).lean<IThread>()

  if (!foundThread) {
    return null
  }

  // Obtiene la conversación asociada al hilo.
  const conversationDoc = await Conversation.findOne({
    thread_id: chatId,
  }).lean<IConversation>()

  // Convierte foundThread en un objeto plano para que coincida con IThread.
  const threadObj: IThread & { conversation?: Array<Message> } = JSON.parse(
    JSON.stringify(foundThread),
  )

  if (conversationDoc?.messages) {
    threadObj.conversation = conversationDoc.messages
  } else {
    // Asegura que la conversación sea un array vacío si no existe.
    threadObj.conversation = []
  }

  // Serializa el objeto para asegurar la compatibilidad con Client Components.
  return JSON.parse(JSON.stringify(threadObj))
}

export async function updateThread(
  chatId: string,
  data: Partial<IThread> & { conversation?: Array<Message> },
) {
  await dbConnect()
  const updatedThread = await Thread.findOneAndUpdate(
    { chat_id: chatId },
    { $set: data },
    { new: true },
  )
  if (!updatedThread) {
    return null
  }
  if (data.conversation) {
    await Conversation.findOneAndUpdate(
      { thread_id: chatId },
      { $set: { messages: data.conversation } },
      { upsert: true },
    )
  }
  return JSON.parse(JSON.stringify(updatedThread))
}

export async function getThreadsByUserId(userId: string): Promise<IThread[]> {
  await dbConnect()
  const threads = await Thread.find({ user_id: userId })
  return JSON.parse(JSON.stringify(threads))
}

export async function deleteThread(chatId: string) {
  await dbConnect()
  const deletedThread = await Thread.findOneAndDelete({ chat_id: chatId })
  if (!deletedThread) {
    return null
  }
  return true
}

export async function duplicateThread(
  chatId: string,
  userId: string,
): Promise<IThread | null> {
  await dbConnect()
  const thread = await Thread.findOne({ chat_id: chatId })
  if (!thread) {
    return null
  }

  const newChatId = crypto.randomUUID()

  const newThread = await Thread.create({
    chat_id: newChatId,
    user_id: userId,
    diagram: thread.diagram,
    schemas: {
      sql: thread.schemas?.sql,
      mongo: thread.schemas?.mongo,
    },
  })

  // Duplicar la conversación asociada
  const conversation = await Conversation.findOne({ thread_id: chatId })
  if (conversation) {
    await Conversation.create({
      thread_id: newChatId,
      messages: conversation.messages,
    })
  }

  return JSON.parse(JSON.stringify(newThread))
}
