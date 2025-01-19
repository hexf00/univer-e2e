import { type Page } from 'playwright';

export const waitWorkbookReady = async (page: Page) => {
  await page.waitForFunction(() => {
    const univerAPI = window.univerAPI;
    return univerAPI !== undefined && univerAPI.getActiveWorkbook()?.getActiveSheet() !== undefined;
  }, undefined, { timeout: 5000 });
};
