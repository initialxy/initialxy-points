import validator from 'validator'
import sanitizeHtml from 'sanitize-html'

export function validateString(
  value: any,
  minLength = 1,
  maxLength = 255
): string | null {
  if (typeof value !== 'string') return null
  if (!validator.isLength(value, { min: minLength, max: maxLength }))
    return null
  return sanitizeHtml(value, {
    allowedTags: [],
    allowedAttributes: {},
  })
}

export function validateNumber(
  value: any,
  min = 0,
  max = Number.MAX_SAFE_INTEGER
): number | null {
  if (typeof value !== 'number') return null
  if (value < min || value > max) return null
  return value
}

export function validateBoolean(value: any): boolean | null {
  if (typeof value !== 'boolean') return null
  return value
}

export function validateId(value: any): number | null {
  if (typeof value !== 'number' || value <= 0) return null
  return value
}
