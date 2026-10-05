"use client";

import { tripDocuments } from "@/data/tripDocuments";
import { trips } from "@/data/trips";
import {
  TripDocumentType,
  TripDocumentVerificationStatus,
} from "@/types/tripDocument";
import {
  CheckCircle2,
  Clock3,
  FileText,
  Search,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

type VerificationFilter =
  | "all"
  | TripDocumentVerificationStatus;

type DocumentTypeFilter =
  | "all"
  | TripDocumentType;

export default function TripDocumentsPage() {
  const [search, setSearch] = useState("");

  const [
    verificationFilter,
    setVerificationFilter,
  ] = useState<VerificationFilter>("all");

  const [
    documentTypeFilter,
    setDocumentTypeFilter,
  ] = useState<DocumentTypeFilter>("all");

  const filteredDocuments = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    return tripDocuments
      .map((document) => {
        const trip = trips.find(
          (item) =>
            item.id === document.tripId
        );

        return {
          document,
          trip,
        };
      })
      .filter(({ document, trip }) => {
        const matchesSearch =
          !query ||
          [
            document.documentNumber,
            document.fileName,
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

        const matchesVerification =
          verificationFilter === "all" ||
          document.verificationStatus ===
            verificationFilter;

        const matchesType =
          documentTypeFilter === "all" ||
          document.documentType ===
            documentTypeFilter;

        return (
          matchesSearch &&
          matchesVerification &&
          matchesType
        );
      })
      .sort((a, b) =>
        b.document.uploadedAt.localeCompare(
          a.document.uploadedAt
        )
      );
  }, [
    search,
    verificationFilter,
    documentTypeFilter,
  ]);

  const verifiedCount =
    filteredDocuments.filter(
      ({ document }) =>
        document.verificationStatus ===
        "verified"
    ).length;

  const pendingCount =
    filteredDocuments.filter(
      ({ document }) =>
        document.verificationStatus ===
        "pending"
    ).length;

  const rejectedCount =
    filteredDocuments.filter(
      ({ document }) =>
        document.verificationStatus ===
        "rejected"
    ).length;

  return (
    <div className="space-y-6 sm:space-y-7">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-bold text-(--text) sm:text-2xl">
            Trip Documents
          </h2>

          <p className="mt-1 text-sm text-(--text-muted)">
            Manage POD, bilty, challans,
            invoices, weight slips and other
            trip documents.
          </p>
        </div>

        <Link
          href="/admin/trip-documents/new"
          className="inline-flex w-full items-center justify-center rounded-xl bg-(--primary) px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-(--primary-dark) sm:w-fit"
        >
          + Add Trip Document
        </Link>
      </div>

      {/* Summary */}
      <section className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <SummaryCard
          label="Total Documents"
          value={String(
            filteredDocuments.length
          )}
          icon={FileText}
        />

        <SummaryCard
          label="Verified"
          value={String(verifiedCount)}
          icon={CheckCircle2}
        />

        <SummaryCard
          label="Pending"
          value={String(pendingCount)}
          icon={Clock3}
        />

        <SummaryCard
          label="Rejected"
          value={String(rejectedCount)}
          icon={XCircle}
        />
      </section>

      {/* Filters */}
      <section className="rounded-2xl border border-(--border) bg-white p-4 sm:p-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Search */}
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
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Trip, document number..."
                className={`${inputClass} pl-10`}
              />
            </div>
          </div>

          {/* Document Type */}
          <div>
            <label className={labelClass}>
              Document Type
            </label>

            <select
              value={documentTypeFilter}
              onChange={(event) =>
                setDocumentTypeFilter(
                  event.target
                    .value as DocumentTypeFilter
                )
              }
              className={inputClass}
            >
              <option value="all">
                All Types
              </option>

              <option value="proof_of_delivery">
                Proof of Delivery
              </option>

              <option value="delivery_challan">
                Delivery Challan
              </option>

              <option value="invoice">
                Invoice
              </option>

              <option value="bilty">
                Bilty
              </option>

              <option value="gate_pass">
                Gate Pass
              </option>

              <option value="weight_slip">
                Weight Slip
              </option>

              <option value="other">
                Other
              </option>
            </select>
          </div>

          {/* Verification */}
          <div>
            <label className={labelClass}>
              Verification
            </label>

            <select
              value={verificationFilter}
              onChange={(event) =>
                setVerificationFilter(
                  event.target
                    .value as VerificationFilter
                )
              }
              className={inputClass}
            >
              <option value="all">
                All Statuses
              </option>

              <option value="pending">
                Pending
              </option>

              <option value="verified">
                Verified
              </option>

              <option value="rejected">
                Rejected
              </option>
            </select>
          </div>
        </div>
      </section>

      {/* Documents */}
      <section className="overflow-hidden rounded-2xl border border-(--border) bg-white">
        <div className="border-b border-(--border) px-4 py-4 sm:px-5">
          <h3 className="font-semibold text-(--text)">
            Documents
          </h3>

          <p className="mt-1 text-sm text-(--text-muted)">
            {filteredDocuments.length}{" "}
            document
            {filteredDocuments.length === 1
              ? ""
              : "s"}{" "}
            found.
          </p>
        </div>

        {/* Mobile Cards */}
        <div className="divide-y divide-(--border) md:hidden">
          {filteredDocuments.map(
            ({ document, trip }) => (
              <div
                key={document.id}
                className="p-4"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-(--primary)">
                      <FileText size={18} />
                    </div>

                    <div className="min-w-0">
                      <p className="font-semibold text-(--text)">
                        {formatDocumentType(
                          document.documentType
                        )}
                      </p>

                      <p className="mt-1 break-all text-xs text-(--text-muted)">
                        {document.documentNumber ??
                          "No document number"}
                      </p>
                    </div>
                  </div>

                  <VerificationBadge
                    status={
                      document.verificationStatus
                    }
                  />
                </div>

                {/* Trip */}
                <div className="mt-4 rounded-xl bg-slate-50 p-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-(--text-muted)">
                    Trip
                  </p>

                  {trip ? (
                    <>
                      <Link
                        href={`/admin/trips/${trip.id}`}
                        className="mt-1 inline-block text-sm font-semibold text-(--primary)"
                      >
                        {trip.tripNumber}
                      </Link>

                      <p className="mt-1 text-sm text-(--text-muted)">
                        {trip.origin} →{" "}
                        {trip.destination}
                      </p>
                    </>
                  ) : (
                    <p className="mt-1 text-sm font-medium text-(--text)">
                      Trip #{document.tripId}
                    </p>
                  )}
                </div>

                {/* Details */}
                <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4">
                  <MobileInfo
                    label="Uploaded By"
                    value={
                      document.uploadedBy
                    }
                  />

                  <MobileInfo
                    label="Uploaded At"
                    value={formatDateTime(
                      document.uploadedAt
                    )}
                  />
                </div>

                {/* File */}
                <div className="mt-4 rounded-xl border border-(--border) p-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-(--text-muted)">
                    File
                  </p>

                  {document.fileName ? (
                    <div className="mt-2 flex min-w-0 items-start gap-2">
                      <FileText
                        size={16}
                        className="mt-0.5 shrink-0 text-(--primary)"
                      />

                      <span className="min-w-0 break-all text-sm font-medium text-(--primary)">
                        {document.fileName}
                      </span>
                    </div>
                  ) : (
                    <p className="mt-1 text-sm text-(--text-muted)">
                      No file attached
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-4 grid grid-cols-1 gap-2 min-[480px]:grid-cols-2">
                  {trip && (
                    <Link
                      href={`/admin/trips/${trip.id}`}
                      className="inline-flex items-center justify-center rounded-xl border border-(--border) px-4 py-2.5 text-sm font-semibold text-(--text) transition hover:bg-slate-50"
                    >
                      View Trip
                    </Link>
                  )}

                  <Link
                    href={`/admin/trip-documents/${document.id}`}
                    className="inline-flex items-center justify-center rounded-xl bg-(--primary) px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-(--primary-dark)"
                  >
                    View Document
                  </Link>
                </div>
              </div>
            )
          )}

          {filteredDocuments.length ===
            0 && <EmptyState />}
        </div>

        {/* Desktop Table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[1150px]">
            <thead>
              <tr className="border-b border-(--border) bg-slate-50">
                <TableHead>Trip</TableHead>
                <TableHead>
                  Document
                </TableHead>
                <TableHead>Number</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>
                  Uploaded By
                </TableHead>
                <TableHead>
                  Uploaded At
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </tr>
            </thead>

            <tbody>
              {filteredDocuments.map(
                ({ document, trip }) => (
                  <tr
                    key={document.id}
                    className="border-b border-(--border) last:border-0 hover:bg-slate-50/60"
                  >
                    <TableCell>
                      {trip ? (
                        <Link
                          href={`/admin/trips/${trip.id}`}
                          className="font-semibold text-(--primary) hover:underline"
                        >
                          {trip.tripNumber}
                        </Link>
                      ) : (
                        `Trip #${document.tripId}`
                      )}
                    </TableCell>

                    <TableCell>
                      <span className="font-medium text-(--text)">
                        {formatDocumentType(
                          document.documentType
                        )}
                      </span>
                    </TableCell>

                    <TableCell>
                      {document.documentNumber ??
                        "—"}
                    </TableCell>

                    <TableCell>
                      {trip
                        ? `${trip.origin} → ${trip.destination}`
                        : "—"}
                    </TableCell>

                    <TableCell>
                      {document.uploadedBy}
                    </TableCell>

                    <TableCell>
                      {formatDateTime(
                        document.uploadedAt
                      )}
                    </TableCell>

                    <TableCell>
                      <VerificationBadge
                        status={
                          document.verificationStatus
                        }
                      />
                    </TableCell>

                    <TableCell>
                      <Link
                        href={`/admin/trip-documents/${document.id}`}
                        className="text-sm font-semibold text-(--primary) hover:underline"
                      >
                        View
                      </Link>
                    </TableCell>
                  </tr>
                )
              )}

              {filteredDocuments.length ===
                0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-12 text-center text-sm text-(--text-muted)"
                  >
                    No trip documents found.
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

function VerificationBadge({
  status,
}: {
  status: TripDocumentVerificationStatus;
}) {
  const styles: Record<
    TripDocumentVerificationStatus,
    string
  > = {
    pending:
      "bg-amber-50 text-amber-700",
    verified:
      "bg-green-50 text-green-700",
    rejected: "bg-red-50 text-red-700",
  };

  const labels: Record<
    TripDocumentVerificationStatus,
    string
  > = {
    pending: "Pending",
    verified: "Verified",
    rejected: "Rejected",
  };

  return (
    <span
      className={`inline-flex shrink-0 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {labels[status]}
    </span>
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

function EmptyState() {
  return (
    <div className="px-4 py-10 text-center">
      <FileText
        size={28}
        className="mx-auto text-(--text-muted)"
      />

      <p className="mt-3 text-sm text-(--text-muted)">
        No trip documents found.
      </p>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof FileText;
}) {
  return (
    <div className="min-w-0 rounded-2xl border border-(--border) bg-white p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
          <p className="text-xs text-(--text-muted) sm:text-sm">
            {label}
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

function formatDocumentType(
  type: TripDocumentType
) {
  const labels: Record<
    TripDocumentType,
    string
  > = {
    proof_of_delivery:
      "Proof of Delivery",
    delivery_challan:
      "Delivery Challan",
    invoice: "Invoice",
    bilty: "Bilty",
    gate_pass: "Gate Pass",
    weight_slip: "Weight Slip",
    other: "Other",
  };

  return labels[type];
}

function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(
    "en-PK",
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  ).format(date);
}

const labelClass =
  "mb-2 block text-sm font-medium text-(--text)";

const inputClass =
  "w-full rounded-xl border border-(--border) bg-white px-4 py-2.5 text-sm text-(--text) outline-none transition focus:border-(--primary)";