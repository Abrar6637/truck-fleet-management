export type ReportType =
  | "trips"
  | "trucks"
  | "drivers"
  | "fuel"
  | "expenses"
  | "income"
  | "profit_loss"
  | "maintenance"
  | "tyres"
  | "salaries"
  | "document_expiry";

export interface ReportOption {
  id: ReportType;
  title: string;
  description: string;
}