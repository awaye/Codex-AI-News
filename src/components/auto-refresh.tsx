"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AutoRefresh({ intervalMs = 60000 }: { intervalMs?: number }) {
  const router = useRouter();
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    setLastUpdated(new Date());
    const id = setInterval(() => {
      router.refresh();
      setLastUpdated(new Date());
    }, intervalMs);

    return () => clearInterval(id);
  }, [intervalMs, router]);

  return (
    <div className="flex items-center gap-6 rounded-2xl border border-black/10 bg-white/80 px-5 py-4 text-sm shadow-soft">
      <div className="flex flex-col">
        <span className="text-xs uppercase tracking-[0.2em] text-black/50">Live updates</span>
        <span className="text-sm text-black/70">Every {Math.round(intervalMs / 1000)}s</span>
        <span className="text-xs text-black/50">
          {lastUpdated ? `Last refresh ${lastUpdated.toLocaleTimeString()}` : "Starting..."}
        </span>
      </div>
    </div>
  );
}
