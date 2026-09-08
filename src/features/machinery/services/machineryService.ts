import { apiClient } from "../../../shared/services/api/axios-client";
import type {
  MachineryResource,
  CreateMachineryResource,
  UpdateMachineryMachineryTypeResource,
} from "../types/machinery.types";

export const machineryService = {
  /**
   * Obtiene la lista de maquinarias con filtros opcionales de backend:
   * GET /api/v1/Machinery?state=...&machineryTypeId=...&code=...
   */
  async getMachineries(filters?: {
    state?: boolean;
    machineryTypeId?: number;
    code?: string;
  }): Promise<MachineryResource[]> {
    const params: Record<string, unknown> = {};

    if (filters?.state !== undefined && filters.state !== null) {
      params.state = filters.state;
    }
    if (filters?.machineryTypeId) {
      params.machineryTypeId = filters.machineryTypeId;
    }
    if (filters?.code && filters.code.trim().length > 0) {
      params.code = filters.code.trim();
    }

    const { data } = await apiClient.get<MachineryResource[]>("/Machinery", {
      params,
    });
    return data;
  },

  /**
   * Actualiza el tipo de una maquinaria:
   * PUT /api/v1/Machinery/{code}/machinery-type
   */
  async updateMachineryType(
    code: string,
    machineryTypeId: number
  ): Promise<MachineryResource> {
    const body: UpdateMachineryMachineryTypeResource = {
      code,
      machineryTypeId,
    };
    const { data } = await apiClient.put<MachineryResource>(
      `/Machinery/${encodeURIComponent(code)}/machinery-type`,
      body
    );
    return data;
  },

  /**
   * Registra una nueva maquinaria:
   * POST /api/v1/Machinery
   */
  async createMachinery(
    code: string,
    machineryTypeId: number
  ): Promise<MachineryResource> {
    const body: CreateMachineryResource = {
      code,
      MachineryTypeId: machineryTypeId,
    };
    const { data } = await apiClient.post<MachineryResource>("/Machinery", body);
    return data;
  },

  /**
   * Elimina una maquinaria por su código:
   * DELETE /api/v1/Machinery/{code}
   */
  async deleteMachinery(code: string): Promise<{ message: string }> {
    const { data } = await apiClient.delete<{ message: string }>(
      `/Machinery/${encodeURIComponent(code)}`
    );
    return data;
  },
};
