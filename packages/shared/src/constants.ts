/**
 * Shared constants for Portalo
 * Plan limits, feature flags, and configuration
 */

import type { Plan } from "./types";

// Plan configuration
export interface PlanConfig {
  name: string;
  price: number; // in cents
  stripe_price_id?: string;
  limits: {
    pages: number;
    links_per_page: number;
    api_calls_per_day: number;
    custom_domains: number;
    email_capture: boolean;
    analytics_days: number;
    remove_branding: boolean;
  };
}

export const PLANS: Record<Plan, PlanConfig> = {
  free: {
    name: "Free",
    price: 0,
    limits: {
      pages: 1,
      links_per_page: 10,
      api_calls_per_day: 100,
      custom_domains: 0,
      email_capture: false,
      analytics_days: 7,
      remove_branding: false,
    },
  },
  pro: {
    name: "Pro",
    price: 700, // $7.00
    stripe_price_id: "pro",
    limits: {
      pages: 5,
      links_per_page: 50,
      api_calls_per_day: 10000,
      custom_domains: 1,
      email_capture: true,
      analytics_days: 90,
      remove_branding: true,
    },
  },
  business: {
    name: "Business",
    price: 1900, // $19.00
    stripe_price_id: "business",
    limits: {
      pages: 20,
      links_per_page: 200,
      api_calls_per_day: 50000,
      custom_domains: 5,
      email_capture: true,
      analytics_days: 365,
      remove_branding: true,
    },
  },
};

// Lookup plan by Stripe price key
export function planFromStripePrice(priceId: string): Plan | null {
  for (const [plan, config] of Object.entries(PLANS)) {
    if (config.stripe_price_id === priceId) return plan as Plan;
  }
  return null;
}

// Theme names
export const THEME_NAMES = ["clean", "minimal-dark", "editorial"] as const;
export type ThemeName = (typeof THEME_NAMES)[number];

// Supported platforms for social link detection
export const PLATFORMS = [
  "youtube", "twitter", "instagram", "tiktok",
  "github", "linkedin", "facebook", "twitch",
  "discord", "spotify", "apple-music", "soundcloud",
  "pinterest", "snapchat", "reddit", "telegram",
  "whatsapp", "dribbble",
] as const;

// Link display modes
export const DISPLAY_MODES = ["default", "featured", "icon-only"] as const;

// Default page layout (used when layout column is NULL)
export const DEFAULT_LAYOUT = {
  sections: [
    { type: "header" as const },
    { type: "links" as const },
  ],
  blocks: [] as const,
};

// API versioning
export const API_VERSION = "v1";
export const API_BASE_PATH = `/api/${API_VERSION}`;

// Rate limiting
export const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
export const RATE_LIMIT_MAX_REQUESTS = 60; // per minute for authenticated users

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// Cache TTLs (in seconds)
export const CACHE_TTL = {
  PUBLIC_PAGE: 60, // 1 minute
  ANALYTICS: 300, // 5 minutes
  USER_PROFILE: 60, // 1 minute
} as const;

// Validation limits
export const LIMITS = {
  TITLE_MAX_LENGTH: 100,
  BIO_MAX_LENGTH: 500,
  SLUG_MAX_LENGTH: 64,
  DOMAIN_MAX_LENGTH: 253,
  URL_MAX_LENGTH: 2048,
} as const;
