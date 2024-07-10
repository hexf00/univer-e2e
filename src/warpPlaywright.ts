
import { test as base, chromium } from '@playwright/test';
import { UserPageManager } from './UserPageManager';
import { IS_DEV } from './const';


export const warpPlaywright = async () => {

  if (IS_DEV) {
    const browser = await chromium.connectOverCDP('http://localhost:9222');

    const test = base.extend({
      context: async ({ }, use) => {
        // use the existing context
        const context = browser.contexts()[0];
        await use(context);
        // context.pages().slice(1).forEach(async (page) => {
        //   await page.close();
        // });
      },
      page: async ({ context }, use) => {
        // use the existing page
        await use(context.pages()[0]);
      }
    });
    return { test }
  } else {
    return { test: base }
  }
}

export const userPageManager = new UserPageManager();
