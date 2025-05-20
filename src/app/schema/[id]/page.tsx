import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import PageContent from './page-content'
import { getThread } from '@/lib/thread'

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function Schema({ params }: PageProps) {
  const { id: chatId } = await params

  const thread = await getThread(chatId)
  const user = await currentUser()

  if (thread) {
    const threadUserId = thread?.user_id
    const currentUserId = user?.id

    if (threadUserId !== currentUserId) {
      redirect('/schemas')
    }
  }

  return <PageContent thread={thread} />
}
