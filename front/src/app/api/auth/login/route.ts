import { type NextRequest, NextResponse } from "next/server";

import {
  AUTH_TOKEN_COOKIE,
  fetchBackendJson,
  getAuthCookieOptions,
} from "@/lib/api/server";
import type { LoginInput, Me } from "@/utils/types";

type LoginResponse = {
  user: Me;
};

export async function POST(request: NextRequest) {
  const credentials = await readCredentials(request);

  if (!credentials) {
    return NextResponse.json(
      { message: "Identifiants invalides." },
      { status: 400 },
    );
  }

  const loginResult = await fetchBackendJson<string>("/login", {
    body: JSON.stringify(credentials),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!loginResult.ok) {
    return NextResponse.json(
      { message: loginResult.message || "Identifiants incorrects." },
      { status: loginResult.status || 401 },
    );
  }

  if (!loginResult.data) {
    return NextResponse.json(
      { message: "Identifiants incorrects." },
      { status: 401 },
    );
  }

  const meResult = await fetchBackendJson<Me>("/me", {}, loginResult.data);

  if (!meResult.ok) {
    return NextResponse.json(
      { message: "Impossible de charger le compte connecté." },
      { status: meResult.status || 502 },
    );
  }

  const response = NextResponse.json<LoginResponse>({ user: meResult.data });
  response.cookies.set({
    name: AUTH_TOKEN_COOKIE,
    value: loginResult.data,
    ...getAuthCookieOptions(),
  });

  return response;
}

async function readCredentials(
  request: NextRequest,
): Promise<LoginInput | null> {
  const body = await request.json().catch(() => null);

  if (
    !body ||
    typeof body !== "object" ||
    !("email" in body) ||
    !("password" in body) ||
    typeof body.email !== "string" ||
    typeof body.password !== "string"
  ) {
    return null;
  }

  return {
    email: body.email,
    password: body.password,
  };
}
