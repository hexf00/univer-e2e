const { chromium } = require('@playwright/test');

(async () => {
  const browserClient = await chromium.connectOverCDP('http://localhost:9222')
  const page = browserClient.contexts()[0].pages()[0]
  await page.pause()
  await browserClient.close()
  process.exit(0)
})()
