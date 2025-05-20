'use client'

import type { IThread } from '@/models/Thread'

import { Fragment } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PATHS } from '@/constants/paths'
import { getRelativeTime } from '@/utils/get-relative-time'

interface Thread extends Partial<IThread> {
  dbTitle: string
}

export function ThreadList({ threads }: { threads: Thread[] }) {
  if (!threads.length) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">No tienes chats todavía</h3>
        <p className="text-muted-foreground mt-1">
          Inicia una nueva conversación para crear tu esquema de base de datos
        </p>
        <Link href={PATHS.CHAT} className="mt-4 inline-block">
          <Button>Iniciar nuevo chat</Button>
        </Link>
      </div>
    )
  }

  const updatedAt = (threadUpdatedAt: string) => new Date(threadUpdatedAt)

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {threads.map((thread) => (
        <Fragment key={thread.chat_id}>
          <Link href={`${PATHS.CHAT}/${thread.chat_id}`} className="block">
            <Card className="h-full transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle className="line-clamp-1">{thread.dbTitle}</CardTitle>
                <CardDescription className="text-xs">
                  Last updated: {getRelativeTime(thread?.updatedAt || '')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {thread.conversation?.at(-1)?.message}
                </p>
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground">
                {updatedAt(thread?.updatedAt || '').toLocaleDateString()} at{' '}
                {updatedAt(thread?.updatedAt || '').toLocaleTimeString()}
              </CardFooter>
            </Card>
          </Link>
        </Fragment>
      ))}
    </div>
  )
}
