import { expect, test } from '@playwright/test'
import { CASE_TIMEOUT, E2E_ENDPOINT } from '@/const'
import { waitWorkbookReady } from '@/utils/waitWorkbookReady'

test.setTimeout(CASE_TIMEOUT)

test('sheets-menu', async ({ page }) => {
  await page.goto(E2E_ENDPOINT)
  await waitWorkbookReady(page)

  const fontIcon = page.locator('.univer-toolbar .univerjs-icon-font-color')
  await fontIcon.waitFor({ state: 'attached', timeout: 1000 });
  fontIcon.locator('..').locator('..').locator('.univerjs-icon-more-down-single').click()

  const menu = page.locator('.univer-menu');
  await menu.waitFor({ state: 'attached', timeout: 1000 });
  await expect(menu).toBeVisible()
})
