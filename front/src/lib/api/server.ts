import type { NextRequest } from "next/server";

export const AUTH_TOKEN_COOKIE = "token";
export const AUTH_TOKEN_MAX_AGE = 60 * 60;

type BackendSuccess<T> = {
  data: T;
  ok: true;
  status: number;
};

type BackendFailure = {
  message: string;
  ok: false;
  status: number;
};

export type BackendResult<T> = BackendSuccess<T> | BackendFailure;

export function getAuthCookieOptions() {
  return {
    httpOnly: true,
    maxAge: AUTH_TOKEN_MAX_AGE,
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  };
}

export function createBackendUrl(path: string, search = "") {
  const baseUrl = getApiBaseUrl();

  const normalizedBaseUrl = baseUrl.replace(/\/+$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${normalizedBaseUrl}${normalizedPath}${search}`;
}

function getApiBaseUrl() {
  if (process.env.API_BASE_URL) {
    return process.env.API_BASE_URL;
  }

  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    if (
      process.env.NODE_ENV !== "production" &&
      process.env.NEXT_PUBLIC_API_BASE_URL.includes("localhost:8000")
    ) {
      return process.env.NEXT_PUBLIC_API_BASE_URL.replace(
        "localhost:8000",
        "php",
      );
    }

    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }

  throw new Error("Missing API_BASE_URL or NEXT_PUBLIC_API_BASE_URL");
}

export async function fetchBackendJson<T>(
  path: string,
  init: RequestInit = {},
  token?: string,
): Promise<BackendResult<T>> {
  const headers = new Headers(init.headers);

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  try {
    const response = await fetch(createBackendUrl(path), {
      ...init,
      cache: "no-store",
      headers,
    });

    if (!response.ok) {
      return {
        message: await readBackendErrorMessage(response),
        ok: false,
        status: response.status,
      };
    }

    return {
      data: (await readBackendJson(response)) as T,
      ok: true,
      status: response.status,
    };
  } catch (error) {
    return {
      message:
        error instanceof Error
          ? error.message
          : "Impossible de contacter le serveur.",
      ok: false,
      status: 502,
    };
  }
}

export function createProxyPath(request: NextRequest, path: string[]) {
  const pathname = path.map(encodeURIComponent).join("/");
  return `/${pathname}${request.nextUrl.search}`;
}

export async function readBackendErrorMessage(response: Response) {
  const fallback = response.statusText || "Une erreur est survenue.";
  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    const body = await response.json().catch(() => null);

    if (body && typeof body === "object") {
      if ("message" in body && typeof body.message === "string") {
        return body.message;
      }

      if ("detail" in body && typeof body.detail === "string") {
        return body.detail;
      }

      if ("error" in body && typeof body.error === "string") {
        return body.error;
      }
    }
  }

  const text = await response.text().catch(() => "");
  return text || fallback;
}

async function readBackendJson(response: Response) {
  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    return response.json();
  }

  return response.text();
}
