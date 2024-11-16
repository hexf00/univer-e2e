import type { Page } from 'playwright/test'
import { expect } from 'playwright/test'
import { E2E_SHEET_ENDPOINT, E2E_SHEET_ENDPOINT_OSS, INPUT_DELAY, IS_DEV } from './const'
import { initCookie } from './initCookie'

export class SheetWarp {
  name: string = ''
  page: Page

  constructor({
    name = 'defaultPage',
    page,
  }: {
    name?: string
    page: Page
  }) {
    this.name = name
    this.page = page
  }

  async init({ isOSS = false }: { isOSS?: boolean } = {}) {
    if (!IS_DEV) {
      const url = isOSS ? E2E_SHEET_ENDPOINT_OSS : E2E_SHEET_ENDPOINT
      if (isOSS) {
        await initCookie(this.page.context())
      }
      await this.page.goto(url)
    }

    // await this.page.waitForLoadState('domcontentloaded');

    // await this.page.waitForSelector('.univer-app-container-canvas > canvas.univer-render-canvas');

    await this.page.waitForFunction(() => {
      return window.univerAPI && window.univerAPI.getActiveWorkbook()
    }, undefined, {
      timeout: 3000,
      polling: 500,
    })
  }

  async addSheet() {
    const { page } = this
    await page.locator('svg.univerjs-icon-increase-single').first().click()
  }

  getEditorDom() {
    const { page } = this

    // page.locator('.univer-app-container-canvas > canvas.univer-render-canvas') // <= 0.2.3

    return page.locator('.univer-workbench-container-canvas > canvas.univer-render-canvas')
  }

  async inputA1(text = 'Hello Univer!') {
    const { page } = this

    await this.getEditorDom().dblclick({
      position: {
        x: 88,
        y: 29,
      },
    })
    await page.keyboard.type(text, { delay: INPUT_DELAY })
    await page.keyboard.press('Enter')
  }

  async checkA1(text = 'Hello Univer!') {
    const { page } = this
    const jsHandle = await page.waitForFunction(() => {
      if (!window.univerAPI) {
        return false
      }
      const activeSheet = window.univerAPI.getActiveWorkbook()!.getActiveSheet()
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
    expect(actualValue).toBe(text)
  }

  async getTabs() {
    const { page } = this
    const tabs = await page.locator('.univer-slide-tab-item').count()
    return tabs
  }

  async switchTab(index: number) {
    const { page } = this
    await page.locator('.univer-slide-tab-item').nth(index).click()
  }

  dispose() {

  }
}
