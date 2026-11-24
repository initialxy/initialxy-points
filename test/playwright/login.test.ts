import { expect, test } from '@nuxt/test-utils/playwright'
import {
  resetDb,
  createAuthTestData,
  TEST_PARENT_USER,
  playwrightLogin,
} from '../utils/index'

test.describe('Login page', () => {
  test.beforeEach(async () => {
    await resetDb()
    await createAuthTestData()
  })

  test('login form is shown', async ({ page, goto }) => {
    await goto('/', { waitUntil: 'hydration' })
    await expect(page.getByTestId('username')).toBeVisible()
    await expect(page.getByTestId('password')).toBeVisible()
    await expect(page.getByTestId('login_button')).toBeVisible()
  })

  test('login with valid user credentials', async ({ page, goto }) => {
    await goto('/', { waitUntil: 'hydration' })
    await playwrightLogin(
      page,
      TEST_PARENT_USER.username,
      TEST_PARENT_USER.password
    )
    expect(page.url()).toMatch(/\/dashboard$/)
  })

  test('login with invalid user credentials', async ({ page, goto }) => {
    await goto('/', { waitUntil: 'hydration' })
    await page.getByTestId('username').fill(TEST_PARENT_USER.username)
    await page.getByTestId('password').fill('wrongpassword')
    await page.getByTestId('login_button').click()
    // Nuxt UI v4 renders toasts as li items in a data-slot="viewport" list
    await page.waitForSelector('[data-slot="viewport"] li[data-state="open"]')
    expect(page.url()).toMatch(/\/login$/)
  })

  test('remembered user can be deleted from the login page', async ({
    page,
    goto,
  }) => {
    await goto('/', { waitUntil: 'hydration' })
    await playwrightLogin(
      page,
      TEST_PARENT_USER.username,
      TEST_PARENT_USER.password
    )

    // Drop the session so the login page is shown again, keeping localStorage
    await page.context().clearCookies()
    await goto('/', { waitUntil: 'hydration' })

    const deleteButton = page.getByTestId(
      `delete-remembered-user-${TEST_PARENT_USER.username}`
    )
    await expect(deleteButton).toBeVisible()

    await deleteButton.click()

    await expect(deleteButton).toBeHidden()
    const remembered = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('rememberedUsers') ?? '[]')
    )
    expect(remembered).toHaveLength(0)
  })
})
