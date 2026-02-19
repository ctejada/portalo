import type { Page, Link } from "@portalo/shared";
import { LinkItem } from "@/components/public/link-item";

interface CreatorPageProps {
  page: Page;
  links: Link[];
}

export function CreatorPage({ page, links }: CreatorPageProps) {
  const themeName = page.theme?.name ?? "clean";
  const isDark = themeName === "minimal-dark";
  const isEditorial = themeName === "editorial";

  return (
    <div
      className={`min-h-screen flex flex-col items-center ${
        isDark ? "bg-[#0F0F0F] text-[#F9FAFB]" : "bg-white text-text-primary"
      }`}
    >
      <div
        className={`w-full ${isEditorial ? "max-w-[520px]" : "max-w-[480px]"} px-6 py-12`}
      >
        {/* Avatar placeholder */}
        <div className="flex justify-center mb-4">
          <div
            className={`w-16 h-16 rounded-full ${
              isDark ? "bg-[#2A2A2A]" : "bg-bg-tertiary"
            }`}
          />
        </div>

        {/* Title */}
        <h1
          className={`text-center font-semibold leading-tight ${
            isEditorial
              ? "text-2xl font-serif"
              : "text-xl"
          }`}
        >
          {page.title || "Untitled"}
        </h1>

        {/* Bio */}
        {page.bio && (
          <p
            className={`mt-3 text-center text-sm leading-relaxed ${
              isDark ? "text-[#9CA3AF]" : "text-text-secondary"
            }`}
          >
            {page.bio}
          </p>
        )}

        {/* Divider */}
        <div
          className={`border-t mt-8 mb-6 ${
            isDark ? "border-[#2A2A2A]" : "border-border-primary"
          }`}
        />

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
            <p
              className={`text-center text-xs py-4 ${
                isDark ? "text-[#6B7280]" : "text-text-tertiary"
              }`}
            >
              No links yet
            </p>
          )}
        </div>

        {/* Powered by footer */}
        {page.settings?.show_powered_by !== false && (
          <div className="mt-12 text-center">
            <a
              href="https://portalo.so"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-xs ${
                isDark ? "text-[#4B5563]" : "text-text-tertiary"
              } hover:underline`}
            >
              Powered by Portalo
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
