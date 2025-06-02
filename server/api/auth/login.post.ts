import { defineEventHandler, H3Event } from 'h3'
import { initDb } from '../../database'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { validateString } from '../../utils/validation'

export default defineEventHandler(async (event: H3Event) => {
  const db = await initDb()
  const body = await readBody(event)

  const { username, passcode } = body

  const validatedUsername = validateString(username)
  const validatedPasscode = validateString(passcode)

  if (!validatedUsername || !validatedPasscode) {
    return {
      statusCode: 400,
      body: { message: 'Username and passcode are required' },
    }
  }

  const user = await db.get(
    'SELECT * FROM users WHERE username = ?',
    validatedUsername
  )

  if (!user) {
    return {
      statusCode: 401,
      body: { message: 'Invalid username or passcode' },
    }
  }

  const isValid = await bcrypt.compare(validatedPasscode, user.passcode)

  if (!isValid) {
    return {
      statusCode: 401,
      body: { message: 'Invalid username or passcode' },
    }
  }

  // Generate JWT token
  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET || 'your-secret-key',
    {
      expiresIn: '1h',
    }
  )

  return {
    statusCode: 200,
    body: {
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        points: user.points,
      },
    },
  }
})
