import { defineManifest } from '@crxjs/vite-plugin';

// The API host the extension is allowed to call. Listing it under
// host_permissions lets the popup fetch it without CORS restrictions.
const API_HOST = process.env.VITE_API_URL ?? 'http://localhost:4000';

// Manifest V3, written to work on both Chromium and Firefox. The
// webextension-polyfill normalizes the runtime API differences.
export default defineManifest({
  manifest_version: 3,
  name: 'Expense Tracker',
  version: '0.1.0',
  description: 'Quickly capture expenses from any web page.',
  action: {
    default_popup: 'index.html',
    default_title: 'Expense Tracker',
  },
  icons: {
    '128': 'icon.svg',
  },
  permissions: ['storage'],
  host_permissions: [`${API_HOST}/*`],
  // Required for Firefox; ignored by Chromium.
  browser_specific_settings: {
    gecko: {
      id: 'expense-tracker@example.com',
    },
  },
});
