export interface MachineryResource {
  code: string;
  machineryType: string;
  hourMeter: number;
  state: "ACTIVE" | "BLOCKED";
}

export interface MachineryTypeResource {
  id: number;
  name: string;
  maintenanceTime: number;
}

export interface UpdateMachineryMachineryTypeResource {
  code: string;
  machineryTypeId: number;
}

export interface CreateMachineryResource {
  code: string;
  MachineryTypeId: number;
}

export interface CreateMachineryTypeResource {
  name: string;
  maintenanceTime: number;
}

export interface MachineryFiltersState {
  searchCode: string;
  machineryTypeId: number | null;
  stateBool: boolean | null; // true: ACTIVA, false: BLOQUEADA, null: Todas
}

export interface MachineryViewModel extends MachineryResource {
  threshold: number;
  machineryTypeId?: number;
  isCritical: boolean;
}
