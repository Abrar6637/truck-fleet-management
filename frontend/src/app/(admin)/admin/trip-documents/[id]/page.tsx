"use client";

import { tripDocuments } from "@/data/tripDocuments";
import { trips } from "@/data/trips";
import {
  TripDocumentType,
  TripDocumentVerificationStatus,
} from "@/types/tripDocument";
import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  FileText,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function TripDocumentDetailsPage() {
  const params = useParams();

  const documentId = Number(params.id);

  const document = tripDocuments.find(
    (item) => item.id === documentId
  );

  const trip = document
    ? trips.find(
        (item) => item.id === document.tripId
      )
    : undefined;

  const [verificationStatus, setVerificationStatus] =
    useState<TripDocumentVerificationStatus>(
      document?.verificationStatus ?? "pending"
    );

  if (!document) {
    return (
      <div className="rounded-2xl border border-(--border) bg-white p-8">
        <h2 className="text-xl font-bold text-(--text)">
          Document Not Found
        </h2>

        <p className="mt-2 text-sm text-(--text-muted)">
          The requested trip document could not be
          found.
        </p>

        <Link
          href="/admin/trip-documents"
          className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-(--primary) hover:underline"
        >
          <ArrowLeft size={17} />
          Back to Trip Documents
        </Link>
      </div>
    );
  }

  function handleVerify() {
    setVerificationStatus("verified");

    // Frontend mock only.
    // Laravel API will update this in database later.
    console.log(
      `Document ${document?.id} verified`
    );
  }

  function handleReject() {
    setVerificationStatus("rejected");

    // Frontend mock only.
    // Laravel API will update this in database later.
    console.log(
      `Document ${document?.id} rejected`
    );
  }

  return (
    <div className="space-y-7">
      {/* Back */}
      <Link
        href="/admin/trip-documents"
        className="inline-flex items-center gap-2 text-sm font-semibold text-(--primary) hover:underline"
      >
        <ArrowLeft size={17} />
        Back to Trip Documents
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-bold text-(--text)">
              {formatDocumentType(
                document.documentType
              )}
            </h2>

            <VerificationBadge
              status={verificationStatus}
            />
          </div>

          <p className="mt-2 text-sm text-(--text-muted)">
            {document.documentNumber
              ? `Document #${document.documentNumber}`
              : "Trip document details"}
          </p>
        </div>

        {/* Verification Actions */}
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleVerify}
            disabled={
              verificationStatus === "verified"
            }
            className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CheckCircle2 size={17} />
            Verify
          </button>

          <button
            type="button"
            onClick={handleReject}
            disabled={
              verificationStatus === "rejected"
            }
            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <XCircle size={17} />
            Reject
          </button>
        </div>
      </div>

      {/* Trip Information */}
      <section className={sectionClass}>
        <SectionTitle
          icon={FileText}
          title="Trip Information"
          description="Trip associated with this document."
        />

        {trip ? (
          <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <InfoItem
              label="Trip Number"
              value={trip.tripNumber}
            />

            <InfoItem
              label="Origin"
              value={trip.origin}
            />

            <InfoItem
              label="Destination"
              value={trip.destination}
            />

            <InfoItem
              label="Trip Status"
              value={formatLabel(trip.status)}
            />
          </div>
        ) : (
          <p className="mt-5 text-sm text-(--text-muted)">
            Related trip could not be found.
          </p>
        )}

        {trip && (
          <div className="mt-5">
            <Link
              href={`/admin/trips/${trip.id}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-(--primary) hover:underline"
            >
              View Trip Details
              <ExternalLink size={15} />
            </Link>
          </div>
        )}
      </section>

      {/* Document Details */}
      <section className={sectionClass}>
        <SectionTitle
          icon={FileText}
          title="Document Details"
          description="Information about the uploaded trip document."
        />

        <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <InfoItem
            label="Document Type"
            value={formatDocumentType(
              document.documentType
            )}
          />

          <InfoItem
            label="Document Number"
            value={
              document.documentNumber ?? "—"
            }
          />

          <InfoItem
            label="Verification Status"
            value={formatLabel(
              verificationStatus
            )}
          />

          <InfoItem
            label="Uploaded By"
            value={document.uploadedBy}
          />

          <InfoItem
            label="Uploaded At"
            value={formatDateTime(
              document.uploadedAt
            )}
          />

          <InfoItem
            label="File Name"
            value={document.fileName ?? "—"}
          />
        </div>
      </section>

      {/* File */}
      <section className={sectionClass}>
        <SectionTitle
          icon={FileText}
          title="Uploaded File"
          description="Document file associated with this record."
        />

        {document.fileName ? (
          <div className="mt-5 flex flex-col gap-4 rounded-xl border border-(--border) bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-(--primary)">
                <FileText size={20} />
              </div>

              <div>
                <p className="text-sm font-semibold text-(--text)">
                  {document.fileName}
                </p>

                <p className="mt-1 text-xs text-(--text-muted)">
                  Trip document attachment
                </p>
              </div>
            </div>

            {/*
              Mock fileUrl values currently do not
              point to real uploaded files.

              When Laravel storage/API is connected,
              this can become an actual View/Download
              link.
            */}

            <span className="text-xs font-medium text-(--text-muted)">
              File preview available after backend
              integration
            </span>
          </div>
        ) : (
          <p className="mt-5 text-sm text-(--text-muted)">
            No file attached.
          </p>
        )}
      </section>

      {/* Notes */}
      <section className={sectionClass}>
        <h3 className="font-semibold text-(--text)">
          Notes
        </h3>

        <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-(--text-muted)">
          {document.notes ||
            "No notes added for this document."}
        </p>
      </section>

      {/* Frontend Notice */}
      <section className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
        <p className="text-sm font-semibold text-(--text)">
          Frontend Mock Verification
        </p>

        <p className="mt-1 text-sm text-(--text-muted)">
          Verify and Reject buttons currently update
          this page only. After Laravel backend
          integration, the verification status will
          be saved permanently in MySQL.
        </p>
      </section>
    </div>
  );
}

function SectionTitle({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof FileText;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 border-b border-(--border) pb-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-(--primary)">
        <Icon size={19} />
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
      <p className="text-xs font-medium uppercase tracking-wide text-(--text-muted)">
        {label}
      </p>

      <p className="mt-1.5 text-sm font-semibold text-(--text)">
        {value}
      </p>
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
    pending: "bg-amber-50 text-amber-700",
    verified: "bg-green-50 text-green-700",
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
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}

function formatDocumentType(
  type: TripDocumentType
) {
  const labels: Record<
    TripDocumentType,
    string
  > = {
    proof_of_delivery: "Proof of Delivery",
    delivery_challan: "Delivery Challan",
    invoice: "Invoice",
    bilty: "Bilty",
    gate_pass: "Gate Pass",
    weight_slip: "Weight Slip",
    other: "Other",
  };

  return labels[type];
}

function formatLabel(value: string) {
  return value
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");
}

function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-PK", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

const sectionClass =
  "rounded-2xl border border-(--border) bg-white p-5";