"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserNav } from "./user-nav";

const navGroups = [
  {
    label: "Pages",
    items: [{ name: "My Pages", href: "/dashboard" }],
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
      { name: "Billing", href: "/dashboard/billing" },
      { name: "API Keys", href: "/dashboard/settings/api" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 w-60 border-r border-border-primary bg-bg-primary flex flex-col">
      <div className="px-4 py-5">
        <Link href="/dashboard" className="text-section-title text-text-primary">
          Portalo
        </Link>
      </div>

      <nav className="flex-1 px-3 space-y-6 overflow-y-auto">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="px-2 mb-1 text-tiny font-medium uppercase tracking-wider">
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const isActive =
                  item.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname.startsWith(item.href);

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
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
  );
}
