import { useEffect, useState } from 'react';
import { getToken, clearToken } from '../storage';
import { LoginView } from './LoginView';
import { QuickAddView } from './QuickAddView';

/** Popup root: shows login until a token exists, then the quick-add form. */
export function Popup() {
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    void getToken().then((token) => setAuthed(Boolean(token)));
  }, []);

  async function handleLogout() {
    await clearToken();
    setAuthed(false);
  }

  if (authed === null) {
    return <div className="popup">Loading…</div>;
  }

  return (
    <div className="popup">
      {authed ? (
        <QuickAddView onLogout={handleLogout} />
      ) : (
        <LoginView onLoggedIn={() => setAuthed(true)} />
      )}
    </div>
  );
}
