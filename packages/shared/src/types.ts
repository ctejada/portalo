/**
 * Core type definitions for Portalo
 * These types are shared between the web app, MCP server, and edge workers
 */

// User plan types
export type Plan = "free" | "pro" | "business";

// Profile type (extends Supabase auth.users)
export interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  plan: Plan;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  api_key_hash: string | null;
  api_calls_today: number;
  api_calls_reset_at: string;
  created_at: string;
  updated_at: string;
}

// Platform identifiers for social links
export type Platform =
  | "youtube" | "twitter" | "instagram" | "tiktok"
  | "github" | "linkedin" | "facebook" | "twitch"
  | "discord" | "spotify" | "apple-music" | "soundcloud"
  | "pinterest" | "snapchat" | "reddit" | "telegram"
  | "whatsapp" | "dribbble";

// Link display modes
export type DisplayMode = "default" | "featured" | "icon-only";

// Page theme configuration
export interface ThemeConfig {
  name: "clean" | "minimal-dark" | "editorial";
  colors?: Record<string, string>;
}

// Page settings
export interface PageSettings {
  show_email_capture: boolean;
  show_powered_by: boolean;
}

// Page layout types
export type SectionType = "header" | "icon-bar" | "links" | "block";

export interface Section {
  type: SectionType;
  id?: string; // Only for "block" sections — references a block in blocks[]
}

export type BlockKind = "spacer" | "divider" | "text";

export interface BlockConfig {
  id: string;
  kind: BlockKind;
  props: {
    height?: number; // spacer: height in px (8-96)
    text?: string;   // text block: plain text content
  };
}

export interface PageLayout {
  sections: Section[];
  blocks: BlockConfig[];
}

// Page type
export interface Page {
  id: string;
  user_id: string;
  slug: string;
  title: string;
  bio: string;
  theme: ThemeConfig;
  settings: PageSettings;
  layout: PageLayout | null;
  published: boolean;
  views_count: number;
  created_at: string;
  updated_at: string;
}

// Link type
export interface Link {
  id: string;
  page_id: string;
  url: string;
  title: string;
  thumbnail_url: string | null;
  platform: Platform | null;
  display_mode: DisplayMode;
  position: number;
  visible: boolean;
  schedule_start: string | null;
  schedule_end: string | null;
  clicks: number;
  created_at: string;
  updated_at: string;
}

// Custom domain type
export interface Domain {
  id: string;
  page_id: string;
  domain: string;
  verified: boolean;
  ssl_status: "pending" | "active" | "error";
  created_at: string;
  updated_at: string;
}

// Analytics event type
export type EventType = "view" | "click" | "email_capture";
export type DeviceType = "mobile" | "tablet" | "desktop";

export interface AnalyticsEvent {
  id: number;
  page_id: string;
  link_id: string | null;
  event_type: EventType;
  referrer: string | null;
  country: string | null;
  device: DeviceType | null;
  browser: string | null;
  created_at: string;
}

// Contact (email capture) type
export interface Contact {
  id: string;
  page_id: string;
  email: string;
  source: string | null;
  created_at: string;
}

// API response wrapper
export interface ApiResponse<T> {
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}
