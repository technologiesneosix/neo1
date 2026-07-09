import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { http, useRemoteApi } from '@/api/client';

interface AuthUser {
  name: string;
  email: string;
  role: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const STORAGE_KEY = 'neosix.auth.user';
const TOKEN_KEY = 'neosix.auth.token';

/** Demo credentials for the standalone build; a real backend replaces this. */
const DEMO_EMAIL = 'technologiesneosix@gmail.com';
const DEMO_PASSWORD = 'neosix123';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
      return null;
    }
  });

  const login = useCallback(async (email: string, password: string) => {
    if (useRemoteApi) {
      try {
        const response = await http.post('/auth/login', { email, password });
        // Response format: { success: true, message: '...', data: { admin, accessToken } }
        const payload = response.data?.data;
        if (!payload || !payload.accessToken || !payload.admin) {
          throw new Error('Invalid response from authentication server');
        }
        const authUser: AuthUser = {
          name: payload.admin.name || 'Admin',
          email: payload.admin.email,
          role: 'Administrator',
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
        localStorage.setItem(TOKEN_KEY, payload.accessToken);
        setUser(authUser);
      } catch (error: any) {
        const errMsg = error.response?.data?.message || error.message || 'Invalid email or password';
        throw new Error(errMsg);
      }
    } else {
      await new Promise((resolve) => setTimeout(resolve, 400));
      if (email.toLowerCase() !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
        throw new Error('Invalid email or password');
      }
      const authUser: AuthUser = { name: 'Admin', email: DEMO_EMAIL, role: 'Administrator' };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
      localStorage.setItem(TOKEN_KEY, 'demo-token');
      setUser(authUser);
    }
  }, []);

  const logout = useCallback(() => {
    if (useRemoteApi) {
      http.post('/auth/logout').catch(() => {
        // Ignore logout network errors
      });
    }
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, login, logout }), [user, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
