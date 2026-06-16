import type { ApiClient, CollectionResponse } from "@/lib/api/ApiClient";
import type { ApiClientError } from "@/lib/api/ApiClientError";
import { apiPaths } from "@/lib/api/paths";
import type { Pass } from "@/utils/types";

export class PassResource {
  constructor(private apiClient: ApiClient) {}

  public async getCollection(): Promise<
    CollectionResponse<Pass> | ApiClientError
  > {
    return this.apiClient.get<CollectionResponse<Pass>>(
      apiPaths.pass.collection,
    );
  }
}
