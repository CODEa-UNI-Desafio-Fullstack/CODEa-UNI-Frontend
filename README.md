# Sistema de Gestión de Equipos Mineros - Frontend

Interfaz web desarrollada en React 19, TypeScript, Vite y Tailwind CSS 4 para el control operativo, gestión de flota minera y proyección preventiva de mantenimiento.

---

## 1. ¿Qué hace?

- **Tablero de Control (Dashboard)**: Métricas clave (KPIs de flota), estado general de equipos y tabla de proyección predictiva de mantenimiento a 7 días.
- **Gestión de Maquinaria**: Catálogo de equipos con visualización de horómetro hacia el umbral, control de estados (`ACTIVO`, `BLOQUEADO`), filtros combinados y administración de tipos de maquinaria.
- **Turnos y Asignaciones**: Programación de jornadas (Día/Noche), despacho de operadores a equipos con validación de restricciones en tiempo real, e inicio/cierre de turnos.
- **Control de Mantenimiento**: Registro de intervenciones técnicas preventivas con reactivación de maquinaria y reseteo automático de horómetro a 0.0 hrs.
- **Operadores y Certificaciones**: Padrón de operadores técnicos con acreditación y renovación de licencias vigentes por tipo de equipo.
- **Restablecimiento Demo**: Botón flotante para limpiar y sembrar datos de prueba vía API en un solo clic.

---

## 2. Cómo levantarlo en local

### Prerrequisitos
- **Node.js 20+** (o versión LTS recomendada)
- **npm** (incluido con Node.js)
- Backend en ejecución (por defecto en `http://localhost:8080`)

### Paso 1: Configurar variables de entorno
Crea o edita el archivo `.env` en la raíz del frontend:
```properties
VITE_API_URL=http://localhost:8080/api/v1
```

### Paso 2: Instalar dependencias
```bash
npm install
```

### Paso 3: Iniciar el servidor de desarrollo
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

*(Opcional usando Docker y Nginx):*
```bash
docker build -t frontend-codea-uni .
docker run -p 80:80 -e VITE_API_URL=http://localhost:8080/api/v1 frontend-codea-uni
```

---

## 3. Cómo se desplegó

El frontend está desplegado en **Render** como **Static Site** (sitio estático):

1. **Creación del Static Site en Render**:
   - Conectado al repositorio de GitHub (`CODEa-UNI-Frontend`).
   - Rama de despliegue: `main` (o `dev`).

2. **Configuración de Build y Publicación**:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`

3. **Variables de Entorno en Render**:
   - `VITE_API_URL=https://codea-uni-backend.onrender.com/api/v1`

4. **Regla de Enrutamiento SPA (Redirects/Rewrites)**:
   Para que las rutas de React Router (`/machinery`, `/operations`, `/maintenance`, `/operators`) funcionen correctamente al recargar la página, se configuró una regla de Rewrite en Render:
   - **Type**: `Rewrite`
   - **Source**: `/*`
   - **Destination**: `/index.html`
