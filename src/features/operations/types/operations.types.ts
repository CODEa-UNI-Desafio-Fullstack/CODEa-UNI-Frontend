export interface ShiftResource {
  id: string;
  date: string;
  shiftType: string; // "Dia" | "Noche"
  duration: number;
}

export interface CreateShiftResource {
  date: string;
  shiftType: boolean; // true = Dia, false = Noche
  duration: number;
}

export interface UpdateShiftResource {
  date: string;
  shiftType: boolean;
  duration: number;
}

export interface ShiftFilterParams {
  date?: string;
  shiftType?: boolean;
}

export interface AssignmentDetailResource {
  id: string;
  operatorId: string;
  operatorName: string;
  machineryCode: string;
  machineryTypeId: number;
  machineryTypeName: string;
  shiftId: string;
  shiftDate: string;
  shiftType: boolean;
  shiftDuration: number;
  timeStart: string | null;
  timeEnd: string | null;
  actualShiftTime: number | null;
}

export interface CreateAssignmentResource {
  operatorId: string;
  machineryCode: string;
  shiftId: string;
}

export interface StartAssignmentResource {
  timeStart?: string; // Format "HH:mm"
}

export interface EndAssignmentResource {
  timeEnd?: string; // Format "HH:mm"
}

export interface AssignmentFilterParams {
  operatorName?: string;
  machineryType?: string;
  machineryCode?: string;
  startDate?: string;
  endDate?: string;
  shiftType?: boolean;
}

export interface ShiftFilterInputs {
  date: string;
  shiftType: string; // "all" | "Dia" | "Noche"
}

export interface AssignmentFilterInputs {
  operatorName: string;
  machineryType: string; // "all" | machineryTypeName
  machineryCode: string;
  startDate: string;
  endDate: string;
  shiftType: string; // "all" | "true" | "false"
}

export interface OperatorOption {
  id: string;
  name: string;
}
