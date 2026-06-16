"use client";

import { type ReactNode, createContext, useContext, useEffect } from "react";

import { ApiClient } from "@/lib/api/ApiClient";
import { deleteCookie, getCookie, setCookie } from "@/utils/cookie";
import { apiBaseUrl } from "@/utils/tools";

type Props = {
  children: ReactNode;
};

type ApiClientContextType = {
  apiClient: ApiClient;
};

export const ApiClientContext = createContext<ApiClientContextType | undefined>(
  undefined,
);

const TOKEN_COOKIE = "token";

const apiClient = new ApiClient(apiBaseUrl);

export const ApiClientProvider = ({ children }: Props) => {
  useEffect(() => {
    apiClient.setOnTokenChange((token) => {
      if (token) {
        setCookie(TOKEN_COOKIE, token);
      } else {
        deleteCookie(TOKEN_COOKIE);
      }
    });

    const savedToken = getCookie(TOKEN_COOKIE);
    if (savedToken) apiClient.setTokens(savedToken);
  }, []);

  return (
    <ApiClientContext.Provider value={{ apiClient }}>
      {children}
    </ApiClientContext.Provider>
  );
};

export const useApiClient = () => {
  const context = useContext(ApiClientContext);
  if (!context) {
    throw new Error("useApiClient must be used within an ApiClientProvider");
  }
  return context;
};
