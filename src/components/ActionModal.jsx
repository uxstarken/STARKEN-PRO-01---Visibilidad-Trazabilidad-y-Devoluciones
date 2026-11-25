import React, { useState, useEffect } from 'react';
import { X, Check, MapPin, Truck, RotateCcw, AlertCircle, Edit, DollarSign, FileText } from 'lucide-react';

function CustomSelect({ value, onChange, options, placeholder, className = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const selectedOpt = options.find(opt => opt.value === value);

  return (
    <div ref={dropdownRef} className={`relative text-left w-full ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-white border ${
          isOpen ? 'border-[#33798C] ring-2 ring-[#33798C]/20' : 'border-slate-200'
        } rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-slate-800 font-sans outline-none cursor-pointer transition-all flex items-center justify-between min-h-[40px] select-none shadow-xs hover:border-[#33798C]/60`}
      >
        <span className="truncate font-semibold">
          {selectedOpt ? selectedOpt.label : placeholder}
        </span>
        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="#33798C"
            strokeWidth="2.5"
            className={`w-4 h-4 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-30 py-1.5 max-h-52 overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-150">
          {options.map((opt) => {
            const isSelected = value === opt.value;
            return (
              <div
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`px-4 py-2.5 text-xs font-sans cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-[#33798C] text-white font-bold'
                    : 'text-slate-800 hover:bg-[#ECF5F7] hover:text-[#33798C]'
                }`}
              >
                {opt.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const getPreFilledData = (id) => {
  const defaultData = {
    275161618: {
      nombre: 'JERALDIN ALEJANDRA P',
      rut: '15.688.949-0',
      telefono: '976921527',
      email: 'INFO@SWISSTRADINGGROUP.UK',
      tipoEnvio: 'domicilio',
      region: 'Región de Antofagasta',
      comuna: 'Antofagasta',
      ciudad: 'Antofagasta',
      direccion: 'ROSALES',
      numeracion: '3436',
      casaDepto: 'Casa',
      cuentaCorriente: '44380',
      centroCosto: '0',
      apellidoPaterno: '.',
      apellidoMaterno: '.'
    },
    275067401: {
      nombre: 'Juan Carlos Espinoza',
      rut: '16.745.234-K',
      telefono: '958579337',
      email: 'Jcespinozah60@gmail.com',
      tipoEnvio: 'domicilio',
      region: 'Región Metropolitana De Santiago',
      comuna: 'Santiago',
      ciudad: 'Santiago',
      direccion: 'Pupilla',
      numeracion: '01594',
      casaDepto: 'Departamento',
      cuentaCorriente: '44380',
      centroCosto: '0',
      apellidoPaterno: '.',
      apellidoMaterno: '.'
    },
    275105257: {
      nombre: 'Luis Humberto Lucero',
      rut: '12.890.456-2',
      telefono: '988204005',
      email: 'Info@swisstradinggroup.uk',
      tipoEnvio: 'domicilio',
      region: 'Región Metropolitana De Santiago',
      comuna: 'Santiago Centro',
      ciudad: 'Santiago',
      direccion: 'Pasaje 62',
      numeracion: '62',
      casaDepto: 'Casa',
      cuentaCorriente: '44380',
      centroCosto: '0',
      apellidoPaterno: '.',
      apellidoMaterno: '.'
    }
  };

  if (defaultData[id]) return defaultData[id];

  return {
    nombre: `Cliente Genérico ${id}`,
    rut: '19.876.543-2',
    telefono: '987654321',
    email: 'cliente@swisstrading.cl',
    tipoEnvio: 'domicilio',
    region: 'Región Metropolitana De Santiago',
    comuna: 'Santiago Centro',
    ciudad: 'Santiago',
    direccion: 'Av. Libertador Bernardo O\'Higgins',
    numeracion: '1414',
    casaDepto: 'Casa',
    cuentaCorriente: '44380',
    centroCosto: '0',
    apellidoPaterno: '.',
    apellidoMaterno: '.'
  };
};

export default function ActionModal({ isOpen, onClose, actionType, selectedIds, onConfirm }) {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');
  const [bodegaDestino, setBodegaDestino] = useState('misma');
  const [showTarifas, setShowTarifas] = useState(false);

  const [wizardStep, setWizardStep] = useState('decision');
  const [selectedOption, setSelectedOption] = useState('');
  const [originFlow, setOriginFlow] = useState('gestionar');

  useEffect(() => {
    setError('');
    setBodegaDestino('misma');
    setShowTarifas(false);
    setSelectedOption('');

    if (isOpen && selectedIds && selectedIds.length > 0) {
      const id = selectedIds[0];
      setFormData(getPreFilledData(id));
      
      if (actionType === 'gestionar') {
        setWizardStep('decision');
      } else if (actionType === 'devolver') {
        setWizardStep('devolver_bodega');
      } else if (actionType === 'reparto') {
        setWizardStep('confirmar_reparto');
      } else {
        setWizardStep('editar_personales');
      }
    } else {
      setFormData({});
      setWizardStep('decision');
    }
  }, [actionType, isOpen, selectedIds]);

  if (!isOpen) return null;

  const handleFinalSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setError('');
    
    if (wizardStep === 'confirmar_reparto') {
      onConfirm('reparto', selectedIds, formData);
    } else if (wizardStep === 'devolver_bodega') {
      const cc = formData.cuentaCorriente ?? '';
      const costo = formData.centroCosto ?? '';
      if (cc === '' || costo === '') {
        setError('Por favor completa los campos Cuenta Corriente y Centro de Costo.');
        return;
      }
      if (bodegaDestino === 'otra') {
        if (!formData.region || !formData.ciudad || !formData.comuna || !formData.direccion || !formData.numeracion || !formData.casaDepto) {
          setError('Por favor completa todos los campos requeridos (*) de la bodega de destino.');
          return;
        }
      }
      if (!showTarifas) {
        setError('Por favor cotiza la tarifa de devolución primero.');
        return;
      }
      onConfirm('devolver', selectedIds, formData);
    }
  };

  const handleDecisionNext = () => {
    if (!selectedOption) {
      setError('Por favor selecciona una gestión para continuar.');
      return;
    }
    setError('');
    
    if (selectedOption === 'editar') {
      setOriginFlow('editar');
      setWizardStep('editar_personales');
    } else if (selectedOption === 'reparto') {
      setOriginFlow('reparto');
      setWizardStep('confirmar_reparto');
    } else if (selectedOption === 'devolver') {
      setOriginFlow('devolver');
      setWizardStep('devolver_bodega');
    }
  };

  const handlePersonalesNext = () => {
    if (!formData.nombre || !formData.rut || !formData.telefono || !formData.email || !formData.apellidoPaterno || !formData.apellidoMaterno) {
      setError('Por favor completa los campos requeridos (*).');
      return;
    }
    setError('');
    setWizardStep('editar_direccion');
  };

  const handleDireccionNext = () => {
    if (!formData.region || !formData.ciudad || !formData.comuna || !formData.direccion || !formData.numeracion || !formData.casaDepto || !formData.cuentaCorriente || !formData.centroCosto) {
      setError('Por favor completa los campos requeridos (*).');
      return;
    }
    setError('');
    
    if (originFlow === 'reparto') {
      setWizardStep('confirmar_reparto');
    } else {
      onConfirm('redestinar', selectedIds, formData);
    }
  };

  const handleObtenerTarifa = () => {
    const cc = formData.cuentaCorriente ?? '';
    const costo = formData.centroCosto ?? '';
    if (cc === '' || costo === '') {
      setError('Por favor selecciona los campos Cuenta Corriente y Centro de Costo antes de cotizar.');
      return;
    }
    if (bodegaDestino === 'otra') {
      if (!formData.region || !formData.ciudad || !formData.comuna || !formData.direccion || !formData.numeracion || !formData.casaDepto) {
        setError('Por favor completa todos los campos requeridos (*) de la bodega de destino.');
        return;
      }
    }
    setError('');
    setShowTarifas(true);
  };

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const renderModalContent = () => {
    switch (wizardStep) {
      case 'decision':
        return (
          <div className="flex flex-col items-center justify-center pt-1 pb-2 text-center space-y-3 transition-opacity duration-150">
            <div className="w-full text-left">
              <h4 className="text-xs font-bold text-slate-700 font-sans">
                ¿Qué gestión deseas realizar con esta orden?
              </h4>
            </div>

            {/* Visual Action Selection Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-lg mt-1 text-left">
              <div
                onClick={() => setSelectedOption('editar')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                  selectedOption === 'editar'
                    ? 'border-[#33798C] bg-[#ECF5F7] ring-2 ring-[#33798C]/20 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-[#33798C]/50 hover:bg-slate-50/70'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-[#ECF5F7] text-[#33798C] flex items-center justify-center">
                  <MapPin size={20} />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 font-din">Redestinación</div>
                  <div className="text-[11px] text-slate-500 font-medium font-sans mt-0.5">Editar dirección o destinatario</div>
                </div>
              </div>

              <div
                onClick={() => setSelectedOption('reparto')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                  selectedOption === 'reparto'
                    ? 'border-[#33798C] bg-[#ECF5F7] ring-2 ring-[#33798C]/20 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-[#33798C]/50 hover:bg-slate-50/70'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] text-[#10B981] flex items-center justify-center">
                  <Truck size={20} />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 font-din">Sacar a reparto</div>
                  <div className="text-[11px] text-slate-500 font-medium font-sans mt-0.5">Confirmar salida a reparto</div>
                </div>
              </div>

              <div
                onClick={() => setSelectedOption('devolver')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                  selectedOption === 'devolver'
                    ? 'border-[#33798C] bg-[#ECF5F7] ring-2 ring-[#33798C]/20 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-[#33798C]/50 hover:bg-slate-50/70'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-[#FFFBEB] text-[#F59E0B] flex items-center justify-center">
                  <RotateCcw size={20} />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 font-din">Devolver</div>
                  <div className="text-[11px] text-slate-500 font-medium font-sans mt-0.5">Retornar a bodega de origen</div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'editar_personales':
        return (
          <div className="transition-opacity duration-150 space-y-4">
            <div>
              <h5 className="text-xs font-bold text-slate-500 font-sans">
                Editar Datos de OF Destinatario: <span className="font-black text-slate-850 font-din">{formData.nombre}</span>
              </h5>

              {/* Tabs header row */}
              <div className="flex border-b border-slate-100 pb-2 mt-2 text-xs font-bold font-sans">
                <button
                  type="button"
                  className="px-4 py-2 bg-[#33798C] text-white rounded-xl transition-colors cursor-pointer mr-2 font-din tracking-wide text-xs shadow-xs"
                >
                  Datos personales
                </button>
                <button
                  type="button"
                  onClick={handlePersonalesNext}
                  className="px-4 py-2 border border-slate-200 text-slate-500 hover:bg-[#ECF5F7] hover:text-[#33798C] rounded-xl transition-colors cursor-pointer font-din tracking-wide text-xs"
                >
                  Dirección
                </button>
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans text-slate-700">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1.5 font-sans">
                  <span className="text-red-500 mr-0.5">*</span> RUT
                </label>
                <input
                  type="text"
                  required
                  value={formData.rut || ''}
                  onChange={(e) => handleChange('rut', e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-[#33798C] focus:ring-2 focus:ring-[#33798C]/20 transition font-sans font-medium shadow-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-600 mb-1.5 font-din">
                  <span className="text-red-500 mr-0.5">*</span> Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email || ''}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-[#33798C] focus:ring-2 focus:ring-[#33798C]/20 transition shadow-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-600 mb-1.5 font-din">
                  <span className="text-red-500 mr-0.5">*</span> Nombre
                </label>
                <input
                  type="text"
                  required
                  value={formData.nombre || ''}
                  onChange={(e) => handleChange('nombre', e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-[#33798C] focus:ring-2 focus:ring-[#33798C]/20 transition shadow-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-600 mb-1.5 font-din">
                  <span className="text-red-500 mr-0.5">*</span> Apellido paterno
                </label>
                <input
                  type="text"
                  required
                  value={formData.apellidoPaterno || ''}
                  onChange={(e) => handleChange('apellidoPaterno', e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-[#33798C] focus:ring-2 focus:ring-[#33798C]/20 transition shadow-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1.5 font-sans">
                  <span className="text-red-500 mr-0.5">*</span> Teléfono
                </label>
                <input
                  type="text"
                  required
                  value={formData.telefono || ''}
                  onChange={(e) => handleChange('telefono', e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-[#33798C] focus:ring-2 focus:ring-[#33798C]/20 transition font-sans font-medium shadow-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1.5 font-sans">
                  <span className="text-red-500 mr-0.5">*</span> Apellido materno
                </label>
                <input
                  type="text"
                  required
                  value={formData.apellidoMaterno || ''}
                  onChange={(e) => handleChange('apellidoMaterno', e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-[#33798C] focus:ring-2 focus:ring-[#33798C]/20 transition shadow-xs"
                />
              </div>
            </div>
          </div>
        );

      case 'editar_direccion':
        return (
          <div className="transition-opacity duration-150 space-y-4">
            <div>
              <h5 className="text-xs font-bold text-slate-500 font-sans">
                Editar Datos de OF Destinatario: <span className="font-black text-slate-850 font-din">{formData.nombre}</span>
              </h5>

              {/* Tabs header row */}
              <div className="flex border-b border-slate-100 pb-2 mt-2 text-xs font-bold font-sans">
                <button
                  type="button"
                  onClick={() => setWizardStep('editar_personales')}
                  className="px-4 py-2 border border-slate-200 text-slate-500 hover:bg-[#ECF5F7] hover:text-[#33798C] rounded-xl transition-colors cursor-pointer mr-2 font-din tracking-wide text-xs"
                >
                  Datos personales
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-[#33798C] text-white rounded-xl transition-colors cursor-pointer font-din tracking-wide text-xs shadow-xs"
                >
                  Dirección
                </button>
              </div>
            </div>

            {/* Radio buttons: Envío a domicilio / Envío a sucursal */}
            <div className="flex items-center space-x-6 text-xs font-bold font-sans text-slate-700">
              <span className="text-[11px] font-bold text-slate-600 font-sans">Tipo de entrega:</span>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="tipoEnvio" 
                  value="domicilio"
                  checked={formData.tipoEnvio !== 'sucursal'}
                  onChange={() => handleChange('tipoEnvio', 'domicilio')}
                  className="text-[#33798C] accent-[#33798C] w-4 h-4"
                />
                <span className="text-slate-800 font-semibold">Envío a domicilio</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="tipoEnvio" 
                  value="sucursal"
                  checked={formData.tipoEnvio === 'sucursal'}
                  onChange={() => handleChange('tipoEnvio', 'sucursal')}
                  className="text-[#33798C] accent-[#33798C] w-4 h-4"
                />
                <span className="text-slate-800 font-semibold">Envío a sucursal</span>
              </label>
            </div>

            {/* Address Form */}
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1.5 font-sans">
                  <span className="text-red-500 mr-0.5">*</span> Región
                </label>
                <CustomSelect
                  value={formData.region || ''}
                  onChange={(val) => handleChange('region', val)}
                  placeholder="Selecciona región"
                  options={[
                    { value: 'Región de Antofagasta', label: 'Región de Antofagasta' },
                    { value: 'Región Metropolitana De Santiago', label: 'Región Metropolitana De Santiago' }
                  ]}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1.5 font-sans">
                      <span className="text-red-500 mr-0.5">*</span> Comuna
                    </label>
                    <CustomSelect
                      value={formData.comuna || ''}
                      onChange={(val) => handleChange('comuna', val)}
                      placeholder="Selecciona comuna"
                      options={[
                        { value: 'Antofagasta', label: 'Antofagasta' },
                        { value: 'Santiago', label: 'Santiago' },
                        { value: 'Santiago Centro', label: 'Santiago Centro' }
                      ]}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1.5 font-sans">
                      <span className="text-red-500 mr-0.5">*</span> Numeración
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. 3436"
                      value={formData.numeracion || ''}
                      onChange={(e) => handleChange('numeracion', e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-[#33798C] focus:ring-2 focus:ring-[#33798C]/20 transition min-h-[40px] shadow-xs font-sans font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1.5 font-sans">
                      <span className="text-red-500 mr-0.5">*</span> Ciudad
                    </label>
                    <CustomSelect
                      value={formData.ciudad || ''}
                      onChange={(val) => handleChange('ciudad', val)}
                      placeholder="Selecciona ciudad"
                      options={[
                        { value: 'Antofagasta', label: 'Antofagasta' },
                        { value: 'Santiago', label: 'Santiago' }
                      ]}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1.5 font-sans">
                      <span className="text-red-500 mr-0.5">*</span> Dirección
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. ROSALES"
                      value={formData.direccion || ''}
                      onChange={(e) => handleChange('direccion', e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-[#33798C] focus:ring-2 focus:ring-[#33798C]/20 transition min-h-[40px] shadow-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Account details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#ECF5F7]/40 border border-[#C2DFE7]/60 rounded-2xl p-4 mt-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1.5 font-sans">
                    <span className="text-red-500 mr-0.5">*</span> Cuenta corriente
                  </label>
                  <CustomSelect
                    value={formData.cuentaCorriente || ''}
                    onChange={(val) => handleChange('cuentaCorriente', val)}
                    placeholder="Selecciona cuenta corriente"
                    options={[
                      { value: '44380', label: '44380' }
                    ]}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1.5 font-sans">
                    <span className="text-red-500 mr-0.5">*</span> Centro de costo
                  </label>
                  <CustomSelect
                    value={formData.centroCosto || ''}
                    onChange={(val) => handleChange('centroCosto', val)}
                    placeholder="Selecciona centro de costo"
                    options={[
                      { value: '0', label: '0' }
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'confirmar_reparto':
        return (
          <div className="transition-opacity duration-150 space-y-3">
            <h5 className="text-xs font-bold text-slate-500 font-sans">
              Confirmar datos del destinatario para autorizar la salida a reparto:
            </h5>

            {/* Recipient verified details grid */}
            <div className="space-y-1 font-sans text-xs border border-starken-border rounded-2xl overflow-hidden bg-white shadow-xs">
              <div className="flex items-center py-2.5 px-4 bg-[#F0F6F8]">
                <span className="w-1/3 text-slate-500 font-din text-[11px]">Nombre completo</span>
                <span className="w-2/3 text-slate-800 font-bold">
                  {formData.nombre} {formData.apellidoPaterno === '.' ? '' : formData.apellidoPaterno || ''}
                </span>
              </div>
              <div className="flex items-center py-2.5 px-4 bg-white">
                <span className="w-1/3 text-slate-500 font-din text-[11px]">RUT</span>
                <span className="w-2/3 text-slate-800 font-bold font-din">
                  {formData.rut || '0'}
                </span>
              </div>
              <div className="flex items-center py-2.5 px-4 bg-[#F0F6F8]">
                <span className="w-1/3 text-slate-500 font-din text-[11px]">Teléfono</span>
                <span className="w-2/3 text-slate-800 font-bold font-din">
                  {formData.telefono}
                </span>
              </div>
              <div className="flex items-center py-2.5 px-4 bg-white">
                <span className="w-1/3 text-slate-500 font-din text-[11px]">Email</span>
                <span className="w-2/3 text-slate-800 font-bold truncate">
                  {formData.email}
                </span>
              </div>
              <div className="flex items-center py-2.5 px-4 bg-[#F0F6F8]">
                <span className="w-1/3 text-slate-500 font-din text-[11px]">Dirección de entrega</span>
                <span className="w-2/3 text-slate-800 font-bold">
                  {formData.direccion} {formData.numeracion}, {formData.comuna}
                </span>
              </div>
            </div>
          </div>
        );

      case 'devolver_bodega':
        return (
          <div className="transition-opacity duration-150 space-y-4">
            <h5 className="text-xs font-bold text-slate-500 font-sans">
              Configura los detalles de devolución para retorno a bodega:
            </h5>

            {/* Warehouse selection radio buttons */}
            <div className="flex items-center space-x-6 text-xs font-bold font-sans text-slate-700">
              <span className="text-[11px] font-bold text-slate-600 font-sans">Bodega de destino:</span>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="bodegaDestino"
                  value="misma"
                  checked={bodegaDestino === 'misma'}
                  onChange={() => setBodegaDestino('misma')}
                  className="text-[#33798C] accent-[#33798C] w-4 h-4"
                />
                <span className="text-slate-800 font-semibold">Misma bodega de origen</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="bodegaDestino"
                  value="otra"
                  checked={bodegaDestino === 'otra'}
                  onChange={() => setBodegaDestino('otra')}
                  className="text-[#33798C] accent-[#33798C] w-4 h-4"
                />
                <span className="text-slate-800 font-semibold">Otra bodega de devolución</span>
              </label>
            </div>

            {/* Account & Cost Center row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#ECF5F7]/40 border border-[#C2DFE7]/60 rounded-2xl p-4">
              <div>
                <label className="block text-[11px] font-black text-slate-600 mb-1.5 font-din">
                  <span className="text-red-500 mr-0.5">*</span> Cuenta corriente
                </label>
                <CustomSelect
                  value={formData.cuentaCorriente || ''}
                  onChange={(val) => handleChange('cuentaCorriente', val)}
                  placeholder="Selecciona cuenta corriente"
                  options={[
                    { value: '44380', label: '44380' }
                  ]}
                />
              </div>
              <div>
                <label className="block text-[11px] font-black text-slate-600 mb-1.5 font-din">
                  <span className="text-red-500 mr-0.5">*</span> Centro de costo
                </label>
                <CustomSelect
                  value={formData.centroCosto || ''}
                  onChange={(val) => handleChange('centroCosto', val)}
                  placeholder="Selecciona centro de costo"
                  options={[
                    { value: '0', label: '0' }
                  ]}
                />
              </div>
            </div>

            {/* Live Tariff Breakdown Receipt */}
            {showTarifas && (
              <div className="bg-[#ECF5F7] border border-[#C2DFE7] rounded-2xl p-4 space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-[#C2DFE7] pb-2">
                  <span className="text-xs font-bold text-[#1e4f5e] font-sans">Desglose de tarifas de retorno</span>
                  <span className="text-[11px] font-bold text-slate-500 font-sans">Cotización oficial</span>
                </div>
                <div className="space-y-1.5 text-xs text-slate-700 font-sans">
                  <div className="flex justify-between items-center">
                    <span>Costo envío original:</span>
                    <span className="font-bold font-din">$8.408</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Costo retorno a bodega:</span>
                    <span className="font-bold font-din">$8.580</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-[#C2DFE7] text-slate-900 font-black">
                    <span className="font-din">Total a facturar:</span>
                    <span className="text-base text-[#33798C] font-din">$16.988</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const getFooterButtons = () => {
    switch (wizardStep) {
      case 'decision':
        return (
          <div className="w-full flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline flex-1"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleDecisionNext}
              className="btn btn-primary flex-1"
            >
              Continuar
            </button>
          </div>
        );

      case 'editar_personales':
        return (
          <div className="w-full flex items-center space-x-3">
            <button
              type="button"
              onClick={() => setWizardStep('decision')}
              className="btn btn-outline flex-1"
            >
              Atrás
            </button>
            <button
              type="button"
              onClick={handlePersonalesNext}
              className="btn btn-primary flex-1"
            >
              <span>Siguiente</span>
            </button>
          </div>
        );

      case 'editar_direccion':
        return (
          <div className="w-full flex items-center space-x-3">
            <button
              type="button"
              onClick={() => setWizardStep('editar_personales')}
              className="btn btn-outline flex-1"
            >
              Atrás
            </button>
            <button
              type="button"
              onClick={handleDireccionNext}
              className="btn btn-primary flex-1"
            >
              <span>Confirmar redestinación</span>
            </button>
          </div>
        );

      case 'confirmar_reparto':
        return (
          <div className="w-full flex items-center space-x-3">
            <button
              type="button"
              onClick={() => {
                setOriginFlow('reparto');
                setWizardStep('editar_personales');
              }}
              className="btn btn-outline flex-1"
            >
              Editar datos
            </button>
            <button
              type="button"
              onClick={handleFinalSubmit}
              className="btn btn-primary flex-1"
            >
              Confirmar salida a reparto
            </button>
          </div>
        );

      case 'devolver_bodega':
        return (
          <div className="w-full flex items-center space-x-3">
            <button
              type="button"
              onClick={() => {
                if (actionType === 'gestionar') {
                  setWizardStep('decision');
                } else {
                  onClose();
                }
              }}
              className="btn btn-outline flex-1"
            >
              {actionType === 'gestionar' ? 'Atrás' : 'Cancelar'}
            </button>
            {showTarifas ? (
              <button
                type="button"
                onClick={handleFinalSubmit}
                className="btn btn-primary flex-1 space-x-1.5"
              >
                <Check size={16} />
                <span>Confirmar retorno</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleObtenerTarifa}
                className="btn btn-primary flex-1 space-x-1.5"
              >
                <DollarSign size={14} />
                <span>Obtener tarifa de devolución</span>
              </button>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark overlay backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog Body with Empresas B2B styling */}
      <div className={`bg-white rounded-3xl shadow-2xl border border-starken-border w-full z-10 overflow-hidden relative flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-200 transition-all ${wizardStep === 'devolver_bodega' || wizardStep === 'editar_direccion' || wizardStep === 'editar_personales' ? 'max-w-2xl' : 'max-w-lg'}`}>
        
        {/* FIXED HEADER HOMOLOGADO */}
        <div className="bg-white px-6 pt-5 pb-4 border-b border-slate-200 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-[#ECF5F7] text-[#33798C] border border-[#33798C]/20 flex items-center justify-center shrink-0 shadow-xs">
                {wizardStep === 'devolver_bodega' ? (
                  <RotateCcw size={20} />
                ) : wizardStep === 'confirmar_reparto' ? (
                  <Truck size={20} />
                ) : (
                  <FileText size={20} />
                )}
              </div>
              <div>
                <h3 className="font-black text-base sm:text-lg text-slate-850 font-din tracking-wide">
                  {wizardStep === 'devolver_bodega' ? 'Devolución masiva a bodega' : `Nº OF ${selectedIds[0]} — Gestión de excepción`}
                </h3>
                <p className="text-xs text-slate-500 font-sans mt-0.5">
                  {wizardStep === 'decision'
                    ? 'Selecciona la acción para resolver la excepción de la orden'
                    : wizardStep === 'devolver_bodega'
                    ? 'Retorno a centro logístico de origen o bodega alterna'
                    : wizardStep === 'confirmar_reparto'
                    ? 'Confirmar nuevo intento de entrega a domicilio'
                    : 'Actualización de datos del destinatario y entrega'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* SCROLLABLE BODY */}
        <div className="flex-1 overflow-y-auto py-5 px-6">
          {renderModalContent()}
          
          {error && (
            <div className="mt-4 flex items-center space-x-2 bg-red-50 text-red-700 text-xs font-semibold px-4 py-3 rounded-xl border border-red-200 animate-in fade-in slide-in-from-top-1 duration-200 font-sans">
              <AlertCircle size={15} className="shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* FIXED FOOTER */}
        <div className={`py-4 px-6 border-t border-slate-100 bg-white shrink-0 ${wizardStep === 'decision' ? 'rounded-b-3xl' : ''}`}>
          {getFooterButtons()}
        </div>
      </div>
    </div>
  );
}
