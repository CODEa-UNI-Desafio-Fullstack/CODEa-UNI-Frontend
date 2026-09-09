import { Badge, type BadgeVariant } from "./Badge";

export interface StatCardProps {
  title: string;
  value: number | string;
  badgeLabel: string;
  badgeVariant: BadgeVariant;
  valueColorClass?: string;
  className?: string;
}

export const StatCard = ({
  title,
  value,
  badgeLabel,
  badgeVariant,
  valueColorClass = "text-[#0F172A]",
  className = "",
}: StatCardProps) => {
  return (
    <div
      className={`bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex flex-col justify-between min-h-[105px] ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-[#64748B] truncate">
          {title}
        </span>
        <Badge variant={badgeVariant} label={badgeLabel} />
      </div>
      <div className={`text-[34px] font-bold leading-none mt-2 ${valueColorClass}`}>
        {value}
      </div>
    </div>
  );
};
