import axios from "axios";
import { getOrCreateUUID } from "./device";

// Read API Base URL dynamically from environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
    useruuid: getOrCreateUUID(),
  },
});
