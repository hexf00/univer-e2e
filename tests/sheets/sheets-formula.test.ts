import { test, expect } from '@playwright/test'
import { CASE_TIMEOUT, E2E_ENDPOINT } from '@/const'
import { waitWorkbookReady } from '@/utils/waitWorkbookReady'

test.setTimeout(CASE_TIMEOUT)

test('sheets-formula', async ({ page }) => {
  await page.goto(E2E_ENDPOINT)
  await waitWorkbookReady(page)

  // Test formula calculation
  const actualValue = await page.evaluate(async () => {
    const univerAPI = window.univerAPI
    const sheet = univerAPI.getActiveWorkbook()!.getActiveSheet()
    sheet.getRange('A1').setValue('=1+1')
    await new Promise(resolve => setTimeout(resolve, 1000))
    return sheet.getRange('A1').getValue()
  })

  expect(actualValue).toBe(2)
})
