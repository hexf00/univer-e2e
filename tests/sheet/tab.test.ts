import { ErrorManager } from "@/ErrorManager";
import { SheetWarp } from "@/SheetWarp";
import { CASE_TIMEOUT } from "@/const";
import { warpPlaywright } from "@/warpPlaywright";
import { expect } from "playwright/test";

const { test } = await warpPlaywright();

test.beforeEach(async ({ page }) => {
  page.errorManager = new ErrorManager({
    page
  });
  page.sheetWarp = new SheetWarp({
    page
  });

});

test.afterEach(async ({ page }) => {
  page.errorManager.assertNoError();
  page.errorManager.dispose()
  page.errorManager = null!
  page.sheetWarp.dispose()
  page.sheetWarp = null!
});

test.setTimeout(CASE_TIMEOUT);

test('Univer Sheet Tab', async ({ page }) => {
  const { sheetWarp: sheet } = page;
  
  await page.sheetWarp.init();

  const count = await sheet.getTabs();

  await sheet.addSheet();
  expect(await sheet.getTabs()).toBe(count + 1);

  await sheet.inputA1('Hello Sheet1');
  await sheet.checkA1('Hello Sheet1');

  await sheet.addSheet();
  await sheet.inputA1('Hello Sheet2');
  await sheet.checkA1('Hello Sheet2');

  await sheet.switchTab(count);
  await sheet.checkA1('Hello Sheet1');

  await sheet.switchTab(count + 1);
  await sheet.checkA1('Hello Sheet2')
});
