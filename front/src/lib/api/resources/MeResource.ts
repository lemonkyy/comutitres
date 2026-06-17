import type { ApiClient } from "@/lib/api/ApiClient";
import type { ApiClientError } from "@/lib/api/ApiClientError";
import { apiPaths } from "@/lib/api/paths";
import type { Me } from "@/utils/types";

export class MeResource {
  constructor(private apiClient: ApiClient) {}

  public async get(): Promise<Me | ApiClientError> {
    return this.apiClient.get<Me>(apiPaths.me.get);
  }
}
