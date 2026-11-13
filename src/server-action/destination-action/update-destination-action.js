"use server";

import { getAuthToken } from "@/lib/auth-token";

// Backend base URL, configured through SERVER_URL in .env
const SERVER_URL = process.env.SERVER_URL;

/**
 * Server action that updates a destination through the Wanderlast API.
 *
 * PATCH {SERVER_URL}/destination/:id
 */
export const updateDestinationAction = async (id, destination) => {
  if (!id) {
    return {
      success: false,
      status: 400,
      error: "Invalid destination id.",
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

  if (!name?.trim() || !country?.trim()) {
    return {
      success: false,
      status: 400,
      error: "Fields 'name' and 'country' are required.",
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

  try {
    const response = await fetch(
      `${SERVER_URL}/destination/${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          country: country.trim(),
          price: price === "" || price == null ? null : Number(price),
          departureTime,
          imageUrl,
          description,
          category,
        }),
        cache: "no-store",
      },
    );

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        success: false,
        error: data?.error ?? `Failed to update destination (${response.status}).`,
      };
    }

    return {
      success: true,
      message: data?.message ?? "Destination updated successfully.",
      destination: data?.destination ?? null,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Failed to update destination.",
    };
  }
};
