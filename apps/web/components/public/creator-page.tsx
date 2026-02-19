import type { Page, Link } from "@portalo/shared";
import { getTheme } from "@/lib/themes";
import { LinkItem } from "@/components/public/link-item";
import { PoweredBy } from "@/components/public/powered-by";

interface CreatorPageProps {
  page: Page;
  links: Link[];
}

export function CreatorPage({ page, links }: CreatorPageProps) {
  const themeName = page.theme?.name ?? "clean";
  const theme = getTheme(themeName);

  return (
    <div className={`min-h-screen flex flex-col items-center ${theme.bg} ${theme.text}`}>
      <div className={`w-full ${theme.container} px-6 py-12`}>
        {/* Avatar placeholder */}
        <div className="flex justify-center mb-4">
          <div className={`w-16 h-16 rounded-full ${theme.avatarBg}`} />
        </div>

        {/* Title */}
        <h1 className={`text-center leading-tight ${theme.titleClass}`}>
          {page.title || "Untitled"}
        </h1>

        {/* Bio */}
        {page.bio && (
          <p className={`mt-3 text-center text-sm leading-relaxed ${theme.textSecondary}`}>
            {page.bio}
          </p>
        )}

        {/* Divider */}
        <div className={`border-t mt-8 mb-6 ${theme.divider}`} />

        {/* Links */}
        <div className="space-y-1">
          {links.map((link, index) => (
            <LinkItem
              key={link.id}
              link={link}
              pageId={page.id}
              index={index}
              themeName={themeName}
            />
          ))}
          {links.length === 0 && (
            <p className={`text-center text-xs py-4 ${theme.textSecondary}`}>
              No links yet
            </p>
          )}
        </div>

        <PoweredBy
          show={page.settings?.show_powered_by !== false}
          className={theme.footerText}
        />
      </div>
    </div>
  );
}
