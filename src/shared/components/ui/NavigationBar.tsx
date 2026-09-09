import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

export const NavigationBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-[16px] sm:text-[18px] font-bold text-[#0F172A] tracking-tight hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            CONTROL OPERATIVO MINERO
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `text-[14px] px-3.5 py-2 rounded-lg transition-colors duration-150 ${
                  isActive
                    ? "bg-[#EFF6FF] text-[#2563EB] font-bold"
                    : "text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50 font-medium"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-[#E2E8F0] bg-white px-4 py-3 space-y-1 shadow-lg animate-fade-in">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block w-full text-[14px] px-4 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? "bg-[#EFF6FF] text-[#2563EB] font-bold"
                    : "text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50 font-medium"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
};
