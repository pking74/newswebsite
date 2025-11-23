import OpenAI from "openai";

const DEFAULT_MODEL = process.env.SMART_HEADLINES_MODEL || "gpt-4o-mini";

let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey });
  }
  return openaiClient;
}

/**
 * Heuristic fallback: derive a pseudo-summary from title/description/content
 * when no LLM is available or as a fallback when LLM fails.
 */
export function heuristicSummary(input: { title: string; description?: string; content?: string }): string {
  const base = input.description || input.content || input.title;
  const cleaned = base.replace(/\s+/g, " ").trim();
  if (cleaned.length <= 240) return cleaned;
  return cleaned.slice(0, 237).trimEnd() + "...";
}

/**
 * Summarize a news item using OpenAI LLM if available, with graceful fallback.
 * Returns a 1-2 sentence summary optimized for local news readers.
 */
export async function summarizeNewsItemWithLLM(params: {
  title: string;
  description?: string;
  content?: string;
  sourceName?: string;
}): Promise<string> {
  const client = getOpenAIClient();
  if (!client) {
    // Fallback: just heuristic
    return heuristicSummary(params);
  }

  const { title, description, content, sourceName } = params;
  const inputText = [
    `Title: ${title}`,
    description ? `Description: ${description}` : "",
    content ? `Content: ${content}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const prompt = `
You are helping summarize local and regional news for a community news website in Oneida County, New York.

Summarize the following news item in 1–2 sentences, focusing on what a local reader needs to know.
- Be factual and neutral.
- Do NOT add opinions.
- Do NOT exceed about 45 words.
- If the text is very short or incomplete, just rewrite it more clearly instead of inventing details.

Text:
${inputText}
  `.trim();

  try {
    const response = await client.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        { role: "system", content: "You write concise, factual news summaries." },
        { role: "user", content: prompt },
      ],
      temperature: 0.4,
      max_tokens: 120,
    });

    const summary = response.choices[0]?.message?.content?.trim();
    if (!summary) {
      return heuristicSummary(params);
    }
    return summary;
  } catch (error) {
    console.error("[summary] Error generating summary with OpenAI:", error);
    return heuristicSummary(params);
  }
}
