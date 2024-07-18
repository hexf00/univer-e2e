import { expect } from 'playwright/test'
import { CASE_TIMEOUT, E2E_SHEET_ENDPOINT } from '@/const'
import { userPageManager, warpPlaywright } from '@/warpPlaywright'

const { test } = await warpPlaywright()

test.beforeEach(async ({ browser }) => {
  userPageManager.setBrowser(browser)
  // created 2 pages
  await userPageManager.createUserPage({
    name: 'user1',
  })
  await userPageManager.createUserPage({
    name: 'user2',
  })

  const url = await userPageManager.pageDoSomething('user1', async (page) => {
    await page.goto(E2E_SHEET_ENDPOINT)
    await page.waitForURL(url => url.search.includes('unit'), { timeout: 10000 })
    return page.url()
  })

  await userPageManager.pageDoSomething('user2', async (page) => {
    await page.goto(url)
  })
})

test.afterAll(async () => {
  await userPageManager.dispose()
})

test.setTimeout(CASE_TIMEOUT)

test('Univer Collaborative Basic', async () => {
  const testText = 'Hello Univer!'
  await userPageManager.pageDoSomething('user1', async (page) => {
    // dblclick A1 cell to open the editor
    await page.locator('.univer-workbench-container-canvas > canvas.univer-render-canvas').dblclick({
      position: {
        x: 88,
        y: 29,
      },
    })
    await page.keyboard.type(testText, { delay: 200 })
    await page.keyboard.press('Enter')
  })

  await userPageManager.pageDoSomething('user2', async (page) => {
    const jsHandle = await page.waitForFunction(() => {
      if (!window.univerAPI) {
        return false
      }
      const activeSheet = window.univerAPI.getActiveWorkbook().getActiveSheet()
      const range = activeSheet.getRange(0, 0, 2, 2)

      if (!range) {
        return false
      }
      return range.getValue()
    }, undefined, {
      timeout: 3000,
      polling: 500,
    })
    const actualValue = await jsHandle.evaluate(handle => handle)
    expect(actualValue).toBe(testText)
  })
})
