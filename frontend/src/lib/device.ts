import { v4 as uuid } from "uuid";

export function getOrCreateUUID(): string {
  let useruuid = localStorage.getItem("useruuid");
  if (!useruuid) {
    useruuid = uuid();
    localStorage.setItem("useruuid", useruuid);
  }
  return useruuid;
}
