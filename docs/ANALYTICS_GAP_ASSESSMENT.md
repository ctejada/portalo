# Portalo Analytics Gap Assessment & Feature Roadmap

*Created: February 2026*
*Status: Research Complete*

---

## Context

Portalo is a link-in-bio platform at MVP stage (all 10 sprints complete, 213/213 commits). The current analytics implementation tracks views, clicks, email captures with referrer/country/device/browser data, a timeseries chart, top links table, and breakdown tables. This assessment identifies what analytics features are missing compared to Linktree and competitors, validated against real user pain points, and recommends what to offer free (as a differentiator) vs. gate behind Pro.

---

## Current State: What Portalo Already Has

| Feature | Portalo (Free) | Linktree (Free) | Linktree (Paid) |
|---------|---------------|-----------------|-----------------|
| Total views & clicks | Yes | Yes | Yes |
| CTR calculation | Yes | Yes | Yes |
| Email capture count | Yes | No | $9/mo |
| **Referrer tracking** | **Yes (free!)** | No | **$5/mo** |
| **Device breakdown** | **Yes (free!)** | No | **$5/mo** |
| **Country breakdown** | **Yes (free!)** | No | **$5/mo** |
| Timeseries chart | Yes | No | $5/mo |
| Top links table | Yes | Basic clicks only | $5/mo |
| Data retention | 7 days | 28 days | 90-365 days |

**Key insight: Portalo already gives away for free what Linktree charges $5/mo for (device, location, referrer data).** This is a strong differentiator but the 7-day retention on free undermines it. Linktree free gets 28 days.

---

## Gap Analysis: What's Missing

### Tier 1: High Impact, Validated by User Pain Points

These features are the most requested by users switching from Linktree, validated across Reddit, Trustpilot, Product Hunt, and creator blogs.

| # | Feature | User Pain Point | Competitor Status | Difficulty |
|---|---------|----------------|-------------------|------------|
| 1 | **Unique vs. total views/clicks** | "Can't tell real audience size from bots/refreshes" | Linktree: free. Beacons: free. Bio.link: paid | Medium - requires visitor fingerprinting or cookie-based dedup |
| 2 | **Longer free data retention (28 days)** | "7 days is useless for spotting trends" | Linktree free: 28 days. All competitors: 28-30 days minimum | Easy - just change the constant |
| 3 | **Hourly/time-of-day analytics** | "#1 request from marketers - need to correlate clicks to post times" | Nobody does this well. Beacons shows "peak times" only | Medium - already have timestamps, need new aggregation |
| 4 | **CSV/data export** | "Can't include data in media kits or sponsor pitches" | Linktree: $9-24/mo. No competitor offers free | Easy - query existing data, format as CSV |
| 5 | **Browser breakdown** | "No link-in-bio tool shows this" | Nobody offers this | Easy - already captured in DB, just need UI |
| 6 | **City-level geo data** | "Country isn't specific enough for local businesses" | Linktree: $5/mo (top 10). Pro: unlimited | Medium - need IP geolocation service |

### Tier 2: Competitive Differentiators (Nobody Does Well)

| # | Feature | Why It Matters | Competitor Status | Difficulty |
|---|---------|---------------|-------------------|------------|
| 7 | **Returning vs. new visitors** | "Understanding audience loyalty and growth" | Nobody tracks this | Medium - requires anonymous visitor ID |
| 8 | **Link click velocity / trending** | "Which links are gaining/losing momentum" | Nobody offers this | Medium - compare period-over-period |
| 9 | **Engagement depth (bounce rate)** | "How many visitors leave without clicking anything" | Nobody tracks drop-off | Easy - views minus unique clickers |
| 10 | **Real-time event feed** | "Want live data during product launches" | Only Beacons claims real-time | Medium - WebSocket or polling |
| 11 | **Time-to-click metric** | "How long before visitors engage" | Linktree: free tier. Nobody else | Medium - needs client-side timing |

### Tier 3: Pro-Worthy Features (Integrations & Advanced)

| # | Feature | Why It Matters | Competitor Status | Difficulty |
|---|---------|---------------|-------------------|------------|
| 12 | **Google Analytics integration** | "Need one source of truth for all traffic" | Linktree: $9/mo. Stan: $99/mo | Medium - inject GA tag on public pages |
| 13 | **Meta/Facebook Pixel** | "Retargeting is critical for monetization" | Linktree: $9/mo. Shorby: all plans | Medium - inject pixel on public pages |
| 14 | **UTM parameter support** | "Auto-tag outbound links for attribution" | Linktree: $9/mo | Easy - append params to URLs |
| 15 | **Custom date range picker** | "Need specific date ranges for campaigns" | Linktree: $9/mo | Easy - UI change |
| 16 | **A/B testing for links** | "Test different titles/orders to optimize CTR" | Nobody offers this | Hard - needs experiment framework |
| 17 | **Shareable analytics / media kit** | "Creators need to show sponsors their reach" | Nobody does this well | Medium - public analytics URL |

---

## Recommended Strategy: Free vs. Pro

### Philosophy
**Give away analytics that Linktree charges for. Charge for integrations and advanced features.**

This is the most validated approach based on user pain points. The #1 reason users explore Linktree alternatives is that basic analytics are paywalled. Portalo can win users by being generous with data.

### FREE Tier Enhancements (Acquisition Differentiators)

These features should be free because they directly address the top user complaints and make Portalo's free tier objectively better than Linktree's $5/mo Starter plan:

| Feature | Why Free | Marketing Angle |
|---------|----------|----------------|
| **Unique vs. total views/clicks** | Linktree gives this free; table stakes | Match Linktree |
| **28-day data retention** (up from 7) | Linktree free = 28 days; 7 days is a weakness | Match Linktree |
| **Hourly/time-of-day breakdown** | Nobody does this; massive differentiator | "See WHEN your audience clicks" |
| **Browser breakdown** | Already captured, nobody shows it, nearly free to add | "More data than Linktree Pro" |
| **Bounce rate / engagement depth** | Easy to compute, unique differentiator | "Know how engaged your visitors really are" |
| **Link click velocity** | Simple period comparison, unique | "See which links are trending" |
| **Time-to-click** | Linktree offers this free; match them | Match Linktree |

**Free tier marketing claim**: *"Portalo Free gives you more analytics than Linktree Pro ($9/mo)"*

### PRO Tier Features ($5-7/mo, Revenue Drivers)

These features justify the upgrade because they serve professional/business needs:

| Feature | Why Pro | Justification |
|---------|---------|---------------|
| **90-day data retention** (already planned) | Long-term trend analysis | Linktree: $5/mo for 90 days |
| **CSV/data export** | Media kits, sponsor pitches | Linktree: $9-24/mo |
| **Custom date range** | Campaign analysis | Linktree: $9/mo |
| **Google Analytics integration** | Professional marketers need this | Linktree: $9/mo. Cost: minimal |
| **Meta/Facebook Pixel** | Retargeting | Linktree: $9/mo |
| **UTM parameters** | Attribution | Linktree: $9/mo |
| **Returning vs. new visitors** | Audience growth insights | Nobody offers this |
| **Real-time event feed** | Product launches, drops | Only Beacons claims this |
| **Shareable analytics page** | Sponsor pitches | Nobody does this well |

### FUTURE / Business Tier

| Feature | When to Add |
|---------|-------------|
| **A/B testing for links** | When Pro user base > 100 |
| **365-day / lifetime retention** | Business tier |
| **Revenue tracking / affiliate attribution** | Requires e-commerce integration |
| **Webhook notifications** | API power users |
| **Custom analytics dashboards** | Agency demand |

---

## Implementation Priority (Recommended Sprint Order)

### Sprint 11A: Free Tier Analytics Upgrade (Immediate Differentiator)

**Goal**: Make Portalo Free objectively better than Linktree Starter ($5/mo)

1. **Increase free retention to 28 days** - Change constant in `packages/shared/src/constants.ts`
2. **Unique visitors tracking** - Add anonymous visitor ID (cookie/fingerprint), new `unique_views`/`unique_clicks` fields in overview
3. **Hourly/time-of-day chart** - New API endpoint, new chart component
4. **Browser breakdown** - Already in DB, add to breakdown API + UI
5. **Bounce rate** - Compute from views vs. unique clickers
6. **Time-to-click** - Add client-side timing to ViewTracker, new metric in overview
7. **Link velocity/trending** - Compare current period vs. previous period

### Sprint 11B: Pro Analytics Features (Revenue)

**Goal**: Give Pro users professional-grade analytics worth paying for

8. **CSV export of analytics** - New export endpoint + UI button
9. **Custom date range picker** - Replace period buttons with date picker (Pro only)
10. **GA integration** - Inject GA tag on public pages if configured
11. **Meta Pixel support** - Inject pixel on public pages if configured
12. **UTM parameter auto-tagging** - Append UTM params to outbound link clicks
13. **Returning vs. new visitors** - Use anonymous visitor ID from Sprint 11A
14. **Real-time event feed** - SSE or polling-based live event stream
15. **Shareable analytics page** - Public URL with read-only analytics view

---

## Key Files to Modify

| File | Changes |
|------|---------|
| `packages/shared/src/constants.ts` | Free tier: `analytics_days: 28` |
| `apps/web/app/api/v1/analytics/overview/route.ts` | Add unique counts, bounce rate, time-to-click |
| `apps/web/app/api/v1/analytics/breakdown/route.ts` | Add browser breakdown, hourly breakdown |
| `apps/web/app/api/v1/analytics/timeseries/route.ts` | Add hourly granularity option |
| `apps/web/app/api/v1/public/track/route.ts` | Add anonymous visitor ID, timing data |
| `apps/web/components/public/view-tracker.tsx` | Add time-to-click measurement |
| `apps/web/components/public/link-item.tsx` | Add timing data to click events |
| `apps/web/app/(dashboard)/dashboard/analytics/page.tsx` | New charts and metrics |
| `supabase/migrations/` | New migration for visitor_id column, hourly indexes |
| `packages/shared/src/schemas.ts` | Update trackEventSchema with new fields |

---

## Validation: User Pain Points Addressed

| User Complaint (from research) | How Portalo Addresses It | Tier |
|-------------------------------|-------------------------|------|
| "Only basic click counts, no actionable insights" | Unique views, bounce rate, time-to-click, velocity, hourly data | Free |
| "Can't correlate clicks to specific posts/times" | Hourly analytics with time-of-day breakdown | Free |
| "Best analytics locked behind expensive paywall" | More free analytics than Linktree Pro ($9/mo) | Free |
| "No conversion tracking" | Bounce rate + engagement depth (partial) | Free |
| "GA integration breaks source attribution" | Proper GA integration with correct referrer | Pro |
| "No retargeting data" | Meta Pixel support | Pro |
| "No real-time analytics" | Live event feed | Pro |
| "Can't use data for sponsor pitches" | CSV export + shareable analytics page | Pro |
| "No time-series data on free plan" | Already have timeseries charts on free! | Free (existing) |

---

## Competitive Positioning Summary

**Portalo Free vs. Linktree Free**: Portalo wins on device/location/referrer data (Linktree gates at $5), timeseries charts, hourly analytics, browser data, bounce rate, and link velocity.

**Portalo Free vs. Linktree Starter ($5/mo)**: Portalo Free matches or exceeds on analytics. Linktree Starter only adds device/location/referrer (Portalo has these free).

**Portalo Pro ($5-7/mo) vs. Linktree Pro ($9/mo)**: Portalo Pro includes everything Linktree Pro has (GA, Pixel, UTM, CSV, custom dates, unlimited geo) PLUS unique features (returning visitors, real-time feed, shareable analytics, link velocity). At 30-45% lower price.

**Marketing headline**: *"More analytics for free than Linktree charges $9/month for."*

---

## Sources

### Competitor Pricing & Features
- [Linktree Pricing](https://linktr.ee/s/pricing) - $5/$9/$24 tiers
- [Linktree Help: Understanding Insights](https://help.linktr.ee/en/articles/5434178-understanding-your-insights)
- [Linktree Help: CSV Export](https://help.linktr.ee/en/articles/5707122-how-to-download-a-csv-of-your-analytics-activity)
- [Beacons Pricing](https://home.beacons.ai/plans) - Free analytics dashboard with peak times
- [Stan Store Analytics](https://www.stan.ai/product/analytics-dashboard) - Revenue-focused
- [Bio.link Analytics](https://help.bio.link/en/articles/5291287-understanding-analytics-of-your-bio-link)
- [Lnk.bio Features](https://lnk.bio/all-features) - One-time payment model

### User Pain Points & Reviews
- [AutoPosting.ai: "The Analytics Illusion"](https://autoposting.ai/linktree-review/) - Detailed critique of Linktree analytics
- [Zebra Business Solutions](https://zebrabusinesssolutions.co.uk/linktree-bad-seo/) - Temporal data & drop-off complaints
- [J Franco Marketing](https://thejfranco.com/stop-using-linktree/) - Free plan analytics gaps
- [Daily Ads Linktree Review 2026](https://daily-ads.com/blog/linktree-review-2026-is-it-still-worth-using-or-should-you-switch/)
- [beehiiv Blog](https://www.beehiiv.com/blog/link-in-bio-tool) - Analytics silo problem
- [Trustpilot Linktree Reviews](https://www.trustpilot.com/review/linktr.ee) - Pricing complaints
- [Google Analytics Community](https://support.google.com/analytics/thread/385275631/) - GA data mismatch
- [InfluenceFlow 2025 Guide](https://influenceflow.io/resources/instagram-link-in-bio-tools-the-complete-2025-guide-for-creators-and-brands/) - Creator needs for sponsors

### Market Data
- [Link in Bio Market Report](https://dataintelo.com/report/link-in-bio-platform-market) - $1.62B (2024) to $4.24B (2033)