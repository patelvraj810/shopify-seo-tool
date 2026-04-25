export interface SeoAudit {
  id: string;
  storeUrl: string;
  storeName: string;
  overallScore: number;
  scannedAt: string;
  pages: PageAnalysis[];
  keywordGaps: KeywordGap[];
  competitorOverlaps: CompetitorOverlap[];
  brokenLinks: BrokenLink[];
  quickFixes: QuickFix[];
  seoHealth: SeoHealthBreakdown;
  dashboard: DashboardTab[];
}

export interface PageAnalysis {
  url: string;
  title: string;
  titleLength: number;
  titleOptimal: boolean;
  metaDescription: string;
  metaDescriptionLength: number;
  metaDescriptionOptimal: boolean;
  h1Tag: string | null;
  h1Count: number;
  imagesWithoutAlt: number;
  totalImages: number;
  hasStructuredData: boolean;
  canonicalUrl: string | null;
  pageSpeedScore: number;
  mobileFriendly: boolean;
  httpsEnabled: boolean;
  issues: PageIssue[];
  score: number;
}

export interface PageIssue {
  severity: "critical" | "warning" | "info";
  category: string;
  message: string;
  fix: string;
}

export interface KeywordGap {
  keyword: string;
  yourPosition: number | null;
  competitorPosition: number;
  searchVolume: number;
  difficulty: number;
  opportunity: "high" | "medium" | "low";
}

export interface CompetitorOverlap {
  competitor: string;
  overlappingKeywords: number;
  totalKeywords: number;
  overlapPercent: number;
  missedKeywords: string[];
}

export interface BrokenLink {
  url: string;
  sourcePage: string;
  statusCode: number;
  type: "404" | "redirect" | "timeout" | "ssl";
  fix: string;
}

export interface QuickFix {
  id: string;
  type: "meta_title" | "meta_description" | "alt_text" | "structured_data" | "canonical" | "h1";
  page: string;
  current: string;
  suggested: string;
  impact: number;
  shopifyAdminLink: string;
  copyPaste: string;
}

export interface SeoHealthBreakdown {
  technical: number;
  content: number;
  onpage: number;
  mobile: number;
  speed: number;
}

export type DashboardTab =
  | "overview"
  | "pages"
  | "keywords"
  | "competitors"
  | "broken_links"
  | "quick_fixes"
  | "liquid_audit"
  | "traffic_drift"
  | "structured_data"
  | "sitemap"
  | "settings";