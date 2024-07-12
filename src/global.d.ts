import { DocWarp } from "./DocWarp";
import { ErrorManager } from "./ErrorManager";
import { SheetWarp } from "./SheetWarp";

declare global {
  interface Window {
    univerAPI: FUniver
  }
}

declare module "playwright/test" {
  interface Page {
    errorManager: ErrorManager;
    sheetWarp: SheetWarp;
    docWarp: DocWarp;
  }
}

export { };