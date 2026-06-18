import type { ApiClient } from "@/lib/api/ApiClient";
import type { ApiClientError } from "@/lib/api/ApiClientError";
import { apiPaths } from "@/lib/api/paths";
import type { User } from "@/utils/types";

export class UserResource {
  constructor(private apiClient: ApiClient) {}

  public async getCollection(): Promise<User[] | ApiClientError> {
    return this.apiClient.get<User[]>(apiPaths.user.collection);
  }
}
