import React, { useEffect, useState } from "react";
import type {
  AssignmentDetailResource,
  AssignmentFilterInputs,
} from "../types/operations.types";
import { machineryTypeService } from "../../machinery/services/machineryTypeService";
import type { MachineryTypeResource } from "../../machinery/types/machinery.types";
import { Badge } from "../../../shared/components/ui/Badge";
import {
  Search,
  AlertCircle,
  ChevronDown,
  CheckCircle2,
  Filter,
  RotateCcw,
} from "lucide-react";

interface AssignmentsTableProps {
  assignments: AssignmentDetailResource[];
  isLoading: boolean;
  inputFilters: AssignmentFilterInputs;
  setInputFilters: React.Dispatch<React.SetStateAction<AssignmentFilterInputs>>;
  onApply: () => void;
  onReset: () => void;
  onStartAssignment: (id: string) => void;
  onOpenCloseShiftModal: (assignment: AssignmentDetailResource) => void;
}

export const AssignmentsTable: React.FC<AssignmentsTableProps> = ({
  assignments,
  isLoading,
  inputFilters,
  setInputFilters,
  onApply,
  onReset,
  onStartAssignment,
  onOpenCloseShiftModal,
}) => {
  const [machineryTypes, setMachineryTypes] = useState<MachineryTypeResource[]>(
    []
  );

  useEffect(() => {
    machineryTypeService
      .getMachineryTypes()
      .then(setMachineryTypes)
      .catch(console.error);
  }, []);

  // Helper para formatear hora desde ISO string (ej. "2026-09-08T07:15:43" -> "07:15")
  const formatTime = (dateTimeStr: string | null) => {
    if (!dateTimeStr) return "-";
    try {
      if (dateTimeStr.includes("T")) {
        const timePart = dateTimeStr.split("T")[1];
        return timePart.substring(0, 5);
      }
      return dateTimeStr.substring(0, 5);
    } catch {
      return dateTimeStr;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApply();
  };

  const hasActiveFilters = Boolean(
    inputFilters.operatorName ||
      inputFilters.machineryType !== "all" ||
      inputFilters.machineryCode ||
      inputFilters.startDate ||
      inputFilters.endDate ||
      inputFilters.shiftType !== "all"
  );

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-xs overflow-hidden">
      {/* Header del bloque */}
      <div className="p-4 sm:p-6 border-b border-[#E2E8F0]">
        <h2 className="text-lg font-bold text-[#0F172A]">Asignaciones Operativas</h2>
        <p className="text-xs text-[#64748B] mt-0.5">
          Control de despacho diario, estados de ejecución y registro de horas trabajadas
        </p>

        {/* Formulario de Filtros */}
        <form onSubmit={handleSubmit} className="mt-4 pt-4 border-t border-[#F1F5F9]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            {/* 1. Nombre de operador */}
            <div className="flex flex-col gap-1">
              <label htmlFor="filter-assignment-operator" className="text-[11px] font-semibold text-[#64748B]">
                Nombre de operador
              </label>
              <div className="relative">
                <input
                  id="filter-assignment-operator"
                  type="text"
                  placeholder="Buscar operador..."
                  value={inputFilters.operatorName}
                  onChange={(e) =>
                    setInputFilters((prev) => ({
                      ...prev,
                      operatorName: e.target.value,
                    }))
                  }
                  className="w-full h-[36px] pl-8 pr-3 bg-white border border-[#CBD5E1] rounded-md text-xs text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* 2. Tipo de maquinaria */}
            <div className="flex flex-col gap-1">
              <label htmlFor="filter-assignment-machinery-type" className="text-[11px] font-semibold text-[#64748B]">
                Tipo de maquinaria
              </label>
              <div className="relative">
                <select
                  id="filter-assignment-machinery-type"
                  value={inputFilters.machineryType}
                  onChange={(e) =>
                    setInputFilters((prev) => ({
                      ...prev,
                      machineryType: e.target.value,
                    }))
                  }
                  className="w-full h-[36px] pl-3 pr-8 bg-white border border-[#CBD5E1] rounded-md text-xs text-[#334155] focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                >
                  <option value="all">Todos los tipos</option>
                  {machineryTypes.map((t) => (
                    <option key={t.id} value={t.name}>
                      {t.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#64748B] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* 3. Código maquinaria */}
            <div className="flex flex-col gap-1">
              <label htmlFor="filter-assignment-machinery-code" className="text-[11px] font-semibold text-[#64748B]">
                Código maquinaria
              </label>
              <input
                id="filter-assignment-machinery-code"
                type="text"
                placeholder="Ej: PRF-101"
                value={inputFilters.machineryCode}
                onChange={(e) =>
                  setInputFilters((prev) => ({
                    ...prev,
                    machineryCode: e.target.value,
                  }))
                }
                className="w-full h-[36px] px-3 bg-white border border-[#CBD5E1] rounded-md text-xs text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 4. Rango de fechas */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-[#64748B]">
                Rango de fechas (Desde - Hasta)
              </label>
              <div className="flex items-center gap-2">
                <input
                  aria-label="Fecha inicio asignación"
                  type="date"
                  value={inputFilters.startDate}
                  onChange={(e) =>
                    setInputFilters((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                  className="w-1/2 h-[36px] px-2.5 bg-white border border-[#CBD5E1] rounded-md text-xs text-[#334155] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-slate-400 text-xs">-</span>
                <input
                  aria-label="Fecha fin asignación"
                  type="date"
                  value={inputFilters.endDate}
                  onChange={(e) =>
                    setInputFilters((prev) => ({
                      ...prev,
                      endDate: e.target.value,
                    }))
                  }
                  className="w-1/2 h-[36px] px-2.5 bg-white border border-[#CBD5E1] rounded-md text-xs text-[#334155] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* 5. Tipo de turno */}
            <div className="flex flex-col gap-1">
              <label htmlFor="filter-assignment-shift-type" className="text-[11px] font-semibold text-[#64748B]">
                Tipo de turno
              </label>
              <div className="relative">
                <select
                  id="filter-assignment-shift-type"
                  value={inputFilters.shiftType}
                  onChange={(e) =>
                    setInputFilters((prev) => ({
                      ...prev,
                      shiftType: e.target.value,
                    }))
                  }
                  className="w-full h-[36px] pl-3 pr-8 bg-white border border-[#CBD5E1] rounded-md text-xs text-[#334155] focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                >
                  <option value="all">Día / Noche (Todos)</option>
                  <option value="true">Día</option>
                  <option value="false">Noche</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#64748B] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* 6. Acciones de filtro (Alineadas en la misma cuadrícula) */}
            <div className="flex items-end justify-end gap-2 pt-1 sm:pt-0">
              {hasActiveFilters && (
                <button
                  id="btn-clear-assignment-filters"
                  type="button"
                  onClick={onReset}
                  disabled={isLoading}
                  title="Limpiar filtros de asignaciones"
                  className="h-[36px] px-3.5 bg-white border border-[#CBD5E1] hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A] rounded-md text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Limpiar</span>
                </button>
              )}

              <button
                id="btn-apply-assignment-filters"
                type="submit"
                disabled={isLoading}
                className="h-[36px] px-6 bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-98 text-white font-bold text-xs rounded-md shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                <Filter className="w-3.5 h-3.5" />
                <span>{isLoading ? "Consultando..." : "Filtrar"}</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Tabla de asignaciones */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[850px]">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] font-bold text-[#475569] uppercase tracking-wider">
              <th className="py-3 px-4">Turno / Fecha</th>
              <th className="py-3 px-4">Maquinaria</th>
              <th className="py-3 px-4">Operador</th>
              <th className="py-3 px-4 text-center">Hora Inicio</th>
              <th className="py-3 px-4 text-center">Hora Fin</th>
              <th className="py-3 px-4 text-center">Horas Reales</th>
              <th className="py-3 px-4 text-center">Estado</th>
              <th className="py-3 px-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9] text-sm">
            {isLoading ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-[#64748B]">
                  Cargando asignaciones operativas...
                </td>
              </tr>
            ) : assignments.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-[#64748B]">
                  <div className="flex flex-col items-center justify-center gap-1.5">
                    <AlertCircle className="w-5 h-5 text-[#94A3B8]" />
                    <span>No se encontraron asignaciones con los criterios de búsqueda.</span>
                  </div>
                </td>
              </tr>
            ) : (
              assignments.map((item) => {
                const isFinished = Boolean(item.timeEnd);
                const isInProgress = Boolean(item.timeStart) && !isFinished;
                const isPlanned = !isInProgress && !isFinished;

                const shiftLabel = item.shiftType ? "Día" : "Noche";
                const shiftDurationText = item.shiftDuration ? ` (${item.shiftDuration}h)` : "";

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-[#F8FAFC] transition-colors duration-150"
                  >
                    {/* Turno / Fecha */}
                    <td className="py-3.5 px-4 font-medium text-[#0F172A] whitespace-nowrap">
                      {item.shiftDate} - {shiftLabel}
                      <span className="text-[#64748B] text-xs font-normal">
                        {shiftDurationText}
                      </span>
                    </td>

                    {/* Maquinaria */}
                    <td className="py-3.5 px-4 font-bold text-[#0F172A] whitespace-nowrap">
                      {item.machineryCode}
                      {item.machineryTypeName && (
                        <span className="ml-1 text-xs font-normal text-[#64748B]">
                          ({item.machineryTypeName})
                        </span>
                      )}
                    </td>

                    {/* Operador */}
                    <td className="py-3.5 px-4 text-[#0F172A] whitespace-nowrap">
                      {item.operatorName}
                    </td>

                    {/* Hora Inicio */}
                    <td className="py-3.5 px-4 text-center text-xs text-[#334155] whitespace-nowrap">
                      {formatTime(item.timeStart)}
                    </td>

                    {/* Hora Fin */}
                    <td className="py-3.5 px-4 text-center text-xs text-[#334155] whitespace-nowrap">
                      {formatTime(item.timeEnd)}
                    </td>

                    {/* Horas Reales */}
                    <td className="py-3.5 px-4 text-center font-semibold text-xs text-[#0F172A] whitespace-nowrap">
                      {item.actualShiftTime !== null && item.actualShiftTime !== undefined
                        ? `${item.actualShiftTime} hrs`
                        : "-"}
                    </td>

                    {/* Estado */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      {isFinished ? (
                        <Badge variant="neutral" label="FINALIZADA" />
                      ) : isInProgress ? (
                        <Badge variant="warning" label="EN CURSO" />
                      ) : (
                        <Badge variant="neutral" label="PLANIFICADA" />
                      )}
                    </td>

                    {/* Acciones */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      {isPlanned && (
                        <button
                          type="button"
                          onClick={() => onStartAssignment(item.id)}
                          className="inline-flex items-center justify-center h-[30px] px-4 rounded-md bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-[12px] transition-colors cursor-pointer"
                        >
                          Iniciar
                        </button>
                      )}

                      {isInProgress && (
                        <button
                          type="button"
                          onClick={() => onOpenCloseShiftModal(item)}
                          className="inline-flex items-center justify-center h-[30px] px-3.5 rounded-md bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold text-[12px] transition-colors cursor-pointer"
                        >
                          Cerrar Turno
                        </button>
                      )}

                      {isFinished && (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-medium">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          Completado
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
