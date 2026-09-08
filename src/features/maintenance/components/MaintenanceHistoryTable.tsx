import React, { useState } from "react";
import { Badge } from "../../../shared/components/ui/Badge";
import type { MaintenanceViewModel } from "../types/maintenance.types";
import { ChevronDown, ChevronUp, FileText } from "lucide-react";

interface MaintenanceHistoryTableProps {
  maintenances: MaintenanceViewModel[];
  isLoading: boolean;
  hasActiveFilters?: boolean;
}

export const MaintenanceHistoryTable: React.FC<MaintenanceHistoryTableProps> = ({
  maintenances,
  isLoading,
  hasActiveFilters = false,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div
      className="border border-[#E5E7EB] rounded-lg overflow-hidden bg-white shadow-xs"
      data-node-id="8:1182"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          {/* Cabecera de la tabla */}
          <thead>
            <tr
              className="bg-[#F8FAFC] border-b border-[#E5E7EB] h-[40px] text-[#475569] text-[11px] font-bold uppercase tracking-[0.55px]"
              data-node-id="8:1183"
            >
              <th className="py-2.5 px-4 sm:px-6 w-1/4" scope="col">
                Fecha de Servicio
              </th>
              <th className="py-2.5 px-4 sm:px-6 w-1/4" scope="col">
                Maquinaria
              </th>
              <th className="py-2.5 px-4 sm:px-6 w-1/4" scope="col">
                Responsable Técnico
              </th>
              <th className="py-2.5 px-4 sm:px-6 w-1/4 text-right" scope="col">
                Estado Tras Mant.
              </th>
            </tr>
          </thead>

          {/* Cuerpo de la tabla */}
          <tbody className="divide-y divide-[#E5E7EB]">
            {isLoading ? (
              // Esqueleto de carga
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i} className="h-[56px] animate-pulse bg-white">
                  <td className="px-4 sm:px-6 py-4">
                    <div className="h-4 bg-slate-200 rounded w-24"></div>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="h-4 bg-slate-200 rounded w-20"></div>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="h-4 bg-slate-200 rounded w-32"></div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-right">
                    <div className="h-5 bg-slate-200 rounded-full w-16 ml-auto"></div>
                  </td>
                </tr>
              ))
            ) : maintenances.length === 0 ? (
              // Estado vacío
              <tr>
                <td colSpan={4} className="py-12 px-4 text-center">
                  <div className="flex flex-col items-center justify-center text-[#64748B]">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3 text-slate-400">
                      <FileText className="w-6 h-6" />
                    </div>
                    <p className="font-bold text-[#0F172A] text-sm mb-1">
                      {hasActiveFilters
                        ? "No se encontraron intervenciones con los filtros indicados"
                        : "No hay mantenimientos preventivos registrados aún"}
                    </p>
                    <p className="text-xs text-[#64748B] max-w-sm">
                      {hasActiveFilters
                        ? "Intenta modificar el código de máquina, el técnico o ampliar el rango de fechas."
                        : "Utiliza el botón superior '+ Registrar Mantenimiento' para reactivar un equipo y reiniciar su ciclo."}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              // Filas con datos
              maintenances.map((item) => {
                const isExpanded = expandedId === item.id;
                const hasDetails = Boolean(item.observation || item.hourMeter);

                return (
                  <React.Fragment key={item.id}>
                    <tr
                      className={`h-[56px] hover:bg-[#F8FAFC]/80 transition-colors ${
                        hasDetails ? "cursor-pointer" : ""
                      }`}
                      onClick={() => hasDetails && toggleExpand(item.id)}
                      data-node-id="8:1192"
                    >
                      {/* Fecha de Servicio */}
                      <td className="px-4 sm:px-6 py-3.5 text-[#0F172A] font-bold text-[13px] whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span>{item.date}</span>
                          {hasDetails && (
                            <span className="text-[#94A3B8]">
                              {isExpanded ? (
                                <ChevronUp className="w-3.5 h-3.5" />
                              ) : (
                                <ChevronDown className="w-3.5 h-3.5" />
                              )}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Código de Maquinaria */}
                      <td className="px-4 sm:px-6 py-3.5 text-[#0F172A] font-bold text-[13px] whitespace-nowrap">
                        <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {item.machineryCode}
                        </span>
                      </td>

                      {/* Responsable Técnico */}
                      <td className="px-4 sm:px-6 py-3.5 text-[#334155] font-medium text-[13px] whitespace-nowrap">
                        {item.operatorName}
                      </td>

                      {/* Estado Tras Mantenimiento */}
                      <td className="px-4 sm:px-6 py-3.5 text-right whitespace-nowrap">
                        <Badge variant="success" label="ACTIVO" />
                      </td>
                    </tr>

                    {/* Desglose de Observación si está expandido */}
                    {isExpanded && hasDetails && (
                      <tr className="bg-slate-50/70 border-b border-[#E5E7EB]">
                        <td colSpan={4} className="px-6 py-3 text-xs text-[#475569]">
                          <div className="flex flex-col sm:flex-row gap-4">
                            {item.hourMeter !== undefined && (
                              <div>
                                <span className="font-bold text-[#0F172A]">Horómetro registrado: </span>
                                <span>{item.hourMeter.toFixed(1)} hrs</span>
                              </div>
                            )}
                            {item.observation && (
                              <div className="flex-1">
                                <span className="font-bold text-[#0F172A]">Observación técnica: </span>
                                <span className="italic">"{item.observation}"</span>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
