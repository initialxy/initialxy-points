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

export function capitalize(str: string): string {
  const trimmed = str.trim()
  if (trimmed === '') {
    return str
  }
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1)
}
