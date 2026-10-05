import { Notification } from "@/types/notification";

export const notifications: Notification[] = [
  {
    id: 1,
    type: "license_expiry",
    priority: "high",
    title: "Driver License Expiring Soon",
    message:
      "Hamza Iqbal's driving license will expire on 18 October 2026.",
    isRead: false,
    actionUrl: "/admin/drivers/4",
    createdAt: "2026-10-05T09:00:00",
  },
  {
    id: 2,
    type: "document_expiry",
    priority: "critical",
    title: "Truck Document Expired",
    message:
      "A truck document has expired and requires immediate attention.",
    isRead: false,
    actionUrl: "/admin/reports/document-expiry",
    createdAt: "2026-10-05T08:30:00",
  },
  {
    id: 3,
    type: "document_verification",
    priority: "medium",
    title: "Trip Document Pending Verification",
    message:
      "A delivery challan for trip TRP-1002 is waiting for verification.",
    isRead: false,
    actionUrl: "/admin/trip-documents/3",
    createdAt: "2026-10-04T15:30:00",
  },
  {
    id: 4,
    type: "trip_update",
    priority: "medium",
    title: "Trip In Transit",
    message:
      "Trip TRP-1001 from Lahore to Karachi is currently in transit.",
    isRead: true,
    actionUrl: "/admin/trips/1",
    createdAt: "2026-10-04T12:00:00",
    readAt: "2026-10-04T12:30:00",
  },
  {
    id: 5,
    type: "maintenance",
    priority: "high",
    title: "Truck Maintenance Reminder",
    message:
      "A truck has an upcoming service requirement. Review the maintenance schedule.",
    isRead: false,
    actionUrl: "/admin/maintenance",
    createdAt: "2026-10-03T10:15:00",
  },
  {
    id: 6,
    type: "salary",
    priority: "medium",
    title: "Driver Salary Outstanding",
    message:
      "One or more driver salary records still have an outstanding balance.",
    isRead: false,
    actionUrl: "/admin/salaries",
    createdAt: "2026-10-03T09:00:00",
  },
  {
    id: 7,
    type: "payment",
    priority: "high",
    title: "Trip Payment Outstanding",
    message:
      "A completed trip still has an outstanding customer payment.",
    isRead: false,
    actionUrl: "/admin/finance",
    createdAt: "2026-10-02T14:00:00",
  },
  {
    id: 8,
    type: "system",
    priority: "low",
    title: "Fleet Management System",
    message:
      "System data is currently running with frontend mock records.",
    isRead: true,
    createdAt: "2026-10-01T08:00:00",
    readAt: "2026-10-01T08:10:00",
  },
];