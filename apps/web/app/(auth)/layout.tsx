import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in - Portalo",
  description: "Sign in to your Portalo account",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-[360px] px-4">
        <div className="text-center mb-8">
          <h1 className="text-page-title">Portalo</h1>
        </div>
        {children}
      </div>
    </div>
  );
}
