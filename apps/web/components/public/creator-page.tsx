import type { Page, Link, PageLayout, Plan } from "@portalo/shared";
import { DEFAULT_LAYOUT, PLANS } from "@portalo/shared";
import { resolveTheme } from "@/lib/themes";
import { LinkItem } from "@/components/public/link-item";
import { PoweredBy } from "@/components/public/powered-by";
import { EmailCapture } from "@/components/public/email-capture";
import { IconBar } from "@/components/public/icon-bar";
import { Block } from "@/components/public/blocks";

interface CreatorPageProps {
  page: Page;
  links: Link[];
  ownerPlan?: string;
}

export function CreatorPage({ page, links, ownerPlan }: CreatorPageProps) {
  const theme = resolveTheme(page.theme ?? { name: "clean" });
  const rawLayout = page.layout as Partial<PageLayout> | null;
  const layout: PageLayout = {
    sections: rawLayout?.sections ?? DEFAULT_LAYOUT.sections,
    blocks: rawLayout?.blocks ?? [],
  };

  const iconLinks = links.filter((l) => l.display_mode === "icon-only");
  const standardLinks = links.filter((l) => l.display_mode !== "icon-only");
  const utmEnabled = Boolean(page.integrations?.utm_enabled);

  return (
    <div
      className={`min-h-screen flex flex-col items-center ${theme.bg} ${theme.text}`}
      style={{ ...theme.customStyles.bg, ...theme.customStyles.text }}
    >
      <div className={`w-full ${theme.container} px-6 py-12`}>
        {layout.sections.map((section, i) => {
          switch (section.type) {
            case "header":
              return (
                <div key={`section-${i}`}>
                  <div className="flex justify-center mb-4">
                    <div className={`w-16 h-16 rounded-full ${theme.avatarBg}`} />
                  </div>
                  <h1 className={`text-center leading-tight ${theme.titleClass}`} style={theme.customStyles.text}>
                    {page.title || "Untitled"}
                  </h1>
                  {page.bio && (
                    <p className={`mt-3 text-center text-sm leading-relaxed ${theme.textSecondary}`} style={theme.customStyles.secondary}>
                      {page.bio}
                    </p>
                  )}
                </div>
              );
            case "icon-bar":
              return <IconBar key={`section-${i}`} links={iconLinks} pageId={page.id} theme={theme} />;
            case "links":
              return (
                <div key={`section-${i}`}>
                  <div className={`border-t mt-8 mb-6 ${theme.divider}`} />
                  <div className="space-y-1">
                    {standardLinks.map((link, index) => (
                      <LinkItem key={link.id} link={link} pageId={page.id} index={index} theme={theme} utmEnabled={utmEnabled} />
                    ))}
                    {standardLinks.length === 0 && iconLinks.length === 0 && (
                      <p className={`text-center text-xs py-4 ${theme.textSecondary}`}>
                        No links yet
                      </p>
                    )}
                  </div>
                </div>
              );
            case "block": {
              const block = layout.blocks.find((b) => b.id === section.id);
              if (!block) return null;
              return <div key={`section-${i}`} className="my-4"><Block block={block} theme={theme} /></div>;
            }
            default:
              return null;
          }
        })}

        {page.settings?.show_email_capture && PLANS[(ownerPlan ?? "free") as Plan]?.limits.email_capture && (
          <div className="mt-8">
            <p className={`text-xs text-center mb-2 ${theme.textSecondary}`} style={theme.customStyles.secondary}>
              Get updates
            </p>
            <EmailCapture pageId={page.id} themeName={page.theme?.name ?? "clean"} />
          </div>
        )}

        <PoweredBy
          show={page.settings?.show_powered_by !== false}
          className={theme.footerText}
        />
      </div>
    </div>
  );
}
