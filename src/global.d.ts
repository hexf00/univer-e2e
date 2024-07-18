/* eslint-disable ts/naming-convention */

import type { DocWarp } from './DocWarp'
import type { ErrorManager } from './ErrorManager'
import type { SheetWarp } from './SheetWarp'

declare global {
  interface Window {
    univerAPI: FUniver
  }
}

declare module 'playwright/test' {
  interface Page {
    errorManager: ErrorManager
    sheetWarp: SheetWarp
    docWarp: DocWarp
  }
}

export { }
