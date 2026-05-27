import fs from "fs";
import path from "path";

const colors = {
  reset: "\x1b[0m",
  info: "\x1b[36m", // Cyan
  success: "\x1b[32m", // Green
  warn: "\x1b[33m", // Yellow
  error: "\x1b[31m", // Red
};

// Resolve logs directory path relative to current utility file
const logDir = path.join(__dirname, "../../logs");

// Ensure the logs directory is fully initialized
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Clean helper to append logs into designated plain text file
const writeToFile = (filename: string, prefix: string, msg: string) => {
  const timestamp = new Date().toISOString();
  // Strip ANSI console colors for plain text files
  const cleanMsg = msg.replace(/\x1b\[[0-9;]*m/g, "");
  const logLine = `[${timestamp}] [${prefix}] ${cleanMsg}\n`;
  try {
    fs.appendFileSync(path.join(logDir, filename), logLine, "utf8");
  } catch (err) {
    console.error("Failed to append logs to file:", err);
  }
};

export const logger = {
  info: (msg: string) => {
    console.log(`${colors.info}[INFO]${colors.reset} ${msg}`);
    writeToFile("logs.log", "INFO", msg);
  },
  success: (msg: string) => {
    console.log(`${colors.success}[SUCCESS]${colors.reset} ${msg}`);
    writeToFile("logs.log", "SUCCESS", msg);
  },
  warn: (msg: string) => {
    console.warn(`${colors.warn}[WARN]${colors.reset} ${msg}`);
    writeToFile("logs.log", "WARN", msg);
  },
  error: (msg: string) => {
    console.error(`${colors.error}[ERROR]${colors.reset} ${msg}`);
    writeToFile("logs.log", "ERROR", msg);
    writeToFile("error.log", "ERROR", msg);
  },
};
