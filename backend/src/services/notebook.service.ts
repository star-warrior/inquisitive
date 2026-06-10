import { db } from "../config/db.js";
import { noteBook } from "../models/schema.js";
import { eq, sql } from "drizzle-orm";

/**
 * Counts the number of notebooks created by a user.
 * Notebooks are identified by the deviceId matching the user's UUID.
 * 
 * @param useruuid The unique identifier of the user's device
 * @returns The count of notebooks
 */
export const countUserNotebooks = async (useruuid: string): Promise<number> => {
  try {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(noteBook)
      .where(eq(noteBook.deviceId, useruuid));
    
    return Number(result[0]?.count ?? 0);
  } catch (error) {
    console.error(`Failed to count user notebooks for uuid: ${useruuid}`, error);
    throw error;
  }
};
