import React, { useState } from "react";
import { Modal } from "../../../shared/components/ui/Modal";
import { Button } from "../../../shared/components/ui/Button";
import { Info, AlertCircle } from "lucide-react";
import type { CreateMaintenanceResource } from "../types/maintenance.types";
import type { MachineryResource } from "../../machinery/types/machinery.types";
import type { OperatorOption } from "../../operations/types/operations.types";

interface CreateMaintenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  machineries: MachineryResource[];
  operators: OperatorOption[];
  onConfirm: (payload: CreateMaintenanceResource) => Promise<boolean>;
  initialMachineryCode?: string;
}

export const CreateMaintenanceModal: React.FC<CreateMaintenanceModalProps> = ({
  isOpen,
  onClose,
  machineries,
  operators,
  onConfirm,
  initialMachineryCode = "",
}) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Registrar Mantenimiento" maxWidth="max-w-md">
      <CreateMaintenanceForm
        onClose={onClose}
        machineries={machineries}
        operators={operators}
        onConfirm={onConfirm}
        initialMachineryCode={initialMachineryCode}
      />
    </Modal>
  );
};

interface CreateMaintenanceFormProps {
  onClose: () => void;
  machineries: MachineryResource[];
  operators: OperatorOption[];
  onConfirm: (payload: CreateMaintenanceResource) => Promise<boolean>;
  initialMachineryCode?: string;
}

const CreateMaintenanceForm: React.FC<CreateMaintenanceFormProps> = ({
  onClose,
  machineries,
  operators,
  onConfirm,
  initialMachineryCode = "",
}) => {
  const today = new Date().toISOString().split("T")[0];

  const [date, setDate] = useState<string>(today);
  const [machineryCode, setMachineryCode] = useState<string>(
    initialMachineryCode || (machineries.length > 0 ? machineries[0].code : "")
  );
  const [operatorId, setOperatorId] = useState<string>(
    operators.length > 0 ? operators[0].id : ""
  );
  const [observation, setObservation] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selectedMachinery = machineries.find((m) => m.code === machineryCode);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!machineryCode) {
      setErrorMessage("Debe seleccionar una maquinaria.");
      return;
    }
    if (!operatorId) {
      setErrorMessage("Debe seleccionar un responsable técnico.");
      return;
    }
    if (!date) {
      setErrorMessage("Debe indicar la fecha de la intervención.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const payload: CreateMaintenanceResource = {
        machineryCode,
        operatorId,
        date,
        observation: observation.trim() || undefined,
        hourMeter: selectedMachinery ? selectedMachinery.hourMeter : 0,
      };

      const success = await onConfirm(payload);
      if (success) {
        onClose();
      }
    } catch (err: unknown) {
      console.error("Error al registrar mantenimiento:", err);
      const msg =
        err instanceof Error ? err.message : "Error al registrar el mantenimiento en el servidor";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4.5" data-node-id="1:850">
      {/* Banner de error si falló la petición */}
      {errorMessage && (
        <div className="bg-[#FEF2F2] border border-[#FCA5A5] text-[#991B1B] text-xs p-3 rounded-md flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Campo: FECHA DE MANTENIMIENTO */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="maint-date"
          className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider"
        >
          Fecha de Mantenimiento
        </label>
        <input
          id="maint-date"
          type="date"
          required
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="h-[40px] px-3 bg-white border border-[#CBD5E1] rounded-md text-[13px] text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
        />
      </div>

      {/* Campo: CÓDIGO MAQUINARIA */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="maint-machinery"
          className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider"
        >
          Código Maquinaria
        </label>
        <select
          id="maint-machinery"
          required
          value={machineryCode}
          onChange={(e) => setMachineryCode(e.target.value)}
          className="h-[40px] px-3 bg-white border border-[#CBD5E1] rounded-md text-[13px] text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] cursor-pointer"
        >
          {machineries.map((m) => (
            <option key={m.code} value={m.code}>
              {m.code} - {m.machineryType}{" "}
              {m.state === "BLOCKED"
                ? `(BLOQUEADA - ${m.hourMeter.toFixed(1)} hrs)`
                : `(${m.hourMeter.toFixed(1)} hrs)`}
            </option>
          ))}
        </select>
        {selectedMachinery && selectedMachinery.state === "BLOCKED" && (
          <p className="text-xs text-[#DC2626] font-semibold">
            ⚠️ Esta maquinaria está actualmente BLOQUEADA por exceso de horómetro.
          </p>
        )}
      </div>

      {/* Campo: RESPONSABLE TÉCNICO */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="maint-operator"
          className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider"
        >
          Responsable Técnico
        </label>
        <select
          id="maint-operator"
          required
          value={operatorId}
          onChange={(e) => setOperatorId(e.target.value)}
          className="h-[40px] px-3 bg-white border border-[#CBD5E1] rounded-md text-[13px] text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] cursor-pointer"
        >
          <option value="" disabled>
            Seleccione un técnico responsable...
          </option>
          {operators.map((op) => (
            <option key={op.id} value={op.id}>
              {op.name}
            </option>
          ))}
        </select>
      </div>

      {/* Campo: OBSERVACIONES TÉCNICAS */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="maint-observation"
          className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider"
        >
          Observaciones Técnicas
        </label>
        <textarea
          id="maint-observation"
          rows={3}
          value={observation}
          onChange={(e) => setObservation(e.target.value)}
          placeholder="Describa la intervención realizada..."
          className="p-3 bg-white border border-[#CBD5E1] rounded-md text-[13px] text-[#0F172A] placeholder-[#9CA3AF] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] resize-none"
        />
      </div>

      {/* Callout Informativo de Política P3 */}
      <div
        className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg p-3 text-xs text-[#1E40AF] flex items-start gap-2"
        data-node-id="1:868"
      >
        <Info className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
        <p>
          Al confirmar, el horómetro se reiniciará a{" "}
          <strong className="font-bold">0.0 hrs</strong> y la máquina quedará activa.
        </p>
      </div>

      {/* Botones de acción Footer */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E8F0] mt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          Confirmar
        </Button>
      </div>
    </form>
  );
};
