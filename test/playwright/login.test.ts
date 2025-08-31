import { expect, test } from '@nuxt/test-utils/playwright'
import { resetDb, createAuthTestData } from '../utils/index'

test.describe('Login page', () => {
  test.beforeEach(async ({ page, goto }) => {
    await resetDb()
    await createAuthTestData()
  })

  test('displays the login card', async ({ page, goto }) => {
    await goto('/', { waitUntil: 'hydration' })
    await expect(page.getByTestId('login_card')).toBeVisible()
  })
})
