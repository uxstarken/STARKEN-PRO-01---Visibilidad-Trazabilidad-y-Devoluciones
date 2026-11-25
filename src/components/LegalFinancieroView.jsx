import React, { useState, useMemo } from 'react';
import { 
  Landmark, 
  Receipt, 
  TrendingUp, 
  FileText, 
  ShieldCheck, 
  Download, 
  FileCode, 
  Eye, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Search, 
  Filter, 
  Calendar, 
  ArrowUpRight, 
  DollarSign, 
  CreditCard, 
  FileCheck, 
  FileSignature, 
  ExternalLink, 
  Percent, 
  Layers, 
  Info, 
  ChevronRight, 
  ChevronDown, 
  X, 
  Check, 
  UploadCloud, 
  Building2, 
  UserCheck, 
  Lock, 
  BadgePercent,
  Sparkles,
  HelpCircle,
  Share2
} from 'lucide-react';

// Mock Invoices data
const INITIAL_INVOICES = [
  {
    id: 'FAC-2026-009841',
    rutEmisor: '96.554.000-8',
    razonSocial: 'STARKEN S.A.',
    periodo: 'Septiembre 2026',
    fechaEmision: '30-09-2026',
    fechaVencimiento: '20-10-2026',
    diasParaVencer: 15,
    montoNeto: 1798319,
    iva: 341681,
    montoTotal: 2140000,
    totalEnvios: 342,
    estado: 'Pendiente', // Pendiente, Pagada, Vencida, En proceso
    tipoDocumento: 'Factura Electrónica Afecta N° 9841',
    formaPago: 'Crédito Cuenta Corriente 30 días',
    detallesOF: [
      { of: '275161618', fecha: '28-09-2026', origen: 'San Bernardo', destino: 'La Serena', servicio: 'Normal Domicilio', bultos: 1, peso: '2.5 kg', total: 6240 },
      { of: '275067401', fecha: '27-09-2026', origen: 'San Bernardo', destino: 'Paine', servicio: 'Normal Domicilio', bultos: 1, peso: '1.2 kg', total: 4560 },
      { of: '275105257', fecha: '27-09-2026', origen: 'San Bernardo', destino: 'Calama', servicio: 'Express Domicilio', bultos: 2, peso: '5.8 kg', total: 12450 },
      { of: '274942088', fecha: '26-09-2026', origen: 'San Bernardo', destino: 'Concepción', servicio: 'Normal Sucursal', bultos: 1, peso: '3.0 kg', total: 5890 },
      { of: '274494880', fecha: '25-09-2026', origen: 'San Bernardo', destino: 'Antofagasta', servicio: 'Normal Domicilio', bultos: 3, peso: '14.0 kg', total: 19800 }
    ]
  },
  {
    id: 'FAC-2026-009210',
    rutEmisor: '96.554.000-8',
    razonSocial: 'STARKEN S.A.',
    periodo: 'Agosto 2026',
    fechaEmision: '31-08-2026',
    fechaVencimiento: '20-09-2026',
    diasParaVencer: 0,
    montoNeto: 2420168,
    iva: 459832,
    montoTotal: 2880000,
    totalEnvios: 489,
    estado: 'Pagada',
    fechaPago: '18-09-2026',
    metodoPago: 'Transferencia Electrónica B2B (Banco Santander)',
    comprobantePago: 'TRX-992184-B2B',
    tipoDocumento: 'Factura Electrónica Afecta N° 9210',
    formaPago: 'Crédito Cuenta Corriente 30 días',
    detallesOF: [
      { of: '273752930', fecha: '28-08-2026', origen: 'San Bernardo', destino: 'San Felipe', servicio: 'Normal Domicilio', bultos: 2, peso: '4.0 kg', total: 10640 },
      { of: '274423469', fecha: '25-08-2026', origen: 'San Bernardo', destino: 'Viña Del Mar', servicio: 'Normal Domicilio', bultos: 1, peso: '3.2 kg', total: 9940 },
      { of: '274837812', fecha: '22-08-2026', origen: 'San Bernardo', destino: 'San Bernardo', servicio: 'Normal Domicilio', bultos: 1, peso: '1.0 kg', total: 4567 }
    ]
  },
  {
    id: 'FAC-2026-008740',
    rutEmisor: '96.554.000-8',
    razonSocial: 'STARKEN S.A.',
    periodo: 'Julio 2026',
    fechaEmision: '31-07-2026',
    fechaVencimiento: '20-08-2026',
    diasParaVencer: 0,
    montoNeto: 1176891,
    iva: 223609,
    montoTotal: 1400500,
    totalEnvios: 215,
    estado: 'Pagada',
    fechaPago: '16-08-2026',
    metodoPago: 'Transferencia Bancaria B2B',
    comprobantePago: 'TRX-881204-B2B',
    tipoDocumento: 'Factura Electrónica Afecta N° 8740',
    formaPago: 'Crédito Cuenta Corriente 30 días',
    detallesOF: []
  },
  {
    id: 'FAC-2026-008102',
    rutEmisor: '96.554.000-8',
    razonSocial: 'STARKEN S.A.',
    periodo: 'Junio 2026',
    fechaEmision: '30-06-2026',
    fechaVencimiento: '20-07-2026',
    diasParaVencer: 0,
    montoNeto: 1890756,
    iva: 359244,
    montoTotal: 2250000,
    totalEnvios: 380,
    estado: 'Pagada',
    fechaPago: '19-07-2026',
    metodoPago: 'Webpay B2B Starken',
    comprobantePago: 'WP-77291-PRO',
    tipoDocumento: 'Factura Electrónica Afecta N° 8102',
    formaPago: 'Crédito Cuenta Corriente 30 días',
    detallesOF: []
  }
];

// Active Tariff matrix by zone & weight ranges
const TARIFF_DATA = [
  { tramo: '0.0 a 1.0 kg', rmUrbano: 3450, norteChico: 4890, surCercano: 4650, norteGrande: 6990, surAustral: 8450, descConvenio: '25%' },
  { tramo: '1.1 a 3.0 kg', rmUrbano: 4100, norteChico: 5950, surCercano: 5600, norteGrande: 8850, surAustral: 10600, descConvenio: '25%' },
  { tramo: '3.1 a 5.0 kg', rmUrbano: 5200, norteChico: 7400, surCercano: 6990, norteGrande: 11200, surAustral: 13900, descConvenio: '25%' },
  { tramo: '5.1 a 10.0 kg', rmUrbano: 7100, norteChico: 10200, surCercano: 9700, norteGrande: 15800, surAustral: 19400, descConvenio: '25%' },
  { tramo: '10.1 a 15.0 kg', rmUrbano: 9600, norteChico: 13800, surCercano: 13100, norteGrande: 21500, surAustral: 26200, descConvenio: '25%' },
  { tramo: '15.1 a 20.0 kg', rmUrbano: 12400, norteChico: 17600, surCercano: 16800, norteGrande: 27900, surAustral: 33800, descConvenio: '25%' },
  { tramo: 'Kg adicional (+20kg)', rmUrbano: 490, norteChico: 750, surCercano: 710, norteGrande: 1250, surAustral: 1550, descConvenio: '25%' }
];

// Price hikes & adjustments notifications
const INITIAL_PRICE_ADJUSTMENTS = [
  {
    id: 'ALZA-2026-Q4',
    titulo: 'Reajuste Polinómico Anual e IPC (Q4-2026)',
    fechaNotificacion: '01-10-2026',
    fechaVigencia: '01-11-2026',
    estado: 'Pendiente de aceptación', // 'Pendiente de aceptación' | 'Aceptado'
    porcentajePromedio: '+3.8%',
    motivo: 'Variación acumulada IPC periodo Sep 2025 - Sep 2026 (3.2%) y ajuste índice de combustible diésel (+0.6%) según cláusula 7ma del contrato marco.',
    apoderadoRequerido: 'Representante Legal o Apoderado Clase A/B con facultades comerciales',
    impactoPorZona: [
      { zona: 'Región Metropolitana (Urbano)', anterior: '$3.320', nuevo: '$3.450', variacion: '+3.9%' },
      { zona: 'Norte Chico (IV a V Región)', anterior: '$4.710', nuevo: '$4.890', variacion: '+3.8%' },
      { zona: 'Sur Cercano (VI a VIII Región)', anterior: '$4.480', nuevo: '$4.650', variacion: '+3.8%' },
      { zona: 'Norte Grande (I, II y XV)', anterior: '$6.730', nuevo: '$6.990', variacion: '+3.8%' },
      { zona: 'Zona Austral (XI y XII)', anterior: '$8.140', nuevo: '$8.450', variacion: '+3.8%' }
    ],
    clausulaContrato: 'Cláusula 7.2: "Las tarifas pactadas en el Anexo Tarifario se reajustarán anualmente conforme a la variación del Índice de Precios al Consumidor (IPC) informado por el INE, más el componente de indexación de combustible ENAP."',
    fechaAceptacion: null,
    aceptadoPor: null
  },
  {
    id: 'ALZA-2025-Q4',
    titulo: 'Reajuste Anual IPC Periodo 2025',
    fechaNotificacion: '02-10-2025',
    fechaVigencia: '01-11-2025',
    estado: 'Aceptado',
    porcentajePromedio: '+4.1%',
    motivo: 'Ajuste anual por variación IPC según contrato comercial vigente.',
    apoderadoRequerido: 'Representante Legal',
    fechaAceptacion: '14-10-2025 15:42 hrs',
    aceptadoPor: 'Carlos Alberto Valenzuela (RUT: 12.840.119-3) — Gerente de Administración',
    comprobanteId: 'CERT-ALZA-2025-9921'
  }
];

// Contracts & Legal documents
const CONTRACT_DOCUMENTS = [
  {
    id: 'DOC-CTR-44379-2024',
    nombre: 'Contrato Marco de Servicios de Transporte, Logística y Distribución B2B',
    tipo: 'Contrato Marco',
    fechaFirma: '15-03-2024',
    vigenciaHasta: '15-03-2027 (Renovación Automática)',
    estado: 'Vigente',
    partes: 'STARKEN S.A. & Swiss Trading Group S.A.',
    firmantes: 'Roberto Henríquez (Starken) / Carlos Valenzuela (Cliente)',
    archivoNombre: 'Contrato_Marco_StarkenPro_SwissTradingGroup_2024.pdf',
    tamano: '2.4 MB',
    codigoVerificacion: 'STK-LEG-2024-44379-VF'
  },
  {
    id: 'DOC-ANX-44379-CC',
    nombre: 'Anexo N° 1 — Otorgamiento de Cuenta Corriente Comercial y Línea de Crédito',
    tipo: 'Anexo Comercial',
    fechaFirma: '15-03-2024',
    vigenciaHasta: 'Indefinida (Sujeto a evaluación periódica de riesgo)',
    estado: 'Vigente',
    cupoAprobado: '$15.000.000 CLP (30 días de plazo)',
    archivoNombre: 'Anexo_1_LineaCredito_CtaCte_44379.pdf',
    tamano: '1.1 MB',
    codigoVerificacion: 'STK-CRD-44379-99B'
  },
  {
    id: 'DOC-SLA-44379-2026',
    nombre: 'Acuerdo de Nivel de Servicio (SLA) & Protocolo de Indemnizaciones',
    tipo: 'Acuerdo SLA',
    fechaFirma: '10-01-2026',
    vigenciaHasta: '31-12-2026',
    estado: 'Vigente',
    archivoNombre: 'Acuerdo_SLA_Garantias_Starken_2026.pdf',
    tamano: '890 KB',
    codigoVerificacion: 'STK-SLA-2026-004'
  },
  {
    id: 'DOC-TYC-PORTAL-V3',
    nombre: 'Términos y Condiciones de Uso Portal StarkenPro & APIs',
    tipo: 'Términos y Condiciones',
    fechaFirma: 'Aceptado digitalmente el 12-05-2026',
    vigenciaHasta: 'Versión 3.2 Activa',
    estado: 'Aceptado',
    archivoNombre: 'Terminos_Condiciones_StarkenPro_v3.2.pdf',
    tamano: '640 KB',
    codigoVerificacion: 'TYC-STKPRO-2026-V32'
  }
];

export default function LegalFinancieroView({ selectedAccount, showToast }) {
  const [activeTab, setActiveTab] = useState('financiero'); // 'financiero' | 'tarifas' | 'contratos' | 'mobile'
  
  // Financial Tab States
  const [invoices, setInvoices] = useState(INITIAL_INVOICES);
  const [invoiceFilter, setInvoiceFilter] = useState('todos'); // 'todos' | 'Pendiente' | 'Pagada'
  const [invoiceSearch, setInvoiceSearch] = useState('');
  const [selectedInvoiceForDetail, setSelectedInvoiceForDetail] = useState(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentInvoice, setPaymentInvoice] = useState(null);
  const [paymentStep, setPaymentStep] = useState(1);
  const [transferRef, setTransferRef] = useState('');

  // Tariff & Hikes States
  const [priceAdjustments, setPriceAdjustments] = useState(INITIAL_PRICE_ADJUSTMENTS);
  const [selectedAdjustmentForModal, setSelectedAdjustmentForModal] = useState(null);
  const [acceptedCheckbox, setAcceptedCheckbox] = useState(false);
  const [apoderadoRut, setApoderadoRut] = useState('12.840.119-3');
  const [apoderadoNombre, setApoderadoNombre] = useState('Carlos Alberto Valenzuela');
  const [selectedTariffZone, setSelectedTariffZone] = useState('rmUrbano');

  // Filter invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      const matchStatus = invoiceFilter === 'todos' || inv.estado === invoiceFilter;
      const matchSearch = inv.id.toLowerCase().includes(invoiceSearch.toLowerCase()) ||
                          inv.periodo.toLowerCase().includes(invoiceSearch.toLowerCase()) ||
                          inv.montoTotal.toString().includes(invoiceSearch);
      return matchStatus && matchSearch;
    });
  }, [invoices, invoiceFilter, invoiceSearch]);

  // Credit KPIs calculations
  const totalCreditLimit = 15000000;
  const currentUsedCredit = 6420500;
  const availableCredit = totalCreditLimit - currentUsedCredit;
  const pendingPaymentSum = invoices.filter(i => i.estado === 'Pendiente').reduce((acc, curr) => acc + curr.montoTotal, 0);
  const creditUsagePercentage = Math.round((currentUsedCredit / totalCreditLimit) * 100);

  // Handlers
  const handleAcceptPriceAdjustment = (adjId) => {
    if (!acceptedCheckbox) {
      if (showToast) showToast('Debes marcar la casilla declarando tu conformidad.', 'info');
      return;
    }

    const now = new Date();
    const timestampStr = `${now.getDate().toString().padStart(2, '0')}-${(now.getMonth()+1).toString().padStart(2, '0')}-${now.getFullYear()} ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')} hrs`;

    setPriceAdjustments(prev => prev.map(a => {
      if (a.id === adjId) {
        return {
          ...a,
          estado: 'Aceptado',
          fechaAceptacion: timestampStr,
          aceptadoPor: `${apoderadoNombre} (RUT: ${apoderadoRut}) — Representante Legal`,
          comprobanteId: `CERT-ALZA-2026-${Math.floor(1000 + Math.random() * 9000)}`
        };
      }
      return a;
    }));

    setSelectedAdjustmentForModal(null);
    setAcceptedCheckbox(false);
    if (showToast) showToast('Reajuste tarifario aceptado formalmente con firma digital registrada.', 'success');
  };

  const handleRegisterPaymentSubmit = (e) => {
    e.preventDefault();
    if (!transferRef.trim()) {
      if (showToast) showToast('Ingresa el número de comprobante o referencia bancaria.', 'info');
      return;
    }

    if (paymentInvoice) {
      setInvoices(prev => prev.map(inv => {
        if (inv.id === paymentInvoice.id) {
          return {
            ...inv,
            estado: 'Pagada',
            fechaPago: '05-10-2026',
            metodoPago: `Transferencia Notificada (Ref: ${transferRef})`,
            comprobantePago: transferRef
          };
        }
        return inv;
      }));
    }

    setPaymentModalOpen(false);
    setPaymentInvoice(null);
    setTransferRef('');
    setPaymentStep(1);
    if (showToast) showToast(`Comprobante ${transferRef} registrado. Tu estado de cuenta se actualizará tras conciliación bancaria.`, 'success');
  };

  const handleDownloadInvoice = (invoiceId, type = 'PDF') => {
    if (showToast) showToast(`Descargando ${type} oficial de la factura ${invoiceId} timbrada por el SII...`, 'info');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Sub-tab Navigation Header */}
      <div className="bg-white rounded-xl border border-starken-border p-1.5 shadow-xs flex flex-wrap gap-1.5 font-din">
        <button
          onClick={() => setActiveTab('financiero')}
          className={`flex-1 min-w-[170px] py-2.5 px-4 rounded-lg text-xs font-bold tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer ${
            activeTab === 'financiero'
              ? 'bg-[#33798C] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
          }`}
        >
          <Landmark size={15} />
          <span>Estado financiero & facturación</span>
        </button>

        <button
          onClick={() => setActiveTab('tarifas')}
          className={`flex-1 min-w-[170px] py-2.5 px-4 rounded-lg text-xs font-bold tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer relative ${
            activeTab === 'tarifas'
              ? 'bg-[#33798C] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
          }`}
        >
          <TrendingUp size={15} />
          <span>Tarifas y alzas</span>
          {priceAdjustments.some(a => a.estado === 'Pendiente de aceptación') && (
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping ml-1" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('contratos')}
          className={`flex-1 min-w-[170px] py-2.5 px-4 rounded-lg text-xs font-bold tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer ${
            activeTab === 'contratos'
              ? 'bg-[#33798C] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
          }`}
        >
          <FileSignature size={15} />
          <span>Contratos & T&C</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: ESTADO FINANCIERO Y FACTURACIÓN */}
      {/* ========================================================================= */}
      {activeTab === 'financiero' && (
        <div className="space-y-6">
          
          {/* Banking details reference card */}
          <div className="bg-gradient-to-r from-[#1e4f5e] via-[#33798C] to-[#266373] text-white rounded-2xl p-6 shadow-md relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            {/* Subtle decorative circular shapes matching Seguimiento */}
            <div className="absolute -right-16 -bottom-16 w-72 h-72 rounded-full bg-white/5 pointer-events-none" />
            <div className="absolute right-36 -top-16 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
            <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full border border-white/10 pointer-events-none" />
            <div className="absolute right-72 -bottom-20 w-40 h-40 rounded-full bg-white/[0.03] pointer-events-none" />

            <div className="relative z-10 space-y-2.5 max-w-2xl">
              <h4 className="text-xl sm:text-2xl font-black font-din tracking-tight text-white">
                Cuenta bancaria recaudadora — Starken S.A.
              </h4>
              
              <p className="text-xs sm:text-sm text-slate-100/90 font-medium font-sans leading-relaxed">
                Para transferencias electrónicas directas, utiliza los siguientes datos y notifica tu pago con el número de comprobante para conciliación automática en menos de 2 horas.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-xl p-3">
                  <span className="text-[10px] font-bold tracking-wider text-teal-100 font-din block">Banco</span>
                  <span className="font-bold text-white text-xs sm:text-sm font-sans block mt-0.5">Banco de Chile</span>
                </div>
                <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-xl p-3">
                  <span className="text-[10px] font-bold tracking-wider text-teal-100 font-din block">Tipo de cuenta</span>
                  <span className="font-bold text-white text-xs sm:text-sm font-sans block mt-0.5">Cuenta Corriente</span>
                </div>
                <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-xl p-3">
                  <span className="text-[10px] font-bold tracking-wider text-teal-100 font-din block">N° cuenta</span>
                  <span className="font-black text-white text-xs sm:text-sm font-mono block mt-0.5 tracking-tight">00-184-99210-04</span>
                </div>
                <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-xl p-3">
                  <span className="text-[10px] font-bold tracking-wider text-teal-100 font-din block">RUT empresa</span>
                  <span className="font-black text-white text-xs sm:text-sm font-mono block mt-0.5">96.554.000-8</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 shrink-0 flex flex-col items-stretch md:items-end space-y-2">
              <button
                onClick={() => {
                  setPaymentInvoice(invoices.find(i => i.estado === 'Pendiente') || invoices[0]);
                  setPaymentModalOpen(true);
                }}
                className="bg-white hover:bg-slate-100 text-[#1e4f5e] px-5 py-3 rounded-xl font-din font-black text-xs tracking-wider transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
              >
                <UploadCloud size={16} className="text-[#33798C]" />
                <span>Subir comprobante de pago</span>
              </button>
              <span className="text-[11px] text-teal-100/90 text-center md:text-right font-sans">
                Email de aviso: recaudacion.empresas@starken.cl
              </span>
            </div>
          </div>

          {/* Executive Credit Status KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Cupo de Crédito Total */}
            <div className="bg-white rounded-xl border border-starken-border p-4 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 tracking-wide font-din">Línea de crédito aprobada</span>
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#33798C] flex items-center justify-center border border-teal-100">
                  <CreditCard size={16} />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-black text-slate-850 font-din">
                  ${totalCreditLimit.toLocaleString('es-CL')} <span className="text-xs text-slate-500 font-normal">CLP</span>
                </div>
                <div className="text-xs text-slate-500 font-sans mt-0.5 flex items-center space-x-1">
                  <Building2 size={12} className="text-slate-400" />
                  <span>Condición: 30 días factura</span>
                </div>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
                <span>Evaluación de riesgo:</span>
                <span className="font-bold text-emerald-600">Aprobado / AAA</span>
              </div>
            </div>

            {/* Crédito Utilizado */}
            <div className="bg-white rounded-xl border border-starken-border p-4 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 tracking-wide font-din">Crédito en uso</span>
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100">
                  <TrendingUp size={16} />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-black text-slate-850 font-din">
                  ${currentUsedCredit.toLocaleString('es-CL')} <span className="text-xs text-slate-500 font-normal">CLP</span>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      creditUsagePercentage > 80 ? 'bg-rose-500' : creditUsagePercentage > 50 ? 'bg-amber-500' : 'bg-[#33798C]'
                    }`}
                    style={{ width: `${creditUsagePercentage}%` }}
                  />
                </div>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
                <span>Porcentaje de uso:</span>
                <span className="font-bold text-slate-700">{creditUsagePercentage}% del cupo</span>
              </div>
            </div>

            {/* Saldo Disponible */}
            <div className="bg-white rounded-xl border border-starken-border p-4 shadow-xs flex flex-col justify-between bg-gradient-to-br from-white to-emerald-50/30">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 tracking-wide font-din">Cupo disponible para envíos</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
                  <CheckCircle2 size={16} />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-black text-emerald-700 font-din">
                  ${availableCredit.toLocaleString('es-CL')} <span className="text-xs text-emerald-600 font-normal">CLP</span>
                </div>
                <div className="text-xs text-emerald-700/80 font-sans mt-0.5">
                  Capacidad de emisión 100% activa
                </div>
              </div>
              <div className="mt-3 pt-2.5 border-t border-emerald-100/60 text-[11px] text-slate-500 flex justify-between">
                <span>Estado de cuenta:</span>
                <span className="font-bold text-emerald-600">Al día sin bloqueos</span>
              </div>
            </div>

            {/* Facturas por Vencer / Vencidas */}
            <div className="bg-white rounded-xl border border-starken-border p-4 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 tracking-wide font-din">Facturas por vencer</span>
                <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center border border-sky-100">
                  <Clock size={16} />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-black text-slate-850 font-din">
                  ${pendingPaymentSum.toLocaleString('es-CL')} <span className="text-xs text-slate-500 font-normal">CLP</span>
                </div>
                <div className="text-xs text-slate-500 font-sans mt-0.5 flex items-center space-x-1">
                  <Calendar size={12} className="text-slate-400" />
                  <span>Próximo vencimiento: 20-10-2026</span>
                </div>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
                <span>Facturas vencidas:</span>
                <span className="font-bold text-emerald-600">$0 (0 facturas)</span>
              </div>
            </div>

          </div>

          {/* Facturación y Cobros Table Section */}
          <div className="bg-white rounded-2xl border border-starken-border shadow-xs overflow-hidden">
            
            {/* Table Header Controls */}
            <div className="p-4 sm:p-5 border-b border-starken-border flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-slate-50/50">
              <div className="space-y-0.5">
                <h3 className="text-base font-black text-slate-850 font-din tracking-wide flex items-center space-x-2">
                  <Receipt size={17} className="text-[#33798C]" />
                  <span>Historial de facturas y detalle de cobros</span>
                </h3>
                <p className="text-xs text-slate-500 font-sans">
                  Consulta, concilia por orden de flete y descarga los DTEs tributarios emitidos a tu RUT comercial.
                </p>
              </div>

              {/* Filters and Action aligned horizontally */}
              <div className="flex items-center gap-2.5 flex-nowrap overflow-x-auto shrink-0 py-0.5">
                
                {/* Search input */}
                <div className="relative shrink-0">
                  <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Buscar factura, mes..."
                    value={invoiceSearch}
                    onChange={(e) => setInvoiceSearch(e.target.value)}
                    className="pl-8 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-xl outline-none focus:border-[#33798C] font-sans w-40 sm:w-44 shadow-2xs"
                  />
                </div>

                {/* Status selector */}
                <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/80 text-xs font-sans font-bold shrink-0">
                  <button
                    onClick={() => setInvoiceFilter('todos')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      invoiceFilter === 'todos' ? 'bg-[#33798C] text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Todas
                  </button>
                  <button
                    onClick={() => setInvoiceFilter('Pendiente')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      invoiceFilter === 'Pendiente' ? 'bg-[#33798C] text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Por pagar
                  </button>
                  <button
                    onClick={() => setInvoiceFilter('Pagada')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      invoiceFilter === 'Pagada' ? 'bg-[#33798C] text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Pagadas
                  </button>
                </div>

                {/* Action button */}
                <button
                  onClick={() => {
                    setPaymentInvoice(invoices.find(i => i.estado === 'Pendiente') || invoices[0]);
                    setPaymentModalOpen(true);
                  }}
                  className="btn btn-primary text-xs py-2 px-3.5 flex items-center space-x-1.5 cursor-pointer whitespace-nowrap font-bold shrink-0 shadow-xs"
                >
                  <DollarSign size={14} />
                  <span>Notificar pago / transferencia</span>
                </button>

              </div>
            </div>

            {/* Invoices Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100/70 border-b border-starken-border text-slate-600 font-din font-extrabold text-[11px] tracking-wider">
                    <th className="py-3 px-4">N° documento</th>
                    <th className="py-3 px-3">Período</th>
                    <th className="py-3 px-3">Fecha emisión</th>
                    <th className="py-3 px-3">Vencimiento</th>
                    <th className="py-3 px-3">Envíos</th>
                    <th className="py-3 px-3">Monto neto</th>
                    <th className="py-3 px-3">Total (IVA incl.)</th>
                    <th className="py-3 px-3">Estado</th>
                    <th className="py-3 px-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-starken-border font-sans">
                  {filteredInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                      
                      {/* Documento */}
                      <td className="py-3 px-4 font-bold text-slate-850">
                        <div className="flex items-center space-x-2">
                          <Receipt size={14} className="text-[#33798C] shrink-0" />
                          <div>
                            <span className="font-din text-xs font-black block">{inv.id}</span>
                            <span className="text-[10px] text-slate-500 block">{inv.tipoDocumento}</span>
                          </div>
                        </div>
                      </td>

                      {/* Periodo */}
                      <td className="py-3 px-3 font-semibold text-slate-700">
                        {inv.periodo}
                      </td>

                      {/* Fecha Emision */}
                      <td className="py-3 px-3 text-slate-600">
                        {inv.fechaEmision}
                      </td>

                      {/* Vencimiento */}
                      <td className="py-3 px-3">
                        <div className="text-slate-700 font-medium">
                          {inv.fechaVencimiento}
                        </div>
                        {inv.estado === 'Pendiente' && (
                          <span className="text-[10px] text-amber-700 font-bold block">
                            Vence en {inv.diasParaVencer} días
                          </span>
                        )}
                      </td>

                      {/* Cantidad Envios */}
                      <td className="py-3 px-3 font-bold text-slate-800">
                        <button
                          onClick={() => setSelectedInvoiceForDetail(inv)}
                          className="text-[#33798C] hover:underline font-din font-bold flex items-center space-x-1 cursor-pointer"
                          title="Ver detalle por Orden de Flete"
                        >
                          <span>{inv.totalEnvios} OFs</span>
                          <ChevronRight size={12} />
                        </button>
                      </td>

                      {/* Neto */}
                      <td className="py-3 px-3 text-slate-600 font-mono">
                        ${inv.montoNeto.toLocaleString('es-CL')}
                      </td>

                      {/* Total */}
                      <td className="py-3 px-3 font-black text-slate-850 font-mono text-sm">
                        ${inv.montoTotal.toLocaleString('es-CL')}
                      </td>

                      {/* Estado */}
                      <td className="py-3 px-3">
                        {inv.estado === 'Pagada' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <Check size={10} className="mr-1" />
                            Pagada ({inv.fechaPago || 'Al día'})
                          </span>
                        ) : inv.estado === 'Pendiente' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock size={10} className="mr-1" />
                            Por Pagar
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <AlertTriangle size={10} className="mr-1" />
                            Vencida
                          </span>
                        )}
                      </td>

                      {/* Acciones */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          
                          {/* Ver desglose OFs */}
                          <button
                            onClick={() => setSelectedInvoiceForDetail(inv)}
                            className="p-1.5 rounded-md hover:bg-slate-200 text-slate-600 hover:text-[#33798C] transition-colors cursor-pointer"
                            title="Auditar detalle por OF"
                          >
                            <Eye size={14} />
                          </button>

                          {/* Descargar PDF */}
                          <button
                            onClick={() => handleDownloadInvoice(inv.id, 'PDF')}
                            className="p-1.5 rounded-md hover:bg-slate-200 text-slate-600 hover:text-[#33798C] transition-colors cursor-pointer"
                            title="Descargar Factura PDF (SII)"
                          >
                            <Download size={14} />
                          </button>

                          {/* Descargar XML */}
                          <button
                            onClick={() => handleDownloadInvoice(inv.id, 'XML')}
                            className="p-1.5 rounded-md hover:bg-slate-200 text-slate-600 hover:text-[#33798C] transition-colors cursor-pointer"
                            title="Descargar DTE XML"
                          >
                            <FileCode size={14} />
                          </button>

                          {/* Pagar si esta pendiente */}
                          {inv.estado === 'Pendiente' && (
                            <button
                              onClick={() => {
                                setPaymentInvoice(inv);
                                setPaymentModalOpen(true);
                              }}
                              className="bg-[#33798C] hover:bg-[#1e4f5e] text-white text-[11px] font-bold px-2.5 py-1 rounded-md transition-colors cursor-pointer shadow-2xs font-din ml-1"
                            >
                              Pagar
                            </button>
                          )}

                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer Summary */}
            <div className="p-4 border-t border-starken-border bg-slate-50/70 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-sans gap-2">
              <div className="flex items-center space-x-2">
                <Info size={14} className="text-[#33798C]" />
                <span>Las facturas son emitidas mensualmente y enviadas automáticamente al correo tributario registrado.</span>
              </div>
              <div className="font-din font-bold text-slate-700">
                Mostrando {filteredInvoices.length} documento(s) tributarios
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: TARIFAS VIGENTES Y GESTIÓN DE ALZAS */}
      {/* ========================================================================= */}
      {activeTab === 'tarifas' && (
        <div className="space-y-6">
          
          {/* Active Price Adjustment Alert Notification (if pending) */}
          {priceAdjustments.map((adj) => (
            <div 
              key={adj.id} 
              className={`rounded-2xl border p-5 transition-all shadow-xs ${
                adj.estado === 'Pendiente de aceptación'
                  ? 'bg-amber-50/70 border-amber-300'
                  : 'bg-white border-starken-border'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    {adj.estado === 'Pendiente de aceptación' ? (
                      <span className="bg-amber-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-md font-sans tracking-normal flex items-center space-x-1 shadow-2xs">
                        <AlertTriangle size={11} className="mr-1" />
                        Acción requerida · Nuevo reajuste
                      </span>
                    ) : (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-md font-sans tracking-normal flex items-center space-x-1 border border-emerald-200">
                        <CheckCircle2 size={11} className="mr-1 text-emerald-600" />
                        Reajuste aceptado y vigente
                      </span>
                    )}
                    <span className="text-xs text-slate-500 font-semibold font-sans">
                      Notificado el {adj.fechaNotificacion} · Vigencia: <strong className="text-slate-800">{adj.fechaVigencia}</strong>
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-slate-850 font-din tracking-tight">
                    {adj.titulo} — Promedio ponderado {adj.porcentajePromedio}
                  </h3>

                  <p className="text-xs text-slate-600 font-sans leading-relaxed max-w-3xl">
                    {adj.motivo}
                  </p>

                  {adj.estado === 'Aceptado' && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 text-xs text-emerald-800 font-sans flex items-center space-x-2">
                      <UserCheck size={15} className="text-emerald-600 shrink-0" />
                      <span>
                        Firmado digitalmente por: <strong>{adj.aceptadoPor}</strong> el {adj.fechaAceptacion} ({adj.comprobanteId})
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => setSelectedAdjustmentForModal(adj)}
                    className={`btn text-xs px-4 py-2 rounded-xl font-bold cursor-pointer flex items-center space-x-2 shadow-xs ${
                      adj.estado === 'Pendiente de aceptación'
                        ? 'btn-primary'
                        : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Eye size={14} />
                    <span>{adj.estado === 'Pendiente de aceptación' ? 'Revisar y aceptar reajuste' : 'Ver detalle del acuerdo'}</span>
                  </button>
                </div>

              </div>
            </div>
          ))}

          {/* Active Contracted Tariff Matrix */}
          <div className="bg-white rounded-2xl border border-starken-border shadow-xs overflow-hidden">
            
            <div className="p-5 border-b border-starken-border bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-base font-black text-slate-850 font-din tracking-wide">
                    Matriz tarifaria vigente — Cuenta corriente {selectedAccount.split(' — ')[0]}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 font-sans mt-0.5">
                  Tarifas netas por tramo de peso con descuento comercial corporativo del <strong>25%</strong> ya aplicado sobre tarifa lista.
                </p>
              </div>

              {/* Quick actions */}
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => {
                    const csvContent = 'Tramo,RM Urbano,Norte Chico,Sur Cercano,Norte Grande,Sur Austral,Descuento\n' +
                      TARIFF_DATA.map(r => `"${r.tramo}",${r.rmUrbano},${r.norteChico},${r.surCercano},${r.norteGrande},${r.surAustral},"${r.descConvenio}"`).join('\n');
                    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.setAttribute('href', url);
                    link.setAttribute('download', `tarifario_vigente_starken_${selectedAccount.split(' ')[0]}.csv`);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    if (showToast) showToast('Tarifario exportado a CSV exitosamente.', 'info');
                  }}
                  className="btn btn-secondary text-xs py-1.5 px-3 flex items-center space-x-1.5 cursor-pointer"
                >
                  <Download size={13} />
                  <span>Descargar matriz Excel/CSV</span>
                </button>
              </div>
            </div>

            {/* Matrix Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100/80 border-b border-starken-border text-slate-700 font-din font-extrabold text-[11px] tracking-wider">
                    <th className="py-3 px-4">Tramo de peso</th>
                    <th className="py-3 px-3">RM (urbano)</th>
                    <th className="py-3 px-3">Norte Chico (IV - V)</th>
                    <th className="py-3 px-3">Sur Cercano (VI - VIII)</th>
                    <th className="py-3 px-3">Norte Grande (I - II - XV)</th>
                    <th className="py-3 px-3">Sur Austral (XI - XII)</th>
                    <th className="py-3 px-4 text-center">Descuento B2B</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-starken-border font-sans">
                  {TARIFF_DATA.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-850 font-din text-xs">
                        {row.tramo}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-800">
                        ${row.rmUrbano.toLocaleString('es-CL')}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-700">
                        ${row.norteChico.toLocaleString('es-CL')}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-700">
                        ${row.surCercano.toLocaleString('es-CL')}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-700">
                        ${row.norteGrande.toLocaleString('es-CL')}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-700">
                        ${row.surAustral.toLocaleString('es-CL')}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-block bg-teal-50 text-[#33798C] font-sans font-bold text-[11px] px-2 py-0.5 rounded border border-teal-200">
                          -{row.descConvenio}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Notes footer */}
            <div className="p-4 bg-slate-50/70 border-t border-starken-border text-xs text-slate-500 font-sans space-y-1">
              <div className="flex items-center space-x-1.5 text-slate-700 font-bold">
                <Info size={13} className="text-[#33798C]" />
                <span>Condiciones de aplicación tarifaria:</span>
              </div>
              <p className="text-[11px] leading-normal pl-4">
                • Los valores son en pesos chilenos (CLP) y no incluyen IVA (19%).<br />
                • Factor de equivalencia volumétrica aplicado: 1 m³ = 250 kg (Estándar paquetería B2B).<br />
                • Recargo por combustible indexado vigente: +8.5% sobre la tarifa base de flete.
              </p>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: CONTRATOS Y TÉRMINOS LEGALES */}
      {/* ========================================================================= */}
      {activeTab === 'contratos' && (
        <div className="space-y-6">
          
          {/* Header context card */}
          <div className="bg-white rounded-2xl border border-starken-border p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200 font-sans">
                  Auditoría legal OK
                </span>
                <h3 className="text-base font-black text-slate-850 font-din tracking-wide">
                  Repositorio de documentos & contratos comerciales
                </h3>
              </div>
              <p className="text-xs text-slate-500 font-sans max-w-2xl">
                Accede a las copias firmadas de tu contrato marco, anexos de cuenta corriente, niveles de servicio (SLA) y comprobantes de aceptación de términos.
              </p>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <div className="text-right hidden sm:block">
                <span className="text-[10px] text-slate-600 font-sans font-bold block">Estado contractual</span>
                <span className="text-xs font-bold text-emerald-700 font-sans">100% Regularizado</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
                <ShieldCheck size={20} />
              </div>
            </div>
          </div>

          {/* Documents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CONTRACT_DOCUMENTS.map((doc) => (
              <div 
                key={doc.id}
                className="bg-white rounded-2xl border border-starken-border p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  
                  {/* Top badges */}
                  <div className="flex items-center justify-between">
                    <span className="bg-[#33798C]/10 text-[#33798C] text-[10px] font-bold px-2.5 py-0.5 rounded-md font-sans tracking-normal">
                      {doc.tipo}
                    </span>
                    <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <Check size={10} className="mr-1" />
                      {doc.estado}
                    </span>
                  </div>

                  {/* Title */}
                  <h4 className="font-bold text-slate-850 text-sm font-din tracking-wide leading-snug">
                    {doc.nombre}
                  </h4>

                  {/* Metadata */}
                  <div className="space-y-1.5 text-xs text-slate-700 font-sans bg-slate-100/70 p-3 rounded-xl border border-slate-200">
                    <div className="flex justify-between">
                      <span className="text-slate-700 font-semibold">Fecha de suscripción:</span>
                      <span className="font-bold text-slate-900">{doc.fechaFirma}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-700 font-semibold">Vigencia:</span>
                      <span className="font-bold text-slate-900">{doc.vigenciaHasta}</span>
                    </div>
                    {doc.cupoAprobado && (
                      <div className="flex justify-between">
                        <span className="text-slate-700 font-semibold">Línea aprobada:</span>
                        <span className="font-black text-teal-800">{doc.cupoAprobado}</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-1 border-t border-slate-300/80 text-[11px]">
                      <span className="text-slate-700 font-semibold">Hash de verificación:</span>
                      <span className="font-mono font-bold text-slate-800">{doc.codigoVerificacion}</span>
                    </div>
                  </div>

                </div>

                {/* Card actions */}
                <div className="pt-2 flex items-center justify-between border-t border-slate-200">
                  <span className="text-[11px] text-slate-600 font-semibold font-sans">
                    {doc.archivoNombre} ({doc.tamano})
                  </span>

                  <button
                    onClick={() => {
                      if (showToast) showToast(`Descargando copia legal certificada de "${doc.nombre}"...`, 'info');
                    }}
                    className="btn btn-secondary text-xs py-1.5 px-3 flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Download size={13} />
                    <span>Descargar PDF</span>
                  </button>
                </div>

              </div>
            ))}
          </div>

          {/* Terms and Conditions Acceptance History & Advisory Card */}
          <div className="bg-white rounded-2xl border border-starken-border p-5 shadow-xs space-y-4">
            <h4 className="font-black text-slate-850 text-sm font-din tracking-wide flex items-center space-x-2">
              <FileCheck size={16} className="text-[#33798C]" />
              <span>Registro de términos, políticas y firmas electrónicas</span>
            </h4>
            
            <div className="text-xs text-slate-600 font-sans leading-relaxed space-y-2">
              <p>
                Conforme a la Ley N° 19.799 sobre Documentos Electrónicos y Firma Electrónica, todas las aceptaciones de reajustes tarifarios, anexos comerciales y términos de uso realizadas en el portal StarkenPro quedan registradas con huella digital criptográfica (SHA-256), IP de conexión, fecha y datos del apoderado.
              </p>
              <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-100 flex items-center justify-between flex-wrap gap-2 text-xs">
                <div className="flex items-center space-x-2 text-teal-900">
                  <Lock size={15} className="text-[#33798C]" />
                  <span>Tu cuenta cuenta con apoderado validado: <strong>Carlos Alberto Valenzuela (RUT: 12.840.119-3)</strong></span>
                </div>
                <button
                  onClick={() => {
                    if (showToast) showToast('Abriendo canal directo con tu Ejecutivo Legal y Comercial Starken...', 'info');
                  }}
                  className="text-[#33798C] font-din font-bold hover:underline text-xs flex items-center space-x-1 cursor-pointer"
                >
                  <span>Contactar ejecutivo legal</span>
                  <ExternalLink size={12} />
                </button>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: AUDITORÍA DE FACTURA POR ÓRDENES DE FLETE */}
      {/* ========================================================================= */}
      {selectedInvoiceForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
            onClick={() => setSelectedInvoiceForDetail(null)}
          />
          <div className="bg-white rounded-3xl border border-starken-border shadow-2xl max-w-4xl w-full max-h-[85vh] p-6 relative z-10 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedInvoiceForDetail(null)}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition cursor-pointer"
            >
              <X size={20} />
            </button>

            {/* Modal Header */}
            <div className="mb-4 pr-10 sm:pr-0 shrink-0 pb-4 border-b border-slate-200">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-[#ECF5F7] text-[#33798C] border border-[#33798C]/20 flex items-center justify-center shrink-0 shadow-xs">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="font-black text-lg text-slate-850 font-din tracking-wide">
                    Detalle de órdenes de flete — {selectedInvoiceForDetail.id}
                  </h3>
                  <p className="text-xs font-bold text-slate-400 font-sans">
                    Conciliación & desglose contable de envíos facturados
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto space-y-4 font-sans text-xs pr-1 min-h-0">
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-slate-600 block text-[10px] font-din font-bold">Período</span>
                  <span className="font-bold text-slate-900">{selectedInvoiceForDetail.periodo}</span>
                </div>
                <div>
                  <span className="text-slate-600 block text-[10px] font-din font-bold">Total envíos</span>
                  <span className="font-bold text-slate-900">{selectedInvoiceForDetail.totalEnvios} OFs</span>
                </div>
                <div>
                  <span className="text-slate-600 block text-[10px] font-din font-bold">Total facturado</span>
                  <span className="font-black text-slate-900 font-mono text-sm">${selectedInvoiceForDetail.montoTotal.toLocaleString('es-CL')}</span>
                </div>
                <div>
                  <span className="text-slate-600 block text-[10px] font-din font-bold">Estado</span>
                  <span className="font-bold text-emerald-700">{selectedInvoiceForDetail.estado}</span>
                </div>
              </div>

              {selectedInvoiceForDetail.detallesOF && selectedInvoiceForDetail.detallesOF.length > 0 ? (
                <div className="border border-starken-border rounded-2xl overflow-hidden">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#F0F6F8] border-b border-starken-border text-slate-600 font-black font-din text-xs">
                        <th className="py-2.5 px-3">N° OF</th>
                        <th className="py-2.5 px-3">Fecha</th>
                        <th className="py-2.5 px-3">Origen</th>
                        <th className="py-2.5 px-3">Destino</th>
                        <th className="py-2.5 px-3">Servicio</th>
                        <th className="py-2.5 px-3">Peso</th>
                        <th className="py-2.5 px-3 text-right">Tarifa Neta</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {selectedInvoiceForDetail.detallesOF.map((ofItem, i) => (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-bold text-[#33798C] font-mono">{ofItem.of}</td>
                          <td className="py-2.5 px-3 text-slate-600">{ofItem.fecha}</td>
                          <td className="py-2.5 px-3 text-slate-700">{ofItem.origen}</td>
                          <td className="py-2.5 px-3 font-semibold text-slate-800">{ofItem.destino}</td>
                          <td className="py-2.5 px-3 text-slate-600">{ofItem.servicio}</td>
                          <td className="py-2.5 px-3 text-slate-600">{ofItem.peso}</td>
                          <td className="py-2.5 px-3 font-black text-slate-850 font-mono text-right">${ofItem.total.toLocaleString('es-CL')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-6 text-slate-400">
                  <p>Muestra condensada disponible. Puedes descargar el consolidado completo en Excel.</p>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <span className="text-xs font-medium text-slate-500 font-sans">
                Descarga para conciliar contra tu sistema contable / ERP.
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    if (showToast) showToast(`Descargando planilla de conciliación de OFs para ${selectedInvoiceForDetail.id}...`, 'info');
                  }}
                  className="btn btn-secondary text-xs px-3 py-1.5 flex items-center space-x-1.5 cursor-pointer"
                >
                  <Download size={14} />
                  <span>Exportar a Excel (.xlsx)</span>
                </button>
                <button
                  onClick={() => setSelectedInvoiceForDetail(null)}
                  className="btn btn-outline text-xs px-4 py-1.5 cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: ACEPTACIÓN FORMAL DE REAJUSTE TARIFARIO (FIRMA DIGITAL) */}
      {/* ========================================================================= */}
      {selectedAdjustmentForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
            onClick={() => setSelectedAdjustmentForModal(null)}
          />
          <div className="bg-white rounded-3xl border border-starken-border shadow-2xl max-w-2xl w-full max-h-[85vh] p-6 relative z-10 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedAdjustmentForModal(null)}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition cursor-pointer"
            >
              <X size={20} />
            </button>
            
            <div className="mb-4 pr-10 sm:pr-0 shrink-0 pb-4 border-b border-slate-200">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A] flex items-center justify-center shrink-0 shadow-xs">
                  <FileSignature size={24} />
                </div>
                <div>
                  <h3 className="font-black text-lg text-slate-850 font-din tracking-wide">
                    Aceptación formal de reajuste tarifario
                  </h3>
                  <p className="text-xs font-bold text-slate-400 font-sans">
                    {selectedAdjustmentForModal.titulo}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 font-sans text-xs pr-1 min-h-0">
              
              {/* Context info */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
                <span className="text-[10px] text-slate-600 font-din font-bold">Fundamento contractual</span>
                <p className="text-slate-700 text-xs italic leading-relaxed">
                  "{selectedAdjustmentForModal.clausulaContrato}"
                </p>
                <div className="pt-2 flex justify-between text-[11px] text-slate-600 border-t border-slate-200">
                  <span>Fecha de vigencia: <strong>{selectedAdjustmentForModal.fechaVigencia}</strong></span>
                  <span>Impacto promedio: <strong className="text-amber-700">{selectedAdjustmentForModal.porcentajePromedio}</strong></span>
                </div>
              </div>

              {/* Impact by zone comparison table */}
              {selectedAdjustmentForModal.impactoPorZona && (
                <div>
                  <span className="text-xs font-bold text-slate-800 font-din mb-2 block">
                    Comparativa de variación por cobertura geográfica:
                  </span>
                  <div className="border border-starken-border rounded-2xl overflow-hidden">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#F0F6F8] border-b border-starken-border text-slate-600 font-black font-din text-[10px]">
                          <th className="py-2 px-3">Zona Geográfica</th>
                          <th className="py-2 px-3">Tarifa Actual</th>
                          <th className="py-2 px-3">Nueva Tarifa</th>
                          <th className="py-2 px-3 text-right">Variación</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {selectedAdjustmentForModal.impactoPorZona.map((z, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="py-2 px-3 font-semibold text-slate-800">{z.zona}</td>
                            <td className="py-2 px-3 text-slate-500 font-mono">{z.anterior}</td>
                            <td className="py-2 px-3 font-bold text-slate-850 font-mono">{z.nuevo}</td>
                            <td className="py-2 px-3 font-bold text-amber-700 text-right">{z.variacion}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Legal Representative Details */}
              {selectedAdjustmentForModal.estado === 'Pendiente de aceptación' ? (
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-bold text-slate-800 font-din block">
                    Datos del apoderado legal firmante:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-slate-500 font-bold block mb-1.5">Nombre Completo Apoderado</label>
                      <input
                        type="text"
                        value={apoderadoNombre}
                        onChange={(e) => setApoderadoNombre(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 font-sans outline-none focus:border-[#33798C]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 font-bold block mb-1.5">RUT Apoderado</label>
                      <input
                        type="text"
                        value={apoderadoRut}
                        onChange={(e) => setApoderadoRut(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 font-sans outline-none focus:border-[#33798C]"
                      />
                    </div>
                  </div>

                  {/* Checkbox declaration */}
                  <label className="flex items-start space-x-2.5 p-3 rounded-2xl border border-teal-200 bg-teal-50/50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={acceptedCheckbox}
                      onChange={(e) => setAcceptedCheckbox(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded text-[#33798C] focus:ring-[#33798C] cursor-pointer"
                    />
                    <span className="text-[11px] text-slate-700 leading-snug">
                      Declaro actuar con poder de representación suficiente de la empresa y <strong>acepto formalmente el nuevo anexo tarifario</strong> para que entre en vigencia en la fecha estipulada.
                    </span>
                  </label>
                </div>
              ) : (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 space-y-1 text-emerald-800">
                  <div className="font-bold flex items-center space-x-1.5">
                    <CheckCircle2 size={15} className="text-emerald-600" />
                    <span>Este reajuste ya se encuentra formalmente aceptado</span>
                  </div>
                  <p className="text-[11px] text-emerald-700">
                    Firmado por: {selectedAdjustmentForModal.aceptadoPor} el {selectedAdjustmentForModal.fechaAceptacion}
                  </p>
                </div>
              )}

            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between shrink-0">
              <button
                onClick={() => setSelectedAdjustmentForModal(null)}
                className="btn btn-outline text-xs px-4 py-2 cursor-pointer"
              >
                Cerrar
              </button>

              {selectedAdjustmentForModal.estado === 'Pendiente de aceptación' && (
                <button
                  onClick={() => handleAcceptPriceAdjustment(selectedAdjustmentForModal.id)}
                  disabled={!acceptedCheckbox}
                  className={`btn text-xs px-5 py-2 font-bold flex items-center space-x-2 cursor-pointer ${
                    acceptedCheckbox ? 'btn-primary' : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <FileCheck size={14} />
                  <span>Confirmar aceptación digital</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: NOTIFICACIÓN DE PAGO / TRANSFERENCIA */}
      {/* ========================================================================= */}
      {paymentModalOpen && paymentInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
            onClick={() => setPaymentModalOpen(false)}
          />
          <div className="bg-white rounded-3xl border border-starken-border shadow-2xl max-w-lg w-full p-6 relative z-10 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setPaymentModalOpen(false)}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition cursor-pointer"
            >
              <X size={20} />
            </button>

            {/* Modal Header */}
            <div className="mb-4 pr-10 sm:pr-0 shrink-0 pb-4 border-b border-slate-200">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-[#ECF5F7] text-[#33798C] border border-[#33798C]/20 flex items-center justify-center shrink-0 shadow-xs">
                  <DollarSign size={24} />
                </div>
                <div>
                  <h3 className="font-black text-lg text-slate-850 font-din tracking-wide">
                    Notificar pago de factura
                  </h3>
                  <p className="text-xs font-bold text-slate-400 font-sans">
                    {paymentInvoice.id} — Total: ${paymentInvoice.montoTotal.toLocaleString('es-CL')} CLP
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleRegisterPaymentSubmit} className="space-y-4 font-sans text-xs">
              
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-600 font-din font-bold block">Resumen del documento</span>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600">Período facturado:</span>
                  <span className="font-semibold text-slate-800">{paymentInvoice.periodo}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600">Monto total a pagar:</span>
                  <span className="font-black text-slate-850 font-mono text-sm">${paymentInvoice.montoTotal.toLocaleString('es-CL')}</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 font-din block mb-1.5">
                  N° de comprobante o transacción bancaria *
                </label>
                <input
                  type="text"
                  placeholder="Ej: TRX-9948210-BCHILE"
                  value={transferRef}
                  onChange={(e) => setTransferRef(e.target.value)}
                  required
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-mono outline-none focus:border-[#33798C]"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Ingresa el código que figura en el comprobante emitido por tu banco.
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 font-din block mb-1.5">
                  Adjuntar comprobante (opcional - PDF / JPG)
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center hover:bg-slate-50 transition-colors cursor-pointer">
                  <UploadCloud size={24} className="mx-auto text-slate-400 mb-1" />
                  <span className="text-xs font-semibold text-[#33798C] block">Arrastra o selecciona el archivo del comprobante</span>
                  <span className="text-[10px] text-slate-400">PDF, PNG o JPG hasta 5 MB</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setPaymentModalOpen(false)}
                  className="btn btn-outline"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary font-bold"
                >
                  Registrar notificación
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
