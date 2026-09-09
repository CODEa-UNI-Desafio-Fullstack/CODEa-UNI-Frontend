import { apiClient } from "../../../shared/services/api/axios-client";
import type {
  AssignmentDetailResource,
  CreateAssignmentResource,
  StartAssignmentResource,
  EndAssignmentResource,
  AssignmentFilterParams,
  OperatorOption,
} from "../types/operations.types";

export const assignmentService = {
  async getAssignments(params?: AssignmentFilterParams): Promise<AssignmentDetailResource[]> {
    const { data } = await apiClient.get<AssignmentDetailResource[]>("/assignments", { params });
    return data;
  },

  async createAssignment(payload: CreateAssignmentResource): Promise<unknown> {
    const { data } = await apiClient.post("/assignments", payload);
    return data;
  },

  async startAssignment(id: string, timeStart?: string): Promise<unknown> {
    const payload: StartAssignmentResource = timeStart ? { timeStart } : {};
    const { data } = await apiClient.patch(`/assignments/${id}/start`, payload);
    return data;
  },

  async endAssignment(id: string, timeEnd?: string): Promise<unknown> {
    const payload: EndAssignmentResource = timeEnd ? { timeEnd } : {};
    const { data } = await apiClient.patch(`/assignments/${id}/end`, payload);
    return data;
  },

  async deleteAssignment(id: string): Promise<{ message: string }> {
    const { data } = await apiClient.delete<{ message: string }>(`/assignments/${id}`);
    return data;
  },

  async getOperators(): Promise<OperatorOption[]> {
    const { data } = await apiClient.get<OperatorOption[]>("/operators");
    return data;
  },
};
