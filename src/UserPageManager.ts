import { initCookie } from './initCookie';
import { Browser, BrowserContext, Page } from "playwright/test";
import { ErrorManager } from "./ErrorManager";
import { logDecorator } from './logDecorator';

export class UserPageManager {
  browser!: Browser;
  contexts = new Map<string, BrowserContext>();
  pages = new Map<string, Page>();
  errors = new Map<string, ErrorManager>();

  constructor (browser?: Browser) {
    if (browser) {
      this.browser = browser;
    }
  }

  setBrowser (browser: Browser) {
    this.browser = browser;
  }

  @logDecorator
  async createUserPage ({
    name
  }: {
    name: string;
  }) {
    const context = await this.browser.newContext();
    this.contexts.set(name, context);
    initCookie(context);
    const page = await context.newPage();
    this.pages.set(name, page);
    this.errors.set(name, new ErrorManager({
      page,
      name
    }));

    return page;
  }

  async pageDoSomething<T> (name: string, fn: (page: Page) => Promise<T>) {
    const page = this.pages.get(name);
    if (!page) {
      throw new Error(`Page ${name} not found`);
    }
    return await fn(page);
  };

  async dispose () {

    // log errors
    for (const name of this.errors.keys()) {
      const errorsManager = this.errors.get(name)!; 
      errorsManager.assertNoError();
    }

    for (const context of this.contexts.values()) {
      try {
        await context.close();
      } catch (error) {
        console.log('Error on context close', error);
      }
    }

    this.pages.clear();
    this.contexts.clear();
  }
}
