import { GoogleGenAI, Type, type Schema } from "@google/genai";
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

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const TAVILY_API = process.env.TAVILY_API!;

if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY env missing");
if (!TAVILY_API) throw new Error("TAVILY_API_KEY env missing");

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const PLANNER_MODELS = ["gemini-2.5-pro", "gemini-2.5-flash"];
const ENRICHER_MODELS = ["gemini-2.5-flash", "gemini-2.5-pro"];

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

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

// ─── Gemini Caller ────────────────────────────────────────────────────────────
async function callGemini(
  models: string[],
  systemPrompt: string,
  userPrompt: string,
  responseSchema: Schema,
  maxTokens = 1200,
): Promise<string> {
  for (const model of models) {
    for (let attempt = 0; attempt <= 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: userPrompt,
          config: {
            systemInstruction: systemPrompt,
            maxOutputTokens: maxTokens,
            temperature: 0.15,
            responseMimeType: "application/json",
            responseSchema: responseSchema,
          },
        });

        const content = response.text;
        if (!content) throw new Error("Empty response from Gemini model");
        return content;
      } catch (err: any) {
        const statusCode = err?.status || err?.statusCode;
        if (statusCode === 429 && attempt < 2) {
          await sleep((attempt + 1) * 2000);
          continue;
        }
        if (attempt === 2) {
          console.warn(`[Gemini] ${model} failed:`, err?.message || err);
          break;
        }
      }
    }
  }
  throw new ModelExhaustedError();
}

// ─── Gemini Schemas ───────────────────────────────────────────────────────────
const GEMINI_PLANNER_RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    valid: { type: Type.BOOLEAN },
    plan: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          difficulty: { type: Type.INTEGER },
          search_query: { type: Type.STRING },
        },
        required: ["title", "difficulty", "search_query"],
      },
    },
    reason: { type: Type.STRING },
    message: { type: Type.STRING },
  },
  required: ["valid"],
};

const GEMINI_ENRICHER_RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    resources: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          topic_index: { type: Type.INTEGER },
          topic_title: { type: Type.STRING },
          title: { type: Type.STRING },
          url: { type: Type.STRING },
          thumbnail: { type: Type.STRING, nullable: true },
          source_type: { type: Type.STRING },
          difficulty: { type: Type.INTEGER },
          summary: { type: Type.STRING },
        },
        required: [
          "topic_index",
          "topic_title",
          "title",
          "url",
          "source_type",
          "difficulty",
          "summary",
        ],
      },
    },
  },
  required: ["resources"],
};

// ─── Prompts ──────────────────────────────────────────────────────────────────
const PLANNER_SYSTEM = `You are an AI learning curriculum designer. Given a topic, level, and count, generate a structured skill-based learning plan in JSON.

INPUT VALIDATION (Evaluate sequentially. If invalid, reject immediately):
1. GIBBERISH: Keyboard mashing (e.g., "asdfjkl"). -> reason: "gibberish"
2. INSUFFICIENT: < 2 words or only emojis. -> reason: "insufficient"
3. TOO VAGUE: Intangible concepts (e.g., "stuff"). -> reason: "too_vague"
4. HARMFUL: Weapons, illegal acts, or cyberattacks. -> reason: "harmful"

CURRICULUM RULES:
- Order topics chronologically from easiest to hardest.
- Focus ONLY on actionable skills. Exclude history, biography, and trivia.
- "difficulty": an INTEGER from 1 to 5.
- "search_query": Format: "<main subject> <sub-topic> tutorial <level>"`;

// Dynamic system prompt generator based on length constraints
function getEnricherSystemPrompt(length: "short" | "medium" | "long"): string {
  let lengthRule = "";

  if (length === "short") {
    lengthRule = `- LENGTH RULE ("short" course chosen): Select exactly ONE (1) resource per topic. Prioritize the single best high-yield video tutorial. If no video is found, fallback to the single best article. Total material must not exceed 1 resource per topic.`;
  } else if (length === "medium") {
    lengthRule = `- LENGTH RULE ("medium" course chosen): Select exactly TWO (2) resources per topic. Curate the single best video tutorial AND the single best structural article. If one format is missing, fallback to 2 of the available format.`;
  } else {
    lengthRule = `- LENGTH RULE ("long" course chosen): Deep dive. Select exactly THREE (3) resources per topic (e.g., 1 high-quality conceptual video + 2 detailed practical articles, or up to 3 articles if no video content exists).`;
  }

  return `You are a learning resource curator. Given raw search results, select, pick, and summarize the absolute highest quality resources.

${lengthRule}

SELECTION & QUALITY RULES:
- Only pick the "best" resources: authoritative sources, complete guides, or clear step-by-step videos. Skip breaking, low-quality, or spam links.
- Strictly adhere to the resource count specified in the LENGTH RULE above.

THUMBNAIL RULES:
- YouTube links (matching "youtube.com/watch?v=VIDEO_ID"): extract VIDEO_ID and return "https://img.youtube.com/vi/VIDEO_ID/hqdefault.jpg".
- All other links: return null.

SUMMARY RULES:
- Strictly max 2 sentences. 
- Sentence 1: what specific concept/skill this resource teaches. 
- Sentence 2: what action the learner will be able to perform after.
- Anti-patterns: Never use filler phrases like "In this video..." or "This article covers...".`;
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

  const userPrompt = `Topic: "${trimmed}"\nLevel: ${level}\nNumber of topics to generate: ${count}\n\nValidate the topic first. If valid, generate the learning plan.`;

  const raw = await callGemini(
    PLANNER_MODELS,
    PLANNER_SYSTEM,
    userPrompt,
    GEMINI_PLANNER_RESPONSE_SCHEMA,
    800,
  );

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

// ─── Step 2: Adaptive Axios Tavily Search ─────────────────────────────────────
async function tavilySearchTopic(
  query: string,
  topicTitle: string,
  length: "short" | "medium" | "long",
): Promise<{ videos: TavilyResult[]; articles: TavilyResult[] }> {
  // Optimize API limits to save payload tokens depending on requested depth
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
      query: `${query} structural guide step-by-step documentation`,
      search_depth: length === "long" ? "advanced" : "basic",
      max_results: maxArticles,
      exclude_domains: [
        "facebook.com",
        "instagram.com",
        "twitter.com",
        "x.com",
      ],
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
  const payload = searchData.map((d) => ({
    index: d.topicIndex,
    topic: d.topic.title,
    difficulty: d.topic.difficulty,
    videos: d.videos.map((r) => ({
      title: r.title,
      url: r.url,
      snippet: r.content.slice(0, 180),
    })),
    articles: d.articles.map((r) => ({
      title: r.title,
      url: r.url,
      snippet: r.content.slice(0, 180),
    })),
  }));

  const hasAnyResults = payload.some(
    (p) => p.videos.length > 0 || p.articles.length > 0,
  );
  if (!hasAnyResults) throw new NoSearchResultsError();

  const systemPrompt = getEnricherSystemPrompt(length);
  const userPrompt = `Curate learning resources for these topics: ${JSON.stringify(payload, null, 0)}`;

  const raw = await callGemini(
    ENRICHER_MODELS,
    systemPrompt,
    userPrompt,
    GEMINI_ENRICHER_RESPONSE_SCHEMA,
    3000,
  );

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
