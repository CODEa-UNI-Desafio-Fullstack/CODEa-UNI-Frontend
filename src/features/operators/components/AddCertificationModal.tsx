import React, { useState, useEffect } from "react";
import { Modal } from "../../../shared/components/ui/Modal";
import { Button } from "../../../shared/components/ui/Button";
import { Calendar, ChevronDown, AlertCircle, Info } from "lucide-react";
import type { MachineryTypeResource } from "../../machinery/types/machinery.types";

interface AddCertificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  operatorId: string;
  operatorName: string;
  machineryTypes: MachineryTypeResource[];
  existingMachineryTypeIds: number[];
  onSubmit: (
    operatorId: string,
    machineryTypeId: number,
    expirationDate: string
  ) => Promise<boolean>;
  isLoading?: boolean;
}

/**
 * Retorna la fecha de hoy + 1 año en formato YYYY-MM-DD.
 */
function getDefaultOneYearExpiration(): string {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 1);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export const AddCertificationModal: React.FC<AddCertificationModalProps> = ({
  isOpen,
  onClose,
  operatorId,
  operatorName,
  machineryTypes,
  existingMachineryTypeIds,
  onSubmit,
  isLoading = false,
}) => {
  const [selectedTypeId, setSelectedTypeId] = useState<number | "">("");
  const [expirationDate, setExpirationDate] = useState<string>(
    getDefaultOneYearExpiration()
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Tipos disponibles (los que el operador aún no tiene registrados)
  const availableTypes = machineryTypes.filter(
    (t) => !existingMachineryTypeIds.includes(t.id)
  );

  useEffect(() => {
    if (isOpen) {
      if (availableTypes.length > 0) {
        setSelectedTypeId(availableTypes[0].id);
      } else {
        setSelectedTypeId("");
      }
      setExpirationDate(getDefaultOneYearExpiration());
      setErrorMessage(null);
    }
  }, [isOpen, machineryTypes, existingMachineryTypeIds]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTypeId) {
      setErrorMessage("Por favor selecciona un tipo de maquinaria.");
      return;
    }
    if (!expirationDate) {
      setErrorMessage("La fecha de vencimiento es obligatoria.");
      return;
    }

    try {
      setErrorMessage(null);
      await onSubmit(operatorId, Number(selectedTypeId), expirationDate);
      onClose();
    } catch (err: any) {
      const serverMsg =
        err?.response?.data?.message ||
        "No se pudo registrar la certificación. Intenta nuevamente.";
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
      title={`+ Añadir Certificación: ${operatorName}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Banner Informativo Regla P5 */}
        <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg p-3 flex items-start gap-2 text-[#1E40AF] text-xs">
          <Info className="w-4 h-4 shrink-0 text-[#2563EB] mt-0.5" />
          <div>
            <p className="font-bold">Acreditación Técnica de Maquinaria (Regla P5)</p>
            <p className="text-[11px] text-[#3B82F6] mt-0.5">
              El operador solo podrá ser asignado a turnos con maquinaria del tipo acreditado si la fecha de turno no supera la fecha de expiración.
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-red-700 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Selector de Tipo de Maquinaria */}
        <div className="space-y-1.5">
          <label
            htmlFor="cert-machinery-type"
            className="block text-xs font-bold text-[#334155] uppercase tracking-wider"
          >
            Tipo de Maquinaria <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              id="cert-machinery-type"
              required
              value={selectedTypeId}
              onChange={(e) => {
                setSelectedTypeId(e.target.value ? Number(e.target.value) : "");
                if (errorMessage) setErrorMessage(null);
              }}
              disabled={availableTypes.length === 0}
              className="w-full h-[40px] pl-3 pr-8 bg-white border border-[#CBD5E1] rounded-md text-sm text-[#334155] focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer disabled:bg-slate-100"
            >
              {availableTypes.length === 0 ? (
                <option value="">Todas las maquinarias ya están acreditadas</option>
              ) : (
                availableTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name} (Umbral de mant.: {type.maintenanceTime}h)
                  </option>
                ))
              )}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Input de Fecha de Vencimiento */}
        <div className="space-y-1.5">
          <label
            htmlFor="cert-expiration-date"
            className="block text-xs font-bold text-[#334155] uppercase tracking-wider"
          >
            Fecha de Expiración / Vencimiento <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="cert-expiration-date"
              type="date"
              required
              value={expirationDate}
              onChange={(e) => {
                setExpirationDate(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              className="w-full h-[40px] pl-9 pr-3 bg-white border border-[#CBD5E1] rounded-md text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            />
          </div>
          <p className="text-[11px] text-[#64748B]">
            Por convención se sugiere una vigencia de 1 año renovable.
          </p>
        </div>

        {/* Botones de Acción */}
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
            disabled={availableTypes.length === 0}
          >
            Guardar Certificación
          </Button>
        </div>
      </form>
    </Modal>
  );
};
