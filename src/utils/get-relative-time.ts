export function getRelativeTime(time: string) {
  const rtf1 = new Intl.RelativeTimeFormat('en', { style: 'short' })

  const date = new Date(time)
  const now = new Date()
  const diffInSeconds = Math.round((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return rtf1.format(-diffInSeconds, 'second')
  }

  const diffInMinutes = Math.round(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return rtf1.format(-diffInMinutes, 'minute')
  }

  const diffInHours = Math.round(diffInMinutes / 60)
  if (diffInHours < 24) {
    return rtf1.format(-diffInHours, 'hour')
  }

  const diffInDays = Math.round(diffInHours / 24)
  return rtf1.format(-diffInDays, 'day')
}
