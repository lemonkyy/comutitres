import type { ApiClient } from "@/lib/api/ApiClient";
import type { ApiClientError } from "@/lib/api/ApiClientError";
import { apiPaths } from "@/lib/api/paths";
import type { DocumentProof, DocumentProofStatusEnum, DocumentProofUpload } from "@/utils/types";

export class DocumentResource {
  constructor(private apiClient: ApiClient) {}

  public async getCollection(): Promise<DocumentProof[] | ApiClientError> {
    return this.apiClient.get<DocumentProof[]>(apiPaths.document.collection);
  }
  
  public async getMyDocuments(): Promise<DocumentProof[] | ApiClientError> {
    return this.apiClient.get<DocumentProof[]>(apiPaths.document.myDocuments);
  }

  public async uploadDocument(document: DocumentProofUpload): Promise<void | ApiClientError> {
    return this.apiClient.post<void>(apiPaths.document.upload, document);
  }

  public async updateDocumentStatus(documentId: string, status: DocumentProofStatusEnum): Promise<void | ApiClientError> {
    return this.apiClient.post<void>(
      apiPaths.document.updateStatus.replace(":id", encodeURIComponent(documentId)),
      { status },
    );
  }
}
