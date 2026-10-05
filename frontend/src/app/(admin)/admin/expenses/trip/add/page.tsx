"use client";

import { drivers } from "@/data/drivers";
import { trips } from "@/data/trips";
import { trucks } from "@/data/trucks";
import { TripExpenseCategory } from "@/types/tripExpense";
import {
  ArrowLeft,
  Banknote,
  FileText,
  ReceiptText,
  Route,
} from "lucide-react";
import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

const categories: {
  value: TripExpenseCategory;
  label: string;
}[] = [
  { value: "toll", label: "Toll" },
  { value: "food", label: "Food" },
  { value: "loading", label: "Loading" },
  { value: "unloading", label: "Unloading" },
  { value: "parking", label: "Parking" },
  { value: "repair", label: "Repair" },
  { value: "permit", label: "Permit" },
  { value: "other", label: "Other" },
];

export default function AddTripExpensePage() {
  const [selectedTripId, setSelectedTripId] = useState("");
  const [category, setCategory] =
    useState<TripExpenseCategory>("toll");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const tripId = Number(selectedTripId);

  const selectedTrip = useMemo(
    () => trips.find((trip) => trip.id === tripId),
    [tripId]
  );

  const selectedTruck = selectedTrip
    ? trucks.find(
        (truck) => truck.id === selectedTrip.truckId
      )
    : undefined;

  const selectedDriver = selectedTrip
    ? drivers.find(
        (driver) => driver.id === selectedTrip.driverId
      )
    : undefined;

  const amountNumber = Number(amount) || 0;

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const formData = new FormData(event.currentTarget);

    const expenseDate = String(
      formData.get("expenseDate") ?? ""
    );

    if (!selectedTrip) {
      setError("Please select a trip.");
      return;
    }

    if (!expenseDate) {
      setError("Please select the expense date.");
      return;
    }

    if (amountNumber <= 0) {
      setError("Expense amount must be greater than 0.");
      return;
    }

    setSuccess(
      `${categories.find((item) => item.value === category)?.label} expense of PKR ${amountNumber.toLocaleString()} is valid and will be saved when the Laravel API is connected.`
    );
  };

  return (
    <div className="space-y-7">
      {/* Header */}
      <div>
        <Link
          href="/admin/expenses"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-(--text-muted) transition hover:text-(--primary)"
        >
          <ArrowLeft size={17} />
          Back to Fuel & Expenses
        </Link>

        <h2 className="text-2xl font-bold text-(--text)">
          Add Trip Expense
        </h2>

        <p className="mt-1 text-sm text-(--text-muted)">
          Record an operational expense against a fleet trip.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Trip */}
        <FormSection
          title="Trip Information"
          description="Select the trip this expense belongs to."
          icon={<Route size={19} />}
        >
          <Field label="Trip" required>
            <select
              name="tripId"
              value={selectedTripId}
              onChange={(event) => {
                setSelectedTripId(event.target.value);
                setError("");
                setSuccess("");
              }}
              className={inputClass}
            >
              <option value="">Select trip</option>

              {trips.map((trip) => (
                <option
                  key={trip.id}
                  value={trip.id}
                >
                  {trip.tripNumber} — {trip.origin} to{" "}
                  {trip.destination}
                </option>
              ))}
            </select>
          </Field>

          {selectedTrip && (
            <div className="mt-5 grid gap-4 rounded-xl border border-blue-100 bg-blue-50 p-4 sm:grid-cols-3">
              <InfoItem
                label="Truck"
                value={
                  selectedTruck?.registrationNumber ??
                  "Unknown"
                }
              />

              <InfoItem
                label="Driver"
                value={selectedDriver?.name ?? "Unknown"}
              />

              <InfoItem
                label="Trip Status"
                value={selectedTrip.status
                  .replace("_", " ")
                  .replace(/\b\w/g, (char) =>
                    char.toUpperCase()
                  )}
              />
            </div>
          )}
        </FormSection>

        {/* Expense */}
        <FormSection
          title="Expense Details"
          description="Enter the category, date and amount of the expense."
          icon={<Banknote size={19} />}
        >
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Category" required>
              <select
                name="category"
                value={category}
                onChange={(event) =>
                  setCategory(
                    event.target
                      .value as TripExpenseCategory
                  )
                }
                className={inputClass}
              >
                {categories.map((item) => (
                  <option
                    key={item.value}
                    value={item.value}
                  >
                    {item.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Expense Date" required>
              <input
                type="date"
                name="expenseDate"
                className={inputClass}
              />
            </Field>

            <Field label="Amount (PKR)" required>
              <input
                type="number"
                name="amount"
                min="0"
                step="0.01"
                value={amount}
                onChange={(event) =>
                  setAmount(event.target.value)
                }
                placeholder="e.g. 4500"
                className={inputClass}
              />
            </Field>

            <Field label="Receipt Number">
              <input
                type="text"
                name="receiptNumber"
                placeholder="e.g. TOLL-1010"
                className={inputClass}
              />
            </Field>
          </div>
        </FormSection>

        {/* Description */}
        <FormSection
          title="Receipt & Description"
          description="Attach supporting receipt information and describe the expense."
          icon={<ReceiptText size={19} />}
        >
          <div className="space-y-5">
            <Field label="Receipt Image">
              <input
                type="file"
                name="receiptImage"
                accept="image/*"
                className="block w-full rounded-xl border border-(--border) bg-white px-4 py-3 text-sm text-(--text-muted) file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-(--primary)"
              />
            </Field>

            <Field label="Description">
              <textarea
                name="description"
                rows={4}
                placeholder="e.g. Motorway toll charges during Lahore to Islamabad trip..."
                className={inputClass}
              />
            </Field>
          </div>
        </FormSection>

        {/* Amount Preview */}
        <section className="rounded-2xl border border-(--border) bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-(--primary)">
              <FileText size={19} />
            </div>

            <div>
              <p className="text-sm font-medium text-(--text-muted)">
                Expense Amount
              </p>

              <p className="mt-1 text-2xl font-bold text-(--text)">
                PKR {amountNumber.toLocaleString()}
              </p>
            </div>
          </div>
        </section>

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
            href="/admin/expenses"
            className="rounded-xl border border-(--border) bg-white px-5 py-2.5 text-sm font-semibold text-(--text) transition hover:bg-slate-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-(--primary) px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-(--primary-dark)"
          >
            <Banknote size={17} />
            Save Trip Expense
          </button>
        </div>
      </form>
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-(--border) bg-white px-4 py-3 text-sm text-(--text) outline-none transition placeholder:text-slate-400 focus:border-(--primary)";

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
          <span className="ml-1 text-(--danger)">*</span>
        )}
      </span>

      {children}
    </label>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs font-medium text-blue-700">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-(--text)">
        {value}
      </p>
    </div>
  );
}