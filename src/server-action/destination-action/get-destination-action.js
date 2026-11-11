import { GET } from "@/server-action/request";

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

  try {
    const destination = await GET(`/destination/${encodeURIComponent(id)}`);

    return {
      success: true,
      destination,
      status: 200,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      destination: null,
      status: error.status ?? 500,
      error: error.message || "Failed to fetch destination.",
    };
  }
};
