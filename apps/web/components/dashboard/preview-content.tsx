import type { Link } from "@portalo/shared";
import { getTheme } from "@/lib/themes";

interface PreviewContentProps {
  title: string;
  bio: string;
  links: Link[];
  themeName?: string;
}

export function PreviewContent({ title, bio, links, themeName = "clean" }: PreviewContentProps) {
  const visibleLinks = links.filter((l) => l.visible);
  const theme = getTheme(themeName);

  return (
    <div className={`min-h-full ${theme.bg} ${theme.text}`}>
      <div className="flex flex-col items-center px-6 py-10">
        {/* Avatar placeholder */}
        <div className={`w-12 h-12 rounded-full ${theme.avatarBg} mb-4`} />

        {/* Title */}
        <h1 className={`text-[1.125rem] text-center leading-tight ${theme.titleClass}`}>
          {title || "Untitled"}
        </h1>

        {/* Bio */}
        {bio && (
          <p className={`mt-2 text-[0.8125rem] text-center leading-relaxed max-w-[280px] ${theme.textSecondary}`}>
            {bio}
          </p>
        )}

        {/* Divider */}
        <div className={`w-full max-w-[280px] border-t mt-6 mb-4 ${theme.divider}`} />

        {/* Links */}
        <div className="w-full max-w-[280px] space-y-1">
          {visibleLinks.map((link, index) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`block py-2 text-[0.8125rem] truncate ${theme.linkText}`}
            >
              {theme.linkPrefix(index)} {link.title}
            </a>
          ))}
          {visibleLinks.length === 0 && (
            <p className={`text-[0.75rem] text-center py-2 ${theme.textSecondary}`}>
              No visible links
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
