import {
  pgTable,
  uuid,
  timestamp,
  varchar,
  pgEnum,
  text,
  index, // Fixed: Imported from pg-core
} from "drizzle-orm/pg-core";

// --- ENUMS ---

export const topicEnum = pgEnum("topic_level", [
  "beginner",
  "intermediate",
  "hard",
]);

export const sourceType = pgEnum("source_type", ["article", "video"]);

export const lengthEnum = pgEnum("length", ["short", "medium", "long"]);

export const difficultyEnum = pgEnum("difficulty", ["1", "2", "3", "4", "5"]);

export const statusEnum = pgEnum("status", [
  "todo",
  "in_progress",
  "completed",
  "skipped",
]);

// --- TABLES ---

export const noteBook = pgTable("notebook", {
  id: uuid("id").defaultRandom().primaryKey(),
  deviceId: varchar("deviceId", { length: 36 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  topic: varchar("topic", { length: 255 }).notNull(),
  level: topicEnum("level").notNull(),
  length: lengthEnum("length").notNull(),
});

export const resource = pgTable(
  "resource",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    notebookId: uuid("notebook_id")
      .notNull()
      .references(() => noteBook.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    url: varchar("url", { length: 255 }).notNull(),
    thumbNail: text("thumbnail"),
    sourceType: sourceType("source_type").notNull(),
    difficulty: difficultyEnum("difficulty").notNull(),
    status: statusEnum("status").notNull(),
    summary: text("summary"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => {
    return {
      notebookIdIndex: index("notebook_id_idx").on(table.notebookId),
    };
  },
);
