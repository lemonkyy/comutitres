import type { ApiClientError } from "@/lib/api/ApiClientError";
import { handleApiError } from "@/lib/api/handleApiError";
import { PassResource } from "./resources/PassResource";

export interface LoginResponse {
  token: string;
}

export interface DeleteResponse {
  success: boolean;
}

export interface BasicActionResponse {
  success: boolean;
}

export interface CollectionResponse<T> {
  member: T[];
  totalItems: number;
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
  pass: PassResource;

  constructor(
    public baseUrl: string,
    public token: string | null = null,
  ) {
    this.pass = new PassResource(this);
  }

  public async get<T>(
    url: string,
    additionnalHeaders: HeadersInit = {},
  ): Promise<T | ApiClientError> {
    return fetch(`${this.baseUrl}${url}`, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "Accept-Language": "fr",
        "Content-Language": "fr",
        ...additionnalHeaders,
        ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      },
    })
      .then(handleApiError)
      .then((response) => response.json());
  }

  public async getCollection<T>(
    url: string,
    additionnalHeaders: HeadersInit = {},
  ): Promise<CollectionResponse<T> | ApiClientError> {
    return fetch(`${this.baseUrl}${url}`, {
      cache: "no-store",
      headers: {
        Accept: "application/ld+json",
        "Accept-Language": "fr",
        "Content-Language": "fr",
        ...additionnalHeaders,
        ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      },
    })
      .then(handleApiError)
      .then((response) => response.json());
  }

  public async post<T>(
    url: string,
    body: object = {},
    additionnalHeaders: HeadersInit = {},
    responseType: ResponseType = ResponseType.JSON,
  ): Promise<T | ApiClientError> {
    const isFormData = body instanceof FormData;

    const headers: HeadersInit = isFormData
      ? {
          Accept: "application/json",
          "Accept-Language": "fr",
          "Content-Language": "fr",
          ...additionnalHeaders,
        }
      : {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Accept-Language": "fr",
          "Content-Language": "fr",
          ...additionnalHeaders,
        };

    return fetch(`${this.baseUrl}${url}`, {
      method: "POST",
      headers: {
        ...headers,
        ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      },
      body: isFormData ? body : JSON.stringify(body),
    })
      .then(handleApiError)
      .then((response) =>
        responseType === ResponseType.RAW ? response : response.json(),
      );
  }

  public async patch<T>(
    url: string,
    body: object = {},
    additionnalHeaders: HeadersInit = {},
  ): Promise<T | ApiClientError> {
    const headers: HeadersInit = {
      Accept: "application/json",
      "Content-Type": "application/merge-patch+json",
      "Accept-Language": "fr",
      "Content-Language": "fr",
      ...additionnalHeaders,
    };

    return fetch(`${this.baseUrl}${url}`, {
      method: "PATCH",
      headers: {
        ...headers,
        ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      },
      body: JSON.stringify(body),
    })
      .then(handleApiError)
      .then((response) => response.json());
  }

  public async put<T>(
    url: string,
    body: object = {},
    additionnalHeaders: HeadersInit = {},
  ): Promise<T | ApiClientError> {
    const isFormData = body instanceof FormData;

    const headers: HeadersInit = isFormData
      ? {
          Accept: "application/json",
          "Accept-Language": "fr",
          "Content-Language": "fr",
          ...additionnalHeaders,
        }
      : {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Accept-Language": "fr",
          "Content-Language": "fr",
          ...additionnalHeaders,
        };

    return fetch(`${this.baseUrl}${url}`, {
      method: "PUT",
      headers: {
        ...headers,
        ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      },
      body: isFormData ? body : JSON.stringify(body),
    })
      .then(handleApiError)
      .then((response) => response.json());
  }

  public async delete(url: string): Promise<DeleteResponse | ApiClientError> {
    return fetch(`${this.baseUrl}${url}`, {
      method: "DELETE",
      headers: {
        "Accept-Language": "fr",
        "Content-Language": "fr",
        ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      },
    })
      .then(handleApiError)
      .then((response) => ({ success: response.status === 204 }));
  }

  public async login(): Promise<LoginResponse | ApiClientError> {
    return {
      token: "temp-token",
    };
  }

  private onTokenChange?: (token: string | null) => void;

  public setOnTokenChange(cb: (token: string | null) => void) {
    this.onTokenChange = cb;
  }

  public setTokens(token?: string | null) {
    this.token = token ?? null;
    this.onTokenChange?.(this.token);
  }
}
