import { apiClient } from "../../../shared/services/api/axios-client";
import type {
  MachineryItem,
  ProjectionItem,
  ShiftItem,
} from "../types/projection.types";

export const dashboardService = {
  /**
   * Obtiene la lista de proyecciones preventivas a 7 días
   * GET /api/v1/assignments/projections
   */
  async getProjections(): Promise<ProjectionItem[]> {
    const { data } = await apiClient.get<ProjectionItem[]>(
      "/assignments/projections"
    );
    return data;
  },

  /**
   * Obtiene el inventario completo de maquinarias de la flota
   * GET /api/v1/Machinery
   */
  async getMachinery(): Promise<MachineryItem[]> {
    const { data } = await apiClient.get<MachineryItem[]>("/Machinery");
    return data;
  },

  /**
   * Obtiene los turnos programados para resolver detalles de turnos si es necesario
   * GET /api/v1/shifts
   */
  async getShifts(): Promise<ShiftItem[]> {
    const { data } = await apiClient.get<ShiftItem[]>("/shifts");
    return data;
  },
};
