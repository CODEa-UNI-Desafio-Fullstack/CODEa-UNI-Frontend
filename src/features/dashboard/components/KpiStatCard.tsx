import { StatCard } from "../../../shared/components/ui/StatCard";
import type { DashboardKpiStats } from "../types/projection.types";

interface KpiCardsGridProps {
  kpis: DashboardKpiStats;
  isLoading?: boolean;
}

export const KpiCardsGrid = ({ kpis, isLoading }: KpiCardsGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <StatCard
        title="Total Maquinarias"
        value={isLoading ? "—" : kpis.totalMachinery}
        badgeLabel="FLOTA"
        badgeVariant="neutral"
        valueColorClass="text-[#0F172A]"
      />
      <StatCard
        title="Maquinarias Activas"
        value={isLoading ? "—" : kpis.activeMachinery}
        badgeLabel="OPERATIVAS"
        badgeVariant="success"
        valueColorClass="text-[#16A34A]"
      />
      <StatCard
        title="Bloqueadas (Mantenimiento)"
        value={isLoading ? "—" : kpis.blockedMachinery}
        badgeLabel="BLOQUEO"
        badgeVariant="danger"
        valueColorClass="text-[#DC2626]"
      />
      <StatCard
        title="Próximas a Bloquear (7 Días)"
        value={isLoading ? "—" : kpis.upcomingBlockedCount}
        badgeLabel="ATENCIÓN"
        badgeVariant="warning"
        valueColorClass="text-[#D97706]"
      />
    </div>
  );
};
