import React from "react";
import { Search, Filter, RotateCcw } from "lucide-react";
import type { MaintenanceFilterInputs } from "../hook/useMaintenances";
import type { OperatorOption } from "../../operations/types/operations.types";

interface MaintenanceFiltersProps {
  inputFilters: MaintenanceFilterInputs;
  setInputFilters: React.Dispatch<React.SetStateAction<MaintenanceFilterInputs>>;
  operators: OperatorOption[];
  onApply: () => void;
  onReset: () => void;
  isLoading?: boolean;
}

export const MaintenanceFilters: React.FC<MaintenanceFiltersProps> = ({
  inputFilters,
  setInputFilters,
  operators,
  onApply,
  onReset,
  isLoading = false,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApply();
  };

  const hasActiveFilters = Boolean(
    inputFilters.machineryCode ||
      inputFilters.operatorId ||
      inputFilters.startDate ||
      inputFilters.endDate
  );

  return (
    <div
      className="bg-white border border-[#E2E8F0] rounded-xl shadow-xs overflow-hidden"
      data-node-id="8:1144"
    >
      {/* Cabecera de la sección de filtros */}
      <div className="border-b border-[#E2E8F0] px-5 py-3.5 bg-white">
        <h2 className="text-[#0F172A] font-bold text-base sm:text-[18px]">
          Filtros de Búsqueda
        </h2>
      </div>

      {/* Formulario de filtros delegados al backend */}
      <form
        onSubmit={handleSubmit}
        className="bg-[#F8FAFC] p-4 sm:p-5 flex flex-col md:flex-row flex-wrap lg:flex-nowrap items-stretch md:items-end gap-3.5 sm:gap-4"
        data-node-id="8:1148"
      >
        {/* Filtro: Código de máquina */}
        <div className="flex-1 min-w-[200px] flex flex-col gap-1.5" data-node-id="8:1149">
          <label className="text-[#64748B] text-[12px] font-bold" htmlFor="filter-machinery-code">
            Código de máquina
          </label>
          <div className="relative flex items-center h-[36px]">
            <input
              id="filter-machinery-code"
              type="text"
              value={inputFilters.machineryCode}
              onChange={(e) =>
                setInputFilters((prev) => ({ ...prev, machineryCode: e.target.value }))
              }
              placeholder="Ej: CAM-001"
              className="w-full h-full bg-white border border-[#CBD5E1] rounded px-3 pr-8 text-[13px] text-[#0F172A] placeholder-[#9CA3AF] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-colors"
            />
            <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute right-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Filtro: Responsable */}
        <div className="flex-1 min-w-[200px] flex flex-col gap-1.5" data-node-id="8:1159">
          <label className="text-[#64748B] text-[12px] font-bold" htmlFor="filter-responsible">
            Responsable
          </label>
          <div className="relative flex items-center h-[36px]">
            <select
              id="filter-responsible"
              value={inputFilters.operatorId}
              onChange={(e) =>
                setInputFilters((prev) => ({ ...prev, operatorId: e.target.value }))
              }
              className="w-full h-full bg-white border border-[#CBD5E1] rounded px-3 text-[13px] text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-colors cursor-pointer"
            >
              <option value="">Todos los técnicos</option>
              {operators.map((op) => (
                <option key={op.id} value={op.id}>
                  {op.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filtro: Rango de fechas (Desde - Hasta) */}
        <div className="flex-1 min-w-[240px] flex flex-col gap-1.5" data-node-id="8:1168">
          <label className="text-[#64748B] text-[12px] font-bold">
            Rango de fechas
          </label>
          <div className="flex items-center gap-1.5 h-[36px]">
            <input
              type="date"
              aria-label="Fecha inicio"
              value={inputFilters.startDate}
              onChange={(e) =>
                setInputFilters((prev) => ({ ...prev, startDate: e.target.value }))
              }
              className="w-1/2 h-full bg-white border border-[#CBD5E1] rounded px-2.5 text-[12px] sm:text-[13px] text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-colors"
            />
            <span className="text-[#64748B] text-xs font-semibold shrink-0">-</span>
            <input
              type="date"
              aria-label="Fecha fin"
              value={inputFilters.endDate}
              onChange={(e) =>
                setInputFilters((prev) => ({ ...prev, endDate: e.target.value }))
              }
              className="w-1/2 h-full bg-white border border-[#CBD5E1] rounded px-2.5 text-[12px] sm:text-[13px] text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-colors"
            />
          </div>
        </div>

        {/* Acciones de filtro */}
        <div className="flex items-center gap-2 pt-2 md:pt-0 shrink-0">
          <button
            id="btn-apply-filters"
            type="submit"
            disabled={isLoading}
            className="h-[36px] px-6 bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-98 text-white font-bold text-[13px] rounded shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            data-node-id="8:1179"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>{isLoading ? "Consultando..." : "Filtrar"}</span>
          </button>

          {hasActiveFilters && (
            <button
              id="btn-clear-filters"
              type="button"
              onClick={onReset}
              disabled={isLoading}
              title="Limpiar filtros"
              className="h-[36px] px-3 bg-white border border-[#CBD5E1] hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A] rounded text-[12px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpiar</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
