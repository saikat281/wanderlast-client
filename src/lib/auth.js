import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db("wanderlast");

/**
 * Makes sure the cached MongoClient has an open topology.
 *
 * On Vercel the module (and its MongoClient) stays alive for the lifetime of a
 * warm function instance. If the very first connection fails — for example
 * while Atlas network access rules are propagating — the driver closes the
 * topology and every later request on that instance fails immediately with
 * `MongoTopologyClosedError`. Calling `connect()` again creates a fresh
 * topology, so the instance can recover without a redeploy.
 */
export async function ensureDatabaseConnection() {
  await client.connect();
}

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },

  session : {
    cookieCache : {
      enabled : true,
      strategy : "jwt",
      maxAge : 7 * 24 * 60 * 60
    }
  },
  
  plugins: [
    jwt(),
  ]
});