'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { fetchCurrentUser, isAdminUser, type ParseUser } from '@/lib/blog/auth';
import {
  AUTH_STORAGE_KEY,
  clearStoredUser,
  readStoredUser,
  storeUser,
} from '@/lib/auth-session';

type AuthContextValue = {
  user: ParseUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  signInModalOpen: boolean;
  openSignIn: () => void;
  closeSignIn: () => void;
  login: (user: ParseUser) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ParseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [signInModalOpen, setSignInModalOpen] = useState(false);

  useEffect(() => {
    const stored = readStoredUser();
    setUser(stored);
    setIsLoading(false);

    if (stored) {
      // Revalidate in the background; a failed check must not sign the user out
      // because it is usually just a transient network error.
      fetchCurrentUser(stored.sessionToken).then((fresh) => {
        if (!fresh) return;
        const merged = { ...fresh, sessionToken: stored.sessionToken };
        setUser(merged);
        storeUser(merged);
      });
    }
  }, []);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === AUTH_STORAGE_KEY) setUser(readStoredUser());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const login = useCallback((next: ParseUser) => {
    setUser(next);
    storeUser(next);
    setSignInModalOpen(false);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    clearStoredUser();
  }, []);

  const refreshUser = useCallback(async () => {
    const token = user?.sessionToken ?? readStoredUser()?.sessionToken;
    if (!token) return;
    const fresh = await fetchCurrentUser(token);
    if (!fresh) return;
    const merged = { ...fresh, sessionToken: token };
    setUser(merged);
    storeUser(merged);
  }, [user?.sessionToken]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user?.sessionToken,
      isAdmin: isAdminUser(user),
      signInModalOpen,
      openSignIn: () => setSignInModalOpen(true),
      closeSignIn: () => setSignInModalOpen(false),
      login,
      logout,
      refreshUser,
    }),
    [user, isLoading, signInModalOpen, login, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside <AuthProvider>');
  return context;
}
