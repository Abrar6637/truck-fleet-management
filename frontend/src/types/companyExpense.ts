export type CompanyExpenseCategory =
  | "office_rent"
  | "office_utility"
  | "staff_salary"
  | "insurance"
  | "tax"
  | "software"
  | "legal"
  | "marketing"
  | "bank_charge"
  | "miscellaneous";

export type CompanyExpensePaymentMethod =
  | "cash"
  | "bank_transfer"
  | "jazzcash"
  | "easypaisa"
  | "cheque"
  | "other";

export interface CompanyExpense {
  id: number;

  title: string;
  category: CompanyExpenseCategory;

  amount: number;
  expenseDate: string;

  paymentMethod: CompanyExpensePaymentMethod;

  referenceNumber?: string;

  vendorName?: string;

  description?: string;

  receiptFileName?: string;
  receiptFileUrl?: string;

  createdBy: string;
  createdAt: string;
}