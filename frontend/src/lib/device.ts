import { v4 as uuid } from "uuid";

export function getOrCreateUUID(): string {
  const existing = localStorage.getItem("useruuid");
  if (existing) {
    return existing;
  }
  const newUUID = uuid();
  localStorage.setItem("useruuid", newUUID);
  return newUUID;
}
