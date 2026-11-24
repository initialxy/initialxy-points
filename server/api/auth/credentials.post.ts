import { defineEventHandler, readValidatedBody, createError } from 'h3'
import { z } from 'zod'
import { getDb } from '../../database'
import bcrypt from 'bcryptjs'

const bodySchema = z.object({
  username: z.string().min(2),
  currentPassword: z.string().min(4),
  newPassword: z.string().min(4),
})

type AuthUser = {
  id: number
  username: string
  password: string
}

type AuthUserPublic = Pick<User, 'id' | 'username' | 'points'>

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const user = session.user as User
  useRuntimeConfig()

  const { username, currentPassword, newPassword } = await readValidatedBody(
    event,
    bodySchema.parse
  )

  const db = getDb()

  // Verify existing user
  const dbUser: AuthUser | undefined = db
    .prepare<[number], AuthUser>(
      'SELECT id, username, password FROM users WHERE id = ?'
    )
    .get(user.id)

  if (dbUser == null) {
    throw createError({
      statusCode: 401,
      message: 'User not found',
    })
  }

  const isValid = await bcrypt.compare(currentPassword, dbUser.password)

  if (!isValid) {
    throw createError({
      statusCode: 400,
      message: 'Current password is incorrect',
    })
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10)

  // Check if the new username is already taken by another user
  const existingUserWithUsername: { id: number } | undefined = db
    .prepare<[string, number], { id: number }>(
      'SELECT id FROM users WHERE username = ? AND id != ?'
    )
    .get(username, user.id)

  if (existingUserWithUsername != null) {
    throw createError({
      statusCode: 400,
      message: 'Username is already taken',
    })
  }

  // Update new username and password password in database
  db.prepare<[string, string, number]>(
    'UPDATE users SET username = ?, password = ? WHERE id = ?'
  ).run(username, hashedPassword, user.id)

  const fetchedUser: AuthUserPublic | undefined = db
    .prepare<[number], AuthUserPublic>(
      'SELECT id, username, points FROM users WHERE id = ?'
    )
    .get(user.id)

  await setUserSession(
    event,
    { user: fetchedUser },
    {
      maxAge: SESSION_MAX_AGE,
    }
  )

  return { user: fetchedUser } as UserResponse
})
