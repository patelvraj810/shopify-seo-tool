"use client";

import Link from "next/link";

const features = [
  { icon: "🔍", title: "Multi-Page Scanner", desc: "Discovers & analyzes up to 50 pages via sitemap, Shopify APIs, and homepage crawl." },
  { icon: "📊", title: "Keyword Gap Analysis", desc: "Find keywords your competitors rank for that you're missing — with search volume and difficulty." },
  { icon: "🔗", title: "Broken Link Scanner", desc: "Crawls your pages and finds 404s, bad redirects, timeouts, and SSL errors." },
  { icon: "⚡", title: "One-Click Fixes", desc: "Copy-paste meta titles, descriptions, alt text, and structured data — with Shopify Admin links." },
  { icon: "🏆", title: "Competitor Overlap", desc: "See which keywords competitors rank for that you don't, and how much overlap exists." },
  { icon: "📈", title: "SEO Health Score", desc: "Single 0-100 score covering technical, content, on-page, mobile, and speed." },
  { icon: "🛍️", title: "Shopify-Specific", desc: "Built for Shopify stores — understands Liquid templates, collections, products, and blog posts." },
  { icon: "📋", title: "Quick Audit", desc: "Top 5 pages + competitor overlap + quick-win keywords in a single view." },
];

export default function HomePage() {
  return (
    <div className="animate-fade-in">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--primary)]/10 to-transparent" />
        <div className="mx-auto max-w-5xl px-4 py-24 sm:px-6 sm:py-32 text-center relative">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--card-border)] bg-[var(--card)] px-4 py-1.5 text-sm text-[var(--muted)]">
            <span className="inline-block h-2 w-2 rounded-full bg-[var(--success)] animate-pulse" />
            Built for Shopify Stores
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Simple SEO for{" "}
            <span className="gradient-text">Shopify</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-[var(--muted)] max-w-2xl mx-auto">
            A $29/mo alternative to Ahrefs. Keyword tracking, competitor gaps, broken links, and one-click fixes — all built for Shopify stores.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/audit" className="rounded-lg bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white hover:bg-[var(--primary-dark)] transition-colors animate-pulse-glow">
              Audit Your Store — Free
            </Link>
            <Link href="/pricing" className="rounded-lg border border-[var(--card-border)] px-6 py-3 text-sm font-semibold text-[var(--foreground)] hover:bg-[var(--card)] transition-colors">
              View Pricing
            </Link>
          </div>
          <div className="mt-8 text-sm text-[var(--muted)]">
            No credit card required · 3 free audits per month
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold">Everything You Need</h2>
          <p className="mt-4 text-[var(--muted)] max-w-2xl mx-auto">
            No 100-button dashboards. Just the SEO features that actually matter for Shopify stores.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="glass-card p-6 hover:border-[var(--primary)] transition-colors">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6 text-center">
        <div className="glass-card p-12">
          <h2 className="text-3xl font-bold">Start With a Free Audit</h2>
          <p className="mt-4 text-[var(--muted)] max-w-xl mx-auto">
            Enter your Shopify store URL. We'll scan up to 5 pages, find broken links, check keyword gaps, and give you one-click fixes.
          </p>
          <Link href="/audit" className="mt-8 inline-block rounded-lg bg-[var(--primary)] px-8 py-3 text-sm font-semibold text-white hover:bg-[var(--primary-dark)] transition-colors">
            Audit My Store →
          </Link>
        </div>
      </section>
    </div>
  );
}