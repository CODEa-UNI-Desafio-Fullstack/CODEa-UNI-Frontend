import { useEffect } from "react";

/**
 * Hook para suscribirse al evento global disparado tras resetear los datos demo.
 * Permite a las vistas activas recargar sus datos en caliente sin recargar toda la página.
 */
export function useDataRefetchOnReset(onResetCallback: () => void) {
  useEffect(() => {
    const handleRefetch = () => {
      onResetCallback();
    };

    window.addEventListener("app:refetch-data", handleRefetch);
    return () => {
      window.removeEventListener("app:refetch-data", handleRefetch);
    };
  }, [onResetCallback]);
}
