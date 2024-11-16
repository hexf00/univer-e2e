import { ErrorManager } from '@/ErrorManager'
import { SheetWarp } from '@/SheetWarp'
import { CASE_TIMEOUT } from '@/const'
import { warpPlaywright } from '@/warpPlaywright'
import { expect } from 'playwright/test'

const { test } = await warpPlaywright()

test.beforeEach(async ({ page }) => {
  page.errorManager = new ErrorManager({
    page,
  })
  page.sheetWarp = new SheetWarp({
    page,
  })
})

test.afterEach(async ({ page }) => {
  page.errorManager.assertNoError()

  page.errorManager.dispose()
  page.errorManager = null!
  page.sheetWarp.dispose()
  page.sheetWarp = null!
})

test.setTimeout(CASE_TIMEOUT)

test('Univer Sheet Formula', async ({ page }) => {
  await page.sheetWarp.init({
    isOSS: true,
  })

  const actualValue = await page.evaluate(() => {
    const univerAPI = window.univerAPI
    const activeSheet = univerAPI.getActiveWorkbook()!.getActiveSheet()
    activeSheet.getRange('A1').setValue('=1+1')
    
 

    
    
    return activeSheet.getRange('A1').getValue()
  })

  await page.waitForFunction(() => {  
  
      const value = window.univerAPI.getActiveWorkbook()!.getActiveSheet().getRange('A1').getValue()
      if (value === 2) {
        return true
      }
      return false
  }, {timeout: 1000})

})
