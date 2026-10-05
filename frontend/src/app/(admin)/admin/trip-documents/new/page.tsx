"use client";

import { trips } from "@/data/trips";
import { TripDocumentType } from "@/types/tripDocument";
import {
  ArrowLeft,
  FileText,
  Upload,
} from "lucide-react";
import Link from "next/link";
import {
  FormEvent,
  useMemo,
  useState,
} from "react";

export default function AddTripDocumentPage() {
  const [tripId, setTripId] = useState("");
  const [documentType, setDocumentType] =
    useState<TripDocumentType>(
      "proof_of_delivery"
    );
  const [documentNumber, setDocumentNumber] =
    useState("");
  const [file, setFile] =
    useState<File | null>(null);
  const [notes, setNotes] = useState("");

  const selectedTrip = useMemo(
    () =>
      trips.find(
        (trip) => trip.id === Number(tripId)
      ),
    [tripId]
  );

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!tripId) {
      alert("Please select a trip.");
      return;
    }

    if (!file) {
      alert("Please select a document file.");
      return;
    }

    // Frontend mock only.
    // Laravel API will handle actual upload later.
    console.log({
      tripId: Number(tripId),
      documentType,
      documentNumber:
        documentNumber.trim() || undefined,
      fileName: file.name,
      notes: notes.trim() || undefined,
      verificationStatus: "pending",
    });

    alert(
      "Trip document form is working. Actual upload will be connected with Laravel backend later."
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/admin/trip-documents"
          className="inline-flex items-center gap-2 text-sm font-semibold text-(--primary) hover:underline"
        >
          <ArrowLeft size={17} />
          Back to Trip Documents
        </Link>

        <div className="mt-4">
          <h2 className="text-2xl font-bold text-(--text)">
            Add Trip Document
          </h2>

          <p className="mt-1 text-sm text-(--text-muted)">
            Upload POD, bilty, challan, invoice,
            weight slip or another document against
            a trip.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Trip */}
        <section className={sectionClass}>
          <div className="flex items-center gap-3 border-b border-(--border) pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-(--primary)">
              <FileText size={19} />
            </div>

            <div>
              <h3 className="font-semibold text-(--text)">
                Trip Information
              </h3>

              <p className="text-sm text-(--text-muted)">
                Select the trip this document
                belongs to.
              </p>
            </div>
          </div>

          <div className="mt-5">
            <label className={labelClass}>
              Trip *
            </label>

            <select
              value={tripId}
              onChange={(event) =>
                setTripId(event.target.value)
              }
              className={inputClass}
              required
            >
              <option value="">
                Select Trip
              </option>

              {trips.map((trip) => (
                <option
                  key={trip.id}
                  value={String(trip.id)}
                >
                  {trip.tripNumber} —{" "}
                  {trip.origin} →{" "}
                  {trip.destination}
                </option>
              ))}
            </select>
          </div>

          {selectedTrip && (
            <div className="mt-4 grid gap-4 rounded-xl bg-slate-50 p-4 sm:grid-cols-3">
              <InfoItem
                label="Trip"
                value={selectedTrip.tripNumber}
              />

              <InfoItem
                label="Route"
                value={`${selectedTrip.origin} → ${selectedTrip.destination}`}
              />

              <InfoItem
                label="Status"
                value={formatTripStatus(
                  selectedTrip.status
                )}
              />
            </div>
          )}
        </section>

        {/* Document */}
        <section className={sectionClass}>
          <h3 className="font-semibold text-(--text)">
            Document Details
          </h3>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <div>
              <label className={labelClass}>
                Document Type *
              </label>

              <select
                value={documentType}
                onChange={(event) =>
                  setDocumentType(
                    event.target
                      .value as TripDocumentType
                  )
                }
                className={inputClass}
              >
                <option value="proof_of_delivery">
                  Proof of Delivery (POD)
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

            <div>
              <label className={labelClass}>
                Document Number
              </label>

              <input
                value={documentNumber}
                onChange={(event) =>
                  setDocumentNumber(
                    event.target.value
                  )
                }
                placeholder="e.g. POD-1001"
                className={inputClass}
              />
            </div>
          </div>

          {/* File */}
          <div className="mt-5">
            <label className={labelClass}>
              Document File *
            </label>

            <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-(--border) bg-slate-50 px-6 py-8 text-center transition hover:border-(--primary)">
              <Upload
                size={28}
                className="text-(--primary)"
              />

              <span className="mt-3 text-sm font-semibold text-(--text)">
                {file
                  ? file.name
                  : "Choose document file"}
              </span>

              <span className="mt-1 text-xs text-(--text-muted)">
                PDF, JPG or PNG
              </span>

              <input
                type="file"
                accept=".pdf,image/jpeg,image/png"
                onChange={(event) =>
                  setFile(
                    event.target.files?.[0] ??
                      null
                  )
                }
                className="hidden"
              />
            </label>
          </div>

          <div className="mt-5">
            <label className={labelClass}>
              Notes
            </label>

            <textarea
              value={notes}
              onChange={(event) =>
                setNotes(event.target.value)
              }
              rows={4}
              placeholder="Optional document notes..."
              className={inputClass}
            />
          </div>
        </section>

        {/* Verification note */}
        <section className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
          <p className="text-sm font-semibold text-(--text)">
            Verification Status
          </p>

          <p className="mt-1 text-sm text-(--text-muted)">
            New documents will initially be marked
            as Pending. Admin verification will be
            connected to the real backend workflow
            later.
          </p>
        </section>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            href="/admin/trip-documents"
            className="inline-flex items-center justify-center rounded-xl border border-(--border) bg-white px-5 py-2.5 text-sm font-semibold text-(--text) transition hover:bg-slate-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-(--primary) px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-(--primary-dark)"
          >
            <Upload size={17} />
            Add Document
          </button>
        </div>
      </form>
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

      <p className="mt-1 text-sm font-semibold text-(--text)">
        {value}
      </p>
    </div>
  );
}

function formatTripStatus(status: string) {
  return status
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");
}

const sectionClass =
  "rounded-2xl border border-(--border) bg-white p-5";

const labelClass =
  "mb-2 block text-sm font-medium text-(--text)";

const inputClass =
  "w-full rounded-xl border border-(--border) bg-white px-4 py-2.5 text-sm text-(--text) outline-none transition focus:border-(--primary)";