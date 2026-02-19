/**
 * Theme registry for public pages
 * Maps theme names to CSS class/style configurations
 */

export interface ThemeStyles {
  bg: string;
  text: string;
  textSecondary: string;
  linkText: string;
  linkHover: string;
  divider: string;
  avatarBg: string;
  container: string;
  titleClass: string;
  linkPrefix: (index: number) => string;
  footerText: string;
}

export const THEMES: Record<string, ThemeStyles> = {
  clean: {
    bg: "bg-white",
    text: "text-text-primary",
    textSecondary: "text-text-secondary",
    linkText: "text-text-primary hover:underline",
    linkHover: "",
    divider: "border-border-primary",
    avatarBg: "bg-bg-tertiary",
    container: "max-w-[480px]",
    titleClass: "text-xl font-semibold",
    linkPrefix: () => "\u2192",
    footerText: "text-text-tertiary",
  },
  "minimal-dark": {
    bg: "bg-[#0F0F0F]",
    text: "text-[#F9FAFB]",
    textSecondary: "text-[#9CA3AF]",
    linkText: "text-[#D1D5DB] hover:text-white",
    linkHover: "",
    divider: "border-[#2A2A2A]",
    avatarBg: "bg-[#2A2A2A]",
    container: "max-w-[480px]",
    titleClass: "text-xl font-semibold",
    linkPrefix: () => "\u2192",
    footerText: "text-[#4B5563]",
  },
  editorial: {
    bg: "bg-[#FAFAF8]",
    text: "text-[#1A1A1A]",
    textSecondary: "text-[#666666]",
    linkText: "text-[#1A1A1A] hover:underline",
    linkHover: "",
    divider: "border-[#E0E0E0]",
    avatarBg: "bg-[#EBEBEB]",
    container: "max-w-[520px]",
    titleClass: "text-2xl font-semibold font-serif",
    linkPrefix: (index: number) => `${index + 1}.`,
    footerText: "text-[#999999]",
  },
};

export function getTheme(name: string): ThemeStyles {
  return THEMES[name] ?? THEMES.clean;
}
