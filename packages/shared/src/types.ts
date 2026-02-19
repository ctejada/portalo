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

// Page type
export interface Page {
  id: string;
  user_id: string;
  slug: string;
  title: string;
  bio: string;
  theme: ThemeConfig;
  settings: PageSettings;
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
