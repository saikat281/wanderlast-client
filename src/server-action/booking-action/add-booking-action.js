"use server";

import { headers } from "next/headers";

import { auth, ensureDatabaseConnection } from "@/lib/auth";
import { getAuthToken } from "@/lib/auth-token";

// Backend base URL, configured through SERVER_URL in .env
const SERVER_URL = process.env.SERVER_URL;

/**
 * Server action that creates a booking through the Wanderlast API.
 *
 * The current user is resolved from the Better Auth session on the server, so
 * the client can never spoof the user id, name or email.
 *
 * All booking information is sent as a single flat payload: the destination
 * details with its id, plus the signed-in user's id, name and email.
 *
 * POST {SERVER_URL}/booking
 */
export const addBookingAction = async (booking) => {
  const { destinationId, destination } = booking ?? {};

  if (!destinationId) {
    return {
      success: false,
      status: 400,
      error: "Invalid destination id.",
    };
  }

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
      error: error.message || "Failed to verify your session.",
    };
  }

  const user = session?.user;

  if (!user) {
    return {
      success: false,
      status: 401,
      error: "Please sign in to book this trip.",
    };
  }

  const { token, status: authStatus, error: authError } = await getAuthToken();

  if (!token) {
    return {
      success: false,
      status: authStatus,
      error: authError,
    };
  }

  const {
    name,
    country,
    price,
    departureTime,
    imageUrl,
    description,
    category,
  } = destination ?? {};

  try {
    const response = await fetch(`${SERVER_URL}/booking`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        destinationId: String(destinationId),
        name: name ?? "",
        country: country ?? "",
        price: price === "" || price == null ? null : Number(price),
        departureTime: departureTime ?? null,
        imageUrl: imageUrl ?? "",
        description: description ?? "",
        category: category ?? "",
        userId: user.id,
        userName: user.name ?? "",
        userEmail: user.email ?? "",
      }),
      cache: "no-store",
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        success: false,
        status: response.status,
        error: data?.error ?? `Failed to create booking (${response.status}).`,
      };
    }

    return {
      success: true,
      status: response.status,
      message: data?.message ?? "Booking created successfully.",
      booking: data?.booking ?? data ?? null,
    };
  } catch (error) {
    return {
      success: false,
      status: 500,
      error: error.message || "Failed to create booking.",
    };
  }
};
