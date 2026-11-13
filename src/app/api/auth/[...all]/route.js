import { auth, ensureDatabaseConnection } from "@/lib/auth"; // path to your auth file
import { toNextJsHandler } from "better-auth/next-js";

const handlers = toNextJsHandler(auth);

export async function GET(request) {
  await ensureDatabaseConnection();
  return handlers.GET(request);
}

export async function POST(request) {
  await ensureDatabaseConnection();
  return handlers.POST(request);
}