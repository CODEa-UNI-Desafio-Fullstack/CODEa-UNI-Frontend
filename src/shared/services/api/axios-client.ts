import axios, { AxiosError } from "axios";
import type { AssignmentValidationErrorResponse } from "../../types/api.types";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para normalizar errores 422 de asignación y 400 de negocio
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<AssignmentValidationErrorResponse | { message: string }>) => {
    if (error.response?.status === 422) {
      console.warn("Reglas de negocio incumplidas:", error.response.data);
    }
    return Promise.reject(error);
  }
);
