"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserNav } from "./user-nav";

const navGroups = [
  {
    label: "Page",
    items: [{ name: "My Page", href: "/dashboard" }],
  },
  {
    label: "Insights",
    items: [
      { name: "Analytics", href: "/dashboard/analytics" },
      { name: "Contacts", href: "/dashboard/contacts" },
    ],
  },
  {
    label: "Settings",
    items: [
      { name: "Profile", href: "/dashboard/settings" },
      { name: "Billing", href: "/dashboard/settings/billing" },
      { name: "Domains", href: "/dashboard/settings/domain" },
      { name: "API Keys", href: "/dashboard/settings/api" },
    ],
  },
];

const mobileTabs = [
  { name: "Page", href: "/dashboard" },
  { name: "Analytics", href: "/dashboard/analytics" },
  { name: "Contacts", href: "/dashboard/contacts" },
  { name: "Settings", href: "/dashboard/settings" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 w-60 border-r border-border-primary bg-bg-primary flex-col">
        <div className="px-4 py-5">
          <Link href="/dashboard" className="text-section-title text-text-primary">
            Portalo
          </Link>
        </div>

        <nav className="flex-1 px-3 space-y-6 overflow-y-auto">
          {navGroups.map((group) => (
            <div key={group.label}>
              <p
                id={`nav-group-${group.label.toLowerCase()}`}
                className="px-2 mb-1 text-tiny font-medium uppercase tracking-wider"
              >
                {group.label}
              </p>
              <ul aria-labelledby={`nav-group-${group.label.toLowerCase()}`} className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive =
                    item.href === "/dashboard"
                      ? pathname === "/dashboard"
                      : pathname.startsWith(item.href);

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={isActive ? "page" : undefined}
                        className={`
                          block px-2 py-1.5 rounded-md text-body-strong transition-colors duration-150
                          ${
                            isActive
                              ? "bg-bg-active text-accent-text"
                              : "text-text-secondary hover:bg-bg-hover hover:text-text-primary"
                          }
                        `.trim()}
                      >
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-border-primary p-4">
          <UserNav />
        </div>
      </aside>

      {/* Mobile bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 border-t border-border-primary bg-bg-primary">
        <ul className="flex">
          {mobileTabs.map((tab) => {
            const isActive =
              tab.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(tab.href);

            return (
              <li key={tab.href} className="flex-1">
                <Link
                  href={tab.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`
                    flex items-center justify-center py-3 text-tiny font-medium transition-colors
                    ${isActive ? "text-accent" : "text-text-secondary"}
                  `.trim()}
                >
                  {tab.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
