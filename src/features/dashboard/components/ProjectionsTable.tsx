import type { ProjectionItem, ShiftItem } from "../types/projection.types";
import { Badge } from "../../../shared/components/ui/Badge";
import { CheckCircle2 } from "lucide-react";

interface ProjectionsTableProps {
  projections: ProjectionItem[];
  shiftsById: Map<string, ShiftItem>;
  isLoading?: boolean;
}

export const ProjectionsTable = ({
  projections,
  shiftsById,
  isLoading,
}: ProjectionsTableProps) => {
  const formatShift = (item: ProjectionItem): string => {
    if (item.estimatedThresholdShiftId && shiftsById.has(item.estimatedThresholdShiftId)) {
      const shift = shiftsById.get(item.estimatedThresholdShiftId)!;
      const type = shift.shiftType === "Dia" ? "Día" : shift.shiftType;
      return `${type} (${shift.duration}h)`;
    }

    if (item.estimatedThresholdShiftType) {
      const type =
        item.estimatedThresholdShiftType === "Dia"
          ? "Día"
          : item.estimatedThresholdShiftType;
      const hours = type === "Día" ? "8h" : "12h";
      return `${type} (${hours})`;
    }

    return "—";
  };

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-xs p-4 sm:p-6">
      {/* Table Card Header */}
      <div>
        <h2 className="text-[15px] sm:text-[16px] font-bold text-[#0F172A] leading-tight">
          Proyección Preventiva a 7 Días (Equipos que alcanzarán su umbral)
        </h2>
        <p className="text-xs sm:text-[13px] text-[#64748B] mt-1">
          Cálculo basado en horómetro actual + acumulación de horas planificadas en turnos futuros
        </p>
      </div>

      {/* Indicador de scroll para móviles */}
      <div className="sm:hidden flex items-center justify-end gap-1 text-[11px] text-slate-400 mt-2">
        <span>Desliza para ver más columnas</span>
        <span className="font-bold">↔</span>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto mt-3 sm:mt-6 rounded-lg border border-[#E2E8F0]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
              <th className="py-3 px-4 text-[11px] font-bold text-[#475569] uppercase tracking-wider whitespace-nowrap">
                CÓDIGO
              </th>
              <th className="py-3 px-4 text-[11px] font-bold text-[#475569] uppercase tracking-wider whitespace-nowrap">
                TIPO DE EQUIPO
              </th>
              <th className="py-3 px-4 text-[11px] font-bold text-[#475569] uppercase tracking-wider whitespace-nowrap">
                HORÓMETRO ACTUAL
              </th>
              <th className="py-3 px-4 text-[11px] font-bold text-[#475569] uppercase tracking-wider whitespace-nowrap">
                UMBRAL
              </th>
              <th className="py-3 px-4 text-[11px] font-bold text-[#475569] uppercase tracking-wider whitespace-nowrap">
                RESTANTE
              </th>
              <th className="py-3 px-4 text-[11px] font-bold text-[#475569] uppercase tracking-wider whitespace-nowrap">
                PROYECTADO (7D)
              </th>
              <th className="py-3 px-4 text-[11px] font-bold text-[#475569] uppercase tracking-wider whitespace-nowrap">
                EXCESO
              </th>
              <th className="py-3 px-4 text-[11px] font-bold text-[#475569] uppercase tracking-wider whitespace-nowrap">
                FECHA ESTIMADA
              </th>
              <th className="py-3 px-4 text-[11px] font-bold text-[#475569] uppercase tracking-wider whitespace-nowrap">
                TURNO
              </th>
              <th className="py-3 px-4 text-[11px] font-bold text-[#475569] uppercase tracking-wider whitespace-nowrap">
                CONDICIÓN
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={10} className="py-12 text-center text-[#64748B] text-sm">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-[#2563EB] border-t-transparent rounded-full animate-spin"></div>
                    <span>Cargando proyecciones de flota...</span>
                  </div>
                </td>
              </tr>
            ) : projections.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-12 text-center text-[#94A3B8] text-sm">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                    <span className="font-medium text-[#334155]">
                      No hay maquinarias que superen su umbral dentro de los próximos 7 días.
                    </span>
                    <span className="text-xs text-[#64748B]">
                      Toda la flota se encuentra dentro de los márgenes preventivos seguros.
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              projections.map((item, index) => (
                <tr
                  key={`${item.machineryCode}-${index}`}
                  className="bg-[#FFFBEB] hover:bg-[#FEF9C3]/80 border-b border-[#FEF3C7] last:border-b-0 transition-colors"
                >
                  <td className="py-4 px-4 text-[13px] font-bold text-[#0F172A] whitespace-nowrap">
                    {item.machineryCode}
                  </td>
                  <td className="py-4 px-4 text-[13px] text-[#334155] whitespace-nowrap">
                    {item.machineryTypeName}
                  </td>
                  <td className="py-4 px-4 text-[13px] font-bold text-[#0F172A] whitespace-nowrap">
                    {item.currentHourMeter.toFixed(1)} hrs
                  </td>
                  <td className="py-4 px-4 text-[13px] text-[#64748B] whitespace-nowrap">
                    {item.maintenanceThreshold} hrs
                  </td>
                  <td className="py-4 px-4 text-[13px] font-bold text-[#D97706] whitespace-nowrap">
                    {item.remainingHours.toFixed(1)} hrs
                  </td>
                  <td className="py-4 px-4 text-[13px] font-bold text-[#0F172A] whitespace-nowrap">
                    {item.projectedHours.toFixed(1)} hrs
                  </td>
                  <td className="py-4 px-4 text-[13px] font-bold text-[#DC2626] whitespace-nowrap">
                    +{item.differenceHours.toFixed(1)} hrs
                  </td>
                  <td className="py-4 px-4 text-[13px] text-[#0F172A] whitespace-nowrap">
                    {item.estimatedThresholdDate}
                  </td>
                  <td className="py-4 px-4 text-[13px] text-[#334155] whitespace-nowrap">
                    {formatShift(item)}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <Badge variant="warning" label="PRÓXIMO A BLOQUEO" />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Info text if projections exist */}
      {!isLoading && projections.length > 0 && (
        <div className="mt-6 text-center text-[#94A3B8] text-[14px]">
          No hay más maquinarias que superen su umbral dentro de los próximos 7 días.
        </div>
      )}
    </div>
  );
};
