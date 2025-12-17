import { format, formatDistanceToNow, parseISO } from "date-fns"
import { formatInTimeZone } from "date-fns-tz"

export const formatDate = (
  date: string | Date, 
  formatString = "PPP",
  timezone?: string
): string => {
  const dateObj = typeof date === "string" ? parseISO(date) : date
  
  if (timezone) {
    return formatInTimeZone(dateObj, timezone, formatString)
  }
  
  return format(dateObj, formatString)
}

export const formatDateUTC = (
  date: string | Date,
  formatString = "PPP"
): string => {
  return formatDate(date, formatString, 'UTC')
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