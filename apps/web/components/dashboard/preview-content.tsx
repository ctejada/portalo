import type { Link, ThemeConfig, PageLayout, Section } from "@portalo/shared";
import { DEFAULT_LAYOUT } from "@portalo/shared";
import { resolveTheme } from "@/lib/themes";
import { SocialIcon } from "@/components/public/social-icons";

interface PreviewContentProps {
  title: string;
  bio: string;
  links: Link[];
  theme?: ThemeConfig;
  layout?: PageLayout | null;
}

export function PreviewContent({ title, bio, links, theme, layout }: PreviewContentProps) {
  const resolved = resolveTheme(theme ?? { name: "clean" });
  const sections = (layout?.sections ?? DEFAULT_LAYOUT.sections) as Section[];
  const blocks = layout?.blocks ?? [];

  const visibleLinks = links.filter((l) => l.visible);
  const standardLinks = visibleLinks.filter((l) => l.display_mode !== "icon-only");
  const iconLinks = visibleLinks.filter((l) => l.display_mode === "icon-only" && l.platform);

  return (
    <div
      className={`min-h-full ${resolved.bg} ${resolved.text}`}
      style={resolved.customStyles.bg ?? {}}
    >
      <div className="flex flex-col items-center px-6 py-10">
        {sections.map((section, i) => {
          switch (section.type) {
            case "header":
              return (
                <div key={`header-${i}`} className="w-full flex flex-col items-center mb-4">
                  <div className={`w-12 h-12 rounded-full ${resolved.avatarBg} mb-4`} />
                  <h1 className={`text-[1.125rem] text-center leading-tight ${resolved.titleClass}`}
                    style={resolved.customStyles.text ?? {}}>
                    {title || "Untitled"}
                  </h1>
                  {bio && (
                    <p className={`mt-2 text-[0.8125rem] text-center leading-relaxed max-w-[280px] ${resolved.textSecondary}`}
                      style={resolved.customStyles.secondary ?? {}}>
                      {bio}
                    </p>
                  )}
                </div>
              );

            case "icon-bar":
              if (iconLinks.length === 0) return null;
              return (
                <div key={`icons-${i}`} className="flex items-center justify-center gap-4 my-3">
                  {iconLinks.map((link) => (
                    <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer"
                      className={`${resolved.textSecondary} hover:${resolved.text} transition-colors`}>
                      {link.platform && <SocialIcon platform={link.platform} size={20} />}
                    </a>
                  ))}
                </div>
              );

            case "links":
              return (
                <div key={`links-${i}`} className="w-full max-w-[280px] space-y-1">
                  <div className={`w-full border-t mb-3 ${resolved.divider}`} />
                  {standardLinks.map((link, idx) => {
                    const isFeatured = link.display_mode === "featured";
                    return (
                      <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer"
                        className={`block py-2 text-[0.8125rem] truncate ${resolved.linkText} ${
                          isFeatured ? "px-3 py-2.5 rounded-lg" : ""
                        }`}
                        style={{
                          ...(isFeatured ? resolved.customStyles.linkBg : {}),
                          ...(resolved.customStyles.linkText ?? {}),
                        }}
                      >
                        <span className="inline-flex items-center gap-1.5">
                          {link.platform && <SocialIcon platform={link.platform} size={14} className="opacity-60 shrink-0" />}
                          <span>{isFeatured ? link.title : `${resolved.linkPrefix(idx)} ${link.title}`}</span>
                        </span>
                      </a>
                    );
                  })}
                  {standardLinks.length === 0 && (
                    <p className={`text-[0.75rem] text-center py-2 ${resolved.textSecondary}`}>
                      No visible links
                    </p>
                  )}
                </div>
              );

            case "block": {
              const block = blocks.find((b) => b.id === section.id);
              if (!block) return null;
              if (block.kind === "spacer") {
                return <div key={`block-${section.id}`} style={{ height: block.props.height ?? 24 }} />;
              }
              if (block.kind === "divider") {
                return (
                  <div key={`block-${section.id}`} className={`w-full max-w-[280px] border-t my-2 ${resolved.divider}`} />
                );
              }
              if (block.kind === "text") {
                return (
                  <p key={`block-${section.id}`}
                    className={`text-[0.8125rem] text-center max-w-[280px] my-2 ${resolved.textSecondary}`}
                    style={resolved.customStyles.secondary ?? {}}>
                    {block.props.text}
                  </p>
                );
              }
              return null;
            }

            default:
              return null;
          }
        })}
      </div>
    </div>
  );
}
