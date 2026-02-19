# PORTALO — MVP Implementation Design Document

**Version:** 1.0 | **Date:** February 2026 | **Status:** Pre-Development

---

## 1. Executive Summary

This document specifies the implementation architecture for Portalo's 12-week MVP. Every decision is optimized for three constraints: **cost efficiency** (bootstrapped), **speed to market** (12 weeks), and **AI-agent-first architecture** (API and MCP server ship at MVP).

**Key Decisions:**
- **Web-first PWA** — not native mobile, not parallel builds
- **Next.js 15 (App Router)** — full-stack TypeScript, single repo
- **Supabase** — Postgres + Auth + Storage + Edge Functions ($25/mo Pro)
- **Cloudflare** — Pages hosting, R2 assets, Workers for edge page rendering
- **Stripe** — billing with customer-facing portal
- **Total infrastructure at launch: ~$35/month**
- **Total infrastructure at 10K users: ~$75/month**

---

## 2. Platform Strategy: Web-First PWA

### The Decision: Web First, Mobile Later

**Build for the browser. Ship a PWA. Do NOT build native mobile apps for MVP.**

The link-in-bio use case has a specific pattern: **creators EDIT on desktop/laptop, audiences VIEW on mobile**. Milkshake's #1 complaint was mobile-only editing. Creators overwhelmingly prefer desktop for managing pages — keyboard, multi-tab workflows, drag-and-drop. The *viewing* side is mobile-first, but that's just a responsive web page served at the edge.

### Why Not Parallel (Web + React Native)?

Parallel development with a small team in 12 weeks is suicidal. React Native adds a second build pipeline, platform-specific bugs, App Store review delays (1-7 days per submission), and Apple's 15-30% cut on digital goods.

The 2026 industry consensus is **"PWA-First, Native-Later."** PWA development is 40-60% cheaper than native for comparable scope. iOS now supports push notifications, home screen install, and offline via service workers (since iOS 16.4+).

### PWA Capability Matrix

| Capability | PWA Support (2026) | Native Needed? |
|---|---|---|
| Home screen install | ✅ iOS + Android | No |
| Push notifications | ✅ iOS 16.4+ | No |
| Offline access | ✅ Service Workers | No |
| Camera/file upload | ✅ Web APIs | No |
| QR code scanning | ✅ Web APIs | No |
| Background sync | ⚠️ Limited iOS | Not for MVP |
| NFC tap | ❌ Requires native | v3 (2027) |
| App Store presence | ❌ Not in stores | Optional via TWA later |

**When to reconsider native:** 10K+ users AND >40% editing on mobile AND users request app store. Target: Month 18+.

---

## 3. Tech Stack Decision

### Stack Comparison

| Approach | Pros | Cons | Verdict |
|---|---|---|---|
| **Next.js 15 + Supabase** | Single language (TS), full-stack single repo, SSR for SEO, Supabase bundles auth/db/storage/realtime, largest React talent pool | Vercel lock-in risk (mitigated by CF hosting) | ✅ **CHOSEN** |
| **Next.js + Flask/Python** | Python for AI/ML | Two languages, two repos, two deploys, coordination overhead, Python unnecessary for CRUD | ❌ Rejected |
| **Next.js + Java/Spring Boot** | Enterprise-grade | Massive overkill, slow iteration, expensive hiring, cold start latency kills edge rendering | ❌ Rejected |
| **React SPA + Node/Express** | Flexible | No SSR (kills SEO for creator pages), separate API server, more infra | ❌ Rejected |

### Why Not Python/Flask Backend?

1. **No AI/ML at MVP.** Python's advantage is ML libraries — zero ML features in 12-week scope.
2. **Two deploy targets.** Flask API on one host + Next.js frontend on another = double infra, CORS config, separate CI/CD.
3. **Context switching tax.** Small team writing TypeScript AND Python loses 20-30% velocity.
4. **Next.js API Routes + Supabase eliminate the need.** App Router handles server-side logic. Supabase handles auth, database, storage. No separate "backend" needed.

**If AI features added in v2 (Q4 2026):** Call Python microservices via Supabase Edge Functions or Cloudflare Workers. Don't rebuild core stack.

### Why Not Java/Spring Boot?

Java is for enterprise SaaS with 50+ engineers and complex domain logic. Portalo is a CRUD app rendering static pages. Spring Boot cold start (2-8s) kills edge rendering. Senior Java engineers (~$180K/yr) cost 30% more than TypeScript/React engineers (~$140K/yr) with zero benefit for this product.

### The Chosen Stack

```
┌──────────────────────────────────────────────────────┐
│  FRONTEND: Next.js 15 (App Router) + TS + Tailwind   │
│  Deployed on Cloudflare Pages                         │
├──────────────────────────────────────────────────────┤
│  API LAYER: Next.js Route Handlers (/app/api/*)       │
│  + Supabase Client SDK (server-side)                  │
├──────────────────────────────────────────────────────┤
│  DATABASE + AUTH + STORAGE: Supabase                  │
│  (Postgres + Auth + Storage + Row-Level Security)     │
├──────────────────────────────────────────────────────┤
│  EDGE RENDERING: Cloudflare Workers + R2 cache        │
│  Custom domains via Cloudflare for SaaS               │
├──────────────────────────────────────────────────────┤
│  MCP SERVER: @portalo/mcp-server (npm)              │
│  Thin TypeScript wrapper over same API endpoints      │
├──────────────────────────────────────────────────────┤
│  BILLING: Stripe + Customer Portal                    │
├──────────────────────────────────────────────────────┤
│  EMAIL: Resend ($0 for 3K/mo, $20 for 50K)           │
└──────────────────────────────────────────────────────┘
```

### Key Libraries

| Library | Purpose | Cost |
|---|---|---|
| Next.js 15 | Full-stack framework | Free (MIT) |
| TypeScript 5.x | Type safety | Free |
| Tailwind CSS 4.x | Styling | Free |
| @supabase/supabase-js | Client SDK | Free |
| @dnd-kit/core | Drag-and-drop builder | Free |
| stripe (Node) | Billing | 2.9% + $0.30/txn |
| Recharts | Analytics charts | Free |
| Resend | Transactional email | Free tier |
| Zod | Schema validation | Free |
| @modelcontextprotocol/sdk | MCP server | Free |


---

## 4. System Architecture

### Architecture Diagram

```
                    ┌──────────────────────┐
                    │    CREATOR'S AI       │
                    │  (Claude, ChatGPT)    │
                    └──────────┬───────────┘
                               │ MCP Protocol
                    ┌──────────▼───────────┐
                    │   MCP SERVER          │
                    │  @portalo/mcp       │
                    └──────────┬───────────┘
                               │ REST API
    ┌──────────────┐  ┌───────▼──────────────────────────┐
    │  Creator GUI  │──│       NEXT.JS APP                │
    │  (Browser/PWA)│  │  /app/api/* → Route Handlers     │
    └──────────────┘  │  /app/(dashboard) → React UI     │
                      └───────┬──────────────────────────┘
                              │
            ┌─────────────────┼─────────────────┐
            │                 │                 │
    ┌───────▼──────┐  ┌──────▼───────┐  ┌─────▼──────┐
    │   SUPABASE   │  │  CLOUDFLARE  │  │   STRIPE   │
    │ • Postgres   │  │ • Pages      │  │ • Billing  │
    │ • Auth       │  │ • Workers    │  │ • Portal   │
    │ • Storage    │  │ • R2 (cache) │  │ • Webhooks │
    │ • RLS        │  │ • Custom DNS │  │            │
    └──────────────┘  └──────┬───────┘  └────────────┘
                             │
                    ┌────────▼─────────┐
                    │  CREATOR'S PAGE  │
                    │  (static HTML    │
                    │   at the edge)   │
                    └──────────────────┘
```

### Request Flow: Audience Visits Creator Page

1. Audience visits `creator.com` or `creator.portalo.so`
2. DNS resolves to Cloudflare
3. Worker checks R2 cache for pre-rendered HTML
4. **Cache HIT (99%):** Serve static HTML in <50ms globally. Log click event async.
5. **Cache MISS:** Fetch data from Supabase, render HTML, cache to R2, serve.
6. Click events batched and written to Supabase Postgres via Edge Function (non-blocking).

**Why this matters for cost:** Creator pages are read-heavy (1000:1 read:write). Caching rendered HTML at the edge means 99% of traffic costs ~$0.00. Database only hit on edits.

### Request Flow: AI Agent Updates Page

1. Creator tells Claude: "Add my new podcast to Portalo"
2. Claude discovers MCP server (registry or .well-known/mcp.json)
3. Claude calls `update_links` tool with auth token
4. MCP server calls `POST /api/pages/{id}/links` (same endpoint as GUI)
5. API validates, updates Supabase, invalidates cache
6. Claude confirms to creator

---

## 5. API Design (Agent-First)

**Principle: The GUI and the MCP server are equal clients of the same API.**

### REST API Endpoints

All under `/api/v1/`. Auth via Bearer token (Supabase JWT or API key).

**Pages:** `GET|POST /pages`, `GET|PUT|DELETE /pages/:id`

**Links:** `GET|POST /pages/:id/links`, `PUT|DELETE /pages/:id/links/:linkId`, `PATCH /pages/:id/links/reorder`

**Analytics:** `GET /analytics/overview`, `GET /analytics/links`, `GET /analytics/timeseries`

**Contacts:** `GET /contacts`, `POST /contacts/export`, `DELETE /contacts/:id`

**Domains:** `GET|POST /domains`, `GET /domains/:id/verify`, `DELETE /domains/:id`

**Billing:** `GET /account`, `GET /billing`, `POST /billing/portal`

### Rate Limits

| Plan | Daily API Calls | Overage |
|---|---|---|
| Free | 100/day | Hard cap |
| Pro ($7/mo) | 10,000/day | $0.001/call |
| Business ($19/mo) | 50,000/day | $0.001/call |

---

## 6. MCP Server Specification

The MCP server is a TypeScript npm package (`@portalo/mcp-server`) that wraps the REST API. ~700 lines of code. Ships at MVP.

### Tools Exposed (15 tools)

| Tool | Description | Key Parameters |
|---|---|---|
| `list_pages` | Get user's pages | — |
| `get_page` | Page details + links | page_id |
| `create_page` | Create a new page | slug, title?, bio?, theme? |
| `update_page` | Update page properties | page_id, slug?, title?, bio?, theme?, published?, settings? |
| `delete_page` | Delete page + links | page_id |
| `add_link` | Add link to page | page_id, url, title, position? |
| `update_link` | Edit link | page_id, link_id, url?, title?, visible? |
| `remove_link` | Delete link | page_id, link_id |
| `reorder_links` | Change order | page_id, link_ids[] |
| `get_analytics` | Click/view data | page_id, period? |
| `export_contacts` | Download emails | page_id |
| `get_account` | Profile + plan info | — |
| `list_domains` | List custom domains | — |
| `add_domain` | Add custom domain | page_id, domain |
| `remove_domain` | Remove custom domain | domain_id |

### Discovery

- `.well-known/mcp.json` at every custom domain root
- Published to MCP registries (Anthropic, community)
- `npm install @portalo/mcp-server` for self-hosted use

**Dev cost:** 3-5 days of one developer.

---

## 7. Database Schema

### Core Tables (Supabase Postgres)

```sql
-- Users (extended from Supabase Auth)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  display_name TEXT,
  avatar_url TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free','pro','business')),
  stripe_customer_id TEXT,
  api_key_hash TEXT,
  api_calls_today INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pages
CREATE TABLE pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT, bio TEXT,
  theme JSONB DEFAULT '{}',
  settings JSONB DEFAULT '{}',
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, slug)
);

-- Links
CREATE TABLE links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
  url TEXT NOT NULL, title TEXT NOT NULL,
  thumbnail_url TEXT,
  position INT NOT NULL DEFAULT 0,
  visible BOOLEAN DEFAULT true,
  schedule_start TIMESTAMPTZ, schedule_end TIMESTAMPTZ,
  clicks INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Custom Domains
CREATE TABLE domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
  domain TEXT NOT NULL UNIQUE,
  verified BOOLEAN DEFAULT false,
  ssl_status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics Events (append-only, partitioned by month)
CREATE TABLE analytics_events (
  id BIGSERIAL, page_id UUID NOT NULL, link_id UUID,
  event_type TEXT NOT NULL,  -- 'view','click','email_capture'
  referrer TEXT, country TEXT, device TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
) PARTITION BY RANGE (created_at);

-- Contacts (email captures)
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
  email TEXT NOT NULL, source TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(page_id, email)
);
```

All tables have Row-Level Security (RLS) — users can only access their own data.


---

## 8. Infrastructure & Deployment

| Component | Provider | Plan | Purpose |
|---|---|---|---|
| Next.js App (Dashboard) | Cloudflare Pages | Free | Dashboard + API routes |
| Creator Page Rendering | Cloudflare Workers | Paid ($5/mo) | Edge render + cache |
| Static Assets | Cloudflare R2 | Free (10GB) | Images, avatars |
| Database + Auth + Storage | Supabase | Pro ($25/mo) | Core data layer |
| Custom Domains + SSL | Cloudflare for SaaS | Included | CNAME + auto-SSL |
| Billing | Stripe | Per-transaction | 2.9% + $0.30/charge |
| Email | Resend | Free (3K/mo) | Verification, notifications |
| Error tracking | Sentry | Free (5K events) | Bug tracking |
| Domain (portalo.so) | Cloudflare Registrar | ~$10/year | Primary domain |

### CI/CD

```
GitHub Push → Cloudflare Pages Build → Preview Deploy (PR)
                                     → Production Deploy (merge to main)
```

Build time ~60s. Preview URLs on every PR. Zero-downtime deploys. DB migrations via Supabase CLI in CI.

---

## 9. Cost Analysis

### Monthly Infrastructure by Scale

| Component | 0 Users (Dev) | 1K Users | 10K Users | 50K Users |
|---|---|---|---|---|
| Cloudflare Pages | $0 | $0 | $0 | $0 |
| Cloudflare Workers | $5 | $5 | $5 | $5.30 |
| Cloudflare R2 | $0 | $0 | $0.15 | $0.75 |
| Supabase Pro | $25 | $25 | $25 | $50* |
| Resend | $0 | $0 | $0 | $20 |
| Sentry | $0 | $0 | $0 | $0 |
| Stripe fees | $0 | ~$15 | ~$150 | ~$750 |
| Domain | $0.83 | $0.83 | $0.83 | $0.83 |
| **TOTAL INFRA** | **$30.83** | **$30.83** | **$31** | **$77** |

*Supabase compute upgrade at 50K+ heavy writes ($50/mo Small compute)

Stripe fees are pass-through on Pro subscription revenue. At 10K users, 10% conversion ($7/mo) = $150/mo Stripe on $7,000 MRR (2.1% effective rate).

### Why This Is Cheap

Creator pages are **static HTML cached at the edge**. Whether 1 or 1M people visit, Cloudflare serves from cache. Database only hit on edits (rare) or analytics writes (batched async). Estimated competitor comparison: Linktree at 50M users likely spends $2-5M/year on infra. Portalo at equivalent scale: <$5K/year.

### Development Costs (12-Week MVP)

| Scenario | People Cost | Infra (3mo) | Total |
|---|---|---|---|
| Solo technical founder + AI coding tools | $0 (sweat equity) | $93 | **~$1,100** |
| Founder + 1 contract dev ($80/hr, 20hr/wk) | $19,200 | $93 | **~$20,300** |
| Founder + 1 FT dev + contract designer | $44K-68K | $93 | **$45K-69K** |

### Service-by-Service Pricing Detail

**Cloudflare Workers (Paid Plan — $5/mo base):**
- Includes 10M requests/mo + 30M CPU-ms
- Overage: $0.30/million requests + $0.02/million CPU-ms
- At 1M page views/mo (aggressive growth): still within base plan
- Static asset requests (R2): free and unlimited

**Cloudflare R2 (Object Storage):**
- Free: 10GB storage, 10M Class A ops, 10M Class B ops/mo
- Overage: $0.015/GB storage, $4.50/million Class A, $0.36/million Class B
- At 10K users with ~100KB avg page assets = 1GB → $0.015/mo

**Supabase Pro ($25/mo):**
- 8GB database, 250GB bandwidth, 100GB storage
- 500K monthly active users (auth)
- Unlimited API calls
- Overage: $0.09/GB bandwidth, $0.021/GB storage
- Compute upgrade: Small ($50/mo) at 50K+ users if write-heavy

**Stripe:**
- 2.9% + $0.30 per successful charge (US cards)
- No monthly fee, no setup fee
- Billing Portal (customer self-service): free
- Metered billing (API overage): free to set up

**Resend (Transactional Email):**
- Free: 3,000 emails/mo, 1 custom domain
- Pro ($20/mo): 50,000 emails/mo
- At launch: well within free tier (verification + notification emails)

**Sentry (Error Tracking):**
- Developer plan: free, 5K errors/mo, 10K transactions
- Team ($26/mo): 50K errors/mo — upgrade only if needed

### Cost Projection: First 24 Months

| Month | Users | Pro Subs | MRR | Infra Cost | Stripe | **Net Margin** |
|---|---|---|---|---|---|---|
| 1-3 | 0-100 | 0-5 | $0-35 | $31 | $1 | -$31 to +$3 |
| 4-6 | 100-1K | 10-50 | $70-350 | $31 | $2-10 | +$37 to +$309 |
| 7-9 | 1K-3K | 50-200 | $350-1,400 | $31 | $10-41 | +$309 to +$1,328 |
| 10-12 | 3K-10K | 200-700 | $1,400-4,900 | $35 | $41-143 | +$1,324 to +$4,722 |
| 13-18 | 10K-25K | 700-2K | $4,900-14K | $50 | $143-406 | +$4,707 to +$13,544 |
| 19-24 | 25K-50K | 2K-4K | $14K-28K | $77 | $406-812 | +$13,517 to +$27,111 |

**Breakeven: Month 4-5** (infra costs covered by ~5 Pro subscribers)

---

## 10. Development Phases & Sprint Plan

### Phase 0: Validate (Weeks 1-2)

| Task | Deliverable |
|---|---|
| Landing page (portalo.so) | Next.js + Tailwind on CF Pages |
| Waitlist with email capture | Supabase table + Resend confirmation |
| $500 paid ads (Reddit, IG) | Traffic to landing page |
| API design doc + MCP schema | OpenAPI spec + MCP tool definitions |
| Design system (Figma) | Component library, 3 themes |

**Go/No-Go:** >5% landing page conversion AND >40% positive WTP in survey.

### Phase 1: Core API + Auth (Weeks 3-5)

- Week 3: Supabase setup, DB schema, RLS, Auth config (Google + magic link), Next.js scaffold, pages + links CRUD API
- Week 4: Dashboard shell (sidebar, page list, settings), page editor (form for title/bio/links), analytics + contacts API, Zod validation
- Week 5: API key generation + management, rate limiting middleware, API docs (auto-gen from OpenAPI), integration tests

### Phase 2: Builder + Domains + MCP (Weeks 6-8)

- Week 6: Drag-and-drop link reordering (@dnd-kit), theme selector (3 themes), live preview panel
- Week 7: CF Worker for edge rendering, R2 cache (write-on-save, invalidate-on-edit), custom domain flow (CNAME + verification), CF for SaaS auto-SSL
- Week 8: MCP server implementation (~500 LOC), npm publish (@portalo/mcp-server), .well-known/mcp.json, test with Claude Code end-to-end

### Phase 3: Monetize + Analytics (Weeks 9-11)

- Week 9: Stripe checkout + webhooks + portal, free/pro gating middleware, one-click cancel
- Week 10: Analytics dashboard (clicks, views, top links, referrers), Recharts visualizations, event pipeline (batched inserts)
- Week 11: Email capture widget, contact list + CSV export, link scheduling, PWA manifest + service worker

### Phase 4: Launch (Week 12)

- Product Hunt launch (listing, demo video, founder story)
- Reddit posts (r/socialmedia, r/Entrepreneur, r/smallbusiness)
- SEO content: "Linktree alternatives 2026" blog post
- Gift Pro to 50 micro-influencers (5K-50K followers)
- MCP registry submissions + "Manage link-in-bio with Claude" tutorial
- Bug bash + load testing

---

## 11. Security & Compliance

**Authentication:** Supabase Auth (magic link, Google OAuth). JWT with 1hr expiry. API keys hashed with bcrypt. No passwords stored by Portalo.

**Data Protection:** TLS 1.3 everywhere (Cloudflare). AES-256 at rest (Supabase). RLS on every table. Rate limiting on all endpoints.

**Billing Security:** Stripe handles all payment data — Portalo never sees cards. Webhook signature verification. One-click cancel, no dark patterns.

**GDPR/Privacy:** Full JSON data export via API. Hard delete within 48 hours. No tracking cookies on creator pages. Click events store country/device only (no IPs). Plain-language privacy policy at launch.

---

## 12. Monitoring & Observability

- **Sentry** (free): Runtime errors + source maps
- **Cloudflare Analytics** (free): Edge request monitoring
- **Supabase Dashboard** (included): Database health, query performance
- **UptimeRobot** (free): External URL monitoring
- **Custom dashboard metrics:** Signups/day, free-to-pro conversion, API calls (human vs agent), page views, churn triggers
- Target: 99.9% uptime for creator pages (edge-served, inherently reliable)

---

## 13. Risk Register

| Risk | Impact | Likelihood | Mitigation |
|---|---|---|---|
| Supabase outage → dashboard down | HIGH | LOW | Creator pages served from CF edge cache (unaffected). Dashboard shows "maintenance" page. |
| Cloudflare outage → pages down | HIGH | VERY LOW | Multi-cloud failover not worth it at MVP. Accept risk. CF has 99.99% historical uptime. |
| Stripe changes pricing | MED | LOW | Abstract billing behind interface. Could swap to LemonSqueezy/Paddle in 1-2 weeks. |
| Custom domain SSL fails | MED | MED | Fallback to portalo.so subdomain. Clear error messaging. Manual SSL debug in dashboard. |
| MCP protocol changes/abandoned | LOW | LOW | MCP server is thin wrapper. Adaptation is 1-2 days of work. REST API works regardless. |
| Supabase free tier limits hit | MED | MED | Already budgeted for Pro ($25/mo). Upgrade path clear. |
| Creator pages get DDoS'd | MED | LOW | Cloudflare DDoS protection included free. Edge cache absorbs traffic. |
| AI-generated page builders eat market | HIGH | MED | This is the core thesis risk. Mitigated by agent-first architecture — Portalo is the infrastructure agents build on, not the page they replace. |

---

## Appendix A: Why Supabase Over Neon / PlanetScale / D1

| Factor | Supabase | Neon | PlanetScale | Cloudflare D1 |
|---|---|---|---|---|
| **What you get** | Postgres + Auth + Storage + Realtime + Edge Functions | Postgres only | Postgres/MySQL only | SQLite only |
| **Auth built-in** | ✅ Yes (saves $50-100/mo vs Clerk/Auth0) | ❌ No | ❌ No | ❌ No |
| **Storage built-in** | ✅ Yes (saves $10-20/mo vs S3) | ❌ No | ❌ No | ❌ No |
| **Free tier** | 500MB DB, 1GB storage, 2 projects | 0.5GB, branching | Limited | 5GB, 100K writes/day |
| **Pro price** | $25/mo (all-in) | $19/mo (DB only) | $39/mo (DB only) | $5/mo (Workers plan) |
| **True cost at MVP** | $25/mo total | $19 + $25 Clerk + $5 R2 = $49+ | $39 + $25 Clerk + $5 R2 = $69+ | $5 + custom auth + custom storage = complex |
| **Dev experience** | Excellent dashboard, client libs | Good, Vercel-first | Good | Immature tooling |

**Verdict:** Supabase is cheapest *total cost* because it bundles auth and storage that would cost $25-50/mo extra from standalone providers. For a bootstrapped MVP, the all-in-one platform at $25/mo is the clear winner.

---

## Appendix B: Monorepo Structure

```
portalo/
├── apps/
│   └── web/                    # Next.js 15 app
│       ├── app/
│       │   ├── (auth)/         # Login, signup, magic link
│       │   ├── (dashboard)/    # Creator dashboard
│       │   │   ├── pages/      # Page management
│       │   │   ├── analytics/  # Analytics dashboard
│       │   │   ├── contacts/   # Email list management
│       │   │   ├── settings/   # Account, billing, API keys
│       │   │   └── layout.tsx  # Dashboard shell
│       │   ├── api/
│       │   │   └── v1/         # REST API endpoints
│       │   └── [slug]/         # Public creator page (fallback)
│       ├── components/         # Shared React components
│       ├── lib/                # Supabase client, utils
│       └── public/             # Static assets
├── packages/
│   ├── mcp-server/             # @portalo/mcp-server
│   ├── edge-renderer/          # Cloudflare Worker for page rendering
│   └── shared/                 # Types, validation schemas (Zod)
├── supabase/
│   ├── migrations/             # SQL migrations
│   └── seed.sql                # Test data
├── turbo.json                  # Turborepo config
└── package.json
```

---

*Document prepared February 2026. All pricing verified against provider documentation as of Feb 2026. Prices subject to change — always check provider pricing pages before committing.*
