import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portalo",
  description: "Your link-in-bio, powered by AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
