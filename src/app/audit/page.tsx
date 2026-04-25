"use client";

import { useState } from "react";
import { analyzeStore } from "@/lib/analyzer";
import type { SeoAudit, PageAnalysis, KeywordGap } from "@/lib/types";

type Tab = "overview" | "pages" | "keywords" | "competitors" | "broken_links" | "quick_fixes";

function ScoreRing({ score, size = 120 }: { score: number; size?: number }) {
  const r = (size - 12) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  const color = score >= 70 ? "var(--success)" : score >= 40 ? "var(--warning)" : "var(--danger)";
  return (
    <div className="score-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--card-border)" strokeWidth="6"/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="6" strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s" }}/>
      </svg>
      <div className="score-ring-text">
        <div className="text-3xl font-bold" style={{ color }}>{score}</div>
        <div className="text-xs text-[var(--muted)]">SEO Score</div>
      </div>
    </div>
  );
}

function HealthBar({ label, value }: { label: string; value: number }) {
  const color = value >= 70 ? "var(--success)" : value >= 40 ? "var(--warning)" : "var(--danger)";
  return (
    <div>
      <div className="flex justify-between text-sm mb-1"><span>{label}</span><span style={{ color }}>{value}/100</span></div>
      <div className="progress-bar h-2"><div className="progress-bar-fill h-full" style={{ width: `${value}%`, background: `linear-gradient(90deg, ${color}, ${color})` }}/></div>
    </div>
  );
}

function SeverityBadge({ severity }: { severity: string }) {
  const cls = severity === "critical" ? "severity-critical" : severity === "warning" ? "severity-warning" : "severity-info";
  return <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium border ${cls}`}>{severity}</span>;
}

export default function AuditPage() {
  const [url, setUrl] = useState("");
  const [audit, setAudit] = useState<SeoAudit | null>(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<Tab>("overview");

  const runAudit = () => {
    if (!url.trim()) return;
    setLoading(true);
    setTimeout(() => {
      const cleanUrl = url.trim().replace(/\/+$/, "");
      const storeName = new URL(cleanUrl.startsWith("http") ? cleanUrl : `https://${cleanUrl}`).hostname.replace("www.", "").split(".")[0];
      const name = storeName.charAt(0).toUpperCase() + storeName.slice(1);
      setAudit(analyzeStore(cleanUrl.startsWith("http") ? cleanUrl : `https://${cleanUrl}`, name));
      setLoading(false);
    }, 2500);
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="mb-6 h-16 w-16 mx-auto rounded-full border-4 border-[var(--primary)] border-t-transparent animate-spin"/>
          <h2 className="text-2xl font-bold">Scanning your store...</h2>
          <p className="mt-2 text-[var(--muted)]">Discovering pages, checking links, analyzing keywords</p>
        </div>
      </div>
    );
  }

  if (!audit) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 animate-fade-in">
        <h1 className="text-3xl font-bold text-center mb-2">Audit Your Shopify Store</h1>
        <p className="text-center text-[var(--muted)] mb-10">Enter your store URL. We'll scan your pages and give you an SEO score with actionable fixes.</p>
        <div className="glass-card p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Store URL *</label>
            <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://yourstore.myshopify.com" className="w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-4 py-3 text-sm focus:border-[var(--primary)] focus:outline-none"/>
          </div>
          <button onClick={runAudit} disabled={!url.trim()} className="w-full rounded-lg bg-[var(--primary)] py-3 text-sm font-semibold text-white hover:bg-[var(--primary-dark)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            Run Free SEO Audit →
          </button>
          <p className="text-xs text-[var(--muted)] text-center">Free: 3 audits/month, up to 5 pages. <a href="/pricing" className="text-[var(--primary-light)] hover:underline">Upgrade to Pro</a> for 50 pages.</p>
        </div>
      </div>
    );
  }

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: "overview", label: "Overview", icon: "📊" },
    { key: "pages", label: "Pages", icon: "📄" },
    { key: "keywords", label: "Keywords", icon: "🔑" },
    { key: "competitors", label: "Competitors", icon: "🏢" },
    { key: "broken_links", label: "Broken Links", icon: "🔗" },
    { key: "quick_fixes", label: "One-Click Fixes", icon: "⚡" },
  ];

  const topFixes = audit.quickFixes.slice(0, 3);
  const criticalIssues = audit.pages.reduce((s, p) => s + p.issues.filter((i) => i.severity === "critical").length, 0);
  const warningIssues = audit.pages.reduce((s, p) => s + p.issues.filter((i) => i.severity === "warning").length, 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold">{audit.storeName} — SEO Audit</h1>
          <p className="text-sm text-[var(--muted)]">{audit.storeUrl} · {new Date(audit.scannedAt).toLocaleDateString()} · {audit.pages.length} pages</p>
        </div>
        <button onClick={() => setAudit(null)} className="rounded-lg border border-[var(--card-border)] px-4 py-2 text-sm hover:bg-[var(--card)] transition-colors">New Audit</button>
      </div>

      {/* Score + Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="glass-card p-6 flex flex-col items-center">
          <ScoreRing score={audit.overallScore}/>
          <p className="mt-2 text-sm text-[var(--muted)]">Overall SEO Score</p>
        </div>
        <div className="glass-card p-6 space-y-3">
          <h3 className="text-sm font-medium text-[var(--muted)]">Health Breakdown</h3>
          <HealthBar label="Technical" value={audit.seoHealth.technical}/>
          <HealthBar label="Content" value={audit.seoHealth.content}/>
          <HealthBar label="On-Page" value={audit.seoHealth.onpage}/>
          <HealthBar label="Mobile" value={audit.seoHealth.mobile}/>
          <HealthBar label="Speed" value={audit.seoHealth.speed}/>
        </div>
        <div className="glass-card p-6 space-y-3">
          <h3 className="text-sm font-medium text-[var(--muted)]">Issues Found</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-sm"><span className="h-2 w-2 rounded-full bg-[var(--danger)]"/>Critical</span><span className="font-bold text-[var(--danger)]">{criticalIssues}</span></div>
            <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-sm"><span className="h-2 w-2 rounded-full bg-[var(--warning)]"/>Warnings</span><span className="font-bold text-[var(--warning)]">{warningIssues}</span></div>
            <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-sm"><span className="h-2 w-2 rounded-full bg-[var(--accent)]"/>Broken Links</span><span className="font-bold">{audit.brokenLinks.length}</span></div>
            <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-sm"><span className="h-2 w-2 rounded-full bg-[var(--primary)]"/>Pages Scanned</span><span className="font-bold">{audit.pages.length}</span></div>
          </div>
        </div>
        <div className="glass-card p-6 space-y-3">
          <h3 className="text-sm font-medium text-[var(--muted)]">Top 3 Fixes</h3>
          {topFixes.map((f) => (
            <div key={f.id} className="text-sm">
              <div className="flex items-center gap-2">
                <span className="text-[var(--warning)]">⚡</span>
                <span className="font-medium">{f.type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</span>
              </div>
              <p className="text-xs text-[var(--muted)] ml-5">Impact: {f.impact}/100</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[var(--card-border)] mb-6 overflow-x-auto">
        <div className="flex gap-1">
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)} className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${tab === t.key ? "border-[var(--primary)] text-[var(--primary-light)]" : "border-transparent text-[var(--muted)] hover:text-white"}`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {tab === "overview" && (
        <div className="space-y-6 animate-fade-in">
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4">Executive Summary</h3>
            <p className="text-sm text-[var(--muted)] leading-relaxed">
              <strong className="text-white">{audit.storeName}</strong> has an SEO score of <strong className="text-white">{audit.overallScore}/100</strong>. We scanned <strong className="text-white">{audit.pages.length} pages</strong> and found <strong className="text-white">{criticalIssues} critical issues</strong> and <strong className="text-white">{warningIssues} warnings</strong>. Key opportunities include fixing <strong className="text-white">{audit.brokenLinks.length} broken links</strong>, targeting <strong className="text-white">{audit.keywordGaps.filter((k) => k.opportunity === "high").length} high-opportunity keywords</strong> your competitors rank for, and applying <strong className="text-white">{audit.quickFixes.length} one-click fixes</strong>.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-4">Top Priority Fixes</h3>
              <div className="space-y-3">
                {audit.quickFixes.slice(0, 5).map((f) => (
                  <div key={f.id} className="flex items-start gap-2 text-sm">
                    <span className="text-[var(--warning)] shrink-0">⚡</span>
                    <div><span className="font-medium">{f.type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</span><span className="text-[var(--muted)]"> — Impact: {f.impact}/100</span></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-4">Keyword Opportunities</h3>
              <div className="space-y-2">
                {audit.keywordGaps.filter((k) => k.opportunity === "high").slice(0, 5).map((k) => (
                  <div key={k.keyword} className="flex items-center justify-between text-sm">
                    <span>{k.keyword}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-[var(--success)]/20 text-[var(--success)]">Vol: {k.searchVolume.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "pages" && (
        <div className="space-y-4 animate-fade-in">
          {audit.pages.map((p) => (
            <div key={p.url} className="glass-card p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div>
                  <h3 className="font-semibold text-sm">{p.url.replace(audit.storeUrl, "")}</h3>
                  <p className="text-xs text-[var(--muted)] truncate max-w-md">{p.title || "(no title)"}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-lg font-bold ${p.score >= 70 ? "text-[var(--success)]" : p.score >= 40 ? "text-[var(--warning)]" : "text-[var(--danger)]"}`}>{p.score}</span>
                  <span className="text-xs text-[var(--muted)]">/100</span>
                </div>
              </div>
              <div className="grid gap-2 grid-cols-2 sm:grid-cols-4 text-xs text-[var(--muted)] mb-3">
                <span className={p.titleOptimal ? "text-[var(--success)]" : "text-[var(--danger)]"}>{p.titleOptimal ? "✓" : "✗"} Title</span>
                <span className={p.metaDescriptionOptimal ? "text-[var(--success)]" : "text-[var(--danger)]"}>{p.metaDescriptionOptimal ? "✓" : "✗"} Description</span>
                <span className={p.hasStructuredData ? "text-[var(--success)]" : "text-[var(--warning)]"}>{p.hasStructuredData ? "✓" : "✗"} Schema</span>
                <span className={p.imagesWithoutAlt > 0 ? "text-[var(--danger)]" : "text-[var(--success)]"}>{p.imagesWithoutAlt > 0 ? `✗ ${p.imagesWithoutAlt} img alt` : "✓ Alt text"}</span>
              </div>
              {p.issues.length > 0 && (
                <div className="space-y-2">
                  {p.issues.slice(0, 4).map((issue, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <SeverityBadge severity={issue.severity}/>
                      <span className="text-[var(--muted)]">{issue.message}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === "keywords" && (
        <div className="animate-fade-in">
          <div className="glass-card overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-[var(--card-border)]">
                <th className="text-left p-3 text-[var(--muted)]">Keyword</th>
                <th className="text-right p-3 text-[var(--muted)]">Your Pos.</th>
                <th className="text-right p-3 text-[var(--muted)]">Comp. Pos.</th>
                <th className="text-right p-3 text-[var(--muted)]">Volume</th>
                <th className="text-right p-3 text-[var(--muted)]">Difficulty</th>
                <th className="text-center p-3 text-[var(--muted)]">Opportunity</th>
              </tr></thead>
              <tbody>
                {audit.keywordGaps.map((k) => (
                  <tr key={k.keyword} className="border-b border-[var(--card-border)]/50 hover:bg-[var(--card)]/50">
                    <td className="p-3 font-medium">{k.keyword}</td>
                    <td className={`p-3 text-right ${k.yourPosition === null ? "text-[var(--danger)]" : "text-[var(--muted)]"}`}>{k.yourPosition === null ? "—" : `#${k.yourPosition}`}</td>
                    <td className="p-3 text-right">#{k.competitorPosition}</td>
                    <td className="p-3 text-right">{k.searchVolume.toLocaleString()}</td>
                    <td className="p-3 text-right">{k.difficulty}</td>
                    <td className="p-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${k.opportunity === "high" ? "bg-[var(--success)]/20 text-[var(--success)]" : k.opportunity === "medium" ? "bg-[var(--warning)]/20 text-[var(--warning)]" : "bg-[var(--card-border)] text-[var(--muted)]"}`}>{k.opportunity}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "competitors" && (
        <div className="space-y-4 animate-fade-in">
          {audit.competitorOverlaps.map((c) => (
            <div key={c.competitor} className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">🏢</span>
                <div>
                  <h3 className="font-semibold">{c.competitor}</h3>
                  <p className="text-sm text-[var(--muted)]">{c.overlappingKeywords} overlapping keywords · {c.overlapPercent}% overlap</p>
                </div>
              </div>
              <div className="mb-4">
                <div className="progress-bar h-3"><div className="progress-bar-fill h-full" style={{ width: `${c.overlapPercent}%` }}/></div>
              </div>
              <h4 className="text-sm font-medium text-[var(--muted)] mb-2">Keywords they rank for that you don't:</h4>
              <div className="flex flex-wrap gap-2">
                {c.missedKeywords.map((kw) => (
                  <span key={kw} className="px-2 py-1 rounded bg-[var(--danger)]/10 text-[var(--danger)] text-xs">{kw}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "broken_links" && (
        <div className="space-y-4 animate-fade-in">
          <div className="glass-card p-4 text-sm text-[var(--muted)]">
            Found {audit.brokenLinks.length} broken links across your store. Fix these to improve user experience and SEO.
          </div>
          {audit.brokenLinks.map((bl, i) => (
            <div key={i} className="glass-card p-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${bl.type === "404" ? "bg-[var(--danger)]/20 text-[var(--danger)]" : bl.type === "redirect" ? "bg-[var(--warning)]/20 text-[var(--warning)]" : "bg-[var(--muted)]/20 text-[var(--muted)]"}`}>{bl.type.toUpperCase()} {bl.statusCode}</span>
                    <span className="font-mono text-sm text-[var(--danger)]">{bl.url.replace(audit.storeUrl, "")}</span>
                  </div>
                  <p className="text-xs text-[var(--muted)]">Found on: <span className="text-white">{bl.sourcePage.replace(audit.storeUrl, "")}</span></p>
                </div>
              </div>
              <div className="rounded-lg bg-[var(--success)]/10 border border-[var(--success)]/20 p-3">
                <h4 className="text-xs font-medium text-[var(--success)] mb-1">How to fix</h4>
                <p className="text-sm text-[var(--muted)]">{bl.fix}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "quick_fixes" && (
        <div className="space-y-4 animate-fade-in">
          <div className="glass-card p-4 text-sm text-[var(--muted)]">
            {audit.quickFixes.length} one-click fixes ready. Copy-paste the suggested code directly into your Shopify theme.
          </div>
          {audit.quickFixes.map((f) => (
            <div key={f.id} className="glass-card p-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${f.type === "meta_title" ? "bg-[var(--primary)]/20 text-[var(--primary-light)]" : f.type === "meta_description" ? "bg-[var(--accent)]/20 text-[var(--accent)]" : f.type === "alt_text" ? "bg-[var(--warning)]/20 text-[var(--warning)]" : "bg-[var(--success)]/20 text-[var(--success)]"}`}>
                      {f.type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                    </span>
                    <span className="text-xs text-[var(--muted)]">Impact: {f.impact}/100</span>
                  </div>
                  <p className="text-sm text-[var(--muted)]">Page: <span className="text-white">{f.page.replace(audit.storeUrl, "")}</span></p>
                </div>
                <a href={f.shopifyAdminLink} target="_blank" rel="noopener noreferrer" className="shrink-0 rounded-lg border border-[var(--card-border)] px-3 py-1.5 text-xs font-medium hover:bg-[var(--card)] transition-colors">
                  Open in Shopify Admin →
                </a>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg bg-[var(--danger)]/10 border border-[var(--danger)]/20 p-3">
                  <h4 className="text-xs font-medium text-[var(--danger)] mb-1">Current</h4>
                  <p className="text-sm font-mono text-[var(--muted)]">{f.current}</p>
                </div>
                <div className="rounded-lg bg-[var(--success)]/10 border border-[var(--success)]/20 p-3">
                  <h4 className="text-xs font-medium text-[var(--success)] mb-1">Suggested</h4>
                  <p className="text-sm font-mono text-[var(--muted)]">{f.suggested}</p>
                </div>
              </div>
              <div className="mt-3 rounded-lg bg-[var(--background)] border border-[var(--card-border)] p-3">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-xs font-medium">Copy-Paste Code</h4>
                  <button onClick={() => navigator.clipboard.writeText(f.copyPaste)} className="text-xs text-[var(--primary-light)] hover:underline">Copy</button>
                </div>
                <code className="text-xs text-[var(--muted)] block overflow-x-auto">{f.copyPaste}</code>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}