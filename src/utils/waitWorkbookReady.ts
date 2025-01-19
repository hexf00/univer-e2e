import { type Page } from 'playwright';

export const waitWorkbookReady = async (page: Page) => {

  await page.waitForFunction(() => {
    const univerAPI = window.univerAPI;
    if(!univerAPI) return false;

    if(!window.waitReady) {
      window.waitReady = univerAPI.getHooks().onRendered(()=>{
        window.univerReady = true;
      })
    }
    return univerAPI !== undefined && univerAPI.getActiveWorkbook()?.getActiveSheet() !== undefined && window.univerReady;
  }, undefined, { timeout: 5000 });
};
