import { describe, it, expect, beforeEach } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'
import { resetDb, createDbAuthTestData } from '../utils/index'
import { UserResponse } from '../../shared/types'

describe('Auth API', async () => {
  await setup({
    build: true,
    server: true,
    browser: false,
  })

  beforeEach(async () => {
    await resetDb()
    await createDbAuthTestData()
  })

  it('should login with valid credentials', async () => {
    // Test that the endpoint exists and can be called
    const response = await $fetch<UserResponse>('/api/auth/login', {
      method: 'POST',
      body: {
        username: 'testuser',
        password: 'password',
      },
    })

    // If we get a response, it means the endpoint works correctly
    expect(response).toBeDefined()
    expect(response.user).toBeDefined()
    expect(response.user.username).toBe('testuser')
  })

  it('should reject invalid username or password', async () => {
    try {
      await $fetch('/api/auth/login', {
        method: 'POST',
        body: {
          username: '',
          password: 'password',
        },
      })
      expect.fail('Should have thrown an error')
    } catch (error: any) {
      // Should fail with validation error
      expect(error).toBeDefined()
      expect(error.status).toBe(400)
    }
  })

  it('should reject invalid password length', async () => {
    try {
      await $fetch('/api/auth/login', {
        method: 'POST',
        body: {
          username: 'testuser',
          password: '123', // Too short
        },
      })
      expect.fail('Should have thrown an error')
    } catch (error: any) {
      // Should fail with validation error
      expect(error).toBeDefined()
      expect(error.status).toBe(400)
    }
  })

  it('should reject invalid credentials', async () => {
    try {
      await $fetch('/api/auth/login', {
        method: 'POST',
        body: {
          username: 'testuser',
          password: 'wrongpassword',
        },
      })
      expect.fail('Should have thrown an error')
    } catch (error: any) {
      // Should fail with authentication error
      expect(error).toBeDefined()
      expect(error.status).toBe(401)
    }
  })

  it('should fail credentials update without session', async () => {
    const response = await $fetch('/api/auth/credentials', {
      method: 'POST',
      body: {
        username: 'testuser',
        currentPassword: 'password',
        newPassword: 'newpassword',
      },
    }).catch((error) => {
      // Expected to fail with 401 since no session exists
      expect((error as any).status).toBe(401)
      return null
    })

    expect(response).toBeNull()
  })

  it('should handle credentials update', async () => {
    // First, login to establish a session
    const loginResponse = await $fetch<UserResponse>('/api/auth/login', {
      method: 'POST',
      body: {
        username: 'testuser',
        password: 'password',
      },
    })

    expect(loginResponse).toBeDefined()
    expect(loginResponse.user).toBeDefined()

    // Test credentials endpoint with authenticated session
    const response = await $fetch<UserResponse>('/api/auth/credentials', {
      method: 'POST',
      body: {
        username: 'updateduser',
        currentPassword: 'password',
        newPassword: 'newpassword',
      },
    })

    // Verify the update was successful
    expect(response).toBeDefined()
    expect(response.user).toBeDefined()
    expect(response.user.username).toBe('updateduser')
  })
})
