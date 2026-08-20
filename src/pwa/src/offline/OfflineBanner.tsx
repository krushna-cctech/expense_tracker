import { useOnlineStatus } from './useOnlineStatus';

/** Shows a banner when offline. Writes made while offline are queued by the
 *  service worker and replayed automatically on reconnect. */
export function OfflineBanner() {
  const online = useOnlineStatus();
  if (online) {
    return null;
  }
  return (
    <div className="offline-banner" role="status">
      You are offline. Changes will sync when you reconnect.
    </div>
  );
}
