import Groq from "groq-sdk";
import axios from "axios";
import {
  PlanTopicSchema,
  PlannerResponseSchema,
  ResourceSchema,
  EnricherResponseSchema,
  type PlanTopic,
  type Resource,
} from "../validations/webSearch.validations.js";

export {
  PlanTopicSchema,
  PlannerResponseSchema,
  ResourceSchema,
  EnricherResponseSchema,
  type PlanTopic,
  type Resource,
};

// ─── Env Validation ───────────────────────────────────────────────────────────
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const TAVILY_API = process.env.TAVILY_API;

if (!GROQ_API_KEY) throw new Error("GROQ_API_KEY env missing");
if (!TAVILY_API) throw new Error("TAVILY_API env missing");

const groq = new Groq({ apiKey: GROQ_API_KEY });

// Primary model for everything. Fallback only if 429 persists.
// llama-3.3-70b-versatile: 6,000 TPM / 30 RPM / 14,400 RPD on free tier
const PLANNER_MODELS = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant"];
const ENRICHER_MODELS = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant"];

// ─── Custom Errors ────────────────────────────────────────────────────────────
export class InvalidTopicError extends Error {
  constructor(
    public readonly reason: string,
    public readonly userMessage: string,
  ) {
    super(userMessage);
    this.name = "InvalidTopicError";
  }
}
export class ModelExhaustedError extends Error {
  constructor(message = "All AI models exhausted") {
    super(message);
    this.name = "ModelExhaustedError";
  }
}
export class NoSearchResultsError extends Error {
  constructor(message = "No search results returned for any topic") {
    super(message);
    this.name = "NoSearchResultsError";
  }
}
export class AIServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AIServiceError";
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

// ─── Groq Caller ──────────────────────────────────────────────────────────────
// Groq does NOT support typed responseSchema like Gemini.
// We use response_format: { type: "json_object" } + Zod validation downstream.
// The system prompt must explicitly instruct the model to return only JSON.
async function callGroq(
  models: string[],
  systemPrompt: string,
  userPrompt: string,
  maxTokens = 1200,
): Promise<string> {
  for (const model of models) {
    for (let attempt = 0; attempt <= 2; attempt++) {
      try {
        const response = await groq.chat.completions.create({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          max_tokens: maxTokens,
          temperature: 0.15,
          response_format: { type: "json_object" },
        });

        const content = response.choices[0]?.message?.content;
        if (!content) throw new Error("Empty response from Groq model");
        return content;
      } catch (err: any) {
        const statusCode = err?.status || err?.statusCode || err?.error?.status;

        // 429 = rate limited — wait and retry on same model
        if (statusCode === 429 && attempt < 2) {
          await sleep((attempt + 1) * 2000);
          continue;
        }

        // On last attempt, log and break to try next model
        if (attempt === 2) {
          console.warn(`[Groq] ${model} failed:`, err?.message || err);
          break;
        }
      }
    }
  }
  throw new ModelExhaustedError();
}

// ─── Prompts ──────────────────────────────────────────────────────────────────
// IMPORTANT: Groq requires the JSON structure to be described in the prompt.
// Unlike Gemini's responseSchema, there's no separate schema object.
// Keep the structure description tight — it counts toward input tokens.

const PLANNER_SYSTEM = `You are an AI learning curriculum designer. Return ONLY valid JSON. No prose, no markdown, no backticks.

OUTPUT SCHEMA:
If valid topic → { "valid": true, "plan": [ { "title": string, "difficulty": integer (1-5), "search_query": string } ] }
If invalid topic → { "valid": false, "reason": string, "message": string }

INPUT VALIDATION (check in order, reject on first match):
1. GIBBERISH: Keyboard mashing (e.g. "asdfjkl") → reason: "gibberish"
2. INSUFFICIENT: Less than 2 words or only emojis → reason: "insufficient"
3. TOO_VAGUE: Intangible concepts (e.g. "stuff", "things") → reason: "too_vague"
4. HARMFUL: Weapons, illegal acts, cyberattacks → reason: "harmful"

CURRICULUM RULES (only apply when valid):
- Order topics chronologically from easiest to hardest.
- Actionable skills ONLY. No history, biography, or trivia.
- "difficulty": integer 1–5.
- "search_query": format → "<subject> <sub-topic> tutorial <level>"`;

// Dynamic enricher prompt — tighter resource count instructions per length
function getEnricherSystemPrompt(length: "short" | "medium" | "long"): string {
  const lengthRule: Record<string, string> = {
    short: "Select exactly 1 resource per topic. Best video first; fallback to article.",
    medium: "Select exactly 2 resources per topic. 1 best video + 1 best article. If one format missing, 2 of the available.",
    long: "Select exactly 3 resources per topic. 1 video + 2 articles preferred. Up to 3 articles if no video.",
  };

  return `You are a learning resource curator. Return ONLY valid JSON. No prose, no markdown, no backticks.

OUTPUT SCHEMA:
{ "resources": [ { "topic_index": integer, "topic_title": string, "title": string, "url": string, "thumbnail": string | null, "source_type": "video" | "article", "difficulty": integer (1-5), "summary": string } ] }

LENGTH RULE: ${lengthRule[length]}

SELECTION RULES:
- Pick only authoritative, complete, high-quality resources. Skip spam, low-effort, or broken links.
- Strictly follow the LENGTH RULE resource count per topic.

THUMBNAIL RULES:
- YouTube URLs: extract VIDEO_ID from "youtube.com/watch?v=VIDEO_ID", return "https://img.youtube.com/vi/VIDEO_ID/hqdefault.jpg"
- All other URLs: return null

SUMMARY RULES:
- Max 2 sentences.
- Sentence 1: what specific concept/skill this teaches.
- Sentence 2: what the learner can DO after.
- Never use "In this video..." or "This article covers..."`;
}

// ─── Step 1: AI Planner ───────────────────────────────────────────────────────
export async function generateLearningPlan(
  topic: string,
  level: string,
  length: "short" | "medium" | "long",
): Promise<PlanTopic[]> {
  const count = { short: 5, medium: 6, long: 8 }[length];
  const trimmed = topic.trim();

  if (trimmed.length < 2) {
    throw new InvalidTopicError(
      "insufficient",
      "Please enter a topic you'd like to learn. Try something like 'Chess', 'Guitar', or 'Python'.",
    );
  }

  const userPrompt = `Topic: "${trimmed}"\nLevel: ${level}\nTopics to generate: ${count}\n\nValidate the topic. If valid, generate the learning plan.`;

  const raw = await callGroq(PLANNER_MODELS, PLANNER_SYSTEM, userPrompt, 800);

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new AIServiceError("Planner returned non-JSON response");
  }

  const result = PlannerResponseSchema.safeParse(parsed);
  if (!result.success)
    throw new AIServiceError("Planner returned unexpected structure");

  if (!result.data.valid) {
    const invalidData = result.data as {
      valid: false;
      reason: string;
      message: string;
    };
    throw new InvalidTopicError(invalidData.reason, invalidData.message);
  }

  return result.data.plan;
}

// ─── Step 2: Tavily Search ────────────────────────────────────────────────────
type TavilyResult = {
  title: string;
  url: string;
  content: string;
};

async function tavilySearchTopic(
  query: string,
  topicTitle: string,
  length: "short" | "medium" | "long",
): Promise<{ videos: TavilyResult[]; articles: TavilyResult[] }> {
  const maxVideos = length === "short" ? 2 : 3;
  const maxArticles = length === "short" ? 2 : 5;

  const [videoRes, articleRes] = await Promise.allSettled([
    axios.post("https://api.tavily.com/search", {
      api_key: TAVILY_API,
      query: `${query} video tutorial`,
      search_depth: "basic",
      max_results: maxVideos,
      include_domains: ["youtube.com"],
    }),
    axios.post("https://api.tavily.com/search", {
      api_key: TAVILY_API,
      query: `${query} guide step-by-step documentation`,
      search_depth: length === "long" ? "advanced" : "basic",
      max_results: maxArticles,
      exclude_domains: ["facebook.com", "instagram.com", "twitter.com", "x.com"],
    }),
  ]);

  const videos =
    videoRes.status === "fulfilled"
      ? (videoRes.value.data?.results ?? []).slice(0, maxVideos)
      : [];
  const articles =
    articleRes.status === "fulfilled"
      ? (articleRes.value.data?.results ?? []).slice(0, maxArticles)
      : [];

  if (videos.length === 0 && articles.length === 0) {
    console.warn(`[Tavily] Zero results for topic: "${topicTitle}"`);
  }

  return { videos, articles };
}

export async function fetchResourcesForPlan(
  plan: PlanTopic[],
  length: "short" | "medium" | "long",
) {
  const results = await Promise.allSettled(
    plan.map((topic) =>
      tavilySearchTopic(topic.search_query, topic.title, length),
    ),
  );

  return plan.map((topic, i) => ({
    topic,
    topicIndex: i,
    ...(results[i].status === "fulfilled"
      ? results[i].value
      : { videos: [], articles: [] }),
  }));
}

// ─── Step 3: Batch Enrichment ─────────────────────────────────────────────────
export async function enrichResources(
  searchData: Awaited<ReturnType<typeof fetchResourcesForPlan>>,
  length: "short" | "medium" | "long",
): Promise<Resource[]> {
  // Abbreviated keys + 80-char snippets = ~35% fewer input tokens vs original
  const payload = searchData.map((d) => ({
    i: d.topicIndex,
    t: d.topic.title,
    d: d.topic.difficulty,
    v: d.videos.map((r) => ({
      t: r.title,
      u: r.url,
      s: r.content.slice(0, 80),
    })),
    a: d.articles.map((r) => ({
      t: r.title,
      u: r.url,
      s: r.content.slice(0, 80),
    })),
  }));

  const hasAnyResults = payload.some((p) => p.v.length > 0 || p.a.length > 0);
  if (!hasAnyResults) throw new NoSearchResultsError();

  // Dynamic token ceiling — stop paying for unused capacity
  const maxTokens = { short: 500, medium: 800, long: 1200 }[length];

  const systemPrompt = getEnricherSystemPrompt(length);
  // Remind model of key mapping so it doesn't guess
  const userPrompt = `Curate resources. Keys: i=topic_index, t=title, d=difficulty, v=videos, a=articles, u=url, s=snippet.\n\n${JSON.stringify(payload)}`;

  const raw = await callGroq(ENRICHER_MODELS, systemPrompt, userPrompt, maxTokens);

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new AIServiceError("Enricher returned non-JSON response");
  }

  const result = EnricherResponseSchema.safeParse(parsed);
  if (!result.success)
    throw new AIServiceError("Enricher returned invalid structure");

  return result.data.resources as unknown as Resource[];
}

// ─── Orchestrator ─────────────────────────────────────────────────────────────
export type NotebookBuildResult = {
  plan: PlanTopic[];
  resources: Array<
    Omit<Resource, "topic_index"> & { status: "todo"; position: number }
  >;
};

export async function buildNotebook(
  topic: string,
  level: string,
  length: "short" | "medium" | "long",
): Promise<NotebookBuildResult> {
  const plan = await generateLearningPlan(topic, level, length);
  const searchData = await fetchResourcesForPlan(plan, length);
  const rawResources = await enrichResources(searchData, length);

  const resources = rawResources.map(({ topic_index, ...r }) => ({
    ...r,
    status: "todo" as const,
    position: topic_index * 10,
  }));

  return { plan, resources };
}