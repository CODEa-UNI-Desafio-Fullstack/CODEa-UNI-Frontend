import { apiClient } from "../../../shared/services/api/axios-client";
import { storageCache } from "../../../shared/utils/storageCache";
import type { MachineryTypeResource } from "../types/machinery.types";

const CACHE_KEY_TYPES = "cache_machinery_types";
const TTL_5_MINUTES = 5 * 60 * 1000;

export const machineryTypeService = {
  /**
   * Obtiene la lista completa de tipos de maquinaria.
   * Consulta primero la caché en localStorage (TTL 5 min con expiración ante recarga de página).
   * Si la caché expiró o se fuerza la recarga, consulta GET /api/v1/machinery-types.
   */
  async getMachineryTypes(forceRefresh = false): Promise<MachineryTypeResource[]> {
    if (!forceRefresh) {
      const cached = storageCache.get<MachineryTypeResource[]>(CACHE_KEY_TYPES);
      if (cached && cached.length > 0) {
        return cached;
      }
    }

    // Petición al backend
    const { data } = await apiClient.get<MachineryTypeResource[]>("/machinery-types");

    // Guardar en caché con el objeto completo (id, name, maintenanceTime)
    storageCache.set(CACHE_KEY_TYPES, data, TTL_5_MINUTES);
    return data;
  },

  /**
   * Registra un nuevo tipo de maquinaria e invalida la caché para reflejar el cambio.
   */
  async createMachineryType(
    name: string,
    maintenanceTime: number
  ): Promise<MachineryTypeResource> {
    const { data } = await apiClient.post<MachineryTypeResource>("/machinery-types", {
      name,
      maintenanceTime,
    });

    // Invalidar caché tras creación
    storageCache.remove(CACHE_KEY_TYPES);
    return data;
  },

  /**
   * Invalida manualmente la caché de tipos de maquinaria
   */
  invalidateCache(): void {
    storageCache.remove(CACHE_KEY_TYPES);
  },
};
