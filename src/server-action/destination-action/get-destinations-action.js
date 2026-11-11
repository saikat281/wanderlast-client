import { GET } from "@/server-action/request";

/**
 * Fetches every destination from the Wanderlast API.
 *
 * GET {SERVER_URL}/destination
 */
export const getDestinationsAction = async () => {
  try {
    const data = await GET("/destination");

    return {
      success: true,
      destinations: Array.isArray(data) ? data : [],
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      destinations: [],
      error: error.message || "Failed to fetch destinations.",
    };
  }
};
