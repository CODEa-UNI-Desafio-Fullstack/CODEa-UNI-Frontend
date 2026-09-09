import { useState } from "react";
import { apiClient } from "../../services/api/axios-client";
import { RotateCcw } from "lucide-react";

export const ResetFloatingButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const handleReset = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await apiClient.post("/test-data/reset");
      setFeedbackMessage("¡Base de datos reseteada con datos de prueba!");

      // Disparar evento global para que las vistas activas refresquen sus datos
      window.dispatchEvent(new CustomEvent("app:refetch-data"));

      setTimeout(() => setFeedbackMessage(null), 4000);
    } catch (error) {
      console.error("Error al resetear datos:", error);
      alert("Ocurrió un error al contactar el seeder de prueba.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-2 pointer-events-none">
      {feedbackMessage && (
        <div className="bg-[#0F172A] text-white text-xs px-3.5 py-2.5 rounded-lg shadow-xl border border-slate-700 pointer-events-auto transition-all duration-200">
          {feedbackMessage}
        </div>
      )}
      <button
        id="fab-reset-test-data"
        type="button"
        onClick={handleReset}
        disabled={isLoading}
        className={`pointer-events-auto flex items-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3.5 rounded-full font-bold text-xs sm:text-[13px] text-white shadow-xl transition-all duration-200 cursor-pointer
          ${
            isLoading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-98"
          }
          focus:outline-none focus:ring-4 focus:ring-blue-200`}
      >
        <RotateCcw
          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isLoading ? "animate-spin" : ""}`}
        />
        <span>{isLoading ? "Reseteando..." : "Resetear Datos Demo"}</span>
      </button>
    </div>
  );
};
