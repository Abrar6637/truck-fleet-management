"use client";

import { TyreCondition, TyreStatus } from "@/types/tyre";
import {
  ArrowLeft,
  CalendarDays,
  CircleGauge,
  FileText,
  PackagePlus,
  ReceiptText,
} from "lucide-react";
import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

const tyreStatuses: {
  value: TyreStatus;
  label: string;
}[] = [
  { value: "in_stock", label: "In Stock" },
  { value: "under_repair", label: "Under Repair" },
  { value: "retired", label: "Retired" },
];

const tyreConditions: {
  value: TyreCondition;
  label: string;
}[] = [
  { value: "new", label: "New" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
  { value: "poor", label: "Poor" },
  { value: "damaged", label: "Damaged" },
];

export default function AddTyrePage() {
  const [status, setStatus] =
    useState<TyreStatus>("in_stock");

  const [condition, setCondition] =
    useState<TyreCondition>("new");

  const [purchasePrice, setPurchasePrice] =
    useState("");

  const [currentMileageKm, setCurrentMileageKm] =
    useState("0");

  const [expectedLifeKm, setExpectedLifeKm] =
    useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const mileageNumber =
    Number(currentMileageKm) || 0;

  const expectedLifeNumber =
    Number(expectedLifeKm) || 0;

  const lifeUsedPercentage = useMemo(() => {
    if (expectedLifeNumber <= 0) {
      return 0;
    }

    return (
      (mileageNumber / expectedLifeNumber) *
      100
    );
  }, [mileageNumber, expectedLifeNumber]);

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const formData = new FormData(
      event.currentTarget
    );

    const tyreNumber = String(
      formData.get("tyreNumber") ?? ""
    ).trim();

    const brand = String(
      formData.get("brand") ?? ""
    ).trim();

    const size = String(
      formData.get("size") ?? ""
    ).trim();

    const purchaseDate = String(
      formData.get("purchaseDate") ?? ""
    );

    const purchasePriceNumber = Number(
      formData.get("purchasePrice")
    );

    const currentMileageNumber = Number(
      formData.get("currentMileageKm")
    );

    const expectedLifeRaw = String(
      formData.get("expectedLifeKm") ?? ""
    );

    const expectedLife =
      expectedLifeRaw === ""
        ? undefined
        : Number(expectedLifeRaw);

    if (!tyreNumber) {
      setError("Please enter the tyre number.");
      return;
    }

    if (!brand) {
      setError("Please enter the tyre brand.");
      return;
    }

    if (!size) {
      setError("Please enter the tyre size.");
      return;
    }

    if (!purchaseDate) {
      setError("Please select the purchase date.");
      return;
    }

    if (
      !Number.isFinite(purchasePriceNumber) ||
      purchasePriceNumber < 0
    ) {
      setError(
        "Please enter a valid purchase price."
      );
      return;
    }

    if (
      !Number.isFinite(currentMileageNumber) ||
      currentMileageNumber < 0
    ) {
      setError(
        "Current mileage cannot be negative."
      );
      return;
    }

    if (
      expectedLife !== undefined &&
      (!Number.isFinite(expectedLife) ||
        expectedLife <= 0)
    ) {
      setError(
        "Expected tyre life must be greater than 0."
      );
      return;
    }

    setSuccess(
      `Tyre ${tyreNumber} is valid and ready to save. It will be stored when the Laravel API is connected.`
    );
  };

  return (
    <div className="space-y-7">
      {/* Header */}
      <div>
        <Link
          href="/admin/tyres"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-(--text-muted) transition hover:text-(--primary)"
        >
          <ArrowLeft size={17} />
          Back to Tyres
        </Link>

        <h2 className="text-2xl font-bold text-(--text)">
          Add Tyre
        </h2>

        <p className="mt-1 text-sm text-(--text-muted)">
          Add a tyre to the fleet inventory.
          Truck installation will be handled
          separately through tyre assignments.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Basic Information */}
        <FormSection
          title="Tyre Information"
          description="Enter tyre identification and specification details."
          icon={<CircleGauge size={19} />}
        >
          <div className="grid gap-5 md:grid-cols-2">
            <Field
              label="Tyre Number"
              required
            >
              <input
                type="text"
                name="tyreNumber"
                placeholder="e.g. TYR-009"
                className={inputClass}
              />
            </Field>

            <Field label="Serial Number">
              <input
                type="text"
                name="serialNumber"
                placeholder="Manufacturer serial number"
                className={inputClass}
              />
            </Field>

            <Field label="Brand" required>
              <input
                type="text"
                name="brand"
                placeholder="e.g. Bridgestone"
                className={inputClass}
              />
            </Field>

            <Field label="Model">
              <input
                type="text"
                name="model"
                placeholder="e.g. R156"
                className={inputClass}
              />
            </Field>

            <Field label="Tyre Size" required>
              <input
                type="text"
                name="size"
                placeholder="e.g. 11R22.5"
                className={inputClass}
              />
            </Field>

            <Field label="Supplier Name">
              <input
                type="text"
                name="supplierName"
                placeholder="e.g. Lahore Tyre House"
                className={inputClass}
              />
            </Field>
          </div>
        </FormSection>

        {/* Purchase */}
        <FormSection
          title="Purchase Information"
          description="Enter purchase and warranty information."
          icon={<ReceiptText size={19} />}
        >
          <div className="grid gap-5 md:grid-cols-2">
            <Field
              label="Purchase Date"
              required
            >
              <input
                type="date"
                name="purchaseDate"
                className={inputClass}
              />
            </Field>

            <Field
              label="Purchase Price (PKR)"
              required
            >
              <input
                type="number"
                name="purchasePrice"
                min="0"
                step="0.01"
                value={purchasePrice}
                onChange={(event) =>
                  setPurchasePrice(
                    event.target.value
                  )
                }
                placeholder="e.g. 85000"
                className={inputClass}
              />
            </Field>

            <Field label="Warranty Expiry Date">
              <input
                type="date"
                name="warrantyExpiryDate"
                className={inputClass}
              />
            </Field>
          </div>

          {Number(purchasePrice) > 0 && (
            <div className="mt-5 rounded-xl border border-(--border) bg-slate-50 p-4">
              <p className="text-sm text-(--text-muted)">
                Purchase Value
              </p>

              <p className="mt-1 text-xl font-bold text-(--text)">
                PKR{" "}
                {Number(
                  purchasePrice
                ).toLocaleString()}
              </p>
            </div>
          )}
        </FormSection>

        {/* Mileage */}
        <FormSection
          title="Tyre Life & Mileage"
          description="Track tyre usage and expected service life."
          icon={<CalendarDays size={19} />}
        >
          <div className="grid gap-5 md:grid-cols-3">
            <Field label="Initial Odometer (km)">
              <input
                type="number"
                name="initialOdometerKm"
                min="0"
                placeholder="Optional"
                className={inputClass}
              />
            </Field>

            <Field
              label="Current Tyre Mileage (km)"
              required
            >
              <input
                type="number"
                name="currentMileageKm"
                min="0"
                value={currentMileageKm}
                onChange={(event) =>
                  setCurrentMileageKm(
                    event.target.value
                  )
                }
                className={inputClass}
              />
            </Field>

            <Field label="Expected Life (km)">
              <input
                type="number"
                name="expectedLifeKm"
                min="1"
                value={expectedLifeKm}
                onChange={(event) =>
                  setExpectedLifeKm(
                    event.target.value
                  )
                }
                placeholder="e.g. 80000"
                className={inputClass}
              />
            </Field>
          </div>

          {expectedLifeNumber > 0 && (
            <div className="mt-5 rounded-xl border border-(--border) bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-(--text-muted)">
                    Tyre Life Used
                  </p>

                  <p className="mt-1 text-xl font-bold text-(--text)">
                    {lifeUsedPercentage.toFixed(
                      1
                    )}
                    %
                  </p>
                </div>

                <div className="text-right text-sm text-(--text-muted)">
                  <p>
                    {mileageNumber.toLocaleString()}{" "}
                    km used
                  </p>

                  <p>
                    {expectedLifeNumber.toLocaleString()}{" "}
                    km expected
                  </p>
                </div>
              </div>

              <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-200">
                <div
                  className={`h-full rounded-full ${
                    lifeUsedPercentage >= 100
                      ? "bg-red-500"
                      : lifeUsedPercentage >= 80
                        ? "bg-amber-500"
                        : "bg-green-500"
                  }`}
                  style={{
                    width: `${Math.min(
                      lifeUsedPercentage,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>
          )}
        </FormSection>

        {/* Status */}
        <FormSection
          title="Condition & Status"
          description="Set the tyre's current inventory condition."
          icon={<PackagePlus size={19} />}
        >
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Condition" required>
              <select
                name="condition"
                value={condition}
                onChange={(event) =>
                  setCondition(
                    event.target
                      .value as TyreCondition
                  )
                }
                className={inputClass}
              >
                {tyreConditions.map(
                  (item) => (
                    <option
                      key={item.value}
                      value={item.value}
                    >
                      {item.label}
                    </option>
                  )
                )}
              </select>
            </Field>

            <Field label="Status" required>
              <select
                name="status"
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target
                      .value as TyreStatus
                  )
                }
                className={inputClass}
              >
                {tyreStatuses.map((item) => (
                  <option
                    key={item.value}
                    value={item.value}
                  >
                    {item.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-700">
            <strong>Installed</strong> status is
            intentionally not available here. A tyre
            becomes installed only when it is assigned
            to a truck position.
          </div>
        </FormSection>

        {/* Notes */}
        <FormSection
          title="Additional Information"
          description="Add any optional information about this tyre."
          icon={<FileText size={19} />}
        >
          <Field label="Notes">
            <textarea
              name="notes"
              rows={4}
              placeholder="Optional notes about tyre condition, supplier, damage, etc."
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
            href="/admin/tyres"
            className="rounded-xl border border-(--border) bg-white px-5 py-2.5 text-sm font-semibold text-(--text) transition hover:bg-slate-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-(--primary) px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-(--primary-dark)"
          >
            <PackagePlus size={17} />
            Save Tyre
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
          <span className="ml-1 text-(--danger)">
            *
          </span>
        )}
      </span>

      {children}
    </label>
  );
}