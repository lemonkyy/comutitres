import { type ApiClient, ResponseType } from "@/lib/api/ApiClient";
import type { ApiClientError } from "@/lib/api/ApiClientError";
import { apiPaths } from "@/lib/api/paths";
import type {
  DocumentProof,
  DocumentProofStatusEnum,
  DocumentProofUpload,
} from "@/utils/types";

export class DocumentResource {
  constructor(private apiClient: ApiClient) {}

  public async getCollection(): Promise<DocumentProof[] | ApiClientError> {
    return this.apiClient.get<DocumentProof[]>(apiPaths.document.collection);
  }

  public async getMyDocuments(): Promise<DocumentProof[] | ApiClientError> {
    return this.apiClient.get<DocumentProof[]>(apiPaths.document.mine);
  }

  public async uploadDocument(
    document: DocumentProofUpload,
  ): Promise<Response | ApiClientError> {
    return this.apiClient.post<Response>(
      apiPaths.document.upload,
      document,
      {},
      ResponseType.RAW,
    );
  }

  public async updateDocumentStatus(
    documentId: string,
    status: DocumentProofStatusEnum,
  ): Promise<undefined | ApiClientError> {
    return this.apiClient.post<undefined>(
      apiPaths.document.updateStatus.replace(
        ":id",
        encodeURIComponent(documentId),
      ),
      { status },
    );
  }

  public getDocumentContentUrl(documentId: string): string {
    return `${this.apiClient.baseUrl}${apiPaths.document.item.replace(":id", encodeURIComponent(documentId))}`;
  }
}
