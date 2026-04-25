"use client";

import Link from "next/link";
import { useState } from "react";

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--card-border)] bg-[var(--background)]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)] text-white font-bold text-sm">SE</div>
          <span className="text-lg font-semibold gradient-text">Shopify SEO</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/" className="text-[var(--muted)] hover:text-white transition-colors">Home</Link>
          <Link href="/audit" className="text-[var(--muted)] hover:text-white transition-colors">Audit</Link>
          <Link href="/pricing" className="text-[var(--muted)] hover:text-white transition-colors">Pricing</Link>
        </nav>
        <div className="hidden md:flex items-center gap-3">
          <Link href="/audit" className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--primary-dark)] transition-colors">Start Free Audit</Link>
        </div>
        <button className="md:hidden text-[var(--muted)] p-2" onClick={() => setOpen(!open)} aria-label="Menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{open ? <path d="M18 6L6 18M6 6l12 12"/> : <path d="M3 12h18M3 6h18M3 18h18"/>}</svg>
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-[var(--card-border)] px-4 pb-4 pt-2 space-y-2">
          <Link href="/" className="block py-2 text-[var(--muted)] hover:text-white">Home</Link>
          <Link href="/audit" className="block py-2 text-[var(--muted)] hover:text-white">Audit</Link>
          <Link href="/pricing" className="block py-2 text-[var(--muted)] hover:text-white">Pricing</Link>
          <Link href="/audit" className="block rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white text-center">Start Free Audit</Link>
        </div>
      )}
    </header>
  );
}