import { useState, useEffect, useCallback } from "react";
import { shiftService } from "../services/shiftService";
import { assignmentService } from "../services/assignmentService";
import { machineryService } from "../../machinery/services/machineryService";
import type {
  ShiftResource,
  CreateShiftResource,
  UpdateShiftResource,
  ShiftFilterParams,
  ShiftFilterInputs,
  AssignmentDetailResource,
  CreateAssignmentResource,
  AssignmentFilterParams,
  AssignmentFilterInputs,
  OperatorOption,
} from "../types/operations.types";
import type { MachineryResource } from "../../machinery/types/machinery.types";
import type {
  RuleViolationError,
  AssignmentValidationErrorResponse,
} from "../../../shared/types/api.types";
import { isAxiosError } from "axios";

const defaultShiftFilters: ShiftFilterInputs = {
  date: "",
  shiftType: "all",
};

const defaultAssignmentFilters: AssignmentFilterInputs = {
  operatorName: "",
  machineryType: "all",
  machineryCode: "",
  startDate: "",
  endDate: "",
  shiftType: "all",
};

export function useOperations() {
  const [shifts, setShifts] = useState<ShiftResource[]>([]);
  const [assignments, setAssignments] = useState<AssignmentDetailResource[]>([]);
  const [operators, setOperators] = useState<OperatorOption[]>([]);
  const [machineries, setMachineries] = useState<MachineryResource[]>([]);

  const [isLoadingShifts, setIsLoadingShifts] = useState(true);
  const [isLoadingAssignments, setIsLoadingAssignments] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filtros de Turnos: input (formulario) vs applied (backend)
  const [shiftInputFilters, setShiftInputFilters] =
    useState<ShiftFilterInputs>(defaultShiftFilters);
  const [shiftAppliedFilters, setShiftAppliedFilters] =
    useState<ShiftFilterInputs>(defaultShiftFilters);

  // Filtros de Asignaciones: input (formulario) vs applied (backend)
  const [assignmentInputFilters, setAssignmentInputFilters] =
    useState<AssignmentFilterInputs>(defaultAssignmentFilters);
  const [assignmentAppliedFilters, setAssignmentAppliedFilters] =
    useState<AssignmentFilterInputs>(defaultAssignmentFilters);

  // Estado para captura de errores estructurados 422 de asignación
  const [rejectionErrors, setRejectionErrors] = useState<
    RuleViolationError[] | null
  >(null);

  // Carga de turnos delegando filtros al backend
  const fetchShifts = useCallback(
    async (filtersToApply?: ShiftFilterInputs) => {
      setIsLoadingShifts(true);
      try {
        const active = filtersToApply ?? shiftAppliedFilters;
        const queryParams: ShiftFilterParams = {};
        if (active.date) {
          queryParams.date = active.date;
        }
        if (active.shiftType !== "all") {
          // Backend: true = Dia, false = Noche
          queryParams.shiftType = active.shiftType.toLowerCase() === "dia";
        }
        const data = await shiftService.getShifts(queryParams);
        setShifts(data);
      } catch (err) {
        console.error("Error al cargar turnos:", err);
        setError("No se pudieron cargar los turnos.");
      } finally {
        setIsLoadingShifts(false);
      }
    },
    [shiftAppliedFilters]
  );

  // Carga de asignaciones delegando filtros al backend
  const fetchAssignments = useCallback(
    async (filtersToApply?: AssignmentFilterInputs) => {
      setIsLoadingAssignments(true);
      try {
        const active = filtersToApply ?? assignmentAppliedFilters;
        const queryParams: AssignmentFilterParams = {};
        if (active.operatorName.trim()) {
          queryParams.operatorName = active.operatorName.trim();
        }
        if (active.machineryType && active.machineryType !== "all") {
          queryParams.machineryType = active.machineryType;
        }
        if (active.machineryCode.trim()) {
          queryParams.machineryCode = active.machineryCode.trim();
        }
        if (active.startDate) {
          queryParams.startDate = active.startDate;
        }
        if (active.endDate) {
          queryParams.endDate = active.endDate;
        }
        if (active.shiftType !== "all") {
          queryParams.shiftType = active.shiftType === "true";
        }
        const data = await assignmentService.getAssignments(queryParams);
        setAssignments(data);
      } catch (err) {
        console.error("Error al cargar asignaciones:", err);
        setError("No se pudieron cargar las asignaciones.");
      } finally {
        setIsLoadingAssignments(false);
      }
    },
    [assignmentAppliedFilters]
  );

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

  // Acciones de filtros de Turnos
  const handleApplyShiftFilters = () => {
    setShiftAppliedFilters(shiftInputFilters);
    fetchShifts(shiftInputFilters);
  };

  const handleResetShiftFilters = () => {
    setShiftInputFilters(defaultShiftFilters);
    setShiftAppliedFilters(defaultShiftFilters);
    fetchShifts(defaultShiftFilters);
  };

  // Acciones de filtros de Asignaciones
  const handleApplyAssignmentFilters = () => {
    setAssignmentAppliedFilters(assignmentInputFilters);
    fetchAssignments(assignmentInputFilters);
  };

  const handleResetAssignmentFilters = () => {
    setAssignmentInputFilters(defaultAssignmentFilters);
    setAssignmentAppliedFilters(defaultAssignmentFilters);
    fetchAssignments(defaultAssignmentFilters);
  };

  // Crear Turno
  const handleCreateShift = async (
    payload: CreateShiftResource
  ): Promise<boolean> => {
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
  const handleUpdateShift = async (
    id: string,
    payload: UpdateShiftResource
  ): Promise<boolean> => {
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
      alert(
        "No se pudo eliminar el turno. Verifique que no tenga asignaciones asociadas."
      );
      return false;
    }
  };

  // Crear Asignación con captura de 422
  const handleCreateAssignment = async (
    payload: CreateAssignmentResource
  ): Promise<boolean> => {
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
          setRejectionErrors([
            { rule: "REGLA_GENERAL", message: errorData.message },
          ]);
        }
      } else if (isAxiosError(err) && err.response?.data?.message) {
        setRejectionErrors([
          { rule: "ERROR", message: err.response.data.message },
        ]);
      } else {
        alert("Ocurrió un error inesperado al procesar la asignación.");
      }
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Iniciar Asignación (PATCH /start)
  const handleStartAssignment = async (
    id: string,
    timeStart?: string
  ): Promise<boolean> => {
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
  const handleEndAssignment = async (
    id: string,
    timeEnd?: string
  ): Promise<boolean> => {
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
    assignments,
    operators,
    machineries,
    isLoadingShifts,
    isLoadingAssignments,
    isSubmitting,
    error,
    rejectionErrors,
    setRejectionErrors,
    // Filtros de turnos
    shiftInputFilters,
    setShiftInputFilters,
    shiftAppliedFilters,
    handleApplyShiftFilters,
    handleResetShiftFilters,
    // Filtros de asignaciones
    assignmentInputFilters,
    setAssignmentInputFilters,
    assignmentAppliedFilters,
    handleApplyAssignmentFilters,
    handleResetAssignmentFilters,
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
