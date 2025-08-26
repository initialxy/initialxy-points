import { describe, it, expect, beforeEach } from 'vitest'
import {
  resetDb,
  createAuthTestData,
  getSessionCookie,
  TEST_PARENT_USER,
} from '../utils/index'
import { setup, $fetch } from '@nuxt/test-utils/e2e'
import { UserResponse } from '../../shared/types'

describe('Auth API', async () => {
  await setup({
    build: true,
    server: true,
    browser: false,
  })

  beforeEach(async () => {
    await resetDb()
    await createAuthTestData()
  })

  it('should login with valid credentials', async () => {
    // Test that the endpoint exists and can be called
    const response = await $fetch<UserResponse>('/api/auth/login', {
      method: 'POST',
      body: {
        username: TEST_PARENT_USER.username,
        password: TEST_PARENT_USER.password,
      },
    })

    // If we get a response, it means the endpoint works correctly
    expect(response).toBeDefined()
    expect(response.user).toBeDefined()
    expect(response.user.username).toBe(TEST_PARENT_USER.username)
  })

  it('should reject invalid username or password', async () => {
    try {
      await $fetch('/api/auth/login', {
        method: 'POST',
        body: {
          username: '',
          password: TEST_PARENT_USER.password,
        },
      })
    } catch (error: any) {
      // Should fail with validation error
      expect(error).toBeDefined()
      expect(error.status).toBe(400)
      return
    }

    expect.fail('Should have thrown an error')
  })

  it('should reject invalid password length', async () => {
    try {
      await $fetch('/api/auth/login', {
        method: 'POST',
        body: {
          username: TEST_PARENT_USER.username,
          password: '123', // Too short
        },
      })
    } catch (error: any) {
      // Should fail with validation error
      expect(error).toBeDefined()
      expect(error.status).toBe(400)
      return
    }

    expect.fail('Should have thrown an error')
  })

  it('should reject invalid credentials', async () => {
    try {
      await $fetch('/api/auth/login', {
        method: 'POST',
        body: {
          username: TEST_PARENT_USER.username,
          password: 'wrongpassword',
        },
      })
    } catch (error: any) {
      // Should fail with authentication error
      expect(error).toBeDefined()
      expect(error.status).toBe(401)
      return
    }

    expect.fail('Should have thrown an error')
  })

  it('should fail credentials update without session', async () => {
    try {
      const response = await $fetch('/api/auth/credentials', {
        method: 'POST',
        body: {
          username: TEST_PARENT_USER.username,
          currentPassword: TEST_PARENT_USER.password,
          newPassword: 'newpassword',
        },
      })
    } catch (error: any) {
      // Expected to fail with 401 since no session exists
      expect(error).toBeDefined()
      expect(error.status).toBe(401)
      return
    }

    expect.fail('Should have thrown an error')
  })

  it('should handle credentials update', async () => {
    // Login to get session cookie
    const cookie = await getSessionCookie(
      TEST_PARENT_USER.username,
      TEST_PARENT_USER.password
    )

    const response = await $fetch<UserResponse>('/api/auth/credentials', {
      method: 'POST',
      body: {
        username: 'testuser2',
        currentPassword: TEST_PARENT_USER.password,
        newPassword: 'newpassword',
      },
      headers: {
        cookie: cookie,
      },
    })

    expect(response).toBeDefined()
    expect(response.user).toBeDefined()
    expect(response.user.username).toBe('testuser2')
  })
})
