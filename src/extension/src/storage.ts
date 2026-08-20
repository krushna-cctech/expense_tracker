/** Token storage backed by browser.storage.local (works on Chromium + Firefox
 *  via webextension-polyfill). Async, unlike the PWA's localStorage version. */
import browser from 'webextension-polyfill';

const TOKEN_KEY = 'expense-tracker.token';

export async function getToken(): Promise<string | null> {
  const result = await browser.storage.local.get(TOKEN_KEY);
  const value = result[TOKEN_KEY];
  return typeof value === 'string' ? value : null;
}

export async function setToken(token: string): Promise<void> {
  await browser.storage.local.set({ [TOKEN_KEY]: token });
}

export async function clearToken(): Promise<void> {
  await browser.storage.local.remove(TOKEN_KEY);
}
