import Link from "next/link";

// Force dynamic rendering to prevent build-time errors
export const dynamic = "force-dynamic";

export default function AdminLogin({
  searchParams
}: {
  searchParams?: { error?: string };
}) {
  const hasError = Boolean(searchParams?.error);

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-3xl border border-black/10 bg-white/80 p-10 shadow-soft">
        <div className="flex flex-col gap-4">
          <p className="text-xs uppercase tracking-[0.2em] text-ember">Admin Access</p>
          <h1 className="text-3xl font-semibold" style={{ fontFamily: "var(--font-serif)" }}>
            Sign in to curate
          </h1>
          <p className="text-sm text-black/70">
            Use the admin credentials seeded in the database to access the curation console.
          </p>
        </div>

        {hasError ? (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Invalid email or password. Try again.
          </div>
        ) : null}

        <form className="mt-6 flex flex-col gap-4" action="/api/admin/auth/login" method="post">
          <label className="flex flex-col gap-2 text-sm">
            Email
            <input
              name="email"
              type="email"
              required
              className="rounded-xl border border-black/10 px-3 py-2"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            Password
            <input
              name="password"
              type="password"
              required
              className="rounded-xl border border-black/10 px-3 py-2"
            />
          </label>
          <button
            type="submit"
            className="rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-sand"
          >
            Sign in
          </button>
        </form>

        <div className="mt-6 text-xs uppercase tracking-[0.2em] text-black/40">
          <Link href="/">Back to dashboard</Link>
        </div>
      </div>
    </main>
  );
}
