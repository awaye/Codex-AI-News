import { prisma } from "@/lib/prisma";
import AdminNewsFilters from "@/components/admin-news-filters";
import AutoRefresh from "@/components/auto-refresh";
import IngestControls from "@/components/ingest-controls";
import NewsQueueItem from "@/components/news-queue-item";

export const dynamic = "force-dynamic";

const STATUS_OPTIONS = ["PENDING", "APPROVED", "REJECTED"] as const;
const SCOPE_OPTIONS = ["AFRICA", "GLOBAL"] as const;

export default async function NewsQueue({
  searchParams
}: {
  searchParams?: { status?: string; scope?: string; sourceId?: string };
}) {
  const status = STATUS_OPTIONS.includes(searchParams?.status as any)
    ? (searchParams?.status as (typeof STATUS_OPTIONS)[number])
    : "PENDING";
  const scope = SCOPE_OPTIONS.includes(searchParams?.scope as any)
    ? (searchParams?.scope as (typeof SCOPE_OPTIONS)[number])
    : undefined;
  const sourceIds = searchParams?.sourceId
    ? searchParams.sourceId.split(",").map((value) => value.trim()).filter(Boolean)
    : [];

  const sources = await prisma.source.findMany({ orderBy: { name: "asc" } });
  const lastLog = await prisma.ingestionLog.findFirst({ orderBy: { ranAt: "desc" } });
  const items = await prisma.newsItem.findMany({
    where: {
      status,
      ...(scope ? { scope } : {}),
      ...(sourceIds.length > 0 ? { sourceId: { in: sourceIds } } : {})
    },
    include: { source: true },
    orderBy: { publishedAt: "desc" },
    take: 200
  });

  return (
    <section className="flex flex-col gap-6">
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <AutoRefresh />
        <IngestControls lastRunIso={lastLog?.ranAt.toISOString()} intervalMs={30 * 60 * 1000} />
      </div>
      <AdminNewsFilters
        status={status}
        scope={scope}
        sourceIds={sourceIds}
        sources={sources.map((source) => ({ id: source.id, name: source.name, scope: source.scope }))}
      />

      <div className="flex flex-col gap-4">
        {items.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-black/20 bg-white/80 p-8 text-center text-black/60">
            No items in this queue.
          </div>
        ) : (
          items.map((item) => (
            <NewsQueueItem
              key={item.id}
              id={item.id}
              title={item.title}
              summary={item.summary}
              url={item.url}
              scope={item.scope}
              publishedLabel={item.publishedAt.toDateString()}
              sourceName={item.source.name}
              tags={item.tags}
              country={item.country}
            />
          ))
        )}
      </div>
    </section>
  );
}
