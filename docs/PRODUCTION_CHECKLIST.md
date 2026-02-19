# Portalo — Production Readiness Checklist

## MVP Feature Status

| Feature | Status | Notes |
|---------|--------|-------|
| Auth (magic link + Google OAuth) | Ready | Supabase Auth handles all flows |
| Dashboard (pages, editor, settings) | Ready | Full CRUD with drag-drop reordering |
| Public page rendering (3 themes) | Ready | Clean, Minimal Dark, Editorial |
| Link management | Ready | Add, edit, delete, reorder, visibility, scheduling |
| Analytics (views, clicks, referrers) | Ready | Overview, timeseries, breakdown endpoints |
| Stripe billing (Free/Pro/Business) | Ready | Checkout, webhooks, portal, plan gating |
| Custom domains (add, verify, delete) | Ready | DNS CNAME verification, SSL tracking |
| Email capture + contacts | Ready | Capture widget, contact list, CSV export |
| API key authentication | Ready | SHA-256 hashed keys, dual auth (session + API key) |
| MCP server (15 tools) | Ready | `@portalo/mcp-server` v0.2.0 |
| SEO (sitemap, robots, OG tags) | Ready | Dynamic meta, JSON-LD structured data |
| PWA (manifest, service worker) | Ready | Installable on iOS/Android |
| CI/CD pipeline | Ready | GitHub Actions → Cloudflare Pages |
| Database (6 tables, RLS, triggers) | Ready | 7 migrations, full Row Level Security |

---

## 1. Supabase (Production)

### Create Project
- [ ] Go to [supabase.com/dashboard](https://supabase.com/dashboard) and create a new project
- [ ] Select a region close to your target users
- [ ] Save the project URL, anon key, and service role key

### Apply Migrations
- [ ] Link your local CLI to the production project:
  ```bash
  supabase link --project-ref <your-project-ref>
  ```
- [ ] Push all migrations to production:
  ```bash
  supabase db push
  ```
- [ ] Verify all 6 tables exist: `profiles`, `pages`, `links`, `domains`, `analytics_events`, `contacts`
- [ ] Verify RLS policies are enabled on all tables

### Configure Auth Providers
- [ ] Enable **Email** auth (magic link / OTP) in Supabase Dashboard → Authentication → Providers
- [ ] Set up **Google OAuth**:
  - Create OAuth credentials in [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
  - Set authorized redirect URI: `https://<project-ref>.supabase.co/auth/v1/callback`
  - Add Client ID and Secret in Supabase Dashboard → Authentication → Providers → Google
- [ ] Configure email templates in Supabase Dashboard → Authentication → Email Templates
- [ ] Set the Site URL: `https://portalo.so`
- [ ] Add redirect URLs: `https://portalo.so/auth/callback`, `https://portalo.so/dashboard`

---

## 2. Stripe (Production)

### Account Setup
- [ ] Create or verify your [Stripe account](https://dashboard.stripe.com)
- [ ] Complete Stripe onboarding (business details, bank account)
- [ ] Switch to **Live mode** (toggle in Stripe Dashboard)

### Create Products & Prices
- [ ] Create a **Pro** product with monthly recurring price (e.g. $9/mo)
- [ ] Create a **Business** product with monthly recurring price (e.g. $29/mo)
- [ ] Copy both Price IDs (`price_xxx...`)

### Configure Webhook
- [ ] Go to Stripe Dashboard → Developers → Webhooks
- [ ] Add endpoint: `https://portalo.so/api/webhooks/stripe`
- [ ] Select events:
  - `checkout.session.completed`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
- [ ] Copy the Webhook Signing Secret (`whsec_xxx...`)

### Keys to Collect
- [ ] `STRIPE_SECRET_KEY` — from Stripe Dashboard → Developers → API Keys
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — from same page
- [ ] `STRIPE_WEBHOOK_SECRET` — from the webhook endpoint you just created
- [ ] `STRIPE_PRO_PRICE_ID` — from the Pro product price
- [ ] `STRIPE_BUSINESS_PRICE_ID` — from the Business product price

---

## 3. Cloudflare Pages

### Create Project
- [ ] Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → Pages
- [ ] Connect your GitHub repository
- [ ] Build settings:
  - Build command: `pnpm build`
  - Build output directory: `apps/web/.next`
  - Root directory: `/`
- [ ] Or use the existing `wrangler.toml` config in the repo

### Custom Domain
- [ ] Add `portalo.so` as a custom domain in Cloudflare Pages
- [ ] Configure DNS records (Cloudflare will guide you)
- [ ] Verify SSL certificate is active

### GitHub Secrets (for CI/CD)
- [ ] Add `CLOUDFLARE_API_TOKEN` to GitHub repo → Settings → Secrets
- [ ] Add `CLOUDFLARE_ACCOUNT_ID` to GitHub repo → Settings → Secrets

---

## 4. Environment Variables

Set these in **Cloudflare Pages → Settings → Environment Variables** (Production):

### Required

| Variable | Source | Example |
|----------|--------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project settings | `https://abc123.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase project settings | `eyJhbGci...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase project settings | `eyJhbGci...` |
| `STRIPE_SECRET_KEY` | Stripe Dashboard → API Keys | `sk_live_xxx` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe Dashboard → API Keys | `pk_live_xxx` |
| `STRIPE_WEBHOOK_SECRET` | Stripe Dashboard → Webhooks | `whsec_xxx` |
| `STRIPE_PRO_PRICE_ID` | Stripe Dashboard → Products | `price_xxx` |
| `STRIPE_BUSINESS_PRICE_ID` | Stripe Dashboard → Products | `price_xxx` |

### Optional

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` | Set to `https://portalo.so` |
| `NEXT_PUBLIC_APP_DOMAIN` | `portalo.so` | Your root domain |
| `NEXT_PUBLIC_SENTRY_DSN` | — | Sentry error tracking DSN |
| `RESEND_API_KEY` | — | For transactional emails (not yet integrated) |

---

## 5. Pre-Launch Checklist

### Infrastructure
- [ ] Supabase production project created and migrations applied
- [ ] Stripe products/prices created and webhook configured
- [ ] Cloudflare Pages project connected and building
- [ ] All environment variables set in Cloudflare Pages
- [ ] Custom domain configured and SSL active
- [ ] GitHub Actions CI/CD deploying successfully on push to `main`

### Verification (run through each manually)
- [ ] **Signup**: Create a new account via magic link
- [ ] **Signup**: Create a new account via Google OAuth
- [ ] **Login**: Log back in with both methods
- [ ] **Create page**: Create a new page with a slug, title, bio
- [ ] **Add links**: Add 3+ links to the page
- [ ] **Reorder links**: Drag-and-drop reorder works
- [ ] **Theme**: Switch between all 3 themes
- [ ] **Publish**: Publish the page and visit `portalo.so/<slug>`
- [ ] **Public page**: Verify it renders correctly with links
- [ ] **Analytics**: Click a link on the public page, verify click appears in dashboard
- [ ] **Email capture**: Submit an email on a public page, verify it appears in contacts
- [ ] **CSV export**: Export contacts to CSV
- [ ] **Billing**: Click Upgrade → verify Stripe checkout loads
- [ ] **Stripe webhook**: Complete a test purchase, verify plan updates in dashboard
- [ ] **Custom domain**: Add a domain, verify DNS check works
- [ ] **API key**: Generate an API key in settings, test with curl:
  ```bash
  curl -H "X-API-Key: <key>" https://portalo.so/api/v1/pages
  ```
- [ ] **MCP server**: Install and test:
  ```bash
  PORTALO_API_KEY=<key> PORTALO_BASE_URL=https://portalo.so npx @portalo/mcp-server
  ```
- [ ] **SEO**: Check `portalo.so/sitemap.xml` and `portalo.so/robots.txt` load correctly
- [ ] **404 page**: Visit `portalo.so/nonexistent-slug` — should show 404
- [ ] **Mobile**: Test dashboard and public pages on mobile browser

### MCP Server (npm publish)
- [ ] Build the package: `cd packages/mcp-server && pnpm build`
- [ ] Publish to npm: `npm publish --access public`
- [ ] Verify install works: `npx @portalo/mcp-server --help`

---

## 6. Post-Launch Monitoring

- [ ] Check Cloudflare Analytics for traffic and errors
- [ ] Monitor Stripe Dashboard for successful payments
- [ ] Check Supabase Dashboard for database health and RLS violations
- [ ] Set up Sentry (optional) for real-time error tracking
- [ ] Monitor GitHub Actions for build failures

---

## 7. Known Limitations (Acceptable for MVP)

| Limitation | Impact | When to Address |
|------------|--------|-----------------|
| No transactional emails (Resend) | Users only get Supabase magic link emails | Post-launch: welcome emails, notifications |
| No global error boundary (`app/error.tsx`) | Unhandled errors show default Next.js error | Sprint 8: add graceful error UI |
| Rate limiting not enforced | Public endpoints have no throttling | Post-launch: add when traffic grows |
| Custom domain routing not in middleware | Domains verified but don't serve pages | Post-launch: add domain→slug middleware |
| No device/browser analytics | Only tracks referrer + country | Post-launch: parse User-Agent header |
| No admin dashboard | Must use Supabase Studio for admin tasks | Post-launch: if needed for support |
| Sentry not configured | Error tracking inactive | Set `NEXT_PUBLIC_SENTRY_DSN` when ready |
