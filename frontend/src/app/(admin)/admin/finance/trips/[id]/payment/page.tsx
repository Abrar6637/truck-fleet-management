"use client";

import { tripPayments } from "@/data/tripPayments";
import { trips } from "@/data/trips";
import { calculateTripPayment } from "@/lib/tripPayment";
import {
  TripPaymentMethod,
  TripPaymentType,
} from "@/types/tripPayment";
import {
  ArrowLeft,
  Banknote,
  CalendarDays,
  CreditCard,
  ReceiptText,
  Route,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";

const paymentTypes: {
  value: TripPaymentType;
  label: string;
}[] = [
  { value: "advance", label: "Advance" },
  { value: "partial", label: "Partial" },
  { value: "final", label: "Final" },
];

const paymentMethods: {
  value: TripPaymentMethod;
  label: string;
}[] = [
  { value: "cash", label: "Cash" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "jazzcash", label: "JazzCash" },
  { value: "easypaisa", label: "Easypaisa" },
  { value: "cheque", label: "Cheque" },
  { value: "other", label: "Other" },
];

export default function RecordTripPaymentPage() {
  const params = useParams<{ id: string }>();
  const tripId = Number(params.id);

  const trip = useMemo(
    () => trips.find((item) => item.id === tripId),
    [tripId]
  );

  const summary = useMemo(
    () =>
      trip
        ? calculateTripPayment(
            trip.id,
            trip.tripAmount,
            tripPayments
          )
        : null,
    [trip]
  );

  const [amount, setAmount] = useState("");
  const [paymentType, setPaymentType] =
    useState<TripPaymentType>("partial");
  const [paymentMethod, setPaymentMethod] =
    useState<TripPaymentMethod>("cash");
  const [paymentDate, setPaymentDate] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!trip || !summary) {
    return (
      <div className="rounded-2xl border border-(--border) bg-white p-8">
        <h2 className="text-xl font-bold text-(--text)">
          Trip not found
        </h2>

        <Link
          href="/admin/finance"
          className="mt-4 inline-flex text-sm font-semibold text-(--primary)"
        >
          Back to Finance
        </Link>
      </div>
    );
  }

  const paymentAmount = Number(amount) || 0;

  const balanceAfter = Math.max(
    0,
    summary.remainingAmount - paymentAmount
  );

  const paidAfter =
    summary.paidAmount + paymentAmount;

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (trip.status === "cancelled") {
      setError(
        "Payments cannot be recorded against a cancelled trip."
      );
      return;
    }

    if (summary.remainingAmount <= 0) {
      setError("This trip has already been fully paid.");
      return;
    }

    const enteredAmount = Number(amount);

    if (
      !Number.isFinite(enteredAmount) ||
      enteredAmount <= 0
    ) {
      setError("Please enter a valid payment amount.");
      return;
    }

    if (enteredAmount > summary.remainingAmount) {
      setError(
        `Payment cannot exceed the remaining balance of ${formatCurrency(
          summary.remainingAmount
        )}.`
      );
      return;
    }

    if (!paymentDate) {
      setError("Please select the payment date.");
      return;
    }

    if (
      paymentType === "final" &&
      enteredAmount !== summary.remainingAmount
    ) {
      setError(
        `Final payment must clear the complete remaining balance of ${formatCurrency(
          summary.remainingAmount
        )}.`
      );
      return;
    }

    if (
      paymentType !== "final" &&
      enteredAmount === summary.remainingAmount
    ) {
      setError(
        "This payment clears the full remaining balance. Please select Final as the payment type."
      );
      return;
    }

    const formData = new FormData(event.currentTarget);

    const referenceNumber = String(
      formData.get("referenceNumber") ?? ""
    ).trim();

    setSuccess(
      `${formatCurrency(
        enteredAmount
      )} payment for ${
        trip.tripNumber
      } is valid and ready to save. Remaining balance after payment: ${formatCurrency(
        summary.remainingAmount - enteredAmount
      )}. It will be stored when the Laravel API is connected.${
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
          href={`/admin/finance/trips/${trip.id}`}
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-(--text-muted) transition hover:text-(--primary)"
        >
          <ArrowLeft size={17} />
          Back to Trip Payments
        </Link>

        <h2 className="text-2xl font-bold text-(--text)">
          Record Trip Payment
        </h2>

        <p className="mt-1 text-sm text-(--text-muted)">
          Record a customer payment against {trip.tripNumber}.
        </p>
      </div>

      {/* Summary */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Trip Amount"
          value={formatCurrency(summary.tripAmount)}
          icon={<ReceiptText size={19} />}
        />

        <SummaryCard
          label="Already Received"
          value={formatCurrency(summary.paidAmount)}
          icon={<Banknote size={19} />}
        />

        <SummaryCard
          label="Remaining"
          value={formatCurrency(summary.remainingAmount)}
          icon={<CreditCard size={19} />}
        />

        <SummaryCard
          label="Route"
          value={`${trip.origin} → ${trip.destination}`}
          icon={<Route size={19} />}
        />
      </section>

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="rounded-2xl border border-(--border) bg-white">
          <div className="border-b border-(--border) px-6 py-5">
            <h3 className="font-semibold text-(--text)">
              Payment Information
            </h3>

            <p className="mt-1 text-sm text-(--text-muted)">
              Remaining receivable:{" "}
              {formatCurrency(summary.remainingAmount)}
            </p>
          </div>

          <div className="grid gap-5 p-6 md:grid-cols-2">
            <Field label="Payment Amount" required>
              <input
                type="number"
                min="1"
                max={summary.remainingAmount}
                step="1"
                value={amount}
                onChange={(event) => {
                  setAmount(event.target.value);
                  setError("");
                  setSuccess("");
                }}
                placeholder="Enter received amount"
                className={inputClass}
              />

              <p className="mt-2 text-xs text-(--text-muted)">
                Maximum:{" "}
                {formatCurrency(summary.remainingAmount)}
              </p>
            </Field>

            <Field label="Payment Date" required>
              <div className="relative">
                <CalendarDays
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--text-muted)"
                />

                <input
                  type="date"
                  value={paymentDate}
                  onChange={(event) => {
                    setPaymentDate(event.target.value);
                    setError("");
                    setSuccess("");
                  }}
                  className={`${inputClass} pl-10`}
                />
              </div>
            </Field>

            <Field label="Payment Type" required>
              <select
                value={paymentType}
                onChange={(event) => {
                  setPaymentType(
                    event.target.value as TripPaymentType
                  );
                  setError("");
                  setSuccess("");
                }}
                className={inputClass}
              >
                {paymentTypes.map((type) => (
                  <option
                    key={type.value}
                    value={type.value}
                  >
                    {type.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Payment Method" required>
              <select
                value={paymentMethod}
                onChange={(event) =>
                  setPaymentMethod(
                    event.target.value as TripPaymentMethod
                  )
                }
                className={inputClass}
              >
                {paymentMethods.map((method) => (
                  <option
                    key={method.value}
                    value={method.value}
                  >
                    {method.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Reference Number">
              <input
                type="text"
                name="referenceNumber"
                placeholder="Transaction / cheque reference"
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
        {paymentAmount > 0 &&
          paymentAmount <= summary.remainingAmount && (
            <section className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
              <h3 className="font-semibold text-(--text)">
                Payment Preview
              </h3>

              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <PreviewItem
                  label="This Payment"
                  value={formatCurrency(paymentAmount)}
                />

                <PreviewItem
                  label="Total Received After"
                  value={formatCurrency(paidAfter)}
                />

                <PreviewItem
                  label="Balance After"
                  value={formatCurrency(balanceAfter)}
                />
              </div>

              {balanceAfter === 0 && (
                <p className="mt-4 text-sm font-semibold text-green-700">
                  This payment will fully settle the trip balance.
                </p>
              )}
            </section>
          )}

        {trip.status === "cancelled" && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-(--danger)">
            This trip is cancelled. New payments are not allowed.
          </div>
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
            href={`/admin/finance/trips/${trip.id}`}
            className="rounded-xl border border-(--border) bg-white px-5 py-2.5 text-sm font-semibold text-(--text) transition hover:bg-slate-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={
              trip.status === "cancelled" ||
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
          <span className="ml-1 text-(--danger)">*</span>
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
        <div className="min-w-0">
          <p className="text-sm text-(--text-muted)">
            {label}
          </p>

          <p className="mt-2 truncate text-lg font-bold text-(--text)">
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

const inputClass =
  "w-full rounded-xl border border-(--border) bg-white px-4 py-3 text-sm text-(--text) outline-none transition placeholder:text-slate-400 focus:border-(--primary)";