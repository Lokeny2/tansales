"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ ok: boolean; message: string }>;
  signUp: (
    name: string,
    email: string,
    password: string,
  ) => Promise<{ ok: boolean; message: string }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [hasLoadedToken, setHasLoadedToken] = useState(false);

  const signInMutation = useMutation(api.auth.signIn);
  const signUpMutation = useMutation(api.auth.signUp);
  const signOutMutation = useMutation(api.auth.signOut);

  // On first load, pick up whatever token (if any) was saved from a
  // previous visit. This is just "do we have a badge number at all?" —
  // it does NOT mean that badge is still valid; that gets checked next.
  useEffect(() => {
    const storedToken =
      typeof window !== "undefined"
        ? localStorage.getItem("tansales-token")
        : null;
    setToken(storedToken);
    setHasLoadedToken(true);
  }, []);

  // The real check: ask Convex directly who (if anyone) this token
  // actually belongs to. This is the part that can't be faked by
  // editing localStorage — the server is the one deciding the answer.
  const verifiedUser = useQuery(
    api.auth.getCurrentUser,
    token ? { token } : "skip",
  );

  const isLoading =
    !hasLoadedToken || (token !== null && verifiedUser === undefined);
  const user = verifiedUser ?? null;

  // If the server says a saved token is no longer valid (expired, or
  // just doesn't exist), clean it up automatically instead of leaving
  // the app stuck thinking someone's logged in when they aren't.
  useEffect(() => {
    if (hasLoadedToken && token && verifiedUser === null) {
      localStorage.removeItem("tansales-token");
      setToken(null);
    }
  }, [hasLoadedToken, token, verifiedUser]);

  const signIn = async (email: string, password: string) => {
    try {
      const result = await signInMutation({ email, password });
      if (result.ok && result.token) {
        localStorage.setItem("tansales-token", result.token);
        setToken(result.token);
      }
      return { ok: result.ok, message: result.message };
    } catch (error) {
      return {
        ok: false,
        message: error instanceof Error ? error.message : "Unable to sign in.",
      };
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    try {
      const result = await signUpMutation({ name, email, password });
      if (result.ok && result.token) {
        localStorage.setItem("tansales-token", result.token);
        setToken(result.token);
      }
      return { ok: result.ok, message: result.message };
    } catch (error) {
      return {
        ok: false,
        message:
          error instanceof Error ? error.message : "Unable to create account.",
      };
    }
  };

  const signOut = async () => {
    if (token) {
      await signOutMutation({ token });
    }
    localStorage.removeItem("tansales-token");
    setToken(null);
  };

  const value = useMemo<AuthContextValue>(
    () => ({ user, token, isLoading, signIn, signUp, signOut }),
    [user, token, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
