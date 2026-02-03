import { PrismaClient } from "@prisma/client";
import { buildAiText, isAfricaRelated } from "../src/lib/ai-filter";
import { normalizeText, stripHtml } from "../src/lib/utils";

const prisma = new PrismaClient();

async function main() {
  const items = await prisma.newsItem.findMany({
    where: { source: { scope: "AFRICA" } },
    select: {
      id: true,
      title: true,
      summary: true,
      tags: true
    }
  });

  const nonAfricaIds: string[] = [];

  for (const item of items) {
    const text = buildAiText([
      normalizeText(item.title),
      normalizeText(stripHtml(item.summary ?? "")),
      item.tags.join(" ")
    ]);

    if (!isAfricaRelated(text)) {
      nonAfricaIds.push(item.id);
    }
  }

  if (nonAfricaIds.length > 0) {
    await prisma.newsItem.deleteMany({
      where: { id: { in: nonAfricaIds } }
    });
  }

  console.log(JSON.stringify({ removed: nonAfricaIds.length, total: items.length }, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
