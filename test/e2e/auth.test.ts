import { describe, it, expect, beforeAll } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'
import { getDb } from '../../server/database/index'
import bcrypt from 'bcryptjs'

describe('Auth API', async () => {
  await setup({
    build: true,
    server: true,
    browser: false,
  })

  beforeAll(async () => {
    // Create a test user for authentication tests
    const db = await getDb()
    const hashedPassword = await bcrypt.hash('password', 10)
    await db.run(
      'INSERT OR REPLACE INTO users (username, password, role) VALUES (?, ?, ?)',
      ['testuser', hashedPassword, 'child']
    )
  })

  it('should login with valid credentials', async () => {
    // Test that the endpoint exists and can be called
    const response = await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        username: 'testuser',
        password: 'password',
      },
    })

    // If we get a response, it means the endpoint works correctly
    expect(response).toBeDefined()
    expect((response as any).user).toBeDefined()
    expect((response as any).user.username).toBe('testuser')
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

  it('should handle credentials update', async () => {
    // Test credentials endpoint - requires authenticated session
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
})
