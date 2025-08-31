import { expect, test } from '@nuxt/test-utils/playwright'
import {
  resetDb,
  createAuthTestData,
  TEST_PARENT_USER,
  TEST_CHILD_USER,
  playwrightLogin,
  getUserByUsername,
  setTestUserPoints,
} from '../utils/index'

test.describe('Dashboard page', () => {
  test.beforeEach(async ({ page, goto }) => {
    await resetDb()
    await createAuthTestData()
  })

  test('Parent user can add and reduce points for child user', async ({
    page,
    goto,
  }) => {
    await goto('/', { waitUntil: 'hydration' })
    await playwrightLogin(
      page,
      TEST_PARENT_USER.username,
      TEST_PARENT_USER.password
    )

    // Add points - find the plus button and click it
    await page.getByTestId('child-points-increase').click()

    // Verify points were added (should be 1 now)
    const pointsElement = page.getByTestId('child-points-input')
    await expect(pointsElement).toHaveValue('1')

    // Reduce points - find the minus button and click it
    await page.getByTestId('child-points-decrease').click()

    // Verify points were reduced (should be 0 again)
    await expect(pointsElement).toHaveValue('0')
  })

  test('Parent user can navigate to child profile by clicking on child card', async ({
    page,
    goto,
  }) => {
    await goto('/', { waitUntil: 'hydration' })
    await playwrightLogin(
      page,
      TEST_PARENT_USER.username,
      TEST_PARENT_USER.password
    )

    const childUser = await getUserByUsername(TEST_CHILD_USER.username)

    await page.getByTestId('child-card').first().click()

    // Verify navigation to child profile page
    await page.waitForURL(`**/child/${childUser.id}`)
    expect(page.url()).toMatch(new RegExp(`/child/${childUser.id}$`))
  })

  test('Child user can see their points correctly', async ({ page, goto }) => {
    // Set points for the child user ahead of time
    await setTestUserPoints(TEST_CHILD_USER.username, 150)

    await goto('/', { waitUntil: 'hydration' })
    await playwrightLogin(
      page,
      TEST_CHILD_USER.username,
      TEST_CHILD_USER.password
    )

    const pointsElement = page.getByTestId('child-points-display')
    await expect(pointsElement).toBeVisible()

    // Check if the correct points value is displayed (150 in this case)
    await expect(pointsElement).toContainText('150')
  })
})
