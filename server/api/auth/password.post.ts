import { defineEventHandler, readValidatedBody, createError } from 'h3'
import { z } from 'zod'
import { getDb } from '../../database'
import bcrypt from 'bcryptjs'

const bodySchema = z.object({
  currentPassword: z.string().min(4),
  newPassword: z.string().min(4),
})

type AuthUser = {
  id: number
  username: string
  password: string
}

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const user = session.user as User

  const { currentPassword, newPassword } = await readValidatedBody(
    event,
    bodySchema.parse
  )

  const db = await getDb()

  // Verify existing user
  const dbUser: AuthUser | undefined = await db.get(
    'SELECT id, username, password FROM users WHERE id = ?',
    user.id
  )

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

  // Update new password in database
  await db.run(
    'UPDATE users SET password = ? WHERE id = ?',
    hashedPassword,
    user.id
  )

  return {
    message: 'Password changed successfully',
    success: true,
  }
})
