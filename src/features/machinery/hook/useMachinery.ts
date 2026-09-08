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

  // Filtros
  const [filters, setFilters] = useState<MachineryFiltersState>({
    searchCode: "",
    machineryTypeId: null,
    stateBool: null,
  });

  const [refreshIndex, setRefreshIndex] = useState<number>(0);

  const refetch = useCallback(() => {
    setIsLoading(true);
    setRefreshIndex((prev) => prev + 1);
  }, []);

  // Carga inicial y ante cambios de filtros
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const [typesData, machineriesData] = await Promise.all([
          machineryTypeService.getMachineryTypes().catch((err) => {
            console.error("Error al cargar tipos de maquinaria:", err);
            return [] as MachineryTypeResource[];
          }),
          machineryService
            .getMachineries({
              state: filters.stateBool ?? undefined,
              machineryTypeId: filters.machineryTypeId ?? undefined,
              code: filters.searchCode ? filters.searchCode.trim() : undefined,
            })
            .catch((err) => {
              console.error("Error al cargar maquinarias:", err);
              return [] as MachineryResource[];
            }),
        ]);

        if (isMounted) {
          setMachineryTypes(typesData);
          setMachineries(machineriesData);
          setError(null);
          setIsLoading(false);
        }
      } catch (err: unknown) {
        if (isMounted) {
          const msg =
            err instanceof Error ? err.message : "Error al consultar maquinarias";
          setError(msg);
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [filters, refreshIndex]);

  // Al presionar el botón de Reset Demo, invalidar la caché de tipos y recargar
  useDataRefetchOnReset(() => {
    machineryTypeService.invalidateCache();
    refetch();
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
    filters,
    setFilters,
    isLoading,
    error,
    refetch,
    handleUpdateType,
    handleCreateMachinery,
    handleDeleteMachinery,
    handleCreateMachineryType,
  };
}
