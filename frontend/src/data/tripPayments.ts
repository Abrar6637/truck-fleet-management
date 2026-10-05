import { TripPayment } from "@/types/tripPayment";

export const tripPayments: TripPayment[] = [
  // TRP-1001 — Amount: PKR 185,000
  // Partially paid: 100,000 / 185,000
  {
    id: 1,
    tripId: 1,
    amount: 50000,
    paymentType: "advance",
    paymentMethod: "bank_transfer",
    paymentDate: "2026-10-01",
    referenceNumber: "TRP1001-ADV-001",
    notes: "Advance received before trip departure.",
    createdBy: "Fleet Admin",
    createdAt: "2026-10-01T10:00:00",
  },
  {
    id: 2,
    tripId: 1,
    amount: 50000,
    paymentType: "partial",
    paymentMethod: "bank_transfer",
    paymentDate: "2026-10-03",
    referenceNumber: "TRP1001-PAY-002",
    notes: "Second payment received during trip.",
    createdBy: "Fleet Admin",
    createdAt: "2026-10-03T14:30:00",
  },

  // TRP-1002 — Amount: PKR 95,000
  // Fully paid: 95,000 / 95,000
  {
    id: 3,
    tripId: 2,
    amount: 40000,
    paymentType: "advance",
    paymentMethod: "cash",
    paymentDate: "2026-10-02",
    notes: "Advance received at pickup.",
    createdBy: "Fleet Admin",
    createdAt: "2026-10-02T09:00:00",
  },
  {
    id: 4,
    tripId: 2,
    amount: 55000,
    paymentType: "final",
    paymentMethod: "bank_transfer",
    paymentDate: "2026-10-04",
    referenceNumber: "TRP1002-FINAL",
    notes: "Final payment received.",
    createdBy: "Fleet Admin",
    createdAt: "2026-10-04T16:00:00",
  },

  // TRP-1003 — Amount: PKR 120,000
  // Partially paid: 30,000 / 120,000
  {
    id: 5,
    tripId: 3,
    amount: 30000,
    paymentType: "advance",
    paymentMethod: "jazzcash",
    paymentDate: "2026-10-02",
    referenceNumber: "TRP1003-ADV",
    createdBy: "Fleet Admin",
    createdAt: "2026-10-02T11:15:00",
  },

  // TRP-1004 — Amount: PKR 85,000
  // Fully paid in two installments
  {
    id: 6,
    tripId: 4,
    amount: 35000,
    paymentType: "advance",
    paymentMethod: "cash",
    paymentDate: "2026-09-27",
    createdBy: "Fleet Admin",
    createdAt: "2026-09-27T10:00:00",
  },
  {
    id: 7,
    tripId: 4,
    amount: 50000,
    paymentType: "final",
    paymentMethod: "bank_transfer",
    paymentDate: "2026-09-30",
    referenceNumber: "TRP1004-FINAL",
    createdBy: "Fleet Admin",
    createdAt: "2026-09-30T15:00:00",
  },

  // TRP-1005 — Cancelled trip
  // No payment intentionally

  // TRP-1006 — Amount: PKR 105,000
  // Advance only: 25,000 / 105,000
  {
    id: 8,
    tripId: 6,
    amount: 25000,
    paymentType: "advance",
    paymentMethod: "easypaisa",
    paymentDate: "2026-10-05",
    referenceNumber: "TRP1006-ADV",
    notes: "Advance for upcoming Islamabad to Lahore trip.",
    createdBy: "Fleet Admin",
    createdAt: "2026-10-05T09:30:00",
  },
];