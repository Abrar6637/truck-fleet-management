export type NotificationType =
  | "document_expiry"
  | "license_expiry"
  | "trip_update"
  | "maintenance"
  | "salary"
  | "payment"
  | "document_verification"
  | "system";

export type NotificationPriority =
  | "low"
  | "medium"
  | "high"
  | "critical";

export interface Notification {
  id: number;

  type: NotificationType;
  priority: NotificationPriority;

  title: string;
  message: string;

  isRead: boolean;

  actionUrl?: string;

  createdAt: string;
  readAt?: string;
}