import type { Page } from 'playwright/test'
import { E2E_DOC_ENDPOINT, INPUT_DELAY, IS_DEV } from './const'
import { initCookie } from './initCookie'

export class DocWarp {
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

  async input(text = 'Hello Univer!') {
    const { page } = this
    await page.keyboard.type(text, { delay: INPUT_DELAY })
    await page.keyboard.press('Enter')
  }

  async init() {
    if (!IS_DEV) {
      await initCookie(this.page.context())
      await this.page.goto(E2E_DOC_ENDPOINT)
    }

    // await this.page.waitForLoadState('domcontentloaded');

    // await this.page.waitForSelector('.univer-app-container-canvas > canvas.univer-render-canvas');

    await this.page.waitForFunction(() => {
      return window.univerAPI
    }, undefined, {
      timeout: 3000,
      polling: 500,
    })
  }

  dispose() {

  }
}
