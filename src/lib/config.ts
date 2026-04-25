export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
export const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_demo";
export const STRIPE_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID || "price_demo";

export const FREE_TIER_LIMITS = {
  scansPerMonth: 3,
  pagesPerScan: 5,
  competitorComparisons: 2,
};

export const PRO_TIER_LIMITS = {
  scansPerMonth: Infinity,
  pagesPerScan: 50,
  competitorComparisons: 10,
};

export const PRICING = {
  pro: {
    monthly: 29,
    yearly: 280,
  },
};