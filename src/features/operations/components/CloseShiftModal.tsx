import React, { useState } from "react";
import { Modal } from "../../../shared/components/ui/Modal";
import { Button } from "../../../shared/components/ui/Button";
import type { AssignmentDetailResource } from "../types/operations.types";
import { AlertTriangle, Clock } from "lucide-react";

interface CloseShiftModalProps {
  isOpen: boolean;
  assignment: AssignmentDetailResource | null;
  onClose: () => void;
  onSubmit: (id: string, timeEnd?: string) => Promise<boolean>;
  isSubmitting: boolean;
}

export const CloseShiftModal: React.FC<CloseShiftModalProps> = ({
  isOpen,
  assignment,
  onClose,
  onSubmit,
  isSubmitting,
}) => {
  const getCurrentTimeStr = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const [timeEnd, setTimeEnd] = useState<string>(getCurrentTimeStr());

  if (!assignment) return null;

  const formatTime = (dateTimeStr: string | null) => {
    if (!dateTimeStr) return "-";
    try {
      if (dateTimeStr.includes("T")) {
        return dateTimeStr.split("T")[1].substring(0, 5);
      }
      return dateTimeStr.substring(0, 5);
    } catch {
      return dateTimeStr;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onSubmit(assignment.id, timeEnd || undefined);
    if (success) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Cerrar Asignación de Turno"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Banner Informativo de Política P3/P4 */}
        <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg p-3.5 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-[#1E40AF] shrink-0 mt-0.5" />
          <div className="text-xs text-[#1E40AF] leading-relaxed">
            <span className="font-bold block mb-0.5">Control de Horómetro Operativo:</span>
            Al registrar el fin de turno, el sistema calculará las horas reales trabajadas y las acumulará en el horómetro de{" "}
            <strong>{assignment.machineryCode}</strong>. Si el equipo alcanza o supera su umbral, pasará automáticamente a estado <strong>BLOQUEADA</strong>.
          </div>
        </div>

        {/* Resumen de Asignación */}
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-3 text-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-[#64748B]">Maquinaria:</span>
            <span className="font-bold text-[#0F172A]">
              {assignment.machineryCode} ({assignment.machineryTypeName || "Equipo"})
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#64748B]">Operador Asignado:</span>
            <span className="font-medium text-[#0F172A]">{assignment.operatorName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#64748B]">Hora de Inicio Registrada:</span>
            <span className="font-bold text-[#2563EB] flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {formatTime(assignment.timeStart)}
            </span>
          </div>
        </div>

        {/* Campo Hora de Fin */}
        <div>
          <label className="block text-xs font-semibold text-[#334155] mb-1.5">
            Hora de Fin de Operación (HH:mm)
          </label>
          <div className="relative">
            <input
              type="time"
              value={timeEnd}
              onChange={(e) => setTimeEnd(e.target.value)}
              className="w-full h-[40px] px-3 bg-white border border-[#CBD5E1] rounded-md text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <span className="text-[11px] text-[#64748B] mt-1 block">
            Por defecto se establece la hora actual. Puede ajustarla si el cierre fue manual o diferido.
          </span>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-[#E2E8F0] flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center h-[40px] px-5 rounded-md bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold text-sm transition-colors cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? "Cerrando..." : "Confirmar Cierre de Turno"}
          </button>
        </div>
      </form>
    </Modal>
  );
};
