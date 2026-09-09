interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
}

export const ProgressBar = ({ current, total, className = "" }: ProgressBarProps) => {
  const safeTotal = total > 0 ? total : 1;
  const rawPercentage = (current / safeTotal) * 100;
  const percentage = Math.round(rawPercentage * 10) / 10;
  const fillWidth = Math.min(Math.max(percentage, 0), 100);

  // Determinar variante de color según umbral
  let barColorClass = "bg-[#10B981]"; // Verde normal (<70%)
  let textColorClass = "text-[#334155]";

  if (percentage > 100) {
    barColorClass = "bg-[#EF4444]"; // Rojo estado crítico (>100%)
    textColorClass = "text-[#EF4444] font-bold";
  } else if (percentage >= 70) {
    barColorClass = "bg-[#F59E0B]"; // Ámbar advertencia (70% - 100%)
    textColorClass = "text-[#B45309] font-bold";
  }

  return (
    <div className={`flex items-center gap-3 w-full max-w-[280px] ${className}`}>
      {/* Contenedor de la barra */}
      <div className="flex-1 h-[10px] bg-[#E2E8F0] rounded-full overflow-hidden relative">
        <div
          className={`h-full rounded-full transition-all duration-300 ${barColorClass}`}
          style={{ width: `${fillWidth}%` }}
        />
      </div>

      {/* Etiqueta de porcentaje */}
      <span className={`text-[13px] whitespace-nowrap min-w-[42px] text-right ${textColorClass}`}>
        {percentage}%
      </span>
    </div>
  );
};
