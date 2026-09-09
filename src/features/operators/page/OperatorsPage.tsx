import { useState } from "react";
import { useOperators } from "../hook/useOperators";
import { OperatorDetailCard } from "../components/OperatorDetailCard";
import { OperatorsTable } from "../components/OperatorsTable";
import { CreateOperatorModal } from "../components/CreateOperatorModal";
import { AddCertificationModal } from "../components/AddCertificationModal";
import { RenewCertificationModal } from "../components/RenewCertificationModal";
import { DeleteCertificationModal } from "../components/DeleteCertificationModal";
import type { CertificationViewModel } from "../types/operator.types";
import { Plus, AlertCircle } from "lucide-react";

export default function OperatorsPage() {
  const {
    operators,
    machineryTypes,
    selectedOperatorId,
    setSelectedOperatorId,
    selectedOperator,
    inputFilters,
    setInputFilters,
    isLoading,
    isMutating,
    error,
    handleApplyFilters,
    handleResetFilters,
    handleCreateOperator,
    handleAddCertification,
    handleRenewCertification,
    handleDeleteCertification,
  } = useOperators();

  // Estados de apertura de modales
  const [isCreateOperatorModalOpen, setIsCreateOperatorModalOpen] = useState(false);
  const [isAddCertModalOpen, setIsAddCertModalOpen] = useState(false);
  const [certToRenew, setCertToRenew] = useState<CertificationViewModel | null>(null);
  const [certToDelete, setCertToDelete] = useState<CertificationViewModel | null>(null);

  // Ejecución de eliminación
  const handleConfirmDelete = async () => {
    if (!selectedOperator || !certToDelete) return;
    try {
      await handleDeleteCertification(selectedOperator.id, certToDelete.machineryTypeId);
      setCertToDelete(null);
    } catch (err) {
      console.error("Error al eliminar certificación:", err);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-12">
      {/* 1. Header de Vista con Título, Subtítulo y Acción Principal */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] sm:text-[24px] font-bold text-[#0F172A] tracking-tight">
            Operadores y Certificaciones Técnicas
          </h1>
          <p className="text-xs sm:text-[14px] text-[#64748B] mt-1">
            Acreditaciones de maquinaria por operador y control estricto de vigencia ante fechas de turno (Regla P5)
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateOperatorModalOpen(true)}
          className="w-full sm:w-auto justify-center h-[40px] px-5 rounded-md bg-[#2563EB] text-white text-[13px] font-bold hover:bg-[#1D4ED8] transition-colors flex items-center gap-2 cursor-pointer shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Operador</span>
        </button>
      </div>

      {/* Banner de Error si la API falla */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-800 text-sm">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <div>
            <p className="font-semibold">Error al cargar operadores y certificaciones</p>
            <p className="text-xs text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* 2. Sección Superior: Tarjeta de Detalle del Operador Seleccionado (Master-Detail) */}
      <OperatorDetailCard
        operator={selectedOperator}
        onAddCertification={() => setIsAddCertModalOpen(true)}
        onRenewCertification={(cert) => setCertToRenew(cert)}
        onDeleteCertification={(cert) => setCertToDelete(cert)}
      />

      {/* 3. Sección Inferior: Tabla Maestra de Operadores con Búsqueda */}
      <OperatorsTable
        operators={operators}
        selectedOperatorId={selectedOperatorId}
        onSelectOperator={setSelectedOperatorId}
        inputFilters={inputFilters}
        setInputFilters={setInputFilters}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
        isLoading={isLoading}
      />

      {/* 4. Modales de Gestión */}
      {/* Modal: + Nuevo Operador */}
      <CreateOperatorModal
        isOpen={isCreateOperatorModalOpen}
        onClose={() => setIsCreateOperatorModalOpen(false)}
        onSubmit={handleCreateOperator}
        isLoading={isMutating}
      />

      {/* Modal: + Añadir Certificación */}
      {selectedOperator && (
        <AddCertificationModal
          isOpen={isAddCertModalOpen}
          onClose={() => setIsAddCertModalOpen(false)}
          operatorId={selectedOperator.id}
          operatorName={selectedOperator.name}
          machineryTypes={machineryTypes}
          existingMachineryTypeIds={selectedOperator.certifications.map(
            (c) => c.machineryTypeId
          )}
          onSubmit={handleAddCertification}
          isLoading={isMutating}
        />
      )}

      {/* Modal: Renovar Certificación */}
      {selectedOperator && certToRenew && (
        <RenewCertificationModal
          isOpen={Boolean(certToRenew)}
          onClose={() => setCertToRenew(null)}
          operatorId={selectedOperator.id}
          operatorName={selectedOperator.name}
          certification={certToRenew}
          onSubmit={handleRenewCertification}
          isLoading={isMutating}
        />
      )}

      {/* Modal: Eliminar Certificación */}
      {selectedOperator && certToDelete && (
        <DeleteCertificationModal
          isOpen={Boolean(certToDelete)}
          onClose={() => setCertToDelete(null)}
          operatorName={selectedOperator.name}
          certification={certToDelete}
          onConfirm={handleConfirmDelete}
          isLoading={isMutating}
        />
      )}
    </div>
  );
}
