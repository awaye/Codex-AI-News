"use client";

import { useEffect, useMemo, useState } from "react";

type Source = {
  id: string;
  name: string;
  feedUrl: string;
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

  useEffect(() => {
    setSelectedTags(source.tags);
  }, [source.tags]);

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
      <div className="grid gap-4 border-b border-black/5 pb-3 text-sm last:border-b-0 last:pb-0 lg:grid-cols-[1.1fr_2.2fr_0.7fr_1.2fr_auto]">
        <div className="flex flex-col">
          <span className="text-xs uppercase text-black/40">Name</span>
          <span className="font-medium text-black/80">{source.name}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs uppercase text-black/40">Feed URL</span>
          <span className="truncate text-black/60" title={source.feedUrl}>
            {source.feedUrl}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs uppercase text-black/40">Scope</span>
          <span className="font-medium text-black/70">{source.scope}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs uppercase text-black/40">Tags</span>
          <span className="text-black/60">{source.tags.length > 0 ? source.tags.join(", ") : "—"}</span>
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
    <form
      className="grid gap-4 border-b border-black/5 pb-3 text-sm last:border-b-0 last:pb-0 lg:grid-cols-[1.1fr_2.2fr_0.7fr_1.2fr_auto]"
      action={`/api/admin/sources/${source.id}`}
      method="post"
    >
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
        <span className="text-black/60">Feed URL</span>
        <input
          name="feedUrl"
          defaultValue={source.feedUrl}
          required
          className="h-9 rounded-xl border border-black/10 px-3 text-sm"
        />
      </label>
      <label className="flex flex-col gap-1 text-xs">
        <span className="text-black/60">Scope</span>
        <select name="scope" defaultValue={source.scope} className="h-9 rounded-xl border border-black/10 px-3 text-sm pr-8">
          <option value="AFRICA">Africa</option>
          <option value="GLOBAL">Global</option>
        </select>
      </label>
      <div className="flex flex-col gap-2 text-xs">
        <span className="text-black/60">Tags</span>
        <div className="grid max-h-28 gap-2 overflow-auto rounded-xl border border-black/10 p-2 sm:grid-cols-2 lg:grid-cols-3">
          {sortedTags.map((tag) => (
            <label key={tag} className="flex items-center gap-2 rounded-full border border-black/10 px-3 py-1 text-xs">
              <input
                type="checkbox"
                checked={selectedTags.includes(tag)}
                onChange={(event) => handleTagToggle(tag, event.target.checked)}
              />
              <span className="text-black/70">{tag}</span>
            </label>
          ))}
          {sortedTags.length === 0 ? <span className="text-black/40">No tags yet</span> : null}
        </div>
        <div className="flex items-center gap-2">
          <input
            value={newTag}
            onChange={(event) => setNewTag(event.target.value)}
            placeholder="New tag"
            className="h-8 flex-1 rounded-xl border border-black/10 px-2 text-xs"
          />
          <button type="button" onClick={handleAddTag} className="h-8 rounded-xl border border-black/20 px-3 text-xs">
            Add
          </button>
        </div>
        <input type="hidden" name="tags" value={selectedTags.join(", ")} />
      </div>
      <div className="flex items-center gap-3">
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
    </form>
  );
}
