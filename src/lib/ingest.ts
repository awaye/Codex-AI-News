import Parser from "rss-parser";
import { prisma } from "@/lib/prisma";
import { normalizeText, parseTags, stripHtml, truncateText } from "@/lib/utils";
import { buildAiText, isAiRelated, isAfricaRelated } from "@/lib/ai-filter";

const parser = new Parser({
  timeout: 15000
});

function safeDate(input: string | null | undefined) {
  if (!input) {
    return new Date();
  }
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) {
    return new Date();
  }
  return date;
}

function mergeTags(sourceTags: string[], itemTags: string[]) {
  return Array.from(new Set([...sourceTags, ...itemTags].map((tag) => tag.trim()).filter(Boolean)));
}

export async function ingestSource(sourceId: string) {
  const source = await prisma.source.findUnique({ where: { id: sourceId } });
  if (!source || !source.active) {
    return { itemsFound: 0, itemsInserted: 0 };
  }

  const logBase = {
    sourceId: source.id,
    ranAt: new Date()
  };

  try {
    const feed = await parser.parseURL(source.feedUrl);
    const items = feed.items ?? [];

    let inserted = 0;

    for (const item of items) {
      const url = normalizeText(item.link ?? "");
      if (!url) {
        continue;
      }

      const title = normalizeText(item.title ?? "Untitled");
      const summaryRaw = normalizeText(stripHtml(item.contentSnippet ?? item.content ?? ""));
      const summary = summaryRaw ? truncateText(summaryRaw, 320) : "";
      const publishedAt = safeDate(item.isoDate ?? item.pubDate ?? feed.updated);
      const categories = Array.isArray(item.categories) ? item.categories : [];
      const tags = mergeTags(source.tags ?? [], categories);
      const aiText = buildAiText([title, summary, categories.join(" ")]);

      if (!isAiRelated(aiText)) {
        continue;
      }

      if (source.scope === "AFRICA" && !isAfricaRelated(aiText)) {
        continue;
      }

      const existingByUrl = await prisma.newsItem.findUnique({ where: { url } });
      if (existingByUrl) {
        continue;
      }

      const existingByTitle = await prisma.newsItem.findFirst({
        where: {
          title,
          publishedAt
        }
      });
      if (existingByTitle) {
        continue;
      }

      await prisma.newsItem.create({
        data: {
          title,
          summary: summary || null,
          url,
          publishedAt,
          tags,
          scope: source.scope,
          status: "PENDING",
          sourceId: source.id
        }
      });
      inserted += 1;
    }

    await prisma.ingestionLog.create({
      data: {
        ...logBase,
        status: "SUCCESS",
        itemsFound: items.length,
        itemsInserted: inserted
      }
    });

    return { itemsFound: items.length, itemsInserted: inserted };
  } catch (error) {
    await prisma.ingestionLog.create({
      data: {
        ...logBase,
        status: "ERROR",
        errorMessage: error instanceof Error ? error.message : "Unknown error"
      }
    });

    return { itemsFound: 0, itemsInserted: 0, error: true };
  }
}

export async function ingestAllSources() {
  const sources = await prisma.source.findMany({ where: { active: true } });
  const results = [] as Array<{ sourceId: string; itemsFound: number; itemsInserted: number }>;

  for (const source of sources) {
    const result = await ingestSource(source.id);
    results.push({
      sourceId: source.id,
      itemsFound: result.itemsFound,
      itemsInserted: result.itemsInserted
    });
  }

  return {
    sources: results,
    ranAt: new Date().toISOString()
  };
}
