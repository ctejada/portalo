import type { Metadata } from "next";
import { Sidebar } from "@/components/dashboard/sidebar";

export const metadata: Metadata = {
  title: "Dashboard - Portalo",
  description: "Manage your Portalo pages, links, and analytics",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="md:ml-60 min-h-screen pb-16 md:pb-0">
        {children}
      </main>
    </div>
  );
}
