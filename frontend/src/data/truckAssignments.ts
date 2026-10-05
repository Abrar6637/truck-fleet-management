import { TruckAssignment } from "@/types/truckAssignment";

export const truckAssignments: TruckAssignment[] = [
  {
    id: 1,
    truckId: 1,
    driverId: 1,
    assignedAt: "2026-01-10",
    status: "active",
    notes: "Assigned for long-route operations.",
    createdBy: "Fleet Admin",
  },

  {
    id: 2,
    truckId: 2,
    driverId: 2,
    assignedAt: "2026-03-15",
    status: "active",
    createdBy: "Fleet Admin",
  },

  {
    id: 3,
    truckId: 3,
    driverId: 3,
    assignedAt: "2026-02-05",
    status: "active",
    notes: "Primary heavy cargo assignment.",
    createdBy: "Fleet Admin",
  },

  {
    id: 4,
    truckId: 4,
    driverId: 4,
    assignedAt: "2026-04-12",
    status: "active",
    createdBy: "Fleet Admin",
  },

  {
    id: 5,
    truckId: 6,
    driverId: 5,
    assignedAt: "2026-05-20",
    status: "active",
    createdBy: "Fleet Admin",
  },

  // Previous completed assignment
  {
    id: 6,
    truckId: 7,
    driverId: 1,
    assignedAt: "2025-05-01",
    unassignedAt: "2025-12-31",
    status: "completed",
    notes: "Driver moved to another truck.",
    createdBy: "Fleet Admin",
  },
];