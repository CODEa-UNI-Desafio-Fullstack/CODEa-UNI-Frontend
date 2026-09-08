import { apiClient } from "../../../shared/services/api/axios-client";
import type {
  ShiftResource,
  CreateShiftResource,
  UpdateShiftResource,
  ShiftFilterParams,
} from "../types/operations.types";

export const shiftService = {
  async getShifts(params?: ShiftFilterParams): Promise<ShiftResource[]> {
    const { data } = await apiClient.get<ShiftResource[]>("/shifts", { params });
    return data;
  },

  async createShift(payload: CreateShiftResource): Promise<ShiftResource> {
    const { data } = await apiClient.post<ShiftResource>("/shifts", payload);
    return data;
  },

  async updateShift(id: string, payload: UpdateShiftResource): Promise<ShiftResource> {
    const { data } = await apiClient.put<ShiftResource>(`/shifts/${id}`, payload);
    return data;
  },

  async deleteShift(id: string): Promise<{ message: string }> {
    const { data } = await apiClient.delete<{ message: string }>(`/shifts/${id}`);
    return data;
  },
};
