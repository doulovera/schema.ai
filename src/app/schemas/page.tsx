import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { PATHS } from '@/constants/paths'
import { getThreadsByUserId } from '@/lib/thread'
import { getRelativeTime } from '@/utils/get-relative-time'
import { SignedIn, UserButton } from '@clerk/nextjs'
import { currentUser } from '@clerk/nextjs/server'
import { Database, PlusCircle } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Fragment } from 'react'

export default async function SchemasList() {
  const user = await currentUser()

  if (!user) {
    redirect('/sign-in')
  }

  const threads = await getThreadsByUserId(user.id)

  const getDatabaseTitle = (diagram: string) => {
    return JSON.parse(diagram)?.database?.name
  }

  const updatedAt = (threadUpdatedAt: string) => new Date(threadUpdatedAt)

  return (
    <div className="container mx-auto py-8 max-w-5xl">
      <header className="flex justify-between items-center w-full mb-8">
        <Link href="/" className="flex items-center justify-between space-x-2">
          <Database className="h-6 w-6" />
          <span className="font-bold inline-block">schema.ai</span>
        </Link>
        <div className="flex items-center gap-4">
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </header>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Tus chats</h1>
          <p className="text-muted-foreground mt-1">
            Visualiza y continúa tus conversaciones sobre esquemas de bases de
            datos
          </p>
        </div>
        <Link href={PATHS.CHAT}>
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Nuevo Chat
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {threads.map((thread) => (
          <Fragment key={thread.id}>
            <Link href={`${PATHS.CHAT}/${thread.chat_id}`} className="block">
              <Card className="h-full transition-all hover:shadow-md">
                <CardHeader>
                  <CardTitle className="line-clamp-1">
                    {getDatabaseTitle(thread.diagram)}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Last updated: {getRelativeTime(thread.updatedAt)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {thread.conversation?.at(-1)?.message}
                  </p>
                </CardContent>
                <CardFooter className="text-xs text-muted-foreground">
                  {updatedAt(thread.updatedAt).toLocaleDateString()} at{' '}
                  {updatedAt(thread.updatedAt).toLocaleTimeString()}
                </CardFooter>
              </Card>
            </Link>
          </Fragment>
        ))}
      </div>

      {threads.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No tienes chats todavía</h3>
          <p className="text-muted-foreground mt-1">
            Inicia una nueva conversación para crear tu esquema de base de datos
          </p>
          <Link href={PATHS.CHAT} className="mt-4 inline-block">
            <Button>Iniciar nuevo chat</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
