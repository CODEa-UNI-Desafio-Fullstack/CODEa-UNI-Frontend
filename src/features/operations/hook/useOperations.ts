import { useState, useEffect, useCallback } from "react";
import { shiftService } from "../services/shiftService";
import { assignmentService } from "../services/assignmentService";
import { machineryService } from "../../machinery/services/machineryService";
import type {
  ShiftResource,
  CreateShiftResource,
  UpdateShiftResource,
  AssignmentDetailResource,
  CreateAssignmentResource,
  OperatorOption,
} from "../types/operations.types";
import type { MachineryResource } from "../../machinery/types/machinery.types";
import type { RuleViolationError, AssignmentValidationErrorResponse } from "../../../shared/types/api.types";
import { isAxiosError } from "axios";

export function useOperations() {
  const [shifts, setShifts] = useState<ShiftResource[]>([]);
  const [assignments, setAssignments] = useState<AssignmentDetailResource[]>([]);
  const [operators, setOperators] = useState<OperatorOption[]>([]);
  const [machineries, setMachineries] = useState<MachineryResource[]>([]);

  const [isLoadingShifts, setIsLoadingShifts] = useState(true);
  const [isLoadingAssignments, setIsLoadingAssignments] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filtros de Turnos
  const [shiftDateFilter, setShiftDateFilter] = useState<string>("");
  const [shiftTypeFilter, setShiftTypeFilter] = useState<string>("all"); // "all" | "Dia" | "Noche"

  // Filtros de Asignaciones
  const [assignmentOperatorFilter, setAssignmentOperatorFilter] = useState<string>("");
  const [assignmentMachineryTypeFilter, setAssignmentMachineryTypeFilter] = useState<string>("all");
  const [assignmentMachineryCodeFilter, setAssignmentMachineryCodeFilter] = useState<string>("");
  const [assignmentStartDateFilter, setAssignmentStartDateFilter] = useState<string>("");
  const [assignmentEndDateFilter, setAssignmentEndDateFilter] = useState<string>("");
  const [assignmentShiftTypeFilter, setAssignmentShiftTypeFilter] = useState<string>("all"); // "all" | "true" | "false"

  // Estado para captura de errores estructurados 422 de asignación
  const [rejectionErrors, setRejectionErrors] = useState<RuleViolationError[] | null>(null);

  // Carga de turnos
  const fetchShifts = useCallback(async () => {
    setIsLoadingShifts(true);
    try {
      const data = await shiftService.getShifts();
      setShifts(data);
    } catch (err) {
      console.error("Error al cargar turnos:", err);
      setError("No se pudieron cargar los turnos.");
    } finally {
      setIsLoadingShifts(false);
    }
  }, []);

  // Carga de asignaciones
  const fetchAssignments = useCallback(async () => {
    setIsLoadingAssignments(true);
    try {
      const data = await assignmentService.getAssignments();
      setAssignments(data);
    } catch (err) {
      console.error("Error al cargar asignaciones:", err);
      setError("No se pudieron cargar las asignaciones.");
    } finally {
      setIsLoadingAssignments(false);
    }
  }, []);

  // Carga de operadores y maquinarias para selects de modales
  const fetchModalDependencies = useCallback(async () => {
    try {
      const [ops, machs] = await Promise.all([
        assignmentService.getOperators().catch(() => []),
        machineryService.getMachineries().catch(() => []),
      ]);
      setOperators(ops);
      setMachineries(machs);
    } catch (err) {
      console.error("Error al cargar dependencias de formulario:", err);
    }
  }, []);

  // Recarga inicial
  useEffect(() => {
    fetchShifts();
    fetchAssignments();
    fetchModalDependencies();
  }, [fetchShifts, fetchAssignments, fetchModalDependencies]);

  // Suscripción al evento global de reseteo demo
  useEffect(() => {
    const handleGlobalReset = () => {
      fetchShifts();
      fetchAssignments();
      fetchModalDependencies();
    };

    window.addEventListener("app:refetch-data", handleGlobalReset);
    return () => {
      window.removeEventListener("app:refetch-data", handleGlobalReset);
    };
  }, [fetchShifts, fetchAssignments, fetchModalDependencies]);

  // Filtrado reactivo de turnos
  const filteredShifts = shifts.filter((s) => {
    if (shiftDateFilter && s.date !== shiftDateFilter) {
      return false;
    }
    if (shiftTypeFilter !== "all" && s.shiftType.toLowerCase() !== shiftTypeFilter.toLowerCase()) {
      return false;
    }
    return true;
  });

  // Filtrado reactivo de asignaciones
  const filteredAssignments = assignments.filter((a) => {
    if (
      assignmentOperatorFilter &&
      !a.operatorName.toLowerCase().includes(assignmentOperatorFilter.toLowerCase())
    ) {
      return false;
    }
    if (
      assignmentMachineryTypeFilter !== "all" &&
      a.machineryTypeName?.toLowerCase() !== assignmentMachineryTypeFilter.toLowerCase()
    ) {
      return false;
    }
    if (
      assignmentMachineryCodeFilter &&
      !a.machineryCode.toLowerCase().includes(assignmentMachineryCodeFilter.toLowerCase())
    ) {
      return false;
    }
    if (assignmentStartDateFilter && a.shiftDate < assignmentStartDateFilter) {
      return false;
    }
    if (assignmentEndDateFilter && a.shiftDate > assignmentEndDateFilter) {
      return false;
    }
    if (assignmentShiftTypeFilter !== "all") {
      const isDay = assignmentShiftTypeFilter === "true";
      if (a.shiftType !== isDay) return false;
    }
    return true;
  });

  // Crear Turno
  const handleCreateShift = async (payload: CreateShiftResource): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      await shiftService.createShift(payload);
      await fetchShifts();
      return true;
    } catch (err) {
      console.error("Error al crear turno:", err);
      alert("Error al registrar el turno. Verifique los datos ingresados.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Editar Turno
  const handleUpdateShift = async (id: string, payload: UpdateShiftResource): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      await shiftService.updateShift(id, payload);
      await fetchShifts();
      return true;
    } catch (err) {
      console.error("Error al actualizar turno:", err);
      alert("Error al actualizar el turno.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Eliminar Turno
  const handleDeleteShift = async (id: string): Promise<boolean> => {
    try {
      await shiftService.deleteShift(id);
      await fetchShifts();
      return true;
    } catch (err) {
      console.error("Error al eliminar turno:", err);
      alert("No se pudo eliminar el turno. Verifique que no tenga asignaciones asociadas.");
      return false;
    }
  };

  // Crear Asignación con captura de 422
  const handleCreateAssignment = async (payload: CreateAssignmentResource): Promise<boolean> => {
    setIsSubmitting(true);
    setRejectionErrors(null);
    try {
      await assignmentService.createAssignment(payload);
      await fetchAssignments();
      return true;
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 422) {
        const errorData = err.response.data as AssignmentValidationErrorResponse;
        if (errorData?.errors && errorData.errors.length > 0) {
          setRejectionErrors(errorData.errors);
        } else if (errorData?.message) {
          setRejectionErrors([{ rule: "REGLA_GENERAL", message: errorData.message }]);
        }
      } else if (isAxiosError(err) && err.response?.data?.message) {
        setRejectionErrors([{ rule: "ERROR", message: err.response.data.message }]);
      } else {
        alert("Ocurrió un error inesperado al procesar la asignación.");
      }
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Iniciar Asignación (PATCH /start)
  const handleStartAssignment = async (id: string, timeStart?: string): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      await assignmentService.startAssignment(id, timeStart);
      await fetchAssignments();
      return true;
    } catch (err) {
      console.error("Error al iniciar turno:", err);
      alert("Error al registrar inicio de turno.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cerrar Asignación (PATCH /end)
  const handleEndAssignment = async (id: string, timeEnd?: string): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      await assignmentService.endAssignment(id, timeEnd);
      await Promise.all([fetchAssignments(), fetchShifts()]);
      return true;
    } catch (err) {
      console.error("Error al cerrar turno:", err);
      alert("Error al registrar cierre de turno.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    shifts,
    filteredShifts,
    assignments,
    filteredAssignments,
    operators,
    machineries,
    isLoadingShifts,
    isLoadingAssignments,
    isSubmitting,
    error,
    rejectionErrors,
    setRejectionErrors,
    // Filtros de turnos
    shiftDateFilter,
    setShiftDateFilter,
    shiftTypeFilter,
    setShiftTypeFilter,
    // Filtros de asignaciones
    assignmentOperatorFilter,
    setAssignmentOperatorFilter,
    assignmentMachineryTypeFilter,
    setAssignmentMachineryTypeFilter,
    assignmentMachineryCodeFilter,
    setAssignmentMachineryCodeFilter,
    assignmentStartDateFilter,
    setAssignmentStartDateFilter,
    assignmentEndDateFilter,
    setAssignmentEndDateFilter,
    assignmentShiftTypeFilter,
    setAssignmentShiftTypeFilter,
    // Métodos
    handleCreateShift,
    handleUpdateShift,
    handleDeleteShift,
    handleCreateAssignment,
    handleStartAssignment,
    handleEndAssignment,
    refreshAll: () => {
      fetchShifts();
      fetchAssignments();
      fetchModalDependencies();
    },
  };
}
