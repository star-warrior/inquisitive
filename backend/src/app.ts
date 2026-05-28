import express from "express";
import cors from "cors";
import morgan from "morgan";

const app = express();
app.set("trust proxy", 1);

import noteBookRoutes from "./routes/noteBook.route.js";
import aiRoutes from "./routes/ai.route.js";
import resourceRoutes from "./routes/resource.routes.js";
import { generalLimiter } from "./config/rateLimiter.js";

// Apply standard Express Middlewares
app.use(cors());
app.use(express.json());

// Logger configuration with Morgan
app.use(morgan("dev"));
app.use(generalLimiter);


// Custom Routes

app.use("/api/notebook", noteBookRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/me", (req, res) => {});

// Basic health check route
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Inquisitive API server is online." });
});

export default app;
