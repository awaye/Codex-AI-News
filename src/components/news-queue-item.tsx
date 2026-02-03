"use client";

import { useState } from "react";
import Link from "next/link";
import ApproveRejectButtons from "@/components/approve-reject";
import { formatTags } from "@/lib/utils";

type Props = {
  id: string;
  title: string;
  summary?: string | null;
  url: string;
  scope: string;
  publishedLabel: string;
  sourceName: string;
  tags: string[];
  country?: string | null;
};

export default function NewsQueueItem({
  id,
  title,
  summary,
  url,
  scope,
  publishedLabel,
  sourceName,
  tags,
  country
}: Props) {
  const [animation, setAnimation] = useState<"approve" | "reject" | null>(null);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <article
      className={`relative overflow-hidden rounded-3xl border border-black/10 bg-white/80 p-6 shadow-soft transition-all duration-300 ease-out ${
        collapsed ? "max-h-0 opacity-0" : "max-h-[800px] opacity-100"
      } ${
        animation === "approve"
          ? "-translate-y-2 translate-x-2"
          : animation === "reject"
            ? "translate-y-2 -translate-x-2"
            : ""
      }`}
    >
      <div
        className={`pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 ${
          animation === "approve"
            ? "opacity-100 bg-gradient-to-r from-emerald-200/70 to-transparent"
            : animation === "reject"
              ? "opacity-100 bg-gradient-to-l from-red-200/70 to-transparent"
              : ""
        }`}
      />
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-black/50">
          <span>{sourceName}</span>
          <span>•</span>
          <span>{scope}</span>
          <span>•</span>
          <span>{publishedLabel}</span>
        </div>
        <h2 className="text-xl font-semibold text-ink">{title}</h2>
        {summary ? <p className="text-sm text-black/70">{summary}</p> : null}
        <div className="flex flex-wrap items-center gap-2 text-xs text-black/60">
          {country ? <span>Country: {country}</span> : null}
          {tags.length > 0 ? <span>Tags: {formatTags(tags)}</span> : null}
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <a
            className="rounded-full border border-black/10 px-4 py-2 text-sm text-black/70 hover:border-black/30"
            href={url}
            target="_blank"
            rel="noreferrer"
          >
            View source
          </a>
          <Link className="rounded-full border border-black/10 px-4 py-2" href={`/admin/news/${id}`}>
            Edit
          </Link>
          <ApproveRejectButtons
            id={id}
            onAction={(action) => {
              setAnimation(action);
              setTimeout(() => setCollapsed(true), 240);
            }}
          />
        </div>
      </div>
    </article>
  );
}
