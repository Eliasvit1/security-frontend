import React, { createContext, useContext, useState, useEffect } from 'react';
import { sanitizeInput, isValidUsername } from '../utils/sanitize';

const AuthContext = createContext(null);

export const LDAP_AUTH_URL = 'http://localhost:8083';
export const BACKEND_API_URL = 'http://localhost:8082';

const STORAGE_TOKEN_KEY = 'sec_ops_auth_token';
const STORAGE_USER_KEY = 'sec_ops_auth_user';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    try {
      return sessionStorage.getItem(STORAGE_TOKEN_KEY) || null;
    } catch {
      return null;
    }
  });

  const [user, setUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [status, setStatus] = useState({
    type: 'idle', // idle, loading, success, error
    message: token ? 'Active session restored' : 'Ready for authentication',
  });

  // Sync token and user with sessionStorage
  useEffect(() => {
    try {
      if (token) {
        sessionStorage.setItem(STORAGE_TOKEN_KEY, token);
      } else {
        sessionStorage.removeItem(STORAGE_TOKEN_KEY);
      }

      if (user) {
        sessionStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
      } else {
        sessionStorage.removeItem(STORAGE_USER_KEY);
      }
    } catch {
      // Storage unavailable or disabled
    }
  }, [token, user]);

  /**
   * Authenticates user against OpenLDAP via LDAPS (port 636)
   * and acquires a signed JWT bearer token.
   */
  const login = async (rawUsername, password) => {
    const trimmedUsername = (rawUsername || '').trim();

    // 1. Client-side input validation and XSS prevention
    if (!isValidUsername(trimmedUsername)) {
      const errorMsg =
        'Username contains invalid characters. Permitted charset: alphanumeric, ., _, @, +, - (max 64 chars).';
      setStatus({ type: 'error', message: errorMsg });
      return { success: false, error: errorMsg };
    }

    const cleanUsername = sanitizeInput(trimmedUsername);
    setStatus({ type: 'loading', message: 'Authenticating via secure LDAPS...' });

    try {
      const response = await fetch(`${LDAP_AUTH_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          username: cleanUsername,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.access_token) {
        // Securely set token in memory & sessionStorage without logging to console
        setToken(data.access_token);

        const profile = {
          username: data.user?.username || cleanUsername,
          fullName: data.user?.full_name || cleanUsername,
          email: data.user?.email || `${cleanUsername}@example.com`,
          groups: data.user?.groups || ['user'],
          dn: data.user?.dn || `uid=${cleanUsername},ou=users,dc=example,dc=com`,
          tokenType: data.token_type || 'bearer',
          loginTime: new Date().toLocaleTimeString(),
        };

        setUser(profile);
        setStatus({
          type: 'success',
          message: `Authenticated as ${profile.username} (200 OK)`,
        });

        return { success: true, user: profile };
      } else {
        setToken(null);
        setUser(null);
        const errDetail = data.detail || `Auth failed (${response.status})`;
        setStatus({ type: 'error', message: errDetail });
        return { success: false, error: errDetail };
      }
    } catch (err) {
      setToken(null);
      setUser(null);
      const networkErr = err.message || 'Network / Service Error';
      setStatus({ type: 'error', message: networkErr });
      return { success: false, error: networkErr };
    }
  };

  /**
   * Clears the active session and credentials
   */
  const logout = () => {
    setToken(null);
    setUser(null);
    try {
      sessionStorage.removeItem(STORAGE_TOKEN_KEY);
      sessionStorage.removeItem(STORAGE_USER_KEY);
    } catch {
      // ignore
    }
    setStatus({ type: 'idle', message: 'Session closed successfully' });
  };

  /**
   * Performs an authenticated fetch with the active JWT session
   */
  const authFetch = async (url, options = {}) => {
    if (!token) {
      throw new Error('No active session token available.');
    }

    const headers = {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    };

    const res = await fetch(url, { ...options, headers });
    if (res.status === 401) {
      // Token expired or invalid
      logout();
      setStatus({
        type: 'error',
        message: 'Session expired or invalid signature. Please login again.',
      });
    }
    return res;
  };

  const value = {
    token,
    user,
    isAuthenticated: Boolean(token),
    status,
    setStatus,
    login,
    logout,
    authFetch,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
