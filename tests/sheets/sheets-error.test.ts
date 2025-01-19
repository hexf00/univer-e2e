import { expect, Page, test } from '@playwright/test'
import { CASE_TIMEOUT, E2E_ENDPOINT } from '@/const'
import { waitWorkbookReady } from '@/utils/waitWorkbookReady'

test.setTimeout(CASE_TIMEOUT)


const hasErrorMap = new Map<Page, boolean>()

test.afterEach(async ({ page }) => {
  expect(hasErrorMap.get(page), 'expect no error').toBeUndefined()
})

test('log', async ({ page }) => {
  await page.goto(E2E_ENDPOINT);
  page.on('pageerror', (_error) => {
    hasErrorMap.set(page, true)
  });
  page.on('console', (_msg) => {
    if (_msg.type() === 'error') {
      hasErrorMap.set(page, true)
    }
  })

  await waitWorkbookReady(page)
})
