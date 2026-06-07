import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";
import { serverEnv } from "./env";
import { NON_ORG_PREFIXES, PUBLIC_PATHS } from "./lib/constants";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublic = PUBLIC_PATHS.includes(pathname);
  const isNonOrgPath = NON_ORG_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix),
  );

  //TODO: remove in production for testing purposes of rate limiting
  const headers = new Headers(request.headers);
  if (serverEnv.NODE_ENV === "development") {
    headers.set("x-forwarded-for", "127.0.0.1");
  }

  if (isPublic || isNonOrgPath) {
    return NextResponse.next({ request: { headers } });
  }

  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    const loginUrl = new URL("/login", request.url);

    if (pathname.includes("/accept-invitation/")) {
      loginUrl.searchParams.set("callback", pathname);
    }

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth).*)"],
};
