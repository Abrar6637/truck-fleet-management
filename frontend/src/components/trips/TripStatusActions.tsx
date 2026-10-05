"use client";

import {
  canCancelTrip,
  getNextTripStatus,
  isTripFinished,
  tripStatusLabels,
} from "@/lib/tripStatus";
import { TripStatus } from "@/types/trip";
import { ArrowRight, Ban, CheckCircle2 } from "lucide-react";
import { useState } from "react";

interface TripStatusActionsProps {
  currentStatus: TripStatus;
}

export default function TripStatusActions({
  currentStatus,
}: TripStatusActionsProps) {
  const [message, setMessage] = useState("");

  const nextStatus = getNextTripStatus(currentStatus);
  const finished = isTripFinished(currentStatus);
  const cancelAllowed = canCancelTrip(currentStatus);

  const handleNextStatus = () => {
    if (!nextStatus) return;

    setMessage(
      `Status will change from "${tripStatusLabels[currentStatus]}" to "${tripStatusLabels[nextStatus]}" when the Laravel API is connected.`
    );
  };

  const handleCancel = () => {
    setMessage(
      "Trip cancellation will be saved when the Laravel API is connected."
    );
  };

  return (
    <section className="rounded-2xl border border-(--border) bg-white p-6">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
        <div>
          <h3 className="font-semibold text-(--text)">
            Trip Status Actions
          </h3>

          <p className="mt-1 text-sm text-(--text-muted)">
            Current status:{" "}
            <span className="font-semibold text-(--text)">
              {tripStatusLabels[currentStatus]}
            </span>
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {nextStatus && (
            <button
              type="button"
              onClick={handleNextStatus}
              className="inline-flex items-center gap-2 rounded-xl bg-(--primary) px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-(--primary-dark)"
            >
              Move to {tripStatusLabels[nextStatus]}
              <ArrowRight size={17} />
            </button>
          )}

          {cancelAllowed && (
            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-(--danger) transition hover:bg-red-50"
            >
              <Ban size={17} />
              Cancel Trip
            </button>
          )}

          {finished && (
            <div className="inline-flex items-center gap-2 rounded-xl bg-green-50 px-4 py-2.5 text-sm font-semibold text-green-700">
              <CheckCircle2 size={17} />
              Trip Closed
            </div>
          )}
        </div>
      </div>

      {message && (
        <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-700">
          {message}
        </div>
      )}
    </section>
  );
}