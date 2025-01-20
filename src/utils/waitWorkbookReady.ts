import type { Page } from 'playwright'

export async function waitWorkbookReady(page: Page) {
  await page.waitForFunction(() => {
    const univerAPI = window.univerAPI
    if (!univerAPI) return false
    return true
  }, undefined, {
    timeout: 5000,
  })

  await page.waitForFunction(() => {
    const univerAPI = window.univerAPI
    if (!window.waitReady) {
      // 可能延迟执行
      window.waitReady = univerAPI.getHooks().onRendered(() => {
        window.univerReady = true
      })
    }
    return univerAPI !== undefined && univerAPI.getActiveWorkbook()?.getActiveSheet() !== undefined && window.univerReady
  }, undefined, {
    timeout: 5000,
  })
}
