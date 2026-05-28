import { Request, Response, NextFunction } from "express";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

// Initialize Upstash HTTP Client (Points to Docker in dev, Cloud in prod)
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// 1. General Limiter Definition
const generalRatelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(100, "15 m"),
  prefix: "@upstash/ratelimit:general",
});

// 2. AI Limiter Definition
const aiRatelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, "1 h"),
  prefix: "@upstash/ratelimit:ai",
});

// --- EXPRESS MIDDLEWARE WRAPPERS ---

export const generalLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const ip = req.ip ?? "127.0.0.1";
    const { success } = await generalRatelimit.limit(ip);

    if (!success) {
      return res.status(429).json({
        status: 429,
        message: "Too many requests from this IP, please try again later.",
      });
    }
    next();
  } catch (error) {
    // Fail open if Upstash is down (Equivalent to passOnStoreError: true)
    console.error("Rate limiter error:", error);
    next();
  }
};

export const aiLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const ip = req.ip ?? "127.0.0.1";
    const { success } = await aiRatelimit.limit(ip);

    if (!success) {
      return res.status(429).json({
        status: 429,
        message: "Too many requests from this IP, please try again later.",
      });
    }
    next();
  } catch (error) {
    console.error("AI rate limiter error:", error);
    next();
  }
};
