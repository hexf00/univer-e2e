import { BrowserContext } from '@playwright/test';
import { E2E_COOKIE_DOMAIN, E2E_COOKIE_NAME, E2E_COOKIE_VALUE } from './const';


export const initCookie = async (context: BrowserContext) => {

  if (!E2E_COOKIE_NAME || !E2E_COOKIE_VALUE || !E2E_COOKIE_DOMAIN) {
    throw new Error('`E2E_COOKIE_NAME`, `E2E_COOKIE_VALUE`, `E2E_COOKIE_DOMAIN` must be set in the environment variables');
  }

  await context.addCookies([
    {
      name: E2E_COOKIE_NAME,
      value: E2E_COOKIE_VALUE,
      domain: E2E_COOKIE_DOMAIN,
      path: '/',
      expires: -1,
      secure: true,
      sameSite: 'None',
    }
  ]);
};
