import { PATHS } from '@/constants/paths'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic' // Asegura el renderizado dinámico

export default async function RedirectPage() {
  const id = crypto.randomUUID()
  redirect(`${PATHS.CHAT}/${id}`)
}