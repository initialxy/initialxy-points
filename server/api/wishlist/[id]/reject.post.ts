import { defineEventHandler, H3Event } from 'h3'
import { getDb } from '../../../database'
import { validateId } from '../../../utils/validation'
import { User } from '~/types'

export default defineEventHandler(async (event: H3Event) => {
  const db = await getDb()
  const session = await requireUserSession(event)
  const user = session.user as User
  const wishlistId = validateId(
    parseInt(event.context.params?.id ?? '0') as number
  )

  if (!wishlistId) {
    return {
      statusCode: 400,
      body: { message: 'Invalid wishlist ID' },
    }
  }

  if (user.role !== 'parent') {
    return {
      statusCode: 403,
      body: { message: 'Forbidden' },
    }
  }

  // Check if the wishlist item exists
  const wishlistItem = await db.get(
    'SELECT * FROM wishlist WHERE id = ?',
    wishlistId
  )

  if (!wishlistItem) {
    return {
      statusCode: 404,
      body: { message: 'Wishlist item not found' },
    }
  }

  // Check if the wishlist item is already approved or rejected
  if (wishlistItem.status !== 'pending') {
    return {
      statusCode: 400,
      body: { message: 'Wishlist item already processed' },
    }
  }

  // Update the wishlist item status to rejected
  await db.run(
    'UPDATE wishlist SET status = ? WHERE id = ?',
    'rejected',
    wishlistId
  )

  return {
    statusCode: 200,
    body: { message: 'Wishlist item rejected successfully' },
  }
})
