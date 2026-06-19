import type { ApiClient } from "@/lib/api/ApiClient";
import type { ApiClientError } from "@/lib/api/ApiClientError";
import { apiPaths } from "@/lib/api/paths";
import type { Purchase } from "@/utils/types";

export class InvoiceResource {
  constructor(private apiClient: ApiClient) {}

  public async getCollection(): Promise<Purchase[] | ApiClientError> {
    return this.apiClient.get<Purchase[]>(apiPaths.invoice.collection);
  }

  public async getUserInvoices(
    userId: string,
  ): Promise<Purchase[] | ApiClientError> {
    return this.apiClient.get<Purchase[]>(
      apiPaths.invoice.userCollection.replace(
        ":id",
        encodeURIComponent(userId),
      ),
    );
  }

  public async getById(invoiceId: string): Promise<Blob | ApiClientError> {
    return this.apiClient.getBlob(
      apiPaths.invoice.item.replace(":id", encodeURIComponent(invoiceId)),
    );
  }

  public getInvoiceContentUrl(invoiceId: string): string {
    return `${this.apiClient.baseUrl}${apiPaths.invoice.item.replace(":id", encodeURIComponent(invoiceId))}`;
  }

  public async getTotalInvoiceCount(): Promise<
    { data: number } | ApiClientError
  > {
    return this.apiClient.get<{ data: number }>(apiPaths.invoice.totalInvoices);
  }
}
