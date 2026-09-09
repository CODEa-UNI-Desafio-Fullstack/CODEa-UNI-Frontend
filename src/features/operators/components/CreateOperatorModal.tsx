import React, { useState } from "react";
import { Modal } from "../../../shared/components/ui/Modal";
import { Button } from "../../../shared/components/ui/Button";
import { User, AlertCircle } from "lucide-react";

interface CreateOperatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => Promise<boolean>;
  isLoading?: boolean;
}

export const CreateOperatorModal: React.FC<CreateOperatorModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage("El nombre del operador es obligatorio.");
      return;
    }

    try {
      setErrorMessage(null);
      await onSubmit(name.trim());
      setName("");
      onClose();
    } catch (err: any) {
      const serverMsg =
        err?.response?.data?.message || "No se pudo registrar el operador. Intenta de nuevo.";
      setErrorMessage(serverMsg);
    }
  };

  const handleModalClose = () => {
    setName("");
    setErrorMessage(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleModalClose} title="Registrar Nuevo Operador">
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-red-700 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="space-y-1.5">
          <label htmlFor="operator-name" className="block text-xs font-bold text-[#334155] uppercase tracking-wider">
            Nombre Completo del Operador <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="operator-name"
              type="text"
              required
              placeholder="Ej: Roberto Salas"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              className="w-full h-[40px] pl-9 pr-3 bg-white border border-[#CBD5E1] rounded-md text-sm text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <p className="text-[11px] text-[#64748B]">
            Ingresa nombres y apellidos para la asignación y acreditación técnica de turnos.
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
          >
            Crear Operador
          </Button>
        </div>
      </form>
    </Modal>
  );
};
