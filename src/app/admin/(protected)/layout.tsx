import { requireAdmin } from "@/lib/auth";
import AdminNav from "@/components/admin-nav";

// Force dynamic rendering to prevent build-time errors
export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-sand/40 px-6 py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="sticky top-4 z-20 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-black/10 bg-white/80 p-6 shadow-soft backdrop-blur">
          <div className="flex flex-col gap-1">
            <p className="text-xs uppercase tracking-[0.2em] text-ember">Admin Console</p>
            <h1 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-serif)" }}>
              AI News Curation
            </h1>
          </div>
          <AdminNav />
        </header>
        {children}
      </div>
    </div>
  );
}
