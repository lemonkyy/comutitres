"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

import { useApiClient } from "@/contexts/api-client";
import { ApiClientError } from "@/lib/api/ApiClientError";
import type { Purchase } from "@/utils/types";

type InvoiceContextType = {
  allInvoices: Purchase[] | null;
  invoicesCount: number;
  setAllInvoices: (invoices: Purchase[] | null) => void;
  getAllInvoices: () => Promise<Purchase[] | ApiClientError>;
  getInvoiceById: (invoiceId: string) => Promise<Blob | ApiClientError>;
  getInvoicePdf: (invoiceId: string) => Promise<Blob | ApiClientError>;
  getInvoicePdfUrl: (invoiceId: string) => string;
  getInvoiceCount: () => Promise<{data: number} | ApiClientError>;
  getUserInvoices: (userId: string) => Promise<Purchase[] | ApiClientError>;
};

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export const InvoiceProvider = ({ children }: { children: ReactNode }) => {
  const { apiClient } = useApiClient();
  const [allInvoices, setAllInvoices] = useState<Purchase[] | null>(null);
  const [invoicesCount, setInvoicesCount] = useState(0);

  const getAllInvoices = useCallback(async (): Promise<
    Purchase[] | ApiClientError
  > => {
    const result = await apiClient.invoice.getCollection();

    if (result instanceof ApiClientError) {
      return result;
    }

    setAllInvoices(result);
    setInvoicesCount(result.length);
    return result;
  }, [apiClient]);

  const getInvoiceById = useCallback(
    async (invoiceId: string): Promise<Blob | ApiClientError> => {
      return apiClient.invoice.getById(invoiceId);
    },
    [apiClient],
  );

  const getInvoicePdf = useCallback(
    async (invoiceId: string): Promise<Blob | ApiClientError> => {
      return apiClient.invoice.getById(invoiceId);
    },
    [apiClient],
  );

  const getInvoicePdfUrl = useCallback(
    (invoiceId: string): string => {
      return apiClient.invoice.getInvoiceContentUrl(invoiceId);
    },
    [apiClient],
  );
 
  const getUserInvoices = useCallback(
    async (userId: string): Promise<Purchase[] | ApiClientError> => {
      return apiClient.invoice.getUserInvoices(userId);
    },
    [apiClient],
  );
  
  const getInvoiceCount = useCallback(
    async (): Promise<{data: number} | ApiClientError> => {
      const result = await apiClient.invoice.getTotalInvoiceCount();
      if (result instanceof ApiClientError) {
        return result;
      }
      setInvoicesCount(result.data);
      return result;
    },
    [apiClient],
  );

  return (
    <InvoiceContext.Provider
      value={{
        allInvoices,
        invoicesCount,
        setAllInvoices,
        getAllInvoices,
        getInvoiceById,
        getInvoicePdf,
        getInvoicePdfUrl,
        getInvoiceCount,
        getUserInvoices,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
};

export const useInvoice = () => {
  const context = useContext(InvoiceContext);

  if (!context) {
    throw new Error("useInvoice must be used within an InvoiceProvider");
  }

  return context;
};
