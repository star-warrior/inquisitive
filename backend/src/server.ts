import app from "./app";
import { config } from "dotenv";
config();
import { logger } from "./utils/logger";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.success(
    `Inquisitive API Server successfully booted on http://localhost:${PORT}`,
  );
});
