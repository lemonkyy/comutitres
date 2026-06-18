import { ApiClientError } from "@/lib/api/ApiClientError";
import { handleApiError } from "@/lib/api/handleApiError";
import type { LoginInput, Me } from "@/utils/types";
import { MeResource } from "./resources/MeResource";
import { PassResource } from "./resources/PassResource";
import { WorkflowResource } from "./resources/WorkflowResource";
import { UserResource } from "./resources/UserResource";

export interface DeleteResponse {
  success: boolean;
}

export interface BasicActionResponse {
  success: boolean;
}

export interface CollectionResponse<T> {
  "hydra:member"?: T[];
  "hydra:totalItems"?: number;
  member?: T[];
  totalItems?: number;
  view?: {
    "@id": string;
    "@type": string;
    first: string;
    last: string;
    next?: string;
    previous?: string;
  };
}

export enum ResponseType {
  RAW = "raw",
  JSON = "json",
}

export class ApiClient {
  me: MeResource;
  pass: PassResource;
  user: UserResource;
  workflow: WorkflowResource;

  constructor(
    public baseUrl: string,
    private readonly locale = "fr",
  ) {
    this.me = new MeResource(this);
    this.pass = new PassResource(this);
    this.user = new UserResource(this);
    this.workflow = new WorkflowResource(this);
  }

  public async get<T>(
    url: string,
    additionnalHeaders: HeadersInit = {},
  ): Promise<T | ApiClientError> {
    return fetch(`${this.baseUrl}${url}`, {
      cache: "no-store",
      headers: this.createHeaders(
        {
          Accept: "application/json",
        },
        additionnalHeaders,
      ),
    })
      .then(handleApiError)
      .then((response) => response.json())
      .catch(toApiClientError);
  }

  public async getCollection<T>(
    url: string,
    additionnalHeaders: HeadersInit = {},
  ): Promise<CollectionResponse<T> | ApiClientError> {
    return fetch(`${this.baseUrl}${url}`, {
      cache: "no-store",
      headers: this.createHeaders(
        {
          Accept: "application/ld+json",
        },
        additionnalHeaders,
      ),
    })
      .then(handleApiError)
      .then((response) => response.json())
      .catch(toApiClientError);
  }

  public async post<T>(
    url: string,
    body: object = {},
    additionnalHeaders: HeadersInit = {},
    responseType: ResponseType = ResponseType.JSON,
  ): Promise<T | ApiClientError> {
    const isFormData = body instanceof FormData;

    const headers: HeadersInit = isFormData
      ? this.createHeaders(
          {
            Accept: "application/json",
          },
          additionnalHeaders,
        )
      : this.createHeaders(
          {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          additionnalHeaders,
        );

    return fetch(`${this.baseUrl}${url}`, {
      method: "POST",
      headers,
      body: isFormData ? body : JSON.stringify(body),
    })
      .then(handleApiError)
      .then((response) =>
        responseType === ResponseType.RAW ? response : response.json(),
      )
      .catch(toApiClientError);
  }

  public async patch<T>(
    url: string,
    body: object = {},
    additionnalHeaders: HeadersInit = {},
  ): Promise<T | ApiClientError> {
    const headers: HeadersInit = this.createHeaders(
      {
        Accept: "application/json",
        "Content-Type": "application/merge-patch+json",
      },
      additionnalHeaders,
    );

    return fetch(`${this.baseUrl}${url}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(body),
    })
      .then(handleApiError)
      .then((response) => response.json())
      .catch(toApiClientError);
  }

  public async put<T>(
    url: string,
    body: object = {},
    additionnalHeaders: HeadersInit = {},
  ): Promise<T | ApiClientError> {
    const isFormData = body instanceof FormData;

    const headers: HeadersInit = isFormData
      ? this.createHeaders(
          {
            Accept: "application/json",
          },
          additionnalHeaders,
        )
      : this.createHeaders(
          {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          additionnalHeaders,
        );

    return fetch(`${this.baseUrl}${url}`, {
      method: "PUT",
      headers,
      body: isFormData ? body : JSON.stringify(body),
    })
      .then(handleApiError)
      .then((response) => response.json())
      .catch(toApiClientError);
  }

  public async delete(url: string): Promise<DeleteResponse | ApiClientError> {
    return fetch(`${this.baseUrl}${url}`, {
      method: "DELETE",
      headers: this.createHeaders(),
    })
      .then(handleApiError)
      .then((response) => ({ success: response.status === 204 }))
      .catch(toApiClientError);
  }

  public async login(credentials: LoginInput): Promise<Me | ApiClientError> {
    return fetch("/api/auth/login", {
      body: JSON.stringify(credentials),
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    })
      .then(handleApiError)
      .then((response) => response.json())
      .then((response: { user: Me }) => response.user)
      .catch(toApiClientError);
  }

  private createHeaders(
    defaultHeaders: HeadersInit = {},
    additionnalHeaders: HeadersInit = {},
  ) {
    const headers = new Headers(defaultHeaders);
    headers.set("Accept-Language", this.locale);
    headers.set("Content-Language", this.locale);

    new Headers(additionnalHeaders).forEach((value, key) => {
      headers.set(key, value);
    });

    return headers;
  }
}

function toApiClientError(error: unknown) {
  if (error instanceof ApiClientError) {
    return error;
  }

  return new ApiClientError(
    0,
    error instanceof Error ? error.message : "Une erreur est survenue.",
  );
}
