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
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div className="rounded-[2rem] border border-brand/10 bg-[#111123]/90 p-8 shadow-glow backdrop-blur-xl">
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <span className="inline-flex rounded-full border border-brand/30 bg-brand-soft px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-brand">
                Music streaming SaaS
              </span>
              <span className="inline-flex rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-muted">
                Live queue control for creators
              </span>
            </div>

            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-6xl">
              Turn audience requests into a live music queue that feels built-in.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-muted sm:text-lg">
              MUZZER helps streamers and hosts collect YouTube and Spotify links,
              rank them with upvotes, and keep the session moving with a polished,
              shared queue experience that your audience can taste in real time.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link href="/queue">
                <Button size="lg">View live queue</Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="secondary">
                  Sign in with Google
                </Button>
              </Link>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl border border-border bg-surface/80 p-4 text-center">
                <p className="text-2xl font-semibold text-white">120+</p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted">Listeners</p>
              </div>
              <div className="rounded-3xl border border-border bg-surface/80 p-4 text-center">
                <p className="text-2xl font-semibold text-white">2</p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted">Platforms</p>
              </div>
              <div className="rounded-3xl border border-border bg-surface/80 p-4 text-center">
                <p className="text-2xl font-semibold text-white">100%</p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted">Vote-driven</p>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-[2rem] border border-border bg-surface/95 p-6 shadow-glow">
              <div className="mb-6 flex items-center justify-between">
                <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand">
                  Now playing
                </span>
                <span className="text-xs font-medium text-muted">Live queue</span>
              </div>
              <div className="space-y-4">
                <div className="rounded-3xl border border-border p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold">Ride the Night</p>
                      <p className="mt-1 text-xs text-muted">by Eclipse Waves</p>
                    </div>
                    <span className="rounded-full bg-brand/10 px-2 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-brand">
                      Top vote
                    </span>
                  </div>
                </div>
                <div className="rounded-3xl border border-border p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold">Summer Echo</p>
                      <p className="mt-1 text-xs text-muted">by Neon Pulse</p>
                    </div>
                    <span className="text-xs font-medium text-muted">2 min</span>
                  </div>
                </div>
                <div className="rounded-3xl border border-border p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold">Late Night Drive</p>
                      <p className="mt-1 text-xs text-muted">by Skyline DJs</p>
                    </div>
                    <span className="text-xs font-medium text-muted">3 min</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-border bg-brand/5 p-6 text-white">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">What creators love</p>
              <p className="mt-4 text-base leading-7 text-slate-100">
                A clean queue, real-time voting, and one dashboard for streamers,
                DJs, and show hosts ready to turn requests into momentum.
              </p>
            </div>
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
