import { useState, useEffect, useCallback } from "react";
import { dashboardService } from "../services/dashboardService";
import type {
  ProjectionItem,
  MachineryItem,
  ShiftItem,
  DashboardKpiStats,
} from "../types/projection.types";
import { useDataRefetchOnReset } from "../../../shared/hooks/useDataRefetchOnReset";

export function useProjections() {
  const [projections, setProjections] = useState<ProjectionItem[]>([]);
  const [machinery, setMachinery] = useState<MachineryItem[]>([]);
  const [shifts, setShifts] = useState<ShiftItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshIndex, setRefreshIndex] = useState<number>(0);

  const refetch = useCallback(() => {
    setIsLoading(true);
    setRefreshIndex((prev) => prev + 1);
  }, []);

  useEffect(() => {
    let isCurrent = true;

    Promise.all([
      dashboardService.getProjections().catch((err) => {
        console.error("Error fetching projections:", err);
        return [] as ProjectionItem[];
      }),
      dashboardService.getMachinery().catch((err) => {
        console.error("Error fetching machinery:", err);
        return [] as MachineryItem[];
      }),
      dashboardService.getShifts().catch((err) => {
        console.error("Error fetching shifts:", err);
        return [] as ShiftItem[];
      }),
    ])
      .then(([projectionsData, machineryData, shiftsData]) => {
        if (!isCurrent) return;
        setProjections(projectionsData);
        setMachinery(machineryData);
        setShifts(shiftsData);
        setError(null);
        setIsLoading(false);
      })
      .catch((err: unknown) => {
        if (!isCurrent) return;
        const message =
          err instanceof Error ? err.message : "Error al conectar con la API";
        setError(message);
        setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [refreshIndex]);

  // Refrescar en caliente cuando se presione el botón Reset Demo
  useDataRefetchOnReset(refetch);

  // Mapeo rápido de turnos por ID para enriquecer los datos de proyección
  const shiftsById = new Map<string, ShiftItem>(
    shifts.map((shift) => [shift.id, shift])
  );

  // Cálculo de KPIs
  const kpis: DashboardKpiStats = {
    totalMachinery: machinery.length,
    activeMachinery: machinery.filter((m) => m.state === "ACTIVE").length,
    blockedMachinery: machinery.filter((m) => m.state === "BLOCKED").length,
    upcomingBlockedCount: new Set(projections.map((p) => p.machineryCode)).size,
  };

  return {
    projections,
    machinery,
    shiftsById,
    kpis,
    isLoading,
    error,
    refetch,
  };
}
