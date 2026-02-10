"use client";

import { useMemo, useState } from "react";
import SourceRow from "@/components/source-row";

export type SourceData = {
  id: string;
  name: string;
  feedUrl: string;
  type: "RSS" | "GOOGLE_NEWS";
  query?: string | null;
  scope: "AFRICA" | "GLOBAL";
  tags: string[];
  active: boolean;
};

type Props = {
  sources: SourceData[];
  initialTags: string[];
};

export default function SourcesManager({ sources, initialTags }: Props) {
  const [scopeFilter, setScopeFilter] = useState<"" | "AFRICA" | "GLOBAL">("");
  const [tagFilters, setTagFilters] = useState<string[]>([]);
  const [tagOptions, setTagOptions] = useState<string[]>(initialTags);
  const [newTag, setNewTag] = useState("");
  const [newSourceTags, setNewSourceTags] = useState<string[]>([]);
  const [newSourceType, setNewSourceType] = useState<"RSS" | "GOOGLE_NEWS">("RSS");

  const filteredSources = useMemo(() => {
    return sources.filter((source) => {
      if (scopeFilter && source.scope !== scopeFilter) {
        return false;
      }
      if (tagFilters.length === 0) {
        return true;
      }
      return tagFilters.some((tag) => source.tags.includes(tag));
    });
  }, [sources, scopeFilter, tagFilters]);

  const sortedTags = useMemo(() => Array.from(new Set(tagOptions)).sort(), [tagOptions]);

  const handleAddTag = () => {
    const trimmed = newTag.trim();
    if (!trimmed) {
      return;
    }
    setTagOptions((current) => Array.from(new Set([...current, trimmed])));
    setNewTag("");
  };

  return (
    <section className="flex flex-col gap-6">
      <div className="rounded-3xl border border-black/10 bg-white/80 p-5 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold" style={{ fontFamily: "var(--font-serif)" }}>
              Add new source
            </h2>
            <p className="text-sm text-black/60">Keep this list focused on AI policy, education, and governance.</p>
          </div>
        </div>
        <form className="mt-5 grid gap-4" action="/api/admin/sources" method="post">
          <div className="grid gap-4 lg:grid-cols-4">
            <label className="flex flex-col gap-1 text-xs">
              <span className="text-black/60">Name</span>
              <input name="name" required className="h-9 rounded-xl border border-black/10 px-3 text-sm" />
            </label>
            <label className="flex flex-col gap-1 text-xs">
              <span className="text-black/60">Type</span>
              <select
                name="type"
                value={newSourceType}
                onChange={(event) => setNewSourceType(event.target.value as "RSS" | "GOOGLE_NEWS")}
                className="h-9 rounded-xl border border-black/10 px-3 text-sm pr-8"
              >
                <option value="RSS">RSS feed</option>
                <option value="GOOGLE_NEWS">Google News alert</option>
              </select>
            </label>
            {newSourceType === "RSS" ? (
              <label className="flex flex-col gap-1 text-xs lg:col-span-2">
                <span className="text-black/60">Feed URL</span>
                <input name="feedUrl" required className="h-9 rounded-xl border border-black/10 px-3 text-sm" />
              </label>
            ) : (
              <label className="flex flex-col gap-1 text-xs lg:col-span-2">
                <span className="text-black/60">Alert query</span>
                <input
                  name="query"
                  required
                  placeholder="e.g. AI education OR AI curriculum"
                  className="h-9 rounded-xl border border-black/10 px-3 text-sm"
                />
              </label>
            )}
            <label className="flex flex-col gap-1 text-xs">
              <span className="text-black/60">Scope</span>
              <select name="scope" className="h-9 rounded-xl border border-black/10 px-3 text-sm pr-8">
                <option value="AFRICA">Africa</option>
                <option value="GLOBAL">Global</option>
              </select>
            </label>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <label className="flex items-center gap-2 text-xs">
              <input name="active" type="checkbox" defaultChecked className="h-4 w-4 accent-ink" />
              Active
            </label>
            <button className="h-9 rounded-xl bg-ink px-5 text-sm font-semibold text-sand" type="submit">
              Add
            </button>
          </div>

          <div className="flex flex-col gap-2 text-xs">
            <span className="text-black/60">Tags</span>
            <div className="flex max-h-32 flex-wrap gap-2 overflow-auto rounded-xl border border-black/10 p-3">
              {sortedTags.map((tag) => {
                const active = newSourceTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    aria-pressed={active}
                    onClick={() => {
                      setNewSourceTags((current) =>
                        active ? current.filter((item) => item !== tag) : Array.from(new Set([...current, tag]))
                      );
                    }}
                    className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs transition ${
                      active
                        ? "border-ink bg-ink text-sand"
                        : "border-black/10 text-black/70 hover:border-black/30"
                    }`}
                  >
                    {active ? <span className="text-[10px] uppercase">on</span> : null}
                    {tag}
                  </button>
                );
              })}
              <div className="ml-auto flex flex-wrap items-center gap-2">
                <input
                  value={newTag}
                  onChange={(event) => setNewTag(event.target.value)}
                  placeholder="New tag"
                  className="h-8 rounded-full border border-black/10 px-3 text-xs"
                />
                <button type="button" onClick={handleAddTag} className="h-8 rounded-full border border-black/20 px-3 text-xs">
                  Add
                </button>
              </div>
            </div>
            <input type="hidden" name="tags" value={newSourceTags.join(", ")} />
          </div>
        </form>
      </div>

      <div className="rounded-3xl border border-black/10 bg-white/80 p-5 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold">Filter sources</h3>
            <p className="text-xs text-black/50">Filter by scope or tags to keep things organized.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <select
              value={scopeFilter}
              onChange={(event) => setScopeFilter(event.target.value as "" | "AFRICA" | "GLOBAL")}
              className="h-9 rounded-xl border border-black/10 px-3 text-sm pr-8"
            >
              <option value="">All scopes</option>
              <option value="AFRICA">Africa</option>
              <option value="GLOBAL">Global</option>
            </select>
            <button
              type="button"
              onClick={() => {
                setScopeFilter("");
                setTagFilters([]);
              }}
              className="h-9 rounded-xl border border-black/10 px-3 text-sm"
            >
              Reset
            </button>
          </div>
        </div>
        <div className="mt-4 flex max-h-32 flex-wrap gap-2 overflow-auto">
          {sortedTags.map((tag) => {
            const active = tagFilters.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  setTagFilters((current) =>
                    active ? current.filter((item) => item !== tag) : Array.from(new Set([...current, tag]))
                  );
                }}
                className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs transition ${
                  active ? "border-ink bg-ink text-sand" : "border-black/10 text-black/70 hover:border-black/30"
                }`}
              >
                {active ? <span className="text-[10px] uppercase">on</span> : null}
                {tag}
              </button>
            );
          })}
          {sortedTags.length === 0 ? <span className="text-sm text-black/50">No tags yet</span> : null}
        </div>
      </div>

      <div className="rounded-3xl border border-black/10 bg-white/80 p-5 shadow-soft">
        <div className="grid gap-3">
          {filteredSources.map((source) => (
            <SourceRow key={source.id} source={source} tagOptions={tagOptions} onAddTag={(tag) => setTagOptions((current) => Array.from(new Set([...current, tag])))} />
          ))}
          {filteredSources.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-black/10 bg-white/60 p-6 text-center text-sm text-black/50">
              No sources match these filters.
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
