import Link from "next/link";
import { PLANS } from "@portalo/shared";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-border-primary max-w-5xl mx-auto">
        <span className="text-body-strong">Portalo</span>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-body text-text-secondary hover:text-text-primary">
            Sign in
          </Link>
          <Link
            href="/signup"
            className="px-4 py-1.5 bg-accent text-text-inverse rounded-md text-body font-medium hover:bg-accent-hover transition-colors"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-24 max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-semibold tracking-tight leading-tight">
          Your link-in-bio,
          <br />
          powered by AI
        </h1>
        <p className="mt-4 text-body text-text-secondary max-w-lg mx-auto leading-relaxed">
          A clean, fast link-in-bio page that AI agents can manage for you.
          Same API for your dashboard and Claude, ChatGPT, or any MCP client.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            href="/signup"
            className="px-6 py-2.5 bg-accent text-text-inverse rounded-md text-body font-medium hover:bg-accent-hover transition-colors"
          >
            Get Started Free
          </Link>
          <Link
            href="/login"
            className="px-6 py-2.5 border border-border-primary rounded-md text-body font-medium hover:bg-bg-hover transition-colors"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border-primary">
        <div className="px-6 py-16 max-w-3xl mx-auto">
          <h2 className="text-section-title text-center mb-12">
            Built for creators and AI agents
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-body-strong mb-2">AI-Powered</h3>
              <p className="text-small leading-relaxed">
                Ships with an MCP server. Claude, ChatGPT, and other AI agents
                can add links, change themes, and check analytics using the same
                API as your dashboard.
              </p>
            </div>
            <div>
              <h3 className="text-body-strong mb-2">3 Themes</h3>
              <p className="text-small leading-relaxed">
                Clean, Minimal Dark, and Editorial. Typography-driven designs
                that look nothing like the competition. No rounded cards. No
                candy colors. Just content.
              </p>
            </div>
            <div>
              <h3 className="text-body-strong mb-2">Real-Time Analytics</h3>
              <p className="text-small leading-relaxed">
                Track views, clicks, referrers, and countries. See which links
                perform best. Export contacts collected via email capture.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="border-t border-border-primary">
        <div className="px-6 py-16 max-w-3xl mx-auto">
          <h2 className="text-section-title text-center mb-12">
            Simple pricing
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(["free", "pro", "business"] as const).map((planKey) => {
              const plan = PLANS[planKey];
              return (
                <div
                  key={planKey}
                  className={`p-6 border rounded-md ${
                    planKey === "pro"
                      ? "border-accent"
                      : "border-border-primary"
                  }`}
                >
                  <h3 className="text-body-strong">{plan.name}</h3>
                  <p className="mt-1 text-page-title">
                    {plan.price === 0
                      ? "Free"
                      : `$${plan.price / 100}/mo`}
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li className="text-small">
                      {plan.limits.pages} page{plan.limits.pages > 1 ? "s" : ""}
                    </li>
                    <li className="text-small">
                      {plan.limits.links_per_page} links per page
                    </li>
                    <li className="text-small">
                      {plan.limits.analytics_days}-day analytics
                    </li>
                    {plan.limits.custom_domains > 0 && (
                      <li className="text-small">
                        {plan.limits.custom_domains} custom domain{plan.limits.custom_domains > 1 ? "s" : ""}
                      </li>
                    )}
                    {plan.limits.email_capture && (
                      <li className="text-small">Email capture</li>
                    )}
                    {plan.limits.remove_branding && (
                      <li className="text-small">Remove branding</li>
                    )}
                  </ul>
                  <Link
                    href="/signup"
                    className={`block mt-6 text-center py-2 rounded-md text-body font-medium transition-colors ${
                      planKey === "pro"
                        ? "bg-accent text-text-inverse hover:bg-accent-hover"
                        : "border border-border-primary hover:bg-bg-hover"
                    }`}
                  >
                    {planKey === "free" ? "Get Started" : "Start Free Trial"}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border-primary">
        <div className="px-6 py-8 max-w-3xl mx-auto flex items-center justify-between">
          <span className="text-small">Portalo</span>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-small hover:text-text-primary">
              Sign in
            </Link>
            <Link href="/signup" className="text-small hover:text-text-primary">
              Sign up
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
