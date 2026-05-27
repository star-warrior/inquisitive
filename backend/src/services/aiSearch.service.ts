import {
  PlanTopicSchema,
  PlannerResponseSchema,
  ResourceSchema,
  EnricherResponseSchema,
  type PlanTopic,
  type Resource,
  type PlannerResponse,
} from "../validations/webSearch.validations.js";

export {
  PlanTopicSchema,
  PlannerResponseSchema,
  ResourceSchema,
  EnricherResponseSchema,
  type PlanTopic,
  type Resource,
  type PlannerResponse,
};

const OPENROUTER_API = process.env.OPENROUTER_API!;
const TAVILY_API = process.env.TAVILY_API!;

if (!OPENROUTER_API) throw new Error("OPENROUTER_API env missing");
if (!TAVILY_API) throw new Error("TAVILY_API_KEY env missing");

// ─── Model lists ─────────────────────────────────────────────────────────────

const PLANNER_MODELS = [
  "meta-llama/llama-3.3-70b-instruct",
  "deepseek/deepseek-chat-v3-0324:free",
  "qwen/qwen3-32b:free",
  "deepseek/deepseek-v4-flash:free",
];

const ENRICHER_MODELS = [
  "meta-llama/llama-3.3-70b-instruct",
  "deepseek/deepseek-chat-v3-0324:free",
  "qwen/qwen3-32b:free",
];

// User-facing error for bad input — throw this, route catches and returns 400
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

// ─── OpenRouter caller ────────────────────────────────────────────────────────

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function callOpenRouter(
  models: string[],
  systemPrompt: string,
  userPrompt: string,
  maxTokens = 1200,
): Promise<string> {
  for (const model of models) {
    for (let attempt = 0; attempt <= 2; attempt++) {
      try {
        const res = await fetch(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${OPENROUTER_API}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model,
              max_tokens: maxTokens,
              temperature: 0.15, // near-deterministic JSON
              response_format: { type: "json_object" }, // enforces JSON mode
              messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
              ],
              // reasoning disabled — we need fast structured output, not CoT
            }),
          },
        );

        const data: any = await res.json();

        if (!res.ok) {
          const code = data?.error?.code;
          if (code === 429 && attempt < 2) {
            await sleep((attempt + 1) * 2000);
            continue;
          }
          throw new Error(data?.error?.message ?? `HTTP ${res.status}`);
        }

        const content = data.choices?.[0]?.message?.content;
        if (!content) throw new Error("Empty response from model");
        return content;
      } catch (err: any) {
        if (attempt === 2) {
          console.warn(`[OpenRouter] ${model} failed:`, err?.message);
          break;
        }
      }
    }
  }

  throw new ModelExhaustedError();
}

// ─── Planner system prompt ────────────────────────────────────────────────────
// Long and explicit on purpose — this is the single most important prompt.
// The guardrail logic lives here, not in application code.

const PLANNER_SYSTEM = `You are an AI learning curriculum designer. Given a topic, level, and count, generate a structured skill-based learning plan in JSON.

INPUT VALIDATION (Evaluate sequentially. If invalid, reject immediately):
1. GIBBERISH: Keyboard mashing, meaningless words, or non-dictionary repetitive phonemes (e.g., "asdfjkl", "????", "abra babra kabra dabra"). -> reason: "gibberish"
2. INSUFFICIENT: < 2 words, single chars/numbers, or only emojis (e.g., "a", "123", "hi"). -> reason: "insufficient"
3. TOO VAGUE: Intangible concepts impossible to build curriculums for (e.g., "stuff", "life"). -> reason: "too_vague"
4. HARMFUL: Weapons, illegal acts, cyberattacks, or harm (e.g., "bomb making", "bank hacking"). -> reason: "harmful"

CURRICULUM RULES (For valid inputs):
- Order topics chronologically from easiest to hardest.
- Focus ONLY on actionable skills. Exclude history, biography, and trivia.
- "difficulty": an INTEGER from 1 to 5. 1=easiest, 5=hardest. NOT a string. NOT the user's level.
- "search_query": a SPECIFIC search string to find tutorials for that exact topic.
  Format: "<main subject> <sub-topic> tutorial <level>"
  GOOD: "badminton basic grip technique beginner tutorial"
  BAD: "short" / "medium" / "long" / "beginner"

EXAMPLE OUTPUT for Topic="Badminton", Level="beginner", Count=3:
{"valid":true,"plan":[
  {"title":"Basic Grip Technique","difficulty":1,"search_query":"badminton basic grip technique beginner tutorial"},
  {"title":"Forehand Clear Shot","difficulty":2,"search_query":"badminton forehand clear shot beginner tutorial"},
  {"title":"Net Drop Shot","difficulty":3,"search_query":"badminton net drop shot technique tutorial"}
]}

OUTPUT FORMATS (Return ONLY raw JSON object. No prose. No markdown code fences):

If VALID:
{"valid":true,"plan":[{"title":"Skill title (max 60 chars)","difficulty":2,"search_query":"topic subtopic tutorial level"}]}

If INVALID:
{"valid":false,"reason":"gibberish","message":"Please enter a real learning topic. The input provided appears to be keyboard mashing or gibberish."}
(or use reason "insufficient"|"too_vague"|"harmful" with appropriate custom user-facing explanation in "message")
`;

// ─── Step 1: AI Planner ───────────────────────────────────────────────────────

export async function generateLearningPlan(
  topic: string,
  level: string,
  length: "short" | "medium" | "long",
): Promise<PlanTopic[]> {
  const count = { short: 5, medium: 6, long: 8 }[length];

  // Basic pre-flight sanitization before spending tokens
  const trimmed = topic.trim();
  if (trimmed.length < 2) {
    throw new InvalidTopicError(
      "insufficient",
      "Please enter a topic you'd like to learn. Try something like 'Chess', 'Guitar', or 'Python'.",
    );
  }

  const userPrompt = `Topic: "${trimmed}"
Level: ${level}
Number of topics to generate: ${count}

Validate the topic first. If valid, generate the learning plan.`;

  const raw = await callOpenRouter(
    PLANNER_MODELS,
    PLANNER_SYSTEM,
    userPrompt,
    800,
  );

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    console.error("[Planner] Invalid JSON from model:", raw);
    throw new AIServiceError("Planner returned non-JSON response");
  }

  const result = PlannerResponseSchema.safeParse(parsed);

  if (!result.success) {
    console.error("[Planner] Schema mismatch:", result.error.flatten());
    throw new AIServiceError("Planner returned unexpected structure");
  }

  if (!result.data.valid) {
    // Bubble up to route → return 400 with user-facing message
    throw new InvalidTopicError(result.data.reason, result.data.message);
  }

  return result.data.plan;
}

// ─── Tavily search ────────────────────────────────────────────────────────────

type TavilyResult = {
  title: string;
  url: string;
  content: string;
};

// Two targeted searches per topic: one for videos, one for articles.
// Better signal than one broad search trying to get both.
async function tavilySearchTopic(
  query: string,
  topicTitle: string,
): Promise<{ videos: TavilyResult[]; articles: TavilyResult[] }> {
  const [videoRes, articleRes] = await Promise.allSettled([
    fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: TAVILY_API,
        query: `${query} video tutorial`,
        search_depth: "basic",
        max_results: 3,
        include_domains: ["youtube.com"],
      }),
    }).then((r) => r.json()),

    fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: TAVILY_API,
        query: `${query} structural guide guide step-by-step documentation`,
        search_depth: "advanced",
        max_results: 5,
        exclude_domains: [
          "facebook.com",
          "instagram.com",
          "twitter.com",
          "x.com",
        ],
      }),
    }).then((r) => r.json()),
  ]);

  const videos =
    videoRes.status === "fulfilled"
      ? ((videoRes.value as any).results ?? []).slice(0, 2)
      : [];

  const articles =
    articleRes.status === "fulfilled"
      ? ((articleRes.value as any).results ?? []).slice(0, 2)
      : [];

  if (videos.length === 0 && articles.length === 0) {
    console.warn(`[Tavily] Zero results for topic: "${topicTitle}"`);
  }

  return { videos, articles };
}

// ─── Step 2: Parallel Tavily for all topics ───────────────────────────────────

export async function fetchResourcesForPlan(plan: PlanTopic[]) {
  const results = await Promise.allSettled(
    plan.map((topic) => tavilySearchTopic(topic.search_query, topic.title)),
  );

  return plan.map((topic, i) => ({
    topic,
    topicIndex: i,
    ...(results[i].status === "fulfilled"
      ? results[i].value
      : { videos: [], articles: [] }),
  }));
}

// ─── Enricher system prompt ───────────────────────────────────────────────────

const ENRICHER_SYSTEM = `You are a learning resource curator. Given raw search results, select and summarize the best resources.

SELECTION RULES:
- Select max 1 video (from videos array) and max 1 article (from articles array) per topic.
- Skip irrelevant, broken, or spammy links. 
- If no video is found, fallback to 2 articles (and vice-versa). Ensure min 1 resource per topic.

THUMBNAIL RULES:
- YouTube links (matching "youtube.com/watch?v=VIDEO_ID"): extract VIDEO_ID and return "https://img.youtube.com/vi/VIDEO_ID/hqdefault.jpg".
- All other links: return null.

SUMMARY RULES:
- Strictly max 2 sentences. 
- Sentence 1: what specific concept/skill this resource teaches. 
- Sentence 2: what action the learner will be able to perform after.
- Anti-patterns: Never use filler phrases like "In this video..." or "This article covers...".

OUTPUT FORMAT (Return ONLY raw JSON object. No prose. No markdown code fences. topic_index must exactly match input. difficulty must match topic difficulty):
{"resources":[{"topic_index":0,"topic_title":"Exact input title","title":"Resource title","url":"URL","thumbnail":"URL or null","source_type":"video|article","difficulty":1,"summary":"2 sentences"}]}`;

// ─── Step 3: Batch enrichment ─────────────────────────────────────────────────

export async function enrichResources(
  searchData: Awaited<ReturnType<typeof fetchResourcesForPlan>>,
): Promise<Resource[]> {
  // Build compact payload — truncate snippets to save tokens
  const payload = searchData.map((d) => ({
    index: d.topicIndex,
    topic: d.topic.title,
    difficulty: d.topic.difficulty, // already an integer from the plan
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

  // Edge case: if Tavily returned nothing for all topics
  const hasAnyResults = payload.some(
    (p) => p.videos.length > 0 || p.articles.length > 0,
  );
  if (!hasAnyResults) {
    throw new NoSearchResultsError();
  }

  const userPrompt = `Curate learning resources for these topics: ${JSON.stringify(payload, null, 0)} Return the best 1 video + 1 article per topic (or 2 articles if no video found).`;

  const raw = await callOpenRouter(
    ENRICHER_MODELS,
    ENRICHER_SYSTEM,
    userPrompt,
    3000, // plenty of headroom for batch output (up to 16 resources with summaries)
  );

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    console.error("[Enricher] Invalid JSON from model:", raw);
    throw new AIServiceError("Enricher returned non-JSON response");
  }

  const result = EnricherResponseSchema.safeParse(parsed);

  if (!result.success) {
    console.error("[Enricher] Schema mismatch:", result.error.flatten());
    throw new AIServiceError("Enricher returned invalid structure");
  }

  return result.data.resources;
}

// ─── Orchestrator ─────────────────────────────────────────────────────────────

export type NotebookBuildResult = {
  plan: PlanTopic[];
  // Ready to insert directly into `resources` table
  // position = topic_index * 10 (leaves gaps for future reordering)
  resources: Array<
    Omit<Resource, "topic_index"> & {
      status: "todo";
      position: number;
    }
  >;
};

export async function buildNotebook(
  topic: string,
  level: string,
  length: "short" | "medium" | "long",
): Promise<NotebookBuildResult> {
  const plan = await generateLearningPlan(topic, level, length);

  const searchData = await fetchResourcesForPlan(plan);

  const rawResources = await enrichResources(searchData);

  const resources = rawResources.map(({ topic_index, ...r }) => ({
    ...r,
    status: "todo" as const,
    position: topic_index * 10,
  }));

  return { plan, resources };
}
