import { PATHS } from '@/constants/paths'
import { redirect } from 'next/navigation'

export default async function RedirectPage() {
  const id = crypto.randomUUID()
  redirect(`${PATHS.CHAT}/${id}`)
}
