import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "small" | "danger" | "ghost";
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  isLoading = false,
  icon,
  children,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-bold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

  let variantStyles = "";
  switch (variant) {
    case "primary":
      variantStyles =
        "bg-[#2563EB] text-white text-[13px] h-[40px] px-5 rounded-md hover:bg-[#1D4ED8] shadow-xs";
      break;
    case "outline":
      variantStyles =
        "bg-white border border-[#CBD5E1] text-[#334155] text-[13px] h-[40px] px-5 rounded-md hover:bg-[#F8FAFC] shadow-xs";
      break;
    case "small":
      variantStyles =
        "bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] text-[12px] h-[30px] px-3.5 rounded-md hover:bg-[#DBEAFE]";
      break;
    case "danger":
      variantStyles =
        "bg-[#DC2626] text-white text-[13px] h-[40px] px-5 rounded-md hover:bg-[#B91C1C] shadow-xs";
      break;
    case "ghost":
      variantStyles = "text-[#64748B] hover:text-[#0F172A] p-2 rounded-md hover:bg-[#F1F5F9]";
      break;
  }

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg
            className="animate-spin h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Cargando...</span>
        </span>
      ) : (
        <span className="flex items-center gap-2">
          {icon && <span>{icon}</span>}
          {children}
        </span>
      )}
    </button>
  );
};
