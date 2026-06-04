"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";

import { Button } from "@/app/components/ui/button";
import { useUser } from "@/app/hooks/use-user";

const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/queue", label: "Live queue" },
];

const appLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/streams/new", label: "Add track" },
  { href: "/dashboard/queue", label: "My queue" },
];

function NavLink({
  href,
  label,
  onNavigate,
}: {
  href: string;
  label: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`rounded-lg px-3 py-2 text-sm transition ${isActive ? "bg-brand-soft text-brand" : "text-muted hover:bg-surface-elevated hover:text-foreground"}`}
    >
      {label}
    </Link>
  );
}

export function Navbar() {
  const { data: session, status } = useSession();
  const { isStreamer } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  const links = session ? [...publicLinks, ...appLinks] : publicLinks;

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/80 backdrop-blur-xl">
      <div className="container-app flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-sm text-white shadow-glow">
            M
          </span>
          <span>MUZZER</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          {links.map((link) => (
            <NavLink key={link.href} href={link.href} label={link.label} />
          ))}
          {session && isStreamer ? (
            <NavLink href="/admin/streams" label="Admin" />
          ) : null}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {status === "authenticated" ? (
            <>
              <span className="max-w-[12rem] truncate text-sm text-muted">
                {session.user?.email}
              </span>
              <Button variant="ghost" size="sm" onClick={() => signOut()}>
                Sign out
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button size="sm">Sign in</Button>
            </Link>
          )}
        </div>

        <button
          type="button"
          className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border md:hidden"
          aria-expanded={isOpen}
          aria-controls="mobile-nav"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          onClick={() => setIsOpen((open) => !open)}
        >
          <span aria-hidden>{isOpen ? "✕" : "☰"}</span>
        </button>
      </div>

      {isOpen ? (
        <div id="mobile-nav" className="border-t border-border md:hidden">
          <div className="container-app flex flex-col gap-2 py-4">
            {links.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                label={link.label}
                onNavigate={() => setIsOpen(false)}
              />
            ))}
            {session && isStreamer ? (
              <NavLink
                href="/admin/streams"
                label="Admin"
                onNavigate={() => setIsOpen(false)}
              />
            ) : null}
            <div className="pt-2">
              {status === "authenticated" ? (
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => {
                    setIsOpen(false);
                    void signOut();
                  }}
                >
                  Sign out
                </Button>
              ) : (
                <Button
                  className="w-full"
                  onClick={() => {
                    setIsOpen(false);
                    void signIn("google", { callbackUrl: "/dashboard" });
                  }}
                >
                  Sign in with Google
                </Button>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
