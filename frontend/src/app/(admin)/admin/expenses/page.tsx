"use client";

import { drivers } from "@/data/drivers";
import { fuelEntries } from "@/data/fuelEntries";
import { tripExpenses } from "@/data/tripExpenses";
import { trips } from "@/data/trips";
import { trucks } from "@/data/trucks";
import { TripExpenseCategory } from "@/types/tripExpense";
import {
  Banknote,
  Droplets,
  Fuel,
  Plus,
  ReceiptText,
  Search,
  Truck,
  WalletCards,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

const categoryLabels: Record<
  TripExpenseCategory,
  string
> = {
  toll: "Toll",
  food: "Food",
  loading: "Loading",
  unloading: "Unloading",
  parking: "Parking",
  repair: "Repair",
  permit: "Permit",
  other: "Other",
};

const categoryClasses: Record<
  TripExpenseCategory,
  string
> = {
  toll: "bg-blue-50 text-blue-700",
  food: "bg-orange-50 text-orange-700",
  loading: "bg-indigo-50 text-indigo-700",
  unloading: "bg-violet-50 text-violet-700",
  parking: "bg-slate-100 text-slate-700",
  repair: "bg-red-50 text-red-700",
  permit: "bg-amber-50 text-amber-700",
  other: "bg-gray-100 text-gray-700",
};

export default function FuelExpensesPage() {
  const [fuelSearch, setFuelSearch] =
    useState("");

  const [expenseSearch, setExpenseSearch] =
    useState("");

  const [expenseCategory, setExpenseCategory] =
    useState<TripExpenseCategory | "all">("all");

  const filteredFuelEntries = useMemo(() => {
    const query = fuelSearch
      .toLowerCase()
      .trim();

    if (!query) {
      return fuelEntries;
    }

    return fuelEntries.filter((entry) => {
      const truck = trucks.find(
        (item) => item.id === entry.truckId
      );

      const driver = drivers.find(
        (item) => item.id === entry.driverId
      );

      const trip = trips.find(
        (item) => item.id === entry.tripId
      );

      return [
        entry.fuelStation,
        entry.receiptNumber,
        truck?.registrationNumber,
        truck?.truckNumber,
        driver?.name,
        trip?.tripNumber,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value)
            .toLowerCase()
            .includes(query)
        );
    });
  }, [fuelSearch]);

  const filteredTripExpenses = useMemo(() => {
    const query = expenseSearch
      .toLowerCase()
      .trim();

    return tripExpenses.filter((expense) => {
      const truck = trucks.find(
        (item) => item.id === expense.truckId
      );

      const driver = drivers.find(
        (item) => item.id === expense.driverId
      );

      const trip = trips.find(
        (item) => item.id === expense.tripId
      );

      const matchesCategory =
        expenseCategory === "all" ||
        expense.category === expenseCategory;

      const matchesSearch =
        !query ||
        [
          categoryLabels[expense.category],
          expense.description,
          expense.receiptNumber,
          truck?.registrationNumber,
          truck?.truckNumber,
          driver?.name,
          trip?.tripNumber,
          trip?.origin,
          trip?.destination,
        ]
          .filter(Boolean)
          .some((value) =>
            String(value)
              .toLowerCase()
              .includes(query)
          );

      return (
        matchesCategory && matchesSearch
      );
    });
  }, [expenseSearch, expenseCategory]);

  const totalFuelCost = fuelEntries.reduce(
    (sum, entry) => sum + entry.totalAmount,
    0
  );

  const totalTripExpenses =
    tripExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

  const totalOperationalCost =
    totalFuelCost + totalTripExpenses;

  const totalLitres = fuelEntries.reduce(
    (sum, entry) => sum + entry.litres,
    0
  );

  const trucksWithFuel = new Set(
    fuelEntries.map((entry) => entry.truckId)
  ).size;

  return (
    <div className="space-y-6 sm:space-y-7">
      {/* Header */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h2 className="text-xl font-bold text-(--text) sm:text-2xl">
            Fuel & Expenses
          </h2>

          <p className="mt-1 text-sm text-(--text-muted)">
            Track fleet fuel consumption and trip
            operational expenses.
          </p>
        </div>

        <div className="grid w-full grid-cols-1 gap-3 sm:w-auto sm:grid-cols-2">
          <Link
            href="/admin/expenses/trip/add"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-(--border) bg-white px-4 py-2.5 text-sm font-semibold text-(--text) transition hover:bg-slate-50 sm:w-auto"
          >
            <Plus size={17} />
            Add Trip Expense
          </Link>

          <Link
            href="/admin/expenses/fuel/add"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-(--primary) px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-(--primary-dark) sm:w-auto"
          >
            <Plus size={17} />
            Add Fuel Entry
          </Link>
        </div>
      </div>

      {/* Summary */}
      <section className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 sm:gap-4 xl:grid-cols-4">
        <SummaryCard
          title="Total Fuel Cost"
          value={`PKR ${totalFuelCost.toLocaleString()}`}
          subtitle={`${totalLitres.toLocaleString()} litres`}
          icon={Fuel}
        />

        <SummaryCard
          title="Trip Expenses"
          value={`PKR ${totalTripExpenses.toLocaleString()}`}
          subtitle={`${tripExpenses.length} expense records`}
          icon={ReceiptText}
        />

        <SummaryCard
          title="Operational Cost"
          value={`PKR ${totalOperationalCost.toLocaleString()}`}
          subtitle="Fuel + trip expenses"
          icon={WalletCards}
        />

        <SummaryCard
          title="Trucks Fueled"
          value={String(trucksWithFuel)}
          subtitle="Unique trucks"
          icon={Truck}
        />
      </section>

      {/* Fuel Entries */}
      <section className="overflow-hidden rounded-2xl border border-(--border) bg-white">
        <div className="flex flex-col gap-4 border-b border-(--border) p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Droplets
                size={18}
                className="text-(--primary)"
              />

              <h3 className="font-semibold text-(--text)">
                Fuel Entries
              </h3>
            </div>

            <p className="mt-1 text-sm text-(--text-muted)">
              {filteredFuelEntries.length} fuel
              record
              {filteredFuelEntries.length === 1
                ? ""
                : "s"}{" "}
              found.
            </p>
          </div>

          <div className="relative w-full lg:w-80">
            <Search
              size={17}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--text-muted)"
            />

            <input
              type="text"
              value={fuelSearch}
              onChange={(event) =>
                setFuelSearch(
                  event.target.value
                )
              }
              placeholder="Search fuel records..."
              className="w-full rounded-xl border border-(--border) bg-white py-2.5 pl-10 pr-4 text-sm text-(--text) outline-none transition focus:border-(--primary)"
            />
          </div>
        </div>

        {/* Mobile Fuel Cards */}
        <div className="divide-y divide-(--border) md:hidden">
          {filteredFuelEntries.map((entry) => {
            const truck = trucks.find(
              (item) =>
                item.id === entry.truckId
            );

            const driver = drivers.find(
              (item) =>
                item.id === entry.driverId
            );

            const trip = trips.find(
              (item) =>
                item.id === entry.tripId
            );

            return (
              <div
                key={entry.id}
                className="p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="break-words font-semibold text-(--text)">
                      {entry.fuelStation}
                    </p>

                    <p className="mt-1 text-xs text-(--text-muted)">
                      {entry.fuelDate}
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-(--primary)">
                    {entry.litres.toLocaleString()}{" "}
                    L
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4">
                  <MobileInfo
                    label="Truck"
                    value={
                      truck?.registrationNumber ??
                      "Unknown"
                    }
                  />

                  <MobileInfo
                    label="Driver"
                    value={
                      driver?.name ??
                      "No driver"
                    }
                  />

                  <MobileInfo
                    label="Price / L"
                    value={`PKR ${entry.pricePerLitre.toLocaleString()}`}
                  />

                  <MobileInfo
                    label="Odometer"
                    value={`${entry.odometerKm.toLocaleString()} km`}
                  />

                  <MobileInfo
                    label="Trip"
                    value={
                      trip?.tripNumber ??
                      "No trip"
                    }
                  />

                  <MobileInfo
                    label="Receipt"
                    value={
                      entry.receiptNumber ??
                      "—"
                    }
                  />
                </div>

                <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-3">
                  <span className="text-sm text-(--text-muted)">
                    Total Fuel Cost
                  </span>

                  <span className="text-right font-bold text-(--text)">
                    PKR{" "}
                    {entry.totalAmount.toLocaleString()}
                  </span>
                </div>

                {(truck || trip) && (
                  <div className="mt-3 flex gap-2">
                    {truck && (
                      <Link
                        href={`/admin/trucks/${truck.id}`}
                        className="flex-1 rounded-xl border border-(--border) px-3 py-2.5 text-center text-sm font-semibold text-(--primary) transition hover:bg-blue-50"
                      >
                        View Truck
                      </Link>
                    )}

                    {trip && (
                      <Link
                        href={`/admin/trips/${trip.id}`}
                        className="flex-1 rounded-xl border border-(--border) px-3 py-2.5 text-center text-sm font-semibold text-(--primary) transition hover:bg-blue-50"
                      >
                        View Trip
                      </Link>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {filteredFuelEntries.length ===
            0 && (
            <EmptyState
              icon={Fuel}
              message="No fuel records found."
            />
          )}
        </div>

        {/* Desktop Fuel Table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[1050px]">
            <thead>
              <tr className="border-b border-(--border) bg-slate-50">
                <TableHead>Date</TableHead>
                <TableHead>Truck</TableHead>
                <TableHead>
                  Driver / Trip
                </TableHead>
                <TableHead>
                  Fuel Station
                </TableHead>
                <TableHead>Litres</TableHead>
                <TableHead>Price / L</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Odometer</TableHead>
                <TableHead>Receipt</TableHead>
              </tr>
            </thead>

            <tbody>
              {filteredFuelEntries.map(
                (entry) => {
                  const truck = trucks.find(
                    (item) =>
                      item.id === entry.truckId
                  );

                  const driver = drivers.find(
                    (item) =>
                      item.id === entry.driverId
                  );

                  const trip = trips.find(
                    (item) =>
                      item.id === entry.tripId
                  );

                  return (
                    <tr
                      key={entry.id}
                      className="border-b border-(--border) last:border-0 hover:bg-slate-50/60"
                    >
                      <TableCell>
                        {entry.fuelDate}
                      </TableCell>

                      <TableCell>
                        {truck ? (
                          <Link
                            href={`/admin/trucks/${truck.id}`}
                            className="font-semibold text-(--text) hover:text-(--primary)"
                          >
                            {
                              truck.registrationNumber
                            }
                          </Link>
                        ) : (
                          "Unknown"
                        )}

                        {truck?.truckNumber && (
                          <p className="mt-1 text-xs text-(--text-muted)">
                            {
                              truck.truckNumber
                            }
                          </p>
                        )}
                      </TableCell>

                      <TableCell>
                        <p className="font-medium text-(--text)">
                          {driver?.name ??
                            "No driver"}
                        </p>

                        {trip ? (
                          <Link
                            href={`/admin/trips/${trip.id}`}
                            className="mt-1 inline-block text-xs font-medium text-(--primary) hover:underline"
                          >
                            {trip.tripNumber}
                          </Link>
                        ) : (
                          <p className="mt-1 text-xs text-(--text-muted)">
                            No trip
                          </p>
                        )}
                      </TableCell>

                      <TableCell>
                        {entry.fuelStation}
                      </TableCell>

                      <TableCell>
                        {entry.litres.toLocaleString()}{" "}
                        L
                      </TableCell>

                      <TableCell>
                        PKR{" "}
                        {entry.pricePerLitre.toLocaleString()}
                      </TableCell>

                      <TableCell>
                        <span className="font-semibold text-(--text)">
                          PKR{" "}
                          {entry.totalAmount.toLocaleString()}
                        </span>
                      </TableCell>

                      <TableCell>
                        {entry.odometerKm.toLocaleString()}{" "}
                        km
                      </TableCell>

                      <TableCell>
                        {entry.receiptNumber ??
                          "—"}
                      </TableCell>
                    </tr>
                  );
                }
              )}

              {filteredFuelEntries.length ===
                0 && (
                <tr>
                  <td
                    colSpan={9}
                    className="px-5 py-12 text-center text-sm text-(--text-muted)"
                  >
                    No fuel records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Trip Expenses */}
      <section className="overflow-hidden rounded-2xl border border-(--border) bg-white">
        <div className="border-b border-(--border) p-4 sm:p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Banknote
                  size={18}
                  className="text-(--primary)"
                />

                <h3 className="font-semibold text-(--text)">
                  Trip Expenses
                </h3>
              </div>

              <p className="mt-1 text-sm text-(--text-muted)">
                {filteredTripExpenses.length}{" "}
                expense record
                {filteredTripExpenses.length ===
                1
                  ? ""
                  : "s"}{" "}
                found.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row xl:w-auto">
              <div className="relative w-full xl:w-72">
                <Search
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--text-muted)"
                />

                <input
                  type="text"
                  value={expenseSearch}
                  onChange={(event) =>
                    setExpenseSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search trip expenses..."
                  className="w-full rounded-xl border border-(--border) bg-white py-2.5 pl-10 pr-4 text-sm text-(--text) outline-none transition focus:border-(--primary)"
                />
              </div>

              <select
                value={expenseCategory}
                onChange={(event) =>
                  setExpenseCategory(
                    event.target.value as
                      | TripExpenseCategory
                      | "all"
                  )
                }
                className="w-full rounded-xl border border-(--border) bg-white px-4 py-2.5 text-sm text-(--text) outline-none focus:border-(--primary) sm:w-auto"
              >
                <option value="all">
                  All Categories
                </option>

                {Object.entries(
                  categoryLabels
                ).map(([value, label]) => (
                  <option
                    key={value}
                    value={value}
                  >
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Mobile Trip Expense Cards */}
        <div className="divide-y divide-(--border) md:hidden">
          {filteredTripExpenses.map(
            (expense) => {
              const trip = trips.find(
                (item) =>
                  item.id === expense.tripId
              );

              const truck = trucks.find(
                (item) =>
                  item.id === expense.truckId
              );

              const driver = drivers.find(
                (item) =>
                  item.id === expense.driverId
              );

              return (
                <div
                  key={expense.id}
                  className="p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      {trip ? (
                        <>
                          <Link
                            href={`/admin/trips/${trip.id}`}
                            className="font-semibold text-(--primary)"
                          >
                            {trip.tripNumber}
                          </Link>

                          <p className="mt-1 break-words text-xs text-(--text-muted)">
                            {trip.origin} →{" "}
                            {trip.destination}
                          </p>
                        </>
                      ) : (
                        <p className="font-semibold text-(--text)">
                          Unknown Trip
                        </p>
                      )}
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                        categoryClasses[
                          expense.category
                        ]
                      }`}
                    >
                      {
                        categoryLabels[
                          expense.category
                        ]
                      }
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4">
                    <MobileInfo
                      label="Date"
                      value={
                        expense.expenseDate
                      }
                    />

                    <MobileInfo
                      label="Truck"
                      value={
                        truck?.registrationNumber ??
                        "Unknown"
                      }
                    />

                    <MobileInfo
                      label="Driver"
                      value={
                        driver?.name ??
                        "No driver"
                      }
                    />

                    <MobileInfo
                      label="Receipt"
                      value={
                        expense.receiptNumber ??
                        "—"
                      }
                    />
                  </div>

                  {expense.description && (
                    <div className="mt-4 rounded-xl bg-slate-50 p-3">
                      <p className="text-xs font-medium uppercase tracking-wide text-(--text-muted)">
                        Description
                      </p>

                      <p className="mt-1 break-words text-sm text-(--text)">
                        {expense.description}
                      </p>
                    </div>
                  )}

                  <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-(--border) p-3">
                    <span className="text-sm text-(--text-muted)">
                      Expense Amount
                    </span>

                    <span className="text-right font-bold text-(--text)">
                      PKR{" "}
                      {expense.amount.toLocaleString()}
                    </span>
                  </div>

                  {(trip || truck) && (
                    <div className="mt-3 flex gap-2">
                      {trip && (
                        <Link
                          href={`/admin/trips/${trip.id}`}
                          className="flex-1 rounded-xl border border-(--border) px-3 py-2.5 text-center text-sm font-semibold text-(--primary) transition hover:bg-blue-50"
                        >
                          View Trip
                        </Link>
                      )}

                      {truck && (
                        <Link
                          href={`/admin/trucks/${truck.id}`}
                          className="flex-1 rounded-xl border border-(--border) px-3 py-2.5 text-center text-sm font-semibold text-(--primary) transition hover:bg-blue-50"
                        >
                          View Truck
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              );
            }
          )}

          {filteredTripExpenses.length ===
            0 && (
            <EmptyState
              icon={ReceiptText}
              message="No trip expenses found."
            />
          )}
        </div>

        {/* Desktop Trip Expense Table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[1050px]">
            <thead>
              <tr className="border-b border-(--border) bg-slate-50">
                <TableHead>Date</TableHead>
                <TableHead>Trip</TableHead>
                <TableHead>Truck</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>
                  Description
                </TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Receipt</TableHead>
              </tr>
            </thead>

            <tbody>
              {filteredTripExpenses.map(
                (expense) => {
                  const trip = trips.find(
                    (item) =>
                      item.id === expense.tripId
                  );

                  const truck = trucks.find(
                    (item) =>
                      item.id ===
                      expense.truckId
                  );

                  const driver = drivers.find(
                    (item) =>
                      item.id ===
                      expense.driverId
                  );

                  return (
                    <tr
                      key={expense.id}
                      className="border-b border-(--border) last:border-0 hover:bg-slate-50/60"
                    >
                      <TableCell>
                        {expense.expenseDate}
                      </TableCell>

                      <TableCell>
                        {trip ? (
                          <>
                            <Link
                              href={`/admin/trips/${trip.id}`}
                              className="font-semibold text-(--primary) hover:underline"
                            >
                              {trip.tripNumber}
                            </Link>

                            <p className="mt-1 text-xs text-(--text-muted)">
                              {trip.origin} →{" "}
                              {trip.destination}
                            </p>
                          </>
                        ) : (
                          "Unknown"
                        )}
                      </TableCell>

                      <TableCell>
                        {truck ? (
                          <Link
                            href={`/admin/trucks/${truck.id}`}
                            className="font-semibold text-(--text) hover:text-(--primary)"
                          >
                            {
                              truck.registrationNumber
                            }
                          </Link>
                        ) : (
                          "Unknown"
                        )}
                      </TableCell>

                      <TableCell>
                        {driver?.name ??
                          "No driver"}
                      </TableCell>

                      <TableCell>
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            categoryClasses[
                              expense.category
                            ]
                          }`}
                        >
                          {
                            categoryLabels[
                              expense.category
                            ]
                          }
                        </span>
                      </TableCell>

                      <TableCell>
                        <p className="max-w-xs">
                          {expense.description ??
                            "—"}
                        </p>
                      </TableCell>

                      <TableCell>
                        <span className="font-semibold text-(--text)">
                          PKR{" "}
                          {expense.amount.toLocaleString()}
                        </span>
                      </TableCell>

                      <TableCell>
                        {expense.receiptNumber ??
                          "—"}
                      </TableCell>
                    </tr>
                  );
                }
              )}

              {filteredTripExpenses.length ===
                0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-12 text-center text-sm text-(--text-muted)"
                  >
                    No trip expenses found.
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

function EmptyState({
  icon: Icon,
  message,
}: {
  icon: typeof Fuel;
  message: string;
}) {
  return (
    <div className="px-4 py-10 text-center">
      <Icon
        size={28}
        className="mx-auto text-(--text-muted)"
      />

      <p className="mt-3 text-sm text-(--text-muted)">
        {message}
      </p>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  subtitle,
  icon: Icon,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: typeof Fuel;
}) {
  return (
    <div className="min-w-0 rounded-2xl border border-(--border) bg-white p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
          <p className="text-xs font-medium text-(--text-muted) sm:text-sm">
            {title}
          </p>

          <p className="mt-2 break-words text-lg font-bold text-(--text) sm:text-xl">
            {value}
          </p>

          <p className="mt-1 text-xs text-(--text-muted)">
            {subtitle}
          </p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-(--primary) sm:h-11 sm:w-11">
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