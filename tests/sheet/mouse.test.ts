import { ErrorManager } from '@/ErrorManager'
import { SheetWarp } from '@/SheetWarp'
import { CASE_TIMEOUT } from '@/const'
import { warpPlaywright } from '@/warpPlaywright'

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

test('Univer Sheet Mouse', async ({ page }) => {
  await page.sheetWarp.init()

  const randomMoveScroll = async () => {
    const { width, height } = await page.evaluate(() => {
      return {
        width: window.innerWidth,
        height: window.innerHeight,
      }
    })

    const centerX = width / 2
    const centerY = height / 2

    // move mouse to center
    await page.mouse.move(centerX, centerY)

    for (let i = 0; i < 10; i++) {
      // random move
      await page.mouse.move(
        Math.floor(centerX + Math.random() * 200),
        Math.floor(centerY + Math.random() * 200),
      )

      // random scroll
      const dx = Math.floor(Math.random() * 100) - 50
      const dy = Math.floor(Math.random() * 100) - 50
      await page.mouse.wheel(dx, dy)

      await page.waitForTimeout(110)
    }
  }

  await randomMoveScroll()
})
