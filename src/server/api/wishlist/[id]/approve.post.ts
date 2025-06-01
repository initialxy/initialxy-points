import { defineEventHandler, H3Event } from 'h3';
import { initDb } from '../../../database';
import { validateId } from '../../../utils/validation';

export default defineEventHandler(async (event: H3Event) => {
  const db = await initDb();
  const user = event.context.user;
  const wishlistId = validateId(event.context.params?.id);

  if (!wishlistId) {
    return {
      statusCode: 400,
      body: { message: 'Invalid wishlist ID' }
    };
  }

  if (!user || user.role !== 'parent') {
    return {
      statusCode: 403,
      body: { message: 'Forbidden' }
    };
  }

  // Check if the wishlist item exists
  const wishlistItem = await db.get('SELECT * FROM wishlist WHERE id = ?', wishlistId);

  if (!wishlistItem) {
    return {
      statusCode: 404,
      body: { message: 'Wishlist item not found' }
    };
  }

  // Check if the wishlist item is already approved
  if (wishlistItem.approved) {
    return {
      statusCode: 400,
      body: { message: 'Wishlist item already approved' }
    };
  }

  // Update the wishlist item as approved
  await db.run('UPDATE wishlist SET approved = TRUE WHERE id = ?', wishlistId);

  return {
    statusCode: 200,
    body: { message: 'Wishlist item approved successfully' }
  };
});