import Link from "next/link";

import { PageShell } from "@/app/components/layout/page-shell";
import { Button } from "@/app/components/ui/button";

export default function LandingPage() {
  return (
    <PageShell>
      <section className="container-app flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-sm font-medium text-muted">
          <span className="h-2 w-2 rounded-full bg-brand"></span>
          Music streaming simplified
        </div>

        <h1 className="max-w-4xl text-5xl font-bold tracking-tight text-foreground sm:text-7xl">
          A clean, shared queue for your live streams.
        </h1>
        
        <p className="mt-8 max-w-2xl text-lg text-muted sm:text-xl">
          Let your audience search and request tracks from Spotify and YouTube.
          No complex setups, just a simple queue powered by upvotes.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/dashboard">
            <Button size="lg" className="w-full sm:w-auto">
              Open Dashboard
            </Button>
          </Link>
          <Link href="/queue">
            <Button size="lg" variant="secondary" className="w-full sm:w-auto">
              View live queue
            </Button>
          </Link>
        </div>
      </section>

      <section className="container-app py-20 border-t border-border">
        <div className="grid gap-12 sm:grid-cols-3">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-surface text-brand">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
            </div>
            <h3 className="text-xl font-semibold">Easy Import</h3>
            <p className="mt-2 text-muted">Search directly from Spotify or YouTube. No need to copy and paste links anymore.</p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-surface text-brand">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7 11 5-5 5 5"/><path d="m7 13 5 5 5-5"/></svg>
            </div>
            <h3 className="text-xl font-semibold">Audience Voting</h3>
            <p className="mt-2 text-muted">Listeners upvote their favorite tracks so the best music always plays next.</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-surface text-brand">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            </div>
            <h3 className="text-xl font-semibold">Auto-Play</h3>
            <p className="mt-2 text-muted">Seamless transitions between tracks. Let the queue run itself while you stream.</p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
