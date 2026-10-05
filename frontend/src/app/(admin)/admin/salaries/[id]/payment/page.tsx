"use client";

import {
  driverSalaries,
  driverSalaryPayments,
} from "@/data/driverSalaries";
import { drivers } from "@/data/drivers";
import { calculateDriverSalary } from "@/lib/driverSalary";
import { SalaryPaymentMethod } from "@/types/driverSalary";
import {
  ArrowLeft,
  Banknote,
  CalendarDays,
  CreditCard,
  ReceiptText,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";

const paymentMethods: {
  value: SalaryPaymentMethod;
  label: string;
}[] = [
  { value: "cash", label: "Cash" },
  {
    value: "bank_transfer",
    label: "Bank Transfer",
  },
  { value: "jazzcash", label: "JazzCash" },
  { value: "easypaisa", label: "Easypaisa" },
  { value: "other", label: "Other" },
];

export default function RecordSalaryPaymentPage() {
  const params = useParams<{ id: string }>();

  const salaryId = Number(params.id);

  const salary = useMemo(
    () =>
      driverSalaries.find(
        (item) => item.id === salaryId
      ),
    [salaryId]
  );

  const driver = useMemo(
    () =>
      salary
        ? drivers.find(
            (item) =>
              item.id === salary.driverId
          )
        : undefined,
    [salary]
  );

  const summary = useMemo(
    () =>
      salary
        ? calculateDriverSalary(
            salary,
            driverSalaryPayments
          )
        : null,
    [salary]
  );

  const [amount, setAmount] = useState("");
  const [paymentDate, setPaymentDate] =
    useState("");
  const [paymentMethod, setPaymentMethod] =
    useState<SalaryPaymentMethod>("cash");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!salary || !summary) {
    return (
      <div className="rounded-2xl border border-(--border) bg-white p-8">
        <h2 className="text-xl font-bold text-(--text)">
          Salary record not found
        </h2>

        <Link
          href="/admin/salaries"
          className="mt-4 inline-flex text-sm font-semibold text-(--primary)"
        >
          Back to Salaries
        </Link>
      </div>
    );
  }

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const paymentAmount = Number(amount);

    if (summary.remainingAmount <= 0) {
      setError(
        "This salary has already been fully paid."
      );
      return;
    }

    if (
      !Number.isFinite(paymentAmount) ||
      paymentAmount <= 0
    ) {
      setError(
        "Please enter a valid payment amount."
      );
      return;
    }

    if (
      paymentAmount >
      summary.remainingAmount
    ) {
      setError(
        `Payment cannot exceed the remaining balance of ${formatCurrency(
          summary.remainingAmount
        )}.`
      );
      return;
    }

    if (!paymentDate) {
      setError(
        "Please select the payment date."
      );
      return;
    }

    const formData = new FormData(
      event.currentTarget
    );

    const referenceNumber = String(
      formData.get("referenceNumber") ?? ""
    ).trim();

    setSuccess(
      `${formatCurrency(
        paymentAmount
      )} payment for ${
        driver?.name ?? "driver"
      } is valid and ready to save. It will be stored when the Laravel API is connected.${
        referenceNumber
          ? ` Reference: ${referenceNumber}.`
          : ""
      }`
    );
  };

  return (
    <div className="space-y-7">
      {/* Header */}
      <div>
        <Link
          href={`/admin/salaries/${salary.id}`}
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-(--text-muted) transition hover:text-(--primary)"
        >
          <ArrowLeft size={17} />
          Back to Salary
        </Link>

        <h2 className="text-2xl font-bold text-(--text)">
          Record Salary Payment
        </h2>

        <p className="mt-1 text-sm text-(--text-muted)">
          Record a full or partial payment against
          this driver salary.
        </p>
      </div>

      {/* Salary Summary */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Driver"
          value={driver?.name ?? "Unknown Driver"}
          icon={<UserRound size={19} />}
        />

        <SummaryCard
          label="Net Salary"
          value={formatCurrency(
            summary.netSalary
          )}
          icon={<Banknote size={19} />}
        />

        <SummaryCard
          label="Already Paid"
          value={formatCurrency(
            summary.paidAmount
          )}
          icon={<CreditCard size={19} />}
        />

        <SummaryCard
          label="Remaining"
          value={formatCurrency(
            summary.remainingAmount
          )}
          icon={<ReceiptText size={19} />}
        />
      </section>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <section className="rounded-2xl border border-(--border) bg-white">
          <div className="border-b border-(--border) px-6 py-5">
            <h3 className="font-semibold text-(--text)">
              Payment Information
            </h3>

            <p className="mt-1 text-sm text-(--text-muted)">
              Salary month:{" "}
              {formatSalaryMonth(
                salary.salaryMonth
              )}
            </p>
          </div>

          <div className="grid gap-5 p-6 md:grid-cols-2">
            {/* Amount */}
            <Field
              label="Payment Amount"
              required
            >
              <input
                type="number"
                min="1"
                max={
                  summary.remainingAmount
                }
                step="1"
                value={amount}
                onChange={(event) => {
                  setAmount(
                    event.target.value
                  );
                  setError("");
                  setSuccess("");
                }}
                placeholder="Enter amount"
                className={inputClass}
              />

              <p className="mt-2 text-xs text-(--text-muted)">
                Maximum payment:{" "}
                {formatCurrency(
                  summary.remainingAmount
                )}
              </p>
            </Field>

            {/* Date */}
            <Field
              label="Payment Date"
              required
            >
              <div className="relative">
                <CalendarDays
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--text-muted)"
                />

                <input
                  type="date"
                  value={paymentDate}
                  onChange={(event) => {
                    setPaymentDate(
                      event.target.value
                    );
                    setError("");
                    setSuccess("");
                  }}
                  className={`${inputClass} pl-10`}
                />
              </div>
            </Field>

            {/* Method */}
            <Field
              label="Payment Method"
              required
            >
              <select
                value={paymentMethod}
                onChange={(event) =>
                  setPaymentMethod(
                    event.target
                      .value as SalaryPaymentMethod
                  )
                }
                className={inputClass}
              >
                {paymentMethods.map(
                  (method) => (
                    <option
                      key={method.value}
                      value={method.value}
                    >
                      {method.label}
                    </option>
                  )
                )}
              </select>
            </Field>

            {/* Reference */}
            <Field label="Reference Number">
              <input
                type="text"
                name="referenceNumber"
                placeholder="Transaction / reference number"
                className={inputClass}
              />
            </Field>

            <div className="md:col-span-2">
              <Field label="Notes">
                <textarea
                  name="notes"
                  rows={4}
                  placeholder="Optional payment notes..."
                  className={inputClass}
                />
              </Field>
            </div>
          </div>
        </section>

        {/* Preview */}
        {Number(amount) > 0 &&
          Number(amount) <=
            summary.remainingAmount && (
            <section className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
              <p className="text-sm font-semibold text-(--text)">
                Payment Preview
              </p>

              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <PreviewItem
                  label="Payment"
                  value={formatCurrency(
                    Number(amount)
                  )}
                />

                <PreviewItem
                  label="Total Paid After"
                  value={formatCurrency(
                    summary.paidAmount +
                      Number(amount)
                  )}
                />

                <PreviewItem
                  label="Balance After"
                  value={formatCurrency(
                    Math.max(
                      0,
                      summary.remainingAmount -
                        Number(amount)
                    )
                  )}
                />
              </div>
            </section>
          )}

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

        <div className="flex flex-wrap justify-end gap-3">
          <Link
            href={`/admin/salaries/${salary.id}`}
            className="rounded-xl border border-(--border) bg-white px-5 py-2.5 text-sm font-semibold text-(--text) transition hover:bg-slate-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={
              summary.remainingAmount <= 0
            }
            className="inline-flex items-center gap-2 rounded-xl bg-(--primary) px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-(--primary-dark) disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Banknote size={17} />
            Record Payment
          </button>
        </div>
      </form>
    </div>
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

function SummaryCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-(--border) bg-white p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-(--text-muted)">
            {label}
          </p>

          <p className="mt-2 text-lg font-bold text-(--text)">
            {value}
          </p>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-(--primary)">
          {icon}
        </div>
      </div>
    </div>
  );
}

function PreviewItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-(--text-muted)">
        {label}
      </p>

      <p className="mt-1 font-bold text-(--text)">
        {value}
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
  const [year, monthNumber] =
    month.split("-");

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      month: "long",
      year: "numeric",
    }
  ).format(
    new Date(
      Number(year),
      Number(monthNumber) - 1,
      1
    )
  );
}

const inputClass =
  "w-full rounded-xl border border-(--border) bg-white px-4 py-3 text-sm text-(--text) outline-none transition placeholder:text-slate-400 focus:border-(--primary)";