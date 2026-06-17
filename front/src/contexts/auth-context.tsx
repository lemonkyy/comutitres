'use client';

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { TOKEN_COOKIE, useApiClient } from "@/contexts/api-client";
import { ApiClientError } from "@/lib/api/ApiClientError";
import { getCookie } from "@/utils/cookie";
import type { LoginInput, Me } from "@/utils/types";

type Props = {
  children: ReactNode;
};

type AuthContextType = {
  user: Me | null;
  loading: boolean;
  login: (credentials: LoginInput) => Promise<Me | ApiClientError>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: Props) => {
  const { apiClient } = useApiClient();
  const [user, setUser] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshMe = useCallback(async (): Promise<Me | null> => {
    const token = apiClient.token ?? getCookie(TOKEN_COOKIE);

    if (!token) {
      setUser(null);

      return null;
    }

    if (!apiClient.token) {
      apiClient.setTokens(token);
    }

    const result = await apiClient.me.get();

    if (result instanceof ApiClientError) {
      setUser(null);

      return null;
    }

    setUser(result);
    return result;
  }, [apiClient]);

  useEffect(() => {
    refreshMe().finally(() => setLoading(false));
  }, [refreshMe]);

  const login = useCallback(
    async (credentials: LoginInput): Promise<Me | ApiClientError> => {
      const result = await apiClient.login(credentials);

      if (result instanceof ApiClientError) {
        return result;
      }

      const me = await refreshMe();

      if (!me) {
        return new ApiClientError(0, "Unable to fetch the authenticated user");
      }

      return me;
    },
    [apiClient, refreshMe],
  );

  const logout = useCallback(() => {
    apiClient.setTokens(null);
    setUser(null);
  }, [apiClient]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
