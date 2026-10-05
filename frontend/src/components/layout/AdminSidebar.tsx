"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Banknote,
  BarChart3,
  Bell,
  CircleDollarSign,
  CircleDot,
  FileCheck2,
  FileText,
  Fuel,
  Gauge,
  Link2,
  MapPinned,
  ScrollText,
  Settings,
  Truck,
  UserRound,
  UsersRound,
  Wrench,
  X,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: Gauge,
  },
  {
    name: "Trucks",
    href: "/admin/trucks",
    icon: Truck,
  },
  {
    name: "Drivers",
    href: "/admin/drivers",
    icon: UsersRound,
  },
  {
    name: "Assignments",
    href: "/admin/assignments",
    icon: Link2,
  },
  {
    name: "Trips",
    href: "/admin/trips",
    icon: MapPinned,
  },
  {
    name: "Trip Documents",
    href: "/admin/trip-documents",
    icon: FileCheck2,
  },
  {
    name: "Fuel & Expenses",
    href: "/admin/expenses",
    icon: Fuel,
  },
  {
    name: "Maintenance",
    href: "/admin/maintenance",
    icon: Wrench,
  },
  {
    name: "Odometer History",
    href: "/admin/odometer",
    icon: Gauge,
  },
  {
    name: "Tyres",
    href: "/admin/tyres",
    icon: CircleDot,
  },
  {
    name: "Documents",
    href: "/admin/documents",
    icon: FileText,
  },
  {
    name: "Driver Salaries",
    href: "/admin/salaries",
    icon: Banknote,
  },
  {
    name: "Finance",
    href: "/admin/finance",
    icon: CircleDollarSign,
  },
  {
    name: "Live Tracking",
    href: "/admin/tracking",
    icon: MapPinned,
  },
  {
    name: "Reports",
    href: "/admin/reports",
    icon: BarChart3,
  },
  {
    name: "Notifications",
    href: "/admin/notifications",
    icon: Bell,
  },
  {
    name: "Audit Logs",
    href: "/admin/audit-logs",
    icon: ScrollText,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({
  isOpen,
  onClose,
}: AdminSidebarProps) {
  const pathname = usePathname();

  const isActiveRoute = (href: string) => {
    if (href === "/admin/dashboard") {
      return pathname === href;
    }

    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-[260px] flex-col border-r border-(--border) bg-white transition-transform duration-300 ease-in-out lg:z-40 lg:translate-x-0 ${
          isOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center border-b border-(--border) px-5">
          <div className="mr-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-(--primary) text-white">
            <Truck
              size={20}
              strokeWidth={2.2}
            />
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="truncate text-sm font-bold text-(--text)">
              Fleet Management
            </h2>

            <p className="text-xs text-(--text-muted)">
              Admin Panel
            </p>
          </div>

          {/* Mobile Close */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="ml-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-(--text-muted) transition hover:bg-slate-100 hover:text-(--text) lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-(--text-muted)">
            Management
          </p>

          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActiveRoute(
                item.href
              );

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    active
                      ? "bg-blue-50 text-(--primary)"
                      : "text-(--text-muted) hover:bg-slate-50 hover:text-(--text)"
                  }`}
                >
                  <Icon
                    size={18}
                    strokeWidth={
                      active ? 2.4 : 2
                    }
                    className="shrink-0"
                  />

                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Admin Profile */}
        <div className="shrink-0 border-t border-(--border) p-4">
          <div className="flex items-center gap-3 rounded-lg p-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-(--primary)">
              <UserRound size={18} />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-(--text)">
                Fleet Admin
              </p>

              <p className="text-xs text-(--text-muted)">
                Fleet Owner
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}