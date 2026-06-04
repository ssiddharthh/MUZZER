"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

import { PageShell } from "@/app/components/layout/page-shell";
import { Alert } from "@/app/components/ui/alert";
import { Spinner } from "@/app/components/ui/spinner";
import { useUser } from "@/app/hooks/use-user";

const sidebarLinks = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/streams/new", label: "Add track" },
  { href: "/dashboard/queue", label: "Queue management" },
  { href: "/queue", label: "Live queue view" },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { status } = useSession();
  const { user, isLoading, isStreamer } = useUser();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
    }
  }, [pathname, router, status]);

  if (status === "loading" || isLoading) {
    return (
      <PageShell showFooter={false}>
        <Spinner label="Checking your session..." />
      </PageShell>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <PageShell showFooter={false}>
      <div className="container-app py-8 lg:py-10">
        <div className="grid gap-8 lg:grid-cols-[15rem_minmax(0,1fr)]">
          <aside className="glass-panel h-fit p-4">
            <p className="mb-1 text-xs uppercase tracking-[0.2em] text-muted">
              Dashboard
            </p>
            <p className="mb-4 truncate text-sm font-medium">{user?.email}</p>
            <nav className="flex flex-col gap-1" aria-label="Dashboard">
              {sidebarLinks.map((link) => {
                const isActive =
                  pathname === link.href || pathname.startsWith(`${link.href}/`);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`rounded-lg px-3 py-2 text-sm transition ${isActive ? "bg-brand-soft text-brand" : "text-muted hover:bg-surface-elevated hover:text-foreground"}`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              {isStreamer ? (
                <Link
                  href="/admin/streams"
                  className={`rounded-lg px-3 py-2 text-sm transition ${pathname.startsWith("/admin") ? "bg-brand-soft text-brand" : "text-muted hover:bg-surface-elevated hover:text-foreground"}`}
                >
                  Admin streams
                </Link>
              ) : null}
            </nav>
          </aside>

          <section className="min-w-0 space-y-6">{children}</section>
        </div>
      </div>
    </PageShell>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { status } = useSession();
  const { user, isLoading, isStreamer } = useUser();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login?callbackUrl=/admin/streams");
    }
  }, [router, status]);

  if (status === "loading" || isLoading) {
    return (
      <PageShell showFooter={false}>
        <Spinner label="Checking admin access..." />
      </PageShell>
    );
  }

  if (!isStreamer) {
    return (
      <PageShell showFooter={false}>
        <div className="container-app py-10">
          <Alert variant="error" title="Admin access required">
            Your account does not have the Streamer role. Update the user role in
            the database to access the admin stream view.
          </Alert>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell showFooter={false}>
      <div className="container-app space-y-6 py-8 lg:py-10">
        <div>
          <p className="text-sm text-muted">Admin</p>
          <h1 className="text-3xl font-semibold tracking-tight">Stream operations</h1>
          <p className="mt-2 text-sm text-muted">
            Signed in as {user?.email}
          </p>
        </div>
        {children}
      </div>
    </PageShell>
  );
}
