import { NavLink, Link } from "react-router-dom";

export const NavigationBar = () => {
  const navItems = [
    { label: "Tablero de control", path: "/" },
    { label: "Equipos", path: "/machinery" },
    { label: "Turnos & Asignaciones", path: "/operations" },
    { label: "Mantenimiento", path: "/maintenance" },
    { label: "Operadores", path: "/operators" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[70px] flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="text-[18px] font-bold text-[#0F172A] tracking-tight hover:opacity-90 transition-opacity"
          >
            CONTROL OPERATIVO MINERO
          </Link>
        </div>

        {/* Navigation items */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `text-[14px] px-3.5 py-2 rounded-lg transition-colors duration-150 ${isActive
                  ? "bg-[#EFF6FF] text-[#2563EB] font-bold"
                  : "text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50 font-medium"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
};
