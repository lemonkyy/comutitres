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
import type { DocumentProof } from "@/utils/types";

type DocumentContextType = {
  allUsersDocuments: DocumentProof[] | null;
  setAllUsersDocuments: (documents: DocumentProof[] | null) => void;
  getAllUsersDocuments: () => Promise<DocumentProof[] | ApiClientError>;
};

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export const DocumentProvider = ({ children }: { children: ReactNode }) => {
  const { apiClient } = useApiClient();
  const [allUsersDocuments, setAllUsersDocuments] = useState<
    DocumentProof[] | null
  >(null);

  const getAllUsersDocuments = useCallback(async (): Promise<DocumentProof[] | ApiClientError> => {
    const result = await apiClient.document.getCollection();

    if (result instanceof ApiClientError) {
      return result;
    }

    setAllUsersDocuments(result);
    return result;
  }, [apiClient]);

  return (
    <DocumentContext.Provider
      value={{ allUsersDocuments, setAllUsersDocuments, getAllUsersDocuments }}
    >
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocument = () => {
  const context = useContext(DocumentContext);

  if (!context) {
    throw new Error("useDocument must be used within a DocumentProvider");
  }

  return context;
};
