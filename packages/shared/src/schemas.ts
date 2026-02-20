/**
 * Zod validation schemas for Portalo
 * Used by API routes and MCP server for input validation
 */

import { z } from "zod";

// Slug validation (lowercase letters, numbers, hyphens)
const slugSchema = z
  .string()
  .min(1)
  .max(64)
  .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, and hyphens only");

// Username validation
export const usernameSchema = z
  .string()
  .min(1)
  .max(32)
  .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, and hyphens only");

// Platform enum
export const platformSchema = z.enum([
  "youtube", "twitter", "instagram", "tiktok",
  "github", "linkedin", "facebook", "twitch",
  "discord", "spotify", "apple-music", "soundcloud",
  "pinterest", "snapchat", "reddit", "telegram",
  "whatsapp", "dribbble",
]);

// Display mode enum
export const displayModeSchema = z.enum(["default", "featured", "icon-only"]);

// Theme schema
export const themeSchema = z.object({
  name: z.enum(["clean", "minimal-dark", "editorial"]).default("clean"),
  colors: z.record(z.string()).optional(),
});

// Page settings schema
export const pageSettingsSchema = z.object({
  show_email_capture: z.boolean().default(true),
  show_powered_by: z.boolean().default(true),
});

// Section schema
export const sectionSchema = z.object({
  type: z.enum(["header", "icon-bar", "links", "block"]),
  id: z.string().optional(),
});

// Block config schema
export const blockConfigSchema = z.object({
  id: z.string().min(1),
  kind: z.enum(["spacer", "divider", "text"]),
  props: z.object({
    height: z.number().int().min(8).max(96).optional(),
    text: z.string().max(500).optional(),
  }),
});

// Page layout schema
export const pageLayoutSchema = z.object({
  sections: z.array(sectionSchema).min(1).max(20),
  blocks: z.array(blockConfigSchema).max(10),
});

// Create page schema
export const createPageSchema = z.object({
  slug: slugSchema,
  title: z.string().max(100).optional().default(""),
  bio: z.string().max(500).optional().default(""),
  theme: themeSchema.optional(),
  settings: pageSettingsSchema.optional(),
});

// Update page schema (all fields optional)
export const updatePageSchema = z.object({
  slug: slugSchema.optional(),
  title: z.string().max(100).optional(),
  bio: z.string().max(500).optional(),
  theme: themeSchema.optional(),
  settings: pageSettingsSchema.partial().optional(),
  layout: pageLayoutSchema.optional(),
  published: z.boolean().optional(),
});

// Create link schema
export const createLinkSchema = z.object({
  url: z.string().url("Must be a valid URL"),
  title: z.string().min(1).max(100),
  thumbnail_url: z.string().url().optional(),
  platform: platformSchema.nullable().optional(),
  display_mode: displayModeSchema.optional().default("default"),
  position: z.number().int().min(0).optional(),
  visible: z.boolean().optional().default(true),
  schedule_start: z.string().datetime().optional(),
  schedule_end: z.string().datetime().optional(),
});

// Update link schema
export const updateLinkSchema = z.object({
  url: z.string().url("Must be a valid URL").optional(),
  title: z.string().min(1).max(100).optional(),
  thumbnail_url: z.string().url().nullable().optional(),
  platform: platformSchema.nullable().optional(),
  display_mode: displayModeSchema.optional(),
  position: z.number().int().min(0).optional(),
  visible: z.boolean().optional(),
  schedule_start: z.string().datetime().nullable().optional(),
  schedule_end: z.string().datetime().nullable().optional(),
});

// Reorder links schema
export const reorderLinksSchema = z.object({
  link_ids: z.array(z.string().uuid()).min(1),
});

// Create domain schema
export const createDomainSchema = z.object({
  domain: z
    .string()
    .min(1)
    .max(253)
    .regex(
      /^[a-zA-Z0-9][a-zA-Z0-9-_.]+[a-zA-Z0-9]$/,
      "Invalid domain format"
    ),
  page_id: z.string().uuid(),
});

// Email capture schema
export const emailCaptureSchema = z.object({
  email: z.string().email("Must be a valid email"),
  page_id: z.string().uuid(),
});

// Analytics query schema (page_id optional for aggregate queries)
export const analyticsQuerySchema = z.object({
  page_id: z.string().uuid().optional(),
  period: z.enum(["7d", "30d", "90d"]).default("7d"),
});

// Track event schema
export const trackEventSchema = z.object({
  page_id: z.string().uuid(),
  link_id: z.string().uuid().optional(),
  event_type: z.enum(["view", "click", "email_capture"]),
  referrer: z.string().optional(),
  country: z.string().optional(),
  device: z.enum(["mobile", "tablet", "desktop"]).optional(),
  browser: z.string().optional(),
  visitor_id: z.string().max(64).optional(),
  time_to_click_ms: z.number().int().min(0).max(300000).optional(),
});

// Type exports from schemas
export type CreatePageInput = z.infer<typeof createPageSchema>;
export type UpdatePageInput = z.infer<typeof updatePageSchema>;
export type CreateLinkInput = z.infer<typeof createLinkSchema>;
export type UpdateLinkInput = z.infer<typeof updateLinkSchema>;
export type ReorderLinksInput = z.infer<typeof reorderLinksSchema>;
export type CreateDomainInput = z.infer<typeof createDomainSchema>;
export type EmailCaptureInput = z.infer<typeof emailCaptureSchema>;
export type UsernameInput = z.infer<typeof usernameSchema>;
export type AnalyticsQueryInput = z.infer<typeof analyticsQuerySchema>;
export type TrackEventInput = z.infer<typeof trackEventSchema>;
export type PageLayoutInput = z.infer<typeof pageLayoutSchema>;
export type BlockConfigInput = z.infer<typeof blockConfigSchema>;
