import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
  ChevronDown, 
  Bell, 
  Menu, 
  Check, 
  MapPin, 
  Building2, 
  Search, 
  X, 
  Plus, 
  Minus,
  Home,
  Mail,
  Pencil, 
  Clock, 
  Phone, 
  User, 
  CreditCard,
  CheckCircle2
} from 'lucide-react';

const INITIAL_ADDRESSES = [
  {
    id: 1,
    alias: 'CD San Bernardo (Principal)',
    direccion: 'Av. Los Robles 1020, San Bernardo',
    calle: 'Av. Los Robles',
    numero: '1020',
    comuna: 'San Bernardo',
    region: 'Región Metropolitana',
    contacto: 'Marta Díaz',
    telefono: '+56 9 8812 3456',
    horario: '08:00 - 18:00 hrs'
  },
  {
    id: 2,
    alias: 'Hub Providencia E-Commerce',
    direccion: 'Av. Providencia 2240, Of. 402, Providencia',
    calle: 'Av. Providencia',
    numero: '2240, Of. 402',
    comuna: 'Providencia',
    region: 'Región Metropolitana',
    contacto: 'Rodrigo Jara',
    telefono: '+56 9 7711 2233',
    horario: '09:00 - 19:00 hrs'
  },
  {
    id: 3,
    alias: 'Sucursal Concepción Mayorista',
    direccion: 'Calle Bernardo O\'Higgins 840, Concepción',
    calle: 'Calle Bernardo O\'Higgins',
    numero: '840',
    comuna: 'Concepción',
    region: 'Región del Biobío',
    contacto: 'Claudia Fuentes',
    telefono: '+56 9 6655 4433',
    horario: '08:30 - 17:30 hrs'
  },
  {
    id: 4,
    alias: 'Centro Distribución Antofagasta',
    direccion: 'Av. Industrial 450, Galpón 3, Antofagasta',
    calle: 'Av. Industrial',
    numero: '450, Galpón 3',
    comuna: 'Antofagasta',
    region: 'Región de Antofagasta',
    contacto: 'Hernán Silva',
    telefono: '+56 9 5544 3322',
    horario: '08:00 - 18:00 hrs'
  }
];

const PREDICTIVE_ADDRESSES_DB = [
  {
    address: 'Calle Bernardo O\'Higgins 840',
    street: 'Calle Bernardo O\'Higgins 840',
    comuna: 'Concepción',
    region: 'Región del Biobío',
    regionFull: 'Región del Biobío (Concepción)',
    postalCode: '4030000',
    lat: -36.82699,
    lng: -73.04977,
    pinPercent: { x: 50, y: 42 }
  },
  {
    address: 'Av. Los Robles 1020',
    street: 'Av. Los Robles 1020',
    comuna: 'San Bernardo',
    region: 'Región Metropolitana',
    regionFull: 'Región Metropolitana de Santiago',
    postalCode: '8050000',
    lat: -33.59321,
    lng: -70.70512,
    pinPercent: { x: 45, y: 38 }
  },
  {
    address: 'Av. Providencia 2240',
    street: 'Av. Providencia 2240',
    comuna: 'Providencia',
    region: 'Región Metropolitana',
    regionFull: 'Región Metropolitana de Santiago',
    postalCode: '7510000',
    lat: -33.42410,
    lng: -70.61200,
    pinPercent: { x: 52, y: 44 }
  },
  {
    address: 'Av. Industrial 450',
    street: 'Av. Industrial 450',
    comuna: 'Antofagasta',
    region: 'Región de Antofagasta',
    regionFull: 'Región de Antofagasta',
    postalCode: '1240000',
    lat: -23.65092,
    lng: -70.39750,
    pinPercent: { x: 48, y: 36 }
  },
  {
    address: 'Uva de la Cordillera 880',
    street: 'Uva de la Cordillera 880',
    comuna: 'Puente Alto',
    region: 'Región Metropolitana',
    regionFull: 'Región Metropolitana de Santiago',
    postalCode: '9227729',
    lat: -33.53507,
    lng: -70.54222,
    pinPercent: { x: 45, y: 38 }
  },
  {
    address: 'Av. Andrés Bello 2457',
    street: 'Av. Andrés Bello 2457',
    comuna: 'Providencia',
    region: 'Región Metropolitana',
    regionFull: 'Región Metropolitana de Santiago',
    postalCode: '7510689',
    lat: -33.41872,
    lng: -70.60741,
    pinPercent: { x: 55, y: 40 }
  }
];

export default function Header({ 
  searchTerm, 
  setSearchTerm, 
  onSearchOF, 
  toggleMobileSidebar 
}) {
  // Dropdowns state
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showAddressDropdown, setShowAddressDropdown] = useState(false);
  const [isEditingAddresses, setIsEditingAddresses] = useState(false);

  // Addresses State
  const [addresses, setAddresses] = useState(INITIAL_ADDRESSES);
  const [selectedAddress, setSelectedAddress] = useState(INITIAL_ADDRESSES[0]);
  const [addressModal, setAddressModal] = useState({ isOpen: false, mode: 'add', data: null });
  const [addressForm, setAddressForm] = useState({
    alias: '',
    calle: '',
    numero: '',
    comuna: 'Providencia',
    region: 'Región Metropolitana',
    contacto: '',
    telefono: '',
    horario: '08:30 - 18:00 hrs',
    isValidated: false
  });

  // Autocomplete state for Address Input
  const [isAddressSuggestionsOpen, setIsAddressSuggestionsOpen] = useState(false);
  const addressAutocompleteRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (addressAutocompleteRef.current && !addressAutocompleteRef.current.contains(event.target)) {
        setIsAddressSuggestionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredPredictiveAddresses = useMemo(() => {
    const q = (addressForm.calle || '').trim().toLowerCase();
    if (!q) return PREDICTIVE_ADDRESSES_DB.slice(0, 4);
    return PREDICTIVE_ADDRESSES_DB.filter(item =>
      item.address.toLowerCase().includes(q) ||
      item.street.toLowerCase().includes(q) ||
      item.comuna.toLowerCase().includes(q)
    ).slice(0, 5);
  }, [addressForm.calle]);

  // Confirmation Modal & Georeferencing State
  const [isConfirmAddressModalOpen, setIsConfirmAddressModalOpen] = useState(false);
  const [addressModalZoom, setAddressModalZoom] = useState(1);
  const [confirmAddressData, setConfirmAddressData] = useState({
    address: '',
    street: '',
    number: '',
    comuna: '',
    region: '',
    regionFull: '',
    postalCode: '9227729',
    lat: -33.53507,
    lng: -70.54222,
    pinPercent: { x: 45, y: 38 },
    modalSearchInput: ''
  });

  // Search submission
  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    const query = (searchTerm || '').trim();
    if (!query) return;
    if (onSearchOF) onSearchOF(query);
  };

  // Address Modal Handlers
  const handleOpenAddAddress = () => {
    setAddressForm({
      alias: '',
      calle: '',
      numero: '',
      comuna: 'Providencia',
      region: 'Región Metropolitana',
      contacto: '',
      telefono: '',
      horario: '08:30 - 18:00 hrs',
      isValidated: false
    });
    setAddressModal({ isOpen: true, mode: 'add', data: null });
    setShowAddressDropdown(false);
  };

  const handleOpenEditAddress = (addr) => {
    setAddressForm({
      alias: addr.alias || '',
      calle: addr.calle || '',
      numero: addr.numero || '',
      comuna: addr.comuna || 'Providencia',
      region: addr.region || 'Región Metropolitana',
      contacto: addr.contacto || '',
      telefono: addr.telefono || '',
      horario: addr.horario || '08:30 - 18:00 hrs',
      isValidated: true
    });
    setAddressModal({ isOpen: true, mode: 'edit', data: addr });
    setShowAddressDropdown(false);
  };

  const handleSelectPredictiveAddress = (item) => {
    setAddressForm(prev => ({
      ...prev,
      calle: item.street || item.address,
      comuna: item.comuna || prev.comuna,
      region: item.region || prev.region,
      isValidated: false
    }));
    setConfirmAddressData({
      address: item.address,
      street: item.street || item.address,
      number: item.number || '',
      comuna: item.comuna,
      region: item.region,
      regionFull: item.regionFull,
      postalCode: item.postalCode,
      lat: item.lat,
      lng: item.lng,
      pinPercent: item.pinPercent || { x: 45, y: 38 },
      modalSearchInput: `${item.address}, ${item.comuna}`
    });
    setAddressModalZoom(1);
    setIsAddressSuggestionsOpen(false);
    setIsConfirmAddressModalOpen(true);
  };

  // Open confirmation modal (Address Validator)
  const handleOpenAddressConfirmModal = () => {
    const streetQuery = (addressForm.calle || '').trim();
    const query = streetQuery.toLowerCase();

    const match = PREDICTIVE_ADDRESSES_DB.find(item =>
      query && (
        query.includes(item.street.toLowerCase()) ||
        query.includes(item.address.toLowerCase()) ||
        item.address.toLowerCase().includes(query)
      )
    );

    let streetVal = streetQuery;
    let comunaVal = addressForm.comuna || 'Providencia';
    let regionVal = addressForm.region || 'Región Metropolitana';
    let regionFullVal = addressForm.region === 'Región del Biobío' 
      ? 'Región del Biobío (Concepción)' 
      : addressForm.region === 'Región de Antofagasta' 
        ? 'Región de Antofagasta' 
        : 'Región Metropolitana de Santiago';
    let postalVal = '7510000';
    let latVal = -33.42410;
    let lngVal = -70.61200;
    let pinVal = { x: 50, y: 42 };

    if (match) {
      streetVal = match.street || match.address;
      comunaVal = match.comuna;
      regionVal = match.region;
      regionFullVal = match.regionFull;
      postalVal = match.postalCode;
      latVal = match.lat;
      lngVal = match.lng;
      pinVal = match.pinPercent || { x: 50, y: 42 };
    } else {
      if (comunaVal.toLowerCase().includes('concepción') || regionVal.includes('Biobío')) {
        latVal = -36.82699;
        lngVal = -73.04977;
        postalVal = '4030000';
        regionFullVal = 'Región del Biobío (Concepción)';
        pinVal = { x: 50, y: 42 };
      } else if (comunaVal.toLowerCase().includes('antofagasta') || regionVal.includes('Antofagasta')) {
        latVal = -23.65092;
        lngVal = -70.39750;
        postalVal = '1240000';
        regionFullVal = 'Región de Antofagasta';
        pinVal = { x: 48, y: 36 };
      } else if (comunaVal.toLowerCase().includes('san bernardo')) {
        latVal = -33.59321;
        lngVal = -70.70512;
        postalVal = '8050000';
        regionFullVal = 'Región Metropolitana de Santiago';
        pinVal = { x: 45, y: 38 };
      }
    }

    setConfirmAddressData({
      address: streetVal || 'Av. Pedro de Valdivia 1145',
      street: streetVal || 'Av. Pedro de Valdivia 1145',
      number: addressForm.numero || '',
      comuna: comunaVal,
      region: regionVal,
      regionFull: regionFullVal,
      postalCode: postalVal,
      lat: latVal,
      lng: lngVal,
      pinPercent: pinVal,
      modalSearchInput: `${streetVal || 'Av. Pedro de Valdivia 1145'}, ${comunaVal}`
    });
    setAddressModalZoom(1);
    setIsAddressSuggestionsOpen(false);
    setIsConfirmAddressModalOpen(true);
  };

  const handleMapClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const pctX = Math.max(8, Math.min(92, (clickX / rect.width) * 100));
    const pctY = Math.max(12, Math.min(88, (clickY / rect.height) * 100));

    const baseLat = confirmAddressData.lat || -36.82699;
    const baseLng = confirmAddressData.lng || -73.04977;
    const deltaY = (pctY - (confirmAddressData.pinPercent?.y || 42)) * -0.0006;
    const deltaX = (pctX - (confirmAddressData.pinPercent?.x || 50)) * 0.0006;

    const newLat = parseFloat((baseLat + deltaY).toFixed(5));
    const newLng = parseFloat((baseLng + deltaX).toFixed(5));

    setConfirmAddressData(prev => ({
      ...prev,
      lat: newLat,
      lng: newLng,
      pinPercent: { x: pctX, y: pctY }
    }));
  };

  const handleModalAddressSearch = (e) => {
    if (e) e.preventDefault();
    const q = (confirmAddressData.modalSearchInput || '').trim().toLowerCase();
    if (!q) return;

    if (q.includes('google.com/maps') || q.includes('@')) {
      const match = q.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (match) {
        setConfirmAddressData(prev => ({
          ...prev,
          lat: parseFloat(match[1]),
          lng: parseFloat(match[2]),
          pinPercent: { x: 50, y: 40 }
        }));
        return;
      }
    }

    const found = PREDICTIVE_ADDRESSES_DB.find(item =>
      item.address.toLowerCase().includes(q) ||
      item.street.toLowerCase().includes(q) ||
      item.comuna.toLowerCase().includes(q)
    );

    if (found) {
      setConfirmAddressData({
        ...found,
        pinPercent: found.pinPercent || { x: 45, y: 38 },
        modalSearchInput: `${found.address}, ${found.comuna}`
      });
    } else {
      setConfirmAddressData(prev => ({
        ...prev,
        address: confirmAddressData.modalSearchInput,
        street: confirmAddressData.modalSearchInput
      }));
    }
  };

  const handleSaveConfirmedAddress = () => {
    const confirmedStreet = confirmAddressData.street || confirmAddressData.address || addressForm.calle;
    const confirmedComuna = confirmAddressData.comuna || addressForm.comuna;
    const confirmedRegion = confirmAddressData.region || addressForm.region;

    setAddressForm(prev => ({
      ...prev,
      calle: confirmedStreet,
      comuna: confirmedComuna,
      region: confirmedRegion,
      isValidated: true
    }));
    setIsConfirmAddressModalOpen(false);
  };

  const handleSaveAddressSubmit = (e) => {
    e.preventDefault();
    if (!addressForm.alias.trim() || !addressForm.calle.trim()) return;

    const fullDireccion = `${addressForm.calle} ${addressForm.numero || ''}, ${addressForm.comuna}`.replace(/\s+,/g, ',').trim();

    const updatedData = {
      ...addressForm,
      direccion: fullDireccion,
      calle: addressForm.calle.trim(),
      numero: (addressForm.numero || '').trim(),
      comuna: addressForm.comuna || 'Providencia',
      region: addressForm.region || 'Región Metropolitana'
    };

    if (addressModal.mode === 'add') {
      const newAddr = {
        id: Date.now(),
        ...updatedData
      };
      setAddresses(prev => [...prev, newAddr]);
      setSelectedAddress(newAddr);
    } else {
      setAddresses(prev => prev.map(a => 
        a.id === addressModal.data.id ? { ...a, ...updatedData } : a
      ));
      if (selectedAddress.id === addressModal.data.id) {
        setSelectedAddress(prev => ({ ...prev, ...updatedData }));
      }
    }
    setAddressModal({ isOpen: false, mode: 'add', data: null });
  };


  return (
    <header className="bg-[#f8fafc] border-b border-slate-200/80 px-4 sm:px-6 md:px-8 py-3 flex items-center justify-between sticky top-0 z-20 font-sans shrink-0 gap-3">
      
      {/* 1. Left side: Mobile Toggle & Welcome Greeting */}
      <div className="flex items-center space-x-3 shrink-0">
        <button
          onClick={toggleMobileSidebar}
          className="md:hidden p-2 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer rounded-xl bg-white border border-slate-200 shadow-2xs"
          title="Abrir menú"
        >
          <Menu size={18} />
        </button>

        <div>
          <h1 className="text-[24px] font-black font-din text-slate-900 leading-tight tracking-tight">
            Hola, <span className="text-[#33798C]">Starkin</span>
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-400 font-sans font-medium">
            ¿Qué necesitas hacer hoy?
          </p>
        </div>
      </div>

      {/* 2. Middle: OF or RUT Search Bar */}
      <div className="flex-1 max-w-md mx-2 sm:mx-4 hidden md:block">
        <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full">
          <div className="relative w-full h-11 min-h-[44px] max-h-[44px] box-border flex items-center bg-white border border-slate-200 hover:border-slate-300 focus-within:border-[#33798C] focus-within:ring-2 focus-within:ring-[#33798C]/15 rounded-full px-4 shadow-2xs transition-all">
            <Search size={16} className="text-slate-400 shrink-0 mr-2.5" />
            <input
              type="text"
              placeholder="Buscar por N° de OF o RUT"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs text-slate-800 placeholder-slate-400 outline-none font-sans bg-transparent"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full cursor-pointer ml-1 transition-colors"
                title="Limpiar"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </form>
      </div>

      {/* 3. Right side: Notificaciones y Direcciones */}
      <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
        
        {/* OPTION 1: Botón de Notificaciones */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotificationModal(!showNotificationModal);
              setShowAddressDropdown(false);
            }}
            className="relative h-11 w-11 min-h-[44px] min-w-[44px] max-h-[44px] max-w-[44px] rounded-full bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 shadow-2xs flex items-center justify-center transition-all cursor-pointer shrink-0 box-border"
            title="Notificaciones y alertas"
          >
            <Bell size={18} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#10B981] ring-2 ring-white animate-pulse" />
          </button>

          {showNotificationModal && (
            <>
              <div 
                className="fixed inset-0 z-40"
                onClick={() => setShowNotificationModal(false)}
              />
              <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden py-3 animate-in fade-in duration-150">
                <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="font-din font-bold text-xs text-slate-800">Notificaciones recientes</span>
                  <span className="text-[10px] font-bold text-[#33798C] bg-[#ECF5F7] px-2 py-0.5 rounded-full font-sans">3 Nuevas</span>
                </div>
                <div className="divide-y divide-slate-100 text-xs font-sans max-h-64 overflow-y-auto">
                  <div className="p-3 hover:bg-slate-50 transition-colors">
                    <div className="font-bold text-slate-800">Factura FAC-2026-009841 emitida</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Período Septiembre disponible para conciliación.</div>
                    <div className="text-[10px] text-slate-400 mt-1">Hace 25 min</div>
                  </div>
                  <div className="p-3 hover:bg-slate-50 transition-colors">
                    <div className="font-bold text-slate-800">Excepción en reparto OF 275161618</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Destinatario ausente. Requiere confirmación de reintento.</div>
                    <div className="text-[10px] text-slate-400 mt-1">Hace 1 hora</div>
                  </div>
                  <div className="p-3 hover:bg-slate-50 transition-colors">
                    <div className="font-bold text-slate-800">Solicitud de materiales despachada</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Móvil Planitack en camino a CD San Bernardo.</div>
                    <div className="text-[10px] text-slate-400 mt-1">Ayer, 18:30 hrs</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* OPTION 2: Botón Dropdown de Direcciones / Sucursales */}
        <div className="relative">
          <button
            onClick={() => {
              setShowAddressDropdown(!showAddressDropdown);
              setIsEditingAddresses(false);
              setShowNotificationModal(false);
            }}
            className="h-11 min-h-[44px] max-h-[44px] flex items-center space-x-2.5 bg-white border border-slate-200 hover:border-slate-300 pl-2 pr-3.5 rounded-full shadow-2xs hover:shadow-xs transition-all cursor-pointer text-xs shrink-0 box-border"
            title="Seleccionar sucursal o dirección de entrega"
          >
            {/* MapPin Avatar / Badge */}
            <div className="w-8 h-8 min-w-[32px] min-h-[32px] rounded-full bg-[#ECF5F7] text-[#33798C] flex items-center justify-center shrink-0">
              <MapPin size={15} />
            </div>

            {/* Address alias & Comuna subtitle */}
            <div className="text-left hidden sm:flex flex-col justify-center min-w-0 max-w-[125px] md:max-w-[165px]">
              <div className="text-xs font-bold text-slate-900 leading-tight font-din truncate">
                {selectedAddress.alias}
              </div>
              <div className="text-[10px] text-slate-400 font-sans leading-tight truncate">
                {selectedAddress.comuna}
              </div>
            </div>

            <ChevronDown size={13} className="text-slate-400 shrink-0 ml-0.5" />
          </button>

          {showAddressDropdown && (
            <>
              <div 
                className="fixed inset-0 z-40"
                onClick={() => {
                  setShowAddressDropdown(false);
                  setIsEditingAddresses(false);
                }}
              />
              <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden py-2 animate-in fade-in duration-150">
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-bold font-sans text-slate-400">Direcciones y sucursales</span>
                  <span className="text-[10px] font-bold text-[#33798C] font-sans">{addresses.length} Registradas</span>
                </div>

                {/* List of addresses */}
                <div className="py-1 max-h-56 overflow-y-auto divide-y divide-slate-50">
                  {addresses.map((addr) => {
                    const isSelected = selectedAddress.id === addr.id;
                    return (
                      <div
                        key={addr.id}
                        className={`px-3 py-2 flex items-center justify-between hover:bg-slate-50 transition-colors ${
                          isSelected ? 'bg-[#ECF5F7]/60' : ''
                        }`}
                      >
                        <button
                          onClick={() => {
                            if (isEditingAddresses) {
                              handleOpenEditAddress(addr);
                            } else {
                              setSelectedAddress(addr);
                              setShowAddressDropdown(false);
                            }
                          }}
                          className="flex-1 text-left pr-2 cursor-pointer"
                        >
                          <div className={`text-xs font-bold font-din ${isSelected ? 'text-[#33798C]' : 'text-slate-800'}`}>
                            {addr.alias}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">
                            {addr.calle} {addr.numero}, {addr.comuna}
                          </div>
                        </button>

                        <div className="flex items-center space-x-1 shrink-0">
                          {isSelected && <Check size={14} className="text-[#33798C] mr-1" />}
                          {isEditingAddresses && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenEditAddress(addr);
                              }}
                              className="p-1 text-slate-400 hover:text-[#33798C] hover:bg-[#ECF5F7] rounded-md transition-colors cursor-pointer animate-in fade-in zoom-in-75 duration-150"
                              title="Editar dirección"
                            >
                              <Pencil size={13} />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Footer action links: Agregar & Editar */}
                <div className="border-t border-slate-100 px-4 py-2 bg-slate-50/50 flex items-center justify-between text-xs font-din font-bold">
                  <button
                    onClick={handleOpenAddAddress}
                    className="text-[#33798C] hover:text-[#1e4f5e] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={13} />
                    <span>Agregar dirección</span>
                  </button>
                  <button
                    onClick={() => setIsEditingAddresses(prev => !prev)}
                    className={`hover:underline flex items-center gap-1 cursor-pointer transition-colors ${
                      isEditingAddresses ? 'text-[#33798C] font-black' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Pencil size={12} />
                    <span>{isEditingAddresses ? 'Listo' : 'Editar'}</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>


      </div>

      {/* ========================================================= */}
      {/* MODAL: AGREGAR / EDITAR DIRECCIÓN                        */}
      {/* ========================================================= */}
      {addressModal.isOpen && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-starken-border shadow-2xl w-full max-w-lg overflow-hidden my-8">
            {/* Header */}
            <div className="px-5 sm:px-6 pt-5 sm:pt-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#ECF5F7] text-[#33798C] flex items-center justify-center shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <h3 className="font-black text-base text-slate-850 font-din tracking-wide">
                      {addressModal.mode === 'add' ? 'Agregar nueva dirección' : 'Editar dirección'}
                    </h3>
                    <p className="text-xs text-slate-500 font-sans">
                      {addressModal.mode === 'add' 
                        ? 'Registra una nueva sucursal o bodega para entregas y retiros.' 
                        : 'Actualiza los datos de ubicación y contacto de la sucursal.'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setAddressModal({ isOpen: false, mode: 'add', data: null })}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveAddressSubmit} className="px-5 sm:px-6 pt-4 pb-5 sm:pb-6 space-y-4 text-xs font-sans">
              
              {/* Alias / Nombre de la sucursal */}
              <div className="space-y-2">
                <label className="block font-bold text-slate-700 font-sans mb-1.5">Nombre / alias de sucursal:</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Sucursal Concepción Mayorista"
                  value={addressForm.alias}
                  onChange={(e) => setAddressForm(prev => ({ ...prev, alias: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 font-bold outline-none focus:border-[#33798C] focus:bg-white transition-all font-sans"
                />
              </div>

              {/* Row 1: Región destino * & Comuna destino * (Exact layout as in EmisionView) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                <div className="space-y-2">
                  <label className="block font-bold text-slate-700 mb-1.5">Región destino *</label>
                  <div className="relative">
                    <select
                      value={addressForm.region}
                      onChange={(e) => setAddressForm(prev => ({ ...prev, region: e.target.value }))}
                      className="w-full pl-3 pr-10 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-[#33798C] bg-white cursor-pointer font-sans appearance-none shadow-2xs"
                    >
                      <option value="Región Metropolitana">Metropolitana de Santiago</option>
                      <option value="Región del Biobío">Biobío (Concepción)</option>
                      <option value="Región de Valparaíso">Valparaíso / Viña del Mar</option>
                      <option value="Región de Coquimbo">Coquimbo / La Serena</option>
                      <option value="Región de Antofagasta">Antofagasta</option>
                      <option value="Región de La Araucanía">La Araucanía (Temuco)</option>
                      <option value="Región de Los Lagos">Los Lagos (Puerto Montt)</option>
                    </select>
                    <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#33798C] pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block font-bold text-slate-700 mb-1.5">Comuna destino *</label>
                  <div className="relative">
                    <select
                      value={addressForm.comuna}
                      onChange={(e) => setAddressForm(prev => ({ ...prev, comuna: e.target.value }))}
                      className="w-full pl-3 pr-10 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-[#33798C] bg-white cursor-pointer font-sans appearance-none shadow-2xs"
                    >
                      <option value="Providencia">Providencia</option>
                      <option value="Santiago Centro">Santiago Centro</option>
                      <option value="Las Condes">Las Condes</option>
                      <option value="Vitacura">Vitacura</option>
                      <option value="Puente Alto">Puente Alto</option>
                      <option value="San Bernardo">San Bernardo</option>
                      <option value="Pudahuel">Pudahuel</option>
                      <option value="Concepción">Concepción</option>
                      <option value="Viña del Mar">Viña del Mar</option>
                      <option value="Valparaíso">Valparaíso</option>
                      <option value="La Serena">La Serena</option>
                      <option value="Temuco">Temuco</option>
                      <option value="Antofagasta">Antofagasta</option>
                      <option value="Puerto Montt">Puerto Montt</option>
                      {addressForm.comuna && !['Providencia', 'Santiago Centro', 'Las Condes', 'Vitacura', 'Puente Alto', 'San Bernardo', 'Pudahuel', 'Concepción', 'Viña del Mar', 'Valparaíso', 'La Serena', 'Temuco', 'Antofagasta', 'Puerto Montt'].includes(addressForm.comuna) && (
                        <option value={addressForm.comuna}>{addressForm.comuna}</option>
                      )}
                    </select>
                    <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#33798C] pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Row 2: Calle / avenida * (With search icon, Ver mapa button and predictive suggestions) */}
              <div className="space-y-2 relative" ref={addressAutocompleteRef}>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block font-bold text-slate-700">Calle / avenida *</label>
                  {addressForm.isValidated && (
                    <span className="text-[10px] font-bold font-sans text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full flex items-center gap-1 animate-in fade-in duration-150">
                      <Check size={10} className="stroke-[3]" />
                      <span>Dirección validada</span>
                    </span>
                  )}
                </div>

                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Ej. Uva de la Cordillera / Av. Providencia"
                    value={addressForm.calle}
                    onFocus={() => setIsAddressSuggestionsOpen(true)}
                    onChange={(e) => {
                      setAddressForm(prev => ({ ...prev, calle: e.target.value, isValidated: false }));
                      setIsAddressSuggestionsOpen(true);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleOpenAddressConfirmModal();
                      }
                    }}
                    className="w-full pl-9 pr-24 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-[#33798C] focus:ring-1 focus:ring-[#33798C]/20 shadow-2xs font-sans font-medium"
                  />
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <button
                    type="button"
                    onClick={handleOpenAddressConfirmModal}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-[#ECF5F7] hover:bg-[#d8edf1] text-[#33798C] text-[10px] font-bold rounded font-din transition-colors cursor-pointer flex items-center gap-1"
                    title="Ver en mapa y verificar dirección"
                  >
                    <MapPin size={11} />
                    <span>Ver mapa</span>
                  </button>
                </div>

                {/* Predictive suggestions dropdown */}
                {isAddressSuggestionsOpen && (
                  <div className="absolute z-30 left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in-50 duration-150">
                    <div className="px-3 py-1.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 font-sans">
                        Sugerencias de dirección
                      </span>
                      <span className="text-[10px] text-slate-400 font-sans">
                        Haz clic para confirmar en el mapa
                      </span>
                    </div>

                    <div className="max-h-56 overflow-y-auto divide-y divide-slate-100">
                      {filteredPredictiveAddresses.map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectPredictiveAddress(item)}
                          className="w-full px-3 py-2.5 text-left flex items-start gap-3 hover:bg-[#ECF5F7]/70 transition-colors cursor-pointer group"
                        >
                          <div className="w-7 h-7 rounded-lg bg-[#ECF5F7] text-[#33798C] group-hover:bg-[#33798C] group-hover:text-white flex items-center justify-center shrink-0 mt-0.5 transition-colors">
                            <MapPin size={14} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold text-slate-800 group-hover:text-[#33798C] transition-colors truncate font-sans">
                              {item.address}
                            </div>
                            <div className="text-[11px] text-slate-400 truncate font-sans">
                              {item.comuna}, {item.regionFull}
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-[#33798C] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap self-center bg-[#ECF5F7] px-2 py-0.5 rounded font-sans">
                            Confirmar
                          </span>
                        </button>
                      ))}

                      {addressForm.calle && (
                        <button
                          type="button"
                          onClick={handleOpenAddressConfirmModal}
                          className="w-full px-3 py-2 text-left flex items-center gap-2 bg-slate-50/50 hover:bg-slate-100 text-[11px] text-slate-600 transition-colors cursor-pointer border-t border-slate-100 font-sans"
                        >
                          <Search size={12} className="text-[#33798C]" />
                          <span>Usar <strong>"{addressForm.calle}"</strong> y confirmar en el mapa</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Row 3: Número / depto / oficina / referencia */}
              <div className="space-y-2">
                <label className="block font-bold text-slate-700 mb-1.5">Número / depto / oficina / referencia</label>
                <input
                  type="text"
                  placeholder="Ej. 1420, Depto 502 (Edificio B)"
                  value={addressForm.numero}
                  onChange={(e) => setAddressForm(prev => ({ ...prev, numero: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-[#33798C] font-sans font-medium shadow-2xs"
                />
              </div>

              {/* Row 4: Contacto & Teléfono */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block font-bold text-slate-700 font-sans mb-1.5">Contacto de recepción:</label>
                  <input
                    type="text"
                    placeholder="Ej. Claudia Fuentes"
                    value={addressForm.contacto}
                    onChange={(e) => setAddressForm(prev => ({ ...prev, contacto: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-[#33798C] font-sans font-medium shadow-2xs"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block font-bold text-slate-700 font-sans mb-1.5">Teléfono contacto:</label>
                  <input
                    type="text"
                    placeholder="Ej. +56 9 6655 4433"
                    value={addressForm.telefono}
                    onChange={(e) => setAddressForm(prev => ({ ...prev, telefono: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-[#33798C] font-sans font-medium shadow-2xs"
                  />
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="pt-3 border-t border-starken-border flex items-center justify-between gap-3 w-full">
                <button
                  type="button"
                  onClick={() => setAddressModal({ isOpen: false, mode: 'add', data: null })}
                  className="btn btn-outline flex-1 cursor-pointer font-bold font-sans"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary flex-1 cursor-pointer font-bold font-sans space-x-1.5"
                >
                  <Check size={14} />
                  <span>{addressModal.mode === 'add' ? 'Agregar dirección' : 'Guardar cambios'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* ========================================================= */}
      {/* MODAL: CONFIRMA LA DIRECCIÓN (MAPA & GEORREFERENCIACIÓN) */}
      {/* EXACTAMENTE DEL MISMO TAMAÑO (max-w-lg) QUE EL ANTERIOR  */}
      {/* ========================================================= */}
      {isConfirmAddressModalOpen && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-starken-border shadow-2xl w-full max-w-lg overflow-hidden my-8 animate-in zoom-in-95 duration-150">
            
            {/* Header */}
            <div className="px-5 sm:px-6 pt-5 sm:pt-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#ECF5F7] text-[#33798C] flex items-center justify-center shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <h3 className="font-black text-base text-slate-850 font-din tracking-wide">
                      Confirma la dirección
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#33798C] font-sans mt-0.5">
                      <span>Puedes arrastrar el pin para ajustar la dirección si es necesario</span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsConfirmAddressModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Content Body */}
            <div className="px-5 sm:px-6 pt-4 pb-5 sm:pb-6 space-y-4 text-xs font-sans">
              
              {/* Search Bar + Link to Google Maps */}
              <div className="flex items-center gap-2.5">
                <form onSubmit={handleModalAddressSearch} className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Ingresa link de Google Maps o la dirección exacta"
                    value={confirmAddressData.modalSearchInput || ''}
                    onChange={(e) => setConfirmAddressData({ ...confirmAddressData, modalSearchInput: e.target.value })}
                    className="w-full pl-3 pr-9 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-sans text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#33798C] focus:bg-white transition-all shadow-2xs"
                  />
                  <button
                    type="submit"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#33798C] hover:text-[#1e4f5e] transition-colors cursor-pointer"
                    title="Buscar dirección"
                  >
                    <Search size={14} />
                  </button>
                </form>

                <a
                  href={`https://www.google.com/maps?q=${confirmAddressData.lat || -36.82699},${confirmAddressData.lng || -73.04977}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 hover:text-[#33798C] transition-colors group cursor-pointer font-sans shrink-0 whitespace-nowrap bg-slate-100 hover:bg-slate-200/70 px-2.5 py-2 rounded-lg border border-slate-200"
                >
                  <img 
                    src="/google_maps_icon.png" 
                    alt="Google Maps" 
                    className="w-3 h-4 object-contain shrink-0 drop-shadow-2xs" 
                  />
                  <span className="group-hover:underline hidden sm:inline">Ver en Google Maps</span>
                </a>
              </div>

              {/* Interactive Vector Map Container */}
              <div 
                onClick={handleMapClick}
                className="relative w-full h-64 sm:h-72 rounded-xl border border-slate-200 overflow-hidden bg-[#e5ecef] cursor-crosshair select-none shadow-inner"
              >
                {/* Scalable Vector Cartography */}
                <div 
                  className="w-full h-full transition-transform duration-200 ease-out"
                  style={{ 
                    transform: `scale(${addressModalZoom})`, 
                    transformOrigin: `${confirmAddressData.pinPercent?.x || 50}% ${confirmAddressData.pinPercent?.y || 42}%` 
                  }}
                >
                  <svg 
                    viewBox="0 0 800 500" 
                    className="w-full h-full object-cover" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="800" height="500" fill="#f0f3f2" />

                    {/* Residential / Urban Blocks */}
                    <rect x="30" y="30" width="180" height="120" rx="6" fill="#e8eceb" />
                    <rect x="240" y="30" width="160" height="100" rx="6" fill="#e8eceb" />
                    <rect x="430" y="40" width="220" height="110" rx="6" fill="#e8eceb" />
                    <rect x="40" y="180" width="170" height="140" rx="6" fill="#e8eceb" />
                    <rect x="420" y="180" width="180" height="130" rx="6" fill="#e8eceb" />
                    <rect x="630" y="160" width="140" height="150" rx="6" fill="#e8eceb" />
                    <rect x="50" y="350" width="190" height="120" rx="6" fill="#e8eceb" />
                    <rect x="270" y="330" width="160" height="140" rx="6" fill="#e8eceb" />
                    <rect x="460" y="340" width="200" height="120" rx="6" fill="#e8eceb" />

                    {/* Parks / Green Zones */}
                    <path d="M 230 160 Q 300 150 360 190 Q 380 240 330 280 Q 260 270 230 220 Z" fill="#d4edda" stroke="#c3e6cb" strokeWidth="2" />
                    <rect x="670" y="30" width="100" height="100" rx="8" fill="#d4edda" stroke="#c3e6cb" strokeWidth="1" />
                    <circle cx="300" cy="210" r="4" fill="#52b788" opacity="0.6" />
                    <circle cx="330" cy="230" r="5" fill="#52b788" opacity="0.6" />
                    <circle cx="270" cy="220" r="4" fill="#52b788" opacity="0.6" />
                    <text x="300" y="250" fontSize="10" fill="#2d6a4f" fontWeight="bold" textAnchor="middle" opacity="0.7">Plaza de Armas</text>

                    {/* River / Water Stream */}
                    <path d="M 0 320 Q 200 350 400 300 T 800 290" fill="none" stroke="#b8e2f2" strokeWidth="26" strokeLinecap="round" />
                    <path d="M 0 320 Q 200 350 400 300 T 800 290" fill="none" stroke="#90cdf4" strokeWidth="16" strokeLinecap="round" opacity="0.5" />

                    {/* Secondary Roads Grid */}
                    <line x1="0" y1="90" x2="800" y2="90" stroke="#ffffff" strokeWidth="7" />
                    <line x1="0" y1="90" x2="800" y2="90" stroke="#cbd5e1" strokeWidth="1" />

                    <line x1="0" y1="210" x2="800" y2="210" stroke="#ffffff" strokeWidth="7" />
                    <line x1="0" y1="210" x2="800" y2="210" stroke="#cbd5e1" strokeWidth="1" />

                    <line x1="0" y1="410" x2="800" y2="410" stroke="#ffffff" strokeWidth="7" />
                    <line x1="0" y1="410" x2="800" y2="410" stroke="#cbd5e1" strokeWidth="1" />

                    <line x1="120" y1="0" x2="120" y2="500" stroke="#ffffff" strokeWidth="7" />
                    <line x1="120" y1="0" x2="120" y2="500" stroke="#cbd5e1" strokeWidth="1" />

                    <line x1="320" y1="0" x2="320" y2="500" stroke="#ffffff" strokeWidth="7" />
                    <line x1="320" y1="0" x2="320" y2="500" stroke="#cbd5e1" strokeWidth="1" />

                    <line x1="520" y1="0" x2="520" y2="500" stroke="#ffffff" strokeWidth="7" />
                    <line x1="520" y1="0" x2="520" y2="500" stroke="#cbd5e1" strokeWidth="1" />

                    <line x1="700" y1="0" x2="700" y2="500" stroke="#ffffff" strokeWidth="7" />
                    <line x1="700" y1="0" x2="700" y2="500" stroke="#cbd5e1" strokeWidth="1" />

                    {/* Arteries */}
                    <line x1="80" y1="0" x2="550" y2="500" stroke="#fef08a" strokeWidth="11" strokeLinecap="round" />
                    <line x1="0" y1="150" x2="800" y2="150" stroke="#fed7aa" strokeWidth="10" />
                    
                    {/* Street Labels */}
                    <text x="360" y="85" fontSize="10" fill="#64748b" fontWeight="600">Av. Bernardo O'Higgins</text>
                    <text x="210" y="270" fontSize="10" fill="#64748b" fontWeight="600" transform="rotate(45 210, 270)">Av. Los Carrera</text>
                    <text x="535" y="205" fontSize="10" fill="#33798C" fontWeight="bold">Barros Arana</text>
                    <text x="60" y="405" fontSize="10" fill="#64748b" fontWeight="600">Av. Paicaví</text>
                  </svg>
                </div>

                {/* Zoom controls */}
                <div 
                  className="absolute top-2.5 left-2.5 z-20 flex flex-col bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button 
                    type="button" 
                    onClick={() => setAddressModalZoom(prev => Math.min(prev + 0.3, 2.5))}
                    className="w-7 h-7 flex items-center justify-center text-slate-700 hover:bg-slate-100 font-bold border-b border-slate-100 transition-colors cursor-pointer"
                    title="Acercar"
                  >
                    <Plus size={14} />
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setAddressModalZoom(prev => Math.max(prev - 0.3, 0.7))}
                    className="w-7 h-7 flex items-center justify-center text-slate-700 hover:bg-slate-100 font-bold transition-colors cursor-pointer"
                    title="Alejar"
                  >
                    <Minus size={14} />
                  </button>
                </div>

                {/* Droplet Pin */}
                <div 
                  className="absolute z-20 pointer-events-none transition-all duration-150 -translate-x-1/2 -translate-y-full flex flex-col items-center select-none"
                  style={{
                    left: `${confirmAddressData.pinPercent?.x || 50}%`,
                    top: `${confirmAddressData.pinPercent?.y || 42}%`
                  }}
                >
                  <div className="relative flex items-center justify-center drop-shadow-md">
                    <svg width="38" height="46" viewBox="0 0 40 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 0C8.954 0 0 8.954 0 20C0 32.5 17.5 46.5 19.1 47.8C19.6 48.2 20.4 48.2 20.9 47.8C22.5 46.5 40 32.5 40 20C40 8.954 31.046 0 20 0Z" fill="#33798C"/>
                      <circle cx="20" cy="19" r="13" fill="white"/>
                    </svg>
                    <div className="absolute top-[9px] text-[#33798C]">
                      <Home size={16} strokeWidth={2.4} />
                    </div>
                  </div>
                  <div className="w-4 h-1.5 bg-black/25 rounded-full blur-[1px] -mt-1"></div>
                </div>

                {/* Coordinates Pill */}
                <div 
                  className="absolute bottom-2.5 left-2.5 z-20 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-md shadow-xs border border-slate-200 text-[10px] font-mono text-slate-700 font-medium flex items-center gap-1.5 select-all"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span>Y: {confirmAddressData.lat ? confirmAddressData.lat.toFixed(5) : '-36.82699'}</span>
                  <span className="text-slate-300">|</span>
                  <span>X: {confirmAddressData.lng ? confirmAddressData.lng.toFixed(5) : '-73.04977'}</span>
                </div>

                {/* Leaflet pill */}
                <div 
                  className="absolute bottom-2.5 right-2.5 z-20 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded text-[9px] text-slate-500 font-sans flex items-center gap-1 shadow-2xs border border-slate-200/80"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="inline-block w-2 h-1 bg-sky-500 rounded-2xs"></span>
                  <span className="inline-block w-2 h-1 bg-amber-400 rounded-2xs -ml-0.5"></span>
                  <span className="font-semibold text-slate-600">Leaflet</span>
                </div>
              </div>

              {/* Address Summary Box */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-[#ECF5F7] border border-[#C2DFE7] flex items-center justify-center text-[#33798C] shrink-0">
                    <MapPin size={14} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-black text-slate-900 font-sans truncate">
                      {confirmAddressData.street || confirmAddressData.address}, {confirmAddressData.comuna}
                    </div>
                    <div className="text-[11px] text-slate-500 font-sans font-medium truncate">
                      {confirmAddressData.regionFull || confirmAddressData.region}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-sans text-slate-700 shrink-0">
                  <Mail size={13} className="text-slate-500" />
                  <span className="font-bold text-[11px]">CP:</span>
                  <span className="bg-sky-50 text-sky-700 font-bold px-2 py-0.5 rounded text-[11px] font-mono border border-sky-100">
                    {confirmAddressData.postalCode || '4030000'}
                  </span>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="w-full flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsConfirmAddressModalOpen(false)}
                  className="btn btn-outline flex-1 cursor-pointer font-bold font-sans"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveConfirmedAddress}
                  className="btn btn-primary flex-1 cursor-pointer font-bold font-sans"
                >
                  Guardar dirección
                </button>
              </div>

            </div>

          </div>
        </div>,
        document.body
      )}



    </header>
  );
}
