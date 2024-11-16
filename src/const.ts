import dotenv from 'dotenv'

dotenv.config()

export const IS_DEV = process.env.NODE_ENV === 'development'

export const E2E_SHEET_ENDPOINT = process.env.E2E_SHEET_ENDPOINT || 'http://localhost:3000'
export const E2E_SHEET_ENDPOINT_OSS = process.env.E2E_SHEET_ENDPOINT_OSS || 'http://localhost:3000'

export const E2E_DOC_ENDPOINT = process.env.E2E_DOC_ENDPOINT || 'http://localhost:3000'

export const DONE_DO_NOT_CLOSE_BROWSER = process.env.DONE_DO_NOT_CLOSE_BROWSER ?? (process.env.DONE_DO_NOT_CLOSE_BROWSER === 'true')

export const CASE_TIMEOUT = 60 * 1000

export const E2E_COOKIE_NAME = process.env.E2E_COOKIE_NAME || ''
export const E2E_COOKIE_VALUE = process.env.E2E_COOKIE_VALUE || ''
export const E2E_COOKIE_DOMAIN = process.env.E2E_COOKIE_DOMAIN || ''

/** input delay in ms */
export const INPUT_DELAY = 75
