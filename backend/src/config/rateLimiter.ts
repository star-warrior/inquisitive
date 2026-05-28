import { rateLimit } from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
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

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: "draft-8", // Returns standard RateLimit-* headers
  legacyHeaders: false, // Disables X-RateLimit-* headers
  passOnStoreError: true, // Fail open if Redis is down
  store: new RedisStore({
    sendCommand: async (...args: string[]) => {
      if (!redisClient.isReady) {
        throw new Error("Redis client not ready");
      }
      return await redisClient.sendCommand(args);
    },
  }),
  message: {
    status: 429,
    message: "Too many requests from this IP, please try again later.",
  },
});

export const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 requests per windowMs (AI creation is expensive)
  standardHeaders: "draft-8",
  legacyHeaders: false,
  passOnStoreError: true, // Fail open if Redis is down
  store: new RedisStore({
    sendCommand: async (...args: string[]) => {
      if (!redisClient.isReady) {
        throw new Error("Redis client not ready");
      }
      return await redisClient.sendCommand(args);
    },
  }),
  message: {
    status: 429,
    message: "Too many requests from this IP, please try again later.",
  },
});

