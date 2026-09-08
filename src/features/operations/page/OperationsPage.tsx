import { useState } from "react";
import { useOperations } from "../hook/useOperations";
import { ShiftsTable } from "../components/ShiftsTable";
import { AssignmentsTable } from "../components/AssignmentsTable";
import { CreateShiftModal } from "../components/CreateShiftModal";
import { CreateAssignmentModal } from "../components/CreateAssignmentModal";
import { CloseShiftModal } from "../components/CloseShiftModal";
import type { ShiftResource, AssignmentDetailResource } from "../types/operations.types";
import { Plus, CalendarPlus } from "lucide-react";

export default function OperationsPage() {
  const {
    shifts,
    assignments,
    operators,
    machineries,
    isLoadingShifts,
    isLoadingAssignments,
    isSubmitting,
    rejectionErrors,
    setRejectionErrors,
    // Filtros de turnos
    shiftInputFilters,
    setShiftInputFilters,
    handleApplyShiftFilters,
    handleResetShiftFilters,
    // Filtros de asignaciones
    assignmentInputFilters,
    setAssignmentInputFilters,
    handleApplyAssignmentFilters,
    handleResetAssignmentFilters,
    // Acciones
    handleCreateShift,
    handleUpdateShift,
    handleDeleteShift,
    handleCreateAssignment,
    handleStartAssignment,
    handleEndAssignment,
  } = useOperations();

  // Estados de control de modales
  const [isCreateShiftOpen, setIsCreateShiftOpen] = useState(false);
  const [shiftToEdit, setShiftToEdit] = useState<ShiftResource | null>(null);

  const [isCreateAssignmentOpen, setIsCreateAssignmentOpen] = useState(false);
  const [assignmentToClose, setAssignmentToClose] =
    useState<AssignmentDetailResource | null>(null);

  const handleOpenEditShift = (shift: ShiftResource) => {
    setShiftToEdit(shift);
    setIsCreateShiftOpen(true);
  };

  const handleCloseShiftModal = () => {
    setIsCreateShiftOpen(false);
    setShiftToEdit(null);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-12">
      {/* 1. Header con Título, Subtítulo y Botones de Acción */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A]">
            Turnos y Asignaciones Operativas
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            Programación de turnos, despacho de operadores y registro de horas trabajadas
          </p>
        </div>

        {/* Botones de acción superiores */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setShiftToEdit(null);
              setIsCreateShiftOpen(true);
            }}
            className="h-[40px] px-4 rounded-md bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] text-[#334155] font-bold text-xs sm:text-[13px] flex items-center gap-2 transition-colors shadow-xs cursor-pointer"
          >
            <CalendarPlus className="w-4 h-4 text-[#2563EB]" />
            <span>Crear Turno</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setRejectionErrors(null);
              setIsCreateAssignmentOpen(true);
            }}
            className="h-[40px] px-5 rounded-md bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs sm:text-[13px] flex items-center gap-2 transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Asignación</span>
          </button>
        </div>
      </div>

      {/* 2. Sección Listado de Turnos */}
      <section>
        <ShiftsTable
          shifts={shifts}
          isLoading={isLoadingShifts}
          inputFilters={shiftInputFilters}
          setInputFilters={setShiftInputFilters}
          onApply={handleApplyShiftFilters}
          onReset={handleResetShiftFilters}
          onEditShift={handleOpenEditShift}
          onDeleteShift={handleDeleteShift}
        />
      </section>

      {/* 3. Sección Asignaciones Operativas */}
      <section>
        <AssignmentsTable
          assignments={assignments}
          isLoading={isLoadingAssignments}
          inputFilters={assignmentInputFilters}
          setInputFilters={setAssignmentInputFilters}
          onApply={handleApplyAssignmentFilters}
          onReset={handleResetAssignmentFilters}
          onStartAssignment={handleStartAssignment}
          onOpenCloseShiftModal={(assignment) => setAssignmentToClose(assignment)}
        />
      </section>

      {/* Modales */}
      {/* Modal Crear/Editar Turno */}
      <CreateShiftModal
        isOpen={isCreateShiftOpen}
        shiftToEdit={shiftToEdit}
        onClose={handleCloseShiftModal}
        onSubmitCreate={handleCreateShift}
        onSubmitUpdate={handleUpdateShift}
        isSubmitting={isSubmitting}
      />

      {/* Modal Nueva Asignación con errores 422 */}
      <CreateAssignmentModal
        isOpen={isCreateAssignmentOpen}
        onClose={() => setIsCreateAssignmentOpen(false)}
        shifts={shifts}
        operators={operators}
        machineries={machineries}
        rejectionErrors={rejectionErrors}
        onClearRejectionErrors={() => setRejectionErrors(null)}
        onSubmit={handleCreateAssignment}
        isSubmitting={isSubmitting}
      />

      {/* Modal Cerrar Turno */}
      <CloseShiftModal
        isOpen={Boolean(assignmentToClose)}
        assignment={assignmentToClose}
        onClose={() => setAssignmentToClose(null)}
        onSubmit={handleEndAssignment}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
