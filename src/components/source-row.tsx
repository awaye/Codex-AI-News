"use client";

import { useEffect, useMemo, useState } from "react";

type Source = {
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
  source: Source;
  tagOptions: string[];
  onAddTag: (tag: string) => void;
};

export default function SourceRow({ source, tagOptions, onAddTag }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>(source.tags);
  const [newTag, setNewTag] = useState("");
  const [selectedType, setSelectedType] = useState<"RSS" | "GOOGLE_NEWS">(source.type);
  const [query, setQuery] = useState(source.query ?? "");

  useEffect(() => {
    setSelectedTags(source.tags);
    setSelectedType(source.type);
    setQuery(source.query ?? "");
  }, [source.tags, source.type, source.query]);

  const sortedTags = useMemo(() => {
    return Array.from(new Set(tagOptions)).sort();
  }, [tagOptions]);

  const handleTagToggle = (tag: string, checked: boolean) => {
    setSelectedTags((current) => {
      if (checked) {
        return Array.from(new Set([...current, tag]));
      }
      return current.filter((item) => item !== tag);
    });
  };

  const handleAddTag = () => {
    const trimmed = newTag.trim();
    if (!trimmed) {
      return;
    }
    onAddTag(trimmed);
    setSelectedTags((current) => Array.from(new Set([...current, trimmed])));
    setNewTag("");
  };

  if (!isEditing) {
    return (
      <div className="grid gap-4 border-b border-black/5 pb-3 text-sm last:border-b-0 last:pb-0 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,2.2fr)_minmax(0,0.7fr)_minmax(0,0.7fr)_minmax(0,1.2fr)_auto]">
        <div className="flex min-w-0 flex-col">
          <span className="text-xs uppercase text-black/40">Name</span>
          <span className="font-medium text-black/80">{source.name}</span>
        </div>
        <div className="flex min-w-0 flex-col">
          <span className="text-xs uppercase text-black/40">{source.type === "GOOGLE_NEWS" ? "Alert query" : "Feed URL"}</span>
          <span className="truncate text-black/60" title={source.type === "GOOGLE_NEWS" ? source.query ?? "—" : source.feedUrl}>
            {source.type === "GOOGLE_NEWS" ? source.query ?? "—" : source.feedUrl}
          </span>
        </div>
        <div className="flex min-w-0 flex-col">
          <span className="text-xs uppercase text-black/40">Type</span>
          <span className="font-medium text-black/70">{source.type === "GOOGLE_NEWS" ? "Google News" : "RSS"}</span>
        </div>
        <div className="flex min-w-0 flex-col">
          <span className="text-xs uppercase text-black/40">Scope</span>
          <span className="font-medium text-black/70">{source.scope}</span>
        </div>
        <div className="flex min-w-0 flex-col">
          <span className="text-xs uppercase text-black/40">Tags</span>
          <span
            className="truncate text-black/60"
            title={source.tags.length > 0 ? source.tags.join(", ") : "—"}
          >
            {source.tags.length > 0 ? source.tags.join(", ") : "—"}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`rounded-full border px-3 py-1 text-xs ${
              source.active ? "border-emerald-500 text-emerald-700" : "border-black/20 text-black/40"
            }`}
          >
            {source.active ? "Active" : "Paused"}
          </span>
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="rounded-full border border-black/20 px-4 py-2 text-sm"
          >
            Edit
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className="grid gap-4 border-b border-black/5 pb-3 text-sm last:border-b-0 last:pb-0" action={`/api/admin/sources/${source.id}`} method="post">
      <div className="grid gap-4 lg:grid-cols-3">
        <label className="flex flex-col gap-1 text-xs">
          <span className="text-black/60">Name</span>
          <input
            name="name"
            defaultValue={source.name}
            required
            className="h-9 rounded-xl border border-black/10 px-3 text-sm"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs">
          <span className="text-black/60">Type</span>
          <select
            name="type"
            value={selectedType}
            onChange={(event) => setSelectedType(event.target.value as "RSS" | "GOOGLE_NEWS")}
            className="h-9 rounded-xl border border-black/10 px-3 text-sm pr-8"
          >
            <option value="RSS">RSS feed</option>
            <option value="GOOGLE_NEWS">Google News alert</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs">
          <span className="text-black/60">Scope</span>
          <select
            name="scope"
            defaultValue={source.scope}
            className="h-9 rounded-xl border border-black/10 px-3 text-sm pr-8"
          >
            <option value="AFRICA">Africa</option>
            <option value="GLOBAL">Global</option>
          </select>
        </label>
      </div>

      {selectedType === "RSS" ? (
        <label className="flex flex-col gap-1 text-xs">
          <span className="text-black/60">Feed URL</span>
          <input
            name="feedUrl"
            defaultValue={source.feedUrl}
            required
            className="h-9 rounded-xl border border-black/10 px-3 text-sm"
          />
        </label>
      ) : (
        <label className="flex flex-col gap-1 text-xs">
          <span className="text-black/60">Alert query</span>
          <input
            name="query"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            required
            className="h-9 rounded-xl border border-black/10 px-3 text-sm"
          />
        </label>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-xs">
          <input name="active" type="checkbox" defaultChecked={source.active} className="h-4 w-4 accent-ink" />
          Active
        </label>
        <button className="h-9 rounded-xl border border-black/20 px-4 text-sm" type="submit">
          Save
        </button>
        <button
          type="button"
          className="h-9 rounded-xl border border-black/10 px-4 text-sm"
          onClick={() => setIsEditing(false)}
        >
          Cancel
        </button>
      </div>

      <div className="flex flex-col gap-2 text-xs">
        <span className="text-black/60">Tags</span>
        <div className="flex max-h-32 flex-wrap gap-2 overflow-auto rounded-xl border border-black/10 p-3">
          {sortedTags.map((tag) => {
            const active = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                aria-pressed={active}
                onClick={() => handleTagToggle(tag, !active)}
                className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs transition ${
                  active ? "border-ink bg-ink text-sand" : "border-black/10 text-black/70 hover:border-black/30"
                }`}
              >
                {active ? <span className="text-[10px] uppercase">on</span> : null}
                {tag}
              </button>
            );
          })}
          {sortedTags.length === 0 ? <span className="text-black/40">No tags yet</span> : null}
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
        <input type="hidden" name="tags" value={selectedTags.join(", ")} />
      </div>
    </form>
  );
}
