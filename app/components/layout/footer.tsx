import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border/80 py-10">
      <div className="container-app flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold">MUZZER</p>
          <p className="mt-1 text-sm text-muted">
            Crowd-powered music queues for streamers and live sessions.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-muted">
          <Link href="/queue" className="hover:text-foreground">
            Live queue
          </Link>
          <Link href="/login" className="hover:text-foreground">
            Sign in
          </Link>
          <Link href="/dashboard" className="hover:text-foreground">
            Dashboard
          </Link>
        </div>
      </div>
    </footer>
  );
}
