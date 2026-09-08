import { useState } from "react";
import type { MachineryTypeResource } from "../types/machinery.types";
import { X } from "lucide-react";

interface CreateMachineryModalProps {
  isOpen: boolean;
  onClose: () => void;
  machineryTypes: MachineryTypeResource[];
  onConfirm: (code: string, typeId: number) => Promise<void>;
}

export const CreateMachineryModal = ({
  isOpen,
  onClose,
  machineryTypes,
  onConfirm,
}: CreateMachineryModalProps) => {
  const [code, setCode] = useState("");
  const [selectedTypeId, setSelectedTypeId] = useState<number | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      setErrorMessage("Por favor ingrese un código para el equipo.");
      return;
    }
    if (!selectedTypeId || typeof selectedTypeId !== "number") {
      setErrorMessage("Por favor seleccione un tipo de maquinaria.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await onConfirm(cleanCode, selectedTypeId);
      setCode("");
      setSelectedTypeId("");
      onClose();
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Ocurrió un error al registrar la maquinaria.";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl border border-[#E2E8F0] w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E2E8F0]">
          <div>
            <h3 className="text-lg font-bold text-[#0F172A]">
              Registrar Nueva Maquinaria
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Ingresa el código identificador y su categoría de flota
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-lg">
              {errorMessage}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-2">
              Código de Maquinaria *
            </label>
            <input
              type="text"
              placeholder="Ej: EXC-002, CAM-003, PRF-102"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              className="w-full h-[40px] px-3.5 bg-white border border-[#CBD5E1] rounded-md text-sm text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-2">
              Tipo de Maquinaria *
            </label>
            <select
              value={selectedTypeId}
              onChange={(e) => setSelectedTypeId(Number(e.target.value))}
              required
              className="w-full h-[40px] px-3 bg-white border border-[#CBD5E1] rounded-md text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="" disabled>
                Seleccione un tipo de maquinaria...
              </option>
              {machineryTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name} (Umbral: {type.maintenanceTime} hrs)
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
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
              <span>{isSubmitting ? "Registrando..." : "Registrar Equipo"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
