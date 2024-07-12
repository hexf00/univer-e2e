import { Page, expect } from "playwright/test";
import { E2E_SHEET_ENDPOINT, INPUT_DELAY, IS_DEV } from "./const";

export class SheetWarp {
  name: string = '';
  page: Page;

  constructor ({
    name = 'defaultPage',
    page
  }: {
    name?: string;
    page: Page;
  }) {
    this.name = name;
    this.page = page;
  }
  
  async init(){
    if(!IS_DEV){
      await this.page.goto(E2E_SHEET_ENDPOINT);
    }

    // await this.page.waitForLoadState('domcontentloaded');

    // await this.page.waitForSelector('.univer-app-container-canvas > canvas.univer-render-canvas');

    await this.page.waitForFunction(() => {
      return window.univerAPI && window.univerAPI.getActiveWorkbook()
    }, undefined, {
      timeout: 3000,
      polling: 500
    })
  }

  async addSheet () {
    const { page } = this;
    await page.locator('svg.univerjs-icon-increase-single').first().click();
  }

  async inputA1 (text = 'Hello Univer!') {
    const { page } = this;

    await page.locator('.univer-app-container-canvas > canvas.univer-render-canvas').dblclick({
      position: {
        x: 88,
        y: 29
      }
    });
    await page.keyboard.type(text, { delay: INPUT_DELAY });
    await page.keyboard.press('Enter');
  }

  async checkA1 (text = 'Hello Univer!') {
    const { page } = this;
    const jsHandle = await page.waitForFunction(() => {
      if (!window.univerAPI) {
        return false
      }
      const activeSheet = window.univerAPI.getActiveWorkbook().getActiveSheet();
      const range = activeSheet.getRange(0, 0, 2, 2);

      if (!range) {
        return false
      }
      return range.getValue()
    }, undefined, {
      timeout: 3000,
      polling: 500
    })
    const actualValue = await jsHandle.evaluate((handle) => handle);
    expect(actualValue).toBe(text);
  }

  async getTabs () {
    const { page } = this;
    const tabs = await page.locator('.univer-slide-tab-item').count();
    return tabs;
  }

  async switchTab (index: number) {
    const { page } = this;
    await page.locator('.univer-slide-tab-item').nth(index).click();
  }

  dispose () {

  }
}
