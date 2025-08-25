import { defineEventHandler, readValidatedBody, createError } from 'h3'
import { z } from 'zod'
import { getDb } from '../../database'
import bcrypt from 'bcryptjs'

interface DbUser extends User {
  password: string
}

const bodySchema = z.object({
  username: z.string(),
  password: z.string().min(4),
})

export default defineEventHandler(async (event) => {
  const db = await getDb()
  const { username, password } = await readValidatedBody(
    event,
    bodySchema.parse
  )

  const validatedUsername = validateString(username)
  const validatedPassword = validateString(password)

  if (!validatedUsername || !validatedPassword) {
    throw createError({
      statusCode: 400,
      message: 'Username and password are required',
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
      message: 'Invalid username or password',
    })
  }

  const isValid = await bcrypt.compare(validatedPassword!, dbUser.password)

  if (!isValid) {
    throw createError({
      statusCode: 401,
      message: 'Invalid username or password',
    })
  }

  const user: User = {
    id: dbUser.id,
    username: dbUser.username,
    role: dbUser.role,
    points: dbUser.points,
  }

  // Set the user session
  await setUserSession(
    event,
    { user },
    {
      maxAge: SESSION_MAX_AGE,
    }
  )

  return { user } as UserResponse
})
