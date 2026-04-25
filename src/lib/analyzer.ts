import {
  SeoAudit,
  PageAnalysis,
  PageIssue,
  KeywordGap,
  CompetitorOverlap,
  BrokenLink,
  QuickFix,
  SeoHealthBreakdown,
} from "./types";
import { generateId, slugify } from "./utils";

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randFloat(min: number, max: number, decimals = 1): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

// Shopify page templates
const SHOPIFY_PAGES = [
  { path: "/", type: "homepage", titleBase: "Home" },
  { path: "/collections/all", type: "collection", titleBase: "All Products" },
  { path: "/collections/new-arrivals", type: "collection", titleBase: "New Arrivals" },
  { path: "/collections/best-sellers", type: "collection", titleBase: "Best Sellers" },
  { path: "/products/sample-product", type: "product", titleBase: "Sample Product" },
  { path: "/products/featured-item", type: "product", titleBase: "Featured Item" },
  { path: "/blogs/news", type: "blog", titleBase: "Blog" },
  { path: "/pages/about-us", type: "page", titleBase: "About Us" },
  { path: "/pages/contact", type: "page", titleBase: "Contact" },
  { path: "/pages/faq", type: "page", titleBase: "FAQ" },
  { path: "/pages/shipping", type: "page", titleBase: "Shipping Info" },
  { path: "/pages/returns", type: "page", titleBase: "Returns Policy" },
  { path: "/collections/sale", type: "collection", titleBase: "Sale" },
  { path: "/collections/summer", type: "collection", titleBase: "Summer Collection" },
  { path: "/products/another-product", type: "product", titleBase: "Another Product" },
  { path: "/blogs/tips", type: "blog", titleBase: "Tips & Guides" },
  { path: "/pages/privacy-policy", type: "page", titleBase: "Privacy Policy" },
  { path: "/pages/terms", type: "page", titleBase: "Terms of Service" },
  { path: "/collections/featured", type: "collection", titleBase: "Featured" },
  { path: "/products/limited-edition", type: "product", titleBase: "Limited Edition" },
];

function generatePageIssues(page: PageAnalysis): PageIssue[] {
  const issues: PageIssue[] = [];

  if (!page.titleOptimal) {
    if (page.titleLength === 0) {
      issues.push({ severity: "critical", category: "meta_title", message: "Missing page title", fix: "Add a descriptive title tag (50-60 characters)" });
    } else if (page.titleLength < 30) {
      issues.push({ severity: "warning", category: "meta_title", message: `Title too short (${page.titleLength} chars)`, fix: "Expand title to 50-60 characters for better SERP display" });
    } else {
      issues.push({ severity: "warning", category: "meta_title", message: `Title too long (${page.titleLength} chars)`, fix: "Shorten title to 50-60 characters to avoid truncation" });
    }
  }

  if (!page.metaDescriptionOptimal) {
    if (page.metaDescriptionLength === 0) {
      issues.push({ severity: "critical", category: "meta_description", message: "Missing meta description", fix: "Add a compelling meta description (150-160 characters)" });
    } else if (page.metaDescriptionLength < 120) {
      issues.push({ severity: "warning", category: "meta_description", message: `Meta description too short (${page.metaDescriptionLength} chars)`, fix: "Expand to 150-160 characters for better CTR" });
    } else {
      issues.push({ severity: "info", category: "meta_description", message: `Meta description too long (${page.metaDescriptionLength} chars)`, fix: "Shorten to under 160 characters" });
    }
  }

  if (page.h1Count === 0) {
    issues.push({ severity: "critical", category: "h1", message: "Missing H1 tag", fix: "Add a single H1 tag describing the page content" });
  } else if (page.h1Count > 1) {
    issues.push({ severity: "warning", category: "h1", message: `Multiple H1 tags (${page.h1Count})`, fix: "Use only one H1 per page for proper heading hierarchy" });
  }

  if (page.imagesWithoutAlt > 0) {
    issues.push({ severity: "critical", category: "alt_text", message: `${page.imagesWithoutAlt} images missing alt text`, fix: "Add descriptive alt text to all images for accessibility and SEO" });
  }

  if (!page.hasStructuredData) {
    issues.push({ severity: "warning", category: "structured_data", message: "No structured data found", fix: "Add JSON-LD schema markup (Product, Organization, BreadcrumbList)" });
  }

  if (!page.httpsEnabled) {
    issues.push({ severity: "critical", category: "technical", message: "HTTPS not enabled", fix: "Enable HTTPS for security and ranking benefits" });
  }

  if (!page.mobileFriendly) {
    issues.push({ severity: "critical", category: "mobile", message: "Page not mobile-friendly", fix: "Ensure responsive design and proper viewport meta tag" });
  }

  if (page.pageSpeedScore < 50) {
    issues.push({ severity: "warning", category: "speed", message: `Slow page speed (${page.pageSpeedScore}/100)`, fix: "Optimize images, reduce JavaScript, enable lazy loading" });
  }

  return issues;
}

function generatePages(storeUrl: string, storeName: string, pageCount: number): PageAnalysis[] {
  const pages = SHOPIFY_PAGES.slice(0, pageCount);
  return pages.map((p) => {
    const titleOptimal = Math.random() > 0.4;
    const metaOptimal = Math.random() > 0.45;
    const hasStructuredData = p.type === "product" || p.type === "collection" ? Math.random() > 0.5 : Math.random() > 0.7;
    const totalImages = p.type === "product" ? randInt(3, 12) : p.type === "collection" ? randInt(1, 5) : randInt(0, 3);
    const imagesWithoutAlt = Math.random() > 0.4 ? randInt(0, Math.ceil(totalImages * 0.5)) : 0;
    const h1Count = Math.random() > 0.7 ? (Math.random() > 0.5 ? 0 : randInt(2, 4)) : 1;

    const page: PageAnalysis = {
      url: `${storeUrl}${p.path}`,
      title: titleOptimal ? `${storeName} — ${p.titleBase} | Shop Now` : (Math.random() > 0.5 ? "" : `${p.titleBase}`),
      titleLength: titleOptimal ? randInt(45, 60) : (Math.random() > 0.5 ? 0 : randInt(10, 80)),
      titleOptimal,
      metaDescription: metaOptimal ? `Shop ${storeName}'s ${p.titleBase.toLowerCase()}. Free shipping on orders over $50. Quality guaranteed.` : (Math.random() > 0.4 ? "" : "A short desc"),
      metaDescriptionLength: metaOptimal ? randInt(140, 160) : (Math.random() > 0.5 ? 0 : randInt(5, 180)),
      metaDescriptionOptimal: metaOptimal,
      h1Tag: h1Count > 0 ? p.titleBase : null,
      h1Count,
      imagesWithoutAlt,
      totalImages,
      hasStructuredData,
      canonicalUrl: Math.random() > 0.2 ? `${storeUrl}${p.path}` : null,
      pageSpeedScore: p.type === "homepage" ? randInt(45, 75) : randInt(55, 90),
      mobileFriendly: Math.random() > 0.15,
      httpsEnabled: storeUrl.startsWith("https"),
      issues: [],
      score: 0,
    };

    page.issues = generatePageIssues(page);
    const criticals = page.issues.filter((i) => i.severity === "critical").length;
    const warnings = page.issues.filter((i) => i.severity === "warning").length;
    page.score = Math.max(10, Math.min(95, 100 - criticals * 20 - warnings * 8 - (page.imagesWithoutAlt > 0 ? 5 : 0) - (!page.hasStructuredData ? 5 : 0)));

    return page;
  });
}

function generateKeywordGaps(storeName: string): KeywordGap[] {
  const keywords = [
    { kw: "best online store", vol: 18100, diff: 75 },
    { kw: "shopify store products", vol: 8100, diff: 45 },
    { kw: "buy handmade gifts", vol: 5400, diff: 55 },
    { kw: "sustainable fashion", vol: 14800, diff: 68 },
    { kw: "organic skincare", vol: 12100, diff: 62 },
    { kw: "artisan jewelry", vol: 3200, diff: 48 },
    { kw: "eco-friendly products", vol: 9900, diff: 58 },
    { kw: "custom gifts online", vol: 6600, diff: 42 },
    { kw: "boutique clothing", vol: 4400, diff: 38 },
    { kw: "small business gifts", vol: 8800, diff: 35 },
    { kw: "handcrafted home decor", vol: 2900, diff: 44 },
    { kw: "premium lifestyle brands", vol: 7200, diff: 65 },
    { kw: "unique birthday gifts", vol: 22000, diff: 70 },
    { kw: "locally made products", vol: 3600, diff: 32 },
    { kw: "ethical shopping", vol: 5100, diff: 50 },
  ];

  return keywords.map(({ kw, vol, diff }) => {
    const yourPos = Math.random() > 0.35 ? null : randInt(8, 50);
    const competitorPos = randInt(1, 15);
    const opportunity = yourPos === null && competitorPos <= 10 ? "high" : yourPos !== null && yourPos > 15 && competitorPos <= 10 ? "medium" : "low";

    return {
      keyword: kw,
      yourPosition: yourPos,
      competitorPosition: competitorPos,
      searchVolume: vol,
      difficulty: diff,
      opportunity: opportunity as "high" | "medium" | "low",
    };
  });
}

function generateCompetitorOverlaps(storeName: string): CompetitorOverlap[] {
  const competitors = [
    { name: "TrendyShop", totalKw: 2450, overlap: 180 },
    { name: "EcoStyle", totalKw: 1890, overlap: 120 },
    { name: "Artisan Market", totalKw: 1650, overlap: 95 },
  ];

  return competitors.map((c) => ({
    competitor: c.name,
    overlappingKeywords: c.overlap,
    totalKeywords: c.totalKw,
    overlapPercent: Math.round((c.overlap / c.totalKw) * 100),
    missedKeywords: ["sustainable fashion online", "eco-friendly gifts", "handmade jewelry store", "organic skincare products"].slice(0, randInt(2, 4)),
  }));
}

function generateBrokenLinks(storeUrl: string): BrokenLink[] {
  const links: BrokenLink[] = [
    { url: `${storeUrl}/collections/discontinued`, sourcePage: `${storeUrl}/collections/all`, statusCode: 404, type: "404", fix: "Remove link from collection page or 301 redirect to /collections/all" },
    { url: `${storeUrl}/products/old-product`, sourcePage: `${storeUrl}/collections/best-sellers`, statusCode: 404, type: "404", fix: "Add 301 redirect to replacement product or remove from best-sellers" },
    { url: `${storeUrl}/pages/old-sale`, sourcePage: `${storeUrl}/`, statusCode: 301, type: "redirect", fix: "Update internal link to point to current sale page directly" },
    { url: `${storeUrl}/blog/outdated-post`, sourcePage: `${storeUrl}/blogs/news`, statusCode: 404, type: "404", fix: "Restore blog post or redirect to related content" },
    { url: `http://external-partner.com/dead-page`, sourcePage: `${storeUrl}/pages/about-us`, statusCode: 404, type: "404", fix: "Remove or update the external link on your About page" },
    { url: `${storeUrl}/collections/summer-2024`, sourcePage: `${storeUrl}/collections/all`, statusCode: 301, type: "redirect", fix: "Update link to current summer collection" },
  ];

  return links.slice(0, randInt(3, links.length));
}

function generateQuickFixes(storeUrl: string, storeName: string, pages: PageAnalysis[]): QuickFix[] {
  const fixes: QuickFix[] = [];
  let fixId = 0;

  // Meta title fixes
  pages.filter((p) => !p.titleOptimal && p.titleLength === 0).slice(0, 3).forEach((p) => {
    const suggestedTitle = `${storeName} — ${p.url.includes("/collections/") ? "Shop Our Collection" : p.url.includes("/products/") ? "Premium Product" : p.url.includes("/blogs/") ? "Blog & Tips" : p.url.includes("/pages/about") ? "About Us" : "Shop Now"} | Free Shipping`;
    fixes.push({
      id: `fix-${++fixId}`,
      type: "meta_title",
      page: p.url,
      current: "(empty)",
      suggested: suggestedTitle,
      impact: 90,
      shopifyAdminLink: `https://admin.shopify.com/store/${slugify(storeName)}/online-store/pages`,
      copyPaste: `<title>${suggestedTitle}</title>`,
    });
  });

  // Meta description fixes
  pages.filter((p) => !p.metaDescriptionOptimal).slice(0, 3).forEach((p) => {
    const desc = p.url.includes("/collections/")
      ? `Browse ${storeName}'s curated collection. Free shipping on orders over $50. Shop quality ${p.url.split("/").pop() || "products"} today.`
      : `Discover what ${storeName} has to offer. Quality products, fast shipping, and exceptional customer service.`;
    fixes.push({
      id: `fix-${++fixId}`,
      type: "meta_description",
      page: p.url,
      current: p.metaDescription || "(empty)",
      suggested: desc,
      impact: 75,
      shopifyAdminLink: `https://admin.shopify.com/store/${slugify(storeName)}/online-store/pages`,
      copyPaste: `<meta name="description" content="${desc}" />`,
    });
  });

  // Alt text fixes
  pages.filter((p) => p.imagesWithoutAlt > 0).slice(0, 2).forEach((p) => {
    fixes.push({
      id: `fix-${++fixId}`,
      type: "alt_text",
      page: p.url,
      current: `${p.imagesWithoutAlt} images without alt text`,
      suggested: 'Add descriptive alt="Product name - Key feature" to all product images',
      impact: 80,
      shopifyAdminLink: `https://admin.shopify.com/store/${slugify(storeName)}/products`,
      copyPaste: `alt="${storeName} product - high quality, free shipping"`,
    });
  });

  // Structured data fixes
  pages.filter((p) => !p.hasStructuredData).slice(0, 2).forEach((p) => {
    const schemaType = p.url.includes("/products/") ? "Product" : p.url.includes("/collections/") ? "CollectionPage" : "WebPage";
    fixes.push({
      id: `fix-${++fixId}`,
      type: "structured_data",
      page: p.url,
      current: "No structured data",
      suggested: `Add ${schemaType} JSON-LD schema`,
      impact: 70,
      shopifyAdminLink: `https://admin.shopify.com/store/${slugify(storeName)}/online-store/themes`,
      copyPaste: `<script type="application/ld+json">{"@context":"https://schema.org/","@type":"${schemaType}","name":"${storeName}","url":"${p.url}"}</script>`,
    });
  });

  // H1 fixes
  pages.filter((p) => p.h1Count === 0 || p.h1Count > 1).slice(0, 1).forEach((p) => {
    fixes.push({
      id: `fix-${++fixId}`,
      type: "h1",
      page: p.url,
      current: p.h1Count === 0 ? "No H1 tag" : `${p.h1Count} H1 tags`,
      suggested: "Use exactly one H1 tag per page describing the main content",
      impact: 65,
      shopifyAdminLink: `https://admin.shopify.com/store/${slugify(storeName)}/online-store/themes`,
      copyPaste: `<h1>${storeName} — Your Main Page Heading</h1>`,
    });
  });

  return fixes.sort((a, b) => b.impact - a.impact);
}

function calculateSeoHealth(pages: PageAnalysis[], keywords: KeywordGap[], brokenLinks: BrokenLink[]): SeoHealthBreakdown {
  const avgPageScore = pages.reduce((s, p) => s + p.score, 0) / pages.length;
  const technical = Math.round(Math.min(100, avgPageScore * 0.4 + (pages.every((p) => p.httpsEnabled) ? 30 : 0) + (brokenLinks.length < 3 ? 20 : 5) + 10));
  const content = Math.round(Math.min(100, avgPageScore * 0.6 + (keywords.filter((k) => k.yourPosition !== null).length / keywords.length) * 40));
  const onpage = Math.round(Math.min(100, pages.filter((p) => p.titleOptimal).length / pages.length * 60 + pages.filter((p) => p.metaDescriptionOptimal).length / pages.length * 40));
  const mobile = Math.round(Math.min(100, pages.filter((p) => p.mobileFriendly).length / pages.length * 100));
  const speed = Math.round(Math.min(100, pages.reduce((s, p) => s + p.pageSpeedScore, 0) / pages.length));

  return { technical, content, onpage, mobile, speed };
}

export function analyzeStore(storeUrl: string, storeName: string): SeoAudit {
  const pageCount = Math.min(20, randInt(12, 20));
  const pages = generatePages(storeUrl, storeName, pageCount);
  const keywordGaps = generateKeywordGaps(storeName);
  const competitorOverlaps = generateCompetitorOverlaps(storeName);
  const brokenLinks = generateBrokenLinks(storeUrl);
  const quickFixes = generateQuickFixes(storeUrl, storeName, pages);
  const seoHealth = calculateSeoHealth(pages, keywordGaps, brokenLinks);

  const overallScore = Math.round(
    seoHealth.technical * 0.25 +
    seoHealth.content * 0.2 +
    seoHealth.onpage * 0.25 +
    seoHealth.mobile * 0.15 +
    seoHealth.speed * 0.15
  );

  return {
    id: generateId(),
    storeUrl,
    storeName,
    overallScore: Math.max(15, Math.min(90, overallScore)),
    scannedAt: new Date().toISOString(),
    pages,
    keywordGaps,
    competitorOverlaps,
    brokenLinks,
    quickFixes,
    seoHealth,
    dashboard: [],
  };
}