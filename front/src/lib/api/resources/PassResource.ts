import {
  type ApiClient,
  type CollectionResponse,
  ResponseType,
} from "@/lib/api/ApiClient";
import { ApiClientError } from "@/lib/api/ApiClientError";
import { apiPaths } from "@/lib/api/paths";
import type { Pass } from "@/utils/types";

export class PassResource {
  constructor(private apiClient: ApiClient) {}

  public async getCollection(): Promise<
    CollectionResponse<Pass> | ApiClientError
  > {
    return this.apiClient.getCollection<Pass>(apiPaths.pass.collection);
  }

  public async buy(
    passId: string,
    priceId: string,
  ): Promise<string | ApiClientError> {
    const response = await this.apiClient.post<Response>(
      apiPaths.pass.buy.replace(":id", encodeURIComponent(passId)),
      { priceId },
      {},
      ResponseType.RAW,
    );

    if (response instanceof ApiClientError) {
      return response;
    }

    return readCheckoutUrl(response);
  }
}

async function readCheckoutUrl(response: Response) {
  const contentType = response.headers.get("content-type");

  if (contentType?.includes("json") || contentType?.includes("+json")) {
    const body = await response
      .clone()
      .json()
      .catch(() => null);

    if (typeof body === "string" && body.trim()) {
      return body.trim();
    }

    if (
      body &&
      typeof body === "object" &&
      "url" in body &&
      typeof body.url === "string" &&
      body.url.trim()
    ) {
      return body.url.trim();
    }
  }

  const url = await response.text().catch(() => "");

  if (url.trim()) {
    return url.trim();
  }

  return new ApiClientError(502, "");
}
