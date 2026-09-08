import { useProjections } from "../hook/useProjections";
import { KpiCardsGrid } from "../components/KpiStatCard";
import { ProjectionsTable } from "../components/ProjectionsTable";
import { AlertCircle, RefreshCw } from "lucide-react";

export const DashboardPage: React.FC = () => {
  const { projections, shiftsById, kpis, isLoading, error, refetch } =
    useProjections();

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-[24px] font-bold text-[#0F172A] tracking-tight">
          Tablero de Control y Estado Operativo
        </h1>
        <p className="text-[14px] text-[#64748B] mt-1">
          Monitoreo en tiempo real de flota, umbrales y proyección preventiva a 7 días
        </p>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between text-red-800">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold">Error al cargar datos del tablero</p>
              <p className="text-xs text-red-600">{error}</p>
            </div>
          </div>
          <button
            onClick={() => refetch()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-800 text-xs font-semibold rounded-md transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reintentar</span>
          </button>
        </div>
      )}

      {/* 4 KPI Cards */}
      <KpiCardsGrid kpis={kpis} isLoading={isLoading} />

      {/* 7-Day Preventive Projections Table */}
      <ProjectionsTable
        projections={projections}
        shiftsById={shiftsById}
        isLoading={isLoading}
      />
    </div>
  );
};

export default DashboardPage;
