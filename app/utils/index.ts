export const sleep = (ms: number) =>
  new Promise((resolve) =>
    setTimeout(() => {
      resolve(0)
    }, ms)
  )

export function debounce<Args extends unknown[]>(
  cb: (...args: Args) => unknown,
  waitMs: number
): (...args: Args) => void {
  let timeout: ReturnType<typeof setTimeout>
  return (...args: Args) => {
    if (timeout != null) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => cb(...args), waitMs)
  }
}

export function capitalize(str: string): string {
  const trimmed = str.trim()
  if (trimmed === '') {
    return str
  }
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1)
}

interface ApiError {
  data?: { message?: unknown }
}

export function getApiErrorMessage(error: unknown): string {
  const message = (error as ApiError | null | undefined)?.data?.message
  return typeof message === 'string' && message !== ''
    ? message
    : 'Something went wrong'
}
