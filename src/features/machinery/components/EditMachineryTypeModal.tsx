import { useState } from "react";
import type {
  MachineryViewModel,
  MachineryTypeResource,
} from "../types/machinery.types";
import { X } from "lucide-react";

interface EditMachineryTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  machinery: MachineryViewModel | null;
  machineryTypes: MachineryTypeResource[];
  onConfirm: (code: string, newTypeId: number) => Promise<void>;
}

export const EditMachineryTypeModal = ({
  isOpen,
  onClose,
  machinery,
  machineryTypes,
  onConfirm,
}: EditMachineryTypeModalProps) => {
  const getInitialTypeId = () => {
    if (!machinery) return "";
    const current = machineryTypes.find(
      (t) => t.name.toLowerCase() === machinery.machineryType.toLowerCase()
    );
    return current ? current.id : "";
  };

  const [selectedTypeId, setSelectedTypeId] = useState<number | "">(getInitialTypeId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen || !machinery) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTypeId || typeof selectedTypeId !== "number") {
      setErrorMessage("Por favor seleccione un tipo de maquinaria válido.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await onConfirm(machinery.code, selectedTypeId);
      onClose();
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Ocurrió un error al actualizar el tipo de maquinaria.";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-3 sm:p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl border border-[#E2E8F0] w-full max-w-lg max-h-[92vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E2E8F0]">
          <div>
            <h3 className="text-lg font-bold text-[#0F172A]">
              Editar Tipo de Maquinaria
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Actualiza la categoría y el intervalo de mantenimiento preventivo
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-lg">
              {errorMessage}
            </div>
          )}

          {/* Código de Maquinaria (Solo lectura) */}
          <div>
            <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-2">
              Código de Maquinaria
            </label>
            <input
              type="text"
              value={machinery.code}
              disabled
              className="w-full h-[40px] px-3.5 bg-slate-100 border border-[#CBD5E1] rounded-md text-sm font-bold text-[#0F172A] cursor-not-allowed"
            />
          </div>

          {/* Horómetro actual */}
          <div>
            <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-2">
              Horómetro Actual
            </label>
            <div className="text-sm font-semibold text-[#0F172A]">
              {machinery.hourMeter.toFixed(1)} hrs
            </div>
          </div>

          {/* Selector de Nuevo Tipo de Maquinaria */}
          <div>
            <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-2">
              Nuevo Tipo de Maquinaria *
            </label>
            <select
              value={selectedTypeId}
              onChange={(e) => setSelectedTypeId(Number(e.target.value))}
              required
              className="w-full h-[40px] px-3 bg-white border border-[#CBD5E1] rounded-md text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="" disabled>
                Seleccione un tipo...
              </option>
              {machineryTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name} (Umbral: {type.maintenanceTime} hrs)
                </option>
              ))}
            </select>
          </div>

          {/* Modal Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-[40px] px-5 rounded-md border border-[#CBD5E1] bg-white text-[#334155] text-sm font-bold hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-[40px] px-6 rounded-md bg-[#2563EB] text-white text-sm font-bold hover:bg-[#1D4ED8] transition-colors flex items-center gap-2"
            >
              {isSubmitting && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              <span>{isSubmitting ? "Guardando..." : "Guardar Cambios"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
