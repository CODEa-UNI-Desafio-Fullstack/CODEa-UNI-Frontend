import { useState, useEffect, useCallback, useMemo } from "react";
import { machineryService } from "../services/machineryService";
import { machineryTypeService } from "../services/machineryTypeService";
import type {
  MachineryResource,
  MachineryTypeResource,
  MachineryFiltersState,
  MachineryViewModel,
} from "../types/machinery.types";
import { useDataRefetchOnReset } from "../../../shared/hooks/useDataRefetchOnReset";

export function useMachinery() {
  const [machineries, setMachineries] = useState<MachineryResource[]>([]);
  const [machineryTypes, setMachineryTypes] = useState<MachineryTypeResource[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filtros: inputFilters (edición en formulario) vs appliedFilters (enviados a backend)
  const [inputFilters, setInputFilters] = useState<MachineryFiltersState>({
    searchCode: "",
    machineryTypeId: null,
    stateBool: null,
  });

  const [appliedFilters, setAppliedFilters] = useState<MachineryFiltersState>({
    searchCode: "",
    machineryTypeId: null,
    stateBool: null,
  });

  const fetchMachineries = useCallback(
    async (filtersToApply?: MachineryFiltersState) => {
      setIsLoading(true);
      try {
        const active = filtersToApply ?? appliedFilters;
        const data = await machineryService.getMachineries({
          state: active.stateBool ?? undefined,
          machineryTypeId: active.machineryTypeId ?? undefined,
          code: active.searchCode ? active.searchCode.trim() : undefined,
        });
        setMachineries(data);
        setError(null);
      } catch (err: unknown) {
        console.error("Error al consultar maquinarias:", err);
        const msg =
          err instanceof Error ? err.message : "Error al consultar maquinarias";
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    },
    [appliedFilters]
  );

  // Carga inicial
  useEffect(() => {
    let isMounted = true;

    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        const [typesData, machineriesData] = await Promise.all([
          machineryTypeService.getMachineryTypes().catch((err) => {
            console.error("Error al cargar tipos de maquinaria:", err);
            return [] as MachineryTypeResource[];
          }),
          machineryService.getMachineries().catch((err) => {
            console.error("Error al cargar maquinarias:", err);
            return [] as MachineryResource[];
          }),
        ]);

        if (isMounted) {
          setMachineryTypes(typesData);
          setMachineries(machineriesData);
          setError(null);
        }
      } catch (err: unknown) {
        if (isMounted) {
          const msg =
            err instanceof Error ? err.message : "Error al inicializar maquinarias";
          setError(msg);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, []);

  const refetch = useCallback(() => {
    fetchMachineries();
  }, [fetchMachineries]);

  // Al presionar el botón de Reset Demo, invalidar la caché de tipos y recargar
  useDataRefetchOnReset(() => {
    machineryTypeService.invalidateCache();
    machineryTypeService.getMachineryTypes().then(setMachineryTypes).catch(console.error);
    fetchMachineries();
  });

  // Mapa de tipos por nombre para asociar el umbral y el id del tipo
  const typesByName = useMemo(() => {
    const map = new Map<string, MachineryTypeResource>();
    machineryTypes.forEach((t) => {
      map.set(t.name.toLowerCase().trim(), t);
    });
    return map;
  }, [machineryTypes]);

  // Transformar datos a ViewModel para la tabla
  const machineryViewModels: MachineryViewModel[] = useMemo(() => {
    return machineries.map((m) => {
      const typeInfo = typesByName.get(m.machineryType.toLowerCase().trim());
      const threshold = typeInfo ? typeInfo.maintenanceTime : 250;
      const isCritical = m.state === "BLOCKED" || m.hourMeter > threshold;

      return {
        ...m,
        threshold,
        machineryTypeId: typeInfo?.id,
        isCritical,
      };
    });
  }, [machineries, typesByName]);

  // Aplicar filtros explícitamente al hacer click en Filtrar o Enter
  const handleApplyFilters = () => {
    setAppliedFilters(inputFilters);
    fetchMachineries(inputFilters);
  };

  // Limpiar filtros y consultar todas las maquinarias
  const handleResetFilters = () => {
    const cleared: MachineryFiltersState = {
      searchCode: "",
      machineryTypeId: null,
      stateBool: null,
    };
    setInputFilters(cleared);
    setAppliedFilters(cleared);
    fetchMachineries(cleared);
  };

  // Mutaciones
  const handleUpdateType = async (code: string, newTypeId: number) => {
    try {
      await machineryService.updateMachineryType(code, newTypeId);
      refetch();
    } catch (err: unknown) {
      console.error("Error actualizando tipo de maquinaria:", err);
      throw err;
    }
  };

  const handleCreateMachinery = async (code: string, typeId: number) => {
    try {
      await machineryService.createMachinery(code, typeId);
      refetch();
    } catch (err: unknown) {
      console.error("Error creando maquinaria:", err);
      throw err;
    }
  };

  const handleDeleteMachinery = async (code: string) => {
    try {
      await machineryService.deleteMachinery(code);
      refetch();
    } catch (err: unknown) {
      console.error("Error eliminando maquinaria:", err);
      throw err;
    }
  };

  const handleCreateMachineryType = async (name: string, maintenanceTime: number) => {
    try {
      await machineryTypeService.createMachineryType(name, maintenanceTime);
      refetch();
    } catch (err: unknown) {
      console.error("Error creando tipo de maquinaria:", err);
      throw err;
    }
  };

  return {
    machineries: machineryViewModels,
    machineryTypes,
    inputFilters,
    setInputFilters,
    appliedFilters,
    isLoading,
    error,
    refetch,
    handleApplyFilters,
    handleResetFilters,
    handleUpdateType,
    handleCreateMachinery,
    handleDeleteMachinery,
    handleCreateMachineryType,
  };
}
