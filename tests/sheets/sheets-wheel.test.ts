import { test } from '@playwright/test'
import { CASE_TIMEOUT, E2E_ENDPOINT } from '@/const'
import { waitWorkbookReady } from '@/utils/waitWorkbookReady'

test.setTimeout(CASE_TIMEOUT)

test('sheets-wheel', async ({ page }) => {
  await page.goto(E2E_ENDPOINT)
  await waitWorkbookReady(page)

  const canvas = page.locator('.univer-workbench-container-canvas > canvas.univer-render-canvas')
  await canvas.waitFor({ state: 'attached', timeout: 1000 })

  // Get canvas position
  const { x, y } = await canvas.boundingBox() || { x: 0, y: 0 }

  await page.mouse.move(x + 100, y + 100)

  // Test vertical scrolling
  await page.mouse.wheel(0, 100)
  await page.mouse.wheel(200, 0)
  await page.waitForTimeout(0)
  // TODO， 暂时不报错就行
})
