export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Page Title */}
        <h1 className="text-page-title">Portalo</h1>

        {/* Section */}
        <section className="space-y-4">
          <h2 className="text-section-title">Design System Preview</h2>
          <p className="text-body">
            This page demonstrates the Portalo design system built with Tailwind CSS 4.
            The aesthetic follows a "Content-Dense Calm" philosophy inspired by Claude.ai,
            Linear, and Notion.
          </p>
          <p className="text-small">
            Secondary text uses a lighter color for visual hierarchy.
          </p>
          <p className="text-tiny">
            Tiny text for metadata, timestamps, and other tertiary information.
          </p>
        </section>

        {/* Colors */}
        <section className="space-y-4">
          <h2 className="text-section-title">Colors</h2>
          <div className="flex flex-wrap gap-3">
            <div className="w-20 h-20 rounded-md bg-accent flex items-center justify-center">
              <span className="text-text-inverse text-tiny">Accent</span>
            </div>
            <div className="w-20 h-20 rounded-md bg-success flex items-center justify-center">
              <span className="text-text-inverse text-tiny">Success</span>
            </div>
            <div className="w-20 h-20 rounded-md bg-warning flex items-center justify-center">
              <span className="text-text-inverse text-tiny">Warning</span>
            </div>
            <div className="w-20 h-20 rounded-md bg-error flex items-center justify-center">
              <span className="text-text-inverse text-tiny">Error</span>
            </div>
          </div>
        </section>

        {/* Backgrounds */}
        <section className="space-y-4">
          <h2 className="text-section-title">Backgrounds</h2>
          <div className="space-y-2">
            <div className="p-4 bg-bg-primary border border-border-primary rounded-md">
              <span className="text-small">bg-primary (default)</span>
            </div>
            <div className="p-4 bg-bg-secondary rounded-md">
              <span className="text-small">bg-secondary</span>
            </div>
            <div className="p-4 bg-bg-tertiary rounded-md">
              <span className="text-small">bg-tertiary (inputs)</span>
            </div>
            <div className="p-4 bg-bg-active rounded-md">
              <span className="text-small">bg-active (selected)</span>
            </div>
          </div>
        </section>

        {/* Sample UI */}
        <section className="space-y-4">
          <h2 className="text-section-title">Sample UI Elements</h2>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-accent text-text-inverse rounded-md font-medium hover:bg-accent-hover transition-colors">
              Primary Button
            </button>
            <button className="px-4 py-2 bg-transparent border border-border-primary rounded-md font-medium hover:bg-bg-hover transition-colors">
              Secondary Button
            </button>
          </div>
          <div className="p-4 bg-bg-secondary rounded-md border border-border-secondary">
            <code className="text-mono">This is monospace text for code.</code>
          </div>
        </section>
      </div>
    </main>
  );
}
