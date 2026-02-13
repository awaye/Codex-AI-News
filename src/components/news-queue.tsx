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

export default function NewsQueue({ items: initialItems }: Props) {
  const router = useRouter();
  const [items, setItems] = useState<QueueItem[]>(initialItems);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkStatus, setBulkStatus] = useState<"idle" | "approve" | "reject" | "pending">("idle");

  const allSelected = useMemo(
    () => items.length > 0 && selectedIds.length === items.length,
    [items.length, selectedIds.length]
  );

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

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

  function handleRemove(id: string) {
    setItems((current) => current.filter((item) => item.id !== id));
    // If we run low on items, maybe refresh? For now, just let user manually refresh or load more
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

      // Optimistic update
      setItems((current) => current.filter((item) => !selectedIds.includes(item.id)));
      setSelectedIds([]);
      setBulkStatus("pending"); // Keep pending briefly to prevent double clicks? No, set to idle.

      await new Promise((resolve) => setTimeout(resolve, 280));
      setBulkStatus("idle");

      // Refresh in background to get new items
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
            disabled={selectedIds.length === 0 || bulkStatus === "pending" || bulkStatus === "approve" || bulkStatus === "reject"}
            className="rounded-full border border-emerald-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700 transition hover:bg-emerald-50 disabled:opacity-50"
          >
            {bulkStatus === "approve" ? "Approving..." : "Approve selected"}
          </button>
          <button
            type="button"
            onClick={() => handleBulk("REJECT")}
            disabled={selectedIds.length === 0 || bulkStatus === "pending" || bulkStatus === "approve" || bulkStatus === "reject"}
            className="rounded-full border border-red-400 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-red-600 transition hover:bg-red-50 disabled:opacity-50"
          >
            {bulkStatus === "reject" ? "Rejecting..." : "Reject selected"}
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
            onRemove={handleRemove}
            shouldRefresh={false}
          />
        ))
      )}
    </div>
  );
}
