"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const STATUS_OPTIONS = ["PENDING", "APPROVED", "REJECTED"] as const;
const SCOPE_OPTIONS = ["AFRICA", "GLOBAL"] as const;

type SourceOption = {
  id: string;
  name: string;
  scope: "AFRICA" | "GLOBAL";
};

type Props = {
  status: string;
  scope?: string;
  sourceIds: string[];
  sources: SourceOption[];
};

export default function AdminNewsFilters({ status, scope, sourceIds, sources }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedStatus, setSelectedStatus] = useState(status);
  const [selectedScope, setSelectedScope] = useState(scope ?? "");
  const [selectedSources, setSelectedSources] = useState(sourceIds);

  const availableSources = useMemo(() => {
    if (!selectedScope) {
      return sources;
    }
    return sources.filter((source) => source.scope === selectedScope);
  }, [selectedScope, sources]);

  useEffect(() => {
    setSelectedStatus(status);
    setSelectedScope(scope ?? "");
    setSelectedSources(sourceIds);
  }, [status, scope, sourceIds.join(",")]);

  useEffect(() => {
    if (!selectedScope) {
      return;
    }
    const allowed = new Set(availableSources.map((source) => source.id));
    const filtered = selectedSources.filter((id) => allowed.has(id));
    if (filtered.length !== selectedSources.length) {
      setSelectedSources(filtered);
    }
  }, [availableSources, selectedScope, selectedSources]);

  function updateUrl(next: { status: string; scope: string; sourceIds: string[] }) {
    const params = new URLSearchParams();
    params.set("status", next.status);
    if (next.scope) {
      params.set("scope", next.scope);
    }
    if (next.sourceIds.length > 0) {
      params.set("sourceId", next.sourceIds.join(","));
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  }

  function handleStatusChange(value: string) {
    setSelectedStatus(value);
    updateUrl({ status: value, scope: selectedScope, sourceIds: selectedSources });
  }

  function handleScopeChange(value: string) {
    setSelectedScope(value);
    const filtered = value
      ? selectedSources.filter((id) => sources.find((source) => source.id === id)?.scope === value)
      : selectedSources;
    setSelectedSources(filtered);
    updateUrl({ status: selectedStatus, scope: value, sourceIds: filtered });
  }

  function handleSourcesChange(values: string[]) {
    setSelectedSources(values);
    updateUrl({ status: selectedStatus, scope: selectedScope, sourceIds: values });
  }

  function handleReset() {
    setSelectedStatus("PENDING");
    setSelectedScope("");
    setSelectedSources([]);
    updateUrl({ status: "PENDING", scope: "", sourceIds: [] });
  }

  return (
    <div className="rounded-3xl border border-black/10 bg-white/80 p-6 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold" style={{ fontFamily: "var(--font-serif)" }}>
            Filter queue
          </h2>
          <p className="text-sm text-black/60">Filters update instantly as you select options.</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm">
            Status
          <select
            name="status"
            value={selectedStatus}
            onChange={(event) => handleStatusChange(event.target.value)}
            className="rounded-xl border border-black/10 px-3 py-2 pr-10"
          >
              {STATUS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2 text-sm">
            Scope
          <select
            name="scope"
            value={selectedScope}
            onChange={(event) => handleScopeChange(event.target.value)}
            className="rounded-xl border border-black/10 px-3 py-2 pr-10"
          >
              <option value="">All</option>
              {SCOPE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="flex items-end gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="h-10 rounded-xl border border-black/10 px-4 text-sm"
          >
            Reset filters
          </button>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-black/10 bg-white/70 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-ink">Sources</p>
            <p className="text-xs text-black/50">Check multiple sources to filter the queue.</p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleSourcesChange(availableSources.map((source) => source.id))}
              className="rounded-full border border-black/10 px-3 py-1 hover:border-black/30"
            >
              Select all
            </button>
            <button
              type="button"
              onClick={() => handleSourcesChange([])}
              className="rounded-full border border-black/10 px-3 py-1 hover:border-black/30"
            >
              Clear
            </button>
          </div>
        </div>
        <div className="mt-4 grid max-h-44 gap-2 overflow-auto pr-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
          {availableSources.map((source) => {
            const checked = selectedSources.includes(source.id);
            return (
              <label key={source.id} className="flex items-center gap-2 rounded-full border border-black/10 px-3 py-2">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(event) => {
                    const next = event.target.checked
                      ? [...selectedSources, source.id]
                      : selectedSources.filter((id) => id !== source.id);
                    handleSourcesChange(next);
                  }}
                />
                <span className="text-black/70">{source.name}</span>
              </label>
            );
          })}
          {availableSources.length === 0 ? (
            <div className="text-sm text-black/50">No sources for this scope.</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
