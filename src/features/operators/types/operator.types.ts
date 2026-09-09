export interface OperatorResource {
  id: string;
  name: string;
}

export interface CreateOperatorResource {
  name: string;
}

export interface UpdateOperatorNameResource {
  name: string;
}

export interface MachineryCertificationResource {
  operatorId: string;
  machineryTypeId: number;
  expirationDate: string; // Formato YYYY-MM-DD
}

export interface CreateMachineryCertificationResource {
  machineryTypeId: number;
  expirationDate: string; // Formato YYYY-MM-DD
}

export interface UpdateMachineryCertificationResource {
  expirationDate: string; // Formato YYYY-MM-DD
}

export interface CertificationViewModel {
  operatorId: string;
  machineryTypeId: number;
  machineryTypeName: string;
  expirationDate: string;
  isExpired: boolean;
}

export interface OperatorViewModel {
  id: string;
  name: string;
  certifications: CertificationViewModel[];
  validCount: number;
  expiredCount: number;
  status: "HABILITADO" | "NO HABILITADO" | "HABILITADA";
}

export interface OperatorFilterParams {
  name?: string;
  machineryTypeId?: number;
}

export interface OperatorFilterInputs {
  name: string;
}
