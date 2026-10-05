export type TripExpenseCategory =
  | "toll"
  | "food"
  | "loading"
  | "unloading"
  | "parking"
  | "repair"
  | "permit"
  | "other";

export interface TripExpense {
  id: number;

  tripId: number;
  truckId: number;
  driverId?: number;

  category: TripExpenseCategory;
  amount: number;
  expenseDate: string;

  description?: string;

  receiptNumber?: string;
  receiptImage?: string;

  createdBy: string;
  createdAt: string;
}