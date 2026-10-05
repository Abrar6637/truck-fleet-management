"use client";

import { driverDocuments } from "@/data/driverDocuments";
import { drivers } from "@/data/drivers";
import { trips } from "@/data/trips";
import {
  exportReportToExcel,
  exportReportToPDF,
} from "@/lib/reportExport";
import {
  DriverStatus,
  VerificationStatus,
} from "@/types/driver";
import {
  BadgeCheck,
  Download,
  FileSpreadsheet,
  FileWarning,
  Search,
  Truck,
  UserCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

type StatusFilter = DriverStatus | "all";
type VerificationFilter = VerificationStatus | "all";

const statusOptions: {
  value: StatusFilter;
  label: string;
}[] = [
  { value: "all", label: "All Statuses" },
  { value: "available", label: "Available" },
  { value: "assigned", label: "Assigned" },
  { value: "on_trip", label: "On Trip" },
  { value: "on_leave", label: "On Leave" },
  { value: "inactive", label: "Inactive" },
];

const verificationOptions: {
  value: VerificationFilter;
  label: string;
}[] = [
  { value: "all", label: "All Verification" },
  { value: "verified", label: "Verified" },
  { value: "pending", label: "Pending" },
  { value: "rejected", label: "Rejected" },
  { value: "expired", label: "Expired" },
];

export default function DriverReportPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("all");

  const [verificationFilter, setVerificationFilter] =
    useState<VerificationFilter>("all");

  const reportRows = useMemo(() => {
    const query = search.trim().toLowerCase();

    return drivers
      .filter((driver) => {
        const matchesSearch =
          !query ||
          [
            driver.name,
            driver.phone,
            driver.email,
            driver.cnic,
            driver.licenseNumber,
            driver.assignedTruckRegistration,
          ]
            .filter(Boolean)
            .some((value) =>
              String(value)
                .toLowerCase()
                .includes(query)
            );

        const matchesStatus =
          statusFilter === "all" ||
          driver.status === statusFilter;

        const matchesVerification =
          verificationFilter === "all" ||
          driver.licenseVerificationStatus ===
            verificationFilter;

        return (
          matchesSearch &&
          matchesStatus &&
          matchesVerification
        );
      })
      .map((driver) => {
        const driverTrips = trips.filter(
          (trip) =>
            trip.driverId === driver.id &&
            trip.status !== "cancelled"
        );

        const completedTrips = driverTrips.filter(
          (trip) => trip.status === "completed"
        ).length;

        const activeTrips = driverTrips.filter(
          (trip) =>
            trip.status === "started" ||
            trip.status === "in_transit"
        ).length;

        const licenseDocument =
          driverDocuments.find(
            (document) =>
              document.driverId === driver.id &&
              document.documentType ===
                "driving_license"
          );

        return {
          driver,
          totalTrips: driverTrips.length,
          completedTrips,
          activeTrips,

          // Prefer dedicated document record.
          // Fall back to the driver profile license expiry.
          licenseExpiry:
            licenseDocument?.expiryDate ??
            driver.licenseExpiryDate,
        };
      });
  }, [
    search,
    statusFilter,
    verificationFilter,
  ]);

  const availableDrivers = reportRows.filter(
    ({ driver }) =>
      driver.status === "available"
  ).length;

  const activeDrivers = reportRows.filter(
    ({ driver }) =>
      driver.status === "assigned" ||
      driver.status === "on_trip"
  ).length;

  const verifiedDrivers = reportRows.filter(
    ({ driver }) =>
      driver.licenseVerificationStatus ===
      "verified"
  ).length;

  const licenseAttention = reportRows.filter(
    ({ licenseExpiry }) =>
      getLicenseState(licenseExpiry) !== "valid"
  ).length;

  const exportColumns = [
  {
    header: "Driver",
    value: (row: (typeof reportRows)[number]) =>
      row.driver.name,
  },
  {
    header: "Phone",
    value: (row: (typeof reportRows)[number]) =>
      row.driver.phone,
  },
  {
    header: "CNIC",
    value: (row: (typeof reportRows)[number]) =>
      row.driver.cnic,
  },
  {
    header: "Assigned Truck",
    value: (row: (typeof reportRows)[number]) =>
      row.driver.assignedTruckRegistration ??
      "Unassigned",
  },
  {
    header: "License Number",
    value: (row: (typeof reportRows)[number]) =>
      row.driver.licenseNumber,
  },
  {
    header: "License Expiry",
    value: (row: (typeof reportRows)[number]) =>
      row.licenseExpiry
        ? formatDate(row.licenseExpiry)
        : "—",
  },
  {
    header: "License State",
    value: (row: (typeof reportRows)[number]) =>
      formatText(
        getLicenseState(row.licenseExpiry)
      ),
  },
  {
    header: "Verification",
    value: (row: (typeof reportRows)[number]) =>
      formatText(
        row.driver.licenseVerificationStatus
      ),
  },
  {
    header: "Total Trips",
    value: (row: (typeof reportRows)[number]) =>
      row.totalTrips,
  },
  {
    header: "Completed Trips",
    value: (row: (typeof reportRows)[number]) =>
      row.completedTrips,
  },
  {
    header: "Active Trips",
    value: (row: (typeof reportRows)[number]) =>
      row.activeTrips,
  },
  {
    header: "Driver Status",
    value: (row: (typeof reportRows)[number]) =>
      formatText(row.driver.status),
  },
];

const exportSummary = [
  {
    label: "Drivers",
    value: reportRows.length,
  },
  {
    label: "Available",
    value: availableDrivers,
  },
  {
    label: "Active",
    value: activeDrivers,
  },
  {
    label: "License Attention",
    value: licenseAttention,
  },
];

function handlePDFExport() {
  exportReportToPDF({
    title: "Driver Report",
    fileName: "driver-report",
    columns: exportColumns,
    rows: reportRows,
    summary: exportSummary,
  });
}

function handleExcelExport() {
  exportReportToExcel({
    title: "Driver Report",
    fileName: "driver-report",
    columns: exportColumns,
    rows: reportRows,
    summary: exportSummary,
  });
}
  return (
    <div className="space-y-7">
      {/* Header */}
      {/* Header */}
<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
  <div>
    <h2 className="text-2xl font-bold text-(--text)">
      Driver Report
    </h2>

    <p className="mt-1 text-sm text-(--text-muted)">
      Review driver availability, license verification,
      license expiry and trip activity.
    </p>
  </div>

  <div className="flex flex-wrap gap-3">
    <button
      type="button"
      onClick={handlePDFExport}
      disabled={reportRows.length === 0}
      className="inline-flex items-center gap-2 rounded-xl bg-(--primary) px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-(--primary-dark) disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Download size={17} />
      Download PDF
    </button>

    <button
      type="button"
      onClick={handleExcelExport}
      disabled={reportRows.length === 0}
      className="inline-flex items-center gap-2 rounded-xl border border-(--border) bg-white px-4 py-2.5 text-sm font-semibold text-(--text) transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <FileSpreadsheet size={17} />
      Export Excel
    </button>
  </div>
</div>

      {/* Filters */}
      <section className="rounded-2xl border border-(--border) bg-white p-5">
        <div className="grid gap-4 md:grid-cols-3">
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
                  setSearch(event.target.value)
                }
                placeholder="Name, phone, CNIC, license..."
                className={`${inputClass} pl-10`}
              />
            </div>
          </div>

          {/* Driver Status */}
          <div>
            <label className={labelClass}>
              Driver Status
            </label>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value as StatusFilter
                )
              }
              className={inputClass}
            >
              {statusOptions.map((status) => (
                <option
                  key={status.value}
                  value={status.value}
                >
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          {/* Verification */}
          <div>
            <label className={labelClass}>
              License Verification
            </label>

            <select
              value={verificationFilter}
              onChange={(event) =>
                setVerificationFilter(
                  event.target
                    .value as VerificationFilter
                )
              }
              className={inputClass}
            >
              {verificationOptions.map(
                (status) => (
                  <option
                    key={status.value}
                    value={status.value}
                  >
                    {status.label}
                  </option>
                )
              )}
            </select>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Drivers"
          value={String(reportRows.length)}
          subtitle="Drivers in current results"
          icon={Users}
        />

        <SummaryCard
          label="Available"
          value={String(availableDrivers)}
          subtitle="Ready for assignment"
          icon={UserCheck}
        />

        <SummaryCard
          label="Active"
          value={String(activeDrivers)}
          subtitle="Assigned or on trip"
          icon={Truck}
        />

        <SummaryCard
          label="License Attention"
          value={String(licenseAttention)}
          subtitle={`${verifiedDrivers} verified licenses`}
          icon={FileWarning}
        />
      </section>

      {/* Table */}
      <section className="rounded-2xl border border-(--border) bg-white">
        <div className="border-b border-(--border) px-5 py-4">
          <h3 className="font-semibold text-(--text)">
            Driver Records
          </h3>

          <p className="mt-1 text-sm text-(--text-muted)">
            {reportRows.length} driver
            {reportRows.length === 1 ? "" : "s"} found.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1300px]">
            <thead>
              <tr className="border-b border-(--border) bg-slate-50">
                <TableHead>Driver</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Assigned Truck</TableHead>
                <TableHead>License</TableHead>
                <TableHead>License Expiry</TableHead>
                <TableHead>Verification</TableHead>
                <TableHead>Trips</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </tr>
            </thead>

            <tbody>
              {reportRows.map(
                ({
                  driver,
                  totalTrips,
                  completedTrips,
                  activeTrips,
                  licenseExpiry,
                }) => (
                  <tr
                    key={driver.id}
                    className="border-b border-(--border) last:border-0 hover:bg-slate-50/60"
                  >
                    <TableCell>
                      <div>
                        <p className="font-semibold text-(--text)">
                          {driver.name}
                        </p>

                        <p className="mt-1 text-xs text-(--text-muted)">
                          {driver.cnic}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell>
                      {driver.phone}
                    </TableCell>

                    <TableCell>
                      {driver.assignedTruckRegistration ??
                        "Unassigned"}
                    </TableCell>

                    <TableCell>
                      {driver.licenseNumber}
                    </TableCell>

                    <TableCell>
                      <LicenseExpiryBadge
                        expiryDate={licenseExpiry}
                      />
                    </TableCell>

                    <TableCell>
                      <VerificationBadge
                        status={
                          driver.licenseVerificationStatus
                        }
                      />
                    </TableCell>

                    <TableCell>
                      <div>
                        <p className="font-semibold text-(--text)">
                          {totalTrips}
                        </p>

                        <p className="mt-1 text-xs text-(--text-muted)">
                          {completedTrips} completed
                          {activeTrips > 0
                            ? ` • ${activeTrips} active`
                            : ""}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell>
                      <DriverStatusBadge
                        status={driver.status}
                      />
                    </TableCell>

                    <TableCell>
                      <Link
                        href={`/admin/drivers/${driver.id}`}
                        className="text-sm font-semibold text-(--primary) hover:underline"
                      >
                        View
                      </Link>
                    </TableCell>
                  </tr>
                )
              )}

              {reportRows.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    className="px-5 py-12 text-center text-sm text-(--text-muted)"
                  >
                    No drivers found for the selected
                    filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function DriverStatusBadge({
  status,
}: {
  status: DriverStatus;
}) {
  const styles: Record<DriverStatus, string> = {
    available:
      "bg-green-50 text-green-700",
    assigned:
      "bg-blue-50 text-blue-700",
    on_trip:
      "bg-indigo-50 text-indigo-700",
    on_leave:
      "bg-amber-50 text-amber-700",
    inactive:
      "bg-slate-100 text-slate-700",
  };

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {formatText(status)}
    </span>
  );
}

function VerificationBadge({
  status,
}: {
  status: VerificationStatus;
}) {
  const styles: Record<
    VerificationStatus,
    string
  > = {
    verified:
      "bg-green-50 text-green-700",
    pending:
      "bg-amber-50 text-amber-700",
    rejected:
      "bg-red-50 text-red-700",
    expired:
      "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {status === "verified" && (
        <BadgeCheck size={13} />
      )}

      {formatText(status)}
    </span>
  );
}

function LicenseExpiryBadge({
  expiryDate,
}: {
  expiryDate?: string;
}) {
  if (!expiryDate) {
    return (
      <span className="text-(--text-muted)">
        —
      </span>
    );
  }

  const state = getLicenseState(expiryDate);

  const styles = {
    valid: "bg-green-50 text-green-700",
    expiring: "bg-amber-50 text-amber-700",
    expired: "bg-red-50 text-red-700",
  };

  return (
    <div>
      <span
        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${styles[state]}`}
      >
        {state === "valid"
          ? "Valid"
          : state === "expiring"
          ? "Expiring Soon"
          : "Expired"}
      </span>

      <p className="mt-1 text-xs text-(--text-muted)">
        {formatDate(expiryDate)}
      </p>
    </div>
  );
}

function getLicenseState(
  expiryDate?: string
): "valid" | "expiring" | "expired" {
  if (!expiryDate) {
    return "valid";
  }

  // Fixed mock date for consistent frontend testing.
  const today = new Date("2026-10-05T00:00:00");

  const expiry = new Date(
    `${expiryDate}T00:00:00`
  );

  if (expiry < today) {
    return "expired";
  }

  const millisecondsPerDay =
    1000 * 60 * 60 * 24;

  const daysRemaining = Math.ceil(
    (expiry.getTime() - today.getTime()) /
      millisecondsPerDay
  );

  return daysRemaining <= 30
    ? "expiring"
    : "valid";
}

function SummaryCard({
  label,
  value,
  subtitle,
  icon: Icon,
}: {
  label: string;
  value: string;
  subtitle: string;
  icon: typeof Users;
}) {
  return (
    <div className="rounded-2xl border border-(--border) bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-(--text-muted)">
            {label}
          </p>

          <p className="mt-2 text-2xl font-bold text-(--text)">
            {value}
          </p>

          <p className="mt-1 text-xs text-(--text-muted)">
            {subtitle}
          </p>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-(--primary)">
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

function TableHead({
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

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

function formatText(value: string) {
  return value
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");
}

const labelClass =
  "mb-2 block text-sm font-medium text-(--text)";

const inputClass =
  "w-full rounded-xl border border-(--border) bg-white px-4 py-2.5 text-sm text-(--text) outline-none transition focus:border-(--primary)";