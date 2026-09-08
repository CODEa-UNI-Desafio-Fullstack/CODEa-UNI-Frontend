import React, { useEffect, useState } from "react";
import type { AssignmentDetailResource } from "../types/operations.types";
import { machineryTypeService } from "../../machinery/services/machineryTypeService";
import type { MachineryTypeResource } from "../../machinery/types/machinery.types";
import { Badge } from "../../../shared/components/ui/Badge";
import { Search, AlertCircle, ChevronDown, CheckCircle2 } from "lucide-react";

interface AssignmentsTableProps {
  assignments: AssignmentDetailResource[];
  isLoading: boolean;
  operatorFilter: string;
  onOperatorFilterChange: (value: string) => void;
  machineryTypeFilter: string;
  onMachineryTypeFilterChange: (value: string) => void;
  machineryCodeFilter: string;
  onMachineryCodeFilterChange: (value: string) => void;
  startDateFilter: string;
  onStartDateFilterChange: (value: string) => void;
  endDateFilter: string;
  onEndDateFilterChange: (value: string) => void;
  shiftTypeFilter: string;
  onShiftTypeFilterChange: (value: string) => void;
  onStartAssignment: (id: string) => void;
  onOpenCloseShiftModal: (assignment: AssignmentDetailResource) => void;
}

export const AssignmentsTable: React.FC<AssignmentsTableProps> = ({
  assignments,
  isLoading,
  operatorFilter,
  onOperatorFilterChange,
  machineryTypeFilter,
  onMachineryTypeFilterChange,
  machineryCodeFilter,
  onMachineryCodeFilterChange,
  startDateFilter,
  onStartDateFilterChange,
  endDateFilter,
  onEndDateFilterChange,
  shiftTypeFilter,
  onShiftTypeFilterChange,
  onStartAssignment,
  onOpenCloseShiftModal,
}) => {
  const [machineryTypes, setMachineryTypes] = useState<MachineryTypeResource[]>([]);

  useEffect(() => {
    machineryTypeService.getMachineryTypes().then(setMachineryTypes).catch(console.error);
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

  const hasActiveFilters =
    Boolean(operatorFilter) ||
    machineryTypeFilter !== "all" ||
    Boolean(machineryCodeFilter) ||
    Boolean(startDateFilter) ||
    Boolean(endDateFilter) ||
    shiftTypeFilter !== "all";

  const handleClearFilters = () => {
    onOperatorFilterChange("");
    onMachineryTypeFilterChange("all");
    onMachineryCodeFilterChange("");
    onStartDateFilterChange("");
    onEndDateFilterChange("");
    onShiftTypeFilterChange("all");
  };

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-xs overflow-hidden">
      {/* Header del bloque */}
      <div className="p-4 sm:p-6 border-b border-[#E2E8F0]">
        <h2 className="text-lg font-bold text-[#0F172A]">Asignaciones Operativas</h2>
        <p className="text-xs text-[#64748B] mt-0.5">
          Control de despacho diario, estados de ejecución y registro de horas trabajadas
        </p>

        {/* Barra de Filtros */}
        <div className="mt-4 pt-4 border-t border-[#F1F5F9] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* 1. Nombre de operador */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-[#64748B]">
              Nombre de operador
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar operador..."
                value={operatorFilter}
                onChange={(e) => onOperatorFilterChange(e.target.value)}
                className="w-full h-[36px] pl-8 pr-3 bg-white border border-[#CBD5E1] rounded-md text-xs text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* 2. Tipo de maquinaria */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-[#64748B]">
              Tipo de maquinaria
            </label>
            <div className="relative">
              <select
                value={machineryTypeFilter}
                onChange={(e) => onMachineryTypeFilterChange(e.target.value)}
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
            <label className="text-[11px] font-semibold text-[#64748B]">
              Código maquinaria
            </label>
            <input
              type="text"
              placeholder="Ej: PRF-101"
              value={machineryCodeFilter}
              onChange={(e) => onMachineryCodeFilterChange(e.target.value)}
              className="w-full h-[36px] px-3 bg-white border border-[#CBD5E1] rounded-md text-xs text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 4. Rango de fechas */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-[#64748B]">
              Rango de fechas (Desde - Hasta)
            </label>
            <div className="flex items-center gap-1.5">
              <input
                type="date"
                value={startDateFilter}
                onChange={(e) => onStartDateFilterChange(e.target.value)}
                className="w-1/2 h-[36px] px-2 bg-white border border-[#CBD5E1] rounded-md text-[11px] text-[#334155] focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-slate-400 text-xs">-</span>
              <input
                type="date"
                value={endDateFilter}
                onChange={(e) => onEndDateFilterChange(e.target.value)}
                className="w-1/2 h-[36px] px-2 bg-white border border-[#CBD5E1] rounded-md text-[11px] text-[#334155] focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* 5. Tipo de turno */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-[#64748B]">
              Tipo de turno
            </label>
            <div className="relative">
              <select
                value={shiftTypeFilter}
                onChange={(e) => onShiftTypeFilterChange(e.target.value)}
                className="w-full h-[36px] pl-3 pr-8 bg-white border border-[#CBD5E1] rounded-md text-xs text-[#334155] focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
              >
                <option value="all">Día / Noche (Todos)</option>
                <option value="true">Día</option>
                <option value="false">Noche</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#64748B] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Botón limpiar filtros */}
        {hasActiveFilters && (
          <div className="mt-2.5 flex justify-end">
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-xs text-[#2563EB] hover:text-[#1D4ED8] hover:underline font-medium cursor-pointer"
            >
              Limpiar todos los filtros
            </button>
          </div>
        )}
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
