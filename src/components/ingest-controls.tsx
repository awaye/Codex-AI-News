"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

function formatDuration(ms: number) {
  const totalSeconds = Math.max(Math.floor(ms / 1000), 0);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${seconds}s`;
}

export default function IngestControls({
  lastRunIso,
  intervalMs = 30 * 60 * 1000
}: {
  lastRunIso?: string | null;
  intervalMs?: number;
}) {
  const router = useRouter();
  const [lastRun, setLastRun] = useState<Date | null>(lastRunIso ? new Date(lastRunIso) : null);
  const [remaining, setRemaining] = useState<number>(intervalMs);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLastRun(lastRunIso ? new Date(lastRunIso) : null);
  }, [lastRunIso]);

  useEffect(() => {
    const update = () => {
      if (!lastRun) {
        setRemaining(intervalMs);
        return;
      }
      const elapsed = Date.now() - lastRun.getTime();
      setRemaining(Math.max(intervalMs - elapsed, 0));
    };

    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [intervalMs, lastRun]);

  async function handleFetch() {
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      await fetch("/api/cron/ingest", { method: "POST" });
      const now = new Date();
      setLastRun(now);
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const nextLabel = useMemo(() => {
    if (!lastRun) {
      return "Next run pending";
    }
    return `Next run in ${formatDuration(remaining)}`;
  }, [lastRun, remaining]);

  return (
    <div className="flex items-center gap-6 rounded-2xl border border-black/10 bg-white/80 px-5 py-4 text-sm shadow-soft">
      <div className="flex flex-col">
        <span className="text-xs uppercase tracking-[0.2em] text-black/50">Feed fetch</span>
        <span className="text-sm text-black/70" suppressHydrationWarning>
          {loading ? "Fetching..." : lastRun ? `Last run ${lastRun.toLocaleTimeString()}` : "No runs yet"}
        </span>
        <span className="text-xs text-black/50">{nextLabel}</span>
      </div>
      <button
        type="button"
        onClick={handleFetch}
        className="ml-auto rounded-full border border-ink px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-ink transition hover:bg-ink hover:text-sand"
        disabled={loading}
      >
        {loading ? "Fetching..." : "Fetch now"}
      </button>
    </div>
  );
}
