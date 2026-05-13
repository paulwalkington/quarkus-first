'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

export const TOKEN_KEY = 'fleet_auth_token';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface JwtPayload {
  sub?: string;
  upn?: string;
  groups?: string[];
  exp?: number;
}

interface AuthState {
  token: string | null;
  username: string | null;
  role: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
}

interface AuthContextType extends AuthState {
  login: (token: string) => void;
  logout: () => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function parseToken(token: string): JwtPayload | null {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
  } catch {
    return null;
  }
}

function isExpired(payload: JwtPayload): boolean {
  return !!payload.exp && Date.now() / 1000 > payload.exp;
}

function stateFromToken(token: string): AuthState {
  const payload = parseToken(token);
  const role = payload?.groups?.[0] ?? null;
  return {
    token,
    username: payload?.upn ?? payload?.sub ?? null,
    role,
    isAuthenticated: true,
    isAdmin: role === 'admin',
    loading: false,
  };
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const AuthContext = createContext<AuthContextType | null>(null);

const INITIAL_STATE: AuthState = {
  token: null,
  username: null,
  role: null,
  isAuthenticated: false,
  isAdmin: false,
  loading: true,
};

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(INITIAL_STATE);

  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (stored) {
      const payload = parseToken(stored);
      if (payload && !isExpired(payload)) {
        setState(stateFromToken(stored));
        return;
      }
      localStorage.removeItem(TOKEN_KEY);
    }
    setState(prev => ({ ...prev, loading: false }));
  }, []);

  const login = useCallback((token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
    setState(stateFromToken(token));
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setState({ ...INITIAL_STATE, loading: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
