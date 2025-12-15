import { format, formatDistanceToNow, parseISO } from "date-fns"

export const formatDate = (date: string | Date, formatString = "PPP"): string => {
  const dateObj = typeof date === "string" ? parseISO(date) : date
  return format(dateObj, formatString)
}

export const formatRelativeTime = (date: string | Date): string => {
  const dateObj = typeof date === "string" ? parseISO(date) : date
  return formatDistanceToNow(dateObj, { addSuffix: true })
}

export const isValidDate = (date: string): boolean => {
  try {
    const parsed = parseISO(date)
    return !isNaN(parsed.getTime())
  } catch {
    return false
  }
}