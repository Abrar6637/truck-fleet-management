"use client";

import { notifications } from "@/data/notifications";
import {
  Bell,
  ChevronDown,
  Menu,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const pageTitles: Record<string, string> = {
  dashboard: "Dashboard",
  trucks: "Trucks",
  "audit-logs": "Audit Logs",
  odometer: "Odometer History",
  drivers: "Drivers",
  assignments: "Truck Assignments",
  trips: "Trips",
  "trip-documents": "Trip Documents",
  expenses: "Fuel & Expenses",
  maintenance: "Maintenance",
  tyres: "Tyres",
  documents: "Documents",
  salaries: "Driver Salaries",
  finance: "Finance",
  tracking: "Live Tracking",
  reports: "Reports",
  notifications: "Notifications",
  settings: "Settings",
};

interface AdminHeaderProps {
  onMenuClick: () => void;
}

export default function AdminHeader({
  onMenuClick,
}: AdminHeaderProps) {
  const pathname = usePathname();

  const section =
    pathname.split("/")[2] || "dashboard";

  const pageTitle =
    pageTitles[section] || "Fleet Management";

  // Mock unread count.
  // Laravel backend will provide real-time
  // notification/read status later.
  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-(--border) bg-white px-4 sm:px-6 lg:px-8">
      {/* Left Side */}
      <div className="flex min-w-0 items-center gap-3">
        {/* Mobile Menu */}
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-(--border) text-(--text-muted) transition hover:bg-slate-50 hover:text-(--text) lg:hidden"
        >
          <Menu size={20} />
        </button>

        {/* Page Title */}
        <div className="min-w-0">
          <h1 className="truncate text-base font-semibold text-(--text) sm:text-lg">
            {pageTitle}
          </h1>

          <p className="hidden text-xs text-(--text-muted) sm:block">
            Fleet Management System
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
        {/* Notifications */}
        <Link
          href="/admin/notifications"
          aria-label={`Notifications${
            unreadCount > 0
              ? `, ${unreadCount} unread`
              : ""
          }`}
          title="Notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-(--border) text-(--text-muted) transition hover:bg-slate-50 hover:text-(--text)"
        >
          <Bell size={19} />

          {unreadCount > 0 && (
            <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-(--danger) px-1 text-[10px] font-bold leading-none text-white">
              {unreadCount > 99
                ? "99+"
                : unreadCount}
            </span>
          )}
        </Link>

        {/* Divider */}
        <div className="hidden h-8 w-px bg-(--border) sm:block" />

        {/* Admin Profile */}
        <button
          type="button"
          className="flex items-center gap-3 rounded-lg p-1.5 transition hover:bg-slate-50"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-(--primary)">
            <UserRound size={18} />
          </div>

          <div className="hidden text-left md:block">
            <p className="text-sm font-semibold text-(--text)">
              Fleet Admin
            </p>

            <p className="text-xs text-(--text-muted)">
              Administrator
            </p>
          </div>

          <ChevronDown
            size={16}
            className="hidden text-(--text-muted) md:block"
          />
        </button>
      </div>
    </header>
  );
}