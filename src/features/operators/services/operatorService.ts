import { apiClient } from "../../../shared/services/api/axios-client";
import type {
  OperatorResource,
  CreateOperatorResource,
  UpdateOperatorNameResource,
  MachineryCertificationResource,
  CreateMachineryCertificationResource,
  UpdateMachineryCertificationResource,
  OperatorFilterParams,
} from "../types/operator.types";

export const operatorService = {
  /**
   * Obtiene la lista de operadores con filtros opcionales delegados en el backend.
   * Filtros soportados nativamente por Spring Boot:
   * - name
   * - machineryTypeId
   */
  async getOperators(params?: OperatorFilterParams): Promise<OperatorResource[]> {
    const cleanParams: Record<string, string | number> = {};
    if (params) {
      if (params.name?.trim()) {
        cleanParams.name = params.name.trim();
      }
      if (params.machineryTypeId !== undefined && params.machineryTypeId !== null) {
        cleanParams.machineryTypeId = params.machineryTypeId;
      }
    }

    const { data } = await apiClient.get<OperatorResource[]>("/operators", {
      params: cleanParams,
    });
    return data;
  },

  /**
   * Registra un nuevo operador en el sistema.
   */
  async createOperator(payload: CreateOperatorResource): Promise<OperatorResource> {
    const { data } = await apiClient.post<OperatorResource>("/operators", payload);
    return data;
  },

  /**
   * Actualiza el nombre de un operador existente.
   */
  async updateOperatorName(
    id: string,
    payload: UpdateOperatorNameResource
  ): Promise<OperatorResource> {
    const { data } = await apiClient.put<OperatorResource>(`/operators/${id}`, payload);
    return data;
  },

  /**
   * Obtiene todas las certificaciones de maquinaria de un operador específico.
   */
  async getOperatorCertifications(
    operatorId: string
  ): Promise<MachineryCertificationResource[]> {
    const { data } = await apiClient.get<MachineryCertificationResource[]>(
      `/operators/${operatorId}/certifications`
    );
    return data;
  },

  /**
   * Registra una nueva certificación de maquinaria para un operador.
   */
  async addCertification(
    operatorId: string,
    payload: CreateMachineryCertificationResource
  ): Promise<MachineryCertificationResource> {
    const { data } = await apiClient.post<MachineryCertificationResource>(
      `/operators/${operatorId}/certifications`,
      payload
    );
    return data;
  },

  /**
   * Renueva o actualiza la fecha de vencimiento de una certificación existente.
   */
  async renewCertification(
    operatorId: string,
    machineryTypeId: number,
    payload: UpdateMachineryCertificationResource
  ): Promise<MachineryCertificationResource> {
    const { data } = await apiClient.put<MachineryCertificationResource>(
      `/operators/${operatorId}/certifications/${machineryTypeId}`,
      payload
    );
    return data;
  },

  /**
   * Elimina la certificación de maquinaria de un operador.
   */
  async deleteCertification(
    operatorId: string,
    machineryTypeId: number
  ): Promise<void> {
    await apiClient.delete(
      `/operators/${operatorId}/certifications/${machineryTypeId}`
    );
  },
};
