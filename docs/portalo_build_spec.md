# PORTALO — Build Specification for Claude Code Agents

**Purpose:** This document is a complete implementation specification designed to be fed directly to Claude Code agents for autonomous building. Every section contains enough detail to produce working code without ambiguity.

**Version:** 2.0 | **Date:** February 2026 | **Target:** 12-week MVP

---

## TABLE OF CONTENTS

1. Project Overview & Philosophy
2. Design System & UI Specification
3. Tech Stack & Dependencies
4. Project Structure
5. Database Schema & RLS Policies
6. Authentication Flow
7. API Specification (REST + MCP)
8. Dashboard Pages (Creator-Facing)
9. Public Page Rendering (Audience-Facing)
10. Custom Domain System
11. Billing & Plan Gating
12. Analytics Pipeline
13. MCP Server Implementation
14. PWA Configuration
15. Deployment & CI/CD
16. Testing Strategy
17. Environment Variables
18. Sprint-by-Sprint Build Order

---

## 1. PROJECT OVERVIEW & PHILOSOPHY

### What is Portalo?

A link-in-bio platform where AI agents are first-class citizens. Creators get a clean page builder. AI agents (Claude, ChatGPT, etc.) get an MCP server and REST API to manage pages programmatically. The GUI and agents use the SAME API — the GUI is just another client.

### Three Non-Negotiable Principles

1. **API-first:** Every feature is an API endpoint BEFORE it has a UI. The dashboard consumes the API. The MCP server consumes the API. No special GUI-only logic.
2. **Edge-served pages:** Creator public pages are static HTML cached at Cloudflare's edge. 99% of traffic never touches the database.
3. **Agent-native:** MCP server ships at MVP, not v2. `.well-known/mcp.json` on every custom domain.

---

## 2. DESIGN SYSTEM & UI SPECIFICATION

### Design Philosophy: "Content-Dense Calm"

Portalo's UI takes its cues from **Reddit (new)**, **Claude.ai**, **Linear**, and **Notion** — products that feel like professional tools, not toy dashboards. The aesthetic is: high information density, generous whitespace, no decorative noise, and typographic hierarchy doing all the heavy lifting.

**ANTI-PATTERNS (things competitors do that we reject):**
- ❌ Rounded cards with drop shadows everywhere (Linktree, Beacons, Stan)
- ❌ Candy-colored gradients on everything
- ❌ Excessive use of icons as decoration
- ❌ Card grids that waste 60% of screen as padding
- ❌ "Dashboard" aesthetic with 47 widgets on one screen
- ❌ Chunky pill buttons and oversized touch targets on desktop
- ❌ Generic SaaS template vibes (Inter font, purple gradient, white cards)

**WHAT WE DO INSTEAD:**
- ✅ Full-width content areas with tight, purposeful spacing
- ✅ Text-dominant layout — the content IS the interface
- ✅ Flat, borderless design — sections separated by spacing and subtle dividers, not cards
- ✅ Monochrome + one accent color (not a rainbow)
- ✅ Dense information — less scrolling, more visible at once
- ✅ Hover states and transitions as the primary interactivity signal
- ✅ Keyboard-first interactions (slash commands, shortcuts)

### Color System

```css
:root {
  /* Background layers (light mode) */
  --bg-primary: #FFFFFF;
  --bg-secondary: #F9FAFB;       /* Subtle section differentiation */
  --bg-tertiary: #F3F4F6;        /* Input fields, code blocks */
  --bg-hover: #F3F4F6;           /* Row/item hover */
  --bg-active: #EEF2FF;          /* Selected/active item — very subtle indigo tint */

  /* Text hierarchy */
  --text-primary: #111827;        /* Headings, primary content */
  --text-secondary: #6B7280;      /* Descriptions, metadata, timestamps */
  --text-tertiary: #9CA3AF;       /* Placeholders, disabled */
  --text-inverse: #FFFFFF;        /* Text on accent backgrounds */

  /* Accent — single color, used sparingly */
  --accent: #4F46E5;              /* Indigo-600 — primary actions only */
  --accent-hover: #4338CA;        /* Indigo-700 */
  --accent-subtle: #EEF2FF;       /* Indigo-50 — selected states, badges */
  --accent-text: #4F46E5;         /* Links, active nav items */

  /* Semantic */
  --success: #059669;             /* Green — verified, published */
  --warning: #D97706;             /* Amber — pending, attention */
  --error: #DC2626;               /* Red — errors, destructive */

  /* Borders — barely visible, structural */
  --border-primary: #E5E7EB;      /* Section dividers */
  --border-secondary: #F3F4F6;    /* Subtle separators */

  /* Shadows — used EXTREMELY sparingly */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.04);
  --shadow-md: 0 2px 8px rgba(0,0,0,0.08);  /* Only for overlays/dropdowns */
}

/* Dark mode (implement in v1.1, design for it now) */
:root[data-theme="dark"] {
  --bg-primary: #0F0F0F;
  --bg-secondary: #171717;
  --bg-tertiary: #1E1E1E;
  --bg-hover: #1E1E1E;
  --bg-active: #1E1B4B;
  --text-primary: #F9FAFB;
  --text-secondary: #9CA3AF;
  --text-tertiary: #6B7280;
  --accent: #818CF8;
  --accent-hover: #6366F1;
  --accent-subtle: #1E1B4B;
  --accent-text: #818CF8;
  --border-primary: #262626;
  --border-secondary: #1E1E1E;
}
```

### Typography

```css
/* Use system font stack — fast, native, clean. Intentionally NOT a custom Google Font.
   This is what Claude.ai, Linear, and GitHub use. It looks professional
   and loads in 0ms. */

:root {
  --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans",
    Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
  --font-mono: "SF Mono", "Cascadia Mono", "Segoe UI Mono", "Ubuntu Mono",
    "Roboto Mono", Menlo, Monaco, Consolas, monospace;
}

/* Type scale — tight, dense, purposeful */
.text-page-title   { font-size: 1.5rem;   font-weight: 600; line-height: 1.2; letter-spacing: -0.025em; }
.text-section-title { font-size: 1.125rem; font-weight: 600; line-height: 1.3; letter-spacing: -0.015em; }
.text-body          { font-size: 0.875rem; font-weight: 400; line-height: 1.5; }
.text-body-strong   { font-size: 0.875rem; font-weight: 500; line-height: 1.5; }
.text-small         { font-size: 0.8125rem; font-weight: 400; line-height: 1.4; color: var(--text-secondary); }
.text-tiny          { font-size: 0.75rem;  font-weight: 400; line-height: 1.4; color: var(--text-tertiary); }
.text-mono          { font-family: var(--font-mono); font-size: 0.8125rem; }
```

### Layout Patterns

**Sidebar Navigation (Claude.ai / Linear style):**
```
┌──────────────────────────────────────────────────────────────┐
│ ┌─────────┐ ┌──────────────────────────────────────────────┐ │
│ │         │ │                                              │ │
│ │  SIDE   │ │              MAIN CONTENT                    │ │
│ │  NAV    │ │                                              │ │
│ │         │ │  Content fills full width.                   │ │
│ │  240px  │ │  No cards. No wrappers.                     │ │
│ │  fixed  │ │  Just content with typographic hierarchy.    │ │
│ │         │ │                                              │ │
│ │         │ │  Sections separated by:                      │ │
│ │         │ │  - 1px border-bottom (var(--border-primary)) │ │
│ │         │ │  - OR 32px vertical spacing                  │ │
│ │         │ │  - NOT cards or boxes                        │ │
│ │         │ │                                              │ │
│ └─────────┘ └──────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

**Sidebar items (like Claude.ai):**
- Text-only nav items, no icons (or very subtle 16px icons, optional)
- Active item: `bg-active` background + `accent-text` color
- Hover: `bg-hover` background
- Grouped with tiny uppercase labels: "PAGES", "SETTINGS"
- Bottom of sidebar: user avatar + name + plan badge

**Content Area:**
- Max width: 960px for forms/settings, full-width for tables/lists
- Page title at top-left, primary action button at top-right (same row)
- Inline forms — NO modal dialogs for simple edits (edit in place)
- Tables: full-width, no borders between columns, light row hover

**Mobile (< 768px):**
- Sidebar collapses to bottom tab bar (5 items max)
- Content goes full-width with 16px horizontal padding
- Same typographic hierarchy, just stacked

### Component Specifications

**Buttons:**
```
Primary:   bg-accent, text-white, no border, 6px 16px padding, rounded-md (6px), font-weight 500
Secondary: bg-transparent, text-primary, 1px border border-primary, same padding
Ghost:     bg-transparent, text-secondary, no border, hover: bg-hover
Danger:    bg-transparent, text-error, no border, hover: bg-error/10

SIZE: 32px height (sm), 36px height (default), 40px height (lg)
NO: pill shapes, gradients, shadows on buttons, ALL-CAPS text
```

**Inputs:**
```
bg-tertiary, no visible border (or 1px border-secondary), rounded-md
Focus: ring-2 ring-accent/20, border-accent
Height: 36px (matches button height)
Label ABOVE input (not floating label)
```

**Links List (the core product UI — editing links on a page):**
```
Each link is a ROW, not a card:
┌──────────────────────────────────────────────────────────────┐
│ ⠿  Title of the Link                    clicks: 1,247   👁 │
│    https://example.com/my-link           ✏️  🗑               │
└──────────────────────────────────────────────────────────────┘

- Drag handle (⠿) on left, always visible
- Title is primary text, URL is secondary text below
- Click count right-aligned, muted
- Edit/delete actions appear on hover (hidden by default)
- Active drag: subtle shadow-sm, slight scale(1.01)
- Rows separated by 1px border, NOT cards with gaps
- This is a FLAT LIST like a to-do app, not a card grid
```

**Empty States:**
```
Centered text, no illustration:
"No links yet. Add your first link to get started."
[+ Add link] button below, centered

NO: cartoon illustrations, confetti, excessive hand-holding
YES: one sentence of context + the action button
```

**Toasts/Notifications:**
```
Bottom-right, minimal:
- Success: "Link added" (no icon, or tiny ✓)
- Error: "Failed to save" (no icon, or tiny ✕)
- Auto-dismiss after 3 seconds
- Small, text-only, bg-primary with shadow-md
```

### Page-by-Page UI Specifications

#### Dashboard Home (`/dashboard`)
- Page title: "Pages" (top-left)
- Button: "+ New page" (top-right, primary)
- Below: list of user's pages as rows
  - Each row: page title, slug (`/username`), status (published/draft), view count
  - Click row → navigate to page editor
- If 0 pages: empty state with "Create your first page" + button

#### Page Editor (`/dashboard/pages/[id]`)
- Split layout on desktop: Editor (left 60%) + Live Preview (right 40%)
- Editor side:
  - Title input (large, 1.5rem, no label — placeholder "Page title")
  - Bio textarea (auto-growing, placeholder "Write a short bio...")
  - "Links" section header with "+ Add link" button
  - Sortable link list (drag handle + title + url + click count)
  - Click a link to expand inline edit (title, url, visibility toggle, schedule)
  - "Theme" section: 3 theme presets as small clickable thumbnails
  - "Settings" section: slug input, published toggle
- Preview side:
  - Sticky, shows phone-frame preview of the page
  - Updates live as edits are made (debounced 500ms)
  - Frame: 375px wide, centered, thin border, rounded-xl, subtle shadow
  - Shows exactly what the audience will see

#### Analytics (`/dashboard/analytics`)
- Period selector: "7d | 30d | 90d" toggle (top-right, ghost buttons)
- Key metrics row (NOT cards — just numbers in a row):
  - "1,247 views · 342 clicks · 27.4% CTR · 12 emails captured"
- Below: Recharts line chart (views + clicks over time, two lines)
- Below chart: "Top Links" table — sorted by clicks, full-width
  - Columns: Link title, URL (truncated), Clicks, CTR
- Below: "Referrers" and "Countries" as two side-by-side tables

#### Contacts (`/dashboard/contacts`)
- Page title: "Contacts" + "Export CSV" button (top-right, secondary)
- Full-width table of captured emails
  - Columns: Email, Source page, Captured date
  - No pagination initially (load all, virtual scroll if >100)

#### Settings (`/dashboard/settings`)
- Vertical sections separated by borders, no tabs:
  - **Profile** — Display name, avatar upload, bio
  - **Custom Domain** — Domain input, CNAME instructions, verification status
  - **API Key** — Generated key (shown once), regenerate button, usage count
  - **Billing** — Current plan, usage, "Manage billing" (→ Stripe Portal)
  - **Danger Zone** — "Delete account" (requires typing "DELETE" to confirm)

#### Auth Pages (`/login`, `/signup`)
- Centered on screen, max-width 360px
- Logo at top (text logo "Portalo", not an image)
- "Sign in with Google" button (full-width, secondary style)
- Divider: "or"
- Email input + "Send magic link" button
- Below: "Don't have an account? Sign up" link
- NO: hero images, feature lists, social proof on auth pages
- Background: bg-primary (white), that's it

### Public Creator Page Design (what audiences see)

**CRITICAL DIFFERENTIATION:** Every competitor (Linktree, Beacons, Stan, Koji) uses stacked rounded-corner cards on a colored background. Portalo pages look NOTHING like this.

**Portalo public pages look like a clean personal website, not a link list.**

#### Default Theme: "Clean"
```
┌─────────────────────────────────┐
│                                 │
│        Avatar (48px circle)     │
│        Creator Name             │
│        Short bio text           │
│                                 │
│  ─────────────────────────────  │
│                                 │
│  → My Latest YouTube Video      │
│  → Buy my course ($49)          │
│  → Newsletter signup             │
│  → Twitter                      │
│  → Instagram                    │
│                                 │
│  ─────────────────────────────  │
│                                 │
│        📧 Get updates           │
│        [email input] [→]        │
│                                 │
│        Powered by Portalo     │
│                                 │
└─────────────────────────────────┘

- Links are PLAIN TEXT with a → prefix, not buttons or cards
- Each link is a full-width clickable row with hover underline
- No borders, no boxes, no shadows on links
- Background: pure white (or theme color)
- Typography-driven — feels like a curated personal page
- Max-width: 480px, centered
- Mobile: already mobile-optimized (it's basically mobile-first)
```

#### Theme: "Minimal Dark"
- Same layout, bg: #0F0F0F, text: #F9FAFB
- Links in light gray, hover → white
- Accent color for email capture button

#### Theme: "Editorial"
- Serif font for creator name (Georgia or similar)
- Slightly wider max-width (520px)
- Bio text is larger and more prominent
- Links styled as an ordered list with numbers
- Feels like a magazine's contributor page


---

## 3. TECH STACK & DEPENDENCIES

### package.json (root — Turborepo monorepo)

```json
{
  "name": "portalo",
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "devDependencies": {
    "turbo": "^2.x",
    "typescript": "^5.x"
  }
}
```

### apps/web/package.json (Next.js app)

```json
{
  "name": "@portalo/web",
  "dependencies": {
    "next": "^15.x",
    "react": "^19.x",
    "react-dom": "^19.x",
    "@supabase/supabase-js": "^2.x",
    "@supabase/ssr": "^0.x",
    "tailwindcss": "^4.x",
    "@dnd-kit/core": "^6.x",
    "@dnd-kit/sortable": "^8.x",
    "@dnd-kit/utilities": "^3.x",
    "recharts": "^2.x",
    "zod": "^3.x",
    "stripe": "^17.x",
    "resend": "^4.x",
    "sonner": "^1.x",
    "clsx": "^2.x",
    "date-fns": "^3.x"
  },
  "devDependencies": {
    "@types/react": "^19.x",
    "@types/node": "^22.x",
    "eslint": "^9.x",
    "eslint-config-next": "^15.x",
    "vitest": "^2.x",
    "@testing-library/react": "^16.x"
  }
}
```

### packages/mcp-server/package.json

```json
{
  "name": "@portalo/mcp-server",
  "version": "0.1.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.x"
  }
}
```

### Key Tooling

| Tool | Version | Purpose |
|---|---|---|
| Node.js | 22.x LTS | Runtime |
| pnpm | 9.x | Package manager (workspaces) |
| Turborepo | 2.x | Monorepo build orchestration |
| Supabase CLI | latest | Local dev, migrations, seed |
| Wrangler (Cloudflare) | latest | Workers/Pages local dev + deploy |
| Vitest | 2.x | Unit + integration tests |
| Playwright | latest | E2E tests (week 11 only) |

---

## 4. PROJECT STRUCTURE

```
portalo/
├── apps/
│   └── web/                           # Next.js 15 application
│       ├── app/
│       │   ├── (auth)/                # Auth route group (no sidebar)
│       │   │   ├── login/page.tsx
│       │   │   ├── signup/page.tsx
│       │   │   ├── auth/callback/route.ts  # Supabase OAuth callback
│       │   │   └── layout.tsx         # Centered, minimal layout
│       │   │
│       │   ├── (dashboard)/           # Dashboard route group (with sidebar)
│       │   │   ├── dashboard/
│       │   │   │   ├── page.tsx       # Pages list (home)
│       │   │   │   ├── pages/
│       │   │   │   │   ├── new/page.tsx
│       │   │   │   │   └── [id]/
│       │   │   │   │       ├── page.tsx        # Page editor
│       │   │   │   │       └── analytics/page.tsx
│       │   │   │   ├── contacts/page.tsx
│       │   │   │   ├── analytics/page.tsx      # Global analytics
│       │   │   │   └── settings/
│       │   │   │       ├── page.tsx            # Profile + general
│       │   │   │       ├── domain/page.tsx
│       │   │   │       ├── api/page.tsx
│       │   │   │       └── billing/page.tsx
│       │   │   └── layout.tsx         # Sidebar + main content layout
│       │   │
│       │   ├── api/
│       │   │   └── v1/
│       │   │       ├── pages/
│       │   │       │   ├── route.ts           # GET (list), POST (create)
│       │   │       │   └── [id]/
│       │   │       │       ├── route.ts       # GET, PUT, DELETE
│       │   │       │       └── links/
│       │   │       │           ├── route.ts   # GET (list), POST (create)
│       │   │       │           ├── [linkId]/route.ts  # PUT, DELETE
│       │   │       │           └── reorder/route.ts   # PATCH
│       │   │       ├── analytics/
│       │   │       │   ├── overview/route.ts
│       │   │       │   └── timeseries/route.ts
│       │   │       ├── contacts/
│       │   │       │   ├── route.ts
│       │   │       │   └── export/route.ts
│       │   │       ├── domains/
│       │   │       │   ├── route.ts
│       │   │       │   └── [id]/verify/route.ts
│       │   │       ├── billing/
│       │   │       │   ├── route.ts
│       │   │       │   └── portal/route.ts
│       │   │       └── account/
│       │   │           ├── route.ts
│       │   │           └── api-key/route.ts
│       │   │
│       │   ├── [slug]/               # Public creator page (catch-all fallback)
│       │   │   └── page.tsx
│       │   │
│       │   ├── .well-known/
│       │   │   └── mcp.json/route.ts  # MCP discovery endpoint
│       │   │
│       │   ├── layout.tsx             # Root layout
│       │   ├── globals.css            # CSS variables + Tailwind base
│       │   └── not-found.tsx
│       │
│       ├── components/
│       │   ├── ui/                    # Primitive components
│       │   │   ├── button.tsx
│       │   │   ├── input.tsx
│       │   │   ├── textarea.tsx
│       │   │   ├── select.tsx
│       │   │   ├── toggle.tsx
│       │   │   ├── badge.tsx
│       │   │   ├── toast.tsx          # Uses sonner
│       │   │   ├── dropdown-menu.tsx
│       │   │   ├── dialog.tsx         # For confirmations only
│       │   │   └── skeleton.tsx       # Loading states
│       │   │
│       │   ├── dashboard/
│       │   │   ├── sidebar.tsx
│       │   │   ├── page-list.tsx
│       │   │   ├── page-editor.tsx
│       │   │   ├── link-list.tsx      # Sortable link list
│       │   │   ├── link-row.tsx       # Individual link row
│       │   │   ├── link-form.tsx      # Inline add/edit link
│       │   │   ├── theme-picker.tsx
│       │   │   ├── phone-preview.tsx  # Live preview frame
│       │   │   ├── analytics-chart.tsx
│       │   │   ├── metrics-row.tsx    # Key metrics display
│       │   │   ├── contacts-table.tsx
│       │   │   ├── domain-setup.tsx
│       │   │   ├── api-key-panel.tsx
│       │   │   └── plan-badge.tsx
│       │   │
│       │   └── public/                # Public page components
│       │       ├── creator-page.tsx   # The public page renderer
│       │       ├── link-item.tsx
│       │       ├── email-capture.tsx
│       │       └── powered-by.tsx
│       │
│       ├── lib/
│       │   ├── supabase/
│       │   │   ├── client.ts          # Browser client
│       │   │   ├── server.ts          # Server client (cookies)
│       │   │   ├── middleware.ts       # Auth middleware helper
│       │   │   └── admin.ts           # Service role client (API routes)
│       │   ├── stripe.ts              # Stripe client + helpers
│       │   ├── resend.ts              # Email client
│       │   ├── api-auth.ts            # API key validation
│       │   ├── rate-limit.ts          # Rate limiting logic
│       │   ├── cache.ts               # R2 cache invalidation
│       │   └── constants.ts           # Plan limits, feature flags
│       │
│       ├── hooks/
│       │   ├── use-page.ts            # SWR hook for page data
│       │   ├── use-links.ts           # SWR hook for links
│       │   ├── use-analytics.ts
│       │   └── use-user.ts
│       │
│       ├── middleware.ts              # Next.js middleware (auth redirect)
│       ├── next.config.ts
│       ├── tailwind.config.ts
│       └── tsconfig.json
│
├── packages/
│   ├── mcp-server/                    # @portalo/mcp-server
│   │   ├── src/
│   │   │   ├── index.ts              # Entry point
│   │   │   ├── server.ts             # MCP server setup
│   │   │   ├── tools/                # Tool implementations
│   │   │   │   ├── pages.ts
│   │   │   │   ├── links.ts
│   │   │   │   ├── analytics.ts
│   │   │   │   └── contacts.ts
│   │   │   └── api-client.ts         # REST API client wrapper
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── shared/                        # Shared types + validation
│       ├── src/
│       │   ├── types.ts              # TypeScript interfaces
│       │   ├── schemas.ts            # Zod validation schemas
│       │   └── constants.ts          # Shared constants
│       ├── package.json
│       └── tsconfig.json
│
├── supabase/
│   ├── migrations/
│   │   ├── 001_create_profiles.sql
│   │   ├── 002_create_pages.sql
│   │   ├── 003_create_links.sql
│   │   ├── 004_create_domains.sql
│   │   ├── 005_create_analytics.sql
│   │   ├── 006_create_contacts.sql
│   │   └── 007_rls_policies.sql
│   ├── seed.sql
│   └── config.toml
│
├── workers/
│   └── page-renderer/                # Cloudflare Worker
│       ├── src/index.ts
│       ├── wrangler.toml
│       └── package.json
│
├── turbo.json
├── pnpm-workspace.yaml
├── .env.example
├── .gitignore
└── README.md
```

---

## 5. DATABASE SCHEMA & RLS POLICIES

### Migration 001: profiles

```sql
-- 001_create_profiles.sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'business')),
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT,
  api_key_hash TEXT,
  api_calls_today INTEGER NOT NULL DEFAULT 0,
  api_calls_reset_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();
```

### Migration 002: pages

```sql
-- 002_create_pages.sql
CREATE TABLE public.pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT '',
  bio TEXT DEFAULT '',
  theme JSONB NOT NULL DEFAULT '{"name": "clean", "colors": {}}',
  settings JSONB NOT NULL DEFAULT '{"show_email_capture": true, "show_powered_by": true}',
  published BOOLEAN NOT NULL DEFAULT true,
  views_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(slug)
);

CREATE INDEX idx_pages_user_id ON public.pages(user_id);
CREATE INDEX idx_pages_slug ON public.pages(slug);

CREATE TRIGGER pages_updated_at
  BEFORE UPDATE ON public.pages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();
```

### Migration 003: links

```sql
-- 003_create_links.sql
CREATE TABLE public.links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES public.pages(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  thumbnail_url TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  visible BOOLEAN NOT NULL DEFAULT true,
  schedule_start TIMESTAMPTZ,
  schedule_end TIMESTAMPTZ,
  clicks INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_links_page_id ON public.links(page_id);
CREATE INDEX idx_links_position ON public.links(page_id, position);

CREATE TRIGGER links_updated_at
  BEFORE UPDATE ON public.links
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();
```

### Migration 004: domains

```sql
-- 004_create_domains.sql
CREATE TABLE public.domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES public.pages(id) ON DELETE CASCADE,
  domain TEXT NOT NULL UNIQUE,
  verified BOOLEAN NOT NULL DEFAULT false,
  ssl_status TEXT NOT NULL DEFAULT 'pending' CHECK (ssl_status IN ('pending', 'active', 'error')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_domains_domain ON public.domains(domain);

CREATE TRIGGER domains_updated_at
  BEFORE UPDATE ON public.domains
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();
```

### Migration 005: analytics_events

```sql
-- 005_create_analytics.sql
CREATE TABLE public.analytics_events (
  id BIGINT GENERATED ALWAYS AS IDENTITY,
  page_id UUID NOT NULL,
  link_id UUID,
  event_type TEXT NOT NULL CHECK (event_type IN ('view', 'click', 'email_capture')),
  referrer TEXT,
  country TEXT,
  device TEXT CHECK (device IN ('mobile', 'tablet', 'desktop', NULL)),
  browser TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
) PARTITION BY RANGE (created_at);

-- Create monthly partitions (create new ones via cron or manually)
CREATE TABLE analytics_events_2026_01 PARTITION OF analytics_events
  FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');
CREATE TABLE analytics_events_2026_02 PARTITION OF analytics_events
  FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');
CREATE TABLE analytics_events_2026_03 PARTITION OF analytics_events
  FOR VALUES FROM ('2026-03-01') TO ('2026-04-01');
CREATE TABLE analytics_events_2026_04 PARTITION OF analytics_events
  FOR VALUES FROM ('2026-04-01') TO ('2026-05-01');
CREATE TABLE analytics_events_2026_05 PARTITION OF analytics_events
  FOR VALUES FROM ('2026-05-01') TO ('2026-06-01');
CREATE TABLE analytics_events_2026_06 PARTITION OF analytics_events
  FOR VALUES FROM ('2026-06-01') TO ('2026-07-01');

CREATE INDEX idx_analytics_page_created ON analytics_events(page_id, created_at);
CREATE INDEX idx_analytics_link_created ON analytics_events(link_id, created_at) WHERE link_id IS NOT NULL;
```

### Migration 006: contacts

```sql
-- 006_create_contacts.sql
CREATE TABLE public.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES public.pages(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  source TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(page_id, email)
);

CREATE INDEX idx_contacts_page_id ON public.contacts(page_id);
```

### Migration 007: RLS Policies

```sql
-- 007_rls_policies.sql
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update own profile
CREATE POLICY profiles_select ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY profiles_update ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Pages: users can CRUD own pages
CREATE POLICY pages_select ON public.pages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY pages_insert ON public.pages FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY pages_update ON public.pages FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY pages_delete ON public.pages FOR DELETE USING (auth.uid() = user_id);

-- Pages: anyone can read published pages (for public rendering)
CREATE POLICY pages_public_read ON public.pages FOR SELECT
  USING (published = true);

-- Links: users can CRUD links on own pages
CREATE POLICY links_select ON public.links FOR SELECT
  USING (page_id IN (SELECT id FROM public.pages WHERE user_id = auth.uid()));
CREATE POLICY links_insert ON public.links FOR INSERT
  WITH CHECK (page_id IN (SELECT id FROM public.pages WHERE user_id = auth.uid()));
CREATE POLICY links_update ON public.links FOR UPDATE
  USING (page_id IN (SELECT id FROM public.pages WHERE user_id = auth.uid()));
CREATE POLICY links_delete ON public.links FOR DELETE
  USING (page_id IN (SELECT id FROM public.pages WHERE user_id = auth.uid()));

-- Links: anyone can read links on published pages
CREATE POLICY links_public_read ON public.links FOR SELECT
  USING (page_id IN (SELECT id FROM public.pages WHERE published = true));

-- Domains: users can CRUD domains on own pages
CREATE POLICY domains_select ON public.domains FOR SELECT
  USING (page_id IN (SELECT id FROM public.pages WHERE user_id = auth.uid()));
CREATE POLICY domains_insert ON public.domains FOR INSERT
  WITH CHECK (page_id IN (SELECT id FROM public.pages WHERE user_id = auth.uid()));
CREATE POLICY domains_update ON public.domains FOR UPDATE
  USING (page_id IN (SELECT id FROM public.pages WHERE user_id = auth.uid()));
CREATE POLICY domains_delete ON public.domains FOR DELETE
  USING (page_id IN (SELECT id FROM public.pages WHERE user_id = auth.uid()));

-- Analytics: users can read analytics for own pages
CREATE POLICY analytics_select ON public.analytics_events FOR SELECT
  USING (page_id IN (SELECT id FROM public.pages WHERE user_id = auth.uid()));
-- Analytics: service role inserts (from edge functions/API routes)
CREATE POLICY analytics_insert ON public.analytics_events FOR INSERT
  WITH CHECK (true);  -- Controlled at API layer, not RLS

-- Contacts: users can read/delete contacts on own pages
CREATE POLICY contacts_select ON public.contacts FOR SELECT
  USING (page_id IN (SELECT id FROM public.pages WHERE user_id = auth.uid()));
CREATE POLICY contacts_insert ON public.contacts FOR INSERT
  WITH CHECK (true);  -- Public email capture, controlled at API layer
CREATE POLICY contacts_delete ON public.contacts FOR DELETE
  USING (page_id IN (SELECT id FROM public.pages WHERE user_id = auth.uid()));
```


---

## 6. AUTHENTICATION FLOW

### Supabase Auth Configuration

```typescript
// lib/supabase/server.ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );
}
```

### Auth Methods (MVP)

1. **Google OAuth** — Primary. One-click signup.
2. **Magic Link** — Email-based, passwordless. Fallback for non-Google users.

NO password auth. NO username/password forms. This reduces security surface and simplifies UI.

### Middleware (route protection)

```typescript
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Redirect unauthenticated users away from dashboard
  if (!user && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect authenticated users away from auth pages
  if (user && (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/signup")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};
```

### API Key Authentication (for REST API + MCP)

```typescript
// lib/api-auth.ts
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function authenticateRequest(request: Request) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) return null;

  // Try Bearer token (Supabase JWT)
  if (authHeader.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    const { data: { user } } = await supabaseAdmin.auth.getUser(token);
    return user;
  }

  // Try API key (X-API-Key header)
  const apiKey = request.headers.get("X-API-Key");
  if (apiKey) {
    // Find profile where api_key_hash matches
    const { data: profiles } = await supabaseAdmin
      .from("profiles")
      .select("id, plan, api_calls_today, api_calls_reset_at");

    for (const profile of profiles || []) {
      if (profile.api_key_hash && await bcrypt.compare(apiKey, profile.api_key_hash)) {
        // Check rate limit
        const limit = profile.plan === "free" ? 100 : profile.plan === "pro" ? 10000 : 50000;
        if (profile.api_calls_today >= limit) {
          throw new Error("RATE_LIMIT_EXCEEDED");
        }
        // Increment counter
        await supabaseAdmin
          .from("profiles")
          .update({ api_calls_today: profile.api_calls_today + 1 })
          .eq("id", profile.id);
        return { id: profile.id } as any;
      }
    }
  }

  return null;
}
```

---

## 7. API SPECIFICATION

### Common Patterns

Every API route follows this structure:

```typescript
// Example: app/api/v1/pages/route.ts
import { NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/api-auth";
import { createPageSchema } from "@portalo/shared/schemas";

export async function GET(request: Request) {
  const user = await authenticateRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // ... fetch data ...
  return NextResponse.json({ data: pages });
}

export async function POST(request: Request) {
  const user = await authenticateRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = createPageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  // ... create resource ...
  return NextResponse.json({ data: page }, { status: 201 });
}
```

### Zod Schemas (packages/shared/src/schemas.ts)

```typescript
import { z } from "zod";

export const createPageSchema = z.object({
  slug: z.string().min(1).max(64).regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, hyphens only"),
  title: z.string().max(100).optional().default(""),
  bio: z.string().max(500).optional().default(""),
  theme: z.object({
    name: z.enum(["clean", "minimal-dark", "editorial"]).default("clean"),
    colors: z.record(z.string()).optional(),
  }).optional(),
});

export const updatePageSchema = createPageSchema.partial();

export const createLinkSchema = z.object({
  url: z.string().url("Must be a valid URL"),
  title: z.string().min(1).max(100),
  thumbnail_url: z.string().url().optional(),
  position: z.number().int().min(0).optional(),
  visible: z.boolean().optional().default(true),
  schedule_start: z.string().datetime().optional(),
  schedule_end: z.string().datetime().optional(),
});

export const updateLinkSchema = createLinkSchema.partial();

export const reorderLinksSchema = z.object({
  link_ids: z.array(z.string().uuid()).min(1),
});

export const createDomainSchema = z.object({
  domain: z.string().min(1).max(253).regex(
    /^[a-zA-Z0-9][a-zA-Z0-9-_.]+[a-zA-Z0-9]$/,
    "Invalid domain format"
  ),
  page_id: z.string().uuid(),
});

export const emailCaptureSchema = z.object({
  email: z.string().email(),
  page_id: z.string().uuid(),
});
```

### Endpoint Reference

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/v1/pages` | Required | List user's pages |
| `POST` | `/api/v1/pages` | Required | Create page |
| `GET` | `/api/v1/pages/:id` | Required | Get page details |
| `PUT` | `/api/v1/pages/:id` | Required | Update page |
| `DELETE` | `/api/v1/pages/:id` | Required | Delete page |
| `GET` | `/api/v1/pages/:id/links` | Required | List page's links |
| `POST` | `/api/v1/pages/:id/links` | Required | Add link |
| `PUT` | `/api/v1/pages/:id/links/:linkId` | Required | Update link |
| `DELETE` | `/api/v1/pages/:id/links/:linkId` | Required | Delete link |
| `PATCH` | `/api/v1/pages/:id/links/reorder` | Required | Reorder links |
| `GET` | `/api/v1/analytics/overview?page_id=X&period=7d` | Required | Analytics summary |
| `GET` | `/api/v1/analytics/timeseries?page_id=X&period=30d` | Required | Time series data |
| `GET` | `/api/v1/contacts?page_id=X` | Required | List contacts |
| `POST` | `/api/v1/contacts/export?page_id=X` | Required | Export CSV |
| `POST` | `/api/v1/domains` | Required | Add custom domain |
| `GET` | `/api/v1/domains/:id/verify` | Required | Check domain status |
| `DELETE` | `/api/v1/domains/:id` | Required | Remove domain |
| `GET` | `/api/v1/account` | Required | Get account info |
| `POST` | `/api/v1/account/api-key` | Required | Generate new API key |
| `GET` | `/api/v1/billing` | Required | Get billing info |
| `POST` | `/api/v1/billing/portal` | Required | Get Stripe portal URL |
| `POST` | `/api/v1/public/track` | None | Track analytics event |
| `POST` | `/api/v1/public/capture` | None | Capture email |
| `GET` | `/api/v1/public/page/:slug` | None | Get public page data |

---

## 8. STRIPE BILLING INTEGRATION

### Plans

```typescript
// lib/constants.ts
export const PLANS = {
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
    price: 700, // cents
    stripe_price_id: process.env.STRIPE_PRO_PRICE_ID!,
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
    price: 1900, // cents
    stripe_price_id: process.env.STRIPE_BUSINESS_PRICE_ID!,
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
} as const;
```

### Stripe Webhook Handler

```typescript
// app/api/webhooks/stripe/route.ts
import Stripe from "stripe";
import { headers } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  const body = await request.text();
  const sig = (await headers()).get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return new Response("Webhook signature verification failed", { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.user_id;
      const plan = session.metadata?.plan;
      if (userId && plan) {
        await supabase.from("profiles").update({
          plan,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string,
        }).eq("id", userId);
      }
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      await supabase.from("profiles").update({
        plan: "free",
        stripe_subscription_id: null,
      }).eq("stripe_subscription_id", sub.id);
      break;
    }
    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const priceId = sub.items.data[0]?.price.id;
      let plan = "free";
      if (priceId === process.env.STRIPE_PRO_PRICE_ID) plan = "pro";
      if (priceId === process.env.STRIPE_BUSINESS_PRICE_ID) plan = "business";
      await supabase.from("profiles").update({ plan })
        .eq("stripe_subscription_id", sub.id);
      break;
    }
  }

  return new Response("OK", { status: 200 });
}
```

---

## 9. MCP SERVER IMPLEMENTATION

```typescript
// packages/mcp-server/src/server.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

const API_BASE = process.env.PORTALO_API_URL || "https://portalo.so/api/v1";

async function apiCall(path: string, apiKey: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
      ...options.headers,
    },
  });
  if (!res.ok) throw new Error(`API error: ${res.status} ${await res.text()}`);
  return res.json();
}

export function createPortaloServer(apiKey: string) {
  const server = new McpServer({
    name: "portalo",
    version: "0.1.0",
  });

  server.tool("list_pages", "List all your Portalo pages", {}, async () => {
    const result = await apiCall("/pages", apiKey);
    return { content: [{ type: "text", text: JSON.stringify(result.data, null, 2) }] };
  });

  server.tool("get_page", "Get details of a specific page",
    { page_id: z.string().uuid().describe("The page ID") },
    async ({ page_id }) => {
      const result = await apiCall(`/pages/${page_id}`, apiKey);
      return { content: [{ type: "text", text: JSON.stringify(result.data, null, 2) }] };
    }
  );

  server.tool("add_link", "Add a new link to a page",
    {
      page_id: z.string().uuid().describe("The page ID"),
      url: z.string().url().describe("The link URL"),
      title: z.string().describe("Display title for the link"),
      position: z.number().optional().describe("Position in list (0-based)"),
    },
    async ({ page_id, url, title, position }) => {
      const result = await apiCall(`/pages/${page_id}/links`, apiKey, {
        method: "POST",
        body: JSON.stringify({ url, title, position }),
      });
      return { content: [{ type: "text", text: `Link added: ${title}\n${JSON.stringify(result.data)}` }] };
    }
  );

  server.tool("update_link", "Update an existing link",
    {
      page_id: z.string().uuid(),
      link_id: z.string().uuid(),
      url: z.string().url().optional(),
      title: z.string().optional(),
      visible: z.boolean().optional(),
    },
    async ({ page_id, link_id, ...updates }) => {
      const result = await apiCall(`/pages/${page_id}/links/${link_id}`, apiKey, {
        method: "PUT",
        body: JSON.stringify(updates),
      });
      return { content: [{ type: "text", text: JSON.stringify(result.data) }] };
    }
  );

  server.tool("remove_link", "Delete a link from a page",
    { page_id: z.string().uuid(), link_id: z.string().uuid() },
    async ({ page_id, link_id }) => {
      await apiCall(`/pages/${page_id}/links/${link_id}`, apiKey, { method: "DELETE" });
      return { content: [{ type: "text", text: "Link removed successfully" }] };
    }
  );

  server.tool("reorder_links", "Reorder links on a page",
    { page_id: z.string().uuid(), link_ids: z.array(z.string().uuid()).describe("Link IDs in desired order") },
    async ({ page_id, link_ids }) => {
      await apiCall(`/pages/${page_id}/links/reorder`, apiKey, {
        method: "PATCH",
        body: JSON.stringify({ link_ids }),
      });
      return { content: [{ type: "text", text: "Links reordered" }] };
    }
  );

  server.tool("get_analytics", "Get analytics for a page",
    { page_id: z.string().uuid(), period: z.enum(["7d","30d","90d"]).optional() },
    async ({ page_id, period = "7d" }) => {
      const result = await apiCall(`/analytics/overview?page_id=${page_id}&period=${period}`, apiKey);
      return { content: [{ type: "text", text: JSON.stringify(result.data, null, 2) }] };
    }
  );

  server.tool("export_contacts", "Export email contacts from a page",
    { page_id: z.string().uuid() },
    async ({ page_id }) => {
      const result = await apiCall(`/contacts?page_id=${page_id}`, apiKey);
      return { content: [{ type: "text", text: JSON.stringify(result.data, null, 2) }] };
    }
  );

  server.tool("update_theme", "Change the page theme",
    { page_id: z.string().uuid(), theme: z.enum(["clean","minimal-dark","editorial"]) },
    async ({ page_id, theme }) => {
      const result = await apiCall(`/pages/${page_id}`, apiKey, {
        method: "PUT",
        body: JSON.stringify({ theme: { name: theme } }),
      });
      return { content: [{ type: "text", text: `Theme changed to ${theme}` }] };
    }
  );

  return server;
}
```

### .well-known/mcp.json endpoint

```typescript
// app/.well-known/mcp.json/route.ts
export async function GET() {
  return Response.json({
    name: "Portalo",
    description: "Manage your link-in-bio page via AI",
    url: "https://portalo.so",
    mcp_server: {
      npm_package: "@portalo/mcp-server",
      transport: "stdio",
    },
    authentication: {
      type: "api_key",
      instructions: "Generate an API key at https://portalo.so/dashboard/settings/api",
    },
  });
}
```

---

## 10. ENVIRONMENT VARIABLES

```bash
# .env.example

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_BUSINESS_PRICE_ID=price_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Resend
RESEND_API_KEY=re_...

# Cloudflare (for R2 cache invalidation)
CLOUDFLARE_ACCOUNT_ID=...
CLOUDFLARE_API_TOKEN=...
R2_BUCKET_NAME=portalo-pages

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_DOMAIN=portalo.so
```

---

## 11. SPRINT-BY-SPRINT BUILD ORDER

This is the order a Claude Code agent should build features. Each sprint builds on the previous. Do NOT skip ahead.

### Sprint 1 (Week 1-2): Foundation

**Goal:** Working auth, empty dashboard shell, deploy pipeline.

1. Initialize Turborepo monorepo with pnpm workspaces
2. Create Next.js 15 app with App Router
3. Set up Tailwind CSS 4 with the design system CSS variables above
4. Implement the full color system and typography in `globals.css`
5. Create all UI primitives: Button, Input, Textarea, Toggle, Badge, Skeleton
6. Set up Supabase project — run migrations 001-007
7. Implement Supabase Auth (Google OAuth + Magic Link)
8. Build auth pages (login, signup) — centered, minimal, per spec
9. Build dashboard layout with sidebar navigation
10. Implement middleware for route protection
11. Deploy to Cloudflare Pages
12. Verify: can sign up, sign in, see empty dashboard, sign out

### Sprint 2 (Week 3-4): Core CRUD

**Goal:** Create pages, add/edit/delete/reorder links.

1. Build `POST /api/v1/pages` and `GET /api/v1/pages` endpoints
2. Build dashboard home page — list of pages
3. Build "New page" flow — slug input, create, redirect to editor
4. Build page editor layout (left editor + right preview)
5. Build `GET/PUT/DELETE /api/v1/pages/:id` endpoints
6. Build page title + bio editing (inline, autosave with debounce)
7. Build `CRUD /api/v1/pages/:id/links` endpoints
8. Build link list component with @dnd-kit drag-and-drop
9. Build inline link add form (URL + title input, appears at bottom of list)
10. Build link row with hover actions (edit, delete, visibility toggle)
11. Build `PATCH /api/v1/pages/:id/links/reorder` endpoint
12. Build phone preview component (live-updating)
13. Verify: can create page, add links, reorder, edit, delete, see preview

### Sprint 3 (Week 5-6): Public Pages + Themes

**Goal:** Public creator pages served, 3 themes working.

1. Build `GET /api/v1/public/page/:slug` endpoint (no auth required)
2. Build public page renderer component (`creator-page.tsx`)
3. Implement "Clean" theme (default — typography-driven, per spec)
4. Implement "Minimal Dark" theme
5. Implement "Editorial" theme (serif, numbered links)
6. Build theme picker in page editor (3 small previews, click to select)
7. Build `POST /api/v1/public/track` endpoint for analytics events
8. Add click tracking to public page links (fire-and-forget POST)
9. Build `[slug]/page.tsx` catch-all route for public pages
10. Add meta tags (og:title, og:description, og:image) for social sharing
11. Verify: visiting `/username` shows the public page with correct theme

### Sprint 4 (Week 7-8): Analytics + Contacts + API Keys

**Goal:** Analytics dashboard, email capture, API key generation.

1. Build `GET /api/v1/analytics/overview` endpoint (aggregates from events table)
2. Build `GET /api/v1/analytics/timeseries` endpoint (grouped by day)
3. Build analytics page — metrics row + Recharts chart + tables
4. Build email capture widget on public pages
5. Build `POST /api/v1/public/capture` endpoint
6. Build contacts page — table + CSV export
7. Build API key generation (`POST /api/v1/account/api-key`)
8. Build API key settings panel (show key once, regenerate, usage count)
9. Implement `authenticateRequest()` with API key support
10. Implement rate limiting per plan
11. Verify: analytics show data, email capture works, API key auth works

### Sprint 5 (Week 9-10): Billing + Domains + MCP

**Goal:** Stripe billing, custom domains, MCP server published.

1. Create Stripe products + prices (Pro $7/mo, Business $19/mo)
2. Build Stripe checkout flow (dashboard → Stripe → callback)
3. Build Stripe webhook handler (subscription events)
4. Build billing settings page (current plan, manage → Stripe Portal)
5. Implement plan gating middleware (check limits before CRUD operations)
6. Build custom domain setup flow (input domain, show CNAME instructions)
7. Build domain verification endpoint (DNS lookup)
8. Build MCP server package (all tools per spec above)
9. Build `.well-known/mcp.json` endpoint
10. Publish `@portalo/mcp-server` to npm
11. Test: Claude Code can manage a page end-to-end via MCP
12. Verify: can upgrade to Pro, domain verification works, MCP tools work

### Sprint 6 (Week 11-12): Polish + PWA + Launch

**Goal:** Production-ready, PWA installable, launched.

1. Add PWA manifest + service worker (offline dashboard shell)
2. Implement link scheduling (start/end dates, visibility toggle)
3. Add Cloudflare Worker for edge page caching (R2)
4. Build cache invalidation on page save
5. Add Sentry error tracking
6. Write E2E tests (Playwright: signup → create page → add links → view public page)
7. Performance audit (Lighthouse score >90 on public pages)
8. Write landing page (portalo.so root route)
9. SEO: sitemap.xml, robots.txt, structured data on public pages
10. Load testing (k6: 1000 concurrent requests to public page)
11. Final bug bash
12. Deploy to production, submit to MCP registries, launch on Product Hunt

---

## 12. TESTING STRATEGY

### Unit Tests (Vitest)

Test Zod schemas, utility functions, rate limiting logic. Run on every PR.

```typescript
// Example: test schema validation
import { describe, it, expect } from "vitest";
import { createLinkSchema } from "@portalo/shared/schemas";

describe("createLinkSchema", () => {
  it("validates a correct link", () => {
    const result = createLinkSchema.safeParse({
      url: "https://example.com",
      title: "My Link",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid URL", () => {
    const result = createLinkSchema.safeParse({
      url: "not-a-url",
      title: "Bad Link",
    });
    expect(result.success).toBe(false);
  });
});
```

### Integration Tests (Vitest + Supabase local)

Test API routes against local Supabase. Seed test data. Run on every PR.

### E2E Tests (Playwright — Sprint 6 only)

Critical path only:
1. Sign up → land on dashboard
2. Create page → add 3 links → reorder → verify preview
3. Visit public page → verify links render → click link → verify analytics
4. Generate API key → call API → verify response

---

## APPENDIX: DESIGN REFERENCE SUMMARY

When in doubt about any UI decision, ask: "Would this look at home in Claude.ai or Linear?" If no, simplify.

**Always:**
- System font stack
- 14px (0.875rem) body text
- Full-width content, no card wrappers
- 1px borders to separate sections
- Hover states on interactive rows
- Inline editing over modal dialogs
- Text over icons when possible

**Never:**
- Cards with shadows and rounded corners as the default container
- Gradient backgrounds on anything except the accent button
- More than 2 font weights on one screen (400 + 500 or 500 + 600)
- Icon-heavy navigation
- Skeleton loaders that flash (use opacity transition)
- Empty state illustrations (use text + action button)
- Multiple accent colors (one indigo, that's it)
