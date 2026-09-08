/**
 * Identificador único generado en memoria cada vez que la página carga o se recarga.
 * Al recargar el navegador (F5), este ID cambia automáticamente, invalidando la caché.
 */
const CURRENT_PAGE_LOAD_ID = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

interface CacheWrapper<T> {
  data: T;
  expiresAt: number;
  pageLoadId: string;
}

const DEFAULT_TTL_MS = 5 * 60 * 1000; // 5 minutos

export const storageCache = {
  /**
   * Obtiene un dato de localStorage validando TTL y comprobando que no haya ocurrido una recarga de página.
   */
  get<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;

      const parsed: CacheWrapper<T> = JSON.parse(raw);

      // Si la página se recargó, el pageLoadId es distinto -> expira automáticamente
      if (parsed.pageLoadId !== CURRENT_PAGE_LOAD_ID) {
        localStorage.removeItem(key);
        return null;
      }

      // Si el tiempo actual superó el tiempo de vida (5 min) -> expira
      if (Date.now() > parsed.expiresAt) {
        localStorage.removeItem(key);
        return null;
      }

      return parsed.data;
    } catch (e) {
      console.warn("Error leyendo de storageCache:", e);
      return null;
    }
  },

  /**
   * Almacena un dato en localStorage con TTL de 5 minutos y asociado al ciclo de vida de la página actual.
   */
  set<T>(key: string, data: T, ttlMs = DEFAULT_TTL_MS): void {
    try {
      const wrapper: CacheWrapper<T> = {
        data,
        expiresAt: Date.now() + ttlMs,
        pageLoadId: CURRENT_PAGE_LOAD_ID,
      };
      localStorage.setItem(key, JSON.stringify(wrapper));
    } catch (e) {
      console.warn("Error guardando en storageCache:", e);
    }
  },

  /**
   * Elimina una clave o todas las claves que empiecen con un prefijo
   */
  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn("Error removiendo de storageCache:", e);
    }
  },

  /**
   * Invalida todas las claves de caché del proyecto
   */
  clearAll(): void {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("cache_")) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
    } catch (e) {
      console.warn("Error limpiando storageCache:", e);
    }
  },
};
