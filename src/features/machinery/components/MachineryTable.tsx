import type { MachineryViewModel } from "../types/machinery.types";
import { Badge } from "../../../shared/components/ui/Badge";
import { ProgressBar } from "../../../shared/components/ui/ProgressBar";
import { Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";

interface MachineryTableProps {
  machineries: MachineryViewModel[];
  isLoading: boolean;
  onEditType: (machinery: MachineryViewModel) => void;
  onDelete: (code: string) => void;
}

export const MachineryTable = ({
  machineries,
  isLoading,
  onEditType,
  onDelete,
}: MachineryTableProps) => {
  return (
    <div>
      {/* Indicador de scroll para pantallas móviles */}
      <div className="sm:hidden flex items-center justify-end gap-1 text-[11px] text-slate-400 mb-2">
        <span>Desliza para ver más columnas</span>
        <span className="font-bold">↔</span>
      </div>

      <div className="overflow-x-auto rounded-lg border border-[#E2E8F0]">
        <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
            <th className="py-3 px-4 text-[11px] font-bold text-[#475569] uppercase tracking-wider whitespace-nowrap">
              CÓDIGO
            </th>
            <th className="py-3 px-4 text-[11px] font-bold text-[#475569] uppercase tracking-wider whitespace-nowrap">
              TIPO DE MAQUINARIA
            </th>
            <th className="py-3 px-4 text-[11px] font-bold text-[#475569] uppercase tracking-wider whitespace-nowrap">
              HORÓMETRO ACUMULADO
            </th>
            <th className="py-3 px-4 text-[11px] font-bold text-[#475569] uppercase tracking-wider whitespace-nowrap">
              UMBRAL CICLO
            </th>
            <th className="py-3 px-4 text-[11px] font-bold text-[#475569] uppercase tracking-wider whitespace-nowrap min-w-[280px]">
              PROGRESO HACIA MANTENIMIENTO
            </th>
            <th className="py-3 px-4 text-[11px] font-bold text-[#475569] uppercase tracking-wider whitespace-nowrap">
              ESTADO
            </th>
            <th className="py-3 px-4 text-[11px] font-bold text-[#475569] uppercase tracking-wider whitespace-nowrap text-right">
              ACCIONES
            </th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={7} className="py-12 text-center text-[#64748B] text-sm">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-[#2563EB] border-t-transparent rounded-full animate-spin"></div>
                  <span>Cargando flota de maquinarias...</span>
                </div>
              </td>
            </tr>
          ) : machineries.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-12 text-center text-[#94A3B8] text-sm">
                <div className="flex flex-col items-center justify-center gap-2">
                  <AlertCircle className="w-8 h-8 text-slate-300" />
                  <span className="font-medium text-[#334155]">
                    No se encontraron maquinarias que coincidan con los filtros.
                  </span>
                  <span className="text-xs text-[#64748B]">
                    Intenta ajustar el código o seleccionar otro tipo o estado.
                  </span>
                </div>
              </td>
            </tr>
          ) : (
            machineries.map((item) => {
              const isBlocked = item.state === "BLOCKED";

              return (
                <tr
                  key={item.code}
                  className="border-b border-[#F1F5F9] last:border-b-0 hover:bg-slate-50/80 transition-colors"
                >
                  {/* CÓDIGO */}
                  <td
                    className={`py-4 px-4 text-[13px] font-bold whitespace-nowrap ${
                      isBlocked ? "text-[#DC2626]" : "text-[#0F172A]"
                    }`}
                  >
                    {item.code}
                  </td>

                  {/* TIPO DE MAQUINARIA */}
                  <td className="py-4 px-4 text-[13px] text-[#334155] whitespace-nowrap">
                    {item.machineryType}
                  </td>

                  {/* HORÓMETRO ACUMULADO */}
                  <td
                    className={`py-4 px-4 text-[13px] font-bold whitespace-nowrap ${
                      isBlocked ? "text-[#DC2626]" : "text-[#0F172A]"
                    }`}
                  >
                    {item.hourMeter.toFixed(1)} hrs
                  </td>

                  {/* UMBRAL CICLO */}
                  <td className="py-4 px-4 text-[13px] text-[#64748B] whitespace-nowrap">
                    {item.threshold} hrs
                  </td>

                  {/* PROGRESO HACIA MANTENIMIENTO */}
                  <td className="py-4 px-4">
                    <ProgressBar
                      current={item.hourMeter}
                      total={item.threshold}
                    />
                  </td>

                  {/* ESTADO */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <Badge
                      variant={isBlocked ? "danger" : "success"}
                      label={isBlocked ? "BLOQUEADA" : "ACTIVA"}
                    />
                  </td>

                  {/* ACCIONES */}
                  <td className="py-4 px-4 whitespace-nowrap text-right text-[13px]">
                    {isBlocked ? (
                      <Link
                        to="/maintenance"
                        className="inline-flex items-center justify-center h-[30px] px-3.5 rounded-md bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] font-bold text-[12px] hover:bg-[#DBEAFE] transition-colors"
                      >
                        + Registrar Mant.
                      </Link>
                    ) : (
                      <div className="inline-flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => onEditType(item)}
                          className="text-[#2563EB] hover:text-[#1D4ED8] hover:underline font-bold text-[13px] cursor-pointer"
                        >
                          Editar Tipo
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (
                              window.confirm(
                                `¿Está seguro de eliminar la maquinaria ${item.code}?`
                              )
                            ) {
                              onDelete(item.code);
                            }
                          }}
                          className="text-[#EF4444] hover:text-[#DC2626] hover:underline font-bold text-[13px] cursor-pointer"
                        >
                          Eliminar
                        </button>
                      </div>
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
