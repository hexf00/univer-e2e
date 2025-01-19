import { expect, test, type Page } from '@playwright/test'
import { CASE_TIMEOUT, E2E_ENDPOINT } from '@/const'
import { } from 'playwright'
import { waitWorkbookReady } from '@/utils/waitWorkbookReady'

const checkCellVal = async (page: Page, range: string, expected: string|null) => {
  await page.waitForFunction(({ range, expected }) => {
    const univerAPI = window.univerAPI
    const sheet = univerAPI.getActiveWorkbook()!.getActiveSheet()
    return sheet.getRange(range).getValue() === expected
  }, { range, expected }, { timeout: 1000 })
}

const getTabCount = async (page: Page) => {
  return await page.evaluate(() => {
    const univerAPI = window.univerAPI
    return univerAPI.getActiveWorkbook()!.getSheets().length
  })
}

const switchTab = async (page: Page, index: number) => {
  const tab = page.locator(`.univer-slide-tab-bar > div:nth-child(${index})`)
  await tab.click()
}

const inputCellVal = async (page: Page, range: string, val: string) => {
  await page.evaluate(({ range, val }) => {
    const univerAPI = window.univerAPI
    const sheet = univerAPI.getActiveWorkbook()!.getActiveSheet()
    sheet.getRange(range).setValue(val)
  }, { range, val })
}

test.setTimeout(CASE_TIMEOUT)

test('sheets-tabs', async ({ page }) => {
  await page.goto(E2E_ENDPOINT)
  await waitWorkbookReady(page)

  expect(await getTabCount(page), 'Tab Count = 1').toBe(1)

  await inputCellVal(page, 'A1', 'Hello Sheet1');
  await checkCellVal(page, 'A1', 'Hello Sheet1');

  // insert sheet
  await page.evaluate(() => {
    const univerAPI = window.univerAPI
    univerAPI.getActiveWorkbook()!.insertSheet()
  })
  expect(await getTabCount(page), 'Tab Count = 2').toBe(2)
  await checkCellVal(page, 'A1', null);

  await inputCellVal(page, 'A1', 'Hello Sheet2');
  await checkCellVal(page, 'A1', 'Hello Sheet2')

  await switchTab(page, 1)
  await checkCellVal(page, 'A1', 'Hello Sheet1')

  await switchTab(page, 2)
  await checkCellVal(page, 'A1', 'Hello Sheet2')
})
