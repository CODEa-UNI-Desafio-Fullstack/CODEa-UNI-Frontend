import React from "react";
import { Modal } from "../../../shared/components/ui/Modal";
import { Button } from "../../../shared/components/ui/Button";
import { Trash2, AlertTriangle } from "lucide-react";
import type { CertificationViewModel } from "../types/operator.types";

interface DeleteCertificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  operatorName: string;
  certification: CertificationViewModel | null;
  onConfirm: () => Promise<void>;
  isLoading?: boolean;
}

export const DeleteCertificationModal: React.FC<DeleteCertificationModalProps> = ({
  isOpen,
  onClose,
  operatorName,
  certification,
  onConfirm,
  isLoading = false,
}) => {
  if (!certification) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirmar Eliminación de Certificación"
    >
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-3.5 flex items-start gap-3 text-red-800 text-xs">
          <AlertTriangle className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
          <div>
            <p className="font-bold text-red-900">¿Estás seguro de eliminar esta acreditación?</p>
            <p className="mt-1 text-red-700">
              El operador <span className="font-semibold">{operatorName}</span> perderá la certificación para operar{" "}
              <span className="font-semibold">{certification.machineryTypeName}</span>. Esto podría impedir su asignación a futuros turnos (Regla P5).
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={onConfirm}
            isLoading={isLoading}
            icon={<Trash2 className="w-4 h-4" />}
          >
            Eliminar Certificación
          </Button>
        </div>
      </div>
    </Modal>
  );
};
