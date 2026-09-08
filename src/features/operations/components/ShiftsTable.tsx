import React from "react";
import type { ShiftResource, ShiftFilterInputs } from "../types/operations.types";
import {
  Sun,
  Moon,
  Pencil,
  Trash2,
  Calendar,
  AlertCircle,
  Filter,
  RotateCcw,
} from "lucide-react";

interface ShiftsTableProps {
  shifts: ShiftResource[];
  isLoading: boolean;
  inputFilters: ShiftFilterInputs;
  setInputFilters: React.Dispatch<React.SetStateAction<ShiftFilterInputs>>;
  onApply: () => void;
  onReset: () => void;
  onEditShift: (shift: ShiftResource) => void;
  onDeleteShift: (id: string) => void;
}

export const ShiftsTable: React.FC<ShiftsTableProps> = ({
  shifts,
  isLoading,
  inputFilters,
  setInputFilters,
  onApply,
  onReset,
  onEditShift,
  onDeleteShift,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApply();
  };

  const hasActiveFilters = Boolean(
    inputFilters.date || inputFilters.shiftType !== "all"
  );

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-xs overflow-hidden">
      {/* Header y Filtros del Listado de Turnos */}
      <div className="p-4 sm:p-6 border-b border-[#E2E8F0] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#0F172A]">Listado de Turnos</h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Turnos de trabajo programados para despacho de flota
          </p>
        </div>

        {/* Formulario de Filtros */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-wrap items-center gap-3"
        >
          {/* Filtro Fecha */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#64748B]">Fecha:</span>
            <div className="relative">
              <input
                id="filter-shift-date"
                type="date"
                value={inputFilters.date}
                onChange={(e) =>
                  setInputFilters((prev) => ({ ...prev, date: e.target.value }))
                }
                className="h-[34px] pl-8 pr-3 bg-white border border-[#CBD5E1] rounded-md text-xs text-[#334155] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <Calendar className="w-3.5 h-3.5 text-[#94A3B8] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Filtro Tipo */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#64748B]">Tipo:</span>
            <select
              id="filter-shift-type"
              value={inputFilters.shiftType}
              onChange={(e) =>
                setInputFilters((prev) => ({
                  ...prev,
                  shiftType: e.target.value,
                }))
              }
              className="h-[34px] px-3 bg-white border border-[#CBD5E1] rounded-md text-xs text-[#334155] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
            >
              <option value="all">Todos</option>
              <option value="Dia">Día</option>
              <option value="Noche">Noche</option>
            </select>
          </div>

          {/* Botón Filtrar */}
          <button
            id="btn-apply-shift-filters"
            type="submit"
            disabled={isLoading}
            className="h-[34px] px-4 bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-98 text-white font-bold text-xs rounded-md shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>{isLoading ? "Consultando..." : "Filtrar"}</span>
          </button>

          {/* Botón Limpiar */}
          {hasActiveFilters && (
            <button
              id="btn-clear-shift-filters"
              type="button"
              onClick={onReset}
              disabled={isLoading}
              title="Limpiar filtros de turnos"
              className="h-[34px] px-2.5 bg-white border border-[#CBD5E1] hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A] rounded-md text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpiar</span>
            </button>
          )}
        </form>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] font-bold text-[#475569] uppercase tracking-wider">
              <th className="py-3 px-6">Fecha</th>
              <th className="py-3 px-6">Tipo de Turno</th>
              <th className="py-3 px-6 text-center">Duración (hrs)</th>
              <th className="py-3 px-6 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9] text-sm">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-[#64748B]">
                  Cargando turnos programados...
                </td>
              </tr>
            ) : shifts.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-[#64748B]">
                  <div className="flex flex-col items-center justify-center gap-1.5">
                    <AlertCircle className="w-5 h-5 text-[#94A3B8]" />
                    <span>No se encontraron turnos con los filtros seleccionados.</span>
                  </div>
                </td>
              </tr>
            ) : (
              shifts.map((shift) => {
                const isDay = shift.shiftType.toLowerCase() === "dia";

                return (
                  <tr
                    key={shift.id}
                    className="hover:bg-[#F8FAFC] transition-colors duration-150"
                  >
                    {/* Fecha */}
                    <td className="py-3.5 px-6 font-medium text-[#0F172A]">
                      {shift.date}
                    </td>

                    {/* Tipo de Turno */}
                    <td className="py-3.5 px-6">
                      <div className="inline-flex items-center gap-2">
                        {isDay ? (
                          <>
                            <Sun className="w-4 h-4 text-amber-500" />
                            <span className="font-semibold text-[#0F172A]">Día</span>
                          </>
                        ) : (
                          <>
                            <Moon className="w-4 h-4 text-indigo-500" />
                            <span className="font-semibold text-[#0F172A]">Noche</span>
                          </>
                        )}
                      </div>
                    </td>

                    {/* Duración */}
                    <td className="py-3.5 px-6 text-center font-bold text-[#0F172A]">
                      {shift.duration}
                    </td>

                    {/* Acciones */}
                    <td className="py-3.5 px-6 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onEditShift(shift)}
                          title="Editar Turno"
                          aria-label={`Editar turno del ${shift.date}`}
                          className="p-1.5 text-[#64748B] hover:text-[#2563EB] hover:bg-[#EFF6FF] rounded-md transition-colors cursor-pointer"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (
                              window.confirm(
                                `¿Está seguro de eliminar el turno del ${shift.date} (${shift.shiftType})?`
                              )
                            ) {
                              onDeleteShift(shift.id);
                            }
                          }}
                          title="Eliminar Turno"
                          aria-label={`Eliminar turno del ${shift.date}`}
                          className="p-1.5 text-[#64748B] hover:text-[#EF4444] hover:bg-[#FEF2F2] rounded-md transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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
