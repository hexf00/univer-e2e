import { DocWarp } from '@/DocWarp'
import { ErrorManager } from '@/ErrorManager'
import { CASE_TIMEOUT } from '@/const'
import { warpPlaywright } from '@/warpPlaywright'

const { test } = await warpPlaywright()

test.beforeEach(async ({ page }) => {
  page.errorManager = new ErrorManager({
    page,
  })
  page.docWarp = new DocWarp({
    page,
  })
})

test.afterEach(async ({ page }) => {
  page.errorManager.assertNoError()

  page.errorManager.dispose()
  page.errorManager = null!
  page.docWarp.dispose()
  page.docWarp = null!
})

test.setTimeout(CASE_TIMEOUT)

test('Univer Doc Base', async ({ page }) => {
  const { docWarp: doc } = page

  await page.docWarp.init()

  await doc.input('Hello Univer!')

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
