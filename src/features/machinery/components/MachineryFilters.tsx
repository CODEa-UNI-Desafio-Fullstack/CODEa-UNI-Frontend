import React from "react";
import type {
  MachineryFiltersState,
  MachineryTypeResource,
} from "../types/machinery.types";
import { Search, ChevronDown, Filter, RotateCcw } from "lucide-react";

interface MachineryFiltersProps {
  inputFilters: MachineryFiltersState;
  setInputFilters: React.Dispatch<React.SetStateAction<MachineryFiltersState>>;
  machineryTypes: MachineryTypeResource[];
  onApply: () => void;
  onReset: () => void;
  isLoading?: boolean;
}

export const MachineryFilters: React.FC<MachineryFiltersProps> = ({
  inputFilters,
  setInputFilters,
  machineryTypes,
  onApply,
  onReset,
  isLoading = false,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApply();
  };

  const hasActiveFilters = Boolean(
    inputFilters.searchCode ||
      inputFilters.machineryTypeId !== null ||
      inputFilters.stateBool !== null
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3"
    >
      {/* 1. Input de búsqueda por código */}
      <div className="relative w-full sm:w-[240px] md:w-[280px]">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          id="filter-machinery-code"
          type="text"
          placeholder="Buscar por código..."
          value={inputFilters.searchCode}
          onChange={(e) =>
            setInputFilters((prev) => ({ ...prev, searchCode: e.target.value }))
          }
          className="w-full h-[38px] pl-9 pr-3 bg-white border border-[#CBD5E1] rounded-md text-xs text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* 2. Selector de Tipo de Maquinaria */}
      <div className="relative w-full sm:w-[200px]">
        <select
          id="filter-machinery-type"
          value={inputFilters.machineryTypeId ?? ""}
          onChange={(e) =>
            setInputFilters((prev) => ({
              ...prev,
              machineryTypeId: e.target.value ? Number(e.target.value) : null,
            }))
          }
          className="w-full h-[38px] pl-3 pr-8 bg-white border border-[#CBD5E1] rounded-md text-xs text-[#334155] focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
        >
          <option value="">Tipo: Todos</option>
          {machineryTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {/* 3. Selector de Estado (Activa / Bloqueada) */}
      <div className="relative w-full sm:w-[180px]">
        <select
          id="filter-machinery-state"
          value={
            inputFilters.stateBool === null
              ? ""
              : inputFilters.stateBool
              ? "true"
              : "false"
          }
          onChange={(e) => {
            const val = e.target.value;
            setInputFilters((prev) => ({
              ...prev,
              stateBool: val === "" ? null : val === "true",
            }));
          }}
          className="w-full h-[38px] pl-3 pr-8 bg-white border border-[#CBD5E1] rounded-md text-xs text-[#334155] focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
        >
          <option value="">Estado: Todos</option>
          <option value="true">Activas</option>
          <option value="false">Bloqueadas</option>
        </select>
        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {/* Acciones: Botón Filtrar y Limpiar */}
      <div className="flex items-center gap-2">
        <button
          id="btn-apply-machinery-filters"
          type="submit"
          disabled={isLoading}
          className="h-[38px] px-5 bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-98 text-white font-bold text-[13px] rounded-md shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Filter className="w-3.5 h-3.5" />
          <span>{isLoading ? "Consultando..." : "Filtrar"}</span>
        </button>

        {hasActiveFilters && (
          <button
            id="btn-clear-machinery-filters"
            type="button"
            onClick={onReset}
            disabled={isLoading}
            title="Limpiar filtros"
            className="h-[38px] px-3 bg-white border border-[#CBD5E1] hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A] rounded-md text-[12px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Limpiar</span>
          </button>
        )}
      </div>
    </form>
  );
};
