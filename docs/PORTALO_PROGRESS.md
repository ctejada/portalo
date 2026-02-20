# Portalo MVP - Progress Tracker

**Project**: Portalo Link-in-Bio Platform
**Timeline**: 12 Weeks (6 Sprints) + Ongoing Improvements
**Total Commits**: 256
**Status**: Sprint 13 In Progress

---

## Overall Progress

```
Sprint 1:  [████████████████████] 38/38  (100%) ✓
Sprint 2:  [████████████████████] 34/34  (100%) ✓
Sprint 3:  [████████████████████] 16/16  (100%) ✓
Sprint 4:  [████████████████████] 22/22  (100%) ✓
Sprint 5:  [████████████████████] 29/29  (100%) ✓
Sprint 6:  [████████████████████] 21/21  (100%) ✓
Sprint 7:  [████████████████████] 8/8    (100%) ✓
Sprint 8:  [████████████████████] 3/3    (100%) ✓
Sprint 9:  [████████████████████] 12/12  (100%) ✓
Sprint 10: [████████████████████] 30/30  (100%) ✓
Sprint 11: [████████████████████] 20/20  (100%) ✓
Sprint 12: [████████████████████] 23/23  (100%) ✓
Sprint 13: [                    ] 0/59   (0%)
─────────────────────────────────────────
TOTAL:     [████████████████████] 256/315 (81%)
```

---

## Milestones

| Milestone | Sprint | Commits | Status | Completion Criteria |
|-----------|--------|---------|--------|---------------------|
| **M1: Project Setup** | 1 | 1-5 | [x] Complete | Monorepo builds, tests run |
| **M2: Design System** | 1 | 6-13 | [x] Complete | All UI primitives working |
| **M3: Database Ready** | 1 | 14-22 | [x] Complete | All migrations applied, RLS working |
| **M4: Auth Working** | 1 | 23-31 | [x] Complete | Can sign in/out with Google + Magic Link |
| **M5: Dashboard Shell** | 1 | 32-38 | [x] Complete | Empty dashboard renders, deploys to CF |
| **M6: Pages CRUD** | 2 | 39-52 | [x] Complete | Can create/edit/delete pages |
| **M7: Links CRUD** | 2 | 53-69 | [x] Complete | Can add/edit/reorder/delete links |
| **M8: Live Preview** | 2 | 70-72 | [x] Complete | Preview updates as you edit |
| **M9: Public Pages** | 3 | 73-86 | [x] Complete | Public pages render with themes |
| **M10: SEO Ready** | 3 | 87-88 | [x] Complete | Meta tags and OG images work |
| **M11: Analytics** | 4 | 89-96 | [x] Complete | Analytics dashboard functional |
| **M12: Email Capture** | 4 | 97-103 | [x] Complete | Email capture + contacts export |
| **M13: API Keys** | 4 | 104-110 | [x] Complete | API key auth working |
| **M14: Billing** | 5 | 111-123 | [x] Complete | Stripe checkout + plan gating |
| **M15: Custom Domains** | 5 | 124-128 | [x] Complete | Domain verification working |
| **M16: MCP Server** | 5 | 129-139 | [x] Complete | MCP server published to npm |
| **M17: PWA Ready** | 6 | 140-141 | [x] Complete | Installable PWA |
| **M18: Edge Caching** | 6 | 142-147 | [x] Complete | Pages cached at CF edge |
| **M19: E2E Tests** | 6 | 148-152 | [x] Complete | Critical paths tested |
| **M20: Launch Ready** | 6 | 153-160 | [x] Complete | Landing page, Lighthouse >90 |
| **M21: MCP Feature Improvements** | 7 | 161-168 | [x] Complete | 15 MCP tools, page CRUD via MCP |
| **M22: Copy Link UX** | 8 | 169-171 | [x] Complete | Users can see and copy their public page URL |
| **M23: Username URLs + Analytics** | 9 | 172-183 | [x] Complete | @username URLs, fixed analytics, simplified dashboard |
| **M24: Page Customization** | 10 | 184-213 | [x] Complete | Custom colors, icon bar, section reorder, 20 MCP tools |
| **M25: Free Analytics Upgrade** | 11 | 214-233 | [x] Complete | Unique visitors, hourly analytics, bounce rate, 28-day free retention |
| **M26: Pro Analytics** | 12 | 234-256 | [x] Complete | CSV export, GA/Pixel, custom dates, real-time feed, shareable analytics |
| **M27: Advanced Customization** | 13 | 257-315 | [ ] In Progress | Backgrounds, fonts, buttons, 28 platforms, image/heading/embed blocks, custom CSS, QR codes |

---

## Sprint 1: Foundation (Weeks 1-2)

**Goal**: Working auth, empty dashboard shell, deploy pipeline

### Phase 1A: Monorepo & Tooling (Commits 1-5)
- [x] **Commit 1**: Initialize Turborepo monorepo with pnpm
- [x] **Commit 2**: Create Next.js 15 app scaffold
- [x] **Commit 3**: Create shared types package
- [x] **Commit 4**: Configure ESLint + Prettier
- [x] **Commit 5**: Set up Vitest

### Phase 1B: Design System (Commits 6-13)
- [x] **Commit 6-7**: Design system + Tailwind CSS 4 (combined)
- [x] **Commit 8**: Create Button component
- [x] **Commit 9**: Create Input + Textarea components
- [x] **Commit 10**: Create Toggle + Badge components
- [x] **Commit 11**: Create Skeleton loader
- [x] **Commit 12**: Create Toast (Sonner)
- [x] **Commit 13**: Create UI barrel export

### Phase 1C: Database (Commits 14-22)
- [x] **Commit 14**: Initialize Supabase config
- [x] **Commit 15**: Migration: profiles + trigger
- [x] **Commit 16**: Migration: pages
- [x] **Commit 17**: Migration: links
- [x] **Commit 18**: Migration: domains
- [x] **Commit 19**: Migration: analytics (partitioned)
- [x] **Commit 20**: Migration: contacts
- [x] **Commit 21**: Migration: RLS policies
- [x] **Commit 22**: Create seed data

### Phase 1D: Supabase Clients (Commits 23-25)
- [x] **Commit 23**: Browser client
- [x] **Commit 24**: Server client (cookies)
- [x] **Commit 25**: Admin client (service role)

### Phase 1E: Authentication (Commits 26-31)
- [x] **Commit 26**: Auth callback route
- [x] **Commit 27**: Auth layout (centered)
- [x] **Commit 28**: Login + Google OAuth
- [x] **Commit 29**: Magic link auth
- [x] **Commit 30**: Signup page
- [x] **Commit 31**: Auth middleware

### Phase 1F: Dashboard Shell (Commits 32-36)
- [x] **Commit 32**: Dashboard layout + sidebar
- [x] **Commit 33**: Dashboard home (empty state)
- [x] **Commit 34**: use-user hook (SWR)
- [x] **Commit 35**: User nav in sidebar
- [x] **Commit 36**: Sign out

### Phase 1G: Deployment (Commits 37-38)
- [x] **Commit 37**: Cloudflare Pages deploy
- [x] **Commit 38**: Env validation

**Sprint 1 Completion Criteria**:
- [x] Can sign up with Google OAuth
- [x] Can sign in with magic link
- [x] Dashboard renders with sidebar
- [x] Deployed to Cloudflare Pages

---

## Sprint 2: Core CRUD (Weeks 3-4)

**Goal**: Create pages, add/edit/delete/reorder links, live preview

### Phase 2A: Shared Schemas (Commits 39-41)
- [x] **Commit 39**: Page + Link TypeScript interfaces
- [x] **Commit 40**: Page Zod schemas
- [x] **Commit 41**: Link Zod schemas

### Phase 2B: Pages API (Commits 42-47)
- [x] **Commit 42**: API auth helper
- [x] **Commit 43**: GET /api/v1/pages
- [x] **Commit 44**: POST /api/v1/pages
- [x] **Commit 45**: GET /api/v1/pages/[id]
- [x] **Commit 46**: PUT /api/v1/pages/[id]
- [x] **Commit 47**: DELETE /api/v1/pages/[id]

### Phase 2C: Dashboard Pages List (Commits 48-52)
- [x] **Commit 48**: use-pages hook
- [x] **Commit 49**: Page list component
- [x] **Commit 50**: Dashboard home update
- [x] **Commit 51**: New page dialog
- [x] **Commit 52**: Wire "+ New page" button

### Phase 2D: Links API (Commits 53-57)
- [x] **Commit 53**: GET /pages/[id]/links
- [x] **Commit 54**: POST /pages/[id]/links
- [x] **Commit 55**: PUT /pages/[id]/links/[linkId]
- [x] **Commit 56**: DELETE /pages/[id]/links/[linkId]
- [x] **Commit 57**: PATCH /links/reorder

### Phase 2E: Page Editor (Commits 58-69)
- [x] **Commit 58**: Editor layout (split view)
- [x] **Commit 59**: use-page hook
- [x] **Commit 60**: use-links hook
- [x] **Commit 61**: Title/bio inline edit
- [x] **Commit 62**: Link list container
- [x] **Commit 63**: Link row component
- [x] **Commit 64**: Add @dnd-kit drag-drop
- [x] **Commit 65**: Wire drag to reorder API
- [x] **Commit 66**: Inline link add form
- [x] **Commit 67**: Link edit in row
- [x] **Commit 68**: Link delete
- [x] **Commit 69**: Link visibility toggle

### Phase 2F: Phone Preview (Commits 70-72)
- [x] **Commit 70**: Preview frame
- [x] **Commit 71**: Preview content
- [x] **Commit 72**: Live update

**Sprint 2 Completion Criteria**:
- [x] Can create a new page
- [x] Can add/edit/delete links
- [x] Can drag-drop reorder links
- [x] Preview updates live

---

## Sprint 3: Public Pages + Themes (Weeks 5-6)

**Goal**: Public creator pages served, 3 themes working, click tracking

### Phase 3A: Public API (Commits 73-74)
- [x] **Commit 73**: GET /public/page/[slug]
- [x] **Commit 74**: POST /public/track

### Phase 3B: Public Components (Commits 75-77)
- [x] **Commit 75**: creator-page component
- [x] **Commit 76**: link-item component
- [x] **Commit 77**: powered-by footer

### Phase 3C: Theme System (Commits 78-83)
- [x] **Commit 78**: Theme config types
- [x] **Commit 79**: "Clean" theme
- [x] **Commit 80**: "Minimal Dark" theme
- [x] **Commit 81**: "Editorial" theme
- [x] **Commit 82**: Theme selector
- [x] **Commit 83**: Wire theme to API

### Phase 3D: Public Route (Commits 84-86)
- [x] **Commit 84**: [slug] catch-all route
- [x] **Commit 85**: Click tracking
- [x] **Commit 86**: View tracking

### Phase 3E: SEO (Commits 87-88)
- [x] **Commit 87**: Dynamic meta tags
- [x] **Commit 88**: OpenGraph image

**Sprint 3 Completion Criteria**:
- [x] Public pages render at /username
- [x] All 3 themes working
- [x] Click/view tracking operational
- [x] OG images generate correctly

---

## Sprint 4: Analytics + Contacts + API Keys (Weeks 7-8)

**Goal**: Analytics dashboard, email capture, API key generation

### Phase 4A: Analytics API (Commits 89-90)
- [x] **Commit 89**: GET /analytics/overview
- [x] **Commit 90**: GET /analytics/timeseries

### Phase 4B: Analytics Dashboard (Commits 91-96)
- [x] **Commit 91**: Analytics page route
- [x] **Commit 92**: Metrics row component
- [x] **Commit 93**: use-analytics hook
- [x] **Commit 94**: Recharts chart
- [x] **Commit 95**: Top links table
- [x] **Commit 96**: Referrers + countries tables

### Phase 4C: Email Capture (Commits 97-99)
- [x] **Commit 97**: POST /public/capture
- [x] **Commit 98**: Email capture widget
- [x] **Commit 99**: Add to public page

### Phase 4D: Contacts (Commits 100-103)
- [x] **Commit 100**: GET /contacts
- [x] **Commit 101**: POST /contacts/export
- [x] **Commit 102**: Contacts page
- [x] **Commit 103**: Export button

### Phase 4E: API Keys (Commits 104-107)
- [x] **Commit 104**: POST /account/api-key
- [x] **Commit 105**: API key auth support
- [x] **Commit 106**: Rate limiting
- [x] **Commit 107**: API settings page

### Phase 4F: Settings (Commits 108-110)
- [x] **Commit 108**: Settings profile page
- [x] **Commit 109**: GET /account
- [x] **Commit 110**: Avatar upload

**Sprint 4 Completion Criteria**:
- [x] Analytics dashboard shows data
- [x] Email capture works on public pages
- [x] Can export contacts as CSV
- [x] API key authentication works

---

## Sprint 5: Billing + Domains + MCP (Weeks 9-10)

**Goal**: Stripe billing, custom domains, MCP server published

### Phase 5A: Stripe Setup (Commits 111-115)
- [x] **Commit 111**: Stripe client
- [x] **Commit 112**: Plan constants
- [x] **Commit 113**: Checkout session
- [x] **Commit 114**: Webhook handler
- [x] **Commit 115**: Billing portal

### Phase 5B: Billing UI (Commits 116-119)
- [x] **Commit 116**: Billing page
- [x] **Commit 117**: Plan badge
- [x] **Commit 118**: Upgrade buttons
- [x] **Commit 119**: Manage billing link

### Phase 5C: Plan Gating (Commits 120-123)
- [x] **Commit 120**: Plan gate helper
- [x] **Commit 121**: Page limit enforcement
- [x] **Commit 122**: Link limit enforcement
- [x] **Commit 123**: Gate email capture

### Phase 5D: Custom Domains (Commits 124-128)
- [x] **Commit 124**: POST /domains
- [x] **Commit 125**: GET /domains/[id]/verify
- [x] **Commit 126**: DELETE /domains/[id]
- [x] **Commit 127**: Domain settings page
- [x] **Commit 128**: Verification status

### Phase 5E: MCP Server (Commits 129-139)
- [x] **Commit 129**: Initialize package
- [x] **Commit 130**: API client wrapper
- [x] **Commit 131**: MCP server + list_pages
- [x] **Commit 132**: get_page tool
- [x] **Commit 133**: Link tools
- [x] **Commit 134**: reorder_links tool
- [x] **Commit 135**: get_analytics tool
- [x] **Commit 136**: export_contacts tool
- [x] **Commit 137**: update_theme tool
- [x] **Commit 138**: .well-known/mcp.json
- [x] **Commit 139**: npm publish config

**Sprint 5 Completion Criteria**:
- [x] Can upgrade to Pro via Stripe
- [x] Plan limits enforced
- [x] Custom domains can be added/verified
- [x] MCP server published to npm
- [x] Claude can manage page via MCP

---

## Sprint 6: Polish + PWA + Launch (Weeks 11-12)

**Goal**: Production-ready, PWA installable, launched

### Phase 6A: PWA (Commits 140-141)
- [x] **Commit 140**: PWA manifest
- [x] **Commit 141**: Service worker

### Phase 6B: Link Scheduling (Commits 142-143)
- [x] **Commit 142**: Schedule fields
- [x] **Commit 143**: Filter by schedule

### Phase 6C: Edge Caching (Commits 144-147)
- [x] **Commit 144**: CF Worker renderer
- [x] **Commit 145**: R2 cache write
- [x] **Commit 146**: Cache invalidation
- [x] **Commit 147**: Invalidate on save

### Phase 6D: Error Tracking (Commit 148)
- [x] **Commit 148**: Sentry integration

### Phase 6E: E2E Tests (Commits 149-152)
- [x] **Commit 149**: Playwright setup
- [x] **Commit 150**: Signup + create page test
- [x] **Commit 151**: Links + reorder test
- [x] **Commit 152**: Public page + click test

### Phase 6F: Landing + SEO (Commits 153-156)
- [x] **Commit 153**: Landing page
- [x] **Commit 154**: sitemap.xml
- [x] **Commit 155**: robots.txt
- [x] **Commit 156**: Structured data

### Phase 6G: Final Polish (Commits 157-160)
- [x] **Commit 157**: 404 page
- [x] **Commit 158**: Loading states
- [x] **Commit 159**: Mobile sidebar
- [x] **Commit 160**: Performance audit

**Sprint 6 Completion Criteria**:
- [x] PWA installable
- [x] Public pages cached at edge (<50ms)
- [x] E2E tests passing
- [x] Lighthouse score >90
- [x] Ready for Product Hunt launch

---

## Sprint 7: MCP Feature Improvements

**Goal**: Expand MCP server from 9 to 15 tools, fix bugs, complete page and domain management

### Phase 7A: Bug Fixes (Commits 161-162)
- [x] **Commit 161**: Fix reorder_links URL path bug in MCP API client
- [x] **Commit 162**: Fix RLS policy violation in domain API routes (BF-2)

### Phase 7B: Page Management Tools (Commits 163-164)
- [x] **Commit 163**: Add create_page and delete_page MCP tools
- [x] **Commit 164**: Replace update_theme with full update_page MCP tool

### Phase 7C: Account & Domain Tools (Commits 165-166)
- [x] **Commit 165**: Add get_account MCP tool
- [x] **Commit 166**: Add domain management MCP tools (list, add, remove)

### Phase 7D: Finalize (Commits 167-168)
- [x] **Commit 167**: Update MCP discovery endpoint and bump version to 0.2.0
- [x] **Commit 168**: Update progress tracking

**Sprint 7 Completion Criteria**:
- [x] MCP server has 15 tools (was 9)
- [x] Can create/update/delete pages via MCP
- [x] Domain management via MCP
- [x] reorder_links bug fixed
- [x] Domain RLS bug fixed
- [x] pnpm build passes

---

## Sprint 8: Copy Link UX

**Goal**: Show users their public page URL with copy-to-clipboard throughout the dashboard

### Phase 8A: Documentation (Commit 169)
- [x] **Commit 169**: Add Sprint 8 to progress docs

### Phase 8B: Copy Link Feature (Commits 170-171)
- [x] **Commit 170**: Add full URL display + copy button to page editor header
- [x] **Commit 171**: Add full URL + copy/external-link buttons to page list rows

**Sprint 8 Completion Criteria**:
- [x] Page editor header shows `portalo.so/{slug}` with copy button
- [x] Page list rows show full URL with copy and external link buttons
- [x] Copy button copies `https://portalo.so/{slug}` to clipboard
- [x] Toast confirms "Link copied!"
- [x] pnpm build passes

---

## Sprint 9: Username URLs + Analytics Overhaul

**Goal**: Replace slug-based URLs with `@username` identity URLs, fix broken analytics counters, add aggregate analytics, simplify dashboard to single-page model

### Phase 9A: Documentation (Commit 172)
- [x] **Commit 172**: Add Sprint 9 to progress docs

### Phase 9B: Database + Types (Commit 173)
- [x] **Commit 173**: Migration: add username to profiles + counter trigger + type/schema updates

### Phase 9C: Middleware + Public Route (Commit 174)
- [x] **Commit 174**: Middleware @username rewrite + update public route lookup

### Phase 9D: Account API + Username Setup (Commits 175-176)
- [x] **Commit 175**: Account API: username support + username-check endpoint
- [x] **Commit 176**: Username setup dialog (dismissible) + nudge banner

### Phase 9E: Analytics Counters Fix (Commit 177)
- [x] **Commit 177**: Fix TopLinksTable: new top-links analytics endpoint

### Phase 9F: Aggregate Analytics (Commits 178-179)
- [x] **Commit 178**: Aggregate analytics: modify overview/timeseries/breakdown endpoints
- [x] **Commit 179**: Update analytics hook + dashboard (remove page selector, keep period)

### Phase 9G: Dashboard Simplification (Commits 180-183)
- [x] **Commit 180**: Dashboard goes straight to editor (username setup if needed)
- [x] **Commit 181**: Editor: published toggle, @username URL, sidebar labels, accessibility
- [x] **Commit 182**: Settings: username field with change warning
- [x] **Commit 183**: Seed data update + pnpm build verification

**Sprint 9 Completion Criteria**:
- [x] Public URLs use `portalo.so/@username` format
- [x] Old `/slug` URLs 301-redirect to `/@username`
- [x] `views_count` and `clicks` counters auto-increment via SQL trigger
- [x] Analytics dashboard shows aggregate view (all pages)
- [x] Period selector (7d/30d/90d) retained
- [x] TopLinksTable shows period-aware click counts
- [x] Dashboard goes straight to editor (no page list)
- [x] Username setup dialog with live availability check
- [x] Published toggle visible in editor header
- [x] pnpm build passes

---

## Sprint 10: Page Customization (API/MCP-First)

**Goal**: Add comprehensive customization following API/MCP-first principle (API → MCP → GUI)

### Phase 10A: Database + Schemas (Commits 184-186)
- [x] **Commit 184**: Migration: add platform, display_mode to links
- [x] **Commit 185**: Migration: add layout to pages
- [x] **Commit 186**: Extend Zod schemas for customization

### Phase 10B: API Endpoints (Commits 187-192)
- [x] **Commit 187**: Platform detection utility
- [x] **Commit 188**: Extend PUT /pages/:id for layout + colors
- [x] **Commit 189**: PUT /pages/:id/layout endpoint
- [x] **Commit 190**: POST/DELETE /pages/:id/blocks endpoints
- [x] **Commit 191**: Extend links API for platform + display_mode
- [x] **Commit 192**: GET /utils/detect-platform endpoint

### Phase 10C: MCP Tools (Commits 193-197)
- [x] **Commit 193**: update_design MCP tool
- [x] **Commit 194**: set_layout MCP tool
- [x] **Commit 195**: add_block + remove_block MCP tools
- [x] **Commit 196**: set_link_display MCP tool
- [x] **Commit 197**: Update MCP discovery + bump to v0.3.0

### Phase 10D: Public Page Rendering (Commits 198-203)
- [x] **Commit 198**: Social icons component (18 platforms)
- [x] **Commit 199**: Theme system: custom color merge
- [x] **Commit 200**: Icon bar component
- [x] **Commit 201**: Block components (spacer, divider, text)
- [x] **Commit 202**: Update creator-page for dynamic sections
- [x] **Commit 203**: Update link-item for platform icons

### Phase 10E: Dashboard GUI (Commits 204-210)
- [x] **Commit 204**: Color picker component
- [x] **Commit 205**: Color customizer panel
- [x] **Commit 206**: Section list + drag-drop
- [x] **Commit 207**: Add block dropdown menu
- [x] **Commit 208**: Link form: platform auto-detect
- [x] **Commit 209**: Link row: icon + display mode toggle
- [x] **Commit 210**: Integrate into page editor

### Phase 10F: Polish (Commits 211-213)
- [x] **Commit 211**: Progressive disclosure
- [x] **Commit 212**: Backfill migration + seed data
- [x] **Commit 213**: Build verification + docs

**Sprint 10 Completion Criteria**:
- [x] API endpoints for layout/colors/blocks all functional
- [x] MCP tools: update_design, set_layout, add_block, remove_block, set_link_display
- [x] Public pages render with custom colors, sections, icon bar
- [x] Dashboard GUI for all customization options
- [x] 18 social platform icons auto-detect
- [x] pnpm build passes

---

## Sprint 11: Free Tier Analytics Upgrade

**Goal**: Make Portalo Free objectively better than Linktree Starter ($5/mo) — unique visitors, hourly analytics, bounce rate, time-to-click, browser breakdown, link velocity

### Phase 11A: Database + Schemas (Commits 214-216)
- [x] **Commit 214**: Migration: add visitor_id, time_to_click_ms to analytics_events
- [x] **Commit 215**: Extend trackEventSchema with visitor_id, time_to_click_ms
- [x] **Commit 216**: Add analyticsGranularity + enhanced query params to schemas

### Phase 11B: Client-Side Tracking Enhancements (Commits 217-220)
- [x] **Commit 217**: Generate anonymous visitor_id cookie in view-tracker
- [x] **Commit 218**: Detect and send device + browser from client in track calls
- [x] **Commit 219**: Measure time-to-click (page load to first link click)
- [x] **Commit 220**: Update free tier analytics_days from 7 to 28

### Phase 11C: Enhanced Analytics API Endpoints (Commits 221-226)
- [x] **Commit 221**: Add unique views + unique clicks to overview endpoint
- [x] **Commit 222**: Add bounce rate to overview endpoint
- [x] **Commit 223**: Add average time-to-click to overview endpoint
- [x] **Commit 224**: Add browser breakdown to breakdown endpoint
- [x] **Commit 225**: GET /analytics/hourly endpoint for time-of-day data
- [x] **Commit 226**: Add link velocity to top-links endpoint

### Phase 11D: Dashboard UI (Commits 227-231)
- [x] **Commit 227**: Update metrics-row with unique views, bounce rate, time-to-click
- [x] **Commit 228**: Add browser breakdown table to analytics
- [x] **Commit 229**: Hourly/time-of-day bar chart component
- [x] **Commit 230**: Link velocity indicators in top-links table
- [x] **Commit 231**: Integrate new analytics sections into dashboard page

### Phase 11E: MCP + Polish (Commits 232-233)
- [x] **Commit 232**: Update get_analytics MCP tool for enhanced metrics
- [x] **Commit 233**: Build verification + progress docs

**Sprint 11 Completion Criteria**:
- [x] Anonymous visitor_id cookie set on public pages
- [x] Device + browser data sent from client
- [x] Time-to-click measured and displayed
- [x] Free tier retention increased to 28 days
- [x] Unique views/clicks, bounce rate in overview
- [x] Hourly time-of-day chart functional
- [x] Browser breakdown table displayed
- [x] Link velocity (trending) indicators shown
- [x] MCP tool returns enhanced analytics
- [x] pnpm build passes

---

## Sprint 12: Pro Analytics Features

**Goal**: Professional-grade analytics for Pro users — CSV export, custom date ranges, GA/Pixel integrations, UTM params, returning visitors, real-time feed, shareable analytics

### Phase 12A: Database + Schemas (Commits 234-236)
- [x] **Commit 234**: Migration: add integrations JSONB to pages
- [x] **Commit 235**: Extend page schemas for integrations field
- [x] **Commit 236**: Add analytics export + date range schemas

### Phase 12B: Analytics CSV Export (Commits 237-238)
- [x] **Commit 237**: GET /analytics/export endpoint (CSV download, Pro-gated)
- [x] **Commit 238**: Export CSV button in analytics dashboard

### Phase 12C: Custom Date Range (Commits 239-241)
- [x] **Commit 239**: Update analytics APIs for start_date/end_date params
- [x] **Commit 240**: Date range picker component
- [x] **Commit 241**: Integrate date range picker into analytics page (Pro-gated)

### Phase 12D: Third-Party Integrations (Commits 242-246)
- [x] **Commit 242**: PUT /pages/:id/integrations endpoint
- [x] **Commit 243**: Inject Google Analytics gtag on public pages
- [x] **Commit 244**: Inject Meta Pixel on public pages
- [x] **Commit 245**: UTM parameter auto-append on outbound link clicks
- [x] **Commit 246**: Integrations settings panel in page editor (Pro-gated)

### Phase 12E: Advanced Visitor Analytics (Commits 247-249)
- [x] **Commit 247**: Returning vs. new visitor classification in overview
- [x] **Commit 248**: Visitor type breakdown chart component
- [x] **Commit 249**: Integrate visitor analytics into dashboard (Pro-gated)

### Phase 12F: Real-Time Analytics (Commits 250-252)
- [x] **Commit 250**: GET /analytics/live SSE endpoint (Pro-gated)
- [x] **Commit 251**: Live event feed component
- [x] **Commit 252**: Integrate live feed into analytics page (Pro-gated)

### Phase 12G: Shareable Analytics (Commits 253-254)
- [x] **Commit 253**: Public analytics page route + API
- [x] **Commit 254**: Share analytics toggle in page settings

### Phase 12H: MCP + Polish (Commits 255-256)
- [x] **Commit 255**: Update MCP tools + add export_analytics, bump to v0.4.0
- [x] **Commit 256**: Build verification + progress docs

**Sprint 12 Completion Criteria**:
- [x] CSV export downloads analytics data (Pro-gated)
- [x] Custom date range picker works for Pro users
- [x] Google Analytics tag injected on public pages when configured
- [x] Meta Pixel fires on public pages when configured
- [x] UTM params auto-appended to outbound links
- [x] Integrations settings panel in page editor
- [x] Returning vs. new visitors chart (Pro-gated)
- [x] Real-time event feed streams live (Pro-gated)
- [x] Shareable analytics page with public URL
- [x] 22 MCP tools (up from 20)
- [x] pnpm build passes

---

## Sprint 13: Advanced Customization

**Goal**: Full visual customization upgrade — backgrounds (gradient/image), fonts, button styling, avatar enhancement, link thumbnails, 10 new social platforms (incl. OnlyFans/Fansly), image/heading/embed blocks, custom CSS, animations, QR codes. Editor restructured to 4-tab model. All features API/MCP-first.

### Phase 13A: Infrastructure + Backgrounds + Fonts (Commits 257-270)
- [ ] **Commit 257**: Migration: create pages storage bucket + RLS policies
- [ ] **Commit 258**: Upload API endpoint (FormData)
- [ ] **Commit 259**: Signed upload URL API endpoint (for MCP)
- [ ] **Commit 260**: BackgroundConfig + GradientConfig types and schemas
- [ ] **Commit 261**: FontConfig type, schema, and FONT_OPTIONS constant
- [ ] **Commit 262**: Extend resolveTheme() for backgrounds (solid/gradient/image)
- [ ] **Commit 263**: Extend resolveTheme() for custom fonts
- [ ] **Commit 264**: FontLoader component for public page
- [ ] **Commit 265**: Background rendering in creator-page.tsx (overlay, blur)
- [ ] **Commit 266**: Background customizer dashboard component
- [ ] **Commit 267**: Font picker dashboard component
- [ ] **Commit 268**: Editor tab restructure (Content | Design | Layout | Settings)
- [ ] **Commit 269**: MCP: get_upload_url tool + update_design background/font extensions
- [ ] **Commit 270**: Preview content updates for backgrounds + fonts

### Phase 13B: Buttons + Avatar + Thumbnails (Commits 271-280)
- [ ] **Commit 271**: ButtonStyleConfig type and schema
- [ ] **Commit 272**: AvatarStyleConfig type and schema
- [ ] **Commit 273**: Extend resolveTheme() for button styles
- [ ] **Commit 274**: Button style rendering in link-item.tsx
- [ ] **Commit 275**: Avatar style rendering in creator-page.tsx header
- [ ] **Commit 276**: Fix preview-content.tsx to show real avatar image
- [ ] **Commit 277**: Button style picker dashboard component
- [ ] **Commit 278**: Avatar style picker dashboard component
- [ ] **Commit 279**: Link thumbnail rendering in link-item.tsx
- [ ] **Commit 280**: Thumbnail upload in link-row.tsx inline edit form

### Phase 13C: Platforms + New Blocks (Commits 281-295)
- [ ] **Commit 281**: Extend Platform type with 10 new platforms
- [ ] **Commit 282**: Add Threads, Bluesky, Mastodon SVG icons
- [ ] **Commit 283**: Add Patreon, Ko-fi, Substack SVG icons
- [ ] **Commit 284**: Add OnlyFans, Fansly SVG icons
- [ ] **Commit 285**: Add Cash App, Venmo SVG icons
- [ ] **Commit 286**: Update detect-platform URL patterns for new platforms
- [ ] **Commit 287**: Extend BlockKind with image + heading types
- [ ] **Commit 288**: Image block rendering in blocks.tsx
- [ ] **Commit 289**: Heading block rendering in blocks.tsx
- [ ] **Commit 290**: Rich text (markdown) support in text blocks
- [ ] **Commit 291**: Image block editor dashboard component
- [ ] **Commit 292**: Updated add-block-menu with Image (Pro) + Heading
- [ ] **Commit 293**: Plan gating for image blocks at API level
- [ ] **Commit 294**: MCP: extend add_block, set_link_display for new blocks/platforms
- [ ] **Commit 295**: MCP: extend add_link/update_link with thumbnail_url

### Phase 13D: Embeds + CSS + Effects (Commits 296-310)
- [ ] **Commit 296**: Extend BlockKind with embed type
- [ ] **Commit 297**: Embed resolver utility (YouTube, Spotify, SoundCloud)
- [ ] **Commit 298**: Embed block rendering with facade pattern
- [ ] **Commit 299**: Embed block editor dashboard component
- [ ] **Commit 300**: Add custom_css to PageSettings type and schema
- [ ] **Commit 301**: CSS sanitizer utility
- [ ] **Commit 302**: Custom CSS rendering in creator-page.tsx
- [ ] **Commit 303**: Custom CSS editor dashboard component (Pro-gated)
- [ ] **Commit 304**: AnimationConfig type and schema
- [ ] **Commit 305**: Animation rendering (CSS keyframes + prefers-reduced-motion)
- [ ] **Commit 306**: Animation picker dashboard component
- [ ] **Commit 307**: Background blur/overlay controls in background customizer
- [ ] **Commit 308**: QR code generation component (client-side)
- [ ] **Commit 309**: MCP: set_custom_css tool + update_design animation extensions
- [ ] **Commit 310**: Plan limit extensions (image_backgrounds, image_blocks, embed_blocks, custom_css)

### Phase 13E: Polish + Integration Testing (Commits 311-315)
- [ ] **Commit 311**: Mobile-responsive editor (toggle preview, touch targets, safe areas)
- [ ] **Commit 312**: Accessibility audit (reduced motion, ARIA, contrast, alt text)
- [ ] **Commit 313**: Performance audit (font loading, image optimization, CLS)
- [ ] **Commit 314**: MCP server version bump + comprehensive tool testing
- [ ] **Commit 315**: Build verification + progress docs update

**Sprint 13 Completion Criteria**:
- [ ] 3 background modes (solid/gradient/image) working on public page
- [ ] 10 Google Fonts selectable for heading + body
- [ ] 4 button shapes + shadow + border width customizable
- [ ] Avatar shape/border/shadow customizable
- [ ] Link thumbnails render when set
- [ ] 28 social platforms (up from 18, including OnlyFans/Fansly)
- [ ] Image blocks uploadable (Pro-gated)
- [ ] Heading blocks with size options
- [ ] Rich text (markdown) in text blocks
- [ ] YouTube/Spotify/SoundCloud embeds (Pro-gated)
- [ ] Custom CSS injection (Pro-gated, sanitized)
- [ ] Entrance animations (fade-in/slide-up) with prefers-reduced-motion
- [ ] QR code generation (client-side)
- [ ] Editor restructured to 4-tab model
- [ ] Mobile-responsive editor with toggle preview
- [ ] 44px+ touch targets throughout
- [ ] 25 MCP tools (up from 22)
- [ ] pnpm build passes

---

## Bug Fixes

| # | Description | Files Changed | Status |
|---|-------------|---------------|--------|
| **BF-1** | Fix RLS policy violation when MCP server writes via API key — API routes now use `supabaseAdmin` for API key auth (bypasses RLS since there's no session), while session auth continues using the cookie-based client | `lib/api-auth.ts`, `lib/supabase/api-client.ts` (new), 5 API route files | Complete |
| **BF-2** | Fix RLS policy violation in domain API routes — same pattern as BF-1, domain routes now use `getSupabaseClient(auth.isApiKey)` | 3 domain route files | Complete |
| **BF-3** | Fix PUT /api/v1/account 500 on username claim — migration 008 made `username` NOT NULL but never updated `handle_new_user()` trigger, so new signups couldn't create profiles. Dropped NOT NULL constraint + backfill orphaned users | `009_fix_username_nullable.sql` | Complete |

---

## Recent Activity

| Date | Commit | Description | Status |
|------|--------|-------------|--------|
| 2026-02-18 | - | Add env validation — Sprint 1 complete | Complete |
| 2026-02-18 | - | Add Cloudflare Pages deploy config | Complete |
| 2026-02-18 | - | Add sign out to user nav | Complete |
| 2026-02-18 | - | Add user nav in sidebar | Complete |
| 2026-02-18 | - | Add use-user hook with SWR | Complete |
| 2026-02-18 | - | Add dashboard home empty state | Complete |
| 2026-02-18 | - | Add dashboard layout and sidebar | Complete |
| 2026-02-18 | - | Add auth middleware | Complete |
| 2026-02-18 | bed92d9 | Add signup page | Complete |
| 2026-02-18 | 19b154b | Add magic link auth with state handling | Complete |
| 2026-02-18 | f451fd0 | Add login page with Google OAuth | Complete |
| 2026-02-18 | 7953737 | Add centered auth layout | Complete |
| 2026-02-18 | 9d97a0c | Add auth callback route | Complete |
| 2026-02-18 | 289c9a4 | Add Supabase admin client | Complete |
| 2026-02-18 | 4d49e53 | Add Supabase server client | Complete |
| 2026-02-18 | 4570e70 | Add Supabase browser client | Complete |
| 2026-02-18 | 025fc53 | Create seed data | Complete |
| 2026-02-18 | d33b1d5 | Add RLS policies for all tables | Complete |
| 2026-02-18 | 0cb8171 | Add contacts migration | Complete |
| 2026-02-18 | e352b9f | Add analytics events partitioned migration | Complete |
| 2026-02-18 | 769bdc9 | Add domains migration | Complete |
| 2026-02-18 | 05dc480 | Add links migration | Complete |
| 2026-02-18 | e4aaffc | Add pages migration | Complete |
| 2026-02-18 | 4f2cd8d | Add profiles migration with triggers | Complete |
| 2026-02-18 | 012003e | Initialize Supabase config | Complete |
| 2026-02-18 | 617f968 | Add UI components barrel export | Complete |
| 2026-02-18 | afb2e1e | Add Toast component with Sonner | Complete |
| 2026-02-18 | d60c910 | Add Skeleton loader components | Complete |
| 2026-02-18 | b51f41e | Add Toggle and Badge components | Complete |
| 2026-02-18 | 8e83ee0 | Add Input and Textarea components | Complete |
| 2026-02-18 | 2e15d1c | Add Button component | Complete |
| 2026-02-17 | b20e5d4 | Add Tailwind CSS 4 design system | Complete |
| 2026-02-17 | 159ab87 | Set up Vitest | Complete |
| 2026-02-17 | ab32a11 | Configure ESLint + Prettier | Complete |
| 2026-02-17 | 956df52 | Create shared types package | Complete |
| 2026-02-17 | 5ef3d95 | Create Next.js 15 app scaffold | Complete |
| 2026-02-17 | e9ff958 | Initialize Turborepo monorepo with pnpm | Complete |

---

## Notes

_Add implementation notes, blockers, and decisions here as the project progresses._

---

## Related Files

- **Implementation Plan**: `/Users/christian/.claude/plans/sprightly-dreaming-crown.md`
- **Build Spec**: `/portalo_build_spec.md`
- **Implementation Design**: `/portalo_implementation_design.md`
- **MVP Plan**: `/portalo_mvp_plan_converted.md`
- **AI Agent Addendum**: `/portalo_ai_agent_addendum_converted.md`
