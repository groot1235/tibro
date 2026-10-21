import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const rawConnectionString =
  process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;

if (!rawConnectionString) {
  throw new Error("DATABASE_URL is not defined in environment variables");
}

// Neon HTTP serverless driver uses HTTPS and requires the direct unpooled compute endpoint
const connectionString = rawConnectionString.replace("-pooler.", ".");

const client = neon(connectionString);

export const db = drizzle(client, { schema });
export * from "./schema";
