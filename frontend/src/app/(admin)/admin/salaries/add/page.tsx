"use client";

import { driverSalaries } from "@/data/driverSalaries";
import { drivers } from "@/data/drivers";
import {
  ArrowLeft,
  Banknote,
  Calculator,
  CalendarDays,
  UserRound,
  WalletCards,
} from "lucide-react";
import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

export default function CreateSalaryPage() {
  const [driverId, setDriverId] = useState("");
  const [salaryMonth, setSalaryMonth] = useState("");

  const [basicSalary, setBasicSalary] = useState("");
  const [tripAllowance, setTripAllowance] =
    useState("0");
  const [bonus, setBonus] = useState("0");
  const [deductions, setDeductions] = useState("0");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const selectedDriver = useMemo(
    () =>
      drivers.find(
        (driver) => driver.id === Number(driverId)
      ),
    [driverId]
  );

  const grossSalary =
    Math.max(0, Number(basicSalary) || 0) +
    Math.max(0, Number(tripAllowance) || 0) +
    Math.max(0, Number(bonus) || 0);

  const netSalary = Math.max(
    0,
    grossSalary -
      Math.max(0, Number(deductions) || 0)
  );

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!selectedDriver) {
      setError("Please select a driver.");
      return;
    }

    if (!salaryMonth) {
      setError("Please select the salary month.");
      return;
    }

    const basic = Number(basicSalary);
    const allowance = Number(tripAllowance);
    const salaryBonus = Number(bonus);
    const salaryDeductions = Number(deductions);

    if (!Number.isFinite(basic) || basic <= 0) {
      setError(
        "Basic salary must be greater than zero."
      );
      return;
    }

    if (
      allowance < 0 ||
      salaryBonus < 0 ||
      salaryDeductions < 0
    ) {
      setError(
        "Allowance, bonus and deductions cannot be negative."
      );
      return;
    }

    if (salaryDeductions > grossSalary) {
      setError(
        "Deductions cannot exceed the gross salary."
      );
      return;
    }

    const duplicateSalary = driverSalaries.some(
      (salary) =>
        salary.driverId === selectedDriver.id &&
        salary.salaryMonth === salaryMonth
    );

    if (duplicateSalary) {
      setError(
        `${selectedDriver.name} already has a salary record for ${formatSalaryMonth(
          salaryMonth
        )}.`
      );
      return;
    }

    setSuccess(
      `${formatSalaryMonth(
        salaryMonth
      )} salary for ${
        selectedDriver.name
      } is valid and ready to save. Net salary: ${formatCurrency(
        netSalary
      )}. It will be stored when the Laravel API is connected.`
    );
  };

  return (
    <div className="space-y-7">
      {/* Header */}
      <div>
        <Link
          href="/admin/salaries"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-(--text-muted) transition hover:text-(--primary)"
        >
          <ArrowLeft size={17} />
          Back to Salaries
        </Link>

        <h2 className="text-2xl font-bold text-(--text)">
          Create Monthly Salary
        </h2>

        <p className="mt-1 text-sm text-(--text-muted)">
          Create a monthly salary record for a
          driver.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Driver & Month */}
        <FormSection
          title="Salary Period"
          description="Select the driver and salary month."
          icon={<CalendarDays size={19} />}
        >
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Driver" required>
              <select
                value={driverId}
                onChange={(event) => {
                  setDriverId(event.target.value);
                  setError("");
                  setSuccess("");
                }}
                className={inputClass}
              >
                <option value="">
                  Select driver
                </option>

                {drivers.map((driver) => (
                  <option
                    key={driver.id}
                    value={driver.id}
                  >
                    {driver.name} — {driver.phone}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Salary Month" required>
              <input
                type="month"
                value={salaryMonth}
                onChange={(event) => {
                  setSalaryMonth(event.target.value);
                  setError("");
                  setSuccess("");
                }}
                className={inputClass}
              />
            </Field>
          </div>

          {selectedDriver && (
            <div className="mt-5 flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-(--primary)">
                <UserRound size={18} />
              </div>

              <div>
                <p className="font-semibold text-(--text)">
                  {selectedDriver.name}
                </p>

                <p className="mt-0.5 text-sm text-(--text-muted)">
                  {selectedDriver.phone} •{" "}
                  {formatStatus(selectedDriver.status)}
                </p>
              </div>
            </div>
          )}
        </FormSection>

        {/* Salary Components */}
        <FormSection
          title="Salary Components"
          description="Enter basic salary, allowances, bonus and deductions."
          icon={<Banknote size={19} />}
        >
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Basic Salary" required>
              <input
                type="number"
                min="1"
                step="1"
                value={basicSalary}
                onChange={(event) =>
                  setBasicSalary(event.target.value)
                }
                placeholder="e.g. 55000"
                className={inputClass}
              />
            </Field>

            <Field label="Trip Allowance">
              <input
                type="number"
                min="0"
                step="1"
                value={tripAllowance}
                onChange={(event) =>
                  setTripAllowance(event.target.value)
                }
                className={inputClass}
              />
            </Field>

            <Field label="Bonus">
              <input
                type="number"
                min="0"
                step="1"
                value={bonus}
                onChange={(event) =>
                  setBonus(event.target.value)
                }
                className={inputClass}
              />
            </Field>

            <Field label="Deductions">
              <input
                type="number"
                min="0"
                step="1"
                value={deductions}
                onChange={(event) =>
                  setDeductions(event.target.value)
                }
                className={inputClass}
              />
            </Field>
          </div>
        </FormSection>

        {/* Calculation */}
        <FormSection
          title="Salary Calculation"
          description="Calculated automatically from the salary components."
          icon={<Calculator size={19} />}
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <CalculationItem
              label="Basic Salary"
              value={Number(basicSalary) || 0}
            />

            <CalculationItem
              label="Trip Allowance"
              value={Number(tripAllowance) || 0}
            />

            <CalculationItem
              label="Bonus"
              value={Number(bonus) || 0}
            />

            <CalculationItem
              label="Gross Salary"
              value={grossSalary}
              strong
            />

            <CalculationItem
              label="Deductions"
              value={Number(deductions) || 0}
            />

            <CalculationItem
              label="Net Salary"
              value={netSalary}
              strong
            />
          </div>
        </FormSection>

        {/* Notes */}
        <FormSection
          title="Notes"
          description="Add optional information about this salary record."
          icon={<WalletCards size={19} />}
        >
          <Field label="Notes">
            <textarea
              name="notes"
              rows={4}
              placeholder="Optional salary notes..."
              className={inputClass}
            />
          </Field>
        </FormSection>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-(--danger)">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700">
            {success}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap justify-end gap-3">
          <Link
            href="/admin/salaries"
            className="rounded-xl border border-(--border) bg-white px-5 py-2.5 text-sm font-semibold text-(--text) transition hover:bg-slate-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-(--primary) px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-(--primary-dark)"
          >
            <Banknote size={17} />
            Create Salary
          </button>
        </div>
      </form>
    </div>
  );
}

function FormSection({
  title,
  description,
  icon,
  children,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-(--border) bg-white">
      <div className="flex items-start gap-3 border-b border-(--border) px-6 py-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-(--primary)">
          {icon}
        </div>

        <div>
          <h3 className="font-semibold text-(--text)">
            {title}
          </h3>

          <p className="mt-1 text-sm text-(--text-muted)">
            {description}
          </p>
        </div>
      </div>

      <div className="p-6">{children}</div>
    </section>
  );
}

function Field({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-(--text)">
        {label}

        {required && (
          <span className="ml-1 text-(--danger)">
            *
          </span>
        )}
      </span>

      {children}
    </label>
  );
}

function CalculationItem({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: number;
  strong?: boolean;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-sm text-(--text-muted)">
        {label}
      </p>

      <p
        className={`mt-1 text-(--text) ${
          strong
            ? "text-lg font-bold"
            : "font-semibold"
        }`}
      >
        {formatCurrency(value)}
      </p>
    </div>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatSalaryMonth(month: string) {
  const [year, monthNumber] = month.split("-");

  return new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
  }).format(
    new Date(
      Number(year),
      Number(monthNumber) - 1,
      1
    )
  );
}

function formatStatus(status: string) {
  return status
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");
}

const inputClass =
  "w-full rounded-xl border border-(--border) bg-white px-4 py-3 text-sm text-(--text) outline-none transition placeholder:text-slate-400 focus:border-(--primary)";