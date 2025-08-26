import { describe, it, expect, beforeEach } from 'vitest'
import { setup, $fetch, fetch } from '@nuxt/test-utils/e2e'
import { resetDb, createDbAuthTestData } from '../utils/index'
import { UserResponse } from '../../shared/types'
import { sealSession, H3Event } from 'h3'

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
    try {
    const response = await $fetch('/api/auth/credentials', {
      method: 'POST',
      body: {
        username: 'testuser',
        currentPassword: 'password',
        newPassword: 'newpassword',
      },
    })
  } catch(error: any) {
      // Expected to fail with 401 since no session exists
      expect((error).status).toBe(401)
      return null
    }
    expect.fail('Should have thrown an error')
  })

  it('should handle credentials update', async () => {
    // Login to get session cookie
    const loginResponse = await fetch('/api/auth/login', {
      method: 'POST',
      body: 'username=testuser&password=password',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    
    const response = await $fetch<UserResponse>('/api/auth/credentials', {
      method: 'POST',
      body: {
        username: 'testuser2',
        currentPassword: 'password',
        newPassword: 'newpassword',
      },
      headers: {
        cookie: loginResponse.headers.getSetCookie()?.join('; '),
      },
    })

    expect(response).toBeDefined()
    expect(response.user).toBeDefined()
    expect(response.user.username).toBe('testuser2')
  })
})
