import React from "react";
import { Info } from "lucide-react";

export const PolicyNoticeBanner: React.FC = () => {
  return (
    <div
      className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg p-3.5 sm:p-4 flex items-start sm:items-center gap-2.5 shadow-xs"
      data-node-id="1:480"
    >
      <div className="flex items-center gap-1.5 shrink-0 text-[#1D4ED8] font-bold text-[13px]">
        <Info className="w-4 h-4 text-[#2563EB]" />
        <span>Importante:</span>
      </div>
      <p className="text-[#1E40AF] text-[13px] leading-relaxed">
        Al confirmar el mantenimiento de un equipo bloqueado, el horómetro se reinicia automáticamente a{" "}
        <strong className="font-bold">0.0 hrs</strong> y la maquinaria pasa a estado{" "}
        <strong className="font-bold">ACTIVA</strong>.
      </p>
    </div>
  );
};
