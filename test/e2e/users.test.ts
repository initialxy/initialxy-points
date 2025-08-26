import { describe, it, expect, beforeEach } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'
import {
  resetDb,
  createDbAuthTestData,
  getSessionCookie,
  getAllUsers,
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
    await createDbAuthTestData()
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

    // Get all users and find the child user
    const allUsers = await getAllUsers()
    const childUser = allUsers.find(
      (user) => user.username === TEST_CHILD_USER.username
    )

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
    const allUsers = await getAllUsers()
    const childUser = allUsers.find(
      (user) => user.username === TEST_CHILD_USER.username
    )

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

    // Get all users and find a user that is NOT the child user (to test forbidden access)
    const allUsers = await getAllUsers()
    const otherUser = allUsers.find(
      (user) => user.username === TEST_PARENT_USER.username
    )

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
      await $fetch<UserResponse>('/api/users/999999999999999', {
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
})
