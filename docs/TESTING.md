# Portalo — Manual Testing Guide

Comprehensive test cases for all completed pages and API endpoints.

**Prerequisites:**
- App running locally (`pnpm dev`)
- Supabase project configured with migrations applied
- Google OAuth + Magic Link configured in Supabase Auth
- Stripe test keys set in `.env.local` (for billing tests)
- At least one test user account
- Playwright installed (`npx playwright install`) for E2E tests

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
| 14 | Schedule start | Edit link → set schedule_start to future date → save | "Scheduled" indicator shown on link row, link hidden on public page |
| 15 | Schedule end | Edit link → set schedule_end to past date → save | "Scheduled" indicator shown, link hidden on public page |
| 16 | Active schedule | Set schedule_start to past, schedule_end to future | Link visible on public page |
| 17 | Clear schedule | Edit link → clear schedule dates → save | "Scheduled" indicator removed, link visible normally |
| 18 | Platform auto-detect | Enter `https://youtube.com/@test` in URL field | Platform icon (YouTube) appears inside input field |
| 19 | Platform badge clears | Clear URL field or change to non-social URL | Platform icon disappears |
| 20 | Display mode toggle | Hover a link → click ○ toggle | Cycles through Default → Featured → Icon only, badge shown |
| 21 | Platform icon in row | Link with detected platform (e.g. GitHub) | Social icon shown next to link title |
| 22 | Featured badge | Set link to "Featured" display mode | "Featured" badge shown next to title |
| 23 | Icon only badge | Set link to "Icon only" display mode | "Icon only" badge shown next to title |
| 24 | Color customizer | Expand Colors section → change Background color | Color picker opens, preview updates |
| 25 | Reset custom color | Click reset on a custom color | Reverts to theme default |
| 26 | Debounced color save | Change color rapidly | Only saves after 500ms pause, no rapid API calls |
| 27 | Layout section list | Expand Layout section | Shows ordered sections (Header, Icon Bar, Links, blocks) |
| 28 | Drag reorder sections | Drag a section to new position | Sections reorder, layout saved to API |
| 29 | Add spacer block | Click "+ Add block" → Spacer | Spacer block added to layout list |
| 30 | Add divider block | Click "+ Add block" → Divider | Divider block added to layout list |
| 31 | Add text block | Click "+ Add block" → Text | Text block added with default text |
| 32 | Remove block | Click "Remove" on a block row | Block removed from layout |
| 33 | Theme section collapse | Click Theme header | Section collapses/expands |
| 34 | Colors section collapse | Click Colors header | Section collapses/expands |
| 35 | Layout section collapse | Click Layout header | Section collapses/expands |

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
| 12 | Scheduled link (future) | Link with `schedule_start` in the future | Link not rendered on public page |
| 13 | Scheduled link (expired) | Link with `schedule_end` in the past | Link not rendered on public page |
| 14 | Scheduled link (active) | Link within schedule window | Link rendered normally |
| 15 | JSON-LD structured data | View page source of `/{slug}` | `<script type="application/ld+json">` with ProfilePage schema, sameAs links |
| 16 | Custom 404 page | Visit `/nonexistent-slug` | Custom 404 page with "This page doesn't exist" and "Go home" link |
| 17 | Custom background color | Page with `theme.colors.bg: "#1a1a2e"` | Page background uses custom color (inline style) |
| 18 | Custom text colors | Page with custom text + secondary colors | Title uses custom text color, bio uses custom secondary |
| 19 | Custom link colors | Page with `link_bg` + `link_text` set | Featured links use custom background/text |
| 20 | Icon bar rendering | Page with icon-only links + icon-bar section | Row of social icons rendered centered |
| 21 | Icon bar click tracking | Click an icon in icon bar | Analytics click event recorded for that link |
| 22 | Featured link | Link with `display_mode: "featured"` | Link rendered with background fill, larger padding, rounded |
| 23 | Platform icon on link | Link with `platform: "github"` | GitHub icon shown before link title |
| 24 | Spacer block | Layout with spacer block (height: 48) | Vertical space of 48px rendered |
| 25 | Divider block | Layout with divider block | Horizontal line rendered |
| 26 | Text block | Layout with text block | Custom text paragraph rendered centered |
| 27 | Section order | Layout sections = [header, icon-bar, block(text), links] | Components render in specified order |
| 28 | Default layout fallback | Page with `layout: null` | Default layout used (header + links) |
| 29 | Icon-only links excluded from links section | Links with `display_mode: "icon-only"` | Not shown in standard links list |
| 30 | Colors + theme combo | Custom colors on "minimal-dark" theme | Custom colors override theme defaults via inline styles |

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
| 5 | Sitemap | Visit `/sitemap.xml` | XML with base URL + all published page URLs |
| 6 | Robots.txt | Visit `/robots.txt` | Allows `/`, disallows `/dashboard` and `/api/`, includes sitemap URL |
| 7 | JSON-LD | View source of `/{slug}` | `application/ld+json` script with ProfilePage, Person mainEntity, sameAs array |
| 8 | Auth layout title | Inspect `<head>` of `/login` | `<title>` is "Sign in - Portalo" |
| 9 | Dashboard layout title | Inspect `<head>` of `/dashboard` | `<title>` is "Dashboard - Portalo" |

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
| 8 | `/api/v1/pages/[id]/links` | POST | URL `https://github.com/test` without platform | 201 + link with `platform: "github"` auto-detected |
| 9 | `/api/v1/pages/[id]/links/[linkId]` | PUT | Change URL to `https://twitter.com/test` | 200 + `platform` re-detected as "twitter" |
| 10 | `/api/v1/pages/[id]/links/[linkId]` | PUT | `{ display_mode: "featured" }` | 200 + link updated with display_mode |

### 7.2a Layout API

| # | Endpoint | Method | Test Case | Expected |
|---|----------|--------|-----------|----------|
| 1 | `/api/v1/pages/[id]/layout` | GET | Valid page | 200 + current layout (or default) |
| 2 | `/api/v1/pages/[id]/layout` | PUT | Valid sections + blocks | 200 + updated layout |
| 3 | `/api/v1/pages/[id]/layout` | PUT | Block section references non-existent block ID | 400 validation error |
| 4 | `/api/v1/pages/[id]/layout` | PUT | Empty sections array | 400 validation error |
| 5 | `/api/v1/pages/[id]/blocks` | POST | `{ kind: "spacer", props: { height: 24 } }` | 201 + block created, added to layout |
| 6 | `/api/v1/pages/[id]/blocks` | POST | `{ kind: "text", props: { text: "Hello" } }` | 201 + text block created |
| 7 | `/api/v1/pages/[id]/blocks` | POST | `{ kind: "invalid" }` | 400 validation error |
| 8 | `/api/v1/pages/[id]/blocks` | POST | `{ kind: "spacer", after_section: 0 }` | 201 + block inserted after first section |
| 9 | `/api/v1/pages/[id]/blocks` | DELETE | `{ block_id: "abc123" }` | 204 + block removed from layout |
| 10 | `/api/v1/pages/[id]/blocks` | DELETE | `{ block_id: "" }` | 400 validation error |

### 7.2b Utility API

| # | Endpoint | Method | Test Case | Expected |
|---|----------|--------|-----------|----------|
| 1 | `/api/v1/utils/detect-platform?url=https://github.com/user` | GET | Valid GitHub URL | 200 + `{ data: { platform: "github" } }` |
| 2 | `/api/v1/utils/detect-platform?url=https://youtube.com/@ch` | GET | Valid YouTube URL | 200 + `{ data: { platform: "youtube" } }` |
| 3 | `/api/v1/utils/detect-platform?url=https://example.com` | GET | Non-social URL | 200 + `{ data: { platform: null } }` |
| 4 | `/api/v1/utils/detect-platform?url=notaurl` | GET | Invalid URL | 200 + `{ data: { platform: null } }` |
| 5 | `/api/v1/utils/detect-platform` | GET | Missing url param | 200 + `{ data: { platform: null } }` |

### 7.2c Theme Colors API

| # | Endpoint | Method | Test Case | Expected |
|---|----------|--------|-----------|----------|
| 1 | `/api/v1/pages/[id]` | PUT | `{ theme: { name: "clean", colors: { bg: "#1a1a2e" } } }` | 200 + theme with merged colors |
| 2 | `/api/v1/pages/[id]` | PUT | `{ theme: { colors: { text: "#ff0000" } } }` | 200 + existing colors preserved, text color added |
| 3 | `/api/v1/pages/[id]` | PUT | `{ theme: { name: "minimal-dark" } }` | 200 + theme name changed, existing colors preserved |

### 7.3 Public API

| # | Endpoint | Method | Test Case | Expected |
|---|----------|--------|-----------|----------|
| 1 | `/api/v1/public/page/[slug]` | GET | Published page | 200 + page + links + `Cache-Control: public, s-maxage=60, stale-while-revalidate=300` |
| 2 | `/api/v1/public/page/[slug]` | GET | Unpublished page | 404 |
| 2a | `/api/v1/public/page/[slug]` | GET | Page with scheduled links | 200 + only links within active schedule window |
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
| 1 | `/.well-known/mcp.json` | GET | No auth required | 200 + MCP metadata JSON with 20 tools listed |

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
| 1 | Active state (desktop) | Visit each sidebar link on desktop | Active page is highlighted with `bg-bg-active` |
| 2 | All links work | Click each sidebar item | Navigates to correct page |
| 3 | Sidebar items | Check all items present | My Pages, Analytics, Contacts, Profile, Billing, Domains, API Keys |
| 4 | User nav | Check sidebar footer | Avatar/initials, display name, plan badge, sign-out button |
| 5 | Mobile tab bar | Resize to <768px | Desktop sidebar hidden, bottom tab bar with Pages/Analytics/Contacts/Settings |
| 6 | Mobile active state | Visit each tab on mobile | Active tab has accent color |
| 7 | Desktop sidebar | Resize to ≥768px | Bottom tab bar hidden, desktop sidebar visible |
| 8 | Mobile content padding | Open any page on mobile | Content doesn't overlap with bottom tab bar (`pb-16`) |

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
| 9 | `update_page` | page_id + title/bio/theme/published/settings | Page updated |
| 10 | `create_page` | slug + optional title/bio/theme | Page created |
| 11 | `delete_page` | page_id | Page deleted |
| 12 | `get_account` | No args | Account profile + plan info returned |
| 13 | `list_domains` | No args | Array of custom domains returned |
| 14 | `add_domain` | page_id + domain | Domain added |
| 15 | `remove_domain` | domain_id | Domain removed |
| 16 | `update_design` | page_id + theme + color params (bg, text, etc.) | Theme and colors updated |
| 17 | `set_layout` | page_id + sections array + blocks array | Layout updated |
| 18 | `add_block` | page_id + kind + optional text/height/after_section | Block added to layout |
| 19 | `remove_block` | page_id + block_id | Block removed from layout |
| 20 | `set_link_display` | page_id + link_id + display_mode + platform | Link display mode/platform updated |

### 9.2 Configuration

| # | Test Case | Steps | Expected |
|---|-----------|-------|----------|
| 1 | Missing API key | Run without `PORTALO_API_KEY` | Error: "PORTALO_API_KEY required" + exit |
| 2 | Invalid API key | Set invalid key | Tools return auth errors |
| 3 | Custom base URL | Set `PORTALO_BASE_URL` | Requests go to custom URL |

---

## 10. PWA

### 10.1 Manifest & Installation

| # | Test Case | Steps | Expected |
|---|-----------|-------|----------|
| 1 | Manifest loads | Visit `/manifest.json` | JSON with name "Portalo", theme_color "#4F46E5", display "standalone" |
| 2 | Icons | Check `/icon-192.png` and `/icon-512.png` | Valid PNG images load |
| 3 | Install prompt | Open in Chrome → Application tab | "Install" option available |
| 4 | Theme color | Inspect `<meta name="theme-color">` | Content is "#4F46E5" |

### 10.2 Service Worker

| # | Test Case | Steps | Expected |
|---|-----------|-------|----------|
| 1 | SW registration | Open DevTools → Application → Service Workers | `sw.js` registered and active |
| 2 | Static caching | Load page → go offline → reload | Cached static assets load from cache |
| 3 | API bypass | Inspect SW logic | API calls (`/api/`) not intercepted by cache |

---

## 11. Landing Page (`/`)

| # | Test Case | Steps | Expected |
|---|-----------|-------|----------|
| 1 | Hero section | Visit `/` | "Your link-in-bio, powered by AI" headline visible |
| 2 | CTA buttons | Check hero buttons | "Get Started Free" links to `/signup`, "Sign In" links to `/login` |
| 3 | Features section | Scroll down | 3 features: AI-Powered, 3 Themes, Real-Time Analytics |
| 4 | Pricing section | Scroll to pricing | 3 plan cards: Free, Pro ($7/mo), Business ($19/mo) |
| 5 | Pro plan highlight | Check plan cards | Pro card has accent border |
| 6 | Plan details | Check each plan card | Correct page count, link limit, analytics days, features |
| 7 | Footer | Scroll to bottom | "Portalo" text, Sign in and Sign up links |
| 8 | Nav bar | Check top nav | "Portalo" logo, "Sign in" and "Get Started" links |
| 9 | Server component | Check page source | No `"use client"` — renders as server component (no JS bundle overhead) |

---

## 12. Loading States

| # | Test Case | Steps | Expected |
|---|-----------|-------|----------|
| 1 | Dashboard loading | Navigate to `/dashboard` (slow network) | Skeleton: title bar + 3 row placeholders |
| 2 | Page editor loading | Navigate to `/dashboard/pages/[id]` (slow network) | Skeleton: editor panel + preview panel with avatar circle |
| 3 | Analytics loading | Navigate to `/dashboard/analytics` (slow network) | Skeleton: title + 4 metric cards + chart placeholder |
| 4 | Settings loading | Navigate to `/dashboard/settings` (slow network) | Skeleton: title + avatar circle + form fields |
| 5 | No flash | Fast network | Loading skeletons don't flash (shown only during actual load) |

---

## 13. Error Tracking (Sentry)

| # | Test Case | Steps | Expected |
|---|-----------|-------|----------|
| 1 | Client init | Check browser console for Sentry | Sentry initialized with DSN (if `NEXT_PUBLIC_SENTRY_DSN` set) |
| 2 | Global error boundary | Trigger an uncaught error | `global-error.tsx` renders with "Something went wrong" |
| 3 | Error reporting | Trigger error with Sentry configured | Error appears in Sentry dashboard |
| 4 | No DSN graceful | Run without `NEXT_PUBLIC_SENTRY_DSN` | App works normally, no errors in console |

---

## 14. Edge Caching

| # | Test Case | Steps | Expected |
|---|-----------|-------|----------|
| 1 | Cache headers | `curl -I /api/v1/public/page/{slug}` | `Cache-Control: public, s-maxage=60, stale-while-revalidate=300` + `CDN-Cache-Control: public, max-age=60` |
| 2 | Cache invalidation on page save | Edit page title → save | `invalidatePageCache(slug)` called (Cloudflare purge API if configured) |
| 3 | Cache invalidation on link create | Add a link to a page | Cache purged for that page's slug |
| 4 | Cache invalidation on link update | Edit a link → save | Cache purged for that page's slug |
| 5 | Cache invalidation on link delete | Delete a link | Cache purged for that page's slug |
| 6 | No-op without CF keys | Unset `CLOUDFLARE_ZONE_ID` and `CLOUDFLARE_API_TOKEN` | `invalidatePageCache` silently returns without error |

---

## 15. E2E Tests (Playwright)

### Running E2E Tests

```bash
cd apps/web
npx playwright test           # run all tests
npx playwright test --ui      # interactive mode
npx playwright show-report    # view last report
```

### Test Files

| File | Coverage |
|------|----------|
| `e2e/auth-and-create-page.spec.ts` | Login page renders, dashboard redirects unauthenticated users, page creation structure |
| `e2e/link-management.spec.ts` | Link editor structure, CRUD scaffolding (requires auth) |
| `e2e/public-page.spec.ts` | 404 for nonexistent pages, home page renders, click tracking structure |

| # | Test Case | Steps | Expected |
|---|-----------|-------|----------|
| 1 | Playwright config | Check `playwright.config.ts` | testDir `./e2e`, baseURL `http://localhost:3000` |
| 2 | Auth tests run | `npx playwright test e2e/auth-and-create-page.spec.ts` | Login page test passes, auth-dependent tests skipped |
| 3 | Public page tests | `npx playwright test e2e/public-page.spec.ts` | Home page test passes, auth-dependent tests skipped |
| 4 | Link tests | `npx playwright test e2e/link-management.spec.ts` | Auth-dependent tests skipped gracefully |

---

## Quick Smoke Test Checklist

Run through these to verify core functionality:

- [ ] Sign up with Google or Magic Link
- [ ] Create a page with slug "test-page"
- [ ] Add 3 links with titles and URLs
- [ ] Set schedule_start on one link to tomorrow → "Scheduled" indicator shows
- [ ] Drag to reorder links
- [ ] Switch theme to "Minimal Dark"
- [ ] Toggle published → on
- [ ] Visit `/test-page` in incognito — page renders with correct theme, scheduled link hidden
- [ ] View page source — JSON-LD `<script>` present with ProfilePage schema
- [ ] Click a link on the public page
- [ ] Check analytics page — 1 view, 1 click shown
- [ ] Go to Settings → Profile → update display name
- [ ] Go to Settings → API Keys → generate key → copy
- [ ] `curl -H "X-API-Key: <key>" localhost:3000/api/v1/pages` → returns pages
- [ ] `curl -I localhost:3000/api/v1/public/page/test-page` → Cache-Control headers present
- [ ] Go to Settings → Billing → verify plan cards render
- [ ] Sign out → verify redirect to login
- [ ] Visit `/` → landing page with hero, features, pricing
- [ ] Visit `/nonexistent` → custom 404 page
- [ ] Visit `/sitemap.xml` → published pages listed
- [ ] Visit `/robots.txt` → disallows /dashboard and /api/
- [ ] Visit `/manifest.json` → PWA manifest loads
- [ ] Resize browser to mobile → bottom tab bar appears, sidebar hides
- [ ] Throttle network to Slow 3G → loading skeletons shown on dashboard routes
- [ ] Add a YouTube link → platform auto-detected, icon shown in URL input
- [ ] Set a link to "Featured" display mode → badge shown, public page renders with fill
- [ ] Set a link to "Icon only" → badge shown, link appears in icon bar on public page
- [ ] Expand Colors section → change background color → preview updates
- [ ] Expand Layout section → add a Spacer block → preview shows spacing
- [ ] Drag sections to reorder → preview reflects new order
- [ ] `curl localhost:3000/api/v1/utils/detect-platform?url=https://github.com/test` → `{ data: { platform: "github" } }`
- [ ] Visit `/.well-known/mcp.json` → 20 tools listed including update_design, set_layout, add_block
