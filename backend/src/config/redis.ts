import { createClient } from "redis";
import { logger } from "../utils/logger.js";
import dotenv from "dotenv";

dotenv.config();

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

// Create Redis Client
export const redisClient = createClient({
  url: redisUrl,
});

redisClient.on("error", (err) => {
  logger.error(`Redis client error: ${err.message || err}`);
});

redisClient.on("connect", () => {
  logger.info("Redis client connecting...");
});

redisClient.on("ready", () => {
  logger.success("Redis Database connected successfully.");
});

// Asynchronously connect
(async () => {
  try {
    await redisClient.connect();
  } catch (err: any) {
    logger.error(`Failed to connect to Redis: ${err.message || err}`);
  }
})();
