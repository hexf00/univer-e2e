/**
 * E2E_ENDPOINT==http://127.0.0.1:3010 pnpm exec playwright test sheets-collaboration
 */
import { type Page, expect, test } from 'playwright/test'
import { CASE_TIMEOUT, E2E_ENDPOINT, SKIP_CREATE_UNIT } from '@/const'
import { waitWorkbookReady } from '@/utils/waitWorkbookReady'

let pages: {
  user1: Page
  user2: Page
}

test.setTimeout(1000 * 60 * 5)

test.beforeEach(async ({ browser }) => {
  const context1 = await browser.newContext()
  const page1 = await context1.newPage()
  const context2 = await browser.newContext()
  const page2 = await context2.newPage()

  if (SKIP_CREATE_UNIT) {
    await page1.goto(E2E_ENDPOINT)
    await page2.goto(E2E_ENDPOINT)
  } else {
    await page1.goto(E2E_ENDPOINT)
    await page1.waitForURL(url => url.search.includes('unit'), { timeout: 10000 })
    const currentUrl = page1.url()
    await page2.goto(currentUrl)
  }

  // 加了反而报错，可能太快执行完成
  // await Promise.all([
  //   waitWorkbookReady(page1),
  //   waitWorkbookReady(page2),
  // ])

  // Store pages in module scope
  pages = {
    user1: page1,
    user2: page2,
  }
})

test.afterEach(async () => {
  if (pages) {
    await pages.user1.context().close()
    await pages.user2.context().close()
  }
})

test.setTimeout(CASE_TIMEOUT)

test('sheets-collaboration', async () => {
  const testText = 'Hello Univer!'
  const page1 = pages.user1
  const page2 = pages.user2

  // dblclick A1 cell to open the editor
  await page1.locator('.univer-workbench-container-canvas > canvas.univer-render-canvas').dblclick({
    position: {
      x: 88,
      y: 29,
    },
    timeout: 10000,
  })
  await page1.keyboard.press('Control+A')
  await page1.keyboard.press('Delete')
  await page1.keyboard.type(testText, { delay: 200 })
  await page1.keyboard.press('Enter')

  const jsHandle = await page2.waitForFunction(() => {
    const univerAPI = window.univerAPI
    if (!univerAPI) return false
    const sheet = univerAPI.getActiveWorkbook()?.getActiveSheet()
    const range = sheet?.getRange('A1')
    return range?.getValue()
  }, undefined, {
    timeout: 3000,
    polling: 500,
  })
  expect(await jsHandle.jsonValue()).toBe(testText)
})
