import { PrismaClient } from "@prisma/client";
import { buildAiText, isAiRelated } from "../src/lib/ai-filter";
import { stripHtml, normalizeText } from "../src/lib/utils";

const prisma = new PrismaClient();

async function main() {
  const items = await prisma.newsItem.findMany({
    select: {
      id: true,
      title: true,
      summary: true,
      tags: true
    }
  });

  const nonAiIds: string[] = [];

  for (const item of items) {
    const text = buildAiText([
      normalizeText(item.title),
      normalizeText(stripHtml(item.summary ?? "")),
      item.tags.join(" ")
    ]);

    if (!isAiRelated(text)) {
      nonAiIds.push(item.id);
    }
  }

  if (nonAiIds.length > 0) {
    await prisma.newsItem.deleteMany({
      where: { id: { in: nonAiIds } }
    });
  }

  console.log(JSON.stringify({ removed: nonAiIds.length, total: items.length }, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
