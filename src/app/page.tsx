import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const TAB_LABELS = {
  africa: "Africa AI News",
  global: "Global AI News"
};

export default async function Home({
  searchParams
}: {
  searchParams?: { tab?: string; q?: string };
}) {
  const tab = searchParams?.tab === "global" ? "global" : "africa";
  const scope = tab === "global" ? "GLOBAL" : "AFRICA";
  const query = searchParams?.q?.trim();

  const items = await prisma.newsItem.findMany({
    where: {
      status: "APPROVED",
      scope,
      ...(query
        ? {
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { summary: { contains: query, mode: "insensitive" } },
              { source: { name: { contains: query, mode: "insensitive" } } }
            ]
          }
        : {})
    },
    include: {
      source: true
    },
    orderBy: {
      publishedAt: "desc"
    },
    take: 100
  });

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-12">
        <header className="flex flex-col gap-6 rounded-3xl border border-black/10 bg-white/70 p-8 shadow-soft backdrop-blur">
          <div className="flex flex-col gap-3">
            <p className="text-xs uppercase tracking-[0.2em] text-ember">AI Signal Desk</p>
            <h1 className="text-4xl font-semibold leading-tight text-ink sm:text-5xl" style={{ fontFamily: "var(--font-serif)" }}>
              Curated, human-approved AI news for Africa and the world.
            </h1>
          </div>
          <p className="max-w-2xl text-base text-black/70">
            Every story is reviewed before it lands here. Switch between the Africa and Global
            desks to track the most meaningful advances in artificial intelligence.
          </p>
          <div className="flex flex-wrap gap-3">
            {Object.entries(TAB_LABELS).map(([key, label]) => {
              const isActive = tab === key;
              return (
                <Link
                  key={key}
                  href={key === "africa" ? "/" : `/?tab=${key}`}
                  className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-ink text-sand"
                      : "border border-black/15 bg-white/70 text-black/70 hover:border-black/30"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </header>

        <section className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-serif)" }}>
                {TAB_LABELS[tab as keyof typeof TAB_LABELS]}
              </h2>
              <p className="text-sm text-black/60">{items.length} stories</p>
            </div>
            <form className="flex w-full max-w-sm items-center gap-2" method="get">
              <input type="hidden" name="tab" value={tab} />
              <input
                name="q"
                defaultValue={query ?? ""}
                placeholder="Search AI news..."
                className="flex-1 rounded-full border border-black/10 bg-white/90 px-4 py-2 text-sm"
              />
              <button className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-sand" type="submit">
                Search
              </button>
            </form>
          </div>

          <div className="grid gap-4">
            {items.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-black/20 bg-white/70 p-10 text-center text-black/60">
                No approved stories yet. Check back soon.
              </div>
            ) : (
              items.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl border border-black/10 bg-white/80 p-6 shadow-soft"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.18em] text-black/50">
                      <span>{item.source.name}</span>
                      <span>•</span>
                      <span>{item.publishedAt.toDateString()}</span>
                      {item.country ? (
                        <>
                          <span>•</span>
                          <span>{item.country}</span>
                        </>
                      ) : null}
                    </div>
                    <h3 className="text-xl font-semibold text-ink">{item.title}</h3>
                    {item.summary ? (
                      <p className="text-sm text-black/70">{item.summary}</p>
                    ) : null}
                    <div className="flex flex-wrap items-center gap-2">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-black/10 bg-sand px-3 py-1 text-xs text-black/70"
                        >
                          {tag}
                        </span>
                      ))}
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="ml-auto text-sm font-medium text-tide hover:underline"
                      >
                        Read source
                      </a>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        <footer className="border-t border-black/10 pt-6 text-xs uppercase tracking-[0.2em] text-black/40">
          Updated hourly · Human curated
        </footer>
      </div>
    </main>
  );
}
