"use client";

import { drivers } from "@/data/drivers";
import {
  DriverStatus,
  VerificationStatus,
} from "@/types/driver";
import {
  AlertTriangle,
  BadgeCheck,
  Plus,
  Search,
  UserRound,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

const statusLabels: Record<DriverStatus, string> = {
  available: "Available",
  assigned: "Assigned",
  on_trip: "On Trip",
  on_leave: "On Leave",
  inactive: "Inactive",
};

const statusClasses: Record<DriverStatus, string> = {
  available: "bg-green-50 text-green-700",
  assigned: "bg-indigo-50 text-indigo-700",
  on_trip: "bg-blue-50 text-blue-700",
  on_leave: "bg-amber-50 text-amber-700",
  inactive: "bg-slate-100 text-slate-600",
};

const licenseLabels: Record<
  VerificationStatus,
  string
> = {
  pending: "Pending",
  verified: "Verified",
  rejected: "Rejected",
  expired: "Expired",
};

const licenseClasses: Record<
  VerificationStatus,
  string
> = {
  pending: "bg-amber-50 text-amber-700",
  verified: "bg-green-50 text-green-700",
  rejected: "bg-red-50 text-red-700",
  expired: "bg-red-50 text-red-700",
};

export default function DriversPage() {
  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState<DriverStatus | "all">("all");

  const [licenseFilter, setLicenseFilter] =
    useState<VerificationStatus | "all">("all");

  const filteredDrivers = useMemo(() => {
    const searchValue = search
      .trim()
      .toLowerCase();

    return drivers.filter((driver) => {
      const matchesSearch =
        !searchValue ||
        driver.name
          .toLowerCase()
          .includes(searchValue) ||
        driver.phone
          .toLowerCase()
          .includes(searchValue) ||
        driver.cnic
          .toLowerCase()
          .includes(searchValue) ||
        driver.licenseNumber
          .toLowerCase()
          .includes(searchValue) ||
        driver.assignedTruckRegistration
          ?.toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        statusFilter === "all" ||
        driver.status === statusFilter;

      const matchesLicense =
        licenseFilter === "all" ||
        driver.licenseVerificationStatus ===
          licenseFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesLicense
      );
    });
  }, [search, statusFilter, licenseFilter]);

  const availableDrivers = drivers.filter(
    (driver) => driver.status === "available"
  ).length;

  const onTripDrivers = drivers.filter(
    (driver) => driver.status === "on_trip"
  ).length;

  const licenseAttention = drivers.filter(
    (driver) =>
      driver.licenseVerificationStatus ===
        "expired" ||
      driver.licenseVerificationStatus ===
        "rejected" ||
      driver.licenseVerificationStatus ===
        "pending"
  ).length;

  return (
    <div className="space-y-6 sm:space-y-7">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-(--text) sm:text-2xl">
            Drivers
          </h2>

          <p className="mt-1 text-sm text-(--text-muted)">
            Manage drivers, assignments, licenses,
            and availability.
          </p>
        </div>

        <Link
          href="/admin/drivers/add"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-(--primary) px-4 py-3 text-sm font-semibold text-white transition hover:bg-(--primary-dark) sm:w-auto"
        >
          <Plus size={18} />
          Add Driver
        </Link>
      </div>

      {/* Summary */}
      <section className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <SummaryCard
          title="Total Drivers"
          value={drivers.length}
          icon={UsersRound}
        />

        <SummaryCard
          title="Available"
          value={availableDrivers}
          icon={UserRound}
        />

        <SummaryCard
          title="On Trip"
          value={onTripDrivers}
          icon={BadgeCheck}
        />

        <SummaryCard
          title="License Attention"
          value={licenseAttention}
          icon={AlertTriangle}
        />
      </section>

      {/* Driver List */}
      <section className="overflow-hidden rounded-2xl border border-(--border) bg-white">
        {/* Search & Filters */}
        <div className="flex flex-col gap-3 border-b border-(--border) p-4 sm:p-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative w-full xl:max-w-md">
            <Search
              size={18}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-(--text-muted)"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search driver, CNIC, license, truck..."
              className="w-full rounded-xl border border-(--border) bg-white py-2.5 pl-11 pr-4 text-sm text-(--text) outline-none transition placeholder:text-slate-400 focus:border-(--primary) focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="grid w-full gap-3 sm:grid-cols-2 xl:w-auto">
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value as
                    | DriverStatus
                    | "all"
                )
              }
              className="w-full rounded-xl border border-(--border) bg-white px-4 py-2.5 text-sm text-(--text) outline-none focus:border-(--primary) xl:min-w-[180px]"
            >
              <option value="all">
                All Driver Statuses
              </option>
              <option value="available">
                Available
              </option>
              <option value="assigned">
                Assigned
              </option>
              <option value="on_trip">
                On Trip
              </option>
              <option value="on_leave">
                On Leave
              </option>
              <option value="inactive">
                Inactive
              </option>
            </select>

            <select
              value={licenseFilter}
              onChange={(event) =>
                setLicenseFilter(
                  event.target.value as
                    | VerificationStatus
                    | "all"
                )
              }
              className="w-full rounded-xl border border-(--border) bg-white px-4 py-2.5 text-sm text-(--text) outline-none focus:border-(--primary) xl:min-w-[190px]"
            >
              <option value="all">
                All License Statuses
              </option>
              <option value="verified">
                Verified
              </option>
              <option value="pending">
                Pending
              </option>
              <option value="rejected">
                Rejected
              </option>
              <option value="expired">
                Expired
              </option>
            </select>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="divide-y divide-(--border) md:hidden">
          {filteredDrivers.map((driver) => (
            <div
              key={driver.id}
              className="p-4"
            >
              {/* Driver Header */}
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 text-(--primary)">
                  <UserRound size={20} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-(--text)">
                    {driver.name}
                  </p>

                  <p className="mt-1 break-words text-xs text-(--text-muted)">
                    CNIC: {driver.cnic}
                  </p>
                </div>

                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${statusClasses[driver.status]}`}
                >
                  {statusLabels[driver.status]}
                </span>
              </div>

              {/* Details */}
              <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4">
                <MobileInfo
                  label="Phone"
                  value={driver.phone}
                />

                <MobileInfo
                  label="Truck"
                  value={
                    driver.assignedTruckRegistration ??
                    "Unassigned"
                  }
                />

                <MobileInfo
                  label="License"
                  value={driver.licenseNumber}
                />

                <MobileInfo
                  label="License Expiry"
                  value={driver.licenseExpiryDate}
                />
              </div>

              {/* License Status */}
              <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-3">
                <span className="text-xs font-medium text-(--text-muted)">
                  License Verification
                </span>

                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    licenseClasses[
                      driver
                        .licenseVerificationStatus
                    ]
                  }`}
                >
                  {
                    licenseLabels[
                      driver
                        .licenseVerificationStatus
                    ]
                  }
                </span>
              </div>

              <Link
                href={`/admin/drivers/${driver.id}`}
                className="mt-4 inline-flex w-full items-center justify-center rounded-xl border border-(--border) px-4 py-2.5 text-sm font-semibold text-(--primary) transition hover:bg-blue-50"
              >
                View Driver
              </Link>
            </div>
          ))}

          {filteredDrivers.length === 0 && (
            <div className="px-4 py-12 text-center">
              <UsersRound
                size={30}
                className="mx-auto text-(--text-muted)"
              />

              <p className="mt-3 text-sm text-(--text-muted)">
                No drivers found matching your
                filters.
              </p>
            </div>
          )}
        </div>

        {/* Desktop / Tablet Table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[1150px]">
            <thead className="bg-slate-50">
              <tr className="text-left text-xs font-semibold uppercase tracking-wide text-(--text-muted)">
                <th className="px-6 py-4">
                  Driver
                </th>
                <th className="px-6 py-4">
                  Contact
                </th>
                <th className="px-6 py-4">
                  Assigned Truck
                </th>
                <th className="px-6 py-4">
                  License
                </th>
                <th className="px-6 py-4">
                  License Status
                </th>
                <th className="px-6 py-4">
                  Driver Status
                </th>
                <th className="px-6 py-4 text-right">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredDrivers.map((driver) => (
                <tr
                  key={driver.id}
                  className="border-t border-(--border) text-sm transition hover:bg-slate-50/70"
                >
                  <td className="px-6 py-4">
                    <p className="font-semibold text-(--text)">
                      {driver.name}
                    </p>

                    <p className="mt-1 text-xs text-(--text-muted)">
                      CNIC: {driver.cnic}
                    </p>
                  </td>

                  <td className="px-6 py-4">
                    <p className="font-medium text-(--text)">
                      {driver.phone}
                    </p>

                    <p className="mt-1 text-xs text-(--text-muted)">
                      {driver.email ??
                        "No email"}
                    </p>
                  </td>

                  <td className="px-6 py-4">
                    {driver.assignedTruckRegistration ? (
                      <Link
                        href={`/admin/trucks/${driver.assignedTruckId}`}
                        className="font-semibold text-(--primary) hover:underline"
                      >
                        {
                          driver.assignedTruckRegistration
                        }
                      </Link>
                    ) : (
                      <span className="text-(--text-muted)">
                        Unassigned
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <p className="font-medium text-(--text)">
                      {driver.licenseNumber}
                    </p>

                    <p className="mt-1 text-xs text-(--text-muted)">
                      Exp:{" "}
                      {driver.licenseExpiryDate}
                    </p>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        licenseClasses[
                          driver
                            .licenseVerificationStatus
                        ]
                      }`}
                    >
                      {
                        licenseLabels[
                          driver
                            .licenseVerificationStatus
                        ]
                      }
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[driver.status]}`}
                    >
                      {statusLabels[driver.status]}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/drivers/${driver.id}`}
                      className="text-sm font-semibold text-(--primary) hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}

              {filteredDrivers.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-sm text-(--text-muted)"
                  >
                    No drivers found matching your
                    filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="border-t border-(--border) px-4 py-4 sm:px-6">
          <p className="text-xs text-(--text-muted)">
            Showing {filteredDrivers.length} of{" "}
            {drivers.length} drivers
          </p>
        </div>
      </section>
    </div>
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

      <p className="mt-1 break-words text-sm font-medium text-(--text)">
        {value}
      </p>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: number;
  icon: typeof UserRound;
}) {
  return (
    <div className="rounded-2xl border border-(--border) bg-white p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-(--text-muted) sm:text-sm">
            {title}
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