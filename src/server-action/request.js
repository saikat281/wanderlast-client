// Backend base URL, configured through SERVER_URL in .env
const SERVER_URL = process.env.SERVER_URL ?? "http://localhost:5000/";

/** Join the server URL with a path without duplicating slashes. */
export function serverUrl(path = "") {
  return `${SERVER_URL.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
}

/**
 * Shared server-side HTTP helpers used by the files in `src/server-action`.
 * Every CRUD operation goes through SERVER_URL so the API base URL and error
 * handling stay in one place.
 */
async function request(method, path, body) {
  const response = await fetch(serverUrl(path), {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(
      data?.error ?? `Request to ${method} ${path} failed (${response.status}).`,
    );
    error.status = response.status;
    throw error;
  }

  return data;
}

export function GET(path) {
  return request("GET", path);
}

export function POST(path, body) {
  return request("POST", path, body);
}

export function PATCH(path, body) {
  return request("PATCH", path, body);
}

export function DELETE(path, body) {
  return request("DELETE", path, body);
}
