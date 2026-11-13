"use server";

import { headers } from "next/headers";

import { auth } from "@/lib/auth";

// Backend base URL, configured through SERVER_URL in .env
const SERVER_URL = process.env.SERVER_URL;

/**
 * Server action that deletes a booking through the Wanderlast API.
 *
 * DELETE {SERVER_URL}/booking/:id
 */
export const deleteBookingAction = async (id) => {
  if (!id) {
    return {
      success: false,
      status: 400,
      error: "Invalid booking id.",
    };
  }

  let session;

  try {
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

  if (!session?.user) {
    return {
      success: false,
      status: 401,
      error: "Please sign in to delete this booking.",
    };
  }

  try {
    const response = await fetch(
      `${SERVER_URL}/booking/${encodeURIComponent(id)}`,
      {
        method: "DELETE",
        cache: "no-store",
      },
    );

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        success: false,
        status: response.status,
        error: data?.error ?? `Failed to delete booking (${response.status}).`,
      };
    }

    return {
      success: true,
      status: response.status,
      message: data?.message ?? "Booking deleted successfully.",
    };
  } catch (error) {
    return {
      success: false,
      status: 500,
      error: error.message || "Failed to delete booking.",
    };
  }
};
