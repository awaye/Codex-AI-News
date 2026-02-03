import { PrismaClient } from "@prisma/client";
import { truncateText, normalizeText } from "../src/lib/utils";

const prisma = new PrismaClient();

async function main() {
  const items = await prisma.newsItem.findMany({
    select: { id: true, summary: true }
  });

  let updated = 0;

  for (const item of items) {
    if (!item.summary) {
      continue;
    }

    const normalized = normalizeText(item.summary);
    const trimmed = truncateText(normalized, 320);
    if (trimmed !== item.summary) {
      await prisma.newsItem.update({
        where: { id: item.id },
        data: { summary: trimmed }
      });
      updated += 1;
    }
  }

  console.log(JSON.stringify({ updated, total: items.length }, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
