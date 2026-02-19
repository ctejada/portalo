import type { Platform } from "@portalo/shared";

const PLATFORM_RULES: Array<{ hostnames: string[]; platform: Platform }> = [
  { hostnames: ["youtube.com", "youtu.be"], platform: "youtube" },
  { hostnames: ["twitter.com", "x.com"], platform: "twitter" },
  { hostnames: ["instagram.com"], platform: "instagram" },
  { hostnames: ["tiktok.com"], platform: "tiktok" },
  { hostnames: ["github.com"], platform: "github" },
  { hostnames: ["linkedin.com"], platform: "linkedin" },
  { hostnames: ["facebook.com", "fb.com"], platform: "facebook" },
  { hostnames: ["twitch.tv"], platform: "twitch" },
  { hostnames: ["discord.gg", "discord.com"], platform: "discord" },
  { hostnames: ["spotify.com", "open.spotify.com"], platform: "spotify" },
  { hostnames: ["music.apple.com"], platform: "apple-music" },
  { hostnames: ["soundcloud.com"], platform: "soundcloud" },
  { hostnames: ["pinterest.com"], platform: "pinterest" },
  { hostnames: ["snapchat.com"], platform: "snapchat" },
  { hostnames: ["reddit.com"], platform: "reddit" },
  { hostnames: ["t.me", "telegram.org"], platform: "telegram" },
  { hostnames: ["wa.me", "whatsapp.com"], platform: "whatsapp" },
  { hostnames: ["dribbble.com"], platform: "dribbble" },
];

export function detectPlatform(url: string): Platform | null {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, "");
    for (const rule of PLATFORM_RULES) {
      if (rule.hostnames.some((h) => hostname === h || hostname.endsWith(`.${h}`))) {
        return rule.platform;
      }
    }
    return null;
  } catch {
    return null;
  }
}
