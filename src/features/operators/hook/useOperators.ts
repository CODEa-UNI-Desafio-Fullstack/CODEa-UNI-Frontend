import { useState, useEffect, useCallback, useMemo } from "react";
import { operatorService } from "../services/operatorService";
import { machineryTypeService } from "../../machinery/services/machineryTypeService";
import { useDataRefetchOnReset } from "../../../shared/hooks/useDataRefetchOnReset";
import type {
  OperatorViewModel,
  CertificationViewModel,
  OperatorFilterInputs,
  OperatorFilterParams,
} from "../types/operator.types";
import type { MachineryTypeResource } from "../../machinery/types/machinery.types";

/**
 * Obtiene la fecha actual en formato YYYY-MM-DD en la zona horaria local.
 */
function getTodayIsoString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Determina el sufijo de género para el estado según el nombre del operador.
 */
function getStatusLabel(
  name: string,
  isValid: boolean
): "HABILITADO" | "NO HABILITADO" | "HABILITADA" {
  if (!isValid) return "NO HABILITADO";
  const firstName = name.trim().split(" ")[0].toLowerCase();
  if (firstName.endsWith("a") || firstName === "carmen" || firstName === "isabel" || firstName === "pilar") {
    return "HABILITADA";
  }
  return "HABILITADO";
}

export function useOperators() {
  const [operators, setOperators] = useState<OperatorViewModel[]>([]);
  const [machineryTypes, setMachineryTypes] = useState<MachineryTypeResource[]>([]);
  const [selectedOperatorId, setSelectedOperatorId] = useState<string | null>(null);

  // Filtros desacoplados (inputFilters vs appliedFilters)
  const [inputFilters, setInputFilters] = useState<OperatorFilterInputs>({ name: "" });
  const [appliedFilters, setAppliedFilters] = useState<OperatorFilterParams>({});

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMutating, setIsMutating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Carga concurrentemente operadores, catálogo de maquinarias y las certificaciones por operador.
   */
  const fetchData = useCallback(
    async (silent = false) => {
      if (!silent) setIsLoading(true);
      setError(null);

      try {
        const todayStr = getTodayIsoString();

        // 1. Obtener operadores (con filtro aplicado) y tipos de maquinaria en paralelo
        const [rawOperators, types] = await Promise.all([
          operatorService.getOperators(appliedFilters),
          machineryTypeService.getMachineryTypes(),
        ]);

        setMachineryTypes(types);

        // Mapa de tipos de maquinaria para resolución instantánea O(1)
        const typesMap = new Map<number, string>();
        types.forEach((t) => typesMap.set(t.id, t.name));

        // 2. Cargar certificaciones de cada operador de forma concurrente
        const operatorsWithCerts: OperatorViewModel[] = await Promise.all(
          rawOperators.map(async (op) => {
            try {
              const rawCerts = await operatorService.getOperatorCertifications(op.id);

              let validCount = 0;
              let expiredCount = 0;

              const certifications: CertificationViewModel[] = rawCerts.map((c) => {
                // Si la fecha de expiración es estrictamente menor a hoy, está vencida
                const isExpired = c.expirationDate < todayStr;
                if (isExpired) {
                  expiredCount++;
                } else {
                  validCount++;
                }

                return {
                  operatorId: c.operatorId,
                  machineryTypeId: c.machineryTypeId,
                  machineryTypeName: typesMap.get(c.machineryTypeId) || `Tipo #${c.machineryTypeId}`,
                  expirationDate: c.expirationDate,
                  isExpired,
                };
              });

              // Determinar estado de habilitación:
              // Para estar habilitado debe tener al menos 1 certificación válida y 0 vencidas
              const isHabilitado = validCount > 0 && expiredCount === 0;
              const status = getStatusLabel(op.name, isHabilitado);

              return {
                id: op.id,
                name: op.name,
                certifications,
                validCount,
                expiredCount,
                status,
              };
            } catch (err) {
              console.error(`Error al cargar certificaciones para operador ${op.id}:`, err);
              return {
                id: op.id,
                name: op.name,
                certifications: [],
                validCount: 0,
                expiredCount: 0,
                status: "NO HABILITADO",
              };
            }
          })
        );

        setOperators(operatorsWithCerts);

        // Mantener el operador seleccionado si aún existe, de lo contrario seleccionar el primero
        setSelectedOperatorId((prevSelected) => {
          if (prevSelected && operatorsWithCerts.some((op) => op.id === prevSelected)) {
            return prevSelected;
          }
          return operatorsWithCerts.length > 0 ? operatorsWithCerts[0].id : null;
        });
      } catch (err: unknown) {
        console.error("Error al cargar datos de operadores:", err);
        setError("Ocurrió un error al cargar la información de operadores y certificaciones.");
      } finally {
        if (!silent) setIsLoading(false);
      }
    },
    [appliedFilters]
  );

  // Carga inicial y ante cambios en appliedFilters
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Suscripción al botón flotante "Resetear Datos Demo"
  useDataRefetchOnReset(() => {
    fetchData(true);
  });

  // Operador seleccionado derivado
  const selectedOperator = useMemo(() => {
    if (!selectedOperatorId) return operators[0] || null;
    return operators.find((op) => op.id === selectedOperatorId) || operators[0] || null;
  }, [operators, selectedOperatorId]);

  // Manejadores de Filtros (Estándar unificado con ejecución explícita)
  const handleApplyFilters = () => {
    setAppliedFilters({
      name: inputFilters.name.trim() || undefined,
    });
  };

  const handleResetFilters = () => {
    setInputFilters({ name: "" });
    setAppliedFilters({});
  };

  // Mutaciones
  const handleCreateOperator = async (name: string): Promise<boolean> => {
    setIsMutating(true);
    try {
      const newOp = await operatorService.createOperator({ name });
      await fetchData(true);
      setSelectedOperatorId(newOp.id);
      return true;
    } catch (err: unknown) {
      console.error("Error al crear operador:", err);
      throw err;
    } finally {
      setIsMutating(false);
    }
  };

  const handleAddCertification = async (
    operatorId: string,
    machineryTypeId: number,
    expirationDate: string
  ): Promise<boolean> => {
    setIsMutating(true);
    try {
      await operatorService.addCertification(operatorId, {
        machineryTypeId,
        expirationDate,
      });
      await fetchData(true);
      return true;
    } catch (err: unknown) {
      console.error("Error al agregar certificación:", err);
      throw err;
    } finally {
      setIsMutating(false);
    }
  };

  const handleRenewCertification = async (
    operatorId: string,
    machineryTypeId: number,
    expirationDate: string
  ): Promise<boolean> => {
    setIsMutating(true);
    try {
      await operatorService.renewCertification(operatorId, machineryTypeId, {
        expirationDate,
      });
      await fetchData(true);
      return true;
    } catch (err: unknown) {
      console.error("Error al renovar certificación:", err);
      throw err;
    } finally {
      setIsMutating(false);
    }
  };

  const handleDeleteCertification = async (
    operatorId: string,
    machineryTypeId: number
  ): Promise<boolean> => {
    setIsMutating(true);
    try {
      await operatorService.deleteCertification(operatorId, machineryTypeId);
      await fetchData(true);
      return true;
    } catch (err: unknown) {
      console.error("Error al eliminar certificación:", err);
      throw err;
    } finally {
      setIsMutating(false);
    }
  };

  return {
    operators,
    machineryTypes,
    selectedOperatorId,
    setSelectedOperatorId,
    selectedOperator,
    inputFilters,
    setInputFilters,
    appliedFilters,
    isLoading,
    isMutating,
    error,
    handleApplyFilters,
    handleResetFilters,
    handleCreateOperator,
    handleAddCertification,
    handleRenewCertification,
    handleDeleteCertification,
    refetch: fetchData,
  };
}
