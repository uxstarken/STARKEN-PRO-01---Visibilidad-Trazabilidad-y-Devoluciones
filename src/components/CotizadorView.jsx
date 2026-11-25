import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  ChevronDown, 
  Building2, 
  Truck, 
  CheckCircle2, 
  Package, 
  Sparkles,
  Zap,
  Info
} from 'lucide-react';

export default function CotizadorView({ selectedAccount, showToast, onSelectTariffForEmission }) {
  // Cotizador state
  const [quoteOrigin, setQuoteOrigin] = useState('San Bernardo');
  const [quoteDestination, setQuoteDestination] = useState('Concepción');
  const [quoteWeight, setQuoteWeight] = useState(3.0);
  const [quoteLength, setQuoteLength] = useState(30);
  const [quoteWidth, setQuoteWidth] = useState(20);
  const [quoteHeight, setQuoteHeight] = useState(15);
  const [quoteDeclaredValue, setQuoteDeclaredValue] = useState(100000);
  const [selectedTariffKey, setSelectedTariffKey] = useState('sucursal');

  // Live calculation for cotizador
  const calculatedQuote = useMemo(() => {
    // 1. Calculate Volumetric Weight and Billable Weight
    const length = Number(quoteLength) || 10;
    const width = Number(quoteWidth) || 10;
    const height = Number(quoteHeight) || 10;
    const physicalWeight = Number(quoteWeight) || 1;
    
    // Starken formula: (L x W x H in cm) / 4000
    const volumetricWeight = (length * width * height) / 4000;
    const finalWeight = Math.max(physicalWeight, volumetricWeight);
    const extraKg = Math.max(0, finalWeight - 1);

    // 2. Zone matrix calculation
    const getZone = (comuna) => {
      if (['San Bernardo', 'Providencia', 'Santiago', 'Las Condes'].includes(comuna)) return 'RM';
      if (['Viña del Mar', 'Valparaíso', 'Rancagua'].includes(comuna)) return 'CentroCosta';
      if (['La Serena', 'Coquimbo', 'Ovalle', 'Copiapó'].includes(comuna)) return 'NorteChico';
      if (['Concepción', 'Talcahuano', 'Chillán', 'Los Ángeles', 'Temuco'].includes(comuna)) return 'SurCercano';
      if (['Antofagasta', 'Calama', 'Iquique', 'Pozo Almonte'].includes(comuna)) return 'NorteGrande';
      if (['Puerto Montt', 'Osorno', 'Valdivia', 'Castro'].includes(comuna)) return 'SurLejano';
      if (['Arica', 'Punta Arenas', 'Coyhaique', 'Natales'].includes(comuna)) return 'ExtremaNorte';
      return 'CentroCosta';
    };

    const originZone = getZone(quoteOrigin);
    const destZone = getZone(quoteDestination);

    let baseNormal = 3450;
    let baseExpress = 4890;
    let baseSucursal = 2990;
    let perKgNormal = 420;
    let perKgExpress = 650;
    let perKgSucursal = 380;
    let slaNormalText = '24 - 48 hrs hábiles';
    let slaExpressText = '24 hrs hábiles';
    let slaExpressBadge = '24h SLA';
    let slaNormalBadge = '48h SLA';
    let slaSucursalText = '24 - 48 hrs';

    if (originZone === destZone && originZone === 'RM') {
      baseNormal = 2850;
      baseExpress = 3990;
      baseSucursal = 2390;
      perKgNormal = 290;
      perKgExpress = 450;
      perKgSucursal = 250;
      slaNormalText = '24 hrs hábiles';
      slaExpressText = 'Mismo día / 24 hrs';
      slaExpressBadge = '24h SLA';
      slaNormalBadge = '24h SLA';
      slaSucursalText = '24 hrs';
    } else if (
      (originZone === 'RM' && (destZone === 'NorteChico' || destZone === 'SurCercano')) ||
      ((originZone === 'NorteChico' || originZone === 'SurCercano') && destZone === 'RM')
    ) {
      baseNormal = 4150;
      baseExpress = 5900;
      baseSucursal = 3550;
      perKgNormal = 560;
      perKgExpress = 800;
      perKgSucursal = 480;
      slaNormalText = '24 - 48 hrs hábiles';
      slaExpressText = '24 hrs hábiles';
      slaExpressBadge = '24h SLA';
      slaNormalBadge = '48h SLA';
      slaSucursalText = '24 - 48 hrs';
    } else if (
      destZone === 'NorteGrande' || destZone === 'SurLejano' ||
      originZone === 'NorteGrande' || originZone === 'SurLejano'
    ) {
      baseNormal = 5850;
      baseExpress = 8450;
      baseSucursal = 4990;
      perKgNormal = 820;
      perKgExpress = 1180;
      perKgSucursal = 710;
      slaNormalText = '48 - 72 hrs hábiles';
      slaExpressText = '24 - 48 hrs hábiles';
      slaExpressBadge = '48h SLA';
      slaNormalBadge = '72h SLA';
      slaSucursalText = '48 - 72 hrs';
    } else if (
      destZone === 'ExtremaNorte' || destZone === 'ExtremaSur' ||
      originZone === 'ExtremaNorte' || originZone === 'ExtremaSur'
    ) {
      baseNormal = 8900;
      baseExpress = 13600;
      baseSucursal = 7650;
      perKgNormal = 1250;
      perKgExpress = 1850;
      perKgSucursal = 1080;
      slaNormalText = '3 a 5 días hábiles';
      slaExpressText = '48 hrs hábiles (Vía Aérea)';
      slaExpressBadge = '48h SLA';
      slaNormalBadge = '5 días';
      slaSucursalText = '3 a 5 días hábiles';
    }

    const declaredVal = Number(quoteDeclaredValue) || 0;
    const hasInsurance = declaredVal >= 50000;

    const normalPrice = Math.round(baseNormal + (extraKg * perKgNormal));
    const expressPrice = Math.round(baseExpress + (extraKg * perKgExpress));
    const sucursalPrice = Math.round(baseSucursal + (extraKg * perKgSucursal));

    const normalListPrice = Math.round(normalPrice / 0.75);
    const normalSaving = normalListPrice - normalPrice;

    const expressListPrice = Math.round(expressPrice / 0.75);
    const expressSaving = expressListPrice - expressPrice;

    const sucursalListPrice = Math.round(sucursalPrice / 0.75);
    const sucursalSaving = sucursalListPrice - sucursalPrice;

    return {
      finalWeight: finalWeight.toFixed(1),
      volumetricWeight: volumetricWeight.toFixed(1),
      isVolumetricActive: volumetricWeight > physicalWeight,
      hasInsurance,
      normal: { 
        price: normalPrice, 
        listPrice: normalListPrice,
        saving: normalSaving,
        days: slaNormalText, 
        badge: slaNormalBadge 
      },
      express: { 
        price: expressPrice, 
        listPrice: expressListPrice,
        saving: expressSaving,
        days: slaExpressText, 
        badge: slaExpressBadge 
      },
      sucursal: { 
        price: sucursalPrice, 
        listPrice: sucursalListPrice,
        saving: sucursalSaving,
        days: slaSucursalText 
      },
      discountPercent: 25
    };
  }, [quoteWeight, quoteLength, quoteWidth, quoteHeight, quoteOrigin, quoteDestination, quoteDeclaredValue]);

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
              Cotizador
            </h1>
            <p className="text-xs sm:text-sm text-slate-100/90 font-medium font-sans leading-relaxed">
              Calcula en tiempo real tarifas y tiempos de tránsito según origen, destino y cubicaje con precios preferenciales Starken Pro.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-xl border border-starken-border p-5 sm:p-6 space-y-6 shadow-xs">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-sm font-bold font-din text-slate-900">Cotizador de tarifas</h2>
            <p className="text-xs text-slate-500 font-sans font-medium">Calcula al instante los valores y tiempos de entrega para cualquier origen y destino en Chile.</p>
          </div>
          <span className="bg-[#ECF5F7] text-[#33798C] text-xs font-bold px-3 py-1 rounded-lg border border-[#C2DFE7] font-sans self-start sm:self-auto">
            Descuento: -25%
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Form Input Parameters (5 cols) */}
          <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 shadow-2xs">
            <div className="font-din font-bold text-xs text-slate-800 tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-200">
              <Calculator size={14} className="text-[#33798C]" />
              <span>Parámetros de cotización</span>
            </div>

            <div className="space-y-4 text-xs font-sans">
              
              {/* Comuna de Origen */}
              <div className="space-y-2">
                <label className="block font-bold text-slate-700">Comuna de origen</label>
                <div className="relative">
                  <select
                    value={quoteOrigin}
                    onChange={(e) => setQuoteOrigin(e.target.value)}
                    className="w-full appearance-none pl-3.5 pr-10 py-2.5 border border-slate-300 rounded-xl text-xs bg-white text-slate-800 cursor-pointer outline-none focus:border-[#33798C] focus:ring-1 focus:ring-[#33798C] shadow-2xs transition-all font-sans"
                  >
                    <option value="San Bernardo">San Bernardo (CD Principal)</option>
                    <option value="Providencia">Providencia (Hub)</option>
                    <option value="Santiago">Santiago Centro</option>
                    <option value="Viña del Mar">Viña del Mar (Valparaíso)</option>
                    <option value="La Serena">La Serena (Coquimbo)</option>
                    <option value="Concepción">Concepción (Biobío)</option>
                    <option value="Temuco">Temuco (La Araucanía)</option>
                    <option value="Puerto Montt">Puerto Montt (Los Lagos)</option>
                    <option value="Antofagasta">Antofagasta (Antofagasta)</option>
                    <option value="Iquique">Iquique (Tarapacá)</option>
                    <option value="Arica">Arica (Arica y Parinacota)</option>
                    <option value="Punta Arenas">Punta Arenas (Magallanes)</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#33798C]">
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>

              {/* Comuna de Destino */}
              <div className="space-y-2">
                <label className="block font-bold text-slate-700">Comuna de destino</label>
                <div className="relative">
                  <select
                    value={quoteDestination}
                    onChange={(e) => setQuoteDestination(e.target.value)}
                    className="w-full appearance-none pl-3.5 pr-10 py-2.5 border border-slate-300 rounded-xl text-xs bg-white text-slate-800 cursor-pointer outline-none focus:border-[#33798C] focus:ring-1 focus:ring-[#33798C] shadow-2xs transition-all font-sans"
                  >
                    <option value="Concepción">Concepción (Biobío)</option>
                    <option value="La Serena">La Serena (Coquimbo)</option>
                    <option value="Viña del Mar">Viña del Mar (Valparaíso)</option>
                    <option value="Santiago">Santiago Centro (Metropolitana)</option>
                    <option value="Providencia">Providencia (Metropolitana)</option>
                    <option value="San Bernardo">San Bernardo (Metropolitana)</option>
                    <option value="Temuco">Temuco (La Araucanía)</option>
                    <option value="Antofagasta">Antofagasta (Antofagasta)</option>
                    <option value="Puerto Montt">Puerto Montt (Los Lagos)</option>
                    <option value="Punta Arenas">Punta Arenas (Magallanes)</option>
                    <option value="Iquique">Iquique (Tarapacá)</option>
                    <option value="Arica">Arica (Arica y Parinacota)</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#33798C]">
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="space-y-2">
                  <label className="block font-bold text-slate-700">Peso físico (kg)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.1"
                    value={quoteWeight}
                    onChange={(e) => setQuoteWeight(Number(e.target.value))}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-xs font-sans text-slate-800 bg-white outline-none focus:border-[#33798C] shadow-2xs"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block font-bold text-slate-700">Valor declarado ($)</label>
                  <input
                    type="number"
                    step="10000"
                    min="0"
                    value={quoteDeclaredValue}
                    onChange={(e) => setQuoteDeclaredValue(Number(e.target.value))}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-xs font-sans text-slate-800 bg-white outline-none focus:border-[#33798C] shadow-2xs"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700">Dimensiones del bulto (L x An x Al cm)</label>
                  {calculatedQuote.isVolumetricActive && (
                    <span className="text-[10px] text-amber-700 font-sans font-bold">
                      Aplica peso volumétrico
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <input type="number" placeholder="Largo" value={quoteLength} onChange={(e) => setQuoteLength(Number(e.target.value))} className="px-2 py-2 text-center border border-slate-300 rounded-xl text-xs font-sans text-slate-800 bg-white outline-none focus:border-[#33798C] shadow-2xs" />
                  <input type="number" placeholder="Ancho" value={quoteWidth} onChange={(e) => setQuoteWidth(Number(e.target.value))} className="px-2 py-2 text-center border border-slate-300 rounded-xl text-xs font-sans text-slate-800 bg-white outline-none focus:border-[#33798C] shadow-2xs" />
                  <input type="number" placeholder="Alto" value={quoteHeight} onChange={(e) => setQuoteHeight(Number(e.target.value))} className="px-2 py-2 text-center border border-slate-300 rounded-xl text-xs font-sans text-slate-800 bg-white outline-none focus:border-[#33798C] shadow-2xs" />
                </div>
              </div>

              {calculatedQuote.hasInsurance && (
                <div className="p-2.5 bg-teal-50 border border-teal-200 rounded-xl text-[11px] text-teal-800 font-sans flex items-center gap-1.5 animate-in fade-in duration-150">
                  <ShieldCheck size={14} className="text-[#33798C] shrink-0" />
                  <span>Incluye seguro de carga por valor declarado.</span>
                </div>
              )}

            </div>
          </div>

          {/* Service Comparison Cards (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="text-xs font-bold text-slate-500 font-sans flex items-center justify-between flex-wrap gap-1">
              <span>
                Opciones para <strong className="text-slate-900">{quoteOrigin}</strong> hacia <strong className="text-slate-900">{quoteDestination}</strong>:
              </span>
              <span className="bg-slate-200/70 text-slate-700 font-sans font-bold text-[11px] px-2 py-0.5 rounded">
                {calculatedQuote.finalWeight} kg tarificables {calculatedQuote.isVolumetricActive ? `(Vol: ${calculatedQuote.volumetricWeight} kg)` : `(Físico: ${quoteWeight} kg)`}
              </span>
            </div>

            {/* Option 1: Recomendado · Más económico (Entrega en sucursal Starken) */}
            <div 
              onClick={() => setSelectedTariffKey('sucursal')}
              className={`bg-white rounded-2xl p-4 sm:p-5 space-y-3 relative overflow-hidden transition-all cursor-pointer ${
                selectedTariffKey === 'sucursal'
                  ? 'border-2 border-[#33798C] shadow-sm ring-1 ring-[#33798C]/20'
                  : 'border border-slate-200 hover:border-slate-300 shadow-2xs'
              }`}
            >
              <div className="absolute top-0 right-0 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl font-sans shadow-2xs z-10 transition-colors bg-[#33798C]">
                Recomendado · Más económico
              </div>

              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <h3 className="font-din font-bold text-sm sm:text-base text-slate-900 leading-snug">Entrega en sucursal Starken</h3>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded font-sans shrink-0">Económico</span>
                  </div>
                  <p className="text-xs text-slate-500 font-sans mt-0.5">Retiro por destinatario en sucursal {quoteDestination}</p>
                </div>

                <div className="text-right shrink-0 pt-4 sm:pt-4">
                  <div className={`text-xl sm:text-2xl font-black font-din ${selectedTariffKey === 'sucursal' ? 'text-[#1e4f5e]' : 'text-slate-800'}`}>
                    ${calculatedQuote.sucursal.price.toLocaleString('es-CL')}
                  </div>
                  <div className="text-[10px] text-emerald-600 font-bold font-din whitespace-nowrap">
                    Ahorro: -${calculatedQuote.sucursal.saving.toLocaleString('es-CL')}
                  </div>
                </div>
              </div>

              <div className="pt-2.5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs font-sans">
                <div className="flex items-center gap-1.5 text-slate-600 shrink-0">
                  <Clock size={14} className={selectedTariffKey === 'sucursal' ? 'text-[#33798C]' : 'text-slate-400'} />
                  <span>Compromiso: <strong>{calculatedQuote.sucursal.days}</strong></span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTariffKey('sucursal');
                    if (onSelectTariffForEmission) {
                      onSelectTariffForEmission({
                        destinationComuna: quoteDestination,
                        deliveryType: 'Sucursal',
                        weight: calculatedQuote.finalWeight
                      });
                    } else if (showToast) {
                      showToast(`Tarifa Sucursal seleccionada para ${quoteDestination}.`, 'info');
                    }
                  }}
                  className={`w-full sm:w-auto text-xs font-din font-bold px-4 py-2 sm:py-1.5 rounded-xl sm:rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 ${
                    selectedTariffKey === 'sucursal'
                      ? 'bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  <span>Emitir con esta tarifa</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>

            {/* Option 2: Más rápido (Starken Prioritario) */}
            <div 
              onClick={() => setSelectedTariffKey('prioritario')}
              className={`bg-white rounded-2xl p-4 sm:p-5 space-y-3 relative overflow-hidden transition-all cursor-pointer ${
                selectedTariffKey === 'prioritario'
                  ? 'border-2 border-[#33798C] shadow-sm ring-1 ring-[#33798C]/20'
                  : 'border border-slate-200 hover:border-slate-300 shadow-2xs'
              }`}
            >
              <div className="absolute top-0 right-0 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl font-sans shadow-2xs z-10 transition-colors bg-[#33798C]">
                Más rápido
              </div>

              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <h3 className="font-din font-bold text-sm sm:text-base text-slate-900 leading-snug">Starken Prioritario</h3>
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded font-sans shrink-0">
                      {calculatedQuote.express.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-sans mt-0.5">Entrega prioritaria a primera hora en destino</p>
                </div>

                <div className="text-right shrink-0 pt-4 sm:pt-4">
                  <div className={`text-xl sm:text-2xl font-black font-din ${selectedTariffKey === 'prioritario' ? 'text-[#1e4f5e]' : 'text-slate-800'}`}>
                    ${calculatedQuote.express.price.toLocaleString('es-CL')}
                  </div>
                  <div className="text-[10px] text-emerald-600 font-bold font-din whitespace-nowrap">
                    Ahorro: -${calculatedQuote.express.saving.toLocaleString('es-CL')}
                  </div>
                </div>
              </div>

              <div className="pt-2.5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs font-sans">
                <div className="flex items-center gap-1.5 text-slate-600 shrink-0">
                  <Clock size={14} className={selectedTariffKey === 'prioritario' ? 'text-[#33798C]' : 'text-slate-400'} />
                  <span>Compromiso: <strong>{calculatedQuote.express.days}</strong></span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTariffKey('prioritario');
                    if (onSelectTariffForEmission) {
                      onSelectTariffForEmission({
                        destinationComuna: quoteDestination,
                        serviceType: 'Express',
                        weight: calculatedQuote.finalWeight
                      });
                    } else if (showToast) {
                      showToast(`Tarifa Prioritaria seleccionada para ${quoteDestination}.`, 'info');
                    }
                  }}
                  className={`w-full sm:w-auto text-xs font-din font-bold px-4 py-2 sm:py-1.5 rounded-xl sm:rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 ${
                    selectedTariffKey === 'prioritario'
                      ? 'bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  <span>Emitir con esta tarifa</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>

            {/* Option 3: Normal (Starken Normal) */}
            <div 
              onClick={() => setSelectedTariffKey('normal')}
              className={`bg-white rounded-2xl p-4 sm:p-5 space-y-3 relative overflow-hidden transition-all cursor-pointer ${
                selectedTariffKey === 'normal'
                  ? 'border-2 border-[#33798C] shadow-sm ring-1 ring-[#33798C]/20'
                  : 'border border-slate-200 hover:border-slate-300 shadow-2xs'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <h3 className="font-din font-bold text-sm sm:text-base text-slate-900 leading-snug">Starken Normal</h3>
                    <span className="bg-sky-100 text-sky-800 text-[10px] font-bold px-2 py-0.5 rounded font-sans shrink-0">
                      {calculatedQuote.normal.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-sans mt-0.5">Servicio estándar con cobertura a todo Chile</p>
                </div>

                <div className="text-right shrink-0">
                  <div className={`text-xl sm:text-2xl font-black font-din ${selectedTariffKey === 'normal' ? 'text-[#1e4f5e]' : 'text-slate-800'}`}>
                    ${calculatedQuote.normal.price.toLocaleString('es-CL')}
                  </div>
                  <div className="text-[10px] text-emerald-600 font-bold font-din whitespace-nowrap">
                    Ahorro: -${calculatedQuote.normal.saving.toLocaleString('es-CL')}
                  </div>
                </div>
              </div>

              <div className="pt-2.5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs font-sans">
                <div className="flex items-center gap-1.5 text-slate-600 shrink-0">
                  <Clock size={14} className={selectedTariffKey === 'normal' ? 'text-[#33798C]' : 'text-slate-400'} />
                  <span>Compromiso: <strong>{calculatedQuote.normal.days}</strong></span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTariffKey('normal');
                    if (onSelectTariffForEmission) {
                      onSelectTariffForEmission({
                        destinationComuna: quoteDestination,
                        serviceType: 'Normal',
                        weight: calculatedQuote.finalWeight
                      });
                    } else if (showToast) {
                      showToast(`Tarifa Normal seleccionada para ${quoteDestination}.`, 'info');
                    }
                  }}
                  className={`w-full sm:w-auto text-xs font-din font-bold px-4 py-2 sm:py-1.5 rounded-xl sm:rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 ${
                    selectedTariffKey === 'normal'
                      ? 'bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  <span>Emitir con esta tarifa</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
