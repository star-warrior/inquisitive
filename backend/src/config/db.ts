import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import dotenv from "dotenv";
import { logger } from "../utils/logger";

// Load environment configurations
dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  logger.warn("DATABASE_URL is missing in environment configuration.");
}

// Initialize Neon PostgreSQL client
const sql = neon(databaseUrl || "");

// Export Drizzle ORM instance
export const db = drizzle(sql as any);

// Test database connection and log status
(async () => {
  if (!databaseUrl) return;
  try {
    await sql`SELECT 1`;
    logger.success("Neon Database connected successfully.");
  } catch (error: any) {
    logger.error(`Neon Database connection failed: ${error.message || error}`);
  }
})();
