import { type NextRequest, NextResponse } from "next/server";

import {
  AUTH_TOKEN_COOKIE,
  createBackendUrl,
  createProxyPath,
  getAuthCookieOptions,
} from "@/lib/api/server";

type ProxyContext = {
  params: Promise<{
    path: string[];
  }>;
};

export async function GET(request: NextRequest, context: ProxyContext) {
  return proxyBackendRequest(request, context);
}

export async function POST(request: NextRequest, context: ProxyContext) {
  return proxyBackendRequest(request, context);
}

export async function PUT(request: NextRequest, context: ProxyContext) {
  return proxyBackendRequest(request, context);
}

export async function PATCH(request: NextRequest, context: ProxyContext) {
  return proxyBackendRequest(request, context);
}

export async function DELETE(request: NextRequest, context: ProxyContext) {
  return proxyBackendRequest(request, context);
}

async function proxyBackendRequest(
  request: NextRequest,
  { params }: ProxyContext,
) {
  const { path } = await params;
  const token = request.cookies.get(AUTH_TOKEN_COOKIE)?.value;
  const headers = getForwardedHeaders(request, token);
  const method = request.method.toUpperCase();
  const body = method === "GET" || method === "HEAD" ? undefined : request.body;

  try {
    const init: RequestInit & { duplex?: "half" } = {
      body,
      cache: "no-store",
      headers,
      method,
      redirect: "manual",
    };

    if (body) {
      init.duplex = "half";
    }

    const backendResponse = await fetch(
      createBackendUrl(createProxyPath(request, path)),
      init,
    );
    const response = new NextResponse(backendResponse.body, {
      headers: getResponseHeaders(backendResponse),
      status: backendResponse.status,
      statusText: backendResponse.statusText,
    });

    if (backendResponse.status === 401) {
      response.cookies.set({
        name: AUTH_TOKEN_COOKIE,
        value: "",
        ...getAuthCookieOptions(),
        maxAge: 0,
      });
    }

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Impossible de contacter le serveur.",
      },
      { status: 502 },
    );
  }
}

function getForwardedHeaders(request: NextRequest, token?: string) {
  const headers = new Headers();
  const forwardedHeaderNames = [
    "accept",
    "accept-language",
    "content-language",
    "content-type",
  ];

  for (const headerName of forwardedHeaderNames) {
    const value = request.headers.get(headerName);

    if (value) {
      headers.set(headerName, value);
    }
  }

  if (!headers.has("accept")) {
    headers.set("accept", "application/json");
  }

  if (token) {
    headers.set("authorization", `Bearer ${token}`);
  }

  return headers;
}

function getResponseHeaders(response: Response) {
  const headers = new Headers();
  const forwardedHeaderNames = ["content-type", "link", "location"];

  for (const headerName of forwardedHeaderNames) {
    const value = response.headers.get(headerName);

    if (value) {
      headers.set(headerName, value);
    }
  }

  return headers;
}
