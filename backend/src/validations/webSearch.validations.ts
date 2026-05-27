import { z } from "zod";

/**
 * What the planner returns per topic.
 * search_query is used internally for Tavily — NOT stored in DB.
 */
export const PlanTopicSchema = z.object({
  title: z.string().min(2).max(80),
  difficulty: z.number().int().min(1).max(5), // integer, enforced
  search_query: z.string().min(10), // min 10 chars catches "short"/"medium" junk
});

/**
 * Planner can also signal input rejection.
 * valid: false = bad input, show error to user immediately.
 */
export const PlannerResponseSchema = z.discriminatedUnion("valid", [
  z.object({
    valid: z.literal(true),
    plan: z.array(PlanTopicSchema).min(3).max(8),
  }),
  z.object({
    valid: z.literal(false),
    reason: z.enum([
      "gibberish", // "asdfjkl", "????", random chars
      "too_vague", // "stuff", "things", "idk"
      "not_a_skill", // "the moon", "love", "existence"
      "harmful", // anything the model flags as unsafe
      "insufficient", // fewer than 2 real words
    ]),
    message: z.string(), // user-facing message, already formatted
  }),
]);

/**
 * Maps directly to the `resources` DB table.
 * topic_index = which plan item this belongs to (used for position calculation).
 */
export const ResourceSchema = z.object({
  title: z.string().min(2).max(200),
  url: z.string().url(),
  thumbnail: z.string().url().nullable(),
  source_type: z.enum(["video", "article"]),
  difficulty: z.number().int().min(1).max(5),
  summary: z.string().min(10).max(400),
  topic_index: z.number().int().min(0), // maps to plan[i] for position ordering
  topic_title: z.string(), // denormalized for display, stored in resource title prefix if needed
});

export const EnricherResponseSchema = z.object({
  resources: z.array(ResourceSchema),
});

export type PlanTopic = z.infer<typeof PlanTopicSchema>;
export type Resource = z.infer<typeof ResourceSchema>;
export type PlannerResponse = z.infer<typeof PlannerResponseSchema>;
