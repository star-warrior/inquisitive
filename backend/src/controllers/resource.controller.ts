import { db } from "../config/db";
import { noteBook, resource } from "../models/schema";
import { eq } from "drizzle-orm";

export const updateNotebookCompletion = async (notebookId: string) => {
  try {
    const resources = await db
      .select()
      .from(resource)
      .where(eq(resource.notebookId, notebookId));

    const totalCount = resources.length;
    const completedCount = resources.filter((r) => r.status === "completed").length;
    const skippedCount = resources.filter((r) => r.status === "skipped").length;

    const validTotal = totalCount - skippedCount;
    const progressPercent = validTotal > 0 ? Math.round((completedCount / validTotal) * 100) : 0;

    await db
      .update(noteBook)
      .set({ completionPercentage: progressPercent })
      .where(eq(noteBook.id, notebookId));
  } catch (err) {
    console.error("Failed to update notebook completion percentage:", err);
  }
};

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

    if (updatedResource) {
      await updateNotebookCompletion(updatedResource.notebookId);
    }

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

    if (deletedResource) {
      await updateNotebookCompletion(deletedResource.notebookId);
    }

    return deletedResource;
  } catch (error) {
    throw error;
  }
};

