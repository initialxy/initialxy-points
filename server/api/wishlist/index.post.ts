import { defineEventHandler, H3Event } from 'h3'
import { getDb } from '../../database'
import { PostResponseBody } from '~/types'

export default defineEventHandler(async (event: H3Event) => {
  const db = await getDb()
  const user = event.context.user
  const body = await readBody(event)

  if (!user || user.role !== 'child') {
    return {
      statusCode: 403,
      body: { message: 'Forbidden' },
    }
  }

  const { rewardId } = body

  if (!rewardId) {
    return {
      statusCode: 400,
      body: { message: 'Reward ID is required' },
    }
  }

  const reward = await db.get('SELECT * FROM rewards WHERE id = ?', rewardId)

  if (!reward) {
    return {
      statusCode: 404,
      body: { message: 'Reward not found' },
    }
  }

  const result = await db.get(
    'INSERT INTO wishlist (reward_id, child_id) VALUES (?, ?) RETURNING id',
    rewardId,
    user.id
  )

  const postResponseBody: PostResponseBody = {
    message: 'Wishlist created successfully',
    createdId: result.id,
  }

  return {
    statusCode: 201,
    body: postResponseBody,
  }
})
