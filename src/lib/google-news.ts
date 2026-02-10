const AI_QUERY_TERMS = [
  "\"artificial intelligence\"",
  "\"machine learning\"",
  "\"deep learning\"",
  "\"large language model\"",
  "LLM",
  "AI",
  "ChatGPT",
  "GPT",
  "Claude",
  "Gemini",
  "OpenAI",
  "DeepMind",
  "Anthropic"
].join(" OR ");

export function buildGoogleNewsQuery(query: string) {
  const trimmed = query.trim();
  if (!trimmed) {
    return "";
  }
  return `(${trimmed}) AND (${AI_QUERY_TERMS})`;
}

export function buildGoogleNewsUrl(query: string) {
  const encoded = encodeURIComponent(query);
  return `https://news.google.com/rss/search?q=${encoded}&hl=en&gl=US&ceid=US:en`;
}
