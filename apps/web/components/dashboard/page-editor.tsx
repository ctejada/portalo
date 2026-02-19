"use client";

import Link from "next/link";

interface PageEditorProps {
  pageId: string;
}

export function PageEditor({ pageId: _pageId }: PageEditorProps) {
  return (
    <div className="h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border-primary">
        <Link
          href="/dashboard"
          className="text-text-secondary hover:text-text-primary text-body"
        >
          &larr; Pages
        </Link>
      </div>

      {/* Split view */}
      <div className="flex h-[calc(100%-57px)]">
        {/* Editor panel (60%) */}
        <div className="w-3/5 overflow-y-auto p-6 border-r border-border-primary">
          <div className="max-w-xl mx-auto space-y-8">
            {/* Title/bio section — placeholder for commit 61 */}
            <div className="space-y-4">
              <div className="h-10 text-text-tertiary text-page-title">
                Page editor
              </div>
              <p className="text-body text-text-secondary">
                Editor content will be wired in upcoming commits.
              </p>
            </div>

            {/* Links section — placeholder for commits 62-69 */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-section-title">Links</h2>
              </div>
              <p className="text-small text-text-tertiary">
                Links will appear here.
              </p>
            </div>
          </div>
        </div>

        {/* Preview panel (40%) */}
        <div className="w-2/5 bg-bg-secondary flex items-start justify-center p-8 overflow-y-auto">
          <div className="w-[375px] h-[667px] bg-bg-primary rounded-[2.5rem] border border-border-primary shadow-sm flex items-center justify-center">
            <p className="text-small text-text-tertiary">
              Preview will render here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
