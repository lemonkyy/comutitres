"use client";

import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

import { useApiClient } from "@/contexts/api-client";
import { ApiClientError } from "@/lib/api/ApiClientError";
import type { DocumentProof, DocumentProofStatusEnum } from "@/utils/types";

type DocumentContextType = {
  allUsersDocuments: DocumentProof[] | null;
  setAllUsersDocuments: (documents: DocumentProof[] | null) => void;
  getAllUsersDocuments: () => Promise<DocumentProof[] | ApiClientError>;
  getDocumentContentUrl: (documentId: string) => string;
  updateDocumentStatus: (
    documentId: string,
    status: DocumentProofStatusEnum,
  ) => Promise<undefined | ApiClientError>;
};

const DocumentContext = createContext<DocumentContextType | undefined>(
  undefined,
);

export const DocumentProvider = ({ children }: { children: ReactNode }) => {
  const { apiClient } = useApiClient();
  const [allUsersDocuments, setAllUsersDocuments] = useState<
    DocumentProof[] | null
  >(null);

  const getAllUsersDocuments = useCallback(async (): Promise<
    DocumentProof[] | ApiClientError
  > => {
    const result = await apiClient.document.getCollection();

    if (result instanceof ApiClientError) {
      return result;
    }

    setAllUsersDocuments(result);
    return result;
  }, [apiClient]);

  const updateDocumentStatus = useCallback(
    async (
      documentId: string,
      status: DocumentProofStatusEnum,
    ): Promise<undefined | ApiClientError> => {
      const result = await apiClient.document.updateDocumentStatus(
        documentId,
        status,
      );

      if (result instanceof ApiClientError) {
        return result;
      }

      setAllUsersDocuments((current) => {
        if (!current) {
          return current;
        }

        return current.map((document) =>
          String(document.id) === String(documentId)
            ? { ...document, status }
            : document,
        );
      });

      return undefined;
    },
    [apiClient],
  );

  const getDocumentContentUrl = useCallback(
    (documentId: string): string => {
      return apiClient.document.getDocumentContentUrl(documentId);
    },
    [apiClient],
  );

  return (
    <DocumentContext.Provider
      value={{
        allUsersDocuments,
        setAllUsersDocuments,
        getAllUsersDocuments,
        getDocumentContentUrl,
        updateDocumentStatus,
      }}
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
