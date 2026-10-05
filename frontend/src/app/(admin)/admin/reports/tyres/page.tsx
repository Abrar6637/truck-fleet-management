"use client";

import { tyres } from "@/data/tyres";
import { tyreAssignments } from "@/data/tyreAssignments";
import { trucks } from "@/data/trucks";
import {
  CircleDollarSign,
  CircleGauge,
  Package,
  Search,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

type StatusFilter =
  | "all"
  | "in_stock"
  | "installed"
  | "under_repair"
  | "retired";

type ConditionFilter =
  | "all"
  | "new"
  | "good"
  | "fair"
  | "poor"
  | "damaged";

export default function TyreReportPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("all");
  const [conditionFilter, setConditionFilter] =
    useState<ConditionFilter>("all");

  const reportRows = useMemo(() => {
    const query = search.trim().toLowerCase();

    return tyres
      .map((tyre) => {
        const activeAssignment =
          tyreAssignments.find(
            (assignment) =>
              assignment.tyreId === tyre.id &&
              assignment.status === "active"
          );

        const truck = activeAssignment
          ? trucks.find(
              (item) =>
                item.id ===
                activeAssignment.truckId
            )
          : undefined;

        const lifeUsedPercentage =
          tyre.expectedLifeKm &&
          tyre.expectedLifeKm > 0
            ? Math.min(
                100,
                (tyre.currentMileageKm /
                  tyre.expectedLifeKm) *
                  100
              )
            : null;

        const remainingLifeKm =
          tyre.expectedLifeKm !== undefined
            ? Math.max(
                0,
                tyre.expectedLifeKm -
                  tyre.currentMileageKm
              )
            : null;

        return {
          tyre,
          activeAssignment,
          truck,
          lifeUsedPercentage,
          remainingLifeKm,
        };
      })
      .filter(({ tyre, truck }) => {
        const matchesSearch =
          !query ||
          [
            tyre.tyreNumber,
            tyre.brand,
            tyre.model,
            tyre.size,
            tyre.serialNumber,
            tyre.supplierName,
            truck?.registrationNumber,
            truck?.truckNumber,
          ]
            .filter(Boolean)
            .some((value) =>
              String(value)
                .toLowerCase()
                .includes(query)
            );

        const matchesStatus =
          statusFilter === "all" ||
          tyre.status === statusFilter;

        const matchesCondition =
          conditionFilter === "all" ||
          tyre.condition === conditionFilter;

        return (
          matchesSearch &&
          matchesStatus &&
          matchesCondition
        );
      })
      .sort((a, b) =>
        a.tyre.tyreNumber.localeCompare(
          b.tyre.tyreNumber
        )
      );
  }, [
    search,
    statusFilter,
    conditionFilter,
  ]);

  const totalInventoryValue =
    reportRows.reduce(
      (total, row) =>
        total + row.tyre.purchasePrice,
      0
    );

  const installedCount =
    reportRows.filter(
      ({ tyre }) =>
        tyre.status === "installed"
    ).length;

  const inStockCount =
    reportRows.filter(
      ({ tyre }) =>
        tyre.status === "in_stock"
    ).length;

  const attentionCount =
    reportRows.filter(
      ({ tyre, lifeUsedPercentage }) =>
        tyre.condition === "poor" ||
        tyre.condition === "damaged" ||
        tyre.status === "under_repair" ||
        tyre.status === "retired" ||
        (lifeUsedPercentage !== null &&
          lifeUsedPercentage >= 90)
    ).length;

  return (
    <div className="space-y-7">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-(--text)">
          Tyre Report
        </h2>

        <p className="mt-1 text-sm text-(--text-muted)">
          Review tyre inventory, condition,
          mileage, expected life and truck
          assignments.
        </p>
      </div>

      {/* Filters */}
      <section className="rounded-2xl border border-(--border) bg-white p-5">
        <div className="grid gap-4 md:grid-cols-3">
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
                placeholder="Tyre, brand, truck..."
                className={`${inputClass} pl-10`}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>
              Status
            </label>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target
                    .value as StatusFilter
                )
              }
              className={inputClass}
            >
              <option value="all">
                All Statuses
              </option>
              <option value="in_stock">
                In Stock
              </option>
              <option value="installed">
                Installed
              </option>
              <option value="under_repair">
                Under Repair
              </option>
              <option value="retired">
                Retired
              </option>
            </select>
          </div>

          <div>
            <label className={labelClass}>
              Condition
            </label>

            <select
              value={conditionFilter}
              onChange={(event) =>
                setConditionFilter(
                  event.target
                    .value as ConditionFilter
                )
              }
              className={inputClass}
            >
              <option value="all">
                All Conditions
              </option>
              <option value="new">New</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="poor">Poor</option>
              <option value="damaged">
                Damaged
              </option>
            </select>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Inventory Value"
          value={formatCurrency(
            totalInventoryValue
          )}
          subtitle={`${reportRows.length} tyres`}
          icon={CircleDollarSign}
        />

        <SummaryCard
          label="Installed"
          value={String(installedCount)}
          subtitle="Tyres currently installed"
          icon={Truck}
        />

        <SummaryCard
          label="In Stock"
          value={String(inStockCount)}
          subtitle="Available tyre inventory"
          icon={Package}
        />

        <SummaryCard
          label="Needs Attention"
          value={String(attentionCount)}
          subtitle="Condition / life alerts"
          icon={CircleGauge}
        />
      </section>

      {/* Info */}
      <section className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
        <p className="text-sm font-medium text-(--text)">
          Tyre life is calculated from current
          mileage and expected life.
        </p>

        <p className="mt-1 text-sm text-(--text-muted)">
          A tyre is flagged for attention when it
          is poor, damaged, under repair, retired,
          or has used at least 90% of its expected
          mileage.
        </p>
      </section>

      {/* Table */}
      <section className="rounded-2xl border border-(--border) bg-white">
        <div className="border-b border-(--border) px-5 py-4">
          <h3 className="font-semibold text-(--text)">
            Tyre Records
          </h3>

          <p className="mt-1 text-sm text-(--text-muted)">
            {reportRows.length} tyre
            {reportRows.length === 1
              ? ""
              : "s"}{" "}
            found.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1400px]">
            <thead>
              <tr className="border-b border-(--border) bg-slate-50">
                <TableHead>Tyre</TableHead>
                <TableHead>Brand / Size</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Truck</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Mileage</TableHead>
                <TableHead>Expected Life</TableHead>
                <TableHead>Life Used</TableHead>
                <TableHead>Remaining</TableHead>
                <TableHead>Purchase Price</TableHead>
              </tr>
            </thead>

            <tbody>
              {reportRows.map(
                ({
                  tyre,
                  activeAssignment,
                  truck,
                  lifeUsedPercentage,
                  remainingLifeKm,
                }) => (
                  <tr
                    key={tyre.id}
                    className="border-b border-(--border) last:border-0 hover:bg-slate-50/60"
                  >
                    <TableCell>
                      <div>
                        <p className="font-semibold text-(--text)">
                          {tyre.tyreNumber}
                        </p>

                        <p className="mt-1 text-xs text-(--text-muted)">
                          {tyre.serialNumber ??
                            "No serial number"}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div>
                        <p className="font-medium text-(--text)">
                          {tyre.brand}
                          {tyre.model
                            ? ` ${tyre.model}`
                            : ""}
                        </p>

                        <p className="mt-1 text-xs text-(--text-muted)">
                          {tyre.size}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell>
                      <StatusBadge
                        status={tyre.status}
                      />
                    </TableCell>

                    <TableCell>
                      <ConditionBadge
                        condition={
                          tyre.condition
                        }
                      />
                    </TableCell>

                    <TableCell>
                      {truck ? (
                        <Link
                          href={`/admin/trucks/${truck.id}`}
                          className="font-semibold text-(--primary) hover:underline"
                        >
                          {
                            truck.registrationNumber
                          }
                        </Link>
                      ) : (
                        "—"
                      )}
                    </TableCell>

                    <TableCell>
                      {activeAssignment
                        ? formatText(
                            activeAssignment.position
                          )
                        : "—"}
                    </TableCell>

                    <TableCell>
                      {formatNumber(
                        tyre.currentMileageKm
                      )}{" "}
                      km
                    </TableCell>

                    <TableCell>
                      {tyre.expectedLifeKm !==
                      undefined
                        ? `${formatNumber(
                            tyre.expectedLifeKm
                          )} km`
                        : "—"}
                    </TableCell>

                    <TableCell>
                      {lifeUsedPercentage !==
                      null ? (
                        <div className="min-w-[130px]">
                          <div className="mb-1 flex items-center justify-between text-xs">
                            <span>
                              {lifeUsedPercentage.toFixed(
                                1
                              )}
                              %
                            </span>
                          </div>

                          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full bg-(--primary)"
                              style={{
                                width: `${lifeUsedPercentage}%`,
                              }}
                            />
                          </div>
                        </div>
                      ) : (
                        "—"
                      )}
                    </TableCell>

                    <TableCell>
                      {remainingLifeKm !== null
                        ? `${formatNumber(
                            remainingLifeKm
                          )} km`
                        : "—"}
                    </TableCell>

                    <TableCell>
                      <span className="font-semibold text-(--text)">
                        {formatCurrency(
                          tyre.purchasePrice
                        )}
                      </span>
                    </TableCell>
                  </tr>
                )
              )}

              {reportRows.length === 0 && (
                <tr>
                  <td
                    colSpan={11}
                    className="px-5 py-12 text-center text-sm text-(--text-muted)"
                  >
                    No tyre records found for the
                    selected filters.
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

function StatusBadge({
  status,
}: {
  status:
    | "in_stock"
    | "installed"
    | "under_repair"
    | "retired";
}) {
  const styles = {
    in_stock:
      "bg-blue-50 text-blue-700",
    installed:
      "bg-green-50 text-green-700",
    under_repair:
      "bg-amber-50 text-amber-700",
    retired:
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

function ConditionBadge({
  condition,
}: {
  condition:
    | "new"
    | "good"
    | "fair"
    | "poor"
    | "damaged";
}) {
  const styles = {
    new: "bg-green-50 text-green-700",
    good: "bg-emerald-50 text-emerald-700",
    fair: "bg-blue-50 text-blue-700",
    poor: "bg-amber-50 text-amber-700",
    damaged: "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${styles[condition]}`}
    >
      {formatText(condition)}
    </span>
  );
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
  icon: typeof Package;
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

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat(
    "en-PK"
  ).format(value);
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