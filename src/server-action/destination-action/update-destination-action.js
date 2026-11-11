"use server";

import { PATCH } from "@/server-action/request";

/**
 * Server action that updates a destination through the Wanderlast API.
 *
 * PATCH {SERVER_URL}/destination/:id
 */
export const updateDestinationAction = async (id, destination) => {
  if (!id) {
    return {
      success: false,
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
      error: "Fields 'name' and 'country' are required.",
    };
  }

  try {
    const data = await PATCH(`/destination/${encodeURIComponent(id)}`, {
      name: name.trim(),
      country: country.trim(),
      price: price === "" || price == null ? null : Number(price),
      departureTime,
      imageUrl,
      description,
      category,
    });

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
