"use client";

import { drivers } from "@/data/drivers";
import {
  DriverDocumentType,
  DriverDocumentVerificationStatus,
} from "@/types/driverDocument";
import {
  ArrowLeft,
  CalendarDays,
  FileCheck2,
  FileText,
  Upload,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

const documentTypes: {
  value: DriverDocumentType;
  label: string;
}[] = [
  {
    value: "driving_license",
    label: "Driving License",
  },
  {
    value: "cnic",
    label: "CNIC",
  },
  {
    value: "medical_certificate",
    label: "Medical Certificate",
  },
  {
    value: "police_verification",
    label: "Police Verification",
  },
  {
    value: "other",
    label: "Other",
  },
];

const verificationStatuses: {
  value: DriverDocumentVerificationStatus;
  label: string;
}[] = [
  {
    value: "pending",
    label: "Pending",
  },
  {
    value: "verified",
    label: "Verified",
  },
  {
    value: "rejected",
    label: "Rejected",
  },
];

export default function AddDriverDocumentPage() {
  const [selectedDriverId, setSelectedDriverId] =
    useState("");

  const [documentType, setDocumentType] =
    useState<DriverDocumentType>(
      "driving_license"
    );

  const [
    verificationStatus,
    setVerificationStatus,
  ] =
    useState<DriverDocumentVerificationStatus>(
      "pending"
    );

  const [issueDate, setIssueDate] =
    useState("");

  const [expiryDate, setExpiryDate] =
    useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] =
    useState("");

  const selectedDriver = useMemo(
    () =>
      drivers.find(
        (driver) =>
          driver.id ===
          Number(selectedDriverId)
      ),
    [selectedDriverId]
  );

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const formData = new FormData(
      event.currentTarget
    );

    const documentNumber = String(
      formData.get("documentNumber") ?? ""
    ).trim();

    if (!selectedDriver) {
      setError(
        "Please select a driver."
      );
      return;
    }

    if (!documentNumber) {
      setError(
        "Please enter the document number."
      );
      return;
    }

    if (
      issueDate &&
      expiryDate &&
      new Date(
        `${expiryDate}T00:00:00`
      ) <
        new Date(
          `${issueDate}T00:00:00`
        )
    ) {
      setError(
        "Expiry date cannot be earlier than the issue date."
      );
      return;
    }

    setSuccess(
      `${getDocumentTypeLabel(
        documentType
      )} for ${
        selectedDriver.name
      } is valid and ready to save. It will be stored when the Laravel API is connected.`
    );
  };

  return (
    <div className="space-y-7">
      {/* Header */}
      <div>
        <Link
          href="/admin/documents/drivers"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-(--text-muted) transition hover:text-(--primary)"
        >
          <ArrowLeft size={17} />
          Back to Driver Documents
        </Link>

        <h2 className="text-2xl font-bold text-(--text)">
          Add Driver Document
        </h2>

        <p className="mt-1 text-sm text-(--text-muted)">
          Add driving license, CNIC,
          medical certificate or other
          driver documentation.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Driver */}
        <FormSection
          title="Driver"
          description="Select the driver this document belongs to."
          icon={<UserRound size={19} />}
        >
          <Field
            label="Driver"
            required
          >
            <select
              name="driverId"
              value={selectedDriverId}
              onChange={(event) => {
                setSelectedDriverId(
                  event.target.value
                );

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
                  {driver.name} —{" "}
                  {driver.phone}
                </option>
              ))}
            </select>
          </Field>

          {selectedDriver && (
            <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4">
              <p className="font-semibold text-(--text)">
                {selectedDriver.name}
              </p>

              <p className="mt-1 text-sm text-(--text-muted)">
                {selectedDriver.phone}
              </p>

              <p className="mt-1 text-xs capitalize text-(--text-muted)">
                Status:{" "}
                {selectedDriver.status.replace(
                  "_",
                  " "
                )}
              </p>
            </div>
          )}
        </FormSection>

        {/* Document */}
        <FormSection
          title="Document Information"
          description="Enter the document type, number and issuing authority."
          icon={<FileText size={19} />}
        >
          <div className="grid gap-5 md:grid-cols-2">
            <Field
              label="Document Type"
              required
            >
              <select
                name="documentType"
                value={documentType}
                onChange={(event) =>
                  setDocumentType(
                    event.target
                      .value as DriverDocumentType
                  )
                }
                className={inputClass}
              >
                {documentTypes.map(
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

            <Field
              label="Document Number"
              required
            >
              <input
                type="text"
                name="documentNumber"
                placeholder="e.g. LIC-AK-1001"
                className={inputClass}
              />
            </Field>

            <Field label="Issuing Authority">
              <input
                type="text"
                name="issuingAuthority"
                placeholder="e.g. Traffic Police Punjab"
                className={inputClass}
              />
            </Field>

            <Field
              label="Verification Status"
              required
            >
              <select
                name="verificationStatus"
                value={
                  verificationStatus
                }
                onChange={(event) =>
                  setVerificationStatus(
                    event.target
                      .value as DriverDocumentVerificationStatus
                  )
                }
                className={inputClass}
              >
                {verificationStatuses.map(
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
          </div>
        </FormSection>

        {/* Validity */}
        <FormSection
          title="Validity"
          description="Enter issue and expiry dates where applicable."
          icon={
            <CalendarDays size={19} />
          }
        >
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Issue Date">
              <input
                type="date"
                name="issueDate"
                value={issueDate}
                onChange={(event) =>
                  setIssueDate(
                    event.target.value
                  )
                }
                className={inputClass}
              />
            </Field>

            <Field label="Expiry Date">
              <input
                type="date"
                name="expiryDate"
                value={expiryDate}
                min={
                  issueDate || undefined
                }
                onChange={(event) =>
                  setExpiryDate(
                    event.target.value
                  )
                }
                className={inputClass}
              />
            </Field>
          </div>

          {documentType ===
            "driving_license" && (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800">
              Driving license expiry is
              operationally important.
              Expired, rejected or
              unverified licenses should
              not be accepted for new
              driver assignments once the
              backend rules are connected.
            </div>
          )}
        </FormSection>

        {/* File */}
        <FormSection
          title="Document File"
          description="Attach a scanned copy or image."
          icon={<Upload size={19} />}
        >
          <Field label="Document File">
            <input
              type="file"
              name="documentFile"
              accept=".pdf,image/*"
              className="block w-full rounded-xl border border-(--border) bg-white px-4 py-3 text-sm text-(--text-muted) file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-(--primary)"
            />
          </Field>

          <p className="mt-2 text-xs text-(--text-muted)">
            Actual upload/storage will
            be connected through Laravel
            later.
          </p>
        </FormSection>

        {/* Notes */}
        <FormSection
          title="Notes"
          description="Add optional information about this document."
          icon={<FileCheck2 size={19} />}
        >
          <Field label="Notes">
            <textarea
              name="notes"
              rows={4}
              placeholder="Optional notes..."
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
            href="/admin/documents/drivers"
            className="rounded-xl border border-(--border) bg-white px-5 py-2.5 text-sm font-semibold text-(--text) transition hover:bg-slate-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-(--primary) px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-(--primary-dark)"
          >
            <FileCheck2 size={17} />
            Save Document
          </button>
        </div>
      </form>
    </div>
  );
}

function getDocumentTypeLabel(
  type: DriverDocumentType
) {
  return (
    documentTypes.find(
      (item) =>
        item.value === type
    )?.label ?? type
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

      <div className="p-6">
        {children}
      </div>
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

const inputClass =
  "w-full rounded-xl border border-(--border) bg-white px-4 py-3 text-sm text-(--text) outline-none transition placeholder:text-slate-400 focus:border-(--primary)";