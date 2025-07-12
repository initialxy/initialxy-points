import { defineEventHandler, H3Event, readBody } from 'h3'
import { getDb } from '../../database'

export default defineEventHandler(async (event: H3Event) => {
  const db = await getDb()
  const session = await requireUserSession(event)
  const user = session.user as User
  const body = await readBody(event)

  if (user.role !== 'parent') {
    return {
      statusCode: 403,
      body: { message: 'Forbidden' },
    }
  }

  const { description, points } = body

  if (!points) {
    return {
      statusCode: 400,
      body: { message: 'Description and points are required' },
    }
  }

  const result = await db.get(
    'INSERT INTO rewards (description, points, parent_id) VALUES (?, ?, ?) RETURNING id',
    description,
    points,
    user.id
  )

  const postResponseBody: CreatedIdResponseBody = {
    message: 'Reward created successfully',
    createdId: result.id,
  }

  return {
    statusCode: 201,
    body: postResponseBody,
  }
})
