import { expect, test } from '@playwright/test'
import { CASE_TIMEOUT, E2E_ENDPOINT } from '@/const'
import { waitWorkbookReady } from '@/utils/waitWorkbookReady'

test.setTimeout(CASE_TIMEOUT)

test('sheets-formula', async ({ page }) => {
  await page.goto(E2E_ENDPOINT)
  await waitWorkbookReady(page)

  await page.locator('.univer-workbench-container-canvas > canvas.univer-render-canvas').dblclick({
    position: {
      x: 88,
      y: 29,
    },
    timeout: 10000,
  })
  await page.keyboard.press('Control+A')
  await page.keyboard.press('Delete')
  await page.keyboard.type('=sum(1,1)', { delay: 120 })
  await page.keyboard.press('Enter')

  // Test formula calculation
  const actualValue = await page.evaluate(async () => {
    const univerAPI = window.univerAPI
    const sheet = univerAPI.getActiveWorkbook()!.getActiveSheet()
    return sheet.getRange('A1').getValue()
  })

  expect(actualValue).toBe(2)
})
