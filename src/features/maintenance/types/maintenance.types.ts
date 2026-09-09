export interface MaintenanceResource {
  id: string;
  machineryCode: string;
  date: string; // YYYY-MM-DD
  hourMeter: number;
  operatorId: string;
  observation?: string;
}

export interface CreateMaintenanceResource {
  machineryCode: string;
  date: string;
  hourMeter?: number;
  operatorId: string;
  observation?: string;
}

export interface MaintenanceFilterParams {
  machineryCode?: string;
  operatorId?: string;
  machineryTypeId?: number;
  startDate?: string;
  endDate?: string;
}

export interface MaintenanceViewModel extends MaintenanceResource {
  operatorName: string;
  machineryTypeName?: string;
  statusPostMaintenance: string; // "ACTIVO"
}
