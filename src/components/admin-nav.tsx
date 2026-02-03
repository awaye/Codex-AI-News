"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/admin/news", label: "News Queue" },
  { href: "/admin/sources", label: "Sources" }
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap items-center gap-4 text-sm">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            className={`rounded-full border px-4 py-2 transition ${
              isActive
                ? "border-ink bg-ink text-sand"
                : "border-black/10 text-black/70 hover:border-black/30"
            }`}
            href={item.href}
          >
            {item.label}
          </Link>
        );
      })}
      <Link
        className="rounded-full border border-black/10 px-4 py-2 text-sm text-black/70 transition hover:border-black/30 hover:bg-ink/5"
        href="/"
        target="_blank"
      >
        View live
      </Link>
      <form action="/api/admin/auth/logout" method="post">
        <button className="rounded-full border border-ember px-4 py-2 text-sm font-semibold text-ember transition hover:bg-ember hover:text-white">
          Sign out
        </button>
      </form>
    </nav>
  );
}
