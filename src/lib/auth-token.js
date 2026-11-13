import { headers } from "next/headers";

import { auth } from "@/lib/auth";

/**
 * Resolves the Better Auth JWT for the current request.
 *
 * Server actions use this to forward the caller's token to the Wanderlast API
 * as a `Bearer` token. Returns a result object instead of throwing so each
 * action can respond with a consistent error shape.
 *
 * @returns {Promise<{ token: string | null, status: number, error: string | null }>}
 */
export async function getAuthToken() {
  let requestHeaders;

  try {
    requestHeaders = await headers();
  } catch (error) {
    return {
      token: null,
      status: 500,
      error: error?.message || "Failed to read request headers.",
    };
  }

  try {
    const { token } = await auth.api.getToken({ headers: requestHeaders });

    if (!token) {
      return {
        token: null,
        status: 401,
        error: "Please sign in to continue.",
      };
    }

    return { token, status: 200, error: null };
  } catch (error) {
    const statusCode = error?.statusCode ?? error?.status;
    const unauthorized = statusCode === 401 || statusCode === 403;

    return {
      token: null,
      status: unauthorized ? statusCode : 500,
      error: unauthorized
        ? "Please sign in to continue."
        : error?.message || "Failed to verify your session.",
    };
  }
}