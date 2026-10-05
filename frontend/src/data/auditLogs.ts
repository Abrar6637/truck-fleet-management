import { AuditLog } from "@/types/auditLog";

export const auditLogs: AuditLog[] = [
  {
    id: 1,
    userName: "Fleet Admin",
    userRole: "admin",
    action: "verify",
    entity: "trip_document",
    entityId: 1,
    description:
      "Verified Bilty document for trip TRP-1001.",
    ipAddress: "192.168.1.10",
    createdAt: "2026-10-05T11:30:00",
  },
  {
    id: 2,
    userName: "Fleet Admin",
    userRole: "admin",
    action: "payment",
    entity: "trip_payment",
    entityId: 2,
    description:
      "Recorded a customer payment against trip TRP-1002.",
    ipAddress: "192.168.1.10",
    createdAt: "2026-10-05T10:45:00",
  },
  {
    id: 3,
    userName: "Ahmed Khan",
    userRole: "driver",
    action: "status_change",
    entity: "trip",
    entityId: 1,
    description:
      "Updated trip TRP-1001 status to In Transit.",
    createdAt: "2026-10-05T09:20:00",
  },
  {
    id: 4,
    userName: "Fleet Admin",
    userRole: "admin",
    action: "create",
    entity: "fuel",
    entityId: 1,
    description:
      "Added a fuel entry for truck LEC-4582.",
    ipAddress: "192.168.1.10",
    createdAt: "2026-10-04T18:15:00",
  },
  {
    id: 5,
    userName: "Usman Ali",
    userRole: "driver",
    action: "create",
    entity: "expense",
    entityId: 1,
    description:
      "Submitted a toll expense for trip TRP-1002.",
    createdAt: "2026-10-04T16:40:00",
  },
  {
    id: 6,
    userName: "Fleet Admin",
    userRole: "admin",
    action: "update",
    entity: "truck",
    entityId: 4,
    description:
      "Updated maintenance-related information for truck LEA-3045.",
    ipAddress: "192.168.1.10",
    createdAt: "2026-10-04T14:10:00",
  },
  {
    id: 7,
    userName: "Fleet Admin",
    userRole: "admin",
    action: "create",
    entity: "maintenance",
    entityId: 1,
    description:
      "Created a maintenance record for truck LEA-3045.",
    ipAddress: "192.168.1.10",
    createdAt: "2026-10-04T13:50:00",
  },
  {
    id: 8,
    userName: "Fleet Admin",
    userRole: "admin",
    action: "payment",
    entity: "salary",
    entityId: 1,
    description:
      "Recorded a driver salary payment.",
    ipAddress: "192.168.1.10",
    createdAt: "2026-10-03T12:30:00",
  },
  {
    id: 9,
    userName: "Fleet Admin",
    userRole: "admin",
    action: "create",
    entity: "assignment",
    entityId: 2,
    description:
      "Assigned driver Usman Ali to truck LES-9214.",
    ipAddress: "192.168.1.10",
    createdAt: "2026-10-02T11:15:00",
  },
  {
    id: 10,
    userName: "Fleet Admin",
    userRole: "admin",
    action: "login",
    entity: "user",
    description:
      "Fleet Admin signed in to the administration panel.",
    ipAddress: "192.168.1.10",
    createdAt: "2026-10-02T08:05:00",
  },
];