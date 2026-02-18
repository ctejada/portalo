# Portalo MVP Implementation Plan

## Overview

A step-by-step implementation plan for the Portalo link-in-bio MVP with **160 small, reviewable commits** across 6 sprints (12 weeks). Each commit is designed to be reviewable in under 15 minutes and includes relevant tests.

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

## Critical Files

These files are central to the implementation:

| File | Purpose |
|------|---------|
| `lib/api-auth.ts` | Core auth logic for JWT + API key |
| `packages/shared/src/schemas.ts` | Zod validation (single source of truth) |
| `app/api/v1/pages/[id]/route.ts` | Central page CRUD endpoint |
| `supabase/migrations/007_rls_policies.sql` | Row-level security |
| `packages/mcp-server/src/server.ts` | MCP server for AI agents |

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
