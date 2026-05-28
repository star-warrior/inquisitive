import { db } from "../config/db";
import { noteBook, resource } from "../models/schema";
import { eq, and } from "drizzle-orm";
import { buildNotebook } from "../services/aiSearchGroq.service";

export const getAllNoteBooks = async (useruuid: string) => {
  try {
    const noteBooks = await db
      .select()
      .from(noteBook)
      .where(eq(noteBook.deviceId, useruuid));

    // Self-healing: Audit and sync cached completion percentage with actual resource status
    const auditedNotebooks = await Promise.all(
      noteBooks.map(async (nb) => {
        const resourcesList = await db
          .select()
          .from(resource)
          .where(eq(resource.notebookId, nb.id));

        const totalCount = resourcesList.length;
        const completedCount = resourcesList.filter((r) => r.status === "completed").length;
        const skippedCount = resourcesList.filter((r) => r.status === "skipped").length;

        const validTotal = totalCount - skippedCount;
        const calculatedPercent = validTotal > 0 ? Math.round((completedCount / validTotal) * 100) : 0;

        if (nb.completionPercentage !== calculatedPercent) {
          await db
            .update(noteBook)
            .set({ completionPercentage: calculatedPercent })
            .where(eq(noteBook.id, nb.id));

          return {
            ...nb,
            completionPercentage: calculatedPercent,
          };
        }

        return nb;
      })
    );

    return auditedNotebooks;
  } catch (error) {
    throw error;
  }
};

export const createNoteBook = async (data: any, useruuid: string) => {
  // 1. Build learning plan and resources first.
  // If this throws an error (e.g. InvalidTopicError, ModelExhaustedError, NoSearchResultsError, AIServiceError),
  // the notebook is NOT created in the DB, preventing junk rows.
  const fetchResource = await buildNotebook(
    data.topic,
    data.level,
    data.length,
  );

  // Compute initial completion percentage based on returned resources
  const totalCount = fetchResource.resources.length;
  const completedCount = fetchResource.resources.filter((r: any) => r.status === "completed").length;
  const skippedCount = fetchResource.resources.filter((r: any) => r.status === "skipped").length;
  const validTotal = totalCount - skippedCount;
  const initialProgress = validTotal > 0 ? Math.round((completedCount / validTotal) * 100) : 0;

  try {
    // 2. Perform the database insertions sequentially
    const [insertedNotebook] = await db
      .insert(noteBook)
      .values({
        topic: data.topic,
        deviceId: useruuid,
        level: data.level,
        length: data.length,
        completionPercentage: initialProgress,
      })
      .returning();

    const resourcesToInsert = fetchResource.resources.map((r) => ({
      notebookId: insertedNotebook.id,
      title: r.title,
      url: r.url,
      thumbNail: r.thumbnail,
      sourceType: r.source_type,
      difficulty: String(r.difficulty) as "1" | "2" | "3" | "4" | "5",
      status: r.status,
      summary: r.summary,
    }));

    const insertedResources =
      resourcesToInsert.length > 0
        ? await db.insert(resource).values(resourcesToInsert).returning()
        : [];

    return {
      notebook: insertedNotebook,
      resources: insertedResources,
    };
  } catch (error) {
    console.error(
      "Database insertions failed during notebook creation:",
      error,
    );
    throw error;
  }
};

export const deleteNoteBook = async (notebookId: string, useruuid: string) => {
  try {
    const [deletedNotebook] = await db
      .delete(noteBook)
      .where(and(eq(noteBook.id, notebookId), eq(noteBook.deviceId, useruuid)))
      .returning();

    return deletedNotebook;
  } catch (error) {
    throw error;
  }
};
