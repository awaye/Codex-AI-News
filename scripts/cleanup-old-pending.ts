import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - 3);

  const result = await prisma.newsItem.updateMany({
    where: {
      status: "PENDING",
      publishedAt: { lt: cutoff }
    },
    data: {
      status: "REJECTED"
    }
  });

  console.log(`Rejected ${result.count} pending items older than ${cutoff.toISOString()}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
