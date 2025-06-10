import { defineEventHandler, H3Event } from 'h3'
import { getDb } from '../../database'
import { CreatedIdResponseBody, User } from '~/types'

export default defineEventHandler(async (event: H3Event) => {
  const db = await getDb()
  const session = await requireUserSession(event)
  const user = session.user as User
  const body = await readBody(event)

  if (user.role !== 'child') {
    return {
      statusCode: 403,
      body: { message: 'Forbidden' },
    }
  }

  const { description } = body

  if (!description) {
    return {
      statusCode: 400,
      body: { message: 'Description is required' },
    }
  }

  const result = await db.get(
    'INSERT INTO wishlist (child_id, description) VALUES (?, ?) RETURNING id',
    user.id,
    description
  )

  const postResponseBody: CreatedIdResponseBody = {
    message: 'Wishlist created successfully',
    createdId: result.id,
  }

  return {
    statusCode: 201,
    body: postResponseBody,
  }
})
