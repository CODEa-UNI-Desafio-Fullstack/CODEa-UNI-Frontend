import { useState } from "react";
import type { MachineryTypeResource } from "../types/machinery.types";
import { X, Plus } from "lucide-react";

interface MachineryTypesModalProps {
  isOpen: boolean;
  onClose: () => void;
  machineryTypes: MachineryTypeResource[];
  onCreateType: (name: string, maintenanceTime: number) => Promise<void>;
}

export const MachineryTypesModal = ({
  isOpen,
  onClose,
  machineryTypes,
  onCreateType,
}: MachineryTypesModalProps) => {
  const [name, setName] = useState("");
  const [maintenanceTime, setMaintenanceTime] = useState<number | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddType = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) {
      setErrorMessage("Por favor ingrese el nombre del tipo de maquinaria.");
      return;
    }
    if (!maintenanceTime || typeof maintenanceTime !== "number" || maintenanceTime <= 0) {
      setErrorMessage("Por favor ingrese un umbral de mantenimiento válido en horas.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await onCreateType(cleanName, maintenanceTime);
      setName("");
      setMaintenanceTime("");
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Error al registrar el tipo de maquinaria.";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl border border-[#E2E8F0] w-full max-w-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E2E8F0]">
          <div>
            <h3 className="text-lg font-bold text-[#0F172A]">
              Tipos de Maquinaria e Intervalos
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Catálogo de tipos registrados con su umbral de mantenimiento preventivo
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* List of current types */}
          <div>
            <h4 className="text-xs font-bold text-[#475569] uppercase tracking-wider mb-3">
              Tipos Registrados ({machineryTypes.length})
            </h4>
            <div className="border border-[#E2E8F0] rounded-lg divide-y divide-[#E2E8F0]">
              {machineryTypes.map((type) => (
                <div
                  key={type.id}
                  className="px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#64748B] bg-slate-100 px-2 py-0.5 rounded">
                      ID: {type.id}
                    </span>
                    <span className="text-sm font-semibold text-[#0F172A]">
                      {type.name}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-[#1D4ED8] bg-[#EFF6FF] px-2.5 py-1 rounded-md border border-[#BFDBFE]">
                    Umbral: {type.maintenanceTime} hrs
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form to add a new type */}
          <form
            onSubmit={handleAddType}
            className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 space-y-4"
          >
            <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-blue-600" />
              <span>Registrar Nuevo Tipo</span>
            </h4>

            {errorMessage && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-2.5 rounded-lg">
                {errorMessage}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#475569] uppercase mb-1">
                  Nombre del Tipo *
                </label>
                <input
                  type="text"
                  placeholder="Ej: Tractor de Ruedas"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full h-[38px] px-3 bg-white border border-[#CBD5E1] rounded-md text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#475569] uppercase mb-1">
                  Umbral Mantenimiento (hrs) *
                </label>
                <input
                  type="number"
                  placeholder="Ej: 300"
                  min="1"
                  value={maintenanceTime}
                  onChange={(e) =>
                    setMaintenanceTime(
                      e.target.value ? Number(e.target.value) : ""
                    )
                  }
                  required
                  className="w-full h-[38px] px-3 bg-white border border-[#CBD5E1] rounded-md text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={isSubmitting}
                className="h-[36px] px-4 rounded-md bg-[#2563EB] text-white text-xs font-bold hover:bg-[#1D4ED8] transition-colors flex items-center gap-2"
              >
                {isSubmitting && (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                <span>{isSubmitting ? "Agregando..." : "+ Agregar Tipo"}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 bg-[#F8FAFC] border-t border-[#E2E8F0]">
          <button
            type="button"
            onClick={onClose}
            className="h-[38px] px-5 rounded-md border border-[#CBD5E1] bg-white text-[#334155] text-xs font-bold hover:bg-slate-50 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
