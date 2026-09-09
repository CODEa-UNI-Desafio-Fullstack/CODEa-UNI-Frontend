import React from "react";
import { Badge } from "../../../shared/components/ui/Badge";
import { Search, Filter, RotateCcw, Users } from "lucide-react";
import type {
  OperatorViewModel,
  OperatorFilterInputs,
} from "../types/operator.types";

interface OperatorsTableProps {
  operators: OperatorViewModel[];
  selectedOperatorId: string | null;
  onSelectOperator: (id: string) => void;
  inputFilters: OperatorFilterInputs;
  setInputFilters: React.Dispatch<React.SetStateAction<OperatorFilterInputs>>;
  onApplyFilters: () => void;
  onResetFilters: () => void;
  isLoading?: boolean;
}

export const OperatorsTable: React.FC<OperatorsTableProps> = ({
  operators,
  selectedOperatorId,
  onSelectOperator,
  inputFilters,
  setInputFilters,
  onApplyFilters,
  onResetFilters,
  isLoading = false,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApplyFilters();
  };

  const hasActiveFilter = Boolean(inputFilters.name.trim());

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-[12px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] overflow-hidden">
      {/* 1. Barra de Búsqueda y Filtros */}
      <div className="p-4 sm:p-6 border-b border-[#F1F5F9]">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3"
        >
          <div className="relative w-full sm:w-[320px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="filter-operator-name"
              type="text"
              placeholder="Buscar operador por nombre..."
              value={inputFilters.name}
              onChange={(e) =>
                setInputFilters({ name: e.target.value })
              }
              className="w-full h-[38px] pl-9 pr-3 bg-white border border-[#CBD5E1] rounded-md text-xs sm:text-sm text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={isLoading}
              className="h-[38px] px-4 rounded-md bg-[#2563EB] text-white text-[13px] font-bold hover:bg-[#1D4ED8] transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filtrar</span>
            </button>

            {hasActiveFilter && (
              <button
                type="button"
                onClick={onResetFilters}
                disabled={isLoading}
                className="h-[38px] px-3.5 rounded-md border border-[#CBD5E1] bg-white text-[#475569] text-[13px] font-semibold hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>Limpiar</span>
              </button>
            )}
          </div>
        </form>
      </div>

      {/* 2. Tabla de Operadores */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
              <th className="py-3 px-6 text-[11px] font-bold text-[#475569] tracking-wider uppercase">
                Operador
              </th>
              <th className="py-3 px-6 text-[11px] font-bold text-[#475569] tracking-wider uppercase">
                Certificaciones Válidas
              </th>
              <th className="py-3 px-6 text-[11px] font-bold text-[#475569] tracking-wider uppercase">
                Certificaciones Vencidas
              </th>
              <th className="py-3 px-6 text-[11px] font-bold text-[#475569] tracking-wider uppercase text-right">
                Estado
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9]">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs">Cargando operadores...</span>
                  </div>
                </td>
              </tr>
            ) : operators.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Users className="w-8 h-8 text-slate-300" />
                    <span className="text-sm font-semibold">
                      No se encontraron operadores
                    </span>
                    <span className="text-xs text-slate-400">
                      {hasActiveFilter
                        ? "Prueba cambiando los términos de búsqueda."
                        : "Comienza registrando un nuevo operador."}
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              operators.map((op) => {
                const isSelected = op.id === selectedOperatorId;
                const isHabilitado = op.status !== "NO HABILITADO";

                return (
                  <tr
                    key={op.id}
                    onClick={() => onSelectOperator(op.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-[#EFF6FF] border-l-4 border-l-[#2563EB]"
                        : "hover:bg-slate-50 border-l-4 border-l-transparent"
                    }`}
                  >
                    {/* Operador: Nombre e ID */}
                    <td className="py-5 px-6">
                      <div className="font-bold text-[14px] text-[#0F172A] leading-tight">
                        {op.name}
                      </div>
                      <div className="text-[12px] text-[#94A3B8] font-mono mt-0.5">
                        ID: {op.id}
                      </div>
                    </td>

                    {/* Certificaciones Válidas */}
                    <td className="py-5 px-6">
                      <span
                        className={`text-[14px] font-semibold ${
                          op.validCount > 0 ? "text-[#15803D]" : "text-[#64748B]"
                        }`}
                      >
                        {op.validCount}
                      </span>
                    </td>

                    {/* Certificaciones Vencidas */}
                    <td className="py-5 px-6">
                      <span
                        className={`text-[14px] font-semibold ${
                          op.expiredCount > 0 ? "text-[#B91C1C]" : "text-[#64748B]"
                        }`}
                      >
                        {op.expiredCount}
                      </span>
                    </td>

                    {/* Estado */}
                    <td className="py-5 px-6 text-right">
                      <Badge
                        variant={isHabilitado ? "success" : "danger"}
                        label={op.status}
                      />
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
