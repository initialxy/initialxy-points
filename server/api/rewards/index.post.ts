import { defineEventHandler, H3Event, readBody } from 'h3'
import { getDb } from '../../database'
import { PostResponseBody } from '~/types'

export default defineEventHandler(async (event: H3Event) => {
  const db = await getDb()
  const user = event.context.user
  const body = await readBody(event)

  if (!user || user.role !== 'parent') {
    return {
      statusCode: 403,
      body: { message: 'Forbidden' },
    }
  }

  const { title, description, points } = body

  if (!title || !points) {
    return {
      statusCode: 400,
      body: { message: 'Title and points are required' },
    }
  }

  const result = await db.get(
    'INSERT INTO rewards (title, description, points, parent_id) VALUES (?, ?, ?, ?) RETURNING id',
    title,
    description,
    points,
    user.id
  )

  const postResponseBody: PostResponseBody = {
    message: 'Reward created successfully',
    createdId: result.id,
  }

  return {
    statusCode: 201,
    body: postResponseBody,
  }
})
