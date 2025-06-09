import { defineEventHandler, readValidatedBody, createError } from 'h3'
import { z } from 'zod'
import { getDb } from '../../database'
import bcrypt from 'bcryptjs'
import { validateString } from '../../utils/validation'
import { User } from '~/types'

interface DbUser extends User {
  passcode: string
}

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

  const dbUser: DbUser | null =
    (await db.get(
      'SELECT * FROM users WHERE username = ?',
      validatedUsername
    )) || null

  if (dbUser == null) {
    throw createError({
      statusCode: 401,
      message: 'Invalid username or passcode',
    })
  }

  const isValid = await bcrypt.compare(validatedPasscode, dbUser.passcode)

  if (!isValid) {
    throw createError({
      statusCode: 401,
      message: 'Invalid username or passcode',
    })
  }

  const user: User = {
    id: dbUser.id,
    username: dbUser.username,
    role: dbUser.role,
    points: dbUser.points,
  }

  // Set the user session
  await setUserSession(event, { user })

  return { user }
})
