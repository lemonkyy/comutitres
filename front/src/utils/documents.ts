import {
  type DocumentKind,
  type DocumentProof,
  type MyDocuments,
  documentKinds,
} from "@/utils/types";

type MyDocumentsCollection = {
  "hydra:member"?: Array<DocumentProof | null>;
  member?: Array<DocumentProof | null>;
};

const documentKindSet = new Set<string>(documentKinds);

export function normalizeMyDocuments(response: unknown) {
  const documents: MyDocuments = {};

  for (const document of getDocumentMembers(response)) {
    if (document?.type && documentKindSet.has(document.type)) {
      documents[document.type as DocumentKind] = document;
    }
  }

  if (isRecord(response) && !isCollection(response)) {
    for (const kind of documentKinds) {
      const document = response[kind];

      if (isDocumentProof(document)) {
        documents[kind] = document;
      }
    }
  }

  return documents;
}

function getDocumentMembers(response: unknown) {
  if (!response) {
    return [];
  }

  if (Array.isArray(response)) {
    return response.filter(isDocumentProof);
  }

  if (isRecord(response) && isCollection(response)) {
    return (response.member ?? response["hydra:member"] ?? []).filter(
      isDocumentProof,
    );
  }

  return [];
}

function isCollection(response: object): response is MyDocumentsCollection {
  return "member" in response || "hydra:member" in response;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object");
}

function isDocumentProof(value: unknown): value is DocumentProof {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}
