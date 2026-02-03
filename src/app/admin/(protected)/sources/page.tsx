import { prisma } from "@/lib/prisma";
import SourcesManager from "@/components/sources-manager";
import { PRESET_TAGS } from "@/lib/tag-presets";

export const dynamic = "force-dynamic";

export default async function SourcesPage() {
  const sources = await prisma.source.findMany({ orderBy: { name: "asc" } });
  const tagSet = new Set(PRESET_TAGS);
  sources.forEach((source) => source.tags.forEach((tag) => tagSet.add(tag)));

  return <SourcesManager sources={sources} initialTags={Array.from(tagSet)} />;
}
