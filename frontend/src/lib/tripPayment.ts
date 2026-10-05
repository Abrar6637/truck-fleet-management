import { TripPayment } from "@/types/tripPayment";

export type TripPaymentStatus =
  | "unpaid"
  | "partially_paid"
  | "paid";

export interface TripPaymentSummary {
  tripAmount: number;
  paidAmount: number;
  remainingAmount: number;
  paymentStatus: TripPaymentStatus;
}

export function calculateTripPayment(
  tripId: number,
  tripAmount: number,
  payments: TripPayment[]
): TripPaymentSummary {
  const safeTripAmount = Math.max(0, tripAmount);

  const paidAmount = payments
    .filter((payment) => payment.tripId === tripId)
    .reduce(
      (total, payment) =>
        total + Math.max(0, payment.amount),
      0
    );

  const remainingAmount = Math.max(
    0,
    safeTripAmount - paidAmount
  );

  let paymentStatus: TripPaymentStatus = "unpaid";

  if (
    safeTripAmount === 0 ||
    paidAmount >= safeTripAmount
  ) {
    paymentStatus = "paid";
  } else if (paidAmount > 0) {
    paymentStatus = "partially_paid";
  }

  return {
    tripAmount: safeTripAmount,
    paidAmount,
    remainingAmount,
    paymentStatus,
  };
}