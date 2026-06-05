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
  { href: "/dashboard", label: "Studio" },
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
        <section className="min-w-0 space-y-6">{children}</section>
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
