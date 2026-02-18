**PORTALO**

MVP PLAN ADDENDUM

AI-Agent-First Architecture & Competitor Financial Intelligence

February 2026

*Confidential*

**Table of Contents**

**1. Competitor Financial Intelligence**

1.1 Competitor Revenue & Funding Matrix

1.2 Key Financial Insights

1.3 What the Numbers Mean for Portalo

**2. AI-Agent-First Architecture**

2.1 The Paradigm: B2CC (Business-to-Claude Code)

2.2 Portalo's Agent-First Technical Architecture

2.3 How a Creator's Day Changes

2.4 Architectural Diagram

2.5 The MCP Server Implementation

2.6 Why This Architecture Creates a Moat

**3. Revised MVP Timeline (Agent-First)**

3.1 Updated Phase Plan

3.2 New Go-To-Market Channel: AI Agent Ecosystem

**4. Revised Revenue Model**

4.1 Three Revenue Streams

4.2 Revised Projections (Agent-Adjusted)

**5. Competitive Positioning: Agent-Readiness Matrix**

**6. Revised Confidence Score (Post-AI-Agent Analysis)**

**7. Final Recommendation**

**1. Competitor Financial Intelligence**

This section presents the financial profiles of every material
competitor in the link-in-bio space, assembled from Sacra, Getlatka,
Tracxn, PitchBook, TechCrunch, and public filings. Understanding these
numbers is essential for positioning Portalo's pricing, fundraising
narrative, and long-term strategy.

**1.1 Competitor Revenue & Funding Matrix**

  -------------- ------------- ---------- -------------- --------------- ----------- --------------- ----------
  **Company**    **Revenue**   **Rev.     **Funding**    **Valuation**   **Users**   **Employees**   **ARPC**
                               Year**                                                                

  **Linktree**   **\$61.6M**   Mid-2025   \$166M         \$1.3B          50M+        308             \$144

  **Stan Store** **\$27M ARR** Mar 2024   \$0            N/A             55K+        171             \$482
                                          (Bootstrap)                                                

  **Beacons**    \$10.8M       2024       \$29.6M        N/A             2M+         36-75           N/A

  **Koji**       N/A           ---        \$36M          N/A             N/A         Acq. by LT      N/A

  **Snipfeed**   N/A           ---        \$6.4M         N/A             N/A         N/A             N/A

  **Later (Link  N/A           ---        Acquired       N/A             7M          N/A             N/A
  in Bio)**                                                                                          

  **Shorby**     N/A           ---        Bootstrapped   N/A             N/A         N/A             N/A
  -------------- ------------- ---------- -------------- --------------- ----------- --------------- ----------

**1.2 Key Financial Insights**

**Linktree: Market Leader, Questionable Unit Economics**

Linktree is the undisputed market leader with an estimated \$61.6M in
revenue as of mid-2025, up from \$37M in 2023 and \$25M in 2022.
However, their financials tell a nuanced story. With 50M+ registered
users and only \~340K paying subscribers, their free-to-paid conversion
rate is approximately **0.68%** --- dramatically below the SaaS industry
average of 2-5%. They have 308 employees, implying revenue per employee
of roughly \$200K, which is below the \$250K+ benchmark for healthy SaaS
companies.

Linktree raised \$166M total at a peak \$1.7B valuation (2022), later
marked down to \$1.3B. At \$61.6M revenue, they trade at roughly 21x
revenue --- extremely rich for a company with decelerating growth and
aggressive competition. They laid off 27% of staff in June 2023 to chase
profitability. Their ARPC (average revenue per customer) is just
\$144/year, indicating heavy reliance on the low-cost Starter tier
(\$5/mo). Profitability has not been publicly confirmed.

Critically, Linktree launched **Sponsored Links** in April 2025, letting
creators host commission-based brand offers (Hulu, Sam's Club, Harry's).
This signals their recognition that subscription revenue alone won't
sustain the business --- they're pivoting toward advertising and
affiliate revenue, fundamentally changing the creator's relationship
with their own page.

**Stan Store: The Real Competitive Threat**

Stan is the most important competitor to understand. **Bootstrapped with
zero outside funding**, Stan hit \$27M ARR by March 2024, growing 949%
year-over-year. Their ARPC of \$482 is **3.3x higher than Linktree's
\$144**, driven by a flat \$29/mo subscription with zero transaction
fees on creator sales.

Stan's model proves two critical things for Portalo: first, that
creators will pay significantly more for a tool that directly generates
revenue (store-in-bio vs. link-in-bio). Second, that a bootstrapped team
can reach meaningful scale in this category. However, Stan faces 13%
monthly gross churn, meaning their entire customer base turns over
annually. They're a growth machine running on a treadmill --- constantly
needing new signups to replace churn.

**Beacons: Venture-Funded, Small Scale**

Beacons raised \$29.6M (Series A led by a16z in 2022) but remains small
at an estimated \$10.8M revenue with 36-75 employees and 2M+ users.
They've positioned as an all-in-one creator platform (link-in-bio, media
kits, invoicing) but haven't broken through at scale. Their small team
relative to funding suggests burn rate concerns.

**Everyone Else: Fragmented and Subscale**

Koji was acquired by Linktree in late 2023 despite raising \$36M.
Snipfeed (\$6.4M raised) and Shorby (bootstrapped) remain niche. Later's
Link in Bio product has 7M users but is bundled with their social media
scheduling tool, making standalone comparison difficult. The long tail
of 60+ competitors are mostly bootstrapped micro-tools with negligible
revenue.

**1.3 What the Numbers Mean for Portalo**

- **Revenue threshold to matter:** \$5-10M ARR puts Portalo in the top 5
  of the category. This is achievable with 5K-10K Pro subscribers at
  \$7/mo.

- **Linktree's weakness is real:** A 0.68% conversion rate with \$166M
  in funding is deeply inefficient. There's a massive pool of free users
  who never convert --- our target audience.

- **Stan's model validates higher ARPC:** Creators paying \$29/mo for
  commerce proves willingness to pay. Our \$7/mo Pro tier may actually
  be underpriced for the segment that wants revenue tools.

- **Profitability is rare:** Most competitors are burning cash or
  bootstrapping lean. A capital-efficient path to profitability is both
  achievable and narratively powerful.

- **Consolidation is happening:** Linktree acquired Koji, Bento,
  Lnk.Bio, and Fingertip. The market is shrinking through M&A. New
  entrants need a differentiated angle to avoid being acquired or
  squeezed out.

**2. AI-Agent-First Architecture**

The SaaS-pocalypse of February 2026 erased approximately \$2 trillion in
software market capitalization. The core thesis is simple: **AI agents
are replacing the human operators who use SaaS tools, which destroys the
per-seat business model.** A link-in-bio tool --- a CRUD app with a page
renderer --- is among the most vulnerable categories.

Rather than building a product that AI will eventually replace, Portalo
should be designed as the **infrastructure that AI agents plug into**.
This means a fundamental architectural inversion: instead of building a
GUI for humans that happens to have an API, we build an API-first
platform that happens to have a GUI.

> *\"If you're building SaaS in 2026, ask yourself: Could Claude Code
> successfully use my product? If the answer is no, you're building for
> the past.\" --- Caleb R. John, B2CC: Claude Code Is Your Customer*

**2.1 The Paradigm: B2CC (Business-to-Claude Code)**

A new product design philosophy is emerging in 2026 called B2CC ---
Business to Claude Code. The core insight: **AI agents are the new end
users**. When a creator tells Claude "update my link page to promote my
new course," the AI agent needs to discover Portalo's capabilities,
authenticate, and execute --- all without human intervention.

The playbook for AI-agent-first architecture:

- **Start with the API.** The web dashboard should be built on top of
  the same API that agents use. If you can't build your own UI with your
  public API, the API isn't good enough.

- **Test with agents first.** Before launch, give Claude Code your API
  docs and see if it can successfully integrate without human help. This
  is the new usability test.

- **Design for programmatic discovery.** Agents need to find you,
  evaluate you, and integrate without human intervention. Clear docs,
  copy-pasteable examples, transparent pricing on the docs page.

- **Instrument for agent analytics.** Track which customers are humans
  vs. agents. Understand agent usage patterns separately.

**2.2 Portalo's Agent-First Technical Architecture**

**Layer 1: The API Core (Everything Is an Endpoint)**

Every action possible in Portalo's GUI must be available as a documented
REST API endpoint. The GUI is a client of the API, not a separate
system. This is the single most important architectural decision.

**Core API Endpoints:**

  ---------------- ------------------- ------------------------------------
  **Category**     **Endpoint**        **What It Does**

  **Pages**        POST /pages         Create/update the entire page
                                       structure (links, layout, design)

  **Links**        CRUD                Add, edit, reorder, schedule, or
                   /pages/{id}/links   delete individual links

  **Analytics**    GET /analytics      Query clicks, views, sources, geo,
                                       device --- filterable by date range

  **Contacts**     GET /contacts       Export audience email/data collected
                                       via capture widgets

  **Domains**      POST /domains       Configure custom domain, check DNS,
                                       provision SSL

  **Design**       PUT                 Set colors, fonts, layout, custom
                   /pages/{id}/theme   CSS programmatically

  **Billing**      GET /billing        Current plan, usage, invoices ---
                                       full transparency
  ---------------- ------------------- ------------------------------------

**Layer 2: MCP Server (AI Agents Speak Natively)**

The Model Context Protocol (MCP) is the emerging standard for
AI-agent-to-tool communication. Portalo ships an official MCP server
that AI agents like Claude, ChatGPT, and Gemini can discover and connect
to. This makes Portalo a first-class citizen in any creator's AI
workflow.

**MCP Server Tools Exposed:**

  -------------------------- -------------------------------------------------
  **MCP Tool**               **Agent Invocation Example**

  **update_links**           \"Add my new YouTube video to the top of my
                             Portalo page\"

  **get_analytics**          \"Which links got the most clicks this week?\"

  **create_email_capture**   \"Set up an email signup for my course launch
                             list\"

  **update_design**          \"Change my page to dark mode with my brand
                             colors\"

  **schedule_link**          \"Make my Black Friday link go live at midnight
                             on Nov 29\"

  **export_contacts**        \"Download all email subscribers from the past 30
                             days as CSV\"

  **optimize_links**         \"Reorder my links based on click performance\"
  -------------------------- -------------------------------------------------

The MCP server is published as an open-source npm package (portalo-mcp)
and listed in the MCP server registries. Any AI agent with MCP support
can discover and connect to a creator's Portalo in seconds.

**Layer 3: The GUI (A Client, Not the Product)**

The web dashboard and mobile PWA are clients of the API, just like AI
agents are. The GUI handles visual design (drag-and-drop is hard for
agents), onboarding, and settings that benefit from visual context. But
**every action performed in the GUI calls the same API endpoints that
agents use.** This ensures feature parity and eliminates the "API as
afterthought" trap.

**2.3 How a Creator's Day Changes**

Here's what the AI-agent-first architecture enables for a creator in
practice:

  ----------------------------------- -----------------------------------
  **Today (Manual, GUI-First)**       **With Portalo (Agent-First)**

  Open Linktree → click Add Link →    \"Hey Claude, add my new podcast
  paste URL → write title → drag to   episode to Portalo and put it at
  top → save                          the top\"

  Open analytics dashboard → set date \"What were my top 5 links last
  range → export CSV → open           month, and which social platform
  spreadsheet → analyze               drove the most traffic?\"

  Remember to schedule Black Friday   \"Schedule my Black Friday deal
  links → set calendar reminder →     link to go live Nov 29 at midnight
  manually update page day-of         and remove it Dec 2\"

  Download email list → upload to     \"Export my new subscribers from
  Mailchimp → create segment → write  this week and add them to my
  email → send                        Mailchimp launch list\"

  Check which links are               \"Reorder my links by click
  underperforming → manually reorder  performance and archive anything
  → A/B test by feel                  with \<10 clicks this month\"
  ----------------------------------- -----------------------------------

**2.4 Architectural Diagram**

**Portalo System Architecture (Agent-First):**

┌─────────────────────────────────────────────────────────────┐

│ CLIENTS (equal citizens, same API) │

│ │

│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │

│ │ Web GUI │ │ Mobile │ │MCP Server│ │ REST API │ │

│ │ (Next.js)│ │ (PWA) │ │(AI Agents)│ │(3rd party)│ │

│ └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘ │

└─────────┼─────────┼─────────┼─────────┼────────────────────┘

│

┌─────────────┴──────────────┐

│ UNIFIED API GATEWAY │

│ Auth • Rate Limits • Logs │

└─────────────┬──────────────┘

│

┌────────┬─────────┼────────┬────────┬───────┐

│ │ │ │ │ │

┌──┴──┐ ┌──┴───┐ ┌─┴───┐ ┌─┴───┐ ┌─┴─┐ ┌─┴──┐

│Pages│ │Analytics│ │Contacts│ │Domains│ │Auth│ │Billing│

└──┬──┘ └───┬───┘ └──┬───┘ └──┬───┘ └─┬─┘ └──┬──┘

└────────┴─────────┴────────┴────────┴───────┘

│

┌─────────────┴──────────────┐

│ DATA LAYER (System of │

│ Record --- THE MOAT) │

│ PlanetScale + Tinybird │

└────────────────────────────┘

**2.5 The MCP Server Implementation**

The MCP server is not a v2 feature --- it ships with MVP. Here's what
the implementation looks like:

**Technical Specification:**

- **Protocol:** MCP (Model Context Protocol) over HTTP/SSE for remote
  connections

- **Authentication:** OAuth 2.1 token-based auth via API keys (generated
  in dashboard settings)

- **Discovery:** Published to MCP registries + .well-known/mcp.json at
  custom domain root

- **Package:** Open-source npm package (@portalo/mcp-server) + Docker
  image

- **Rate limits:** Free tier: 100 API calls/day. Pro: 10,000/day.
  Prevents abuse while enabling real workflows

**Example: What happens when a creator says "Add my new podcast to
Portalo":**

  ---------- ---------------------- -----------------------------------------
  **Step**   **Actor**              **Action**

  1          Creator → Claude       \"Add my new podcast episode to my
                                    Portalo page\"

  2          Claude → MCP Discovery Claude reads .well-known/mcp.json,
                                    discovers available tools

  3          Claude → Portalo API   Calls update_links tool: {action:
                                    \"add\", url: \"\...\", title: \"\...\",
                                    position: \"top\"}

  4          Portalo API            Validates, creates link, regenerates
                                    edge-cached page, returns success

  5          Claude → Creator       \"Done! Your podcast episode is now at
                                    the top of your page.\"
  ---------- ---------------------- -----------------------------------------

**2.6 Why This Architecture Creates a Moat**

The AI-agent-first architecture creates three compounding moats that
traditional link-in-bio tools cannot replicate:

**Moat 1: System of Record (Data Gravity)**

Every visitor to a Portalo page generates data: clicks, email captures,
geographic distribution, device types, referral sources, time-of-day
patterns. This data accumulates over months and years into a creator's
**audience intelligence layer** --- the persistent, deterministic system
of record that AI agents orchestrate on top of, rather than replace. An
AI can generate a new page in seconds, but it cannot regenerate 18
months of audience behavior data.

**Moat 2: Agent Lock-In (Integration Gravity)**

Once a creator's AI agent is configured to manage their Portalo via MCP,
switching costs increase dramatically. The agent has learned the
creator's preferences, the API patterns, the workflow automations. This
is the AI-era equivalent of the SaaS integration moat --- except instead
of IT teams being reluctant to re-integrate, it's AI workflows that are
configured and working.

**Moat 3: Network Effects (Discovery Gravity)**

As more creators connect Portalo to their AI agents, Portalo's MCP
server gets listed in more registries, more tutorials reference it, more
agent templates include it. AI agents will recommend tools they've been
trained on or have discovered in registries. Early movers in MCP
registration create a discovery advantage that compounds.

**3. Revised MVP Timeline (Agent-First)**

The original 12-week MVP timeline is updated to front-load API
development and include MCP server as a launch feature, not a v2 add-on.

**3.1 Updated Phase Plan**

  ------------ ------------- --------------------------- -------------------
  **Phase**    **Weeks**     **Deliverables**            **Agent-First
                                                         Addition**

  **0:         Weeks 1-2     Landing page, waitlist,     API design doc +
  Validate**                 survey, competitive         MCP tool schema
                             teardown                    drafted

  **1: Core    Weeks 3-5     Auth, database, API         API-first: GUI
  API**                      endpoints (pages, links,    consumes same
                             analytics)                  endpoints as agents

  **2:         Weeks 6-8     Drag-drop builder, themes,  MCP server (npm)
  Builder**                  custom domains, edge        ships alongside GUI
                             publish                     

  **3:         Weeks 9-11    Stripe billing, analytics   Agent analytics
  Monetize**                 dash, email capture, Pro    tracking (human vs
                             gates                       agent)

  **4:         Week 12       Product Hunt, Reddit, SEO,  MCP registry
  Launch**                   micro-influencer outreach   listings + agent
                                                         demo video
  ------------ ------------- --------------------------- -------------------

**Additional development cost:** The MCP server adds approximately 1-2
weeks of development effort (it's a thin wrapper around the existing
API). The API-first discipline actually ***saves*** time long-term by
preventing the common trap of building GUI-specific endpoints that need
to be refactored later.

**3.2 New Go-To-Market Channel: AI Agent Ecosystem**

The AI-agent-first architecture opens a distribution channel that no
competitor is currently pursuing:

- **MCP Registry Listings:** Register portalo-mcp in Anthropic's MCP
  registry, OpenAI's plugin store, and community registries. When
  creators ask their AI "manage my links," Portalo should appear.

- **Developer Content:** Publish "How to manage your link-in-bio with
  Claude" tutorials. This targets the technical creator audience that's
  underserved by Linktree.

- **Agent Templates:** Pre-built workflow templates: "Weekly link
  audit," "Automatic podcast episode linker," "Social content
  scheduler." Creators copy-paste these into their AI tools.

- **API-First Product Hunt:** Position Portalo as "the first link-in-bio
  tool built for AI agents" --- a differentiated narrative that cuts
  through the noise of 60+ competitors.

**4. Revised Revenue Model**

The AI-agent-first architecture enables a hybrid pricing model that's
more resilient to SaaS-pocalypse dynamics than pure per-seat
subscription.

**4.1 Three Revenue Streams**

  ------------------ ----------------- ------------------ -------------------
  **Stream**         **Model**         **Pricing**        **SaaS-pocalypse
                                                          Risk**

  **Subscription**   Flat monthly fee  Free / \$7 Pro /   MEDIUM ---
                                       \$19 Business      traditional seat
                                                          model

  **API Usage**      Pay per API call  Free: 100/day,     LOW --- scales with
                                       Pro: 10K/day,      agent usage
                                       Overage:           
                                       \$0.001/call       

  **Transaction      \% of creator     2-3% on commerce   LOW ---
  Fees**             sales             (v2)               outcome-based
                                                          pricing
  ------------------ ----------------- ------------------ -------------------

The key insight: **as AI agents do MORE with a creator's Portalo, API
usage revenue increases**. The SaaS-pocalypse kills tools whose revenue
drops as agents replace human operators. Portalo's revenue *grows* as
agents operate more frequently on behalf of creators.

**4.2 Revised Projections (Agent-Adjusted)**

  ------------------- ----------------- ----------------- -----------------
  **Metric**          **Month 6**       **Month 12**      **Month 24**

  **Registered        1,500             10,000            40,000
  users**                                                 

  **Pro subscribers** 100               1,000             4,000

  **Subscription      \$700             \$7,000           \$28,000
  MRR**                                                   

  **Agent-connected   50                800               6,000
  accounts**                                              

  **API usage MRR**   \$50              \$800             \$6,000

  **Total MRR**       **\$750**         **\$7,800**       **\$34,000**

  **Total ARR**       **\$9,000**       **\$93,600**      **\$408,000**
  ------------------- ----------------- ----------------- -----------------

At \$408K ARR by month 24, Portalo would rank as the #4 link-in-bio
platform by revenue (behind Linktree, Stan, and Beacons), entirely
bootstrapped. API usage revenue is projected to grow from 7% of total
MRR at month 6 to 18% by month 24, providing the foundation for an
increasingly agent-driven revenue mix.

**5. Competitive Positioning: Agent-Readiness Matrix**

No current competitor in the link-in-bio space has a public API, an MCP
server, or any form of agent-first architecture. This is the most
significant gap in the entire competitive landscape.

  ---------------- -------------- ---------- ------------- ------------ ----------- -------------
  **Capability**   **Linktree**   **Stan**   **Beacons**   **Shorby**   **Later**   **Portalo**

  **Public REST    ✗ No           ✗ No       ✗ No          ✗ No         Partial     **✓ Yes**
  API**                                                                             

  **MCP Server**   ✗ No           ✗ No       ✗ No          ✗ No         ✗ No        **✓ Yes**

  **Custom         ✗ No           ✗ No       ✓ Yes         ✗ No         ✗ No        **✓ Free**
  Domain**                                                                          

  **One-Click      ✗ Dark         ✓ Yes      ✓ Yes         ✓ Yes        ✓ Yes       **✓ Yes**
  Cancel**         patterns                                                         

  **Data Export**  ✗ No           Partial    Partial       ✗ No         ✗ No        **✓ Full**

  **Usage-Based    ✗ Seat-only    ✗ Flat fee ✗ Seat-only   ✗ Seat-only  ✗ Seat-only **✓ Hybrid**
  Pricing**                                                                         
  ---------------- -------------- ---------- ------------- ------------ ----------- -------------

> *None of the incumbent link-in-bio platforms offer a public API or MCP
> server. Portalo would be the FIRST agent-native tool in the category
> --- a positioning advantage that's structurally difficult for Linktree
> to replicate given their GUI-first architecture and 308-person
> organization.*

**6. Revised Confidence Score (Post-AI-Agent Analysis)**

  --------------------- -------------- ------------- ----------- ------------------------
  **Dimension**         **Original**   **Post-AI**   **Delta**   **Reasoning**

  **Problem Severity**  9.0            9.0           0           Billing/trust pain
                                                                 unchanged by AI trends

  **Market Size &       8.5            8.0           -0.5        Category at risk of AI
  Timing**                                                       disruption long-term;
                                                                 timing still good for
                                                                 18-24mo window

  **MVP Feasibility**   8.7            8.3           -0.4        MCP server adds
                                                                 complexity; API-first
                                                                 discipline harder to
                                                                 execute

  **Differentiation**   7.5            8.5           +1.0        Agent-first is UNIQUE
                                                                 differentiator; no
                                                                 competitor has API or
                                                                 MCP

  **Monetization        7.8            8.2           +0.4        Hybrid pricing
  Viability**                                                    (subscription + API
                                                                 usage) more resilient
                                                                 than seat-only

  **AI-Proofing**       N/A            7.5           NEW         Data moat + agent
                                                                 integration create
                                                                 switching costs; page
                                                                 builder still vulnerable

  **COMPOSITE SCORE**   **8.35**       **8.25**      -0.1        Slightly lower overall,
                                                                 but more durable. Trade
                                                                 raw score for
                                                                 survivability.
  --------------------- -------------- ------------- ----------- ------------------------

**VERDICT: GREEN LIGHT --- BUILD WITH AGENT-FIRST ARCHITECTURE**

The composite score drops marginally from 8.35 to 8.25, reflecting the
real AI disruption risk to the category. However, the agent-first
architecture **dramatically improves the survivability profile**. The
original plan had a \~18-month window before AI pressure became
existential. The revised plan extends this to 36+ months by making
Portalo the infrastructure layer that AI agents depend on rather than
replace.

**7. Final Recommendation**

The link-in-bio market is simultaneously a \$500M+ opportunity and an
AI-vulnerable category. The competitor financials reveal a market
dominated by an inefficient incumbent (Linktree: 0.68% conversion,
\$166M burned) and a bootstrapped upstart proving higher ARPC is
achievable (Stan: \$482 vs. \$144). No competitor has a public API, an
MCP server, or any form of agent-first architecture.

**Portalo should be built as three things simultaneously:**

- **A trust-first link page tool** that wins creators today with custom
  domains, transparent billing, and human support (the original MVP
  thesis --- validated).

- **An API-first platform** where the GUI and AI agents are equal
  citizens consuming the same endpoints (the architectural decision that
  makes everything else possible).

- **A creator audience operating system** that becomes the system of
  record for a creator's audience data, making it the persistent layer
  that AI agents orchestrate on top of (the long-term moat).

**The bottom line:** Don't build a link-in-bio tool that happens to have
an API. Build an API that happens to have a link-in-bio GUI. The first
approach gets disrupted by AI. The second approach becomes the
infrastructure AI depends on.

*End of Addendum*
