import React, { useState, useEffect } from "react";
import { Modal } from "../../../shared/components/ui/Modal";
import { Button } from "../../../shared/components/ui/Button";
import { Calendar, AlertCircle, RefreshCw } from "lucide-react";
import type { CertificationViewModel } from "../types/operator.types";

interface RenewCertificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  operatorId: string;
  operatorName: string;
  certification: CertificationViewModel | null;
  onSubmit: (
    operatorId: string,
    machineryTypeId: number,
    expirationDate: string
  ) => Promise<boolean>;
  isLoading?: boolean;
}

function getDefaultExtendedDate(currentDate?: string): string {
  const date = currentDate ? new Date(currentDate) : new Date();
  // Extender 1 año a partir de hoy o de la fecha actual
  const now = new Date();
  const baseDate = date > now ? date : now;
  baseDate.setFullYear(baseDate.getFullYear() + 1);

  const year = baseDate.getFullYear();
  const month = String(baseDate.getMonth() + 1).padStart(2, "0");
  const day = String(baseDate.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export const RenewCertificationModal: React.FC<RenewCertificationModalProps> = ({
  isOpen,
  onClose,
  operatorId,
  operatorName,
  certification,
  onSubmit,
  isLoading = false,
}) => {
  const [newExpirationDate, setNewExpirationDate] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && certification) {
      setNewExpirationDate(getDefaultExtendedDate(certification.expirationDate));
      setErrorMessage(null);
    }
  }, [isOpen, certification]);

  if (!certification) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpirationDate) {
      setErrorMessage("Debes especificar la nueva fecha de vigencia.");
      return;
    }

    try {
      setErrorMessage(null);
      await onSubmit(operatorId, certification.machineryTypeId, newExpirationDate);
      onClose();
    } catch (err: any) {
      const serverMsg =
        err?.response?.data?.message ||
        "No se pudo renovar la certificación. Intenta de nuevo.";
      setErrorMessage(serverMsg);
    }
  };

  const handleModalClose = () => {
    setErrorMessage(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      title={`Renovar Certificación: ${certification.machineryTypeName}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#64748B] font-medium">Operador:</span>
            <span className="font-bold text-[#0F172A]">{operatorName}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#64748B] font-medium">Maquinaria:</span>
            <span className="font-bold text-[#0F172A]">
              {certification.machineryTypeName}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#64748B] font-medium">Vigencia Actual:</span>
            <span
              className={`font-semibold ${
                certification.isExpired ? "text-[#B91C1C]" : "text-[#15803D]"
              }`}
            >
              {certification.expirationDate} ({certification.isExpired ? "VENCIDA" : "VIGENTE"})
            </span>
          </div>
        </div>

        {errorMessage && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-red-700 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="space-y-1.5">
          <label
            htmlFor="renew-expiration-date"
            className="block text-xs font-bold text-[#334155] uppercase tracking-wider"
          >
            Nueva Fecha de Expiración <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="renew-expiration-date"
              type="date"
              required
              value={newExpirationDate}
              onChange={(e) => {
                setNewExpirationDate(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              className="w-full h-[40px] pl-9 pr-3 bg-white border border-[#CBD5E1] rounded-md text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            />
          </div>
          <p className="text-[11px] text-[#64748B]">
            Al extender la vigencia, el operador quedará habilitado para turnos con este tipo de equipo.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
          <Button
            type="button"
            variant="outline"
            onClick={handleModalClose}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            icon={<RefreshCw className="w-4 h-4" />}
          >
            Confirmar Renovación
          </Button>
        </div>
      </form>
    </Modal>
  );
};
