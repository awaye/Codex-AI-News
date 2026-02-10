"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import NewsQueueItem from "@/components/news-queue-item";

type QueueItem = {
  id: string;
  title: string;
  summary?: string | null;
  url: string;
  scope: string;
  publishedLabel: string;
  sourceName: string;
  tags: string[];
  categories: string[];
  country?: string | null;
};

type Props = {
  items: QueueItem[];
};

export default function NewsQueue({ items }: Props) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkStatus, setBulkStatus] = useState<"idle" | "approve" | "reject" | "pending">("idle");

  const allSelected = useMemo(
    () => items.length > 0 && selectedIds.length === items.length,
    [items.length, selectedIds.length]
  );

  useEffect(() => {
    const allowed = new Set(items.map((item) => item.id));
    setSelectedIds((current) => current.filter((id) => allowed.has(id)));
  }, [items]);

  function toggleSelection(id: string, checked: boolean) {
    setSelectedIds((current) => (checked ? Array.from(new Set([...current, id])) : current.filter((item) => item !== id)));
  }

  function toggleAll(checked: boolean) {
    setSelectedIds(checked ? items.map((item) => item.id) : []);
  }

  async function handleBulk(action: "APPROVE" | "REJECT") {
    if (bulkStatus === "pending" || selectedIds.length === 0) {
      return;
    }
    setBulkStatus(action === "APPROVE" ? "approve" : "reject");
    try {
      await fetch("/api/admin/news/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ids: selectedIds })
      });
      setBulkStatus("pending");
      setSelectedIds([]);
      await new Promise((resolve) => setTimeout(resolve, 280));
      router.refresh();
    } catch (error) {
      console.error(error);
      setBulkStatus("idle");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-black/10 bg-white/80 px-4 py-3 text-sm shadow-soft">
        <label className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-black/50">
          <input type="checkbox" checked={allSelected} onChange={(event) => toggleAll(event.target.checked)} />
          Select all ({selectedIds.length})
        </label>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handleBulk("APPROVE")}
            disabled={selectedIds.length === 0 || bulkStatus === "pending"}
            className="rounded-full border border-emerald-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700 transition hover:bg-emerald-50 disabled:opacity-50"
          >
            Approve selected
          </button>
          <button
            type="button"
            onClick={() => handleBulk("REJECT")}
            disabled={selectedIds.length === 0 || bulkStatus === "pending"}
            className="rounded-full border border-red-400 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-red-600 transition hover:bg-red-50 disabled:opacity-50"
          >
            Reject selected
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-black/20 bg-white/80 p-8 text-center text-black/60">
          No items in this queue.
        </div>
      ) : (
        items.map((item) => (
          <NewsQueueItem
            key={item.id}
            {...item}
            selected={selectedIds.includes(item.id)}
            onSelect={(checked) => toggleSelection(item.id, checked)}
          />
        ))
      )}
    </div>
  );
}
