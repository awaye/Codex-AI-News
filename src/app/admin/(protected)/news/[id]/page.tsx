import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatTags } from "@/lib/utils";
import ApproveRejectButtons from "@/components/approve-reject";
import { CATEGORY_OPTIONS } from "@/lib/category-rules";

export const dynamic = "force-dynamic";

export default async function NewsEdit({ params }: { params: { id: string } }) {
  const item = await prisma.newsItem.findUnique({
    where: { id: params.id },
    include: { source: true }
  });

  if (!item) {
    return (
      <div className="rounded-3xl border border-dashed border-black/20 bg-white/80 p-8 text-center text-black/60">
        Item not found.
      </div>
    );
  }

  const itemCategories = Array.isArray((item as any).categories)
    ? ((item as any).categories as string[])
    : [];

  return (
    <section className="rounded-3xl border border-black/10 bg-white/80 p-8 shadow-soft">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-black/50">{item.source.name}</p>
            <h2 className="text-2xl font-semibold text-ink" style={{ fontFamily: "var(--font-serif)" }}>
              {item.title}
            </h2>
          </div>
          <Link
            className="rounded-full border border-black/10 px-4 py-2 text-sm whitespace-nowrap transition hover:border-black/30 hover:bg-ink/5"
            href="/admin/news"
          >
            Back to queue
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.18em] text-black/50">
          <span>{item.scope}</span>
          <span>•</span>
          <span>{item.status}</span>
          <span>•</span>
          <span>{item.publishedAt.toDateString()}</span>
        </div>

        <form className="flex flex-col gap-4" action={`/api/admin/news/${item.id}`} method="post">
          <div className="flex flex-col gap-2 text-sm">
            <span className="text-sm font-medium">Categories</span>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-2 rounded-full border border-black/10 px-3 py-1 text-xs"
                >
                  <input
                    type="checkbox"
                    name="categories"
                    value={option.value}
                    defaultChecked={itemCategories.includes(option.value)}
                  />
                  <span className="text-black/70">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
          <label className="flex flex-col gap-2 text-sm">
            Summary
            <textarea
              name="summary"
              defaultValue={item.summary ?? ""}
              rows={4}
              className="rounded-xl border border-black/10 px-3 py-2"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            Tags (comma separated)
            <input
              name="tags"
              defaultValue={formatTags(item.tags)}
              className="rounded-xl border border-black/10 px-3 py-2"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            Country
            <input
              name="country"
              defaultValue={item.country ?? ""}
              className="rounded-xl border border-black/10 px-3 py-2"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            Scope
            <select
              name="scope"
              defaultValue={item.scope}
              className="rounded-xl border border-black/10 px-3 py-2"
            >
              <option value="AFRICA">Africa</option>
              <option value="GLOBAL">Global</option>
            </select>
          </label>
          <button className="rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-sand" type="submit">
            Save changes
          </button>
        </form>

        <ApproveRejectButtons id={item.id} />

        <a
          className="inline-flex w-fit rounded-full border border-black/10 px-4 py-2 text-sm text-black/70 hover:border-black/30"
          href={item.url}
          target="_blank"
          rel="noreferrer"
        >
          View original source
        </a>
      </div>
    </section>
  );
}
