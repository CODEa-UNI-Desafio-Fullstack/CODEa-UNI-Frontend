export type BadgeVariant = "success" | "danger" | "warning" | "neutral";

export interface BadgeProps {
  variant: BadgeVariant;
  label: string;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: "bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0]",
  danger: "bg-[#FEE2E2] text-[#B91C1C] border border-[#FECACA]",
  warning: "bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A]",
  neutral: "bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]",
};

export const Badge = ({ variant, label, className = "" }: BadgeProps) => {
  return (
    <span
      className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase h-[24px] ${variantStyles[variant]} ${className}`}
    >
      {label}
    </span>
  );
};
