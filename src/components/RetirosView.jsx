import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Truck, 
  Package, 
  Plus, 
  Search, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Calendar, 
  Download, 
  ExternalLink, 
  X, 
  ChevronRight, 
  ChevronDown, 
  ChevronLeft,
  Sun,
  Zap,
  Info,
  Check,
  Activity
} from 'lucide-react';

const SAVED_ADDRESSES = [
  { id: 1, name: 'Centro de Distribución San Bernardo (Bodega 4)', address: 'Camino La Vara 0310, Módulo 4', comuna: 'San Bernardo', region: 'Metropolitana', contact: 'Juan Carlos Morales', phone: '+56 9 8877 6655' },
  { id: 2, name: 'Hub Providencia E-Commerce', address: 'Av. Andrés Bello 2711, Piso 2', comuna: 'Providencia', region: 'Metropolitana', contact: 'Claudia Fuentes', phone: '+56 9 7654 3210' },
  { id: 3, name: 'Bodega Central Quilicura', address: 'Av. Américo Vespucio Norte 1400', comuna: 'Quilicura', region: 'Metropolitana', contact: 'Mario Gatta', phone: '+56 9 6543 2109' }
];

const AVAILABLE_PICKUP_DAYS = [
  { id: '2026-10-09', dayName: 'Viernes', dayNum: '09', month: 'Oct', tag: 'Hoy', morningAvailable: true, afternoonAvailable: true, fullLabel: 'Viernes 09 de octubre', dateStr: '09-10-2026' },
  { id: '2026-10-10', dayName: 'Sábado', dayNum: '10', month: 'Oct', tag: 'Fin de semana', morningAvailable: true, afternoonAvailable: false, fullLabel: 'Sábado 10 de octubre', dateStr: '10-10-2026' },
  { id: '2026-10-12', dayName: 'Lunes', dayNum: '12', month: 'Oct', tag: 'Próximo', morningAvailable: true, afternoonAvailable: true, fullLabel: 'Lunes 12 de octubre', dateStr: '12-10-2026' },
  { id: '2026-10-13', dayName: 'Martes', dayNum: '13', month: 'Oct', tag: 'Disponible', morningAvailable: true, afternoonAvailable: true, fullLabel: 'Martes 13 de octubre', dateStr: '13-10-2026' },
  { id: '2026-10-14', dayName: 'Miércoles', dayNum: '14', month: 'Oct', tag: 'Disponible', morningAvailable: true, afternoonAvailable: true, fullLabel: 'Miércoles 14 de octubre', dateStr: '14-10-2026' },
  { id: '2026-10-15', dayName: 'Jueves', dayNum: '15', month: 'Oct', tag: 'Disponible', morningAvailable: true, afternoonAvailable: true, fullLabel: 'Jueves 15 de octubre', dateStr: '15-10-2026' },
  { id: '2026-10-16', dayName: 'Viernes', dayNum: '16', month: 'Oct', tag: 'Disponible', morningAvailable: true, afternoonAvailable: true, fullLabel: 'Viernes 16 de octubre', dateStr: '16-10-2026' }
];

const INITIAL_PICKUPS = [
  {
    id: 'RET-2026-9041',
    addressName: 'CD San Bernardo (Bodega 4)',
    address: 'Camino La Vara 0310, Módulo 4, San Bernardo',
    date: '09-10-2026 (Hoy)',
    window: 'Tarde (14:00 - 18:30)',
    packagesCount: 18,
    weightTotal: '45.0 kg',
    status: 'En ruta Planitack',
    statusBadge: 'warning',
    driver: 'Marcelo Tapia R.',
    vehicle: 'Furgón Mercedes Sprinter (Patente: LF-88-21)',
    driverPhone: '+56 9 7123 4455',
    eta: '16:45 hrs',
    planitackId: 'PLN-882190',
    notes: 'Ingreso por portón 2. Contactar a Juan Carlos en bodega.',
    timeScope: 'dia'
  },
  {
    id: 'RET-2026-9040',
    addressName: 'Hub Providencia E-Commerce',
    address: 'Av. Andrés Bello 2711, Piso 2, Providencia',
    date: '09-10-2026 (Hoy)',
    window: 'Mañana (09:00 - 13:00)',
    packagesCount: 8,
    weightTotal: '12.5 kg',
    status: 'Retirado conforme',
    statusBadge: 'success',
    driver: 'Gonzalo Pérez M.',
    vehicle: 'Peugeot Partner (Patente: KK-12-90)',
    driverPhone: '+56 9 6344 8899',
    completedAt: '11:32 hrs',
    planitackId: 'PLN-882104',
    manifestId: 'MAN-2026-0941',
    timeScope: 'dia'
  },
  {
    id: 'RET-2026-9039',
    addressName: 'Bodega Central Quilicura',
    address: 'Av. Américo Vespucio Norte 1400, Quilicura',
    date: '10-10-2026 (Mañana)',
    window: 'Mañana (09:00 - 13:00)',
    packagesCount: 35,
    weightTotal: '120.0 kg',
    status: 'Solicitado',
    statusBadge: 'info',
    driver: 'Asignación Planitack en proceso',
    vehicle: 'Por asignar',
    driverPhone: '—',
    planitackId: 'PLN-882045',
    notes: 'Carga paletizada. Requiere transpaleta.',
    timeScope: 'dia'
  },
  {
    id: 'RET-2026-9038',
    addressName: 'CD San Bernardo (Bodega 4)',
    address: 'Camino La Vara 0310, Módulo 4, San Bernardo',
    date: '13-10-2026 (Martes)',
    window: 'Mañana (09:00 - 13:00)',
    packagesCount: 14,
    weightTotal: '32.0 kg',
    status: 'Solicitado',
    statusBadge: 'info',
    driver: 'Asignación Planitack en proceso',
    vehicle: 'Por asignar',
    driverPhone: '—',
    planitackId: 'PLN-882195',
    notes: 'Retiro semanal programado de paquetería.',
    timeScope: 'semana'
  },
  {
    id: 'RET-2026-9037',
    addressName: 'Hub Providencia E-Commerce',
    address: 'Av. Andrés Bello 2711, Piso 2, Providencia',
    date: '15-10-2026 (Jueves)',
    window: 'Tarde (14:00 - 18:30)',
    packagesCount: 22,
    weightTotal: '55.0 kg',
    status: 'Solicitado',
    statusBadge: 'info',
    driver: 'Por asignar',
    vehicle: 'Por asignar',
    driverPhone: '—',
    planitackId: 'PLN-882210',
    notes: 'Despacho e-commerce quincenal.',
    timeScope: 'semana'
  },
  {
    id: 'RET-2026-9036',
    addressName: 'Bodega Central Quilicura',
    address: 'Av. Américo Vespucio Norte 1400, Quilicura',
    date: '22-10-2026 (Jueves)',
    window: 'Mañana (09:00 - 13:00)',
    packagesCount: 40,
    weightTotal: '135.0 kg',
    status: 'Solicitado',
    statusBadge: 'info',
    driver: 'Por asignar',
    vehicle: 'Por asignar',
    driverPhone: '—',
    planitackId: 'PLN-882280',
    notes: 'Carga consolidada programada para la 3ra semana.',
    timeScope: 'mes'
  },
  {
    id: 'RET-2026-9035',
    addressName: 'CD San Bernardo (Bodega 4)',
    address: 'Camino La Vara 0310, Módulo 4, San Bernardo',
    date: '29-10-2026 (Jueves)',
    window: 'Tarde (14:00 - 18:30)',
    packagesCount: 16,
    weightTotal: '42.0 kg',
    status: 'Solicitado',
    statusBadge: 'info',
    driver: 'Por asignar',
    vehicle: 'Por asignar',
    driverPhone: '—',
    planitackId: 'PLN-882310',
    notes: 'Retiro programado de cierre de mes.',
    timeScope: 'mes'
  }
];

const TIME_FILTER_OPTIONS = [
  { value: 'todos', label: 'Todos los retiros' },
  { value: 'dia', label: 'Próximo día' },
  { value: 'semana', label: 'Próxima semana' },
  { value: 'mes', label: 'Próximo mes' },
];

export default function RetirosView({ selectedAccount, showToast }) {
  // Pickups state
  const [pickups, setPickups] = useState(INITIAL_PICKUPS);
  const [pickupFilter, setPickupFilter] = useState('Todos');
  const [timeFilter, setTimeFilter] = useState('todos'); // 'todos' | 'dia' | 'semana' | 'mes'
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);
  const timeDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (timeDropdownRef.current && !timeDropdownRef.current.contains(event.target)) {
        setIsTimeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [pickupSearch, setPickupSearch] = useState('');

  // Saved addresses state for dynamic addition
  const [savedAddresses, setSavedAddresses] = useState(SAVED_ADDRESSES);

  // Modals for Pickup Flow
  const [isPickupModalOpen, setIsPickupModalOpen] = useState(false);
  const [isDateTimeModalOpen, setIsDateTimeModalOpen] = useState(false);
  const [isNewAddressModalOpen, setIsNewAddressModalOpen] = useState(false);

  // Date and Time selection state
  const [selectedPickupDate, setSelectedPickupDate] = useState(AVAILABLE_PICKUP_DAYS[0]);
  const [selectedPickupWindow, setSelectedPickupWindow] = useState('morning'); // 'morning' | 'afternoon'
  const [tempDate, setTempDate] = useState(AVAILABLE_PICKUP_DAYS[0]);
  const [tempWindow, setTempWindow] = useState('morning');
  const dateCarouselRef = useRef(null);

  // New Address form state
  const [newAddressForm, setNewAddressForm] = useState({
    name: '',
    region: 'Metropolitana',
    comuna: 'San Bernardo',
    address: '',
    depto: '',
    contact: '',
    phone: ''
  });

  const [newPickup, setNewPickup] = useState({
    addressId: 1,
    date: '09-10-2026 (Viernes)',
    window: 'Mañana (09:00 - 13:00)',
    packagesCount: 5,
    packageType: 'Paquetería estándar',
    weightTotal: 10,
    notes: '',
    contactName: 'Juan Carlos Morales',
    contactPhone: '+56 9 8877 6655'
  });

  const formattedDateTime = useMemo(() => {
    const windowLabel = selectedPickupWindow === 'morning' ? 'Mañana (09:00 - 13:00 hrs)' : 'Tarde (14:00 - 18:30 hrs)';
    return `${selectedPickupDate.dayName} ${selectedPickupDate.dayNum} de ${selectedPickupDate.month === 'Oct' ? 'octubre' : selectedPickupDate.month} · ${windowLabel}`;
  }, [selectedPickupDate, selectedPickupWindow]);

  const scrollCarousel = (direction) => {
    if (dateCarouselRef.current) {
      const scrollAmount = direction === 'left' ? -220 : 220;
      dateCarouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleSaveNewAddress = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!newAddressForm.name.trim() || !newAddressForm.address.trim()) {
      alert('Por favor ingresa el nombre y la dirección del punto de retiro.');
      return;
    }

    const newAddrObj = {
      id: Date.now(),
      name: newAddressForm.name.trim(),
      address: newAddressForm.address.trim() + (newAddressForm.depto ? `, ${newAddressForm.depto}` : ''),
      comuna: newAddressForm.comuna || 'San Bernardo',
      region: newAddressForm.region || 'Metropolitana',
      contact: newAddressForm.contact || 'Contacto en bodega',
      phone: newAddressForm.phone || '+56 9 1234 5678'
    };

    setSavedAddresses(prev => [newAddrObj, ...prev]);
    setNewPickup(prev => ({ ...prev, addressId: newAddrObj.id }));
    setIsNewAddressModalOpen(false);
    if (showToast) {
      showToast(`Nueva dirección "${newAddrObj.name}" guardada y seleccionada.`, 'success');
    }
  };

  const handleSaveDateTime = () => {
    setSelectedPickupDate(tempDate);
    setSelectedPickupWindow(tempWindow);
    setNewPickup(prev => ({
      ...prev,
      date: `${tempDate.dateStr} (${tempDate.dayName})`,
      window: tempWindow === 'morning' ? 'Mañana (09:00 - 13:00)' : 'Tarde (14:00 - 18:30)'
    }));
    setIsDateTimeModalOpen(false);
  };

  // Filtered pickups
  const filteredPickups = useMemo(() => {
    return pickups.filter(p => {
      // 1. Time / Schedule Horizon Filter (Día, Semana, Mes próximos)
      if (timeFilter !== 'todos') {
        const scope = p.timeScope || 'dia';
        if (timeFilter === 'dia' && scope !== 'dia') return false;
        if (timeFilter === 'semana' && scope !== 'dia' && scope !== 'semana') return false;
        if (timeFilter === 'mes' && scope !== 'dia' && scope !== 'semana' && scope !== 'mes') return false;
      }

      // 2. Status Filter
      if (pickupFilter !== 'Todos') {
        if (pickupFilter === 'Solicitados' && p.status !== 'Solicitado') return false;
        if (pickupFilter === 'En ruta' && p.status !== 'En ruta Planitack') return false;
        if (pickupFilter === 'Retirados' && p.status !== 'Retirado conforme') return false;
      }

      // 3. Search query
      if (pickupSearch.trim()) {
        const q = pickupSearch.toLowerCase();
        return p.id.toLowerCase().includes(q) || 
               p.address.toLowerCase().includes(q) || 
               (p.driver && p.driver.toLowerCase().includes(q)) ||
               (p.planitackId && p.planitackId.toLowerCase().includes(q));
      }
      return true;
    });
  }, [pickups, pickupFilter, timeFilter, pickupSearch]);

  // Handle new pickup schedule
  const handleSchedulePickup = (e) => {
    e.preventDefault();
    const selectedAddr = savedAddresses.find(a => a.id === Number(newPickup.addressId)) || savedAddresses[0];
    const newId = `RET-2026-${Math.floor(9043 + Math.random() * 50)}`;
    const planitackNum = `PLN-${Math.floor(882300 + Math.random() * 500)}`;

    const isWithinDay = selectedPickupDate.tag === 'Hoy' || selectedPickupDate.dayNum === '09' || selectedPickupDate.dayNum === '10';
    const isWithinWeek = Number(selectedPickupDate.dayNum) <= 16;
    const timeScope = isWithinDay ? 'dia' : isWithinWeek ? 'semana' : 'mes';

    const createdPickup = {
      id: newId,
      addressName: selectedAddr.name,
      address: `${selectedAddr.address}, ${selectedAddr.comuna}`,
      date: newPickup.date || formattedDateTime,
      window: newPickup.window || (selectedPickupWindow === 'morning' ? 'Mañana (09:00 - 13:00)' : 'Tarde (14:00 - 18:30)'),
      packagesCount: Number(newPickup.packagesCount) || 1,
      weightTotal: `${newPickup.weightTotal || 5} kg`,
      status: 'Solicitado',
      statusBadge: 'info',
      driver: 'Asignación Planitack en proceso',
      planitackId: planitackNum,
      notes: newPickup.notes || 'Retiro programado por cliente StarkenPro',
      timeScope: timeScope
    };

    setPickups([createdPickup, ...pickups]);
    setIsPickupModalOpen(false);
    if (showToast) {
      showToast(`Solicitud de retiro ${newId} programada exitosamente en Planitack.`, 'success');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 1. Header Hero Banner */}
      <div className="bg-gradient-to-r from-[#1e4f5e] via-[#33798C] to-[#266373] rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute -right-16 -bottom-16 w-72 h-72 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute right-36 -top-16 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full border border-white/10 pointer-events-none" />
        <div className="absolute right-72 -bottom-20 w-40 h-40 rounded-full bg-white/[0.03] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <h1 className="text-2xl sm:text-3xl font-black font-din tracking-tight text-white">
              Retiros
            </h1>
            <p className="text-xs sm:text-sm text-slate-100/90 font-medium font-sans leading-relaxed">
              Programa y monitorea retiros de paquetería en tus bodegas y centros de distribución con asignación y seguimiento de móviles Planitack.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsPickupModalOpen(true)}
              className="bg-white hover:bg-slate-100 text-[#1e4f5e] px-4 py-2.5 rounded-xl font-din font-bold text-xs tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Plus size={16} className="text-[#33798C]" />
              <span>Solicitar retiro</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-xl border border-starken-border p-5 sm:p-6 space-y-6 shadow-xs">
        
        {/* Quick Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-slate-400 font-din">Retiros hoy</div>
              <div className="text-2xl font-black font-din text-slate-900 mt-0.5">{pickups.length}</div>
              <div className="text-[11px] text-emerald-600 font-bold font-sans">100% programados</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#ECF5F7] text-[#33798C] flex items-center justify-center">
              <Calendar size={18} />
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-slate-400 font-din">En ruta Planitack</div>
              <div className="text-2xl font-black font-din text-amber-600 mt-0.5">
                {pickups.filter(p => p.status === 'En ruta Planitack').length}
              </div>
              <div className="text-[11px] text-amber-600 font-bold font-sans">Móvil asignado en camino</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Truck size={18} />
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-slate-400 font-din">Bultos a retirar</div>
              <div className="text-2xl font-black font-din text-[#33798C] mt-0.5">
                {pickups.reduce((acc, p) => acc + (p.packagesCount || 0), 0)}
              </div>
              <div className="text-[11px] text-slate-500 font-medium font-sans">Total consolidado</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#ECF5F7] text-[#33798C] flex items-center justify-center">
              <Package size={18} />
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-slate-400 font-din">Integración Planitack</div>
              <div className="text-xs font-black font-din text-emerald-700 mt-1 flex items-center gap-1">
                <CheckCircle2 size={14} className="text-emerald-600" />
                <span>Conexión activa</span>
              </div>
              <div className="text-[11px] text-slate-400 font-sans">SLA 99.4% cumplimiento</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Zap size={18} />
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-2">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar por folio, Planitack ID, dirección o conductor..."
              value={pickupSearch}
              onChange={(e) => setPickupSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#33798C] focus:bg-white transition-all font-sans"
            />
          </div>

          {/* Filters Cluster: Programados (Día, Semana, Mes) & Estado */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Time Filter Dropdown (Verde menta suave / petróleo tenue) */}
            <div className="relative" ref={timeDropdownRef}>
              <button
                type="button"
                onClick={() => setIsTimeDropdownOpen(prev => !prev)}
                className="flex items-center justify-between gap-2.5 bg-[#f0f8f6] hover:bg-[#e4f3ef] text-[#1e544c] border border-[#9fd3c8] hover:border-[#4fa395] focus:outline-none focus:ring-2 focus:ring-[#4fa395]/20 rounded-xl pl-3.5 pr-3 py-2 cursor-pointer transition-all font-sans font-bold text-xs shadow-2xs"
              >
                <span>{TIME_FILTER_OPTIONS.find(o => o.value === timeFilter)?.label || 'Todos los retiros'}</span>
                <ChevronDown 
                  size={14} 
                  className={`text-[#3f8f82] transition-transform duration-200 ${isTimeDropdownOpen ? 'rotate-180' : ''}`} 
                />
              </button>

              {isTimeDropdownOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-44 bg-white border border-[#cbe4de] rounded-xl shadow-lg py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  {TIME_FILTER_OPTIONS.map((opt) => {
                    const isSelected = opt.value === timeFilter;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          setTimeFilter(opt.value);
                          setIsTimeDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2 text-xs transition-colors cursor-pointer text-left ${
                          isSelected
                            ? 'bg-[#4fa395] text-white font-bold'
                            : 'text-slate-700 hover:bg-[#eef8f6] hover:text-[#1e544c] font-medium'
                        }`}
                      >
                        <span>{opt.label}</span>
                        {isSelected && <Check size={13} className="text-white shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Filter Status */}
            <div className="flex items-center gap-1 font-din text-xs font-bold bg-slate-100 p-1 rounded-xl border border-slate-200/80 shadow-2xs">
              {['Todos', 'Solicitados', 'En ruta', 'Retirados'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setPickupFilter(tab)}
                  className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
                    pickupFilter === tab
                      ? 'bg-[#33798C] text-white font-black shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Pickups Table / Cards */}
        <div className="space-y-3">
          {filteredPickups.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-xl text-slate-500 font-sans text-xs space-y-2">
              <p>No se encontraron solicitudes de retiro con los filtros seleccionados.</p>
              {(timeFilter !== 'todos' || pickupFilter !== 'Todos' || pickupSearch) && (
                <button
                  type="button"
                  onClick={() => {
                    setTimeFilter('todos');
                    setPickupFilter('Todos');
                    setPickupSearch('');
                  }}
                  className="text-[#33798C] font-bold hover:underline cursor-pointer inline-flex items-center gap-1"
                >
                  Restablecer filtros
                </button>
              )}
            </div>
          ) : (
            filteredPickups.map((pickup) => (
              <div 
                key={pickup.id}
                className="bg-white border border-slate-200 hover:border-[#33798C]/60 rounded-xl p-4 sm:p-5 transition-all shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-din font-black text-sm text-slate-900 tracking-wide">
                        {pickup.id}
                      </span>
                      <span className="bg-[#ECF5F7] text-[#33798C] text-[10px] font-bold px-2 py-0.5 rounded font-sans flex items-center gap-1">
                        <Zap size={10} />
                        Planitack #{pickup.planitackId}
                      </span>
                      
                      {pickup.status === 'En ruta Planitack' && (
                        <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold px-2.5 py-0.5 rounded-md font-sans flex items-center gap-1">
                          <Truck size={12} />
                          En ruta móvil
                        </span>
                      )}
                      {pickup.status === 'Retirado conforme' && (
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold px-2.5 py-0.5 rounded-md font-sans flex items-center gap-1">
                          <CheckCircle2 size={12} />
                          Retirado conforme
                        </span>
                      )}
                      {pickup.status === 'Solicitado' && (
                        <span className="bg-sky-50 text-sky-700 border border-sky-200 text-[11px] font-bold px-2.5 py-0.5 rounded-md font-sans flex items-center gap-1">
                          <Clock size={12} />
                          Programado
                        </span>
                      )}
                    </div>

                    {/* Hora en la esquina superior derecha */}
                    {pickup.status === 'En ruta Planitack' && pickup.eta && (
                      <div className="flex items-center gap-1.5 text-right">
                        <span className="text-[11px] font-bold text-slate-400 font-din">Hora estimada de retiro:</span>
                        <span className="text-sm font-black text-amber-600 font-din">{pickup.eta}</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4 text-xs font-sans items-center">
                    {/* 1. Dirección de retiro */}
                    <div className="space-y-0.5 lg:col-span-3">
                      <div className="text-[10px] font-bold text-slate-400 font-din flex items-center gap-1">
                        <MapPin size={11} className="text-[#33798C]" />
                        <span>Dirección de retiro</span>
                      </div>
                      <p className="font-bold text-slate-800">{pickup.addressName}</p>
                      <p className="text-slate-500 text-[11px] truncate">{pickup.address}</p>
                    </div>

                    {/* 2. Horario programado */}
                    <div className="space-y-0.5 lg:col-span-2">
                      <div className="text-[10px] font-bold text-slate-400 font-din flex items-center gap-1">
                        <Calendar size={11} className="text-[#33798C]" />
                        <span>Horario programado</span>
                      </div>
                      <p className="font-bold text-slate-800">{pickup.date}</p>
                      <p className="text-slate-500 text-[11px]">{pickup.window}</p>
                    </div>

                    {/* 3. Volumen & conductor (corrido a la izquierda) */}
                    <div className="space-y-0.5 lg:col-span-2">
                      <div className="text-[10px] font-bold text-slate-400 font-din flex items-center gap-1">
                        <Package size={11} className="text-[#33798C]" />
                        <span>Volumen & conductor</span>
                      </div>
                      <p className="font-bold text-slate-800">{pickup.packagesCount} bultos ({pickup.weightTotal})</p>
                      <p className="text-slate-500 text-[11px]">{pickup.driver}</p>
                    </div>

                    {/* 4. Step paso a paso con el estado */}
                    <div className="lg:col-span-5 bg-slate-50/70 p-2.5 rounded-xl border border-slate-200/60 space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 font-din">
                        <span className="flex items-center gap-1 uppercase tracking-wider text-slate-500">
                          <Activity size={11} className="text-[#33798C]" />
                          <span>Estado del retiro</span>
                        </span>
                        {pickup.status === 'En ruta Planitack' && (
                          <span className="text-amber-600 font-bold flex items-center gap-1.5 text-[10px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            En camino
                          </span>
                        )}
                        {pickup.status === 'Retirado conforme' && (
                          <span className="text-emerald-600 font-bold text-[10px]">
                            {pickup.completedAt ? `Finalizado ${pickup.completedAt}` : 'Completado'}
                          </span>
                        )}
                        {pickup.status === 'Solicitado' && (
                          <span className="text-slate-500 font-medium text-[10px]">Asignando móvil</span>
                        )}
                      </div>

                      <div className="relative flex items-center justify-between pt-1 pb-0.5">
                        {/* Background track line */}
                        <div className="absolute top-[13px] left-5 right-5 h-0.5 bg-slate-200" />
                        
                        {/* Active progress bar line */}
                        <div 
                          className={`absolute top-[13px] left-5 h-0.5 transition-all duration-300 ${
                            pickup.status === 'Retirado conforme' 
                              ? 'w-[calc(100%-2.5rem)] bg-emerald-500' 
                              : pickup.status === 'En ruta Planitack'
                                ? 'w-1/2 bg-amber-500'
                                : 'w-0 bg-[#33798C]'
                          }`} 
                        />

                        {/* Step 1: Programado */}
                        <div className="flex flex-col items-center relative z-10">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                            pickup.status === 'Retirado conforme' || pickup.status === 'En ruta Planitack'
                              ? 'bg-emerald-500 text-white shadow-xs'
                              : 'bg-[#33798C] text-white ring-2 ring-[#33798C]/20 shadow-xs'
                          }`}>
                            <Check size={12} strokeWidth={2.5} />
                          </div>
                          <span className={`text-[10px] mt-1 font-din tracking-tight whitespace-nowrap ${
                            pickup.status === 'Solicitado' ? 'font-bold text-[#33798C]' : 'font-semibold text-slate-700'
                          }`}>
                            Programado
                          </span>
                        </div>

                        {/* Step 2: En ruta a retiro */}
                        <div className="flex flex-col items-center relative z-10">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                            pickup.status === 'Retirado conforme'
                              ? 'bg-emerald-500 text-white shadow-xs'
                              : pickup.status === 'En ruta Planitack'
                                ? 'bg-amber-500 text-white ring-4 ring-amber-100 shadow-sm'
                                : 'bg-white border-2 border-slate-300 text-slate-400'
                          }`}>
                            {pickup.status === 'Retirado conforme' ? (
                              <Check size={12} strokeWidth={2.5} />
                            ) : (
                              <Truck size={11} />
                            )}
                          </div>
                          <span className={`text-[10px] mt-1 font-din tracking-tight whitespace-nowrap ${
                            pickup.status === 'En ruta Planitack' 
                              ? 'font-bold text-amber-700' 
                              : pickup.status === 'Retirado conforme'
                                ? 'font-semibold text-slate-700'
                                : 'font-medium text-slate-400'
                          }`}>
                            En ruta a retiro
                          </span>
                        </div>

                        {/* Step 3: Retiro realizado */}
                        <div className="flex flex-col items-center relative z-10">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                            pickup.status === 'Retirado conforme'
                              ? 'bg-emerald-500 text-white ring-4 ring-emerald-100 shadow-sm'
                              : 'bg-white border-2 border-slate-300 text-slate-400'
                          }`}>
                            {pickup.status === 'Retirado conforme' ? (
                              <Check size={12} strokeWidth={2.5} />
                            ) : (
                              <Package size={11} />
                            )}
                          </div>
                          <span className={`text-[10px] mt-1 font-din tracking-tight whitespace-nowrap ${
                            pickup.status === 'Retirado conforme'
                              ? 'font-bold text-emerald-700'
                              : 'font-medium text-slate-400'
                          }`}>
                            Retiro realizado
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {pickup.notes && (
                    <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-200/60 font-sans">
                      <span className="font-bold text-slate-700">Nota operativa:</span> {pickup.notes}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100 w-full sm:w-32 lg:w-36 justify-center">
                  <button
                    onClick={() => {
                      if (showToast) showToast(`Abriendo estado en tiempo real en Planitack para ${pickup.planitackId}...`, 'info');
                    }}
                    className="w-full bg-[#33798C] hover:bg-[#1e4f5e] text-white text-xs font-bold font-din px-3.5 py-2 rounded-lg transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Ver Planitack</span>
                    <ExternalLink size={12} />
                  </button>

                  <button
                    onClick={() => {
                      if (showToast) showToast(`Descargando manifiesto de retiro ${pickup.id}...`, 'info');
                    }}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold font-din px-3.5 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    title="Descargar etiquetas / manifiesto"
                  >
                    <Download size={13} />
                    <span>Etiquetas</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* PICKUP SCHEDULE MODALS                                   */}
      {/* ========================================================= */}
      {/* Modal 1: Solicitud de Retiro */}
      {isPickupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
            onClick={() => setIsPickupModalOpen(false)}
          />
          <div className="bg-white rounded-3xl max-w-xl sm:max-w-2xl w-full p-6 sm:p-8 relative z-10 space-y-5 shadow-2xl border border-starken-border animate-in zoom-in-95 flex flex-col">
            <button 
              onClick={() => setIsPickupModalOpen(false)} 
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition cursor-pointer"
              title="Cerrar modal"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="pr-10 sm:pr-0 pb-4 border-b border-slate-200">
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#ECF5F7] text-[#33798C] border border-[#33798C]/20 flex items-center justify-center shrink-0 shadow-xs">
                  <Truck size={24} />
                </div>
                <div>
                  <h3 className="font-black text-xl text-slate-900 font-din tracking-tight">
                    Solicitud de retiro
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold font-sans mt-0.5">
                    Integración directa con despacho Planitack
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSchedulePickup} className="space-y-4 text-xs font-sans">
              
              {/* Field 1: Dirección de retiro guardada + Botón agregar */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <label className="block font-bold text-slate-700">1. Dirección de retiro guardada *</label>
                  <button
                    type="button"
                    onClick={() => {
                      setNewAddressForm({
                        name: '',
                        region: 'Metropolitana',
                        comuna: 'San Bernardo',
                        address: '',
                        depto: '',
                        contact: '',
                        phone: ''
                      });
                      setIsNewAddressModalOpen(true);
                    }}
                    className="text-xs text-[#33798C] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={13} />
                    <span>Nueva dirección</span>
                  </button>
                </div>

                <div className="relative">
                  <select
                    value={newPickup.addressId}
                    onChange={(e) => setNewPickup({ ...newPickup, addressId: e.target.value })}
                    className="w-full pl-3.5 pr-10 py-2.5 border border-slate-200 hover:border-[#33798C] rounded-xl text-xs bg-white font-bold text-slate-800 outline-none focus:border-[#33798C] focus:ring-2 focus:ring-[#33798C]/20 transition-all cursor-pointer appearance-none shadow-2xs"
                  >
                    {savedAddresses.map((addr) => (
                      <option key={addr.id} value={addr.id}>
                        {addr.name} — {addr.address}, {addr.comuna}
                      </option>
                    ))}
                  </select>
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#33798C]">
                    <ChevronDown size={16} />
                  </span>
                </div>
              </div>

              {/* Field 2: Fecha y hora de retiro (Unified input with Calendar trigger) */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">2. Fecha y hora de retiro *</label>
                <div 
                  onClick={() => {
                    setTempDate(selectedPickupDate);
                    setTempWindow(selectedPickupWindow);
                    setIsDateTimeModalOpen(true);
                  }}
                  className="w-full px-3.5 py-2.5 border border-slate-200 hover:border-[#33798C] rounded-xl bg-slate-50/80 hover:bg-white text-xs font-bold text-slate-800 cursor-pointer transition-all flex items-center justify-between shadow-2xs group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Calendar size={16} className="text-[#33798C] shrink-0" />
                    <span className="truncate text-slate-900">{formattedDateTime}</span>
                  </div>
                  <span className="text-[11px] font-bold text-[#33798C] font-din group-hover:underline shrink-0 ml-2">
                    Cambiar fecha
                  </span>
                </div>
              </div>

              {/* Fields 3 & 4: Cantidad de bultos & Peso aprox */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">3. Cantidad de bultos *</label>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    required
                    value={newPickup.packagesCount}
                    onChange={(e) => setNewPickup({ ...newPickup, packagesCount: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 hover:border-[#33798C] rounded-xl text-xs font-din font-bold text-slate-900 outline-none focus:border-[#33798C] focus:ring-2 focus:ring-[#33798C]/20 transition-all shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">4. Peso total aproximado (kg)</label>
                  <input
                    type="number"
                    min="1"
                    value={newPickup.weightTotal}
                    onChange={(e) => setNewPickup({ ...newPickup, weightTotal: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 hover:border-[#33798C] rounded-xl text-xs font-din font-bold text-slate-900 outline-none focus:border-[#33798C] focus:ring-2 focus:ring-[#33798C]/20 transition-all shadow-2xs"
                  />
                </div>
              </div>

              {/* Field 5: Instrucciones para el conductor */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Instrucciones para el conductor Planitack</label>
                <input
                  type="text"
                  placeholder="Ej. Tocar portón 3, preguntar por bodega."
                  value={newPickup.notes}
                  onChange={(e) => setNewPickup({ ...newPickup, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 hover:border-[#33798C] rounded-xl text-xs outline-none focus:border-[#33798C] focus:ring-2 focus:ring-[#33798C]/20 transition-all shadow-2xs"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setIsPickupModalOpen(false)}
                  className="btn btn-outline flex-1 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary flex-1 cursor-pointer font-bold"
                >
                  <span>Confirmar retiro</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Selector de Fecha y Horario con Carrusel Horizontal */}
      {isDateTimeModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
            onClick={() => setIsDateTimeModalOpen(false)}
          />
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 relative z-10 space-y-5 shadow-2xl border border-starken-border animate-in zoom-in-95 flex flex-col">
            <button 
              onClick={() => setIsDateTimeModalOpen(false)} 
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition cursor-pointer"
              title="Cerrar modal"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="pr-10 sm:pr-0 pb-4 border-b border-slate-200">
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#ECF5F7] text-[#33798C] border border-[#33798C]/20 flex items-center justify-center shrink-0 shadow-xs">
                  <Calendar size={24} />
                </div>
                <div>
                  <h3 className="font-black text-xl text-slate-900 font-din tracking-tight">
                    Fecha y horario de retiro
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold font-sans mt-0.5">
                    Selecciona el día y la franja horaria disponible para el retiro en tu dirección
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-5 text-xs font-sans">
              
              {/* Carousel Header & Controls */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700">Día de retiro disponible</label>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => scrollCarousel('left')}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition cursor-pointer shadow-2xs"
                      title="Días anteriores"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => scrollCarousel('right')}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition cursor-pointer shadow-2xs"
                      title="Días siguientes"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>

                {/* Horizontal Scrollable Carousel */}
                <div 
                  ref={dateCarouselRef}
                  className="flex items-center gap-2.5 overflow-x-auto py-1 px-0.5 no-scrollbar scroll-smooth"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {AVAILABLE_PICKUP_DAYS.map((day) => {
                    const isSelected = tempDate.id === day.id;
                    return (
                      <button
                        type="button"
                        key={day.id}
                        onClick={() => {
                          setTempDate(day);
                          if (tempWindow === 'afternoon' && !day.afternoonAvailable) {
                            setTempWindow('morning');
                          }
                        }}
                        className={`shrink-0 w-24 p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between ${
                          isSelected 
                            ? 'bg-[#ECF5F7] border-[#33798C] ring-2 ring-[#33798C]/30 shadow-xs' 
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/80'
                        }`}
                      >
                        <span className={`text-[10px] font-bold font-din ${isSelected ? 'text-[#33798C]' : 'text-slate-500'}`}>
                          {day.dayName}
                        </span>
                        <span className={`text-2xl font-black font-din my-1 ${isSelected ? 'text-[#1e4f5e]' : 'text-slate-800'}`}>
                          {day.dayNum}
                        </span>
                        <span className={`text-[10px] font-bold ${isSelected ? 'text-[#33798C]' : 'text-slate-400'}`}>
                          {day.month}
                        </span>
                        <span className={`mt-2 text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          day.tag === 'Hoy'
                            ? 'bg-emerald-100 text-emerald-800'
                            : isSelected
                            ? 'bg-[#33798C] text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {day.tag}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Windows Selection */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                <label className="font-bold text-slate-700">
                  Franja horaria para {tempDate.fullLabel.toLowerCase()}
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Morning Window */}
                  <div
                    onClick={() => tempDate.morningAvailable && setTempWindow('morning')}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      tempWindow === 'morning'
                        ? 'bg-[#ECF5F7] border-[#33798C] ring-2 ring-[#33798C]/30 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        tempWindow === 'morning' ? 'bg-[#33798C] text-white' : 'bg-slate-100 text-slate-500'
                      }`}>
                        <Sun size={18} />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">Jornada mañana</div>
                        <div className="text-[11px] text-slate-500 font-din">09:00 - 13:00 hrs</div>
                      </div>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                      Disponible
                    </span>
                  </div>

                  {/* Afternoon Window */}
                  <div
                    onClick={() => tempDate.afternoonAvailable && setTempWindow('afternoon')}
                    className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      !tempDate.afternoonAvailable
                        ? 'bg-slate-50 border-slate-200 opacity-50 cursor-not-allowed'
                        : tempWindow === 'afternoon'
                        ? 'bg-[#ECF5F7] border-[#33798C] ring-2 ring-[#33798C]/30 shadow-xs cursor-pointer'
                        : 'bg-white border-slate-200 hover:border-slate-300 cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        tempWindow === 'afternoon' ? 'bg-[#33798C] text-white' : 'bg-slate-100 text-slate-500'
                      }`}>
                        <Clock size={18} />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">Jornada tarde</div>
                        <div className="text-[11px] text-slate-500 font-din">14:00 - 18:30 hrs</div>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      tempDate.afternoonAvailable ? 'text-emerald-700 bg-emerald-100' : 'text-slate-500 bg-slate-200'
                    }`}>
                      {tempDate.afternoonAvailable ? 'Disponible' : 'No disponible'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setIsDateTimeModalOpen(false)}
                  className="btn btn-outline flex-1 cursor-pointer"
                >
                  Volver
                </button>
                <button
                  type="button"
                  onClick={handleSaveDateTime}
                  className="btn btn-primary flex-1 cursor-pointer font-bold"
                >
                  <span>Guardar horario</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Agregar Nueva Dirección de Retiro */}
      {isNewAddressModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
            onClick={() => setIsNewAddressModalOpen(false)}
          />
          <div className="bg-white rounded-3xl max-w-lg sm:max-w-xl w-full p-6 sm:p-8 relative z-10 space-y-5 shadow-2xl border border-starken-border animate-in zoom-in-95 flex flex-col">
            <button 
              onClick={() => setIsNewAddressModalOpen(false)} 
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition cursor-pointer"
              title="Cerrar modal"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="pr-10 sm:pr-0 pb-4 border-b border-slate-200">
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#ECF5F7] text-[#33798C] border border-[#33798C]/20 flex items-center justify-center shrink-0 shadow-xs">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="font-black text-xl text-slate-900 font-din tracking-tight">
                    Nueva dirección de retiro
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold font-sans mt-0.5">
                    Ingresa los datos del nuevo punto de retiro para registrarlo en tu cuenta
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSaveNewAddress} className="space-y-4 text-xs font-sans">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Nombre o alias de la dirección *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Bodega E-Commerce Lampa"
                  value={newAddressForm.name}
                  onChange={(e) => setNewAddressForm({ ...newAddressForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 hover:border-[#33798C] rounded-xl text-xs outline-none focus:border-[#33798C] focus:ring-2 focus:ring-[#33798C]/20 transition-all shadow-2xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Región *</label>
                  <div className="relative">
                    <select
                      value={newAddressForm.region}
                      onChange={(e) => setNewAddressForm({ ...newAddressForm, region: e.target.value })}
                      className="w-full pl-3.5 pr-10 py-2.5 border border-slate-200 hover:border-[#33798C] rounded-xl text-xs bg-white font-medium text-slate-800 outline-none focus:border-[#33798C] focus:ring-2 focus:ring-[#33798C]/20 transition-all cursor-pointer appearance-none shadow-2xs"
                    >
                      <option value="Metropolitana">Metropolitana</option>
                      <option value="Valparaíso">Valparaíso</option>
                      <option value="Biobío">Biobío</option>
                      <option value="Coquimbo">Coquimbo</option>
                      <option value="Antofagasta">Antofagasta</option>
                    </select>
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#33798C]">
                      <ChevronDown size={16} />
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Comuna *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. San Bernardo"
                    value={newAddressForm.comuna}
                    onChange={(e) => setNewAddressForm({ ...newAddressForm, comuna: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 hover:border-[#33798C] rounded-xl text-xs outline-none focus:border-[#33798C] focus:ring-2 focus:ring-[#33798C]/20 transition-all shadow-2xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="font-bold text-slate-700">Calle y numeración *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Camino La Vara 0310"
                    value={newAddressForm.address}
                    onChange={(e) => setNewAddressForm({ ...newAddressForm, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 hover:border-[#33798C] rounded-xl text-xs outline-none focus:border-[#33798C] focus:ring-2 focus:ring-[#33798C]/20 transition-all shadow-2xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Depto / bodega</label>
                  <input
                    type="text"
                    placeholder="Ej. Módulo 4"
                    value={newAddressForm.depto}
                    onChange={(e) => setNewAddressForm({ ...newAddressForm, depto: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 hover:border-[#33798C] rounded-xl text-xs outline-none focus:border-[#33798C] focus:ring-2 focus:ring-[#33798C]/20 transition-all shadow-2xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Nombre de contacto en bodega</label>
                  <input
                    type="text"
                    placeholder="Ej. Carlos Valenzuela"
                    value={newAddressForm.contact}
                    onChange={(e) => setNewAddressForm({ ...newAddressForm, contact: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 hover:border-[#33798C] rounded-xl text-xs outline-none focus:border-[#33798C] focus:ring-2 focus:ring-[#33798C]/20 transition-all shadow-2xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Teléfono de contacto</label>
                  <input
                    type="tel"
                    placeholder="+56 9 8765 4321"
                    value={newAddressForm.phone}
                    onChange={(e) => setNewAddressForm({ ...newAddressForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 hover:border-[#33798C] rounded-xl text-xs outline-none focus:border-[#33798C] focus:ring-2 focus:ring-[#33798C]/20 transition-all shadow-2xs"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setIsNewAddressModalOpen(false)}
                  className="btn btn-outline flex-1 cursor-pointer"
                >
                  Volver
                </button>
                <button
                  type="submit"
                  className="btn btn-primary flex-1 cursor-pointer font-bold"
                >
                  <span>Guardar dirección</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
