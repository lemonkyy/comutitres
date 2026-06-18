import { type NextRequest, NextResponse } from "next/server";

import {
  AUTH_TOKEN_COOKIE,
  fetchBackendJson,
  getAuthCookieOptions,
} from "@/lib/api/server";
import type { Me } from "@/utils/types";

type MeResponse = {
  user: Me | null;
};

export async function GET(request: NextRequest) {
  const token = request.cookies.get(AUTH_TOKEN_COOKIE)?.value;

  if (!token) {
    return NextResponse.json<MeResponse>({ user: null });
  }

  const meResult = await fetchBackendJson<Me>("/me", {}, token);

  if (!meResult.ok) {
    const response = NextResponse.json<MeResponse>({ user: null });

    if (meResult.status === 401) {
      response.cookies.set({
        name: AUTH_TOKEN_COOKIE,
        value: "",
        ...getAuthCookieOptions(),
        maxAge: 0,
      });
    }

    return response;
  }

  return NextResponse.json<MeResponse>({ user: meResult.data });
}
