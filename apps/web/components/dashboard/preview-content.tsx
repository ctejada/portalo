import type { Link } from "@portalo/shared";

interface PreviewContentProps {
  title: string;
  bio: string;
  links: Link[];
}

export function PreviewContent({ title, bio, links }: PreviewContentProps) {
  const visibleLinks = links.filter((l) => l.visible);

  return (
    <div className="flex flex-col items-center px-6 py-10">
      {/* Avatar placeholder */}
      <div className="w-12 h-12 rounded-full bg-bg-tertiary mb-4" />

      {/* Title */}
      <h1 className="text-[1.125rem] font-semibold text-text-primary text-center leading-tight">
        {title || "Untitled"}
      </h1>

      {/* Bio */}
      {bio && (
        <p className="mt-2 text-[0.8125rem] text-text-secondary text-center leading-relaxed max-w-[280px]">
          {bio}
        </p>
      )}

      {/* Divider */}
      <div className="w-full max-w-[280px] border-t border-border-primary mt-6 mb-4" />

      {/* Links */}
      <div className="w-full max-w-[280px] space-y-1">
        {visibleLinks.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block py-2 text-[0.8125rem] text-text-primary hover:underline truncate"
          >
            &rarr; {link.title}
          </a>
        ))}
        {visibleLinks.length === 0 && (
          <p className="text-[0.75rem] text-text-tertiary text-center py-2">
            No visible links
          </p>
        )}
      </div>
    </div>
  );
}
