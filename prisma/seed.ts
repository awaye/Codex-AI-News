import { PrismaClient, SourceScope } from "@prisma/client";
import { hashPassword } from "../src/lib/password";
import fs from "node:fs";

const prisma = new PrismaClient();

type SeedSource = {
  name: string;
  feedUrl: string;
  scope: "AFRICA" | "GLOBAL";
  tags?: string[];
};

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set to seed an admin user.");
  }

  const passwordHash = await hashPassword(password);

  await prisma.user.upsert({
    where: { email },
    update: { passwordHash, role: "ADMIN" },
    create: {
      email,
      passwordHash,
      role: "ADMIN"
    }
  });
}

function loadSeedSources(): SeedSource[] {
  const filePath = process.env.SEED_SOURCES_PATH;
  if (!filePath) {
    return [];
  }

  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = JSON.parse(raw) as SeedSource[];
  return parsed;
}

async function seedSources() {
  const sources = loadSeedSources();
  if (sources.length === 0) {
    return;
  }

  for (const source of sources) {
    await prisma.source.upsert({
      where: { feedUrl: source.feedUrl },
      update: {
        name: source.name,
        scope: source.scope as SourceScope,
        tags: source.tags ?? []
      },
      create: {
        name: source.name,
        feedUrl: source.feedUrl,
        scope: source.scope as SourceScope,
        tags: source.tags ?? []
      }
    });
  }
}

async function main() {
  await seedAdmin();
  await seedSources();
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
