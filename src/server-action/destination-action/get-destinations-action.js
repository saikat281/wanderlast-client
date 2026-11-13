// Backend base URL, configured through SERVER_URL in .env
const SERVER_URL = process.env.SERVER_URL;

/**
 * Fetches every destination from the Wanderlast API.
 *
 * GET {SERVER_URL}/destination
 */
export const getDestinationsAction = async () => {
  try {
    const response = await fetch(`${SERVER_URL}/destination`, {
      cache: "no-store",
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        success: false,
        destinations: [],
        error: data?.error ?? `Failed to fetch destinations (${response.status}).`,
      };
    }

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
