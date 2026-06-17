"use client";

import { type ReactNode, createContext, useContext, useMemo } from "react";

import { ApiClient } from "@/lib/api/ApiClient";
import { apiBaseUrl } from "@/utils/tools";

type Props = {
  children: ReactNode;
  locale: string;
};

type ApiClientContextType = {
  apiClient: ApiClient;
};

export const ApiClientContext = createContext<ApiClientContextType | undefined>(
  undefined,
);

export const ApiClientProvider = ({ children, locale }: Props) => {
  const apiClient = useMemo(() => new ApiClient(apiBaseUrl, locale), [locale]);

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
