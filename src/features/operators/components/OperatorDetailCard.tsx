import React from "react";
import { Badge } from "../../../shared/components/ui/Badge";
import { Plus, Truck, AlertTriangle } from "lucide-react";
import type {
  OperatorViewModel,
  CertificationViewModel,
} from "../types/operator.types";

interface OperatorDetailCardProps {
  operator: OperatorViewModel | null;
  onAddCertification: () => void;
  onRenewCertification: (cert: CertificationViewModel) => void;
  onDeleteCertification: (cert: CertificationViewModel) => void;
}

export const OperatorDetailCard: React.FC<OperatorDetailCardProps> = ({
  operator,
  onAddCertification,
  onRenewCertification,
  onDeleteCertification,
}) => {
  if (!operator) {
    return (
      <div className="bg-white border border-[#E2E8F0] rounded-[12px] p-8 text-center text-slate-400">
        <p className="text-sm">Selecciona un operador de la lista para ver su detalle y certificaciones.</p>
      </div>
    );
  }

  const isHabilitado = operator.status !== "NO HABILITADO";

  return (
    <div className="bg-white border border-[#E2E8F0] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] rounded-[12px] p-6 sm:p-8 space-y-6 animate-fade-in">
      {/* 1. Encabezado del Operador Seleccionado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[20px] font-bold text-[#0F172A] tracking-tight">
            {operator.name}
          </h2>
          <p className="text-[12px] text-[#94A3B8] mt-0.5 font-mono">
            ID: {operator.id}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Badge de Estado General */}
          <Badge
            variant={isHabilitado ? "success" : "danger"}
            label={operator.status}
          />

          {/* Botón: + Añadir Certificación */}
          <button
            type="button"
            onClick={onAddCertification}
            className="inline-flex items-center gap-2 h-[36px] px-4 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] text-[13px] font-bold hover:bg-[#DBEAFE] transition-colors cursor-pointer shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Añadir Certificación</span>
          </button>
        </div>
      </div>

      {/* 2. Listado de Certificaciones Técnicas de Maquinaria */}
      <div className="space-y-3">
        {operator.certifications.length === 0 ? (
          <div className="bg-[#F8FAFC] border border-dashed border-[#CBD5E1] rounded-lg p-6 text-center">
            <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2 opacity-80" />
            <p className="text-sm font-semibold text-[#334155]">
              No cuenta con certificaciones técnicas registradas
            </p>
            <p className="text-xs text-[#64748B] mt-1 max-w-md mx-auto">
              Haz clic en <span className="font-bold text-[#2563EB]">Añadir Certificación</span> para acreditar a este operador en un tipo de maquinaria y habilitar su asignación a turnos.
            </p>
          </div>
        ) : (
          operator.certifications.map((cert) => (
            <div
              key={cert.machineryTypeId}
              className="bg-[#F8FAFC] border border-[#F1F5F9] rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#E2E8F0] transition-colors"
            >
              {/* Bloque Izquierdo: Icono Genérico + Nombre de Maquinaria + Vigencia */}
              <div className="flex items-center gap-4">
                {/* Contenedor estandarizado 40x40 para icono de maquinaria */}
                <div className="bg-white border border-[#E2E8F0] rounded-[4px] size-[40px] flex items-center justify-center shrink-0 shadow-2xs">
                  <Truck className="w-5 h-5 text-slate-700" />
                </div>

                <div>
                  <h3 className="text-[14px] font-bold text-[#0F172A] leading-tight">
                    {cert.machineryTypeName}
                  </h3>
                  <p
                    className={`text-[12px] font-medium mt-0.5 tracking-tight ${
                      cert.isExpired ? "text-[#B91C1C]" : "text-[#15803D]"
                    }`}
                  >
                    Exp: {cert.expirationDate} •{" "}
                    <span className="uppercase font-semibold">
                      {cert.isExpired ? "Vencida" : "Vigente"}
                    </span>
                  </p>
                </div>
              </div>

              {/* Bloque Derecho: Acciones Renovar y Eliminar */}
              <div className="flex items-center gap-4 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => onRenewCertification(cert)}
                  className="text-[#2563EB] hover:text-[#1D4ED8] hover:underline font-bold text-[13px] cursor-pointer transition-colors"
                >
                  Renovar
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteCertification(cert)}
                  className="text-[#B91C1C] hover:text-[#991B1B] hover:underline font-bold text-[13px] cursor-pointer transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
