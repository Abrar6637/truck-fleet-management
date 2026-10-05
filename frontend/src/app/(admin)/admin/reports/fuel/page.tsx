"use client";

import { fuelEntries } from "@/data/fuelEntries";
import { trucks } from "@/data/trucks";
import { drivers } from "@/data/drivers";
import {
  exportReportToExcel,
  exportReportToPDF,
} from "@/lib/reportExport";
import {
  Banknote,
   Download,
  Droplets,
  FileSpreadsheet,
  Fuel,
  Search,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

export default function FuelReportPage() {
  const [search, setSearch] = useState("");
  const [truckFilter, setTruckFilter] = useState("all");

  const [startDate, setStartDate] =
    useState("2026-09-01");

  const [endDate, setEndDate] =
    useState("2026-10-31");

  const invalidRange =
    Boolean(startDate) &&
    Boolean(endDate) &&
    startDate > endDate;

  const filteredEntries = useMemo(() => {
    if (invalidRange) {
      return [];
    }

    const query = search.trim().toLowerCase();

    return fuelEntries
      .filter((entry) => {
        const truck = trucks.find(
          (item) => item.id === entry.truckId
        );

        const driver = drivers.find(
          (item) => item.id === entry.driverId
        );

        const matchesSearch =
          !query ||
          [
            entry.fuelStation,
            entry.receiptNumber,
            truck?.registrationNumber,
            truck?.truckNumber,
            driver?.name,
          ]
            .filter(Boolean)
            .some((value) =>
              String(value)
                .toLowerCase()
                .includes(query)
            );

        const matchesTruck =
          truckFilter === "all" ||
          entry.truckId === Number(truckFilter);

        const matchesStart =
          !startDate ||
          entry.fuelDate >= startDate;

        const matchesEnd =
          !endDate ||
          entry.fuelDate <= endDate;

        return (
          matchesSearch &&
          matchesTruck &&
          matchesStart &&
          matchesEnd
        );
      })
      .sort(
        (a, b) =>
          new Date(b.fuelDate).getTime() -
          new Date(a.fuelDate).getTime()
      );
  }, [
    search,
    truckFilter,
    startDate,
    endDate,
    invalidRange,
  ]);

  const totalLitres = filteredEntries.reduce(
    (total, entry) => total + entry.litres,
    0
  );

  const totalFuelCost = filteredEntries.reduce(
    (total, entry) => total + entry.totalAmount,
    0
  );

  const averagePricePerLitre =
    totalLitres > 0
      ? totalFuelCost / totalLitres
      : 0;

  const trucksUsed = new Set(
    filteredEntries.map((entry) => entry.truckId)
  ).size;

  const exportColumns = [
  {
    header: "Date",
    value: (entry: (typeof fuelEntries)[number]) =>
      formatDate(entry.fuelDate),
  },
  {
    header: "Truck",
    value: (entry: (typeof fuelEntries)[number]) =>
      trucks.find(
        (truck) => truck.id === entry.truckId
      )?.registrationNumber ?? "—",
  },
  {
    header: "Driver",
    value: (entry: (typeof fuelEntries)[number]) =>
      drivers.find(
        (driver) => driver.id === entry.driverId
      )?.name ?? "—",
  },
  {
    header: "Fuel Station",
    value: (entry: (typeof fuelEntries)[number]) =>
      entry.fuelStation,
  },
  {
    header: "Litres",
    value: (entry: (typeof fuelEntries)[number]) =>
      entry.litres,
  },
  {
    header: "Price / Litre (PKR)",
    value: (entry: (typeof fuelEntries)[number]) =>
      entry.pricePerLitre,
  },
  {
    header: "Total Amount (PKR)",
    value: (entry: (typeof fuelEntries)[number]) =>
      entry.totalAmount,
  },
  {
    header: "Odometer (km)",
    value: (entry: (typeof fuelEntries)[number]) =>
      entry.odometerKm,
  },
  {
    header: "Receipt",
    value: (entry: (typeof fuelEntries)[number]) =>
      entry.receiptNumber ?? "—",
  },
];

const exportSummary = [
  {
    label: "Total Fuel",
    value: formatLitres(totalLitres),
  },
  {
    label: "Fuel Cost",
    value: formatCurrency(totalFuelCost),
  },
  {
    label: "Average Price",
    value: `${formatCurrency(
      averagePricePerLitre
    )} / L`,
  },
  {
    label: "Trucks Fueled",
    value: trucksUsed,
  },
];

function handlePDFExport() {
  exportReportToPDF({
    title: "Fuel Report",
    fileName: "fuel-report",
    columns: exportColumns,
    rows: filteredEntries,
    summary: exportSummary,
  });
}

function handleExcelExport() {
  exportReportToExcel({
    title: "Fuel Report",
    fileName: "fuel-report",
    columns: exportColumns,
    rows: filteredEntries,
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
      Fuel Report
    </h2>

    <p className="mt-1 text-sm text-(--text-muted)">
      Analyze fleet fuel quantity, fuel costs,
      stations and truck-wise fuel usage.
    </p>
  </div>

  <div className="flex flex-wrap gap-3">
    <button
      type="button"
      onClick={handlePDFExport}
      disabled={filteredEntries.length === 0}
      className="inline-flex items-center gap-2 rounded-xl bg-(--primary) px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-(--primary-dark) disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Download size={17} />
      Download PDF
    </button>

    <button
      type="button"
      onClick={handleExcelExport}
      disabled={filteredEntries.length === 0}
      className="inline-flex items-center gap-2 rounded-xl border border-(--border) bg-white px-4 py-2.5 text-sm font-semibold text-(--text) transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <FileSpreadsheet size={17} />
      Export Excel
    </button>
  </div>
</div>

      {/* Filters */}
      <section className="rounded-2xl border border-(--border) bg-white p-5">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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
                placeholder="Station, truck, driver..."
                className={`${inputClass} pl-10`}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>
              Truck
            </label>

            <select
              value={truckFilter}
              onChange={(event) =>
                setTruckFilter(event.target.value)
              }
              className={inputClass}
            >
              <option value="all">
                All Trucks
              </option>

              {trucks.map((truck) => (
                <option
                  key={truck.id}
                  value={truck.id}
                >
                  {truck.registrationNumber}
                  {truck.truckNumber
                    ? ` • ${truck.truckNumber}`
                    : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>
              From
            </label>

            <input
              type="date"
              value={startDate}
              onChange={(event) =>
                setStartDate(event.target.value)
              }
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              To
            </label>

            <input
              type="date"
              value={endDate}
              onChange={(event) =>
                setEndDate(event.target.value)
              }
              className={inputClass}
            />
          </div>
        </div>

        {invalidRange && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-(--danger)">
            Start date cannot be after end date.
          </div>
        )}
      </section>

      {/* Summary */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Total Fuel"
          value={formatLitres(totalLitres)}
          subtitle={`${filteredEntries.length} fuel entries`}
          icon={Fuel}
        />

        <SummaryCard
          label="Fuel Cost"
          value={formatCurrency(totalFuelCost)}
          subtitle="Total fuel spending"
          icon={Banknote}
        />

        <SummaryCard
          label="Average Price"
          value={`${formatCurrency(
            averagePricePerLitre
          )} / L`}
          subtitle="Average cost per litre"
          icon={Droplets}
        />

        <SummaryCard
          label="Trucks Fueled"
          value={String(trucksUsed)}
          subtitle="Unique trucks in results"
          icon={Truck}
        />
      </section>

      {/* Table */}
      <section className="rounded-2xl border border-(--border) bg-white">
        <div className="border-b border-(--border) px-5 py-4">
          <h3 className="font-semibold text-(--text)">
            Fuel Records
          </h3>

          <p className="mt-1 text-sm text-(--text-muted)">
            {filteredEntries.length} fuel entr
            {filteredEntries.length === 1
              ? "y"
              : "ies"}{" "}
            found.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1250px]">
            <thead>
              <tr className="border-b border-(--border) bg-slate-50">
                <TableHead>Date</TableHead>
                <TableHead>Truck</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Fuel Station</TableHead>
                <TableHead>Litres</TableHead>
                <TableHead>Price / Litre</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Odometer</TableHead>
                <TableHead>Receipt</TableHead>
              </tr>
            </thead>

            <tbody>
              {filteredEntries.map((entry) => {
                const truck = trucks.find(
                  (item) =>
                    item.id === entry.truckId
                );

                const driver = drivers.find(
                  (item) =>
                    item.id === entry.driverId
                );

                return (
                  <tr
                    key={entry.id}
                    className="border-b border-(--border) last:border-0 hover:bg-slate-50/60"
                  >
                    <TableCell>
                      {formatDate(entry.fuelDate)}
                    </TableCell>

                    <TableCell>
                      {truck ? (
                        <Link
                          href={`/admin/trucks/${truck.id}`}
                          className="font-semibold text-(--primary) hover:underline"
                        >
                          {truck.registrationNumber}
                        </Link>
                      ) : (
                        "—"
                      )}
                    </TableCell>

                    <TableCell>
                      {driver ? (
                        <Link
                          href={`/admin/drivers/${driver.id}`}
                          className="font-medium text-(--primary) hover:underline"
                        >
                          {driver.name}
                        </Link>
                      ) : (
                        "—"
                      )}
                    </TableCell>

                    <TableCell>
                      {entry.fuelStation}
                    </TableCell>

                    <TableCell>
                      {formatLitres(entry.litres)}
                    </TableCell>

                    <TableCell>
                      {formatCurrency(
                        entry.pricePerLitre
                      )}
                    </TableCell>

                    <TableCell>
                      <span className="font-semibold text-(--text)">
                        {formatCurrency(
                          entry.totalAmount
                        )}
                      </span>
                    </TableCell>

                    <TableCell>
                      {entry.odometerKm.toLocaleString(
                        "en-PK"
                      )}{" "}
                      km
                    </TableCell>

                    <TableCell>
                      {entry.receiptNumber ?? "—"}
                    </TableCell>
                  </tr>
                );
              })}

              {filteredEntries.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    className="px-5 py-12 text-center text-sm text-(--text-muted)"
                  >
                    No fuel records found for the
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

function SummaryCard({
  label,
  value,
  subtitle,
  icon: Icon,
}: {
  label: string;
  value: string;
  subtitle: string;
  icon: typeof Fuel;
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

function formatLitres(value: number) {
  return `${value.toLocaleString("en-PK", {
    maximumFractionDigits: 2,
  })} L`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(
    new Date(`${value}T00:00:00`)
  );
}

const labelClass =
  "mb-2 block text-sm font-medium text-(--text)";

const inputClass =
  "w-full rounded-xl border border-(--border) bg-white px-4 py-2.5 text-sm text-(--text) outline-none transition focus:border-(--primary)";