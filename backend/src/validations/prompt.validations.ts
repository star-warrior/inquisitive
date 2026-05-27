import { z } from "zod";

// ─── Zod schemas (source of truth for both prompt + runtime validation) ────

export const PlanTopicSchema = z.object({
  title: z.string(),
  difficulty: z.number().int().min(1).max(5),
  search_query: z.string(), // LLM generates the Tavily query too — saves a round trip
});

export const LearningPlanSchema = z.array(PlanTopicSchema).min(3).max(8);

export const ResourceSchema = z.object({
  title: z.string(),
  url: z.string().url(),
  thumbnail: z.string().nullable(),
  source_type: z.enum(["video", "article"]),
  difficulty: z.number().int().min(1).max(5),
  summary: z.string(),
  topic_title: z.string(), // which plan topic this belongs to
});

export const EnrichedResourcesSchema = z.array(ResourceSchema);

export type PlanTopic = z.infer<typeof PlanTopicSchema>;
export type Resource = z.infer<typeof ResourceSchema>;
