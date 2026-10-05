"use client";

import { notifications } from "@/data/notifications";
import {
  NotificationPriority,
  NotificationType,
} from "@/types/notification";
import {
  Bell,
  CheckCircle2,
  Search,
  TriangleAlert,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

type ReadFilter = "all" | "unread" | "read";
type PriorityFilter =
  | "all"
  | NotificationPriority;
type TypeFilter = "all" | NotificationType;

export default function NotificationsPage() {
  const [search, setSearch] = useState("");

  const [readFilter, setReadFilter] =
    useState<ReadFilter>("all");

  const [priorityFilter, setPriorityFilter] =
    useState<PriorityFilter>("all");

  const [typeFilter, setTypeFilter] =
    useState<TypeFilter>("all");

  // Frontend local state only.
  const [readIds, setReadIds] = useState<
    number[]
  >(
    notifications
      .filter(
        (notification) =>
          notification.isRead
      )
      .map(
        (notification) =>
          notification.id
      )
  );

  const rows = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    return notifications
      .map((notification) => ({
        ...notification,
        isRead: readIds.includes(
          notification.id
        ),
      }))
      .filter((notification) => {
        const matchesSearch =
          !query ||
          [
            notification.title,
            notification.message,
            notification.type,
          ].some((value) =>
            value
              .toLowerCase()
              .includes(query)
          );

        const matchesRead =
          readFilter === "all" ||
          (readFilter === "read"
            ? notification.isRead
            : !notification.isRead);

        const matchesPriority =
          priorityFilter === "all" ||
          notification.priority ===
            priorityFilter;

        const matchesType =
          typeFilter === "all" ||
          notification.type ===
            typeFilter;

        return (
          matchesSearch &&
          matchesRead &&
          matchesPriority &&
          matchesType
        );
      })
      .sort((a, b) =>
        b.createdAt.localeCompare(
          a.createdAt
        )
      );
  }, [
    search,
    readFilter,
    priorityFilter,
    typeFilter,
    readIds,
  ]);

  const unreadCount =
    notifications.filter(
      (notification) =>
        !readIds.includes(
          notification.id
        )
    ).length;

  const criticalCount =
    notifications.filter(
      (notification) =>
        notification.priority ===
          "critical" &&
        !readIds.includes(
          notification.id
        )
    ).length;

  function markAsRead(id: number) {
    setReadIds((current) =>
      current.includes(id)
        ? current
        : [...current, id]
    );
  }

  function markAllAsRead() {
    setReadIds(
      notifications.map(
        (notification) =>
          notification.id
      )
    );
  }

  return (
    <div className="space-y-6 sm:space-y-7">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-bold text-(--text) sm:text-2xl">
            Notifications
          </h2>

          <p className="mt-1 text-sm text-(--text-muted)">
            Review fleet alerts, reminders
            and important system updates.
          </p>
        </div>

        <button
          type="button"
          onClick={markAllAsRead}
          disabled={unreadCount === 0}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-(--border) bg-white px-4 py-2.5 text-sm font-semibold text-(--text) transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-fit"
        >
          <CheckCircle2 size={17} />
          Mark All as Read
        </button>
      </div>

      {/* Summary */}
      <section className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-3 sm:gap-4">
        <SummaryCard
          label="Total Notifications"
          value={String(
            notifications.length
          )}
          icon={Bell}
        />

        <SummaryCard
          label="Unread"
          value={String(unreadCount)}
          icon={Bell}
        />

        <SummaryCard
          label="Critical Unread"
          value={String(criticalCount)}
          icon={TriangleAlert}
        />
      </section>

      {/* Filters */}
      <section className="rounded-2xl border border-(--border) bg-white p-4 sm:p-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {/* Search */}
          <div>
            <label className={labelClass}>
              Search
            </label>

            <div className="relative">
              <Search
                size={17}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--text-muted)"
              />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search notifications..."
                className={`${inputClass} pl-10`}
              />
            </div>
          </div>

          {/* Read */}
          <div>
            <label className={labelClass}>
              Read Status
            </label>

            <select
              value={readFilter}
              onChange={(event) =>
                setReadFilter(
                  event.target
                    .value as ReadFilter
                )
              }
              className={inputClass}
            >
              <option value="all">
                All
              </option>
              <option value="unread">
                Unread
              </option>
              <option value="read">
                Read
              </option>
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className={labelClass}>
              Priority
            </label>

            <select
              value={priorityFilter}
              onChange={(event) =>
                setPriorityFilter(
                  event.target
                    .value as PriorityFilter
                )
              }
              className={inputClass}
            >
              <option value="all">
                All Priorities
              </option>
              <option value="critical">
                Critical
              </option>
              <option value="high">
                High
              </option>
              <option value="medium">
                Medium
              </option>
              <option value="low">
                Low
              </option>
            </select>
          </div>

          {/* Type */}
          <div>
            <label className={labelClass}>
              Type
            </label>

            <select
              value={typeFilter}
              onChange={(event) =>
                setTypeFilter(
                  event.target
                    .value as TypeFilter
                )
              }
              className={inputClass}
            >
              <option value="all">
                All Types
              </option>

              <option value="document_expiry">
                Document Expiry
              </option>

              <option value="license_expiry">
                License Expiry
              </option>

              <option value="trip_update">
                Trip Update
              </option>

              <option value="maintenance">
                Maintenance
              </option>

              <option value="salary">
                Salary
              </option>

              <option value="payment">
                Payment
              </option>

              <option value="document_verification">
                Document Verification
              </option>

              <option value="system">
                System
              </option>
            </select>
          </div>
        </div>
      </section>

      {/* Notifications */}
      <section className="space-y-3">
        {rows.map((notification) => (
          <div
            key={notification.id}
            className={`rounded-2xl border p-4 sm:p-5 ${
              notification.isRead
                ? "border-(--border) bg-white"
                : "border-blue-100 bg-blue-50/40"
            }`}
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              {/* Main Content */}
              <div className="flex min-w-0 gap-3 sm:gap-4">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:h-11 sm:w-11 ${
                    notification.isRead
                      ? "bg-slate-50 text-(--text-muted)"
                      : "bg-white text-(--primary)"
                  }`}
                >
                  {notification.priority ===
                  "critical" ? (
                    <TriangleAlert
                      size={20}
                    />
                  ) : (
                    <Bell size={20} />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  {/* Title / Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="min-w-0 break-words font-semibold text-(--text)">
                      {notification.title}
                    </h3>

                    <PriorityBadge
                      priority={
                        notification.priority
                      }
                    />

                    {!notification.isRead && (
                      <span className="shrink-0 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
                        Unread
                      </span>
                    )}
                  </div>

                  {/* Message */}
                  <p className="mt-2 break-words text-sm leading-6 text-(--text-muted)">
                    {notification.message}
                  </p>

                  {/* Metadata */}
                  <div className="mt-3 flex flex-col gap-1.5 text-xs text-(--text-muted) min-[480px]:flex-row min-[480px]:flex-wrap min-[480px]:gap-x-4 min-[480px]:gap-y-2">
                    <span className="font-medium">
                      {formatType(
                        notification.type
                      )}
                    </span>

                    <span>
                      {formatDateTime(
                        notification.createdAt
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex w-full flex-col gap-2 min-[480px]:flex-row lg:w-auto lg:shrink-0">
                {!notification.isRead && (
                  <button
                    type="button"
                    onClick={() =>
                      markAsRead(
                        notification.id
                      )
                    }
                    className="inline-flex w-full items-center justify-center rounded-xl border border-(--border) bg-white px-4 py-2.5 text-sm font-semibold text-(--text) transition hover:bg-slate-50 min-[480px]:w-auto"
                  >
                    Mark as Read
                  </button>
                )}

                {notification.actionUrl && (
                  <Link
                    href={
                      notification.actionUrl
                    }
                    onClick={() =>
                      markAsRead(
                        notification.id
                      )
                    }
                    className="inline-flex w-full items-center justify-center rounded-xl bg-(--primary) px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-(--primary-dark) min-[480px]:w-auto"
                  >
                    View Details
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}

        {rows.length === 0 && (
          <div className="rounded-2xl border border-(--border) bg-white px-4 py-10 text-center sm:px-5 sm:py-12">
            <Bell
              size={30}
              className="mx-auto text-(--text-muted)"
            />

            <p className="mt-3 text-sm font-medium text-(--text)">
              No notifications found.
            </p>

            <p className="mt-1 text-sm text-(--text-muted)">
              Try changing the selected
              filters.
            </p>
          </div>
        )}
      </section>

      {/* Frontend Notice */}
      <section className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
        <p className="text-sm font-semibold text-(--text)">
          Frontend Mock Notifications
        </p>

        <p className="mt-1 text-sm leading-6 text-(--text-muted)">
          Read status currently exists only
          in the browser state. Laravel will
          later store notifications and read
          status permanently.
        </p>
      </section>
    </div>
  );
}

function PriorityBadge({
  priority,
}: {
  priority: NotificationPriority;
}) {
  const styles: Record<
    NotificationPriority,
    string
  > = {
    low: "bg-slate-100 text-slate-700",
    medium:
      "bg-blue-50 text-blue-700",
    high: "bg-amber-50 text-amber-700",
    critical:
      "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`shrink-0 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${styles[priority]}`}
    >
      {formatLabel(priority)}
    </span>
  );
}

function SummaryCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof Bell;
}) {
  return (
    <div className="min-w-0 rounded-2xl border border-(--border) bg-white p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="break-words text-xs text-(--text-muted) sm:text-sm">
            {label}
          </p>

          <p className="mt-2 text-xl font-bold text-(--text) sm:text-2xl">
            {value}
          </p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-(--primary) sm:h-11 sm:w-11">
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

function formatType(
  type: NotificationType
) {
  return formatLabel(type);
}

function formatLabel(value: string) {
  return value
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");
}

function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(
    "en-PK",
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  ).format(date);
}

const labelClass =
  "mb-2 block text-sm font-medium text-(--text)";

const inputClass =
  "w-full rounded-xl border border-(--border) bg-white px-4 py-2.5 text-sm text-(--text) outline-none transition focus:border-(--primary)";