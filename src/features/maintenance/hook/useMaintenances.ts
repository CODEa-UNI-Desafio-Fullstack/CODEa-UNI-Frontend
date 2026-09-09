import { useState, useEffect, useCallback, useMemo } from "react";
import { maintenanceService } from "../services/maintenanceService";
import { machineryService } from "../../machinery/services/machineryService";
import { machineryTypeService } from "../../machinery/services/machineryTypeService";
import type {
  MaintenanceViewModel,
  CreateMaintenanceResource,
  MaintenanceFilterParams,
} from "../types/maintenance.types";
import type { OperatorOption } from "../../operations/types/operations.types";
import type { MachineryResource, MachineryTypeResource } from "../../machinery/types/machinery.types";
import { useDataRefetchOnReset } from "../../../shared/hooks/useDataRefetchOnReset";

export interface MaintenanceFilterInputs {
  machineryCode: string;
  operatorId: string;
  startDate: string;
  endDate: string;
}

export function useMaintenances() {
  const [maintenancesRaw, setMaintenancesRaw] = useState<MaintenanceViewModel[]>([]);
  const [operators, setOperators] = useState<OperatorOption[]>([]);
  const [machineries, setMachineries] = useState<MachineryResource[]>([]);
  const [machineryTypes, setMachineryTypes] = useState<MachineryTypeResource[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Estados de filtros: inputFilters (valores actuales en formulario) vs appliedFilters (enviados a backend)
  const [inputFilters, setInputFilters] = useState<MaintenanceFilterInputs>({
    machineryCode: "",
    operatorId: "",
    startDate: "",
    endDate: "",
  });

  const [appliedFilters, setAppliedFilters] = useState<MaintenanceFilterInputs>({
    machineryCode: "",
    operatorId: "",
    startDate: "",
    endDate: "",
  });

  // Mapa de operadores por id para resolver rápido los nombres
  const operatorsMap = useMemo(() => {
    const map = new Map<string, string>();
    operators.forEach((op) => {
      map.set(op.id, op.name);
    });
    return map;
  }, [operators]);

  // Función para consultar mantenimientos delegando los filtros en el backend
  const fetchMaintenances = useCallback(
    async (filtersToApply?: MaintenanceFilterInputs, currentOpsMap?: Map<string, string>) => {
      setIsLoading(true);
      try {
        const activeFilters = filtersToApply ?? appliedFilters;
        const queryParams: MaintenanceFilterParams = {
          machineryCode: activeFilters.machineryCode || undefined,
          operatorId: activeFilters.operatorId || undefined,
          startDate: activeFilters.startDate || undefined,
          endDate: activeFilters.endDate || undefined,
        };

        const data = await maintenanceService.getMaintenances(queryParams);
        const mapToUse = currentOpsMap ?? operatorsMap;

        // Mapear a ViewModel
        const viewModels: MaintenanceViewModel[] = data.map((m) => ({
          ...m,
          operatorName: mapToUse.get(m.operatorId) || "Técnico Desconocido",
          statusPostMaintenance: "ACTIVO",
        }));

        setMaintenancesRaw(viewModels);
        setError(null);
      } catch (err: unknown) {
        console.error("Error al consultar mantenimientos:", err);
        const msg = err instanceof Error ? err.message : "Error al consultar historial de mantenimientos";
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    },
    [appliedFilters, operatorsMap]
  );

  // Carga inicial y dependencias
  useEffect(() => {
    let isMounted = true;

    const initializeData = async () => {
      try {
        const [opsData, machsData, typesData] = await Promise.all([
          maintenanceService.getOperators().catch(() => []),
          machineryService.getMachineries().catch(() => []),
          machineryTypeService.getMachineryTypes().catch(() => []),
        ]);

        if (!isMounted) return;
        setOperators(opsData);
        setMachineries(machsData);
        setMachineryTypes(typesData);

        const opMap = new Map<string, string>();
        opsData.forEach((op) => opMap.set(op.id, op.name));

        const maints = await maintenanceService.getMaintenances();
        if (!isMounted) return;
        setMaintenancesRaw(
          maints.map((m) => ({
            ...m,
            operatorName: opMap.get(m.operatorId) || "Técnico Desconocido",
            statusPostMaintenance: "ACTIVO",
          }))
        );
        setError(null);
      } catch (err: unknown) {
        if (!isMounted) return;
        const msg = err instanceof Error ? err.message : "Error al inicializar datos";
        setError(msg);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    initializeData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Al presionar "Resetear Datos Demo", invalidar caché de tipos y refrescar
  useDataRefetchOnReset(() => {
    machineryTypeService.invalidateCache();
    fetchMaintenances();
  });

  // Ejecución explícita de filtros por el usuario al hacer clic en "Filtrar"
  const handleApplyFilters = () => {
    setAppliedFilters(inputFilters);
    fetchMaintenances(inputFilters);
  };

  // Limpiar filtros y consultar todos los registros
  const handleResetFilters = () => {
    const cleared: MaintenanceFilterInputs = {
      machineryCode: "",
      operatorId: "",
      startDate: "",
      endDate: "",
    };
    setInputFilters(cleared);
    setAppliedFilters(cleared);
    fetchMaintenances(cleared);
  };

  // Registro de nuevo mantenimiento preventivo
  const handleCreateMaintenance = async (payload: CreateMaintenanceResource): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      await maintenanceService.createMaintenance(payload);

      // Disparar evento global para que las demás vistas (Equipos, Dashboard) actualicen horómetros
      window.dispatchEvent(new CustomEvent("app:refetch-data"));

      // Refrescar listado local
      await fetchMaintenances();
      return true;
    } catch (err: unknown) {
      console.error("Error registrando mantenimiento:", err);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    maintenances: maintenancesRaw,
    operators,
    machineries,
    machineryTypes,
    inputFilters,
    setInputFilters,
    appliedFilters,
    isLoading,
    isSubmitting,
    error,
    handleApplyFilters,
    handleResetFilters,
    handleCreateMaintenance,
  };
}
