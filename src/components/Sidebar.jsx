import React from 'react';
import {
  Home,
  Truck,
  PackagePlus,
  Calculator,
  Store,
  Compass,
  Landmark,
  FileText,
  Headphones,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  CreditCard
} from 'lucide-react';

export default function Sidebar({
  activeMenu,
  setActiveMenu,
  isCollapsed,
  setIsCollapsed,
  isOpen,
  setIsOpen
}) {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Panel de control',
      icon: Home
    },
    {
      id: 'retiros',
      label: 'Retiros',
      icon: Truck
    },
    {
      id: 'seguimiento',
      label: 'Seguimiento',
      icon: Compass
    },
    {
      id: 'emision',
      label: 'Emisión',
      icon: PackagePlus
    },
    {
      id: 'cotizador',
      label: 'Cotizador',
      icon: Calculator
    },
    {
      id: 'mis-cuentas',
      label: 'Mis cuentas',
      icon: CreditCard
    },
    {
      id: 'ecommerce-apis',
      label: 'E-commerce y APIs',
      icon: Store
    },
    {
      id: 'informes',
      label: 'Informe',
      icon: FileText
    },
    {
      id: 'legal-financiero',
      label: 'Legal y financiero',
      icon: Landmark
    },
    {
      id: 'postventa-soporte',
      label: 'Postventa y soporte',
      icon: Headphones
    }
  ];

  return (
    <aside
      className={`fixed md:sticky top-0 z-30 md:z-20 h-screen bg-gradient-to-b from-[#246777] via-[#1e4f5e] to-[#174653] text-white flex flex-col shrink-0 font-sans transition-all duration-300 left-0 border-r border-[#174653]/70 ${isOpen ? 'translate-x-0 w-64 shadow-2xl md:shadow-none' : '-translate-x-full md:translate-x-0'
        } ${isCollapsed ? 'md:w-20' : 'md:w-64'}`}
    >
      {/* Top Header: Official Starken Pro Logo (Without top collapse button) */}
      <div className="p-4 sm:p-5 flex items-center justify-center md:justify-start border-b border-white/10 shrink-0 h-[68px]">
        {!isCollapsed ? (
          <div className="flex items-center space-x-2 select-none">
            <img
              src="/Logo-blanco.png"
              alt="Starken Logo"
              className="h-6 w-auto object-contain"
            />
            <div className="bg-[#51829b] text-white text-[11px] font-bold w-6 h-6 rounded-full flex items-center justify-center font-sans shadow-inner shrink-0">
              Pro
            </div>
          </div>
        ) : (
          <div className="w-full flex items-center justify-center select-none">
            <div className="w-8 h-8 rounded-xl bg-[#1e4f5e] border border-white/20 flex items-center justify-center font-sans font-bold text-xs text-white shadow-xs">
              Pro
            </div>
          </div>
        )}
      </div>

      {/* Main Navigation Items */}
      <nav className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeMenu === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveMenu(item.id);
                setIsOpen(false);
              }}
              className={`w-full flex items-center px-3.5 py-2.5 rounded-xl text-[14px] font-bold transition-all duration-150 cursor-pointer ${isCollapsed ? 'justify-center' : 'space-x-3'
                } ${isActive
                  ? 'bg-white text-[#1e4f5e] shadow-xs'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              title={isCollapsed ? item.label : ''}
            >
              <Icon size={18} className={`shrink-0 ${isActive ? 'text-[#1e4f5e]' : 'text-white/80'}`} />
              {!isCollapsed && (
                <span className="text-left font-medium tracking-wide flex-1 truncate text-[14px]">
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Footer Items: Configuración, Cerrar Sesión & Bottom Collapse Toggle */}
      <div className="p-3 border-t border-white/10 space-y-1 shrink-0">
        <button
          onClick={() => { }}
          className={`w-full flex items-center px-3.5 py-2.5 rounded-xl text-[14px] font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer ${isCollapsed ? 'justify-center' : 'space-x-3'
            }`}
          title={isCollapsed ? 'Configuración' : ''}
        >
          <Settings size={18} className="shrink-0 text-white/70" />
          {!isCollapsed && <span className="text-left truncate text-[14px]">Configuración</span>}
        </button>

        <button
          onClick={() => { }}
          className={`w-full flex items-center px-3.5 py-2.5 rounded-xl text-[14px] font-medium text-white/70 hover:text-rose-300 hover:bg-white/10 transition-colors cursor-pointer ${isCollapsed ? 'justify-center' : 'space-x-3'
            }`}
          title={isCollapsed ? 'Cerrar sesión' : ''}
        >
          <LogOut size={18} className="shrink-0 text-white/70" />
          {!isCollapsed && <span className="text-left truncate text-[14px]">Cerrar sesión</span>}
        </button>

        {/* Bottom Collapse / Expand Toggle Button */}
        <div className="hidden md:flex items-center justify-center pt-2 border-t border-white/10 mt-1">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer shadow-2xs"
            title={isCollapsed ? "Expandir menú" : "Contraer menú"}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
      </div>
    </aside>
  );
}
