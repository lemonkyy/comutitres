"use client";

import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { ApiClientError } from "@/lib/api/ApiClientError";
import type { LoginInput, Me } from "@/utils/types";

type Props = {
  children: ReactNode;
};

type AuthContextType = {
  user: Me | null;
  loading: boolean;
  login: (credentials: LoginInput) => Promise<Me | ApiClientError>;
  logout: () => Promise<void>;
  refreshMe: () => Promise<Me | null>;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshMe = useCallback(async (): Promise<Me | null> => {
    const response = await fetch("/api/auth/me", {
      cache: "no-store",
      credentials: "same-origin",
    }).catch(() => null);

    if (!response?.ok) {
      setUser(null);
      return null;
    }

    const result = (await response.json()) as { user: Me | null };
    setUser(result.user);
    return result.user;
  }, []);

  useEffect(() => {
    refreshMe().finally(() => setLoading(false));
  }, [refreshMe]);

  const login = useCallback(
    async (credentials: LoginInput): Promise<Me | ApiClientError> => {
      const response = await fetch("/api/auth/login", {
        body: JSON.stringify(credentials),
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      }).catch(() => null);

      if (!response) {
        return new ApiClientError(0, "Impossible de contacter le serveur.");
      }

      if (!response.ok) {
        return new ApiClientError(
          response.status,
          await readAuthErrorMessage(response),
        );
      }

      const result = (await response.json()) as { user: Me };
      setUser(result.user);
      return result.user;
    },
    [],
  );

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", {
      credentials: "same-origin",
      method: "POST",
    }).catch(() => null);

    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        refreshMe,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

async function readAuthErrorMessage(response: Response) {
  const fallback = response.statusText || "Une erreur est survenue.";
  const body = await response.json().catch(() => null);

  if (body && typeof body === "object") {
    if ("message" in body && typeof body.message === "string") {
      return body.message;
    }

    if ("detail" in body && typeof body.detail === "string") {
      return body.detail;
    }
  }

  return fallback;
}
