# Portalo — Manual Testing Guide

Comprehensive test cases for all completed pages and API endpoints.

**Prerequisites:**
- App running locally (`pnpm dev`)
- Supabase project configured with migrations applied
- Google OAuth + Magic Link configured in Supabase Auth
- Stripe test keys set in `.env.local` (for billing tests)
- At least one test user account

---

## 1. Authentication

### 1.1 Signup (`/signup`)

| # | Test Case | Steps | Expected Result |
|---|-----------|-------|-----------------|
| 1 | Google OAuth signup | Click "Continue with Google" → complete Google flow | Redirected to `/dashboard`, profile created in `profiles` table |
| 2 | Magic link signup | Enter email → click "Send Magic Link" | Success message shown, email received with login link |
| 3 | Magic link callback | Click link in email | Redirected to `/dashboard`, session created |
| 4 | Invalid email | Enter "notanemail" → submit | Validation error shown |
| 5 | Already signed in | Visit `/signup` while authenticated | Redirected to `/dashboard` |

### 1.2 Login (`/login`)

| # | Test Case | Steps | Expected Result |
|---|-----------|-------|-----------------|
| 1 | Google OAuth login | Click "Continue with Google" → select account | Redirected to `/dashboard` |
| 2 | Magic link login | Enter registered email → submit | Magic link email sent |
| 3 | Already signed in | Visit `/login` while authenticated | Redirected to `/dashboard` |

### 1.3 Sign Out

| # | Test Case | Steps | Expected Result |
|---|-----------|-------|-----------------|
| 1 | Sign out | Click sign-out icon in sidebar footer | Redirected to `/login`, session cleared |
| 2 | Protected route after signout | Visit `/dashboard` after signing out | Redirected to `/login` |

---

## 2. Dashboard

### 2.1 Pages List (`/dashboard`)

| # | Test Case | Steps | Expected Result |
|---|-----------|-------|-----------------|
| 1 | Empty state | New user visits dashboard | "No pages yet" message shown |
| 2 | Create page | Click "New Page" → enter slug → submit | Page created, appears in list |
| 3 | Slug validation | Try creating page with slug "My Page!" | Error: lowercase letters, numbers, and hyphens only |
| 4 | Duplicate slug | Create page with existing slug | Error: "This slug is already taken" |
| 5 | Page list rendering | After creating pages | All pages listed with title/slug, ordered by creation date desc |
| 6 | Navigate to editor | Click on a page card | Navigated to `/dashboard/pages/[id]` |
| 7 | Plan limit (Free) | Free plan user with 1 page tries to create another | 403 error: "Your free plan allows 1 page" |
| 8 | Loading state | Slow network | Skeleton loading placeholders shown |

### 2.2 Page Editor (`/dashboard/pages/[id]`)

| # | Test Case | Steps | Expected Result |
|---|-----------|-------|-----------------|
| 1 | Load page | Navigate to editor | Title, bio, slug displayed; links listed; preview shown |
| 2 | Edit title | Click title → type new text → blur | Title updated, preview reflects change |
| 3 | Edit bio | Click bio → type new text → blur | Bio updated, preview reflects change |
| 4 | Publish toggle | Toggle published status | Page becomes accessible at `/{slug}` (or hidden) |
| 5 | Theme picker | Select "Minimal Dark" → "Editorial" → "Clean" | Theme changes, preview updates with each theme |
| 6 | Add link | Enter URL + title → click Add | Link appears in list and preview |
| 7 | Edit link | Click edit on a link → change title/URL → save | Link updated in list and preview |
| 8 | Delete link | Click delete on a link → confirm | Link removed from list and preview |
| 9 | Toggle link visibility | Click visibility toggle | Link hidden/shown in preview |
| 10 | Drag reorder | Drag link to new position | Links reorder, positions saved to DB |
| 11 | Link limit (Free) | Free user adds 11th link | 403 error: "Your free plan allows 10 links per page" |
| 12 | Live preview | Make any edit | Preview panel updates in real-time |
| 13 | Invalid page ID | Visit `/dashboard/pages/nonexistent-id` | 404 or error state shown |

---

## 3. Public Pages

### 3.1 Creator Page (`/{slug}`)

| # | Test Case | Steps | Expected Result |
|---|-----------|-------|-----------------|
| 1 | Published page | Visit `/{slug}` for a published page | Page renders with title, bio, links, theme |
| 2 | Unpublished page | Visit `/{slug}` for an unpublished page | 404 page shown |
| 3 | Nonexistent slug | Visit `/nonexistent-slug` | 404 page shown |
| 4 | Clean theme | Page with "clean" theme | White background, system font, → prefix on links |
| 5 | Minimal Dark theme | Page with "minimal-dark" theme | Dark background (#0F0F0F), light text |
| 6 | Editorial theme | Page with "editorial" theme | Serif titles, numbered links (1., 2., 3.) |
| 7 | Click tracking | Click a link on the public page | Analytics event recorded (event_type: "click") |
| 8 | View tracking | Load a public page | Analytics event recorded (event_type: "view") |
| 9 | Hidden links | Some links marked invisible | Only visible links rendered |
| 10 | Powered by footer | `show_powered_by: true` | "Powered by Portalo" footer shown |
| 11 | No branding (paid) | Pro/Business user with `show_powered_by: false` | Footer hidden |

### 3.2 Email Capture

| # | Test Case | Steps | Expected Result |
|---|-----------|-------|-----------------|
| 1 | Capture visible (paid plan) | Pro/Business page with `show_email_capture: true` | Email input form shown |
| 2 | Capture hidden (free plan) | Free plan page | Email capture form not shown, or API returns 403 |
| 3 | Valid email submit | Enter valid email → submit | Success message, contact saved to DB |
| 4 | Invalid email | Enter "notanemail" → submit | Validation error |
| 5 | Duplicate email | Submit same email twice for same page | No error (handled silently), no duplicate in DB |

### 3.3 SEO & Meta Tags

| # | Test Case | Steps | Expected Result |
|---|-----------|-------|-----------------|
| 1 | Meta title | Inspect `<head>` of `/{slug}` | `<title>` matches page title |
| 2 | OG tags | Check og:title, og:description | Correct page data |
| 3 | OG image | Fetch `/{slug}/opengraph-image` | 1200x630 PNG with page title/bio |
| 4 | Twitter card | Check twitter:card meta | `summary_large_image` type |

---

## 4. Analytics

### 4.1 Analytics Dashboard (`/dashboard/analytics`)

| # | Test Case | Steps | Expected Result |
|---|-----------|-------|-----------------|
| 1 | Empty state | New page with no events | "0 views · 0 clicks · 0% CTR · 0 emails" |
| 2 | Metrics row | Page with tracked events | Correct totals for views, clicks, CTR, emails |
| 3 | Period selector | Switch between 7d → 30d → 90d | Data range updates, chart redraws |
| 4 | Page selector | Multiple pages → switch | Data changes to reflect selected page |
| 5 | Time-series chart | Page with data over multiple days | Line chart shows views (indigo) + clicks (green) |
| 6 | Top links table | Links with varying click counts | Links sorted by clicks desc |
| 7 | Referrers breakdown | Events with different referrer values | Top referrers table with counts |
| 8 | Countries breakdown | Events with country data | Top countries table with counts |
| 9 | Loading state | Slow network | Skeleton placeholders shown |

---

## 5. Contacts

### 5.1 Contacts Page (`/dashboard/contacts`)

| # | Test Case | Steps | Expected Result |
|---|-----------|-------|-----------------|
| 1 | Empty state | Page with no captured emails | "No contacts yet" message |
| 2 | Contacts table | Page with captured emails | Table shows email, source, date |
| 3 | Page selector | Switch between pages | Contacts list updates |
| 4 | CSV export | Click "Export CSV" | Browser downloads CSV with email, source, date columns |
| 5 | Loading state | Slow network | Skeleton placeholders shown |

---

## 6. Settings

### 6.1 Profile (`/dashboard/settings`)

| # | Test Case | Steps | Expected Result |
|---|-----------|-------|-----------------|
| 1 | View profile | Navigate to settings | Email (read-only), display name, avatar shown |
| 2 | Update display name | Change name → click Save | Toast: "Profile updated", name updated |
| 3 | Empty display name | Clear name → save | Saves empty string (allowed) |
| 4 | Avatar upload | Click avatar → select image | Image uploaded to Supabase Storage, avatar updates |
| 5 | Invalid file type | Upload a .txt file | Error: "Please select an image file" |
| 6 | Large file | Upload > 2MB image | Error: "Image must be under 2MB" |
| 7 | Plan badge | View plan section | Correct plan badge (Free/Pro/Business) shown |
| 8 | Billing link | Click "Manage billing" | Navigates to `/dashboard/settings/billing` |

### 6.2 API Keys (`/dashboard/settings/api`)

| # | Test Case | Steps | Expected Result |
|---|-----------|-------|-----------------|
| 1 | Generate key | Click "Generate API Key" | Key displayed (pk_...), copy button shown |
| 2 | Copy key | Click "Copy" | Key copied to clipboard, toast confirmation |
| 3 | Regenerate key | Click "Regenerate Key" → confirm | New key shown, old key invalidated |
| 4 | Use API key | `curl -H "X-API-Key: pk_..." /api/v1/pages` | Authenticated response with user's pages |
| 5 | Invalid API key | `curl -H "X-API-Key: invalid" /api/v1/pages` | 401: "Invalid API key" |
| 6 | Rate limiting | Exceed daily API call limit | 403 or rate limit response |

### 6.3 Billing (`/dashboard/settings/billing`)

| # | Test Case | Steps | Expected Result |
|---|-----------|-------|-----------------|
| 1 | View plans | Navigate to billing | Three plan cards: Free, Pro ($7/mo), Business ($19/mo) |
| 2 | Current plan highlight | Free user | "Current Plan" button on Free card, "Upgrade" on Pro/Business |
| 3 | Upgrade to Pro | Click "Upgrade" on Pro → complete Stripe Checkout | Plan updates to Pro, badge changes, limits increase |
| 4 | Manage billing | Pro/Business user → click "Manage Billing" | Redirected to Stripe Customer Portal |
| 5 | Downgrade | Cancel subscription in Stripe Portal | Webhook fires, plan reverts to Free |
| 6 | Success redirect | Complete checkout | Returns to billing page with `?success=true` |
| 7 | Cancel redirect | Cancel checkout | Returns to billing page with `?canceled=true` |

### 6.4 Custom Domains (`/dashboard/settings/domain`)

| # | Test Case | Steps | Expected Result |
|---|-----------|-------|-----------------|
| 1 | Add domain | Enter "links.example.com" → click Add | Domain added, "Pending" badge shown |
| 2 | Invalid domain | Enter "not a domain!" → submit | Validation error |
| 3 | Duplicate domain | Add same domain twice | Error: "This domain is already registered" |
| 4 | Plan limit (Free) | Free user tries to add domain | 403: plan limit error (0 custom domains) |
| 5 | Verify (not configured) | Click "Verify" before DNS setup | Info toast: "DNS not yet pointing to Portalo" |
| 6 | Verify (configured) | Click "Verify" after CNAME setup | Badge changes to "Verified" |
| 7 | Remove domain | Click "Remove" → confirm | Domain deleted from list |
| 8 | Page selector | Multiple pages → switch | Domain list filtered by page |

---

## 7. API Endpoints

### 7.1 Pages API

| # | Endpoint | Method | Test Case | Expected |
|---|----------|--------|-----------|----------|
| 1 | `/api/v1/pages` | GET | Authenticated request | 200 + array of user's pages |
| 2 | `/api/v1/pages` | POST | Valid slug + title | 201 + created page |
| 3 | `/api/v1/pages` | POST | Missing slug | 400 validation error |
| 4 | `/api/v1/pages` | POST | Over plan page limit | 403 plan_limit |
| 5 | `/api/v1/pages/[id]` | GET | Valid page ID owned by user | 200 + page data |
| 6 | `/api/v1/pages/[id]` | GET | Page owned by another user | 404 |
| 7 | `/api/v1/pages/[id]` | PUT | Update title | 200 + updated page |
| 8 | `/api/v1/pages/[id]` | DELETE | Valid page | 204 no content |

### 7.2 Links API

| # | Endpoint | Method | Test Case | Expected |
|---|----------|--------|-----------|----------|
| 1 | `/api/v1/pages/[id]/links` | GET | Page with links | 200 + ordered links array |
| 2 | `/api/v1/pages/[id]/links` | POST | Valid URL + title | 201 + created link |
| 3 | `/api/v1/pages/[id]/links` | POST | Invalid URL | 400 validation error |
| 4 | `/api/v1/pages/[id]/links` | POST | Over plan link limit | 403 plan_limit |
| 5 | `/api/v1/pages/[id]/links/[linkId]` | PUT | Update title | 200 + updated link |
| 6 | `/api/v1/pages/[id]/links/[linkId]` | DELETE | Valid link | 204 no content |
| 7 | `/api/v1/pages/[id]/links/reorder` | PATCH | Array of link IDs | 200 + success |

### 7.3 Public API

| # | Endpoint | Method | Test Case | Expected |
|---|----------|--------|-----------|----------|
| 1 | `/api/v1/public/page/[slug]` | GET | Published page | 200 + page + links |
| 2 | `/api/v1/public/page/[slug]` | GET | Unpublished page | 404 |
| 3 | `/api/v1/public/track` | POST | Valid view event | 201 |
| 4 | `/api/v1/public/track` | POST | Invalid event_type | 400 |
| 5 | `/api/v1/public/capture` | POST | Valid email + page_id | 201 |
| 6 | `/api/v1/public/capture` | POST | Duplicate email | 200 (silent success) |
| 7 | `/api/v1/public/capture` | POST | Free plan page owner | 403 plan_limit |

### 7.4 Analytics API

| # | Endpoint | Method | Test Case | Expected |
|---|----------|--------|-----------|----------|
| 1 | `/api/v1/analytics/overview` | GET | Valid page_id + period | 200 + views, clicks, CTR, etc. |
| 2 | `/api/v1/analytics/timeseries` | GET | Valid page_id + period | 200 + daily buckets array |
| 3 | `/api/v1/analytics/breakdown` | GET | Valid page_id + period | 200 + referrers + countries |
| 4 | Any analytics endpoint | GET | Missing page_id | 400 |
| 5 | Any analytics endpoint | GET | Other user's page_id | 404 or empty data |

### 7.5 Account API

| # | Endpoint | Method | Test Case | Expected |
|---|----------|--------|-----------|----------|
| 1 | `/api/v1/account` | GET | Authenticated | 200 + profile data |
| 2 | `/api/v1/account` | PUT | `{ display_name: "New Name" }` | 200 + updated profile |
| 3 | `/api/v1/account` | PUT | `{ avatar_url: "https://..." }` | 200 + updated profile |
| 4 | `/api/v1/account` | PUT | Empty body | 400 "No valid fields" |
| 5 | `/api/v1/account/api-key` | POST | Authenticated | 200 + `{ api_key: "pk_..." }` |

### 7.6 Billing API

| # | Endpoint | Method | Test Case | Expected |
|---|----------|--------|-----------|----------|
| 1 | `/api/v1/billing/checkout` | POST | `{ plan: "pro" }` | 200 + Stripe checkout URL |
| 2 | `/api/v1/billing/checkout` | POST | `{ plan: "invalid" }` | 400 "Invalid plan" |
| 3 | `/api/v1/billing/portal` | POST | User with stripe_customer_id | 200 + portal URL |
| 4 | `/api/v1/billing/portal` | POST | Free user (no Stripe customer) | 400 "No billing account" |

### 7.7 Domains API

| # | Endpoint | Method | Test Case | Expected |
|---|----------|--------|-----------|----------|
| 1 | `/api/v1/domains` | GET | Authenticated | 200 + user's domains |
| 2 | `/api/v1/domains` | POST | Valid domain + page_id | 201 + created domain |
| 3 | `/api/v1/domains` | POST | Over plan domain limit | 403 plan_limit |
| 4 | `/api/v1/domains/[id]/verify` | POST | Domain with CNAME configured | 200 + `verified: true` |
| 5 | `/api/v1/domains/[id]/verify` | POST | Domain without CNAME | 200 + `verified: false` |
| 6 | `/api/v1/domains/[id]` | DELETE | Valid domain | 204 |

### 7.8 Webhooks

| # | Endpoint | Method | Test Case | Expected |
|---|----------|--------|-----------|----------|
| 1 | `/api/webhooks/stripe` | POST | Valid signature + `checkout.session.completed` | 200 + plan updated |
| 2 | `/api/webhooks/stripe` | POST | Valid signature + `customer.subscription.deleted` | 200 + plan reverted to free |
| 3 | `/api/webhooks/stripe` | POST | Invalid signature | 400 |
| 4 | `/api/webhooks/stripe` | POST | Missing signature header | 400 |

### 7.9 MCP Discovery

| # | Endpoint | Method | Test Case | Expected |
|---|----------|--------|-----------|----------|
| 1 | `/.well-known/mcp.json` | GET | No auth required | 200 + MCP metadata JSON |

---

## 8. Cross-Cutting Concerns

### 8.1 Authentication

| # | Test Case | Steps | Expected |
|---|-----------|-------|----------|
| 1 | Unauthenticated API call | Call any `/api/v1/*` without auth | 401 Unauthorized |
| 2 | Session auth | Call API from logged-in browser | Authenticated via cookie |
| 3 | API key auth | `X-API-Key: pk_...` header | Authenticated via key hash lookup |
| 4 | Expired session | Call API after session expires | 401, redirect to login on dashboard |

### 8.2 Rate Limiting

| # | Test Case | Steps | Expected |
|---|-----------|-------|----------|
| 1 | Within limit | Make API calls within daily quota | All succeed |
| 2 | Exceed limit | Exceed `api_calls_per_day` for plan | Subsequent calls blocked |
| 3 | Counter reset | Wait for reset window (24h) | Counter resets, calls allowed again |

### 8.3 Navigation & Sidebar

| # | Test Case | Steps | Expected |
|---|-----------|-------|----------|
| 1 | Active state | Visit each sidebar link | Active page is highlighted |
| 2 | All links work | Click each sidebar item | Navigates to correct page |
| 3 | Sidebar items | Check all items present | My Pages, Analytics, Contacts, Profile, Billing, Domains, API Keys |
| 4 | User nav | Check sidebar footer | Avatar/initials, display name, plan badge, sign-out button |

---

## 9. MCP Server

### 9.1 Tools

| # | Tool | Test Case | Expected |
|---|------|-----------|----------|
| 1 | `list_pages` | No args | Returns array of user's pages |
| 2 | `get_page` | Valid page_id | Returns page details + links |
| 3 | `add_link` | page_id + url + title | Link created, returned |
| 4 | `update_link` | page_id + link_id + new title | Link updated |
| 5 | `remove_link` | page_id + link_id | Link deleted |
| 6 | `reorder_links` | page_id + link_ids array | Positions updated |
| 7 | `get_analytics` | page_id + period | Analytics overview returned |
| 8 | `export_contacts` | page_id | Contacts array returned |
| 9 | `update_theme` | page_id + theme name | Theme changed |

### 9.2 Configuration

| # | Test Case | Steps | Expected |
|---|-----------|-------|----------|
| 1 | Missing API key | Run without `PORTALO_API_KEY` | Error: "PORTALO_API_KEY required" + exit |
| 2 | Invalid API key | Set invalid key | Tools return auth errors |
| 3 | Custom base URL | Set `PORTALO_BASE_URL` | Requests go to custom URL |

---

## Quick Smoke Test Checklist

Run through these to verify core functionality:

- [ ] Sign up with Google or Magic Link
- [ ] Create a page with slug "test-page"
- [ ] Add 3 links with titles and URLs
- [ ] Drag to reorder links
- [ ] Switch theme to "Minimal Dark"
- [ ] Toggle published → on
- [ ] Visit `/test-page` in incognito — page renders with correct theme
- [ ] Click a link on the public page
- [ ] Check analytics page — 1 view, 1 click shown
- [ ] Go to Settings → Profile → update display name
- [ ] Go to Settings → API Keys → generate key → copy
- [ ] `curl -H "X-API-Key: <key>" localhost:3000/api/v1/pages` → returns pages
- [ ] Go to Settings → Billing → verify plan cards render
- [ ] Sign out → verify redirect to login
