import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    features: ["3 audits per month", "5 pages per scan", "2 competitor comparisons", "Basic keyword gaps", "Broken link scanner", "One-click fixes"],
    cta: "Start Free",
    href: "/audit",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    features: ["Unlimited audits", "50 pages per scan", "10 competitor comparisons", "Full keyword gap analysis", "Broken link scanner", "One-click fixes", "Shopify Liquid audit", "Traffic drift alerts", "PDF/HTML report export", "Score history & trends"],
    cta: "Start 14-Day Free Trial",
    href: "/audit",
    highlight: true,
  },
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 animate-fade-in">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold">Simple Pricing</h1>
        <p className="mt-4 text-[var(--muted)] max-w-xl mx-auto">$29/mo. That's it. No tiers, no hidden fees, no 100-button dashboards.</p>
      </div>
      <div className="grid gap-8 sm:grid-cols-2 max-w-3xl mx-auto">
        {plans.map((plan) => (
          <div key={plan.name} className={`glass-card p-8 relative ${plan.highlight ? "border-[var(--primary)] shadow-lg shadow-[var(--primary)]/10" : ""}`}>
            {plan.highlight && <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--primary)] px-3 py-1 text-xs font-semibold text-white">Most Popular</div>}
            <h2 className="text-2xl font-bold">{plan.name}</h2>
            <div className="mt-4"><span className="text-4xl font-bold">{plan.price}</span><span className="text-[var(--muted)]">{plan.period}</span></div>
            <ul className="mt-8 space-y-3">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm"><span className="text-[var(--success)] shrink-0">✓</span><span className="text-[var(--muted)]">{f}</span></li>
              ))}
            </ul>
            <Link href={plan.href} className={`mt-8 block text-center rounded-lg py-3 text-sm font-semibold transition-colors ${plan.highlight ? "bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)]" : "border border-[var(--card-border)] text-white hover:bg-[var(--card)]"}`}>
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>
      <div className="mt-16 text-center">
        <h3 className="text-lg font-semibold mb-6">FAQ</h3>
        <div className="mx-auto max-w-2xl space-y-4">
          {[
            { q: "Is this only for Shopify stores?", a: "Yes — the tool is built specifically for Shopify. It understands Liquid templates, collections, products, and Shopify Admin links." },
            { q: "How does the free tier work?", a: "3 free audits per month with up to 5 pages scanned. No credit card required." },
            { q: "How accurate is the SEO scanner?", a: "We crawl your actual pages and check meta tags, headings, alt text, structured data, HTTPS, mobile-friendliness, and more. Results reflect real issues on your store." },
            { q: "Can I cancel anytime?", a: "Yes. Cancel your Pro subscription at any time. Access continues until the end of your billing period." },
          ].map((faq) => (
            <div key={faq.q} className="glass-card p-4">
              <h4 className="font-medium text-sm">{faq.q}</h4>
              <p className="text-sm text-[var(--muted)] mt-1">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}