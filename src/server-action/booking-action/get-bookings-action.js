"use server";

import { headers } from "next/headers";

import { auth, ensureDatabaseConnection } from "@/lib/auth";
import { getAuthToken } from "@/lib/auth-token";

// Backend base URL, configured through SERVER_URL in .env
const SERVER_URL = process.env.SERVER_URL;

/**
 * Server action that fetches every booking belonging to the signed-in user.
 *
 * The user id comes from the Better Auth session, so a visitor can only ever
 * read their own bookings.
 *
 * GET {SERVER_URL}/booking/:userId
 */
export const getBookingsAction = async () => {
  let session;

  try {
    await ensureDatabaseConnection();

    session = await auth.api.getSession({
      headers: await headers(),
    });
  } catch (error) {
    return {
      success: false,
      status: 500,
      bookings: [],
      error: error.message || "Failed to verify your session.",
    };
  }

  const user = session?.user;

  if (!user) {
    return {
      success: false,
      status: 401,
      bookings: [],
      error: "Please sign in to view your bookings.",
    };
  }

  const { token, status: authStatus, error: authError } = await getAuthToken();

  if (!token) {
    return {
      success: false,
      status: authStatus,
      bookings: [],
      error: authError,
    };
  }

  try {
    const response = await fetch(
      `${SERVER_URL}/booking/${encodeURIComponent(user.id)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      },
    );

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        success: false,
        status: response.status,
        bookings: [],
        error: data?.error ?? `Failed to fetch bookings (${response.status}).`,
      };
    }

    return {
      success: true,
      status: response.status,
      bookings: Array.isArray(data) ? data : [],
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      status: 500,
      bookings: [],
      error: error.message || "Failed to fetch bookings.",
    };
  }
};
