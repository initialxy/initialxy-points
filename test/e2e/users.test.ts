import { describe, it, expect, beforeEach } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'
import {
  resetDb,
  createAuthTestData,
  getSessionCookie,
  getUserByUsername,
  TEST_PARENT_USER,
  TEST_CHILD_USER,
} from '../utils/index'
import { UserResponse, UsersResponse } from '../../shared/types'

describe('Users API', async () => {
  await setup({
    build: true,
    server: true,
    browser: false,
  })

  beforeEach(async () => {
    await resetDb()
    await createAuthTestData()
  })

  it('should get all users with parent session', async () => {
    // Login as parent to get session cookie
    const cookie = await getSessionCookie(
      TEST_PARENT_USER.username,
      TEST_PARENT_USER.password
    )

    const response = await $fetch<UsersResponse>('/api/users', {
      method: 'GET',
      headers: {
        cookie: cookie,
      },
    })

    expect(response).toBeDefined()
    expect(response.users).toBeDefined()
    expect(response.users.length).toBeGreaterThan(0)
  })

  it('should get all users with child session (sanitized points)', async () => {
    // Login as child to get session cookie
    const cookie = await getSessionCookie(
      TEST_CHILD_USER.username,
      TEST_CHILD_USER.password
    )

    const response = await $fetch<UsersResponse>('/api/users', {
      method: 'GET',
      headers: {
        cookie: cookie,
      },
    })

    expect(response).toBeDefined()
    expect(response.users).toBeDefined()
    expect(response.users.length).toBeGreaterThan(0)

    // Verify that points are sanitized for child users
    response.users.forEach((user) => {
      if (user.role === 'child') {
        expect(user.points).toBe(0)
      }
    })
  })

  it('should get all users with role filter', async () => {
    // Login as parent to get session cookie
    const cookie = await getSessionCookie(
      TEST_PARENT_USER.username,
      TEST_PARENT_USER.password
    )

    const response = await $fetch<UsersResponse>('/api/users?role=child', {
      method: 'GET',
      headers: {
        cookie: cookie,
      },
    })

    expect(response).toBeDefined()
    expect(response.users).toBeDefined()
    expect(response.users.length).toBeGreaterThan(0)

    // Verify all returned users are children
    response.users.forEach((user) => {
      expect(user.role).toBe('child')
    })
  })

  it('should get user by ID with parent session', async () => {
    // Login as parent to get session cookie
    const cookie = await getSessionCookie(
      TEST_PARENT_USER.username,
      TEST_PARENT_USER.password
    )

    // Get the child user by username
    const childUser = await getUserByUsername(TEST_CHILD_USER.username)

    if (!childUser) {
      throw new Error('Child user not found in database')
    }

    const response = await $fetch<UserResponse>(`/api/users/${childUser.id}`, {
      method: 'GET',
      headers: {
        cookie: cookie,
      },
    })

    expect(response).toBeDefined()
    expect(response.user).toBeDefined()
    expect(response.user.id).toBe(childUser.id)
  })

  it('should get user by ID with child session (for own user)', async () => {
    // Login as child to get session cookie
    const cookie = await getSessionCookie(
      TEST_CHILD_USER.username,
      TEST_CHILD_USER.password
    )

    // Get the child user ID from database to ensure it exists
    const childUser = await getUserByUsername(TEST_CHILD_USER.username)

    if (!childUser) {
      throw new Error('Child user not found in database')
    }

    const response = await $fetch<UserResponse>(`/api/users/${childUser.id}`, {
      method: 'GET',
      headers: {
        cookie: cookie,
      },
    })

    expect(response).toBeDefined()
    expect(response.user).toBeDefined()
    expect(response.user.id).toBe(childUser.id)
  })

  it('should reject access to user by ID with child session (for other user)', async () => {
    // Login as child to get session cookie
    const cookie = await getSessionCookie(
      TEST_CHILD_USER.username,
      TEST_CHILD_USER.password
    )

    // Get a user that is NOT the child user (to test forbidden access)
    const otherUser = await getUserByUsername(TEST_PARENT_USER.username)

    if (!otherUser) {
      throw new Error('Parent user not found in database')
    }

    try {
      await $fetch<UserResponse>(`/api/users/${otherUser.id}`, {
        method: 'GET',
        headers: {
          cookie: cookie,
        },
      })
    } catch (error: any) {
      // Should fail with 403 since child user can't access other users
      expect(error).toBeDefined()
      expect(error.status).toBe(403)
      return
    }

    expect.fail('Should have thrown an error')
  })

  it('should reject access to non-existent user', async () => {
    // Login as parent to get session cookie
    const cookie = await getSessionCookie(
      TEST_PARENT_USER.username,
      TEST_PARENT_USER.password
    )

    try {
      await $fetch<UserResponse>('/api/users/999999999', {
        method: 'GET',
        headers: {
          cookie: cookie,
        },
      })
    } catch (error: any) {
      // Should fail with 404 since user doesn't exist
      expect(error).toBeDefined()
      expect(error.status).toBe(404)
      return
    }

    expect.fail('Should have thrown an error')
  })

  it('should update child points successfully', async () => {
    // Login as parent to get session cookie
    const cookie = await getSessionCookie(
      TEST_PARENT_USER.username,
      TEST_PARENT_USER.password
    )

    // Get the child user
    const childUser = await getUserByUsername(TEST_CHILD_USER.username)

    if (!childUser) {
      throw new Error('Child user not found in database')
    }

    // Get initial points
    const initialPoints = childUser.points

    // Update points
    const response = await $fetch<{ message: string }>(
      '/api/users/' + childUser.id + '/points',
      {
        method: 'PUT',
        headers: {
          cookie: cookie,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          points_change: 10,
        }),
      }
    )

    expect(response).toBeDefined()
    expect(response.message).toBe('Points updated successfully')

    // Verify points were updated in database
    const updatedChildUser = await getUserByUsername(TEST_CHILD_USER.username)

    if (updatedChildUser) {
      expect(updatedChildUser.points).toBe(initialPoints + 10)
    }
  })

  it('should reject points update for non-child user', async () => {
    // Login as parent to get session cookie
    const cookie = await getSessionCookie(
      TEST_PARENT_USER.username,
      TEST_PARENT_USER.password
    )

    // Get a parent user (not child)
    const parentUser = await getUserByUsername(TEST_PARENT_USER.username)

    if (!parentUser) {
      throw new Error('Parent user not found in database')
    }

    try {
      await $fetch<{ message: string }>(
        '/api/users/' + parentUser.id + '/points',
        {
          method: 'PUT',
          headers: {
            cookie: cookie,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            points_change: 10,
          }),
        }
      )
    } catch (error: any) {
      // Should fail with 404 since parent user is not a child
      expect(error).toBeDefined()
      expect(error.status).toBe(404)
      return
    }

    expect.fail('Should have thrown an error')
  })

  it('should reject points update by child user', async () => {
    // Login as child to get session cookie
    const cookie = await getSessionCookie(
      TEST_CHILD_USER.username,
      TEST_CHILD_USER.password
    )

    // Get the child user
    const childUser = await getUserByUsername(TEST_CHILD_USER.username)

    if (!childUser) {
      throw new Error('Child user not found in database')
    }

    try {
      await $fetch<{ message: string }>(
        '/api/users/' + childUser.id + '/points',
        {
          method: 'PUT',
          headers: {
            cookie: cookie,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            points_change: 10,
          }),
        }
      )
    } catch (error: any) {
      // Should fail with 403 since child user is not allowed to update points
      expect(error).toBeDefined()
      expect(error.status).toBe(403)
      return
    }

    expect.fail('Should have thrown an error')
  })

  it('should reject invalid points_change value', async () => {
    // Login as parent to get session cookie
    const cookie = await getSessionCookie(
      TEST_PARENT_USER.username,
      TEST_PARENT_USER.password
    )

    // Get the child user
    const childUser = await getUserByUsername(TEST_CHILD_USER.username)

    if (!childUser) {
      throw new Error('Child user not found in database')
    }

    try {
      await $fetch<{ message: string }>(
        '/api/users/' + childUser.id + '/points',
        {
          method: 'PUT',
          headers: {
            cookie: cookie,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            points_change: 'invalid', // Invalid type
          }),
        }
      )
    } catch (error: any) {
      // Should fail with 400 since points_change is invalid
      expect(error).toBeDefined()
      expect(error.status).toBe(400)
      return
    }

    expect.fail('Should have thrown an error')
  })

  it('should reject points update for non-existent user', async () => {
    // Login as parent to get session cookie
    const cookie = await getSessionCookie(
      TEST_PARENT_USER.username,
      TEST_PARENT_USER.password
    )

    try {
      await $fetch<{ message: string }>('/api/users/999999999/points', {
        method: 'PUT',
        headers: {
          cookie: cookie,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          points_change: 10,
        }),
      })
    } catch (error: any) {
      // Should fail with 404 since user doesn't exist
      expect(error).toBeDefined()
      expect(error.status).toBe(404)
      return
    }

    expect.fail('Should have thrown an error')
  })
})
