# Portalo MVP Implementation Plan

## Overview

A step-by-step implementation plan for the Portalo link-in-bio MVP with **256 small, reviewable commits** across 12 sprints. Each commit is designed to be reviewable in under 15 minutes and includes relevant tests.

**Key Architectural Principles:**
- API-first: Build REST API endpoints before GUI components
- Every GUI component consumes the same API that agents will use
- Edge-served public pages via Cloudflare Workers + R2 cache
- MCP server ships at MVP (not v2)

---

## Sprint Summary

| Sprint | Weeks | Commits | Key Deliverables |
|--------|-------|---------|------------------|
| 1 | 1-2 | 1-38 | Monorepo, design system, auth, dashboard shell, deploy |
| 2 | 3-4 | 39-72 | Pages/Links CRUD API, page editor, drag-drop, preview |
| 3 | 5-6 | 73-88 | Public pages, 3 themes, click tracking, SEO |
| 4 | 7-8 | 89-110 | Analytics, email capture, contacts, API keys |
| 5 | 9-10 | 111-139 | Stripe billing, custom domains, MCP server |
| 6 | 11-12 | 140-160 | PWA, edge caching, E2E tests, landing page |
| 7 | - | 161-168 | MCP feature improvements (15 tools) |
| 8 | - | 169-171 | Copy link UX |
| 9 | - | 172-183 | Username URLs + analytics overhaul |
| 10 | - | 184-213 | Page customization (API/MCP-first) |
| 11 | - | 214-233 | Free tier analytics upgrade (unique visitors, hourly, bounce rate) |
| 12 | - | 234-256 | Pro analytics (CSV export, GA/Pixel, date ranges, real-time) |

---

## SPRINT 1: Foundation (Weeks 1-2)

### Phase 1A: Monorepo & Tooling Setup (Commits 1-5)

| # | Commit | Files | Tests |
|---|--------|-------|-------|
| 1 | Initialize Turborepo monorepo | `package.json`, `pnpm-workspace.yaml`, `turbo.json`, `.gitignore`, `.nvmrc` | None |
| 2 | Create Next.js 15 app scaffold | `apps/web/package.json`, `app/layout.tsx`, `app/page.tsx` | Build passes |
| 3 | Create shared types package | `packages/shared/src/types.ts`, `schemas.ts`, `constants.ts` | Placeholder tests |
| 4 | Configure ESLint + Prettier | `eslint.config.js`, `.prettierrc` | `pnpm lint` passes |
| 5 | Set up Vitest | `vitest.config.ts`, `vitest.workspace.ts` | Example test |

### Phase 1B: Design System (Commits 6-13)

| # | Commit | Files | Tests |
|---|--------|-------|-------|
| 6-7 | Implement design system with Tailwind CSS 4 | `app/globals.css`, `tailwind.config.ts`, `postcss.config.js` | Build passes, classes compile |
| 8 | Create Button component | `components/ui/button.tsx` | Variants, sizes |
| 9 | Create Input + Textarea | `components/ui/input.tsx`, `textarea.tsx` | Focus, disabled |
| 10 | Create Toggle + Badge | `components/ui/toggle.tsx`, `badge.tsx` | States |
| 11 | Create Skeleton loader | `components/ui/skeleton.tsx` | Animation |
| 12 | Create Toast (Sonner) | `components/ui/toast.tsx`, `toast-provider.tsx` | Auto-dismiss |
| 13 | Create UI barrel export | `components/ui/index.ts` | None |

### Phase 1C: Database (Commits 14-22)

| # | Commit | Files | Tests |
|---|--------|-------|-------|
| 14 | Initialize Supabase config | `supabase/config.toml`, `.env.example` | None |
| 15 | Migration: profiles + trigger | `001_create_profiles.sql` | Applies |
| 16 | Migration: pages | `002_create_pages.sql` | Applies |
| 17 | Migration: links | `003_create_links.sql` | FK works |
| 18 | Migration: domains | `004_create_domains.sql` | Applies |
| 19 | Migration: analytics (partitioned) | `005_create_analytics.sql` | Partitions |
| 20 | Migration: contacts | `006_create_contacts.sql` | Applies |
| 21 | Migration: RLS policies | `007_rls_policies.sql` | Security |
| 22 | Create seed data | `supabase/seed.sql` | Loads |

### Phase 1D: Supabase Clients (Commits 23-25)

| # | Commit | Files | Tests |
|---|--------|-------|-------|
| 23 | Browser client | `lib/supabase/client.ts` | Instantiates |
| 24 | Server client (cookies) | `lib/supabase/server.ts` | Server works |
| 25 | Admin client (service role) | `lib/supabase/admin.ts` | Bypasses RLS |

### Phase 1E: Authentication (Commits 26-31)

| # | Commit | Files | Tests |
|---|--------|-------|-------|
| 26 | Auth callback route | `app/(auth)/auth/callback/route.ts` | Exchanges code |
| 27 | Auth layout (centered) | `app/(auth)/layout.tsx` | Renders |
| 28 | Login + Google OAuth | `app/(auth)/login/page.tsx`, `google-button.tsx` | Initiates flow |
| 29 | Magic link auth | `magic-link-form.tsx` | Sends email |
| 30 | Signup page | `app/(auth)/signup/page.tsx` | Both methods |
| 31 | Auth middleware | `middleware.ts`, `lib/supabase/middleware.ts` | Redirects |

### Phase 1F: Dashboard Shell (Commits 32-36)

| # | Commit | Files | Tests |
|---|--------|-------|-------|
| 32 | Dashboard layout + sidebar | `app/(dashboard)/layout.tsx`, `sidebar.tsx` | Nav items |
| 33 | Dashboard home (empty) | `app/(dashboard)/dashboard/page.tsx` | Empty state |
| 34 | use-user hook (SWR) | `hooks/use-user.ts` | Returns user |
| 35 | User nav in sidebar | `user-nav.tsx` | Avatar + name |
| 36 | Sign out | Update `user-nav.tsx` | Clears session |

### Phase 1G: Deployment (Commits 37-38)

| # | Commit | Files | Tests |
|---|--------|-------|-------|
| 37 | Cloudflare Pages deploy | `wrangler.toml`, `.github/workflows/deploy.yml` | CI builds |
| 38 | Env validation | `lib/env.ts` | Helpful errors |

---

## SPRINT 2: Core CRUD (Weeks 3-4)

### Phase 2A: Shared Schemas (Commits 39-41)

| # | Commit | Files | Tests |
|---|--------|-------|-------|
| 39 | Page + Link interfaces | `packages/shared/src/types.ts` | Compiles |
| 40 | Page Zod schemas | `schemas.ts` | Validates slugs |
| 41 | Link Zod schemas | `schemas.ts` | Validates URLs |

### Phase 2B: Pages API (Commits 42-47)

| # | Commit | Files | Tests |
|---|--------|-------|-------|
| 42 | API auth helper | `lib/api-auth.ts` | Bearer token |
| 43 | GET /api/v1/pages | `app/api/v1/pages/route.ts` | Returns list |
| 44 | POST /api/v1/pages | Same file | Creates page |
| 45 | GET /api/v1/pages/[id] | `app/api/v1/pages/[id]/route.ts` | Returns details |
| 46 | PUT /api/v1/pages/[id] | Same file | Updates |
| 47 | DELETE /api/v1/pages/[id] | Same file | Deletes |

### Phase 2C: Dashboard Pages List (Commits 48-52)

| # | Commit | Files | Tests |
|---|--------|-------|-------|
| 48 | use-pages hook | `hooks/use-pages.ts` | Fetches |
| 49 | Page list component | `page-list.tsx`, `page-row.tsx` | Renders list |
| 50 | Dashboard home update | Update `dashboard/page.tsx` | Shows list |
| 51 | New page dialog | `dialog.tsx`, `new-page-dialog.tsx` | Opens/closes |
| 52 | Wire "+ New page" | Update `dashboard/page.tsx` | Redirects |

### Phase 2D: Links API (Commits 53-57)

| # | Commit | Files | Tests |
|---|--------|-------|-------|
| 53 | GET /pages/[id]/links | `app/api/v1/pages/[id]/links/route.ts` | Ordered list |
| 54 | POST /pages/[id]/links | Same file | Creates link |
| 55 | PUT /pages/[id]/links/[linkId] | `[linkId]/route.ts` | Updates |
| 56 | DELETE /pages/[id]/links/[linkId] | Same file | Deletes |
| 57 | PATCH /links/reorder | `links/reorder/route.ts` | Reorders |

### Phase 2E: Page Editor (Commits 58-69)

| # | Commit | Files | Tests |
|---|--------|-------|-------|
| 58 | Editor layout (split view) | `pages/[id]/page.tsx`, `page-editor.tsx` | Split renders |
| 59 | use-page hook | `hooks/use-page.ts` | Fetches by ID |
| 60 | use-links hook | `hooks/use-links.ts` | Fetches links |
| 61 | Title/bio inline edit | `inline-edit.tsx` | Autosave 500ms |
| 62 | Link list container | `link-list.tsx` | Renders order |
| 63 | Link row component | `link-row.tsx` | Title, URL, actions |
| 64 | Add @dnd-kit drag-drop | Update `link-list.tsx`, `link-row.tsx` | Drag handle |
| 65 | Wire drag to reorder API | Update `link-list.tsx` | Persists |
| 66 | Inline link add form | `link-form.tsx` | Validates URL |
| 67 | Link edit in row | Update `link-row.tsx` | Inline expand |
| 68 | Link delete | Update `link-row.tsx` | Confirmation |
| 69 | Link visibility toggle | Update `link-row.tsx` | Toggle works |

### Phase 2F: Phone Preview (Commits 70-72)

| # | Commit | Files | Tests |
|---|--------|-------|-------|
| 70 | Preview frame | `phone-preview.tsx` | 375px width |
| 71 | Preview content | `preview-content.tsx` | Renders page |
| 72 | Live update | Wire to editor state | Debounced |

---

## SPRINT 3: Public Pages + Themes (Weeks 5-6)

### Phase 3A: Public API (Commits 73-74)

| # | Commit | Files | Tests |
|---|--------|-------|-------|
| 73 | GET /public/page/[slug] | `app/api/v1/public/page/[slug]/route.ts` | Returns page |
| 74 | POST /public/track | `app/api/v1/public/track/route.ts` | Records events |

### Phase 3B: Public Components (Commits 75-77)

| # | Commit | Files | Tests |
|---|--------|-------|-------|
| 75 | creator-page component | `components/public/creator-page.tsx` | Base render |
| 76 | link-item component | `components/public/link-item.tsx` | Clickable row |
| 77 | powered-by footer | `components/public/powered-by.tsx` | Conditional |

### Phase 3C: Theme System (Commits 78-83)

| # | Commit | Files | Tests |
|---|--------|-------|-------|
| 78 | Theme config types | `packages/shared/src/types.ts` | Compiles |
| 79 | "Clean" theme | `themes/clean.tsx` | Typography-driven |
| 80 | "Minimal Dark" theme | `themes/minimal-dark.tsx` | Dark bg |
| 81 | "Editorial" theme | `themes/editorial.tsx` | Serif, numbered |
| 82 | Theme selector | `theme-picker.tsx` | 3 previews |
| 83 | Wire theme to API | Update `page-editor.tsx` | Persists |

### Phase 3D: Public Route (Commits 84-86)

| # | Commit | Files | Tests |
|---|--------|-------|-------|
| 84 | [slug] catch-all | `app/[slug]/page.tsx` | Renders theme |
| 85 | Click tracking | Update `link-item.tsx` | Fires request |
| 86 | View tracking | Update `[slug]/page.tsx` | Records view |

### Phase 3E: SEO (Commits 87-88)

| # | Commit | Files | Tests |
|---|--------|-------|-------|
| 87 | Dynamic meta tags | `lib/metadata.ts`, update `[slug]/page.tsx` | og:title |
| 88 | OpenGraph image | `[slug]/opengraph-image.tsx` | Generates |

---

## SPRINT 4: Analytics + Contacts + API Keys (Weeks 7-8)

### Phase 4A: Analytics API (Commits 89-90)

| # | Commit | Files | Tests |
|---|--------|-------|-------|
| 89 | GET /analytics/overview | `app/api/v1/analytics/overview/route.ts` | Views, clicks |
| 90 | GET /analytics/timeseries | `app/api/v1/analytics/timeseries/route.ts` | Daily data |

### Phase 4B: Analytics Dashboard (Commits 91-96)

| # | Commit | Files | Tests |
|---|--------|-------|-------|
| 91 | Analytics page | `dashboard/analytics/page.tsx` | Period selector |
| 92 | Metrics row | `metrics-row.tsx` | Views, clicks, CTR |
| 93 | use-analytics hook | `hooks/use-analytics.ts` | Fetches data |
| 94 | Recharts chart | `analytics-chart.tsx` | Two lines |
| 95 | Top links table | `top-links-table.tsx` | Sorted by clicks |
| 96 | Referrers + countries | `referrers-table.tsx`, `countries-table.tsx` | Side-by-side |

### Phase 4C: Email Capture (Commits 97-99)

| # | Commit | Files | Tests |
|---|--------|-------|-------|
| 97 | POST /public/capture | `app/api/v1/public/capture/route.ts` | Prevents dupes |
| 98 | Email capture widget | `components/public/email-capture.tsx` | Validates |
| 99 | Add to public page | Update `creator-page.tsx` | Shows if enabled |

### Phase 4D: Contacts (Commits 100-103)

| # | Commit | Files | Tests |
|---|--------|-------|-------|
| 100 | GET /contacts | `app/api/v1/contacts/route.ts` | Returns list |
| 101 | POST /contacts/export | `app/api/v1/contacts/export/route.ts` | CSV download |
| 102 | Contacts page | `dashboard/contacts/page.tsx`, `contacts-table.tsx` | Table |
| 103 | Export button | Update contacts page | Downloads CSV |

### Phase 4E: API Keys (Commits 104-107)

| # | Commit | Files | Tests |
|---|--------|-------|-------|
| 104 | POST /account/api-key | `app/api/v1/account/api-key/route.ts` | Generates key |
| 105 | API key auth | Update `lib/api-auth.ts` | X-API-Key header |
| 106 | Rate limiting | `lib/rate-limit.ts` | By plan tier |
| 107 | API settings page | `settings/api/page.tsx`, `api-key-panel.tsx` | Generate/view |

### Phase 4F: Settings (Commits 108-110)

| # | Commit | Files | Tests |
|---|--------|-------|-------|
| 108 | Settings profile page | `settings/page.tsx` | Profile section |
| 109 | GET /account | `app/api/v1/account/route.ts` | Returns profile |
| 110 | Avatar upload | Update settings page | Uploads to Storage |

---

## SPRINT 5: Billing + Domains + MCP (Weeks 9-10)

### Phase 5A: Stripe Setup (Commits 111-115)

| # | Commit | Files | Tests |
|---|--------|-------|-------|
| 111 | Stripe client | `lib/stripe.ts` | Initializes |
| 112 | Plan constants | `packages/shared/src/constants.ts` | Price IDs |
| 113 | Checkout session | `app/api/v1/billing/checkout/route.ts` | Creates session |
| 114 | Webhook handler | `app/api/webhooks/stripe/route.ts` | Events |
| 115 | Billing portal | `app/api/v1/billing/portal/route.ts` | Returns URL |

### Phase 5B: Billing UI (Commits 116-119)

| # | Commit | Files | Tests |
|---|--------|-------|-------|
| 116 | Billing page | `settings/billing/page.tsx` | Shows plan |
| 117 | Plan badge | `plan-badge.tsx` | Free/pro/business |
| 118 | Upgrade buttons | Update billing page | Redirects Stripe |
| 119 | Manage billing link | Update billing page | Opens portal |

### Phase 5C: Plan Gating (Commits 120-123)

| # | Commit | Files | Tests |
|---|--------|-------|-------|
| 120 | Plan gate helper | `lib/plan-gate.ts` | Checks limits |
| 121 | Page limit | Update `pages/route.ts` | 1 page free |
| 122 | Link limit | Update `links/route.ts` | 10 links free |
| 123 | Gate email capture | Update `capture/route.ts` | Pro only |

### Phase 5D: Custom Domains (Commits 124-128)

| # | Commit | Files | Tests |
|---|--------|-------|-------|
| 124 | POST /domains | `app/api/v1/domains/route.ts` | Creates record |
| 125 | GET /domains/[id]/verify | `verify/route.ts` | DNS check |
| 126 | DELETE /domains/[id] | `[id]/route.ts` | Removes |
| 127 | Domain settings page | `settings/domain/page.tsx`, `domain-setup.tsx` | CNAME |
| 128 | Verification status | Update `domain-setup.tsx` | Pending/verified |

### Phase 5E: MCP Server (Commits 129-139)

| # | Commit | Files | Tests |
|---|--------|-------|-------|
| 129 | Initialize package | `packages/mcp-server/package.json`, `src/index.ts` | Builds |
| 130 | API client wrapper | `src/api-client.ts` | Auth requests |
| 131 | MCP server + list_pages | `src/server.ts`, `tools/pages.ts` | Returns pages |
| 132 | get_page tool | Update `tools/pages.ts` | Page details |
| 133 | Link tools | `src/tools/links.ts` | add/update/remove |
| 134 | reorder_links tool | Update `tools/links.ts` | Reorders |
| 135 | get_analytics tool | `src/tools/analytics.ts` | Returns data |
| 136 | export_contacts tool | `src/tools/contacts.ts` | Returns list |
| 137 | update_theme tool | Update `tools/pages.ts` | Changes theme |
| 138 | .well-known/mcp.json | `app/.well-known/mcp.json/route.ts` | Discovery |
| 139 | npm publish config | `README.md`, update `package.json` | Publishable |

---

## SPRINT 6: Polish + PWA + Launch (Weeks 11-12)

### Phase 6A: PWA (Commits 140-141)

| # | Commit | Files | Tests |
|---|--------|-------|-------|
| 140 | PWA manifest | `public/manifest.json`, icons | Manifest loads |
| 141 | Service worker | `public/sw.js` | Offline shell |

### Phase 6B: Link Scheduling (Commits 142-143)

| # | Commit | Files | Tests |
|---|--------|-------|-------|
| 142 | Schedule fields | Update `link-form.tsx` | Date pickers |
| 143 | Filter by schedule | Update `public/page/[slug]/route.ts` | Time window |

### Phase 6C: Edge Caching (Commits 144-147)

| # | Commit | Files | Tests |
|---|--------|-------|-------|
| 144 | CF Worker renderer | `workers/page-renderer/src/index.ts` | Fetches |
| 145 | R2 cache write | Update worker | Caches to R2 |
| 146 | Cache invalidation | `lib/cache.ts` | Removes object |
| 147 | Invalidate on save | Update `pages/[id]/route.ts` | Clears cache |

### Phase 6D: Error Tracking (Commit 148)

| # | Commit | Files | Tests |
|---|--------|-------|-------|
| 148 | Sentry integration | `sentry.client.config.ts`, `sentry.server.config.ts` | Reports |

### Phase 6E: E2E Tests (Commits 149-152)

| # | Commit | Files | Tests |
|---|--------|-------|-------|
| 149 | Playwright setup | `playwright.config.ts`, `e2e/` | Runs |
| 150 | Signup + create page | `e2e/auth-and-create-page.spec.ts` | Full flow |
| 151 | Links + reorder | `e2e/link-management.spec.ts` | CRUD + drag |
| 152 | Public page + click | `e2e/public-page.spec.ts` | Tracking |

### Phase 6F: Landing + SEO (Commits 153-156)

| # | Commit | Files | Tests |
|---|--------|-------|-------|
| 153 | Landing page | `app/page.tsx`, `marketing/hero.tsx`, `features.tsx` | Renders |
| 154 | sitemap.xml | `app/sitemap.ts` | Includes pages |
| 155 | robots.txt | `app/robots.ts` | Accessible |
| 156 | Structured data | Update `[slug]/page.tsx` | JSON-LD |

### Phase 6G: Final Polish (Commits 157-160)

| # | Commit | Files | Tests |
|---|--------|-------|-------|
| 157 | 404 page | `app/not-found.tsx` | Renders |
| 158 | Loading states | `loading.tsx` files | Skeletons |
| 159 | Mobile sidebar | Update `sidebar.tsx` | Bottom tab bar |
| 160 | Performance audit | Various optimizations | Lighthouse >90 |

---

## SPRINT 10: Page Customization (Commits 184-213)

**Goal**: Add comprehensive customization following API/MCP-first principle

### Design Philosophy
Every customization feature must be:
1. **API endpoint first** - fully functional via REST
2. **MCP tool second** - thin wrapper for AI agents (test before GUI!)
3. **GUI third** - consumes the same API as MCP

### Phase 10A: Database + Schemas (Commits 184-186)

| # | Commit | Files | Tests |
|---|--------|-------|-------|
| 184 | Migration: add platform, display_mode to links | `010_add_link_customization.sql` | Applies |
| 185 | Migration: add layout to pages | `011_add_page_layout.sql` | Applies |
| 186 | Extend Zod schemas for customization | `packages/shared/src/schemas.ts`, `types.ts` | Validates |

### Phase 10B: API Endpoints (Commits 187-192)

| # | Commit | Files | Tests |
|---|--------|-------|-------|
| 187 | Platform detection utility | `lib/platforms.ts` | Detects 18 platforms |
| 188 | Extend PUT /pages/:id for layout + colors | `api/v1/pages/[id]/route.ts` | Updates layout/colors |
| 189 | PUT /pages/:id/layout endpoint | `api/v1/pages/[id]/layout/route.ts` | Reorders sections |
| 190 | POST/DELETE /pages/:id/blocks endpoints | `api/v1/pages/[id]/blocks/route.ts` | CRUD blocks |
| 191 | Extend links API for platform + display_mode | `api/v1/pages/[id]/links/route.ts` | Auto-detect |
| 192 | GET /utils/detect-platform endpoint | `api/v1/utils/detect-platform/route.ts` | Returns platform |

### Phase 10C: MCP Tools (Commits 193-197)

| # | Commit | Files | Tests |
|---|--------|-------|-------|
| 193 | update_design MCP tool | `mcp-server/tools/design.ts` | Changes colors |
| 194 | set_layout MCP tool | `mcp-server/tools/layout.ts` | Reorders sections |
| 195 | add_block + remove_block MCP tools | `mcp-server/tools/layout.ts` | Block CRUD |
| 196 | set_link_display MCP tool | `mcp-server/tools/links.ts` | Inline/icon-bar |
| 197 | Update MCP discovery + bump to v0.3.0 | `.well-known/mcp.json`, `package.json` | 19 tools |

### Phase 10D: Public Page Rendering (Commits 198-203)

| # | Commit | Files | Tests |
|---|--------|-------|-------|
| 198 | Social icons component | `components/icons/social-icons.tsx` | 18 icons render |
| 199 | Theme system: custom color merge | `lib/themes.ts` | Merges colors |
| 200 | Icon bar component | `components/public/icon-bar.tsx` | Renders socials |
| 201 | Block components | `components/public/blocks/` | Spacer/divider/text |
| 202 | Update creator-page for dynamic sections | `components/public/creator-page.tsx` | Section order |
| 203 | Update link-item for platform icons | `components/public/link-item.tsx` | Shows icon |

### Phase 10E: Dashboard GUI (Commits 204-210)

| # | Commit | Files | Tests |
|---|--------|-------|-------|
| 204 | Color picker component | `components/ui/color-picker.tsx` | Native + hex |
| 205 | Color customizer panel | `components/dashboard/color-customizer.tsx` | 5 color inputs |
| 206 | Section list + drag-drop | `components/dashboard/section-list.tsx` | Reorders |
| 207 | Add block dropdown menu | `components/dashboard/add-block-menu.tsx` | Spacer/div/text |
| 208 | Link form: platform auto-detect | `components/dashboard/link-form.tsx` | Shows icon preview |
| 209 | Link row: icon + display mode toggle | `components/dashboard/link-row.tsx` | Toggle button |
| 210 | Integrate into page editor | `components/dashboard/page-editor.tsx` | All panels |

### Phase 10F: Polish (Commits 211-213)

| # | Commit | Files | Tests |
|---|--------|-------|-------|
| 211 | Progressive disclosure | Various | Collapsed by default |
| 212 | Backfill migration script | `scripts/backfill-platforms.ts` | Detects existing |
| 213 | Build verification + docs | Progress docs | pnpm build passes |

---

## SPRINT 11: Free Tier Analytics Upgrade (Commits 214-233)

**Goal**: Make Portalo Free objectively better than Linktree Starter ($5/mo) by adding unique visitors, hourly analytics, bounce rate, time-to-click, browser breakdown, and link velocity — all for free.

**Competitive Context**: Linktree gates device/location/referrer data behind $5/mo. Portalo already gives these free. Sprint 11 extends this advantage with features nobody offers at any price (hourly analytics, link velocity, bounce rate).

### Phase 11A: Database + Schemas (Commits 214-216)

| # | Commit | Files | Tests |
|---|--------|-------|-------|
| 214 | Migration: add visitor_id, time_to_click_ms to analytics_events | `supabase/migrations/012_enhanced_analytics.sql` | Applies, new columns exist |
| 215 | Extend trackEventSchema with visitor_id, time_to_click_ms | `packages/shared/src/schemas.ts`, `types.ts` | Validates new fields |
| 216 | Add analyticsGranularity + enhanced query params to schemas | `packages/shared/src/schemas.ts` | Validates hourly/daily enum |

### Phase 11B: Client-Side Tracking Enhancements (Commits 217-220)

| # | Commit | Files | Tests |
|---|--------|-------|-------|
| 217 | Generate anonymous visitor_id cookie in view-tracker | `components/public/view-tracker.tsx` | Sets cookie, sends visitor_id |
| 218 | Detect and send device + browser from client in track calls | `components/public/view-tracker.tsx`, `link-item.tsx` | Sends user-agent data |
| 219 | Measure time-to-click (page load to first link click) | `components/public/view-tracker.tsx`, `link-item.tsx` | Timing data sent |
| 220 | Update free tier analytics_days from 7 to 28 | `packages/shared/src/constants.ts` | Free = 28 days |

### Phase 11C: Enhanced Analytics API Endpoints (Commits 221-226)

| # | Commit | Files | Tests |
|---|--------|-------|-------|
| 221 | Add unique views + unique clicks to overview endpoint | `api/v1/analytics/overview/route.ts` | Returns unique_views, unique_clicks |
| 222 | Add bounce rate to overview endpoint | `api/v1/analytics/overview/route.ts` | Returns bounce_rate percentage |
| 223 | Add average time-to-click to overview endpoint | `api/v1/analytics/overview/route.ts` | Returns avg_time_to_click_ms |
| 224 | Add browser breakdown to breakdown endpoint | `api/v1/analytics/breakdown/route.ts` | Returns browsers array |
| 225 | GET /analytics/hourly endpoint for time-of-day data | `api/v1/analytics/hourly/route.ts` (new) | Returns 24-hour bucketed data |
| 226 | Add link velocity to top-links endpoint | `api/v1/analytics/top-links/route.ts` | Returns velocity_pct per link |

### Phase 11D: Dashboard UI (Commits 227-231)

| # | Commit | Files | Tests |
|---|--------|-------|-------|
| 227 | Update metrics-row with unique views, bounce rate, time-to-click | `components/dashboard/metrics-row.tsx` | Shows 6 metrics |
| 228 | Add browser breakdown table to analytics | `components/dashboard/breakdown-tables.tsx` | Third table column |
| 229 | Hourly/time-of-day bar chart component | `components/dashboard/hourly-chart.tsx` (new) | 24-bar chart renders |
| 230 | Link velocity indicators in top-links table | `components/dashboard/top-links-table.tsx` | Shows trending arrows |
| 231 | Integrate new analytics sections into dashboard page | `app/(dashboard)/dashboard/analytics/page.tsx` | All sections render |

### Phase 11E: MCP + Polish (Commits 232-233)

| # | Commit | Files | Tests |
|---|--------|-------|-------|
| 232 | Update get_analytics MCP tool for enhanced metrics | `packages/mcp-server/src/index.ts`, `api-client.ts` | Returns new fields |
| 233 | Build verification + progress docs | Progress docs | pnpm build passes |

---

## SPRINT 12: Pro Analytics Features (Commits 234-256)

**Goal**: Give Pro users professional-grade analytics worth paying for — CSV export, custom date ranges, GA/Pixel integrations, UTM params, returning visitors, real-time feed, and shareable analytics. All at $5-7/mo vs Linktree's $9/mo.

### Design Philosophy
Every Pro analytics feature must be:
1. **API endpoint first** — fully functional via REST, plan-gated
2. **MCP tool second** — thin wrapper for AI agents
3. **GUI third** — consumes the same API as MCP
4. **Gracefully degraded** — Free users see the feature with a Pro upgrade prompt

### Phase 12A: Database + Schemas (Commits 234-236)

| # | Commit | Files | Tests |
|---|--------|-------|-------|
| 234 | Migration: add integrations JSONB to pages | `supabase/migrations/013_page_integrations.sql` | Applies, column exists |
| 235 | Extend page schemas for integrations field | `packages/shared/src/schemas.ts`, `types.ts` | Validates ga_id, meta_pixel_id, utm_enabled |
| 236 | Add analytics export + date range schemas | `packages/shared/src/schemas.ts` | Validates start_date, end_date, format |

### Phase 12B: Analytics CSV Export (Commits 237-238)

| # | Commit | Files | Tests |
|---|--------|-------|-------|
| 237 | GET /analytics/export endpoint (CSV download) | `api/v1/analytics/export/route.ts` (new) | Returns CSV, Pro-gated |
| 238 | Export CSV button in analytics dashboard | `app/(dashboard)/dashboard/analytics/page.tsx` | Button renders, Pro badge |

### Phase 12C: Custom Date Range (Commits 239-241)

| # | Commit | Files | Tests |
|---|--------|-------|-------|
| 239 | Update analytics APIs for start_date/end_date params | `overview/route.ts`, `timeseries/route.ts`, `breakdown/route.ts`, `top-links/route.ts`, `hourly/route.ts` | Custom ranges work |
| 240 | Date range picker component | `components/dashboard/date-range-picker.tsx` (new) | Calendar UI works |
| 241 | Integrate date range picker into analytics page | `app/(dashboard)/dashboard/analytics/page.tsx`, `hooks/use-analytics.ts` | Pro-gated, replaces period buttons for Pro |

### Phase 12D: Third-Party Integrations (Commits 242-246)

| # | Commit | Files | Tests |
|---|--------|-------|-------|
| 242 | PUT /pages/:id/integrations endpoint | `api/v1/pages/[id]/integrations/route.ts` (new) | Updates GA/Pixel/UTM settings |
| 243 | Inject Google Analytics gtag on public pages | `components/public/analytics-scripts.tsx` (new), update `creator-page.tsx` | GA script loads when configured |
| 244 | Inject Meta Pixel on public pages | `components/public/analytics-scripts.tsx` | Pixel fires when configured |
| 245 | UTM parameter auto-append on outbound link clicks | `components/public/link-item.tsx` | UTM params appended to URLs |
| 246 | Integrations settings panel in page editor | `components/dashboard/integrations-panel.tsx` (new), update `page-editor.tsx` | Pro-gated, GA/Pixel/UTM inputs |

### Phase 12E: Advanced Visitor Analytics (Commits 247-249)

| # | Commit | Files | Tests |
|---|--------|-------|-------|
| 247 | Returning vs. new visitor classification in overview | `api/v1/analytics/overview/route.ts` | Returns new_visitors, returning_visitors |
| 248 | Visitor type breakdown chart component | `components/dashboard/visitor-chart.tsx` (new) | Pie/donut chart renders |
| 249 | Integrate visitor analytics into dashboard | `app/(dashboard)/dashboard/analytics/page.tsx` | Pro-gated section |

### Phase 12F: Real-Time Analytics (Commits 250-252)

| # | Commit | Files | Tests |
|---|--------|-------|-------|
| 250 | GET /analytics/live SSE endpoint | `api/v1/analytics/live/route.ts` (new) | Streams events, Pro-gated |
| 251 | Live event feed component | `components/dashboard/live-feed.tsx` (new) | Real-time event list |
| 252 | Integrate live feed into analytics page | `app/(dashboard)/dashboard/analytics/page.tsx` | Pro-gated tab/section |

### Phase 12G: Shareable Analytics (Commits 253-254)

| # | Commit | Files | Tests |
|---|--------|-------|-------|
| 253 | Public analytics page route + API | `app/analytics/[token]/page.tsx` (new), `api/v1/analytics/share/route.ts` (new) | Read-only public view |
| 254 | Share analytics toggle in page settings | `components/dashboard/page-editor.tsx` | Generates/revokes share URL |

### Phase 12H: MCP + Polish (Commits 255-256)

| # | Commit | Files | Tests |
|---|--------|-------|-------|
| 255 | Update MCP tools + add export_analytics, bump to v0.4.0 | `packages/mcp-server/src/index.ts`, `api-client.ts`, `.well-known/mcp.json` | 22 MCP tools |
| 256 | Build verification + progress docs | Progress docs | pnpm build passes |

---

## Critical Files

These files are central to the implementation:

| File | Purpose |
|------|---------|
| `lib/api-auth.ts` | Core auth logic for JWT + API key |
| `packages/shared/src/schemas.ts` | Zod validation (single source of truth) |
| `app/api/v1/pages/[id]/route.ts` | Central page CRUD endpoint |
| `supabase/migrations/007_rls_policies.sql` | Row-level security |
| `packages/mcp-server/src/server.ts` | MCP server for AI agents |
| `lib/platforms.ts` | Social platform detection (Sprint 10) |
| `lib/themes.ts` | Theme system with custom colors (Sprint 10) |
| `components/public/creator-page.tsx` | Dynamic section rendering (Sprint 10) |
| `api/v1/analytics/hourly/route.ts` | Hourly time-of-day analytics (Sprint 11) |
| `components/public/view-tracker.tsx` | Visitor tracking + time-to-click (Sprint 11) |
| `components/public/analytics-scripts.tsx` | GA + Meta Pixel injection (Sprint 12) |
| `components/dashboard/date-range-picker.tsx` | Custom date range selection (Sprint 12) |
| `api/v1/analytics/live/route.ts` | Real-time SSE analytics feed (Sprint 12) |
| `api/v1/analytics/share/route.ts` | Shareable public analytics (Sprint 12) |

---

## Test Requirements per Commit

Every commit includes tests appropriate to its type:
- **API routes**: Integration tests with Vitest
- **UI components**: Unit tests with @testing-library/react
- **Hooks**: Unit tests with mock data
- **E2E flows**: Playwright tests (Sprint 6 only)
- **Migrations**: Verification that they apply cleanly

---

## Progress Tracking

**Progress Tracker File**: `PORTALO_PROGRESS.md`

The progress tracker contains:
- Overall progress bar visualization
- 20 milestone checkpoints with completion criteria
- Checkbox list for every commit
- Recent activity log
- Notes section for blockers/decisions

Update the progress file after each commit by:
1. Checking off the completed commit
2. Updating the milestone status when all commits in a milestone are done
3. Adding to Recent Activity log
4. Updating the progress bar percentages

---

## Source Documents

- `portalo_build_spec.md` - Detailed technical specification
- `portalo_implementation_design.md` - Architecture decisions
- `portalo_mvp_plan_converted.md` - Business plan and validation
- `portalo_ai_agent_addendum_converted.md` - AI-agent-first architecture
