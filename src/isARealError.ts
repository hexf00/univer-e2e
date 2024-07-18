import type { ConsoleMessage } from 'playwright'

export function isARealError(error: ConsoleMessage) {
  if ([
    'Failed to load resource: the server responded with a status of 404 ()',
  ].includes(error.text())) {
    return false
  }

  if (error.text().includes('hook already exists')) {
    return false
  }

  if (error.location().url.includes('favicon.ico')) {
    return false
  }

  return true
}
