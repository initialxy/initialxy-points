import { expect, test } from '@nuxt/test-utils/playwright'
import {
  resetDb,
  createAuthTestData,
  TEST_PARENT_USER,
  TEST_CHILD_USER,
  playwrightLogin,
} from '../utils/index'

test.describe('Logs rendering', () => {
  test.beforeEach(async ({ page, goto }) => {
    await resetDb()
    await createAuthTestData()
  })

  test('Logs are debounced on server correctly and rendered on client', async ({
    page,
    goto,
  }) => {
    await goto('/', { waitUntil: 'hydration' })
    await playwrightLogin(
      page,
      TEST_PARENT_USER.username,
      TEST_PARENT_USER.password
    )

    const increaseButton = page.getByTestId('child-points-increase')
    const decreaseButton = page.getByTestId('child-points-decrease')
    const logList = page.getByTestId('log-list')

    // Add points - find the plus button and click it
    await increaseButton.click()
    await expect(logList).toContainText(
      `${TEST_PARENT_USER.username} gave 1 points to ${TEST_CHILD_USER.username}`
    )

    // Add again
    await increaseButton.click()
    await expect(logList).toContainText(
      `${TEST_PARENT_USER.username} gave 2 points to ${TEST_CHILD_USER.username}`
    )

    // Reduce points twice
    await decreaseButton.click()
    await decreaseButton.click()
    await expect(logList).not.toBeVisible()
  })
})
