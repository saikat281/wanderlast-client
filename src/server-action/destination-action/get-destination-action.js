"use server";

import { getAuthToken } from "@/lib/auth-token";

// Backend base URL, configured through SERVER_URL in .env
const SERVER_URL = process.env.SERVER_URL;

/**
 * Fetches a single destination from the Wanderlast API.
 *
 * GET {SERVER_URL}/destination/:id
 */
export const getDestinationAction = async (id) => {
  if (!id) {
    return {
      success: false,
      destination: null,
      status: 400,
      error: "Invalid destination id.",
    };
  }

  const { token, status: authStatus, error: authError } = await getAuthToken();

  if (!token) {
    return {
      success: false,
      destination: null,
      status: authStatus,
      error: authError,
    };
  }

  try {
    const response = await fetch(
      `${SERVER_URL}/destination/${encodeURIComponent(id)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      },
    );

    const data = await response.json().catch(() => null);
    console.log(data);

    if (!response.ok) {
      return {
        success: false,
        destination: null,
        status: response.status,
        error: data?.error ?? `Failed to fetch destination (${response.status}).`,
      };
    }

    return {
      success: true,
      destination: data,
      status: response.status,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      destination: null,
      status: 500,
      error: error.message || "Failed to fetch destination.",
    };
  }
};
