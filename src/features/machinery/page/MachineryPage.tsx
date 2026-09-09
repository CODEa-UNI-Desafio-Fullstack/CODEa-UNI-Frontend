import { useState } from "react";
import { useMachinery } from "../hook/useMachinery";
import { MachineryFilters } from "../components/MachineryFilters";
import { MachineryTable } from "../components/MachineryTable";
import { EditMachineryTypeModal } from "../components/EditMachineryTypeModal";
import { CreateMachineryModal } from "../components/CreateMachineryModal";
import { MachineryTypesModal } from "../components/MachineryTypesModal";
import type { MachineryViewModel } from "../types/machinery.types";
import { AlertCircle, Plus, Settings } from "lucide-react";

export default function MachineryPage() {
  const {
    machineries,
    machineryTypes,
    inputFilters,
    setInputFilters,
    isLoading,
    error,
    handleApplyFilters,
    handleResetFilters,
    handleUpdateType,
    handleCreateMachinery,
    handleDeleteMachinery,
    handleCreateMachineryType,
  } = useMachinery();

  // Estados de apertura de modales
  const [selectedForEdit, setSelectedForEdit] =
    useState<MachineryViewModel | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isTypesModalOpen, setIsTypesModalOpen] = useState(false);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* 1. Header de Vista con Botones de Acción */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] sm:text-[24px] font-bold text-[#0F172A] tracking-tight">
            Equipos y Control de Horómetro
          </h1>
          <p className="text-xs sm:text-[14px] text-[#64748B] mt-1">
            Administración del parque de maquinarias, estado operativo y límites de mantenimiento
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
          {/* Botón: Tipos de Maquinaria */}
          <button
            type="button"
            onClick={() => setIsTypesModalOpen(true)}
            className="w-full sm:w-auto justify-center h-[40px] px-5 rounded-md border border-[#CBD5E1] bg-white text-[#334155] text-[13px] font-bold hover:bg-slate-50 transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Settings className="w-4 h-4 text-slate-500" />
            <span>Tipos de Maquinaria</span>
          </button>

          {/* Botón: + Nueva Maquinaria */}
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="w-full sm:w-auto justify-center h-[40px] px-5 rounded-md bg-[#2563EB] text-white text-[13px] font-bold hover:bg-[#1D4ED8] transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>+ Nueva Maquinaria</span>
          </button>
        </div>
      </div>

      {/* Error Banner si la API falla */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-800 text-sm">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <div>
            <p className="font-semibold">Error al cargar datos de maquinaria</p>
            <p className="text-xs text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* 2. Contenedor Principal: Filtros y Tabla */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-xs p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Barra de Filtros */}
        <MachineryFilters
          inputFilters={inputFilters}
          setInputFilters={setInputFilters}
          machineryTypes={machineryTypes}
          onApply={handleApplyFilters}
          onReset={handleResetFilters}
          isLoading={isLoading}
        />

        {/* Tabla de Equipos */}
        <MachineryTable
          machineries={machineries}
          isLoading={isLoading}
          onEditType={(m) => setSelectedForEdit(m)}
          onDelete={handleDeleteMachinery}
        />
      </div>

      {/* 3. Modales */}
      {/* Modal: Editar Tipo de Maquinaria */}
      <EditMachineryTypeModal
        key={selectedForEdit?.code || "none"}
        isOpen={Boolean(selectedForEdit)}
        onClose={() => setSelectedForEdit(null)}
        machinery={selectedForEdit}
        machineryTypes={machineryTypes}
        onConfirm={handleUpdateType}
      />

      {/* Modal: Nueva Maquinaria */}
      <CreateMachineryModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        machineryTypes={machineryTypes}
        onConfirm={handleCreateMachinery}
      />

      {/* Modal: Tipos de Maquinaria */}
      <MachineryTypesModal
        isOpen={isTypesModalOpen}
        onClose={() => setIsTypesModalOpen(false)}
        machineryTypes={machineryTypes}
        onCreateType={handleCreateMachineryType}
      />
    </div>
  );
}
