import { CorsOptions } from "cors";
import { config } from "dotenv";
config();

const allowedOrigins = [
  "https://www.yourdomain.com",
  "https://yourdomain.com",
  "https://admin.yourdomain.com",
];

// Allow local development origins only if not in production
if (process.env.NODE_ENV !== "production") {
  allowedOrigins.push(
    "http://localhost:3000", // React default
    "http://localhost:5173", // Vite default
    "http://127.0.0.1:5173",
  );
}

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Blocked by CORS policy"));
    }
  },

  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
  ],
  exposedHeaders: ["X-Total-Count", "Content-Range"],
  credentials: true,
  maxAge: 600,
  optionsSuccessStatus: 200,
};

