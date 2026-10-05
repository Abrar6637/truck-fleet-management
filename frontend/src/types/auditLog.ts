export type AuditAction =
  | "create"
  | "update"
  | "delete"
  | "verify"
  | "reject"
  | "status_change"
  | "payment"
  | "login"
  | "logout";

export type AuditEntity =
  | "truck"
  | "driver"
  | "assignment"
  | "trip"
  | "trip_document"
  | "truck_document"
  | "driver_document"
  | "fuel"
  | "expense"
  | "maintenance"
  | "salary"
  | "trip_payment"
  | "company_expense"
  | "user"
  | "system";

export interface AuditLog {
  id: number;

  userName: string;
  userRole: "admin" | "driver";

  action: AuditAction;
  entity: AuditEntity;

  entityId?: number;
  description: string;

  ipAddress?: string;

  createdAt: string;
}