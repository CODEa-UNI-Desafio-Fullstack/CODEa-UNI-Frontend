import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Plus, CheckCircle2 } from "lucide-react";
import { Button } from "../../../shared/components/ui/Button";
import { PolicyNoticeBanner } from "../components/PolicyNoticeBanner";
import { MaintenanceFilters } from "../components/MaintenanceFilters";
import { MaintenanceHistoryTable } from "../components/MaintenanceHistoryTable";
import { CreateMaintenanceModal } from "../components/CreateMaintenanceModal";
import { useMaintenances } from "../hook/useMaintenances";

export default function MaintenancePage() {
  const [searchParams] = useSearchParams();
  const preselectedCode = searchParams.get("code") || "";

  const {
    maintenances,
    operators,
    machineries,
    inputFilters,
    setInputFilters,
    appliedFilters,
    isLoading,
    handleApplyFilters,
    handleResetFilters,
    handleCreateMaintenance,
  } = useMaintenances();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const hasActiveFilters = Boolean(
    appliedFilters.machineryCode ||
      appliedFilters.operatorId ||
      appliedFilters.startDate ||
      appliedFilters.endDate
  );

  const handleConfirmCreate = async (payload: Parameters<typeof handleCreateMaintenance>[0]) => {
    const success = await handleCreateMaintenance(payload);
    if (success) {
      setSuccessToast(
        `¡Mantenimiento de ${payload.machineryCode} registrado! El horómetro se ha reiniciado a 0.0 hrs.`
      );
      setTimeout(() => {
        setSuccessToast(null);
      }, 5000);
      return true;
    }
    return false;
  };

  return (
    <div className="flex flex-col gap-6 pb-12 animate-fade-in" data-node-id="1:464">
      {/* Toast de confirmación de registro */}
      {successToast && (
        <div className="fixed top-20 right-6 z-50 bg-[#0F172A] text-white px-4 py-3 rounded-lg shadow-xl border border-slate-700 flex items-center gap-2.5 animate-slide-in">
          <CheckCircle2 className="w-5 h-5 text-[#22C55E] shrink-0" />
          <span className="text-xs sm:text-sm font-medium">{successToast}</span>
        </div>
      )}

      {/* Encabezado de la página */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-2xl sm:text-[24px] font-bold text-[#0F172A] tracking-tight"
            data-node-id="1:475"
          >
            Control de Mantenimiento Preventivo
          </h1>
          <p
            className="text-sm text-[#64748B] mt-1"
            data-node-id="1:476"
          >
            Historial inmutable de intervenciones técnicas y reinicio de ciclo de horómetro
          </p>
        </div>

        {/* Botón "+ Registrar Mantenimiento" */}
        <div data-node-id="1:477">
          <Button
            id="btn-open-create-maintenance"
            variant="primary"
            onClick={() => setIsModalOpen(true)}
            icon={<Plus className="w-4 h-4" />}
            className="w-full sm:w-auto font-bold text-[13px] h-[40px] px-5"
          >
            Registrar Mantenimiento
          </Button>
        </div>
      </div>

      {/* Banner Informativo de Política P3 */}
      <PolicyNoticeBanner />

      {/* Contenedor Principal: Filtros y Tabla */}
      <div className="flex flex-col gap-6">
        {/* Sección de Filtros de Búsqueda delegados al backend */}
        <MaintenanceFilters
          inputFilters={inputFilters}
          setInputFilters={setInputFilters}
          operators={operators}
          onApply={handleApplyFilters}
          onReset={handleResetFilters}
          isLoading={isLoading}
        />

        {/* Tabla del Historial Inmutable de Mantenimientos */}
        <MaintenanceHistoryTable
          maintenances={maintenances}
          isLoading={isLoading}
          hasActiveFilters={hasActiveFilters}
        />
      </div>

      {/* Modal para Registrar Mantenimiento */}
      <CreateMaintenanceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        machineries={machineries}
        operators={operators}
        onConfirm={handleConfirmCreate}
        initialMachineryCode={preselectedCode}
      />
    </div>
  );
}
