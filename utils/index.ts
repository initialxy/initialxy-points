import { DateTime } from 'luxon'

export const sleep = (ms: number) =>
  new Promise((resolve) =>
    setTimeout(() => {
      resolve(0)
    }, ms)
  )

export function debounce(cb: Function, waitMs: number) {
  let timeout: ReturnType<typeof setTimeout>
  return function (this: any, ...args: any[]) {
    if (timeout != null) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => cb.apply(this, args), waitMs)
  }
}

export function formatShortDate(timestamp: Date | string | number): string {
  const date = DateTime.fromJSDate(new Date(timestamp))
  return date.toFormat('MMM d, h:mm a')
}
