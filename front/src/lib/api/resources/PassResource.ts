import { ApiClient, CollectionResponse } from '@/lib/api/ApiClient';
import { ApiClientError } from '@/lib/api/ApiClientError';
import { apiPaths } from '@/lib/api/paths';
import { Pass } from '@/utils/types';

export class PassResource {
  constructor(private apiClient: ApiClient) {}

  public async getCollection(): Promise<CollectionResponse<Pass> | ApiClientError> {
    return this.apiClient.get<CollectionResponse<Pass>>(apiPaths.pass.collection);
  }
}

