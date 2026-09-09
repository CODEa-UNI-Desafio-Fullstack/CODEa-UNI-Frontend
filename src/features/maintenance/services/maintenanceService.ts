import { apiClient } from "../../../shared/services/api/axios-client";
import type {
  MaintenanceResource,
  CreateMaintenanceResource,
  MaintenanceFilterParams,
} from "../types/maintenance.types";
import type { OperatorOption } from "../../operations/types/operations.types";

export const maintenanceService = {
  /**
   * Obtiene la lista de mantenimientos aplicando filtros opcionales delegados en el backend.
   * Filtros soportados nativamente por Spring Boot:
   * - machineryCode
   * - operatorId
   * - machineryTypeId
   * - startDate
   * - endDate
   */
  async getMaintenances(params?: MaintenanceFilterParams): Promise<MaintenanceResource[]> {
    // Limpiar claves vacías o undefined antes de enviar
    const cleanParams: Record<string, string | number> = {};
    if (params) {
      if (params.machineryCode?.trim()) {
        cleanParams.machineryCode = params.machineryCode.trim();
      }
      if (params.operatorId?.trim()) {
        cleanParams.operatorId = params.operatorId.trim();
      }
      if (params.machineryTypeId !== undefined && params.machineryTypeId !== null) {
        cleanParams.machineryTypeId = params.machineryTypeId;
      }
      if (params.startDate?.trim()) {
        cleanParams.startDate = params.startDate.trim();
      }
      if (params.endDate?.trim()) {
        cleanParams.endDate = params.endDate.trim();
      }
    }

    const { data } = await apiClient.get<MaintenanceResource[]>("/maintenances", {
      params: cleanParams,
    });
    return data;
  },

  /**
   * Registra una nueva intervención de mantenimiento preventivo.
   * Al completarse, reinicia el horómetro a 0.0 hrs y reactiva la maquinaria.
   */
  async createMaintenance(payload: CreateMaintenanceResource): Promise<MaintenanceResource> {
    const { data } = await apiClient.post<MaintenanceResource>("/maintenances", payload);
    return data;
  },

  /**
   * Obtiene los operadores para asociar el nombre del responsable técnico.
   */
  async getOperators(): Promise<OperatorOption[]> {
    const { data } = await apiClient.get<OperatorOption[]>("/operators");
    return data;
  },
};
