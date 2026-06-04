import Link from "next/link";

import { PageShell } from "@/app/components/layout/page-shell";
import { Button } from "@/app/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";

const features = [
  {
    title: "Live audience queue",
    description:
      "Collect YouTube and Spotify requests in one shared queue for your stream or event.",
  },
  {
    title: "Vote to prioritize",
    description:
      "Listeners upvote their favorite tracks so the most popular request plays next.",
  },
  {
    title: "Built for creators",
    description:
      "Dashboard tools help streamers submit tracks, monitor requests, and manage sessions.",
  },
];

export default function LandingPage() {
  return (
    <PageShell>
      <section className="container-app py-16 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 inline-flex rounded-full border border-brand/30 bg-brand-soft px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-brand">
            Music streaming SaaS
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
            Turn your audience requests into a live music queue
          </h1>
          <p className="mt-5 text-base text-muted sm:text-lg">
            MUZZER helps streamers and hosts collect YouTube and Spotify links,
            rank them with upvotes, and keep the session moving with a beautiful
            shared queue experience.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/queue">
              <Button size="lg">View live queue</Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="secondary">
                Sign in with Google
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="container-app pb-20">
        <div className="glass-panel grid gap-6 p-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Ready to run your next session?
            </h2>
            <p className="mt-3 text-sm text-muted sm:text-base">
              Open the dashboard to submit tracks, share the public queue with your
              audience, and let votes decide what plays next.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <Link href="/dashboard">
              <Button className="w-full sm:w-auto">Go to dashboard</Button>
            </Link>
            <Link href="/dashboard/streams/new">
              <Button className="w-full sm:w-auto" variant="secondary">
                Add a track
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
