import { ConsoleMessage, Page, expect } from "playwright/test";
import { isARealError } from "./isARealError";

export class ErrorManager {
  name: string = '';
  errors: ConsoleMessage[] = [];

  disposes: (() => void)[] = [];

  constructor ({
    name = 'defaultPage',
    page
  }: {
    name?: string;
    page: Page;
  }) {
    this.name = name;
    this.init(page);
  }

  init (page: Page) {
    const onConsole = (msg: ConsoleMessage) => {
      if (msg.type() === 'error') {
        this.errors.push(msg);
        if (isARealError(msg)) {
          expect(msg.location().url + '\t' + msg.text()).toBe('Discovered error');
        }
      }
    }

    page.on('console', onConsole);
    this.disposes.push(() => {
      page.off('console', onConsole);
    });
  }

  assertNoError () {
    // background yellow
    console.log(`\x1b[43m${this.errors.length} errors found in page ${this.name}: \x1b[0m`);
    console.log(this.errors.map((e) => e.text() + '\t' + e.location().url).join('\n'));
  }

  dispose () {
    this.disposes.forEach((dispose) => {
      dispose();
    });
    this.disposes = [];
    this.errors = [];
  }
}