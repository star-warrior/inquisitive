import { db } from "../config/db";
import { resource } from "../models/schema";
import { eq } from "drizzle-orm";

export const getResourcesByNotebookId = async (notebookId: string) => {
  try {
    const resources = await db
      .select()
      .from(resource)
      .where(eq(resource.notebookId, notebookId));

    return resources;
  } catch (error) {
    throw error;
  }
};

export const updateResourceStatus = async (
  resourceId: string,
  status: "todo" | "in_progress" | "completed" | "skipped"
) => {
  try {
    const [updatedResource] = await db
      .update(resource)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(eq(resource.id, resourceId))
      .returning();

    return updatedResource;
  } catch (error) {
    throw error;
  }
};

export const deleteResource = async (resourceId: string) => {
  try {
    const [deletedResource] = await db
      .delete(resource)
      .where(eq(resource.id, resourceId))
      .returning();

    return deletedResource;
  } catch (error) {
    throw error;
  }
};

