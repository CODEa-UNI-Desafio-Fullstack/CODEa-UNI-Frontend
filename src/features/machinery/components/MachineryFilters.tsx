import type {
  MachineryFiltersState,
  MachineryTypeResource,
} from "../types/machinery.types";
import { Search, ChevronDown } from "lucide-react";

interface MachineryFiltersProps {
  filters: MachineryFiltersState;
  machineryTypes: MachineryTypeResource[];
  onChangeFilters: (newFilters: MachineryFiltersState) => void;
}

export const MachineryFilters = ({
  filters,
  machineryTypes,
  onChangeFilters,
}: MachineryFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3">
      {/* 1. Input de búsqueda por código */}
      <div className="relative w-full sm:w-[240px] md:w-[280px]">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          placeholder="Buscar por código..."
          value={filters.searchCode}
          onChange={(e) =>
            onChangeFilters({ ...filters, searchCode: e.target.value })
          }
          className="w-full h-[38px] pl-9 pr-3 bg-white border border-[#CBD5E1] rounded-md text-xs text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* 2. Selector de Tipo de Maquinaria */}
      <div className="relative w-full sm:w-[200px]">
        <select
          value={filters.machineryTypeId ?? ""}
          onChange={(e) =>
            onChangeFilters({
              ...filters,
              machineryTypeId: e.target.value ? Number(e.target.value) : null,
            })
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
          value={
            filters.stateBool === null
              ? ""
              : filters.stateBool
              ? "true"
              : "false"
          }
          onChange={(e) => {
            const val = e.target.value;
            onChangeFilters({
              ...filters,
              stateBool: val === "" ? null : val === "true",
            });
          }}
          className="w-full h-[38px] pl-3 pr-8 bg-white border border-[#CBD5E1] rounded-md text-xs text-[#334155] focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
        >
          <option value="">Estado: Todos</option>
          <option value="true">Activas</option>
          <option value="false">Bloqueadas</option>
        </select>
        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
};
