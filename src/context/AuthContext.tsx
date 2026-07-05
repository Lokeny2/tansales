"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useMutation } from "convex/react";
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
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const signInMutation = useMutation(api.auth.signIn);
  const signUpMutation = useMutation(api.auth.signUp);
  const signOutMutation = useMutation(api.auth.signOut);

  useEffect(() => {
    const storedSession =
      typeof window !== "undefined"
        ? localStorage.getItem("tansales-session")
        : null;
    if (!storedSession) {
      setIsLoading(false);
      return;
    }

    try {
      const parsed = JSON.parse(storedSession) as {
        user?: AuthUser;
        token?: string | null;
      };
      if (parsed.user) {
        setUser(parsed.user);
      }
      setToken(parsed.token ?? null);
    } catch {
      localStorage.removeItem("tansales-session");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const result = await signInMutation({ email, password });
      if (result.ok && result.user) {
        localStorage.setItem(
          "tansales-session",
          JSON.stringify({ user: result.user }),
        );
        setUser(result.user);
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
      if (result.ok && result.user) {
        localStorage.setItem(
          "tansales-session",
          JSON.stringify({ user: result.user }),
        );
        setUser(result.user);
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
    await signOutMutation({ token: token ?? "" });
    localStorage.removeItem("tansales-session");
    setUser(null);
    setToken(null);
  };

  const value = useMemo<AuthContextValue>(
    () => ({ user, token, isLoading, signIn, signUp, signOut }),
    [user, token, isLoading, signIn, signUp, signOut],
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
