import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { User } from '@expense-tracker/shared';
import * as authApi from '../api/auth';
import { clearToken, getToken, setToken } from '../api/http';

interface AuthState {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // On mount, if a token exists, restore the session.
  useEffect(() => {
    let active = true;
    async function restore() {
      if (!getToken()) {
        setLoading(false);
        return;
      }
      try {
        const me = await authApi.fetchMe();
        if (active) setUser(me);
      } catch {
        clearToken();
      } finally {
        if (active) setLoading(false);
      }
    }
    void restore();
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await authApi.login({ email, password });
    setToken(res.token);
    setUser(res.user);
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    const res = await authApi.register({ email, password });
    setToken(res.token);
    setUser(res.user);
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, register, logout }),
    [user, loading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
