"use server";

import { DELETE } from "@/server-action/request";

/**
 * Server action that deletes a destination through the Wanderlast API.
 *
 * DELETE {SERVER_URL}/destination/:id
 */
export const deleteDestinationAction = async (id) => {
  if (!id) {
    return {
      success: false,
      error: "Invalid destination id.",
    };
  }

  try {
    const data = await DELETE(`/destination/${encodeURIComponent(id)}`);

    return {
      success: true,
      message: data?.message ?? "Destination deleted successfully.",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Failed to delete destination.",
    };
  }
};
