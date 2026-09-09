export interface MachineryItem {
  code: string;
  machineryType: string;
  hourMeter: number;
  state: "ACTIVE" | "BLOCKED";
}

export interface ProjectionItem {
  machineryCode: string;
  machineryTypeId: number;
  machineryTypeName: string;
  currentHourMeter: number;
  maintenanceThreshold: number;
  remainingHours: number;
  projectedHours: number;
  differenceHours: number;
  estimatedThresholdDate: string;
  estimatedThresholdShiftId?: string;
  estimatedThresholdShiftType?: string;
}

export interface ShiftItem {
  id: string;
  date: string;
  shiftType: string;
  duration: number;
}

export interface DashboardKpiStats {
  totalMachinery: number;
  activeMachinery: number;
  blockedMachinery: number;
  upcomingBlockedCount: number;
}
