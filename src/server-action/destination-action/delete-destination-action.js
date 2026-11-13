"use server";

// Backend base URL, configured through SERVER_URL in .env
const SERVER_URL = process.env.SERVER_URL;

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
    const response = await fetch(
      `${SERVER_URL}/destination/${encodeURIComponent(id)}`,
      {
        method: "DELETE",
        cache: "no-store",
      },
    );

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        success: false,
        error: data?.error ?? `Failed to delete destination (${response.status}).`,
      };
    }

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
