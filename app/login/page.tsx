"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { Suspense, useEffect } from "react";

import { PageShell } from "@/app/components/layout/page-shell";
import { Alert } from "@/app/components/ui/alert";
import { Button } from "@/app/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Spinner } from "@/app/components/ui/spinner";

function LoginContent() {
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

  useEffect(() => {
    if (status === "authenticated") {
      router.replace(callbackUrl);
    }
  }, [callbackUrl, router, status]);

  if (status === "loading") {
    return (
      <PageShell showFooter={false}>
        <Spinner label="Checking authentication..." />
      </PageShell>
    );
  }

  if (status === "authenticated") {
    return null;
  }

  return (
    <PageShell showFooter={false}>
      <div className="container-app flex min-h-[calc(100vh-4rem)] items-center justify-center py-10">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Sign in to MUZZER</CardTitle>
            <CardDescription>
              Use your Google account to submit tracks, vote on requests, and access
              your dashboard.
            </CardDescription>
          </CardHeader>

          <div className="space-y-4">
            <Button
              className="w-full"
              size="lg"
              onClick={() => signIn("google", { callbackUrl })}
            >
              Continue with Google
            </Button>

            <Alert variant="info">
              Authentication is handled by NextAuth using your existing Google OAuth
              configuration.
            </Alert>

            <p className="text-center text-sm text-muted">
              Just browsing?{" "}
              <Link href="/queue" className="text-brand hover:underline">
                View the live queue
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </PageShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <PageShell showFooter={false}>
          <Spinner label="Loading sign in..." />
        </PageShell>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
