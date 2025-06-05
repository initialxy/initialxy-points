import { defineEventHandler, readValidatedBody, createError } from 'h3'
import { z } from 'zod'
import { getDb } from '../../database'
import bcrypt from 'bcryptjs'
import { validateString } from '../../utils/validation'

const bodySchema = z.object({
  username: z.string(),
  passcode: z.string().min(3),
})

export default defineEventHandler(async (event) => {
  const db = await getDb()
  const { username, passcode } = await readValidatedBody(
    event,
    bodySchema.parse
  )

  const validatedUsername = validateString(username)
  const validatedPasscode = validateString(passcode)

  if (!validatedUsername || !validatedPasscode) {
    throw createError({
      statusCode: 400,
      message: 'Username and passcode are required',
    })
  }

  const user = await db.get(
    'SELECT * FROM users WHERE username = ?',
    validatedUsername
  )

  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Invalid username or passcode',
    })
  }

  const isValid = await bcrypt.compare(validatedPasscode, user.passcode)

  if (!isValid) {
    throw createError({
      statusCode: 401,
      message: 'Invalid username or passcode',
    })
  }

  // Set the user session
  await setUserSession(event, {
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
      points: user.points,
    },
  })

  return {}
})
