import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";

/**
 * Protects private routes before they are rendered.
 *
 * Destination details (`/destinations/:id`) and the add-destination form
 * (`/add-destination`) require a signed-in user. The session is validated
 * against Better Auth so an expired or forged cookie is rejected, not just the
 * presence of a cookie.
 */
export async function proxy(request) {
  let session = null;

  try {
    session = await auth.api.getSession({ headers: request.headers });
  } catch {
    session = null;
  }

  if (!session?.user) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("next", request.nextUrl.pathname);

    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/destinations/:id", "/add-destination"],
};
