"use client";

import { auditLogs } from "@/data/auditLogs";
import {
  AuditAction,
  AuditEntity,
} from "@/types/auditLog";
import {
  Activity,
  Search,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useMemo, useState } from "react";

type RoleFilter = "all" | "admin" | "driver";
type ActionFilter = "all" | AuditAction;
type EntityFilter = "all" | AuditEntity;

export default function AuditLogsPage() {
  const [search, setSearch] = useState("");

  const [roleFilter, setRoleFilter] =
    useState<RoleFilter>("all");

  const [actionFilter, setActionFilter] =
    useState<ActionFilter>("all");

  const [entityFilter, setEntityFilter] =
    useState<EntityFilter>("all");

  const rows = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    return auditLogs
      .filter((log) => {
        const matchesSearch =
          !query ||
          [
            log.userName,
            log.description,
            log.action,
            log.entity,
            log.ipAddress ?? "",
          ].some((value) =>
            value
              .toLowerCase()
              .includes(query)
          );

        const matchesRole =
          roleFilter === "all" ||
          log.userRole === roleFilter;

        const matchesAction =
          actionFilter === "all" ||
          log.action === actionFilter;

        const matchesEntity =
          entityFilter === "all" ||
          log.entity === entityFilter;

        return (
          matchesSearch &&
          matchesRole &&
          matchesAction &&
          matchesEntity
        );
      })
      .sort((a, b) =>
        b.createdAt.localeCompare(
          a.createdAt
        )
      );
  }, [
    search,
    roleFilter,
    actionFilter,
    entityFilter,
  ]);

  const adminActions = auditLogs.filter(
    (log) => log.userRole === "admin"
  ).length;

  const driverActions = auditLogs.filter(
    (log) => log.userRole === "driver"
  ).length;

  return (
    <div className="space-y-6 sm:space-y-7">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-(--text) sm:text-2xl">
          Audit Logs
        </h2>

        <p className="mt-1 text-sm text-(--text-muted)">
          Review important activities performed
          by administrators and drivers.
        </p>
      </div>

      {/* Summary */}
      <section className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-3 sm:gap-4">
        <SummaryCard
          label="Total Activities"
          value={auditLogs.length}
          icon={Activity}
        />

        <SummaryCard
          label="Admin Actions"
          value={adminActions}
          icon={ShieldCheck}
        />

        <SummaryCard
          label="Driver Actions"
          value={driverActions}
          icon={UserRound}
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
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="User, activity, IP..."
                className={`${inputClass} pl-10`}
              />
            </div>
          </div>

          {/* Role */}
          <div>
            <label className={labelClass}>
              User Role
            </label>

            <select
              value={roleFilter}
              onChange={(event) =>
                setRoleFilter(
                  event.target
                    .value as RoleFilter
                )
              }
              className={inputClass}
            >
              <option value="all">
                All Roles
              </option>
              <option value="admin">
                Admin
              </option>
              <option value="driver">
                Driver
              </option>
            </select>
          </div>

          {/* Action */}
          <div>
            <label className={labelClass}>
              Action
            </label>

            <select
              value={actionFilter}
              onChange={(event) =>
                setActionFilter(
                  event.target
                    .value as ActionFilter
                )
              }
              className={inputClass}
            >
              <option value="all">
                All Actions
              </option>
              <option value="create">
                Create
              </option>
              <option value="update">
                Update
              </option>
              <option value="delete">
                Delete
              </option>
              <option value="verify">
                Verify
              </option>
              <option value="reject">
                Reject
              </option>
              <option value="status_change">
                Status Change
              </option>
              <option value="payment">
                Payment
              </option>
              <option value="login">
                Login
              </option>
              <option value="logout">
                Logout
              </option>
            </select>
          </div>

          {/* Module */}
          <div>
            <label className={labelClass}>
              Module
            </label>

            <select
              value={entityFilter}
              onChange={(event) =>
                setEntityFilter(
                  event.target
                    .value as EntityFilter
                )
              }
              className={inputClass}
            >
              <option value="all">
                All Modules
              </option>
              <option value="truck">
                Truck
              </option>
              <option value="driver">
                Driver
              </option>
              <option value="assignment">
                Assignment
              </option>
              <option value="trip">
                Trip
              </option>
              <option value="trip_document">
                Trip Document
              </option>
              <option value="truck_document">
                Truck Document
              </option>
              <option value="driver_document">
                Driver Document
              </option>
              <option value="fuel">
                Fuel
              </option>
              <option value="expense">
                Expense
              </option>
              <option value="maintenance">
                Maintenance
              </option>
              <option value="salary">
                Salary
              </option>
              <option value="trip_payment">
                Trip Payment
              </option>
              <option value="company_expense">
                Company Expense
              </option>
              <option value="user">
                User
              </option>
              <option value="system">
                System
              </option>
            </select>
          </div>
        </div>
      </section>

      {/* Logs */}
      <section className="overflow-hidden rounded-2xl border border-(--border) bg-white">
        {/* Mobile Cards */}
        <div className="divide-y divide-(--border) md:hidden">
          {rows.map((log) => (
            <div
              key={log.id}
              className="p-4"
            >
              {/* User / Role */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-(--primary)">
                    {log.userRole ===
                    "admin" ? (
                      <ShieldCheck
                        size={18}
                      />
                    ) : (
                      <UserRound size={18} />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="break-words font-semibold text-(--text)">
                      {log.userName}
                    </p>

                    <p className="mt-1 text-xs text-(--text-muted)">
                      {formatDateTime(
                        log.createdAt
                      )}
                    </p>
                  </div>
                </div>

                <RoleBadge
                  role={log.userRole}
                />
              </div>

              {/* Action / Module */}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <ActionBadge
                  action={log.action}
                />

                <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                  {formatLabel(log.entity)}
                </span>
              </div>

              {/* Activity */}
              <div className="mt-4 rounded-xl bg-slate-50 p-3">
                <p className="text-xs font-medium uppercase tracking-wide text-(--text-muted)">
                  Activity
                </p>

                <p className="mt-2 break-words text-sm leading-6 text-(--text)">
                  {log.description}
                </p>

                {log.entityId !==
                  undefined && (
                  <p className="mt-2 text-xs text-(--text-muted)">
                    Record ID:{" "}
                    {log.entityId}
                  </p>
                )}
              </div>

              {/* Metadata */}
              <div className="mt-4 grid grid-cols-2 gap-4">
                <MobileInfo
                  label="Module"
                  value={formatLabel(
                    log.entity
                  )}
                />

                <MobileInfo
                  label="IP Address"
                  value={
                    log.ipAddress ?? "—"
                  }
                />
              </div>
            </div>
          ))}

          {rows.length === 0 && (
            <EmptyState />
          )}
        </div>

        {/* Desktop Table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-slate-50">
              <tr className="border-b border-(--border)">
                <TableHeading>
                  Date & Time
                </TableHeading>

                <TableHeading>
                  User
                </TableHeading>

                <TableHeading>
                  Role
                </TableHeading>

                <TableHeading>
                  Action
                </TableHeading>

                <TableHeading>
                  Module
                </TableHeading>

                <TableHeading>
                  Activity
                </TableHeading>

                <TableHeading>
                  IP Address
                </TableHeading>
              </tr>
            </thead>

            <tbody>
              {rows.map((log) => (
                <tr
                  key={log.id}
                  className="border-b border-(--border) last:border-b-0 hover:bg-slate-50/60"
                >
                  <TableCell>
                    <div className="whitespace-nowrap">
                      {formatDateTime(
                        log.createdAt
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <p className="font-semibold text-(--text)">
                      {log.userName}
                    </p>
                  </TableCell>

                  <TableCell>
                    <RoleBadge
                      role={log.userRole}
                    />
                  </TableCell>

                  <TableCell>
                    <ActionBadge
                      action={log.action}
                    />
                  </TableCell>

                  <TableCell>
                    {formatLabel(
                      log.entity
                    )}
                  </TableCell>

                  <TableCell>
                    <p className="max-w-[360px] text-sm leading-5">
                      {log.description}
                    </p>

                    {log.entityId !==
                      undefined && (
                      <p className="mt-1 text-xs text-(--text-muted)">
                        Record ID:{" "}
                        {log.entityId}
                      </p>
                    )}
                  </TableCell>

                  <TableCell>
                    {log.ipAddress ?? "—"}
                  </TableCell>
                </tr>
              ))}

              {rows.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-12 text-center"
                  >
                    <Activity
                      size={30}
                      className="mx-auto text-(--text-muted)"
                    />

                    <p className="mt-3 text-sm font-medium text-(--text)">
                      No audit logs found.
                    </p>

                    <p className="mt-1 text-sm text-(--text-muted)">
                      Try changing your
                      search or filters.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="border-t border-(--border) px-4 py-3 text-xs text-(--text-muted) sm:px-5">
          Showing {rows.length} of{" "}
          {auditLogs.length} activities
        </div>
      </section>

      {/* Notice */}
      <section className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
        <p className="text-sm font-semibold text-(--text)">
          Frontend Mock Audit History
        </p>

        <p className="mt-1 text-sm leading-6 text-(--text-muted)">
          These records are currently mock
          data. Laravel backend will later
          generate audit logs automatically
          for important actions. Audit
          history should not be manually
          editable by drivers or normal
          users.
        </p>
      </section>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: typeof Activity;
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

function RoleBadge({
  role,
}: {
  role: "admin" | "driver";
}) {
  return (
    <span
      className={`inline-flex shrink-0 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${
        role === "admin"
          ? "bg-purple-50 text-purple-700"
          : "bg-blue-50 text-blue-700"
      }`}
    >
      {role === "admin"
        ? "Admin"
        : "Driver"}
    </span>
  );
}

function ActionBadge({
  action,
}: {
  action: AuditAction;
}) {
  const styles: Record<
    AuditAction,
    string
  > = {
    create:
      "bg-green-50 text-green-700",
    update:
      "bg-blue-50 text-blue-700",
    delete: "bg-red-50 text-red-700",
    verify:
      "bg-emerald-50 text-emerald-700",
    reject: "bg-red-50 text-red-700",
    status_change:
      "bg-amber-50 text-amber-700",
    payment:
      "bg-cyan-50 text-cyan-700",
    login:
      "bg-indigo-50 text-indigo-700",
    logout:
      "bg-slate-100 text-slate-700",
  };

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${styles[action]}`}
    >
      {formatLabel(action)}
    </span>
  );
}

function MobileInfo({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-medium uppercase tracking-wide text-(--text-muted)">
        {label}
      </p>

      <p className="mt-1 break-all text-sm font-medium text-(--text)">
        {value}
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="px-4 py-10 text-center">
      <Activity
        size={30}
        className="mx-auto text-(--text-muted)"
      />

      <p className="mt-3 text-sm font-medium text-(--text)">
        No audit logs found.
      </p>

      <p className="mt-1 text-sm text-(--text-muted)">
        Try changing your search or
        filters.
      </p>
    </div>
  );
}

function TableHeading({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-(--text-muted)">
      {children}
    </th>
  );
}

function TableCell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <td className="px-5 py-4 text-sm text-(--text-muted)">
      {children}
    </td>
  );
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