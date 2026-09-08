import { Outlet } from "react-router-dom";
import { NavigationBar } from "../../shared/components/ui/NavigationBar";
import { ResetFloatingButton } from "../../shared/components/ui/ResetFloatingButton";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col text-slate-900">
      {/* Barra de navegación superior fija */}
      <NavigationBar />

      {/* Contenedor principal de la vista actual */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        <Outlet />
      </main>

      {/* Botón flotante persistente en todas las pantallas */}
      <ResetFloatingButton />
    </div>
  );
}
