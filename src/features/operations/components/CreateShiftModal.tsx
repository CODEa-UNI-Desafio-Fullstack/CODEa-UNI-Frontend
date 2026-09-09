import React, { useState } from "react";
import { Modal } from "../../../shared/components/ui/Modal";
import { Button } from "../../../shared/components/ui/Button";
import type { ShiftResource, CreateShiftResource, UpdateShiftResource } from "../types/operations.types";

interface CreateShiftModalProps {
  isOpen: boolean;
  shiftToEdit?: ShiftResource | null;
  onClose: () => void;
  onSubmitCreate: (payload: CreateShiftResource) => Promise<boolean>;
  onSubmitUpdate: (id: string, payload: UpdateShiftResource) => Promise<boolean>;
  isSubmitting: boolean;
}

const CreateShiftForm: React.FC<{
  shiftToEdit?: ShiftResource | null;
  onClose: () => void;
  onSubmitCreate: (payload: CreateShiftResource) => Promise<boolean>;
  onSubmitUpdate: (id: string, payload: UpdateShiftResource) => Promise<boolean>;
  isSubmitting: boolean;
}> = ({
  shiftToEdit,
  onClose,
  onSubmitCreate,
  onSubmitUpdate,
  isSubmitting,
}) => {
  const isEditing = Boolean(shiftToEdit);
  const getTodayStr = () => new Date().toISOString().split("T")[0];

  const [date, setDate] = useState<string>(shiftToEdit ? shiftToEdit.date : getTodayStr());
  const [shiftType, setShiftType] = useState<"Dia" | "Noche">(
    shiftToEdit?.shiftType.toLowerCase() === "noche" ? "Noche" : "Dia"
  );
  const [duration, setDuration] = useState<number>(shiftToEdit ? shiftToEdit.duration : 8);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!date) {
      setValidationError("La fecha del turno es obligatoria.");
      return;
    }
    if (!duration || duration <= 0) {
      setValidationError("La duración debe ser mayor a 0 horas.");
      return;
    }

    const isDay = shiftType === "Dia";

    if (isEditing && shiftToEdit) {
      const success = await onSubmitUpdate(shiftToEdit.id, {
        date,
        shiftType: isDay,
        duration: Number(duration),
      });
      if (success) onClose();
    } else {
      const success = await onSubmitCreate({
        date,
        shiftType: isDay,
        duration: Number(duration),
      });
      if (success) onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {validationError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-xs text-red-700 font-medium">
          {validationError}
        </div>
      )}

      {/* 1. Fecha */}
      <div>
        <label className="block text-xs font-semibold text-[#334155] mb-1.5">
          Fecha del Turno <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full h-[40px] px-3 bg-white border border-[#CBD5E1] rounded-md text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* 2. Tipo de Turno */}
      <div>
        <label className="block text-xs font-semibold text-[#334155] mb-1.5">
          Tipo de Turno <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              setShiftType("Dia");
              if (duration === 12) setDuration(8);
            }}
            className={`h-[40px] rounded-md border text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 ${
              shiftType === "Dia"
                ? "bg-[#EFF6FF] border-[#2563EB] text-[#2563EB]"
                : "bg-white border-[#CBD5E1] text-[#64748B] hover:bg-[#F8FAFC]"
            }`}
          >
            Turno Día (8h estándar)
          </button>
          <button
            type="button"
            onClick={() => {
              setShiftType("Noche");
              if (duration === 8) setDuration(12);
            }}
            className={`h-[40px] rounded-md border text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 ${
              shiftType === "Noche"
                ? "bg-[#EFF6FF] border-[#2563EB] text-[#2563EB]"
                : "bg-white border-[#CBD5E1] text-[#64748B] hover:bg-[#F8FAFC]"
            }`}
          >
            Turno Noche (12h estándar)
          </button>
        </div>
      </div>

      {/* 3. Duración */}
      <div>
        <label className="block text-xs font-semibold text-[#334155] mb-1.5">
          Duración Planificada (horas) <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          min={1}
          max={24}
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          required
          className="w-full h-[40px] px-3 bg-white border border-[#CBD5E1] rounded-md text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span className="text-[11px] text-[#64748B] mt-1 block">
          Este valor define la cantidad de horas base estimadas para la flota asignada.
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
          {isEditing ? "Guardar Cambios" : "Crear Turno"}
        </Button>
      </div>
    </form>
  );
};

export const CreateShiftModal: React.FC<CreateShiftModalProps> = ({
  isOpen,
  shiftToEdit,
  onClose,
  onSubmitCreate,
  onSubmitUpdate,
  isSubmitting,
}) => {
  const isEditing = Boolean(shiftToEdit);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Editar Turno Programado" : "Crear Nuevo Turno"}
    >
      {isOpen && (
        <CreateShiftForm
          key={shiftToEdit?.id ?? "new"}
          shiftToEdit={shiftToEdit}
          onClose={onClose}
          onSubmitCreate={onSubmitCreate}
          onSubmitUpdate={onSubmitUpdate}
          isSubmitting={isSubmitting}
        />
      )}
    </Modal>
  );
};
