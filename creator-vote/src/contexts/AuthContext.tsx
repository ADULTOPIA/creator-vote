import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

import { auth, googleProvider, isFirebaseConfigured } from '../firebase';
import { login, LoginResponse } from '../services/loginService';

export type AuthState = {
  /** Firebase user object (null when not signed in) */
  user: User | null;
  /** Whether the initial auth check is still running */
  loading: boolean;
  /** Backend login response — available after POST /login succeeds */
  loginInfo: LoginResponse | null;
  /** Whether Firebase Auth is configured (API key present) */
  firebaseReady: boolean;
  /** Sign in with Google popup */
  signInWithGoogle: () => Promise<void>;
  /** Sign out */
  logout: () => Promise<void>;
  /** Get a fresh ID token (auto-refreshed by Firebase SDK) */
  getIdToken: () => Promise<string>;
  /** Re-run POST /login to refresh backend state (e.g. after voting) */
  refreshLoginInfo: () => Promise<void>;
  /** Error message for login failures */
  loginError: string | null;
  /** Clear login error */
  clearLoginError: () => void;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(isFirebaseConfigured);
  const [loginInfo, setLoginInfo] = useState<LoginResponse | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);

  /** Call POST /login with the current user's token */
  const performBackendLogin = useCallback(async (firebaseUser: User) => {
    try {
      setLoginError(null);
      const idToken = await firebaseUser.getIdToken();
      const response = await login(idToken);
      setLoginInfo(response);
    } catch (error) {
      console.error('Backend login failed:', error);
      setLoginError(error instanceof Error ? error.message : 'ログイン時にサーバーエラーが発生しました。');
      setLoginInfo(null);
    }
  }, []);

  useEffect(() => {
    if (!auth) {
      // Firebase not configured — skip auth listener
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await performBackendLogin(firebaseUser);
      } else {
        setLoginInfo(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, [performBackendLogin]);

  const signInWithGoogle = async () => {
    if (!auth) throw new Error('Firebase Auth is not configured. Set REACT_APP_FIREBASE_API_KEY in .env.');
    const result = await signInWithPopup(auth, googleProvider);
    await performBackendLogin(result.user);
  };

  const logout = async () => {
    if (!auth) return;
    await signOut(auth);
    setLoginInfo(null);
  };

  const getIdToken = async (): Promise<string> => {
    if (!user) throw new Error('Not authenticated');
    return user.getIdToken();
  };

  const refreshLoginInfo = async () => {
    if (!user) return;
    await performBackendLogin(user);
  };

  const clearLoginError = () => setLoginError(null);

  return (
    <AuthContext.Provider
      value={{ user, loading, loginInfo, firebaseReady: isFirebaseConfigured, signInWithGoogle, logout, getIdToken, refreshLoginInfo, loginError, clearLoginError }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthState => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
