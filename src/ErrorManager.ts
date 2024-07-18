import type { ConsoleMessage, Page } from 'playwright/test'
import { expect } from 'playwright/test'
import { isARealError } from './isARealError'

export class ErrorManager {
  name: string = ''
  errors: ConsoleMessage[] = []

  disposes: (() => void)[] = []

  constructor({
    name = 'defaultPage',
    page,
  }: {
    name?: string
    page: Page
  }) {
    this.name = name
    this.init(page)
  }

  init(page: Page) {
    const onConsole = (msg: ConsoleMessage) => {
      if (msg.type() === 'error') {
        this.errors.push(msg)
        if (isARealError(msg)) {
          expect(`${msg.location().url}\t${msg.text()}`).toBe('Discovered error')
        }
      }
    }

    page.on('console', onConsole)
    this.disposes.push(() => {
      page.off('console', onConsole)
    })

    const onPageError = (msg: Error) => {
      onConsole({
        type: () => 'error',
        text: () => msg.message,
        args: () => [],
        page: () => page,
        location: () => {
          return {
            url: page.url(),
            lineNumber: 0,
            columnNumber: 0,
          }
        },
      })
    }
    page.on('pageerror', onPageError)
    this.disposes.push(() => {
      console.log(`\x1B[43mErrorManager dispose page ${this.name}\x1B[0m`)
      page.off('pageerror', onPageError)
    })
  }

  assertNoError() {
    // background yellow
    console.log(`\x1B[43m${this.errors.length} errors found in page ${this.name}: \x1B[0m`)
    console.log(this.errors.map(e => `${e.text()}\t${e.location().url}`).join('\n'))
  }

  dispose() {
    this.disposes.forEach((dispose) => {
      dispose()
    })
    this.disposes = []
    this.errors = []
  }
}
