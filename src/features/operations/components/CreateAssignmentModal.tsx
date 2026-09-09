import React, { useState } from "react";
import { Modal } from "../../../shared/components/ui/Modal";
import { Button } from "../../../shared/components/ui/Button";
import type {
  ShiftResource,
  OperatorOption,
  CreateAssignmentResource,
} from "../types/operations.types";
import type { MachineryResource } from "../../machinery/types/machinery.types";
import type { RuleViolationError } from "../../../shared/types/api.types";
import { AlertTriangle } from "lucide-react";

interface CreateAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  shifts: ShiftResource[];
  operators: OperatorOption[];
  machineries: MachineryResource[];
  rejectionErrors: RuleViolationError[] | null;
  onClearRejectionErrors: () => void;
  onSubmit: (payload: CreateAssignmentResource) => Promise<boolean>;
  isSubmitting: boolean;
}

const CreateAssignmentForm: React.FC<{
  shifts: ShiftResource[];
  operators: OperatorOption[];
  machineries: MachineryResource[];
  rejectionErrors: RuleViolationError[] | null;
  onClearRejectionErrors: () => void;
  onSubmit: (payload: CreateAssignmentResource) => Promise<boolean>;
  onClose: () => void;
  isSubmitting: boolean;
}> = ({
  shifts,
  operators,
  machineries,
  rejectionErrors,
  onClearRejectionErrors,
  onSubmit,
  onClose,
  isSubmitting,
}) => {
  const [shiftId, setShiftId] = useState<string>(shifts[0]?.id ?? "");
  const [operatorId, setOperatorId] = useState<string>(operators[0]?.id ?? "");
  const [machineryCode, setMachineryCode] = useState<string>(machineries[0]?.code ?? "");
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    const targetShiftId = shiftId || (shifts[0]?.id ?? "");
    const targetOperatorId = operatorId || (operators[0]?.id ?? "");
    const targetMachineryCode = machineryCode || (machineries[0]?.code ?? "");

    if (!targetShiftId) {
      setLocalError("Seleccione un turno programado.");
      return;
    }
    if (!targetOperatorId) {
      setLocalError("Seleccione un operador habilitado.");
      return;
    }
    if (!targetMachineryCode) {
      setLocalError("Seleccione un equipo de la flota.");
      return;
    }

    const success = await onSubmit({
      shiftId: targetShiftId,
      operatorId: targetOperatorId,
      machineryCode: targetMachineryCode,
    });

    if (success) {
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Banner de Errores de Validación 422 (Figma Node 8:988) */}
      {rejectionErrors && rejectionErrors.length > 0 && (
        <div className="bg-[#FEF2F2] border border-[#F87171] rounded-lg p-4 animate-fade-in">
          <div className="flex items-center gap-2 text-[#991B1B] font-bold text-sm mb-2">
            <span className="w-5 h-5 rounded-full bg-[#DC2626] text-white flex items-center justify-center text-xs font-bold shrink-0">
              !
            </span>
            <span>
              Asignación Rechazada ({rejectionErrors.length}{" "}
              {rejectionErrors.length === 1 ? "Regla Incumplida" : "Reglas Incumplidas"})
            </span>
          </div>
          <ul className="list-disc list-inside text-xs text-[#B91C1C] space-y-1 font-medium pl-1">
            {rejectionErrors.map((err, idx) => (
              <li key={idx} className="leading-relaxed">
                {err.rule && err.rule !== "REGLA_GENERAL" && err.rule !== "ERROR" ? (
                  <span className="font-bold">[{err.rule}]: </span>
                ) : null}
                <span>{err.message}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {localError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-xs text-red-700 font-medium flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{localError}</span>
        </div>
      )}

      {/* 1. Turno Programado */}
      <div>
        <label className="block text-xs font-semibold text-[#334155] mb-1.5">
          Turno Programado <span className="text-red-500">*</span>
        </label>
        <select
          value={shiftId}
          onChange={(e) => {
            setShiftId(e.target.value);
            onClearRejectionErrors();
          }}
          required
          className="w-full h-[40px] px-3 bg-white border border-[#CBD5E1] rounded-md text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          {shifts.length === 0 ? (
            <option value="">No hay turnos disponibles (Cree uno primero)</option>
          ) : (
            shifts.map((s) => (
              <option key={s.id} value={s.id}>
                {s.date} — Turno {s.shiftType} ({s.duration} hrs)
              </option>
            ))
          )}
        </select>
      </div>

      {/* 2. Operador */}
      <div>
        <label className="block text-xs font-semibold text-[#334155] mb-1.5">
          Operador <span className="text-red-500">*</span>
        </label>
        <select
          value={operatorId}
          onChange={(e) => {
            setOperatorId(e.target.value);
            onClearRejectionErrors();
          }}
          required
          className="w-full h-[40px] px-3 bg-white border border-[#CBD5E1] rounded-md text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          {operators.length === 0 ? (
            <option value="">No hay operadores disponibles</option>
          ) : (
            operators.map((op) => (
              <option key={op.id} value={op.id}>
                {op.name}
              </option>
            ))
          )}
        </select>
      </div>

      {/* 3. Maquinaria */}
      <div>
        <label className="block text-xs font-semibold text-[#334155] mb-1.5">
          Maquinaria <span className="text-red-500">*</span>
        </label>
        <select
          value={machineryCode}
          onChange={(e) => {
            setMachineryCode(e.target.value);
            onClearRejectionErrors();
          }}
          required
          className="w-full h-[40px] px-3 bg-white border border-[#CBD5E1] rounded-md text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          {machineries.length === 0 ? (
            <option value="">No hay maquinarias registradas</option>
          ) : (
            machineries.map((m) => (
              <option key={m.code} value={m.code}>
                {m.code} — {m.machineryType} {m.state === "BLOCKED" ? "(BLOQUEADA)" : ""}
              </option>
            ))
          )}
        </select>
        <span className="text-[11px] text-[#64748B] mt-1 block">
          El sistema verificará automáticamente la vigencia de certificación del operador y el estado operativo del equipo.
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
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
        >
          {rejectionErrors && rejectionErrors.length > 0 ? "Reintentar" : "Asignar Operación"}
        </Button>
      </div>
    </form>
  );
};

export const CreateAssignmentModal: React.FC<CreateAssignmentModalProps> = ({
  isOpen,
  onClose,
  shifts,
  operators,
  machineries,
  rejectionErrors,
  onClearRejectionErrors,
  onSubmit,
  isSubmitting,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nueva Asignación Operativa"
    >
      {isOpen && (
        <CreateAssignmentForm
          shifts={shifts}
          operators={operators}
          machineries={machineries}
          rejectionErrors={rejectionErrors}
          onClearRejectionErrors={onClearRejectionErrors}
          onSubmit={onSubmit}
          onClose={onClose}
          isSubmitting={isSubmitting}
        />
      )}
    </Modal>
  );
};
