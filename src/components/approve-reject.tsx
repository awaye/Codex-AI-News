"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  id: string;
  onAction?: (action: "approve" | "reject") => void;
};

export default function ApproveRejectButtons({ id, onAction }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "approve" | "reject" | "pending">("idle");

  async function handle(action: "approve" | "reject") {
    if (status === "pending") {
      return;
    }

    setStatus(action);
    onAction?.(action);

    try {
      await fetch(`/api/admin/news/${id}/${action}`, { method: "POST" });
      setStatus("pending");
      await new Promise((resolve) => setTimeout(resolve, 280));
      router.refresh();
    } catch (error) {
      console.error(error);
      setStatus("idle");
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={() => handle("approve")}
        className={`rounded-full px-4 py-2 text-sm font-semibold transition active:scale-[0.98] ${
          status === "approve"
            ? "bg-emerald-600 text-white"
            : "border border-emerald-500 text-emerald-700 hover:bg-emerald-50"
        }`}
        disabled={status === "pending"}
      >
        {status === "approve" ? "Approved" : "Approve"}
      </button>
      <button
        type="button"
        onClick={() => handle("reject")}
        className={`rounded-full px-4 py-2 text-sm font-semibold transition active:scale-[0.98] ${
          status === "reject"
            ? "bg-red-500 text-white"
            : "border border-red-400 text-red-600 hover:bg-red-50"
        }`}
        disabled={status === "pending"}
      >
        {status === "reject" ? "Rejected" : "Reject"}
      </button>
    </div>
  );
}
