import { BrowserContext } from '@playwright/test';


export const initCookie = async (context: BrowserContext) => {

  if (!process.env.E2E_COOKIE_NAME || !process.env.E2E_COOKIE_VALUE || !process.env.E2E_COOKIE_DOMAIN) {
    throw new Error('`E2E_COOKIE_NAME`, `E2E_COOKIE_VALUE`, `E2E_COOKIE_DOMAIN` must be set in the environment variables');
  }

  await context.addCookies([
    {
      name: process.env.E2E_COOKIE_NAME || '',
      value: process.env.E2E_COOKIE_VALUE || '',
      domain: process.env.E2E_COOKIE_DOMAIN || '',
      path: '/',
      expires: -1,
      secure: true,
      sameSite: 'None',
    }
  ]);
};
