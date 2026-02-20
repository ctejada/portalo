import type { Platform } from "@portalo/shared";

interface IconProps {
  size: number;
  className?: string;
}

function YouTube({ size, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8ZM9.5 15.6V8.4l6.3 3.6-6.3 3.6Z" />
    </svg>
  );
}

function Twitter({ size, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.2 2.25h3.5l-7.6 8.7 9 11.8h-7l-5.5-7.2-6.3 7.2H.8l8.2-9.3-8.6-11.2h7.2l5 6.6 5.7-6.6Zm-1.2 18.5h2L7.1 4.3H5L17 20.75Z" />
    </svg>
  );
}

function Instagram({ size, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2.2c2.7 0 3 0 4.1.06 1 .05 1.6.2 2 .34.5.19.85.45 1.2.82.37.35.63.7.82 1.2.14.38.3.97.34 1.98.05 1.1.06 1.4.06 4.1s0 3-.06 4.1c-.05 1-.2 1.6-.34 2a3.4 3.4 0 0 1-.82 1.2 3.4 3.4 0 0 1-1.2.82c-.38.14-.97.3-1.98.34-1.1.05-1.4.06-4.1.06s-3 0-4.1-.06c-1-.05-1.6-.2-2-.34a3.4 3.4 0 0 1-1.2-.82 3.4 3.4 0 0 1-.82-1.2c-.14-.38-.3-.97-.34-1.98C2.2 15 2.2 14.7 2.2 12s0-3 .06-4.1c.05-1 .2-1.6.34-2 .19-.5.45-.85.82-1.2.35-.37.7-.63 1.2-.82.38-.14.97-.3 1.98-.34C7 2.2 7.3 2.2 12 2.2ZM12 0C9.3 0 8.9 0 7.8.06 6.7.11 5.9.3 5.2.56a5.5 5.5 0 0 0-2 1.3 5.5 5.5 0 0 0-1.3 2C1.6 4.5 1.4 5.3 1.36 6.4 1.3 7.5 1.3 7.9 1.3 12c0 2.7 0 3.1.06 4.2.05 1.1.24 1.9.5 2.6.28.7.65 1.3 1.3 2a5.5 5.5 0 0 0 2 1.3c.66.26 1.4.44 2.5.5 1.1.05 1.5.06 4.3.06s3.1 0 4.2-.06c1.1-.05 1.9-.24 2.6-.5a5.5 5.5 0 0 0 2-1.3 5.5 5.5 0 0 0 1.3-2c.26-.66.44-1.4.5-2.5.05-1.1.06-1.5.06-4.3s0-3.1-.06-4.2c-.05-1.1-.24-1.9-.5-2.6a5.5 5.5 0 0 0-1.3-2 5.5 5.5 0 0 0-2-1.3C18.7.6 17.9.4 16.8.36 15.7.3 15.3.3 12.5.3 12 0 12 0 12 0Zm0 5.8a6.2 6.2 0 1 0 0 12.4 6.2 6.2 0 0 0 0-12.4Zm0 10.2a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.4-10.4a1.4 1.4 0 1 0 0-2.8 1.4 1.4 0 0 0 0 2.8Z" />
    </svg>
  );
}

function TikTok({ size, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19.3 5.3A4.5 4.5 0 0 1 16.5 2h-3.4v13.4a2.8 2.8 0 1 1-2-2.7V9.2a6.3 6.3 0 1 0 5.4 6.2V9.5a8 8 0 0 0 4.5 1.4V7.5a4.5 4.5 0 0 1-1.7-2.2Z" />
    </svg>
  );
}

function GitHub({ size, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.5-1.4-1.3-1.8-1.3-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.3 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17 4.7 18 5 18 5c.7 1.7.3 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3Z" />
    </svg>
  );
}

function LinkedIn({ size, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M20.4 20.5h-3.6v-5.6c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9v5.7H9.2V9h3.4v1.6h.1c.5-.9 1.6-1.9 3.4-1.9 3.6 0 4.3 2.4 4.3 5.5v6.3ZM5.3 7.4a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2ZM7.1 20.5H3.6V9h3.5v11.5Z" />
    </svg>
  );
}

function Facebook({ size, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M24 12a12 12 0 1 0-13.9 11.9v-8.4H7v-3.5h3.1V9.4c0-3.1 1.9-4.8 4.7-4.8 1.3 0 2.8.2 2.8.2v3h-1.6c-1.5 0-2 1-2 1.9v2.3h3.4l-.5 3.5h-2.9v8.4A12 12 0 0 0 24 12Z" />
    </svg>
  );
}

function Twitch({ size, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M11.6 11V6.7h-2V11h2Zm5.4 0V6.7h-2V11H17ZM4.2 1 1.4 6.7v14.1h5.5V24h3.3l3.2-3.2h4.9L23.4 16V1H4.2Zm17.2 13.9-3.6 3.6h-5.5l-3.2 3.2v-3.2H4.8V3.1h16.6v11.8Z" />
    </svg>
  );
}

function Discord({ size, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M20.3 4.4A18.7 18.7 0 0 0 15.7 3a13 13 0 0 0-.6 1.2 17.4 17.4 0 0 0-5.2 0A12 12 0 0 0 9.3 3 18.8 18.8 0 0 0 3.7 4.4 19.5 19.5 0 0 0 .4 17.6a18.8 18.8 0 0 0 5.7 2.9 14 14 0 0 0 1.2-2 12.2 12.2 0 0 1-1.9-.9l.5-.4a13.4 13.4 0 0 0 11.5 0l.5.4a12.3 12.3 0 0 1-2 .9 14 14 0 0 0 1.3 2 18.7 18.7 0 0 0 5.7-2.9 19.4 19.4 0 0 0-3.6-13.2ZM8 14.8c-1.1 0-2.1-1-2.1-2.3S6.8 10.2 8 10.2s2.1 1.1 2.1 2.3c0 1.3-.9 2.3-2 2.3Zm8 0c-1.1 0-2.1-1-2.1-2.3s.9-2.3 2-2.3 2.1 1.1 2.1 2.3c0 1.3-.9 2.3-2 2.3Z" />
    </svg>
  );
}

function Spotify({ size, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24Zm5.5 17.3a.7.7 0 0 1-1 .3c-2.8-1.7-6.3-2.1-10.4-1.1a.7.7 0 1 1-.3-1.4c4.5-1 8.4-.6 11.4 1.3a.7.7 0 0 1 .3 1Zm1.5-3.3a1 1 0 0 1-1.3.3c-3.2-2-8-2.5-11.8-1.4a1 1 0 0 1-.5-1.8c4.3-1.3 9.6-.7 13.3 1.6a1 1 0 0 1 .3 1.3Zm.1-3.4c-3.8-2.3-10.2-2.5-13.8-1.4a1.1 1.1 0 1 1-.7-2.2c4.2-1.3 11.1-1 15.5 1.6a1.1 1.1 0 0 1-1 2Z" />
    </svg>
  );
}

function AppleMusic({ size, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M23.8 18.6c-.3.7-.6 1.4-1 2-.7 1-1.5 2-2.7 2s-1.7-.7-3.3-.7-2 .7-3.3.8c-1.2 0-2-1-2.7-2C9 18.3 7.7 14.4 9.5 11.7c.9-1.3 2.4-2.2 4-2.2 1.3 0 2.2.8 3.3.8s1.8-.8 3.4-.7c.6 0 2.2.2 3.3 1.7-.1 0-2 1.2-2 3.5s2.3 3.1 2.3 3.1ZM16.1 6.2c.7-.8 1.1-2 1-3.2-1 0-2.1.7-2.8 1.5-.6.7-1.2 1.9-1 3 1 .1 2.1-.6 2.8-1.3Z" />
    </svg>
  );
}

function SoundCloud({ size, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M1.2 14.3c0 .5.3.9.7.9s.6-.4.7-.9l.3-1.7-.3-1.8c0-.4-.3-.8-.7-.8s-.7.4-.7.8L1 12.6l.2 1.7ZM3 15c.3 0 .6-.3.7-.8l.3-2.3-.3-3.2c0-.5-.3-.8-.7-.8-.3 0-.6.3-.7.8l-.2 3.2.2 2.3c0 .5.4.8.7.8Zm2.2.2c.4 0 .7-.4.7-.9l.2-2.4-.2-3.5c0-.5-.3-1-.7-1s-.8.4-.8 1l-.1 3.5.1 2.5c.1.5.4.8.8.8Zm2.2.1c.4 0 .8-.4.8-1l.2-2.5-.2-3.6c0-.5-.4-1-.8-1s-.8.5-.8 1l-.2 3.6.2 2.5c0 .6.4 1 .8 1Zm2.3.1c.5 0 .8-.5.8-1.1l.2-2.5L10.5 6c0-.6-.4-1.2-.9-1.2-.4 0-.8.5-.8 1.1l-.1 1.6v2.3l.1 2.5c0 .6.4 1.1.9 1.1Zm2.6.2a1 1 0 0 0 1-1.2v-2.5l-.1-4.6a1 1 0 0 0-1-1.1c-.6 0-1 .5-1 1.1L11.1 8v4.8c0 .7.4 1.1 1 1.2h.2Zm2.5 0c.3 0 .5-.1.7-.4.2-.2.3-.5.3-.8v-.1l.1-2.4-.1-5a1 1 0 0 0-1-1c-.3 0-.5.1-.7.4-.2.2-.3.5-.3.8v.3l-.1 4.6.1 2.4c0 .7.5 1.2 1 1.2ZM24 11.9a4 4 0 0 0-4-4c-.5 0-1.1.1-1.6.3-.3-2.9-2.8-5.1-5.8-5.1-.7 0-1.5.2-2.2.4-.3.1-.4.3-.4.5v11.3c0 .3.2.5.4.5h9.6a4 4 0 0 0 4-3.9Z" />
    </svg>
  );
}

function Pinterest({ size, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 0a12 12 0 0 0-4.4 23.2c0-.9 0-2 .3-3l1.6-7s-.4-.8-.4-2c0-1.9 1.1-3.3 2.5-3.3 1.2 0 1.7.9 1.7 2 0 1.2-.8 3-1.2 4.6-.3 1.4.7 2.6 2.2 2.6 2.6 0 4.3-3.3 4.3-7.3 0-3-2-5.2-5.7-5.2a6.4 6.4 0 0 0-6.6 6.4c0 1.2.3 2 .9 2.6.2.3.3.4.2.7l-.3 1.1c-.1.4-.4.5-.7.4-2-.8-2.8-3-2.8-5.4 0-4 3.4-8.8 10.2-8.8 5.4 0 9 3.9 9 8.2 0 5.6-3.1 9.8-7.6 9.8-1.5 0-3-.8-3.4-1.7l-1 3.6c-.3 1.2-1 2.4-1.6 3.3A12 12 0 1 0 12 0Z" />
    </svg>
  );
}

function Snapchat({ size, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2c2 0 3.8.8 4.8 2.5.6 1 .7 2 .6 3.1v.6c.5.1 1 .3 1.2.7.2.4.1.9-.2 1.2-.1.1-.3.2-.5.3-.2 0-.4.1-.5.2 0 .2.1.5.4.9.8 1.3 2 2.2 3.3 2.5.4.1.7.3.8.7.1.4 0 .8-.4 1.1-.7.5-1.5.7-2.4.9h-.3c-.1.4-.2.8-.5 1-.5.4-1.1.5-1.6.6-.3.1-.5.1-.7.2-.4.3-1 1-2.7 1.3-.1 0-.3 0-.4.1-1.7 0-3-.7-3.4-1-.2-.2-.5-.3-.8-.4-.5-.1-1-.2-1.5-.5-.3-.3-.4-.7-.5-1.1l-.3-.1c-.9-.1-1.7-.4-2.4-.9-.4-.3-.5-.7-.4-1 .1-.5.4-.7.8-.8 1.4-.3 2.5-1.2 3.3-2.5.3-.5.4-.7.4-1l-.5-.1c-.2-.1-.4-.2-.5-.3-.3-.3-.4-.8-.2-1.2.2-.4.7-.6 1.2-.7l.1-.6c0-1.1 0-2.1.6-3.1C8.2 2.8 10 2 12 2Z" />
    </svg>
  );
}

function Reddit({ size, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24Zm6.8 13.3c0 .2.1.5.1.7 0 2.5-2.9 4.5-6.5 4.5h-.8c-3.6 0-6.5-2-6.5-4.5 0-.2 0-.5.1-.7a1.6 1.6 0 0 1-.4-2.7 1.6 1.6 0 0 1 2.3.2c1.2-.8 2.7-1.3 4.3-1.3l1-3.5 2.7.6a1.2 1.2 0 1 1-.1.5l-2.3-.5-.8 3c1.5 0 2.9.5 4 1.3a1.6 1.6 0 0 1 2.4-.1 1.6 1.6 0 0 1-.5 2.5ZM9.6 12a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4Zm4.8 0a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4Zm-4.6 4c1.5.8 3.3.8 4.8 0a.3.3 0 0 0-.5-.4c-1.2.7-2.6.7-3.8 0a.3.3 0 0 0-.5.4Z" />
    </svg>
  );
}

function Telegram({ size, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24Zm5.6 8.2-1.8 8.7c-.1.6-.5.8-1 .5l-2.8-2.1-1.4 1.3c-.1.2-.3.3-.5.3l.2-2.9 5.2-4.7c.2-.2 0-.3-.3-.1L8.6 13.6l-2.7-.8c-.6-.2-.6-.6.1-.9l10.5-4c.5-.2.9.1.8.8l.3-.5Z" />
    </svg>
  );
}

function WhatsApp({ size, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.5 14.4c-.3-.1-1.6-.8-1.9-.9-.3-.1-.5-.2-.7.1-.2.3-.8 1-1 1.2-.2.2-.3.2-.6.1-.3-.2-1.2-.5-2.4-1.5-.9-.8-1.5-1.8-1.6-2.1-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.2-.1.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.2-.7-1.7-1-2.3-.2-.6-.5-.5-.7-.5h-.6a1.2 1.2 0 0 0-.9.4C6.2 7.5 5.7 8.5 5.7 10c0 1.4 1 2.7 1.2 2.9.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.6-.7 1.9-1.3.2-.6.2-1.2.1-1.3-.1-.1-.3-.2-.6-.3ZM12 21.8a9.9 9.9 0 0 1-5-1.4l-.4-.2-3.7 1 1-3.7-.2-.4A9.8 9.8 0 1 1 12 21.8ZM12 0a12 12 0 0 0-10.2 18.2L.2 24l5.9-1.6A12 12 0 1 0 12 0Z" />
    </svg>
  );
}

function Dribbble({ size, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 24a12 12 0 1 1 0-24 12 12 0 0 1 0 24Zm9.7-10.5a14 14 0 0 0-5.6-.5c1.4 3.8 2 6.9 2.1 7.5a10.1 10.1 0 0 0 3.5-7Zm-4.9 8.3c-.2-.9-.8-4.1-2.3-8a.1.1 0 0 0 0 0C9.2 16 7.6 19 7.3 19.5a10.1 10.1 0 0 0 9.5 2.3ZM6 18.4C6.4 17.7 8.5 14 13.3 12c-.2-.5-.5-1-.7-1.5C8.2 12 4 12 3.5 12v.3c0 2.3.9 4.5 2.5 6.1ZM3.7 10.2h.7c3.9 0 7.6-.8 8.3-1-1.2-2.2-2.6-4-2.7-4.2a10.2 10.2 0 0 0-6.3 5.2Zm7.8-6.3c.2.2 1.5 2 2.7 4.1 2.6-1 3.6-2.4 3.8-2.6a10 10 0 0 0-6.5-1.5Zm7.4 2.6c-.2.3-1.4 1.8-4.1 2.9l.6 1.3c.1.2.2.4.2.6a15.4 15.4 0 0 1 5.9.3 10 10 0 0 0-2.6-5.1Z" />
    </svg>
  );
}

const PLATFORM_ICONS: Record<Platform, React.FC<IconProps>> = {
  youtube: YouTube,
  twitter: Twitter,
  instagram: Instagram,
  tiktok: TikTok,
  github: GitHub,
  linkedin: LinkedIn,
  facebook: Facebook,
  twitch: Twitch,
  discord: Discord,
  spotify: Spotify,
  "apple-music": AppleMusic,
  soundcloud: SoundCloud,
  pinterest: Pinterest,
  snapchat: Snapchat,
  reddit: Reddit,
  telegram: Telegram,
  whatsapp: WhatsApp,
  dribbble: Dribbble,
};

interface SocialIconProps {
  platform: Platform;
  size?: number;
  className?: string;
}

export function SocialIcon({ platform, size = 18, className }: SocialIconProps) {
  const Icon = PLATFORM_ICONS[platform];
  if (!Icon) return null;
  return <Icon size={size} className={className} />;
}

export { PLATFORM_ICONS };
