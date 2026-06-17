import { NextResponse } from "next/server";

import { AUTH_TOKEN_COOKIE, getAuthCookieOptions } from "@/lib/api/server";

export async function POST() {
  const response = NextResponse.json({ success: true });

  response.cookies.set({
    name: AUTH_TOKEN_COOKIE,
    value: "",
    ...getAuthCookieOptions(),
    maxAge: 0,
  });

  return response;
}
