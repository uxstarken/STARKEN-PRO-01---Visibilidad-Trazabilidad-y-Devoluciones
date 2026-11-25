import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  AlertTriangle, Download, Search, Check, Edit, ChevronDown, ChevronUp, X, Home, ChevronLeft, ChevronRight,
  Calendar, Clock, ShieldAlert, CheckCircle2, ArrowRight, Star
} from 'lucide-react';

export default function MisGestionesTab({ 
  shipmentsData, 
  onTriggerAction, 
  _onExport, 
  selectedOF, 
  setSelectedOF,
  onCompleteGestion,
  favorites = [],
  onToggleFavorite
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('Todas');
  const [sortField, setSortField] = useState('slaMinutes');
  const [sortDirection, setSortDirection] = useState('asc');

  // Active KPI card state
  const [activeCard, setActiveCard] = useState(null); // 'por_gestionar', 'en_gestion', 'gestionado' or null

  // DOM References
  const detailSectionRef = useRef(null);

  // Header search toggle and value states
  const [activeHeaderSearches, setActiveHeaderSearches] = useState({
    fechaExcepcion: false,
    ordenFlete: false,
    tipoExcepcion: false,
    fechaCompromiso: false,
    comunaDestino: false,
    estado: false,
  });

  const [headerSearchValues, setHeaderSearchValues] = useState({
    fechaExcepcion: '',
    ordenFlete: '',
    tipoExcepcion: '',
    fechaCompromiso: '',
    comunaDestino: '',
    estado: '',
  });

  // Checkboxes for mass return
  const [massReturnIds, setMassReturnIds] = useState([]);

  // Autocomplete states for trazabilidad rápida
  const [ofSearchQuery, setOfSearchQuery] = useState('');
  const [showOfDropdown, setShowOfDropdown] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Row expand states for detailed view
  const [expandedRows, setExpandedRows] = useState([]);

  // SLA en riesgo modal state
  const [isSlaRiesgoModalOpen, setIsSlaRiesgoModalOpen] = useState(false);
  const [slaCurrentPage, setSlaCurrentPage] = useState(1);
  const [expandedSlaRows, setExpandedSlaRows] = useState([]);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleToggleRowExpand = (id) => {
    setExpandedRows(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleToggleSlaRowExpand = (id) => {
    setExpandedSlaRows(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSlaRowClick = (e, id) => {
    if (e.target.closest('button, input, select, textarea, a, svg, path')) {
      return;
    }
    handleToggleSlaRowExpand(id);
  };

  useEffect(() => {
    if (!isSlaRiesgoModalOpen) {
      setExpandedSlaRows([]);
      setSlaCurrentPage(1);
    }
  }, [isSlaRiesgoModalOpen]);

  const handleRowClick = (e, id) => {
    if (e.target.closest('button, input, select, textarea, a, svg, path')) {
      return;
    }
    handleToggleRowExpand(id);
  };

  // Reset expanded rows on filter/page changes
  useEffect(() => {
    setExpandedRows([]);
  }, [headerSearchValues, activeCard, currentPage, itemsPerPage]);

  // Helper selectors
  const getExcepcionDate = (shipment) => {
    if (shipment.fechaExcepcion !== undefined && shipment.fechaExcepcion !== '') return shipment.fechaExcepcion;
    return '05-08-2026';
  };
  const getDocNumber = (shipment) => {
    if (shipment.nDocumento !== undefined) return shipment.nDocumento;
    return `658${shipment.id.toString().slice(-3)}`;
  };
  const getCommitmentDate = (shipment) => {
    if (shipment.fechaCompromiso !== undefined && shipment.fechaCompromiso !== '') return shipment.fechaCompromiso;
    return '06-08-2026';
  };
  const getComuna = (shipment) => {
    let rawComuna = '';
    if (shipment.comunaDestino !== undefined && shipment.comunaDestino !== '') {
      rawComuna = shipment.comunaDestino;
    } else {
      const comunas = ['ANTOFAGASTA', 'RANCAGUA', 'LO ESPEJO', 'MACUL'];
      rawComuna = comunas[shipment.id % comunas.length];
    }
    return rawComuna.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
  };
  const formatDateToDDMMYYYY = (dateStr) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

  // Get additional details for row expander
  const getAdditionalDetails = (shipment) => {
    if (shipment.direccionDestino !== undefined) {
      return {
        direccionDestino: shipment.direccionDestino,
        rutDestinatario: shipment.rutDestinatario,
        nombreDestinatario: shipment.nombreDestinatario,
        emailDestinatario: shipment.emailDestinatario,
        telefonoDestinatario: shipment.telefonoDestinatario,
        fechaEmision: shipment.fechaEmision,
        fechaRecepcion: shipment.fechaRecepcion,
        nCtaCte: shipment.nCtaCte,
        tipoEntrega: shipment.tipoEntrega,
        tipoServicio: shipment.tipoServicio,
        comunaOrigen: shipment.comunaOrigen,
        accionRealizada: shipment.accionRealizada,
        valorTotal: shipment.valorTotal,
        fechaGestion: shipment.fechaGestion,
        nombreGestor: shipment.nombreGestor
      };
    }
    const id = shipment.id;
    const detailsMap = {
      275161618: {
        direccionDestino: 'Rosales 3436',
        rutDestinatario: '15.688.949-0',
        nombreDestinatario: 'Jeraldin Alejandra P.',
        emailDestinatario: 'Info@swisstradinggroup.uk',
        telefonoDestinatario: '976921527',
        fechaEmision: '04-08-2026',
        fechaRecepcion: '04-08-2026',
        nCtaCte: '44379',
        tipoEntrega: 'Domicilio',
        tipoServicio: 'Express',
        comunaOrigen: 'San Bernardo'
      },
      275067401: {
        direccionDestino: 'Pupilla 01594 Piso 1 Dpto 203',
        rutDestinatario: '16.745.234-K',
        nombreDestinatario: 'Juan Carlos Espinoza .',
        emailDestinatario: 'Jcespinozah60@gmail.com',
        telefonoDestinatario: '958579337',
        fechaEmision: '03-08-2026',
        fechaRecepcion: '01-01-1970',
        nCtaCte: '44379',
        tipoEntrega: 'Domicilio',
        tipoServicio: 'Normal',
        comunaOrigen: 'San Bernardo'
      },
      275105257: {
        direccionDestino: 'Pasaje 62',
        rutDestinatario: '12.890.456-2',
        nombreDestinatario: 'Luis Humberto Lucero',
        emailDestinatario: 'Info@swisstradinggroup.uk',
        telefonoDestinatario: '988204005',
        fechaEmision: '03-08-2026',
        fechaRecepcion: '01-01-1970',
        nCtaCte: '44379',
        tipoEntrega: 'Domicilio',
        tipoServicio: 'Normal',
        comunaOrigen: 'San Bernardo'
      },
      274942088: {
        direccionDestino: 'Siria 3396 Piso 8 Dpto 803',
        rutDestinatario: '14.567.890-5',
        nombreDestinatario: 'Jose Jaime Sarovic L.',
        emailDestinatario: 'Jose.sarovic@gmail.com',
        telefonoDestinatario: '976956978',
        fechaEmision: '31-07-2026',
        fechaRecepcion: '01-01-1970',
        nCtaCte: '778194',
        tipoEntrega: 'Domicilio',
        tipoServicio: 'Normal',
        comunaOrigen: 'Las Condes'
      },
      274494880: {
        direccionDestino: 'Termas De Puritama 3832',
        rutDestinatario: '18.901.234-8',
        nombreDestinatario: 'Jose Roberto Mondaca',
        emailDestinatario: 'Info@swisstradinggroup.uk',
        telefonoDestinatario: '982164216',
        fechaEmision: '23-07-2026',
        fechaRecepcion: '01-01-1970',
        nCtaCte: '778194',
        tipoEntrega: 'Domicilio',
        tipoServicio: 'Normal',
        comunaOrigen: 'Las Condes'
      }
    };

    if (detailsMap[id]) return detailsMap[id];

    return {
      direccionDestino: `Calle Ficticia ${id % 1000}`,
      rutDestinatario: `1${id % 9}.456.789-K`,
      nombreDestinatario: `Cliente Genérico ${id}`,
      emailDestinatario: `cliente_${id}@swisstrading.cl`,
      telefonoDestinatario: `9${id % 100000000}`,
      fechaEmision: '01-08-2026',
      fechaRecepcion: '02-08-2026',
      nCtaCte: '44379',
      tipoEntrega: 'Domicilio',
      tipoServicio: 'Normal',
      comunaOrigen: 'Santiago Centro'
    };
  };

  // Header search helpers
  const toggleHeaderSearch = (colName) => {
    setActiveHeaderSearches(prev => ({
      ...prev,
      [colName]: !prev[colName]
    }));
  };

  const handleHeaderSearchChange = (colName, val) => {
    setHeaderSearchValues(prev => ({
      ...prev,
      [colName]: val
    }));
  };

  // Toggle card selection
  const handleCardClick = (cardName) => {
    setActiveCard(prev => {
      const newVal = prev === cardName ? null : cardName;
      if (newVal) {
        setTimeout(() => {
          const mainEl = document.querySelector('main');
          const detailEl = detailSectionRef.current;
          if (mainEl && detailEl) {
            const offsetTop = detailEl.offsetTop;
            const stickyHeaderHeight = 160;
            mainEl.scrollTo({
              top: Math.max(0, offsetTop - stickyHeaderHeight),
              behavior: 'smooth'
            });
          }
        }, 100);
      }
      return newVal;
    });
  };

  // Filters for tables based on card states
  const pendingExceptions = useMemo(() => {
    return shipmentsData.filter(s => s.status === 'Excepción' && !s.actionTaken);
  }, [shipmentsData]);

  const enGestionExceptions = useMemo(() => {
    return shipmentsData.filter(s => s.status === 'En gestión' || (s.actionTaken && s.status !== 'Gestionado' && s.status !== 'Entregado'));
  }, [shipmentsData]);

  const gestionadasExceptions = useMemo(() => {
    return shipmentsData.filter(s => s.status === 'Gestionado' || s.status === 'Entregado');
  }, [shipmentsData]);

  // Active view filters
  const activeTableExceptions = useMemo(() => {
    if (activeCard === 'por_gestionar') return pendingExceptions;
    if (activeCard === 'en_gestion') return enGestionExceptions;
    if (activeCard === 'gestionado') return gestionadasExceptions;
    return [];
  }, [activeCard, pendingExceptions, enGestionExceptions, gestionadasExceptions]);

  const filteredActiveExceptions = useMemo(() => {
    return activeTableExceptions.filter(s => {
      const searchExcepcion = formatDateToDDMMYYYY(headerSearchValues.fechaExcepcion);
      const searchCompromiso = formatDateToDDMMYYYY(headerSearchValues.fechaCompromiso);

      const matchFecha = (activeCard === 'gestionado' ? (s.fechaSolicitud || '') : getExcepcionDate(s)).includes(searchExcepcion);
      const matchOrden = s.id.toString().includes(headerSearchValues.ordenFlete);
      const matchTipo = (s.reason || '').toLowerCase().includes(headerSearchValues.tipoExcepcion.toLowerCase());
      
      let matchCompromiso = true;
      if (activeCard !== 'gestionado') {
        matchCompromiso = getCommitmentDate(s).includes(searchCompromiso);
      }

      let matchComuna = true;
      if (headerSearchValues.comunaDestino) {
        matchComuna = getComuna(s).toLowerCase().includes(headerSearchValues.comunaDestino.toLowerCase());
      }

      let matchEstado = true;
      if (headerSearchValues.estado && s.estado) {
        matchEstado = s.estado.toLowerCase().includes(headerSearchValues.estado.toLowerCase());
      }

      return matchFecha && matchOrden && matchTipo && matchCompromiso && matchComuna && matchEstado;
    });
  }, [activeTableExceptions, headerSearchValues, activeCard]);

  // Reset page to 1 on filter or card change
  useEffect(() => {
    setCurrentPage(1);
  }, [headerSearchValues, activeCard]);

  // Compute paginated exceptions
  const paginatedExceptions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredActiveExceptions.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredActiveExceptions, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredActiveExceptions.length / itemsPerPage);

  const handleToggleMassReturnRow = (id) => {
    setMassReturnIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const isAllPageChecked = useMemo(() => {
    if (paginatedExceptions.length === 0) return false;
    return paginatedExceptions.every(s => massReturnIds.includes(s.id));
  }, [paginatedExceptions, massReturnIds]);

  const handleSelectAllMassReturn = () => {
    const pageIds = paginatedExceptions.map(s => s.id);
    if (isAllPageChecked) {
      setMassReturnIds(prev => prev.filter(id => !pageIds.includes(id)));
    } else {
      setMassReturnIds(prev => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const handleDownloadPendingCSV = () => {
    const listToExport = filteredActiveExceptions;
    if (listToExport.length === 0) return;

    let filename = 'excepciones_por_gestionar.csv';
    let headers = '';
    let csvContent = '';

    if (activeCard === 'por_gestionar') {
      filename = 'excepciones_por_gestionar.csv';
      headers = 'Fecha Excepcion,Orden Flete,N Documento,Tipo Excepcion,Fecha Compromiso,Comuna Destino\n';
      csvContent = headers + listToExport.map(s => 
        `"${getExcepcionDate(s)}",${s.id},"${getDocNumber(s)}","${(s.reason || '').toUpperCase()}","${getCommitmentDate(s)}","${getComuna(s)}"`
      ).join('\n');
    } else if (activeCard === 'en_gestion') {
      filename = 'excepciones_en_gestion.csv';
      headers = 'Fecha Excepcion,Fecha Solicitud Gestion,Orden Flete,Dias en Gestion,N Documento,Tipo Excepcion,Fecha Compromiso,Comuna Destino\n';
      csvContent = headers + listToExport.map(s => {
        const dias = s.diasEnGestion !== undefined ? s.diasEnGestion : 0;
        const fechaSol = s.fechaSolicitud || '';
        return `"${getExcepcionDate(s)}","${fechaSol}",${s.id},${dias},"${getDocNumber(s)}","${(s.reason || '').toUpperCase()}","${getCommitmentDate(s)}","${getComuna(s)}"`;
      }).join('\n');
    } else if (activeCard === 'gestionado') {
      filename = 'excepciones_gestionadas.csv';
      headers = 'Fecha Solicitud Gestion,Orden Flete Original,OF Actualizada,N Documento,Tipo Excepcion,Comuna Destino,Estado\n';
      csvContent = headers + listToExport.map(s => {
        const ofAct = s.ofActualizada !== undefined ? s.ofActualizada : '-';
        const doc = s.nDocumento !== undefined ? s.nDocumento : '-';
        const est = s.estado || '-';
        return `"${s.fechaSolicitud || ''}",${s.id},"${ofAct}","${doc}","${(s.reason || '').toUpperCase()}","${getComuna(s)}","${est}"`;
      }).join('\n');
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadSingleOF = (shipment) => {
    let filename = `of_${shipment.id}.csv`;
    let headers = '';
    let csvContent = '';

    if (activeCard === 'por_gestionar') {
      filename = `of_${shipment.id}_por_gestionar.csv`;
      headers = 'Fecha Excepcion,Orden Flete,N Documento,Tipo Excepcion,Fecha Compromiso,Comuna Destino\n';
      csvContent = headers + `"${getExcepcionDate(shipment)}",${shipment.id},"${getDocNumber(shipment)}","${(shipment.reason || '').toUpperCase()}","${getCommitmentDate(shipment)}","${getComuna(shipment)}"`;
    } else if (activeCard === 'en_gestion') {
      filename = `of_${shipment.id}_en_gestion.csv`;
      headers = 'Fecha Excepcion,Fecha Solicitud Gestion,Orden Flete,Dias en Gestion,N Documento,Tipo Excepcion,Fecha Compromiso,Comuna Destino\n';
      const dias = shipment.diasEnGestion !== undefined ? shipment.diasEnGestion : 0;
      const fechaSol = shipment.fechaSolicitud || '';
      csvContent = headers + `"${getExcepcionDate(shipment)}","${fechaSol}",${shipment.id},${dias},"${getDocNumber(shipment)}","${(shipment.reason || '').toUpperCase()}","${getCommitmentDate(shipment)}","${getComuna(shipment)}"`;
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculate status statistics
  const stats = useMemo(() => {
    const porGestionar = shipmentsData.filter(s => s.status === 'Excepción' && !s.actionTaken).length;
    const enGestion = shipmentsData.filter(s => s.status === 'En gestión' || (s.actionTaken && s.status !== 'Gestionado' && s.status !== 'Entregado')).length;
    const gestionadas = shipmentsData.filter(s => s.status === 'Gestionado' || s.status === 'Entregado').length;
    const slaEnRiesgo = shipmentsData.filter(s => s.status === 'Excepción' && (s.slaMinutes !== undefined && s.slaMinutes <= 120)).length;
    const criticas = shipmentsData.filter(s => s.priority === 'Alta' && s.status === 'Excepción').length;
    
    return { porGestionar, enGestion, gestionadas, slaEnRiesgo, criticas };
  }, [shipmentsData]);

  // Dynamic Motivos frecuentes statistics
  const reasonStats = useMemo(() => {
    const totalExceptions = shipmentsData.filter(s => s.status === 'Excepción');
    const total = totalExceptions.length;

    if (total === 0) {
      return {
        total: 0,
        incorrectaCount: 0,
        ausenteCount: 0,
        rechazoCount: 0,
        pctIncorrecta: 50,
        pctAusente: 27,
        pctRechazo: 23,
        dashIncorrecta: 110,
        dashAusente: 60,
        dashRechazo: 50
      };
    }

    const incorrectaCount = totalExceptions.filter(s => (s.reason || '').toLowerCase().includes('dirección') || (s.reason || '').toLowerCase().includes('direccion')).length;
    const ausenteCount = totalExceptions.filter(s => (s.reason || '').toLowerCase().includes('ausente')).length;
    const rechazoCount = totalExceptions.filter(s => (s.reason || '').toLowerCase().includes('rechazo') || (s.reason || '').toLowerCase().includes('rechazado') || (s.reason || '').toLowerCase().includes('devolución') || (s.reason || '').toLowerCase().includes('devolucion')).length;

    const pctIncorrecta = Math.max(0, Math.round((incorrectaCount / total) * 100));
    const pctAusente = Math.max(0, Math.round((ausenteCount / total) * 100));
    const pctRechazo = Math.max(0, 100 - pctIncorrecta - pctAusente);

    const circ = 220; // 2 * PI * 35 approx
    const dashIncorrecta = (pctIncorrecta / 100) * circ;
    const dashAusente = (pctAusente / 100) * circ;
    const dashRechazo = (pctRechazo / 100) * circ;

    return {
      total,
      incorrectaCount,
      ausenteCount,
      rechazoCount,
      pctIncorrecta,
      pctAusente,
      pctRechazo,
      dashIncorrecta,
      dashAusente,
      dashRechazo
    };
  }, [shipmentsData]);

  // Combined SLA en riesgo and Critical shipments
  const shipmentsSlaEnRiesgo = useMemo(() => {
    return shipmentsData.filter(s => 
      s.status === 'Excepción' && 
      (s.priority === 'Alta' || (s.slaMinutes !== undefined && s.slaMinutes <= 120))
    );
  }, [shipmentsData]);

  const slaItemsPerPage = windowWidth < 768 ? 3 : 10;
  const paginatedSlaShipments = useMemo(() => {
    const startIndex = (slaCurrentPage - 1) * slaItemsPerPage;
    return shipmentsSlaEnRiesgo.slice(startIndex, startIndex + slaItemsPerPage);
  }, [shipmentsSlaEnRiesgo, slaCurrentPage]);

  const totalSlaPages = Math.ceil(shipmentsSlaEnRiesgo.length / slaItemsPerPage);

  // Filter & Sort table data
  const filteredShipments = useMemo(() => {
    return shipmentsData
      .filter(shipment => {
        if (shipment.status !== 'Excepción') return false;
        
        const matchesSearch = 
          shipment.id.toString().includes(searchTerm) ||
          shipment.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
          shipment.recipient.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesPriority = priorityFilter === 'Todas' || shipment.priority === priorityFilter;

        return matchesSearch && matchesPriority;
      })
      .sort((a, b) => {
        let fieldA = a[sortField];
        let fieldB = b[sortField];
        
        if (typeof fieldA === 'string') {
          fieldA = fieldA.toLowerCase();
          fieldB = fieldB.toLowerCase();
        }
        
        if (fieldA < fieldB) return sortDirection === 'asc' ? -1 : 1;
        if (fieldA > fieldB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
  }, [shipmentsData, searchTerm, priorityFilter, sortField, sortDirection]);

  // Get current active OF tracking details
  const activeOFData = useMemo(() => {
    return shipmentsData.find(s => s.id === selectedOF) || filteredShipments[0] || shipmentsData[0];
  }, [shipmentsData, selectedOF, filteredShipments]);

  // Synchronize input search query when active OF changes
  useEffect(() => {
    if (activeOFData) {
      setOfSearchQuery(activeOFData.id.toString());
    } else {
      setOfSearchQuery('');
    }
  }, [activeOFData]);

  // Compute matching OFs for autocompletion
  const matchingOFs = useMemo(() => {
    if (!ofSearchQuery) return [];
    const query = ofSearchQuery.toLowerCase();
    return shipmentsData
      .filter(s => s.status === 'Excepción' || s.status === 'En gestión' || s.status === 'Gestionado' || s.status === 'Redestinado' || s.status === 'Devuelto' || s.status === 'En reparto' || s.status === 'Entregado')
      .filter(s => s.id.toString().startsWith(query) || s.id.toString().includes(query))
      .slice(0, 5);
  }, [shipmentsData, ofSearchQuery]);

  return (
    <div className="space-y-6">
      {/* Sticky KPI Cards Header with Empresas styling */}
      <div className="sticky top-0 z-20 bg-[#f8fafc]/95 backdrop-blur-md py-3 px-4 md:px-8 -mx-4 md:-mx-8 border-b border-starken-border/80 shadow-xs">
        {/* KPI Cards Grid */}
        <div className="grid grid-cols-3 md:grid-cols-[1fr_1fr_1fr_auto] gap-3 sm:gap-4 w-full">
          {/* KPI 1: Por Gestionar (Amber Accent) */}
          <div 
            onClick={() => handleCardClick('por_gestionar')}
            className={`rounded-xl p-3.5 flex flex-col justify-between border transition-all duration-200 cursor-pointer select-none ${
              activeCard === 'por_gestionar' 
                ? 'bg-[#FFFBEB] border-[#F59E0B] border-l-6 border-l-[#F59E0B] ring-2 ring-[#F59E0B]/20 shadow-md scale-[1.01]' 
                : activeCard !== null 
                  ? 'bg-white/80 border-starken-border border-l-4 border-l-[#F59E0B]/40 opacity-50 hover:opacity-90' 
                  : 'bg-white border-starken-border border-l-4 border-l-[#F59E0B] shadow-xs hover:shadow-md hover:border-[#F59E0B]/50'
            }`}
          >
            <div className="text-[11px] sm:text-xs font-bold text-slate-600 font-din tracking-wide truncate">Por gestionar</div>
            <div className="mt-1.5 flex flex-col sm:flex-row sm:items-baseline sm:space-x-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-850 font-din leading-none">{stats.porGestionar}</span>
              <span className="text-[10px] sm:text-xs font-bold text-[#D97706] font-sans mt-0.5 sm:mt-0">Pendientes</span>
            </div>
            <div className="hidden sm:block text-[11px] text-slate-400 mt-2 font-bold font-sans">Últimos 7 días</div>
          </div>

          {/* KPI 2: En gestión (Corporate Teal Accent) */}
          <div 
            onClick={() => handleCardClick('en_gestion')}
            className={`rounded-xl p-3.5 flex flex-col justify-between border transition-all duration-200 cursor-pointer select-none ${
              activeCard === 'en_gestion' 
                ? 'bg-[#ECF5F7] border-[#33798C] border-l-6 border-l-[#33798C] ring-2 ring-[#33798C]/20 shadow-md scale-[1.01]' 
                : activeCard !== null 
                  ? 'bg-white/80 border-starken-border border-l-4 border-l-[#33798C]/40 opacity-50 hover:opacity-90' 
                  : 'bg-white border-starken-border border-l-4 border-l-[#33798C] shadow-xs hover:shadow-md hover:border-[#33798C]/50'
            }`}
          >
            <div className="text-[11px] sm:text-xs font-bold text-slate-600 font-din tracking-wide truncate">En gestión</div>
            <div className="mt-1.5 flex flex-col sm:flex-row sm:items-baseline sm:space-x-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-850 font-din leading-none">{stats.enGestion}</span>
              <span className="text-[10px] sm:text-xs font-bold text-[#33798C] font-sans mt-0.5 sm:mt-0">Iniciados</span>
            </div>
            <div className="hidden sm:block text-[11px] text-slate-400 mt-2 font-bold font-sans">Proceso activo</div>
          </div>

          {/* KPI 3: Gestionado (Deep Teal Accent) */}
          <div 
            onClick={() => handleCardClick('gestionado')}
            className={`rounded-xl p-3.5 flex flex-col justify-between border transition-all duration-200 cursor-pointer select-none ${
              activeCard === 'gestionado' 
                ? 'bg-[#F0F6F8] border-[#1e4f5e] border-l-6 border-l-[#1e4f5e] ring-2 ring-[#1e4f5e]/20 shadow-md scale-[1.01]' 
                : activeCard !== null 
                  ? 'bg-white/80 border-starken-border border-l-4 border-l-[#1e4f5e]/40 opacity-50 hover:opacity-90' 
                  : 'bg-white border-starken-border border-l-4 border-l-[#1e4f5e] shadow-xs hover:shadow-md hover:border-[#1e4f5e]/50'
            }`}
          >
            <div className="text-[11px] sm:text-xs font-bold text-slate-600 font-din tracking-wide truncate">Gestionados</div>
            <div className="mt-1.5 flex flex-col sm:flex-row sm:items-baseline sm:space-x-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-850 font-din leading-none">{stats.gestionadas}</span>
              <span className="text-[10px] sm:text-xs font-bold text-[#1e4f5e] font-sans mt-0.5 sm:mt-0">Cerradas</span>
            </div>
            <div className="hidden sm:block text-[11px] text-slate-400 mt-2 font-bold font-sans">En el período</div>
          </div>

          {/* Small Navigation Home Card */}
          <div 
            onClick={() => setActiveCard(null)}
            className={`rounded-xl py-2 px-4 md:p-0 flex items-center justify-center border transition-all duration-200 cursor-pointer select-none text-xs font-bold font-sans h-10 md:h-full w-full col-span-3 md:col-span-1 md:w-14 shadow-xs ${
              activeCard === null 
                ? 'bg-[#33798C] text-white border-[#33798C] shadow-md' 
                : 'bg-white border-starken-border hover:bg-[#ECF5F7] hover:border-[#33798C] text-slate-600 hover:text-[#33798C]'
            }`}
            title="Ir al inicio / Vista general"
          >
            <Home size={20} className={activeCard === null ? 'text-white' : 'text-slate-600'} />
          </div>
        </div>
      </div>

      {activeCard === 'por_gestionar' || activeCard === 'en_gestion' || activeCard === 'gestionado' ? (
        <div ref={detailSectionRef} className="bg-transparent md:bg-white rounded-2xl border-none md:border md:border-starken-border shadow-none md:shadow-xs p-0 md:p-6 space-y-4 animate-in fade-in slide-in-from-top-3 duration-250">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-starken-border/60">
            <div>
              <h3 className="text-base font-black text-slate-800 font-din tracking-wide flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#33798C]" />
                <span>
                  {activeCard === 'por_gestionar' 
                    ? 'Detalle de excepciones por gestionar' 
                    : activeCard === 'en_gestion' 
                    ? 'Detalle de excepciones en gestión' 
                    : 'Detalle de excepciones gestionadas'}
                </span>
              </h3>
            </div>
            <div className="flex items-center space-x-3 self-end md:self-auto">
              {Object.values(headerSearchValues).some(val => val !== '') && (
                <button
                  onClick={() => {
                    setHeaderSearchValues({
                      fechaExcepcion: '',
                      ordenFlete: '',
                      tipoExcepcion: '',
                      fechaCompromiso: '',
                      comunaDestino: '',
                      estado: '',
                    });
                  }}
                  className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center space-x-1 transition-colors cursor-pointer bg-red-50 hover:bg-red-100 px-3 py-1 rounded-lg border border-red-200"
                  title="Limpiar todos los filtros"
                >
                  <X size={12} />
                  <span>Limpiar filtros</span>
                </button>
              )}
              <span className="text-xs font-bold text-slate-500 font-din">
                {filteredActiveExceptions.length} de {activeTableExceptions.length} órdenes filtradas
              </span>
            </div>
          </div>

          {/* Table container */}
          <div className="overflow-x-auto border border-starken-border rounded-xl bg-white shadow-xs">
            <table className="w-full text-left border-collapse text-xs table-auto md:table-fixed">
              <thead>
                <tr className="bg-[#F0F6F8] border-b border-starken-border text-slate-600 font-bold text-xs font-din tracking-wider">
                  
                  {activeCard === 'gestionado' ? (
                    <>
                      {/* Column 1: Fecha solicitud de gestión */}
                      <th className="py-3 px-3 sm:px-4 w-[50%] md:w-[13%]">
                        <div className="flex items-center justify-start space-x-1.5">
                          <button 
                            onClick={() => toggleHeaderSearch('fechaExcepcion')}
                            className={`p-1 rounded transition cursor-pointer ${activeHeaderSearches.fechaExcepcion ? 'bg-[#33798C] text-white' : 'hover:text-[#33798C] hover:bg-[#ECF5F7] text-slate-500'}`}
                          >
                            <Search size={12} />
                          </button>
                          {headerSearchValues.fechaExcepcion && (
                            <button
                              onClick={() => handleHeaderSearchChange('fechaExcepcion', '')}
                              className="p-1 text-red-500 hover:text-red-700 rounded hover:bg-red-50 transition cursor-pointer"
                              title="Limpiar filtro"
                            >
                              <X size={12} />
                            </button>
                          )}
                          <span>Información</span>
                        </div>
                        {activeHeaderSearches.fechaExcepcion && (
                          <div className="mt-1.5 hidden md:block">
                            <input 
                              type="date" 
                              value={headerSearchValues.fechaExcepcion}
                              onChange={(e) => handleHeaderSearchChange('fechaExcepcion', e.target.value)}
                              className="w-[125px] bg-white border border-starken-border rounded px-2 py-1 text-[12px] font-bold text-[#33798C] outline-none focus:border-[#33798C] cursor-pointer"
                            />
                          </div>
                        )}
                      </th>

                      {/* Column 2: Orden de flete original */}
                      <th className="py-3 px-4 w-[13%] hidden md:table-cell">
                        <div className="flex items-center justify-start space-x-1.5">
                          <button 
                            onClick={() => toggleHeaderSearch('ordenFlete')}
                            className={`p-1 rounded transition cursor-pointer ${activeHeaderSearches.ordenFlete ? 'bg-[#33798C] text-white' : 'hover:text-[#33798C] hover:bg-[#ECF5F7] text-slate-500'}`}
                          >
                            <Search size={12} />
                          </button>
                          {headerSearchValues.ordenFlete && (
                            <button
                              onClick={() => handleHeaderSearchChange('ordenFlete', '')}
                              className="p-1 text-red-500 hover:text-red-700 rounded hover:bg-red-50 transition cursor-pointer"
                              title="Limpiar filtro"
                            >
                              <X size={12} />
                            </button>
                          )}
                          <span>OF Original</span>
                        </div>
                        {activeHeaderSearches.ordenFlete && (
                          <div className="relative mt-1.5 w-full">
                            <input 
                              type="text" 
                              placeholder="Filtrar OF..."
                              value={headerSearchValues.ordenFlete}
                              onChange={(e) => handleHeaderSearchChange('ordenFlete', e.target.value)}
                              className="w-full bg-white border border-starken-border rounded pl-2 pr-6 py-1 text-[12px] font-medium text-slate-800 outline-none focus:border-[#33798C]"
                            />
                          </div>
                        )}
                      </th>

                      {/* Column 3: OF Actualizada */}
                      <th className="py-3 px-4 w-[12%] hidden md:table-cell">OF Actualizada</th>

                      {/* Column 4: N° Documento */}
                      <th className="py-3 px-4 w-[10%] hidden md:table-cell">N° Doc.</th>

                      {/* Column 5: Tipo de excepción */}
                      <th className="py-3 px-4 w-[18%] hidden md:table-cell">
                        <div className="flex items-center justify-start space-x-1.5">
                          <button 
                            onClick={() => toggleHeaderSearch('tipoExcepcion')}
                            className={`p-1 rounded transition cursor-pointer ${activeHeaderSearches.tipoExcepcion ? 'bg-[#33798C] text-white' : 'hover:text-[#33798C] hover:bg-[#ECF5F7] text-slate-500'}`}
                          >
                            <Search size={12} />
                          </button>
                          {headerSearchValues.tipoExcepcion && (
                            <button
                              onClick={() => handleHeaderSearchChange('tipoExcepcion', '')}
                              className="p-1 text-red-500 hover:text-red-700 rounded hover:bg-red-50 transition cursor-pointer"
                              title="Limpiar filtro"
                            >
                              <X size={12} />
                            </button>
                          )}
                          <span>Tipo Excepción</span>
                        </div>
                        {activeHeaderSearches.tipoExcepcion && (
                          <div className="mt-1.5 w-full">
                            <input 
                              type="text" 
                              placeholder="Filtrar motivo..."
                              value={headerSearchValues.tipoExcepcion}
                              onChange={(e) => handleHeaderSearchChange('tipoExcepcion', e.target.value)}
                              className="w-full bg-white border border-starken-border rounded px-2 py-1 text-[12px] font-medium text-slate-800 outline-none focus:border-[#33798C]"
                            />
                          </div>
                        )}
                      </th>

                      {/* Column 6: Comuna destino */}
                      <th className="py-3 px-4 w-[12%] hidden md:table-cell">
                        <div className="flex items-center justify-start space-x-1.5">
                          <button 
                            onClick={() => toggleHeaderSearch('comunaDestino')}
                            className={`p-1 rounded transition cursor-pointer ${activeHeaderSearches.comunaDestino ? 'bg-[#33798C] text-white' : 'hover:text-[#33798C] hover:bg-[#ECF5F7] text-slate-500'}`}
                          >
                            <Search size={12} />
                          </button>
                          {headerSearchValues.comunaDestino && (
                            <button
                              onClick={() => handleHeaderSearchChange('comunaDestino', '')}
                              className="p-1 text-red-500 hover:text-red-700 rounded hover:bg-red-50 transition cursor-pointer"
                              title="Limpiar filtro"
                            >
                              <X size={12} />
                            </button>
                          )}
                          <span>Comuna</span>
                        </div>
                        {activeHeaderSearches.comunaDestino && (
                          <div className="mt-1.5 w-full">
                            <input 
                              type="text" 
                              placeholder="Filtrar comuna..."
                              value={headerSearchValues.comunaDestino}
                              onChange={(e) => handleHeaderSearchChange('comunaDestino', e.target.value)}
                              className="w-full bg-white border border-starken-border rounded px-2 py-1 text-[12px] font-medium text-slate-800 outline-none focus:border-[#33798C]"
                            />
                          </div>
                        )}
                      </th>

                      {/* Column 7: Estado */}
                      <th className="py-3 px-3 sm:px-4 w-[50%] md:w-[17%]">
                        <div className="flex items-center justify-start space-x-1.5">
                          <button 
                            onClick={() => toggleHeaderSearch('estado')}
                            className={`p-1 rounded transition cursor-pointer ${activeHeaderSearches.estado ? 'bg-[#33798C] text-white' : 'hover:text-[#33798C] hover:bg-[#ECF5F7] text-slate-500'}`}
                          >
                            <Search size={12} />
                          </button>
                          {headerSearchValues.estado && (
                            <button
                              onClick={() => handleHeaderSearchChange('estado', '')}
                              className="p-1 text-red-500 hover:text-red-700 rounded hover:bg-red-50 transition cursor-pointer"
                              title="Limpiar filtro"
                            >
                              <X size={12} />
                            </button>
                          )}
                          <span>Estado</span>
                        </div>
                        {activeHeaderSearches.estado && (
                          <div className="mt-1.5 w-full">
                            <input 
                              type="text" 
                              placeholder="Filtrar estado..."
                              value={headerSearchValues.estado}
                              onChange={(e) => handleHeaderSearchChange('estado', e.target.value)}
                              className="w-full bg-white border border-starken-border rounded px-2 py-1 text-[12px] font-medium text-slate-800 outline-none focus:border-[#33798C]"
                            />
                          </div>
                        )}
                      </th>
                    </>
                  ) : (
                    <>
                      {/* Select All Checkbox for mass return in Por Gestionar */}
                      {activeCard === 'por_gestionar' && (
                        <th className="py-3 px-3 w-[4%] text-center">
                          <input 
                            type="checkbox"
                            checked={isAllPageChecked}
                            onChange={handleSelectAllMassReturn}
                            className="w-4 h-4 rounded text-[#33798C] accent-[#33798C] border-slate-300 cursor-pointer focus:ring-[#33798C]"
                            title="Seleccionar todos en esta página"
                          />
                        </th>
                      )}

                      {/* Fecha Excepción */}
                      <th className="py-3 px-3 sm:px-4 w-[50%] md:w-[13%]">
                        <div className="flex items-center justify-start space-x-1.5">
                          <button 
                            onClick={() => toggleHeaderSearch('fechaExcepcion')}
                            className={`p-1 rounded transition cursor-pointer ${activeHeaderSearches.fechaExcepcion ? 'bg-[#33798C] text-white' : 'hover:text-[#33798C] hover:bg-[#ECF5F7] text-slate-500'}`}
                          >
                            <Search size={12} />
                          </button>
                          {headerSearchValues.fechaExcepcion && (
                            <button
                              onClick={() => handleHeaderSearchChange('fechaExcepcion', '')}
                              className="p-1 text-red-500 hover:text-red-700 rounded hover:bg-red-50 transition cursor-pointer"
                              title="Limpiar filtro"
                            >
                              <X size={12} />
                            </button>
                          )}
                          <span>Fecha Excepción</span>
                        </div>
                        {activeHeaderSearches.fechaExcepcion && (
                          <div className="mt-1.5 hidden md:block">
                            <input 
                              type="date" 
                              value={headerSearchValues.fechaExcepcion}
                              onChange={(e) => handleHeaderSearchChange('fechaExcepcion', e.target.value)}
                              className="w-[125px] bg-white border border-starken-border rounded px-2 py-1 text-[12px] font-bold text-[#33798C] outline-none focus:border-[#33798C] cursor-pointer"
                            />
                          </div>
                        )}
                      </th>

                      {/* Fecha Solicitud Gestión for En Gestión */}
                      {activeCard === 'en_gestion' && (
                        <th className="py-3 px-4 w-[11%] hidden md:table-cell">Fecha Solicitud</th>
                      )}

                      {/* Orden Flete */}
                      <th className="py-3 px-4 w-[13%] hidden md:table-cell">
                        <div className="flex items-center justify-start space-x-1.5">
                          <button 
                            onClick={() => toggleHeaderSearch('ordenFlete')}
                            className={`p-1 rounded transition cursor-pointer ${activeHeaderSearches.ordenFlete ? 'bg-[#33798C] text-white' : 'hover:text-[#33798C] hover:bg-[#ECF5F7] text-slate-500'}`}
                          >
                            <Search size={12} />
                          </button>
                          {headerSearchValues.ordenFlete && (
                            <button
                              onClick={() => handleHeaderSearchChange('ordenFlete', '')}
                              className="p-1 text-red-500 hover:text-red-700 rounded hover:bg-red-50 transition cursor-pointer"
                              title="Limpiar filtro"
                            >
                              <X size={12} />
                            </button>
                          )}
                          <span>Orden Flete</span>
                        </div>
                        {activeHeaderSearches.ordenFlete && (
                          <div className="relative mt-1.5 w-full">
                            <input 
                              type="text" 
                              placeholder="Filtrar OF..."
                              value={headerSearchValues.ordenFlete}
                              onChange={(e) => handleHeaderSearchChange('ordenFlete', e.target.value)}
                              className="w-full bg-white border border-starken-border rounded pl-2 pr-6 py-1 text-[12px] font-medium text-slate-800 outline-none focus:border-[#33798C]"
                            />
                          </div>
                        )}
                      </th>

                      {/* Días en Gestión for En Gestión */}
                      {activeCard === 'en_gestion' && (
                        <th className="py-3 px-4 w-[8%] text-center hidden md:table-cell">Días</th>
                      )}

                      {/* N° Documento */}
                      <th className="py-3 px-4 w-[10%] hidden md:table-cell">N° Doc.</th>

                      {/* Tipo de Excepción */}
                      <th className="py-3 px-4 w-[18%] hidden md:table-cell">
                        <div className="flex items-center justify-start space-x-1.5">
                          <button 
                            onClick={() => toggleHeaderSearch('tipoExcepcion')}
                            className={`p-1 rounded transition cursor-pointer ${activeHeaderSearches.tipoExcepcion ? 'bg-[#33798C] text-white' : 'hover:text-[#33798C] hover:bg-[#ECF5F7] text-slate-500'}`}
                          >
                            <Search size={12} />
                          </button>
                          {headerSearchValues.tipoExcepcion && (
                            <button
                              onClick={() => handleHeaderSearchChange('tipoExcepcion', '')}
                              className="p-1 text-red-500 hover:text-red-700 rounded hover:bg-red-50 transition cursor-pointer"
                              title="Limpiar filtro"
                            >
                              <X size={12} />
                            </button>
                          )}
                          <span>Tipo Excepción</span>
                        </div>
                        {activeHeaderSearches.tipoExcepcion && (
                          <div className="mt-1.5 w-full">
                            <input 
                              type="text" 
                              placeholder="Filtrar motivo..."
                              value={headerSearchValues.tipoExcepcion}
                              onChange={(e) => handleHeaderSearchChange('tipoExcepcion', e.target.value)}
                              className="w-full bg-white border border-starken-border rounded px-2 py-1 text-[12px] font-medium text-slate-800 outline-none focus:border-[#33798C]"
                            />
                          </div>
                        )}
                      </th>

                      {/* Fecha Compromiso */}
                      <th className="py-3 px-4 w-[12%] hidden md:table-cell">
                        <div className="flex items-center justify-start space-x-1.5">
                          <button 
                            onClick={() => toggleHeaderSearch('fechaCompromiso')}
                            className={`p-1 rounded transition cursor-pointer ${activeHeaderSearches.fechaCompromiso ? 'bg-[#33798C] text-white' : 'hover:text-[#33798C] hover:bg-[#ECF5F7] text-slate-500'}`}
                          >
                            <Search size={12} />
                          </button>
                          {headerSearchValues.fechaCompromiso && (
                            <button
                              onClick={() => handleHeaderSearchChange('fechaCompromiso', '')}
                              className="p-1 text-red-500 hover:text-red-700 rounded hover:bg-red-50 transition cursor-pointer"
                              title="Limpiar filtro"
                            >
                              <X size={12} />
                            </button>
                          )}
                          <span>Compromiso</span>
                        </div>
                        {activeHeaderSearches.fechaCompromiso && (
                          <div className="mt-1.5 hidden md:block">
                            <input 
                              type="date" 
                              value={headerSearchValues.fechaCompromiso}
                              onChange={(e) => handleHeaderSearchChange('fechaCompromiso', e.target.value)}
                              className="w-[125px] bg-white border border-starken-border rounded px-2 py-1 text-[12px] font-bold text-[#33798C] outline-none focus:border-[#33798C] cursor-pointer"
                            />
                          </div>
                        )}
                      </th>

                      {/* Comuna Destino */}
                      <th className="py-3 px-4 w-[12%] hidden md:table-cell">
                        <div className="flex items-center justify-start space-x-1.5">
                          <button 
                            onClick={() => toggleHeaderSearch('comunaDestino')}
                            className={`p-1 rounded transition cursor-pointer ${activeHeaderSearches.comunaDestino ? 'bg-[#33798C] text-white' : 'hover:text-[#33798C] hover:bg-[#ECF5F7] text-slate-500'}`}
                          >
                            <Search size={12} />
                          </button>
                          {headerSearchValues.comunaDestino && (
                            <button
                              onClick={() => handleHeaderSearchChange('comunaDestino', '')}
                              className="p-1 text-red-500 hover:text-red-700 rounded hover:bg-red-50 transition cursor-pointer"
                              title="Limpiar filtro"
                            >
                              <X size={12} />
                            </button>
                          )}
                          <span>Comuna</span>
                        </div>
                        {activeHeaderSearches.comunaDestino && (
                          <div className="mt-1.5 w-full">
                            <input 
                              type="text" 
                              placeholder="Filtrar comuna..."
                              value={headerSearchValues.comunaDestino}
                              onChange={(e) => handleHeaderSearchChange('comunaDestino', e.target.value)}
                              className="w-full bg-white border border-starken-border rounded px-2 py-1 text-[12px] font-medium text-slate-800 outline-none focus:border-[#33798C]"
                            />
                          </div>
                        )}
                      </th>

                      {/* Acciones */}
                      <th className="py-3 px-3 sm:px-4 w-[50%] md:w-[10%] text-center">Acciones</th>
                    </>
                  )}

                  {/* Expand arrow header */}
                  <th className="py-3 px-3 w-[4%] text-center hidden md:table-cell"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-starken-border font-medium text-slate-750 font-sans">
                {paginatedExceptions.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-slate-400 italic">
                      No se encontraron excepciones con los filtros seleccionados.
                    </td>
                  </tr>
                ) : (
                  paginatedExceptions.map((shipment) => {
                    const isExpanded = expandedRows.includes(shipment.id);
                    const details = getAdditionalDetails(shipment);
                    const isMassChecked = massReturnIds.includes(shipment.id);

                    return (
                      <React.Fragment key={shipment.id}>
                        <tr 
                          onClick={(e) => handleRowClick(e, shipment.id)}
                          className={`hover:bg-[#F0F8FA]/60 transition-colors border-b border-starken-border font-semibold cursor-pointer select-none ${
                            isExpanded ? 'bg-[#ECF5F7]/40' : ''
                          }`}
                        >
                          {activeCard === 'gestionado' ? (
                            <>
                              {/* Fecha de solicitud */}
                              <td className="py-3.5 px-3 sm:px-4 font-bold text-slate-800">
                                <div className="md:hidden space-y-1">
                                  <div className="text-slate-850 text-xs font-black font-din">OF: {shipment.id}</div>
                                  <div className="text-[10px] text-[#33798C] font-bold truncate max-w-[140px] font-sans">{shipment.reason || '-'}</div>
                                  <div className="text-[10px] text-slate-500 font-semibold">Comuna: {getComuna(shipment)}</div>
                                </div>
                                <span className="hidden md:inline font-din">{shipment.fechaSolicitud || '11-07-2026'}</span>
                              </td>

                              <td className="py-3.5 px-4 font-din font-bold text-[#33798C] hidden md:table-cell">{shipment.id}</td>
                              <td className="py-3.5 px-4 font-din font-bold text-slate-700 hidden md:table-cell">{shipment.ofActualizada || '-'}</td>
                              <td className="py-3.5 px-4 font-din text-slate-600 hidden md:table-cell">{getDocNumber(shipment)}</td>
                              <td className="py-3.5 px-4 font-din text-slate-800 hidden md:table-cell">{shipment.reason || '-'}</td>
                              <td className="py-3.5 px-4 font-semibold hidden md:table-cell">{getComuna(shipment)}</td>
                              <td className="py-3.5 px-3 sm:px-4">
                                <span className="px-2.5 py-1 rounded-md text-[10px] sm:text-xs font-bold bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] inline-block font-sans">
                                  {shipment.estado || 'Gestionado'}
                                </span>
                              </td>
                            </>
                          ) : (
                            <>
                              {/* Mass Return Checkbox */}
                              {activeCard === 'por_gestionar' && (
                                <td className="py-3.5 px-3 text-center">
                                  <input 
                                    type="checkbox"
                                    checked={isMassChecked}
                                    onChange={() => handleToggleMassReturnRow(shipment.id)}
                                    className="w-4 h-4 rounded text-[#33798C] accent-[#33798C] border-slate-300 cursor-pointer focus:ring-[#33798C]"
                                    title="Seleccionar para devolución masiva"
                                  />
                                </td>
                              )}

                              {/* Fecha Excepción */}
                              <td className="py-3.5 px-3 sm:px-4 font-bold text-slate-800">
                                <div className="md:hidden space-y-1">
                                  <div className="text-slate-850 text-xs font-black font-din flex items-center space-x-1.5">
                                    {onToggleFavorite && (
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          onToggleFavorite(shipment);
                                        }}
                                        className="p-0.5 hover:scale-120 transition-transform cursor-pointer"
                                        title={favorites.some(f => f.id === shipment.id) ? "Quitar de favoritos" : "Agregar a favoritos"}
                                      >
                                        <Star 
                                          size={13} 
                                          className={
                                            favorites.some(f => f.id === shipment.id)
                                              ? "fill-amber-400 text-amber-400" 
                                              : "text-slate-300 hover:text-amber-400"
                                          } 
                                        />
                                      </button>
                                    )}
                                    <span>OF: {shipment.id}</span>
                                  </div>
                                  <div className="text-[10px] text-[#33798C] font-bold truncate max-w-[140px] font-sans">{shipment.reason || '-'}</div>
                                  <div className="text-[10px] text-slate-500 font-semibold">Comuna: {getComuna(shipment)}</div>
                                </div>
                                <span className="hidden md:inline font-din">{getExcepcionDate(shipment)}</span>
                              </td>

                              {/* Fecha Solicitud */}
                              {activeCard === 'en_gestion' && (
                                <td className="py-3.5 px-4 font-din hidden md:table-cell">{shipment.fechaSolicitud || '18-07-2026'}</td>
                              )}

                              {/* Orden Flete */}
                              <td className="py-3.5 px-4 font-din font-bold text-[#33798C] hidden md:table-cell">
                                <div className="flex items-center space-x-2">
                                  {onToggleFavorite && (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onToggleFavorite(shipment);
                                      }}
                                      className="p-1 hover:scale-120 transition-transform cursor-pointer group/star"
                                      title={favorites.some(f => f.id === shipment.id) ? "Quitar de favoritos" : "Agregar a favoritos"}
                                    >
                                      <Star 
                                        size={14} 
                                        className={`transition-colors ${
                                          favorites.some(f => f.id === shipment.id)
                                            ? "fill-amber-400 text-amber-400 drop-shadow-2xs" 
                                            : "text-slate-300 group-hover/star:text-amber-400 group-hover/star:fill-amber-100"
                                        }`} 
                                      />
                                    </button>
                                  )}
                                  <span>{shipment.id}</span>
                                </div>
                              </td>

                              {/* Días en Gestión */}
                              {activeCard === 'en_gestion' && (
                                <td className="py-3.5 px-4 text-center font-din font-black text-slate-800 hidden md:table-cell">{shipment.diasEnGestion !== undefined ? shipment.diasEnGestion : 0}</td>
                              )}

                              {/* N° Doc */}
                              <td className="py-3.5 px-4 font-din text-slate-600 hidden md:table-cell">{getDocNumber(shipment)}</td>

                              {/* Tipo Excepción */}
                              <td className="py-3.5 px-4 font-din text-slate-800 hidden md:table-cell">{shipment.reason || '-'}</td>

                              {/* Fecha Compromiso */}
                              <td className="py-3.5 px-4 font-din hidden md:table-cell">{getCommitmentDate(shipment)}</td>

                              {/* Comuna */}
                              <td className="py-3.5 px-4 font-semibold hidden md:table-cell">{getComuna(shipment)}</td>

                              {/* Acciones */}
                              {activeCard === 'por_gestionar' && (
                                <td className="py-3.5 px-2 md:px-4 text-center">
                                  <div className="md:hidden flex items-center justify-center">
                                    {isExpanded ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
                                  </div>
                                  <div className="hidden md:flex items-center justify-center space-x-1.5">
                                    <button
                                      onClick={() => onTriggerAction('gestionar', [shipment.id])}
                                      className="p-1.5 bg-[#ECF5F7] hover:bg-[#33798C] hover:text-white rounded-lg text-[#33798C] transition cursor-pointer"
                                      title="Gestionar Orden"
                                    >
                                      <Edit size={14} />
                                    </button>
                                    <button
                                      onClick={() => handleDownloadSingleOF(shipment)}
                                      className="p-1.5 bg-[#F4F8FA] hover:bg-[#33798C] hover:text-white rounded-lg text-slate-600 transition cursor-pointer"
                                      title="Descargar Orden"
                                    >
                                      <Download size={14} />
                                    </button>
                                  </div>
                                </td>
                              )}

                              {activeCard === 'en_gestion' && (
                                <td className="py-3.5 px-2 md:px-4 text-center">
                                  <div className="md:hidden flex items-center justify-center">
                                    {isExpanded ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
                                  </div>
                                  <div className="hidden md:flex items-center justify-center space-x-1.5">
                                    <button
                                      onClick={() => onCompleteGestion(shipment.id)}
                                      className="p-1.5 bg-[#ECFDF5] hover:bg-[#10B981] hover:text-white rounded-lg text-[#059669] transition cursor-pointer"
                                      title="Finalizar gestión"
                                    >
                                      <Check size={14} />
                                    </button>
                                    <button
                                      onClick={() => handleDownloadSingleOF(shipment)}
                                      className="p-1.5 bg-[#ECF5F7] hover:bg-[#33798C] hover:text-white rounded-lg text-[#33798C] transition cursor-pointer"
                                      title="Descargar orden"
                                    >
                                      <Download size={14} />
                                    </button>
                                  </div>
                                </td>
                              )}
                            </>
                          )}

                          {/* Chevron Arrow column */}
                          <td className="py-3.5 px-4 text-center hidden md:table-cell">
                            <button
                              onClick={() => handleToggleRowExpand(shipment.id)}
                              className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-[#33798C] rounded-full transition cursor-pointer"
                              title={isExpanded ? "Ocultar detalles" : "Mostrar detalles"}
                            >
                              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>
                          </td>
                        </tr>

                        {/* Expanded details row */}
                        {isExpanded && (
                          <tr className="bg-[#F0F8FA]/30 border-b border-starken-border animate-in fade-in duration-200">
                            <td colSpan={activeCard === 'por_gestionar' ? 9 : activeCard === 'en_gestion' ? 10 : activeCard === 'gestionado' ? 8 : 9} className="py-4 px-6 select-text">
                              <div className={`grid grid-cols-1 ${activeCard === 'gestionado' ? 'md:grid-cols-4' : 'md:grid-cols-3'} gap-6 bg-white border border-starken-border rounded-2xl p-5 shadow-xs`}>
                                
                                {/* Col 1: Datos de Envío */}
                                <div className="space-y-3">
                                  <h5 className="text-xs font-bold text-[#33798C] tracking-wide font-din border-b border-slate-100 pb-2 flex items-center space-x-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#33798C] shrink-0" />
                                    <span>Datos de envío</span>
                                  </h5>
                                  <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                                    <div className="flex flex-col col-span-2">
                                      <span className="text-[11px] font-bold text-slate-400 mb-0.5 font-din">Dirección destino</span>
                                      <span className="text-xs text-slate-800 font-semibold font-sans break-words leading-relaxed">{details.direccionDestino}</span>
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-[11px] font-bold text-slate-400 mb-0.5 font-din">Comuna origen</span>
                                      <span className="text-xs text-slate-800 font-semibold font-sans">{details.comunaOrigen}</span>
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-[11px] font-bold text-slate-400 mb-0.5 font-din">Tipo de entrega</span>
                                      <span className="text-xs text-slate-800 font-semibold font-sans">{details.tipoEntrega}</span>
                                    </div>
                                    <div className="flex flex-col col-span-2">
                                      <span className="text-[11px] font-bold text-slate-400 mb-0.5 font-din">Tipo de servicio</span>
                                      <span className="text-xs text-slate-800 font-semibold font-sans">{details.tipoServicio}</span>
                                    </div>
                                    {activeCard === 'gestionado' && (
                                      <>
                                        <div className="flex flex-col">
                                          <span className="text-[11px] font-bold text-slate-400 mb-0.5 font-din">Acción realizada</span>
                                          <span className="text-xs text-[#059669] font-bold font-sans">{details.accionRealizada || '-'}</span>
                                        </div>
                                        <div className="flex flex-col">
                                          <span className="text-[11px] font-bold text-slate-400 mb-0.5 font-din">Valor total</span>
                                          <span className="text-xs text-slate-800 font-bold font-din">${details.valorTotal || '0'}</span>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </div>

                                {/* Col 2: Datos de Destinatario */}
                                <div className="space-y-3 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                                  <h5 className="text-xs font-bold text-[#1e4f5e] tracking-wide font-din border-b border-slate-100 pb-2 flex items-center space-x-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#1e4f5e] shrink-0" />
                                    <span>Datos de destinatario</span>
                                  </h5>
                                  <div className="flex flex-col space-y-3">
                                    <div className="flex flex-col">
                                      <span className="text-[11px] font-bold text-slate-400 mb-0.5 font-din">Nombre</span>
                                      <span className="text-xs text-slate-800 font-semibold font-sans">{details.nombreDestinatario}</span>
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-[11px] font-bold text-slate-400 mb-0.5 font-din">RUT</span>
                                      <span className="text-xs text-slate-800 font-semibold font-din">{details.rutDestinatario}</span>
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-[11px] font-bold text-slate-400 mb-0.5 font-din">Teléfono</span>
                                      <span className="text-xs text-slate-800 font-semibold font-din">{details.telefonoDestinatario}</span>
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-[11px] font-bold text-slate-400 mb-0.5 font-din">Email</span>
                                      <span className="text-xs text-slate-800 font-semibold font-sans truncate" title={details.emailDestinatario}>{details.emailDestinatario}</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Col 3: Control Administrativo */}
                                <div className="space-y-3 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                                  <h5 className="text-xs font-bold text-[#33798C] tracking-wide font-din border-b border-slate-100 pb-2 flex items-center space-x-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#33798C] shrink-0" />
                                    <span>Control administrativo</span>
                                  </h5>
                                  <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                                    <div className="flex flex-col">
                                      <span className="text-[11px] font-bold text-slate-400 mb-0.5 font-din">Emisión</span>
                                      <span className="text-xs text-slate-800 font-semibold font-din">{details.fechaEmision}</span>
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-[11px] font-bold text-slate-400 mb-0.5 font-din">Recepción</span>
                                      <span className="text-xs text-slate-800 font-semibold font-din">{details.fechaRecepcion}</span>
                                    </div>
                                    <div className="flex flex-col col-span-2">
                                      <span className="text-[11px] font-bold text-slate-400 mb-0.5 font-din">N° Cta. Cte.</span>
                                      <span className="text-xs text-slate-800 font-semibold font-din">{details.nCtaCte}</span>
                                    </div>
                                    {activeCard === 'gestionado' && (
                                      <>
                                        <div className="flex flex-col">
                                          <span className="text-[11px] font-bold text-slate-400 mb-0.5 font-din">Fecha gestión</span>
                                          <span className="text-xs text-slate-800 font-semibold font-din">{details.fechaGestion || '-'}</span>
                                        </div>
                                        <div className="flex flex-col col-span-2">
                                          <span className="text-[11px] font-bold text-slate-400 mb-0.5 font-din">Gestor responsable</span>
                                          <span className="text-xs text-slate-800 font-semibold font-sans">{details.nombreGestor || '-'}</span>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </div>

                                {/* Col 4: Tiempos de gestión (Gestionados only) */}
                                {activeCard === 'gestionado' && (
                                  <div className="space-y-3 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                                    <h5 className="text-xs font-bold text-[#1e4f5e] tracking-wide font-din border-b border-slate-100 pb-2 flex items-center space-x-1.5">
                                      <span className="w-1.5 h-1.5 rounded-full bg-[#1e4f5e] shrink-0" />
                                      <span>Tiempos de gestión</span>
                                    </h5>
                                    <div className="grid grid-cols-1 gap-y-3">
                                      <div className="flex flex-col">
                                        <span className="text-[11px] font-bold text-slate-400 mb-0.5 font-din">Generación excepción</span>
                                        <span className="text-xs text-slate-800 font-semibold font-din">{getExcepcionDate(shipment)}</span>
                                      </div>
                                      <div className="flex flex-col">
                                        <span className="text-[11px] font-bold text-slate-400 mb-0.5 font-din">Fecha gestión</span>
                                        <span className="text-xs text-slate-800 font-semibold font-din">{details.fechaGestion || '-'}</span>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer: Mass Actions & Dynamic Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-starken-border/60">
            {/* Mass actions left button */}
            <div>
              {activeCard === 'por_gestionar' && (
                <button
                  disabled={massReturnIds.length === 0}
                  onClick={() => onTriggerAction('devolver', massReturnIds)}
                  className="btn btn-primary space-x-2"
                >
                  <span>Devolución masiva ({massReturnIds.length})</span>
                </button>
              )}
            </div>

            {/* Right side download and pagination */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleDownloadPendingCSV}
                className="btn btn-outline space-x-2"
              >
                <Download size={13} className="text-[#33798C]" />
                <span>Descargar tabla CSV</span>
              </button>

              {/* Dynamic Pagination pill */}
              <div className="flex items-center space-x-1 text-xs font-bold font-din border border-starken-border rounded-lg px-3 py-1 bg-white shadow-xs">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="p-1 hover:text-[#33798C] text-slate-400 disabled:opacity-30 cursor-pointer"
                >
                  <ChevronLeft size={14} />
                </button>
                <span className="px-2 text-slate-800 font-black">
                  {currentPage} / {totalPages || 1}
                </span>
                <button 
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className="p-1 hover:text-[#33798C] text-slate-400 disabled:opacity-30 cursor-pointer"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Middle Row Widgets (Trazabilidad Rápida & Alertas) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Stepper Timeline: Trazabilidad rápida por OF */}
            <div className="lg:col-span-8 bg-white rounded-2xl border border-starken-border p-6 shadow-xs flex flex-col justify-between">
              <div className="mb-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h4 className="font-extrabold text-base text-slate-850 font-din tracking-wide flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#33798C]" />
                      <span>Trazabilidad rápida</span>
                    </h4>
                    <p className="text-xs font-bold text-slate-400 font-sans mt-0.5">Línea de eventos de la orden de flete en tiempo real</p>
                  </div>
                  {activeOFData && (
                    <div className="flex items-center space-x-2 bg-[#ECF5F7] px-3 py-1.5 rounded-xl border border-[#C2DFE7] relative">
                      <span className="text-xs font-bold text-[#1e4f5e] whitespace-nowrap font-din">Buscar OF:</span>
                      <div className="relative flex items-center">
                        <Search size={13} className="absolute left-2.5 text-[#33798C] pointer-events-none" />
                        <input
                          type="text"
                          value={ofSearchQuery}
                          onChange={(e) => {
                            setOfSearchQuery(e.target.value);
                            setShowOfDropdown(true);
                            const matched = shipmentsData.find(s => s.id.toString() === e.target.value);
                            if (matched) {
                              setSelectedOF(matched.id);
                            }
                          }}
                          onFocus={() => setShowOfDropdown(true)}
                          onBlur={() => setTimeout(() => setShowOfDropdown(false), 200)}
                          placeholder="Ingresa OF..."
                          className="bg-white text-xs pl-7 pr-2.5 py-1.5 border border-starken-border focus:border-[#33798C] rounded-lg outline-none font-bold text-[#33798C] w-36 sm:w-44 font-din"
                        />
                        {showOfDropdown && (
                          <div className="absolute right-0 top-full mt-1 bg-white border border-starken-border rounded-xl shadow-lg z-30 max-h-48 overflow-y-auto w-72">
                            {matchingOFs.length === 0 ? (
                              <div className="px-3 py-2 text-xs text-slate-400 italic font-sans">Sin resultados</div>
                            ) : (
                              matchingOFs.map((s) => (
                                <div
                                  key={s.id}
                                  onClick={() => {
                                    setSelectedOF(s.id);
                                    setOfSearchQuery(s.id.toString());
                                    setShowOfDropdown(false);
                                  }}
                                  className="px-3 py-2 text-xs text-slate-700 hover:bg-[#ECF5F7] font-bold cursor-pointer border-b border-slate-100 last:border-0 font-sans"
                                >
                                  OF: <span className="font-din">{s.id}</span> — {s.recipient} ({s.status})
                                </div>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {activeOFData ? (
                (() => {
                  const isStep3Completed = activeOFData.actionTaken || activeOFData.status === 'En gestión' || activeOFData.status === 'Gestionado' || activeOFData.status === 'En reparto' || activeOFData.status === 'Entregado' || activeOFData.status === 'Redestinado' || activeOFData.status === 'Devuelto';
                  const isStep4Completed = activeOFData.status === 'En reparto' || activeOFData.status === 'Entregado';
                  const isStep5Completed = activeOFData.status === 'Entregado';
                  
                  let progressWidth = 'calc(25% - var(--step-width) * 0.25)';
                  if (isStep5Completed) {
                    progressWidth = 'calc(100% - var(--step-width))';
                  } else if (isStep4Completed) {
                    progressWidth = 'calc(75% - var(--step-width) * 0.75)';
                  } else if (isStep3Completed) {
                    progressWidth = 'calc(50% - var(--step-width) * 0.5)';
                  }

                  return (
                    <div className="flex-1 flex flex-col justify-center py-6 px-2 [--step-width:64px] sm:[--step-width:80px] md:[--step-width:96px]">
                      <div className="flex items-center justify-between w-full relative">
                        {/* Horizontal progress path */}
                        <div 
                          style={{ 
                            left: 'calc(var(--step-width) / 2)', 
                            right: 'calc(var(--step-width) / 2)' 
                          }}
                          className="absolute h-1.5 bg-slate-200 top-4 z-0 rounded-full" 
                        />
                        <div 
                          style={{ 
                            left: 'calc(var(--step-width) / 2)',
                            width: progressWidth 
                          }}
                          className="absolute h-1.5 bg-[#10B981] top-4 z-0 transition-all duration-500 rounded-full" 
                        />

                        {/* Step 1: Creada */}
                        <div 
                          style={{ width: 'var(--step-width)' }}
                          className="flex flex-col items-center text-center relative z-10"
                        >
                          <div className="w-8 h-8 rounded-full bg-[#10B981] text-white flex items-center justify-center shadow-md font-bold text-xs">
                            <Check size={14} />
                          </div>
                          <span className="text-[11px] sm:text-xs font-bold text-slate-800 mt-2 font-sans">Creada</span>
                        </div>

                        {/* Step 2: Excepción */}
                        <div 
                          style={{ width: 'var(--step-width)' }}
                          className="flex flex-col items-center text-center relative z-10"
                        >
                          {isStep3Completed ? (
                            <div className="w-8 h-8 rounded-full bg-[#10B981] text-white flex items-center justify-center shadow-md font-bold text-xs">
                              <Check size={14} />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-white relative flex items-center justify-center shadow-md">
                              <div className="absolute inset-0 rounded-full bg-[#F59E0B] text-white flex items-center justify-center shadow-md animate-pulse">
                                <AlertTriangle size={14} />
                              </div>
                            </div>
                          )}
                          <span className={`text-[11px] sm:text-xs font-bold mt-2 font-sans ${
                            isStep3Completed ? 'text-[#10B981]' : 'text-[#D97706]'
                          }`}>
                            Excepción
                          </span>
                        </div>

                        {/* Step 3: Gestión */}
                        <div 
                          style={{ width: 'var(--step-width)' }}
                          className="flex flex-col items-center text-center relative z-10"
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md font-bold text-xs transition-colors duration-300 ${
                            isStep3Completed ? 'bg-[#10B981] text-white' : 'bg-slate-100 text-slate-400 border border-slate-200'
                          }`}>
                            {isStep3Completed ? <Check size={14} /> : 3}
                          </div>
                          <span className={`text-[11px] sm:text-xs font-bold mt-2 font-sans ${isStep3Completed ? 'text-[#10B981]' : 'text-slate-400'}`}>
                            Gestión
                          </span>
                        </div>

                        {/* Step 4: Reparto */}
                        <div 
                          style={{ width: 'var(--step-width)' }}
                          className="flex flex-col items-center text-center relative z-10"
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md font-bold text-xs transition-colors duration-300 ${
                            isStep4Completed ? 'bg-[#10B981] text-white' : 'bg-slate-100 text-slate-400 border border-slate-200'
                          }`}>
                            {isStep4Completed ? <Check size={14} /> : 4}
                          </div>
                          <span className={`text-[11px] sm:text-xs font-bold mt-2 font-sans ${isStep4Completed ? 'text-[#10B981]' : 'text-slate-400'}`}>
                            Reparto
                          </span>
                        </div>

                        {/* Step 5: Entregado */}
                        <div 
                          style={{ width: 'var(--step-width)' }}
                          className="flex flex-col items-center text-center relative z-10"
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md font-bold text-xs transition-colors duration-300 ${
                            isStep5Completed ? 'bg-[#10B981] text-white' : 'bg-slate-100 text-slate-400 border border-slate-200'
                          }`}>
                            {isStep5Completed ? <Check size={14} /> : 5}
                          </div>
                          <span className={`text-[11px] sm:text-xs font-bold mt-2 font-sans ${isStep5Completed ? 'text-[#10B981]' : 'text-slate-400'}`}>
                            Entregado
                          </span>
                        </div>
                      </div>

                      {/* Event Summary Card */}
                      <div className="bg-[#ECF5F7]/70 rounded-xl p-4 mt-6 border border-[#C2DFE7]">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-[#1e4f5e] font-din tracking-wide">
                            {activeOFData.status === 'Entregado' 
                              ? 'Estado del envío' 
                              : activeOFData.status === 'En reparto' 
                              ? 'Estado del envío' 
                              : activeOFData.actionTaken 
                              ? 'Gestión realizada' 
                              : 'Próxima acción sugerida'}
                          </span>
                          <span className="text-xs font-black text-[#33798C] font-din">OF: {activeOFData.id}</span>
                        </div>
                        <p className="text-xs font-bold text-slate-800 mt-1 font-sans">
                          {activeOFData.status === 'Entregado'
                            ? 'Envío entregado al destinatario de forma exitosa.'
                            : activeOFData.status === 'En reparto'
                            ? 'Envío en ruta de reparto hacia el domicilio de destino.'
                            : activeOFData.actionTaken 
                            ? `Gestión realizada (${activeOFData.actionTaken}). En espera de despacho.` 
                            : `Contactar cliente o redestinar por motivo: ${activeOFData.reason}.`}
                        </p>
                        <div className="text-[11px] text-slate-600 mt-2 font-semibold font-sans flex items-center space-x-4">
                          <span>Destinatario: <strong className="text-slate-800">{activeOFData.recipient}</strong></span>
                          <span>Teléfono: <strong className="text-slate-800 font-din">{activeOFData.phone || 'No registrado'}</strong></span>
                        </div>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className="flex-1 flex items-center justify-center py-6 text-slate-400 italic text-xs">
                  Selecciona una OF en la lista para ver su trazabilidad.
                </div>
              )}
            </div>

            {/* Widget Right: Alertas y decisiones */}
            <div className="lg:col-span-4 bg-white rounded-2xl border border-starken-border p-6 shadow-xs flex flex-col justify-between">
              <div>
                <h4 className="font-extrabold text-base text-slate-850 font-din tracking-wide mb-0.5 flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" />
                  <span>Alertas y decisiones</span>
                </h4>
                <p className="text-xs font-bold text-slate-400 mb-4 font-sans">Casos prioritarios para tu gestión</p>

                <ul className="space-y-3 text-xs font-bold text-slate-700">
                  <li className="flex items-center justify-between p-2.5 rounded-xl bg-red-50/70 border border-red-100 hover:bg-red-50 transition-colors cursor-pointer" onClick={() => setIsSlaRiesgoModalOpen(true)}>
                    <div className="flex items-center space-x-2.5">
                      <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                      <span className="font-semibold font-sans text-red-900">{stats.criticas} OF críticas vencen hoy</span>
                    </div>
                    <ArrowRight size={14} className="text-red-500" />
                  </li>
                  <li className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/70 border border-amber-100 hover:bg-amber-50 transition-colors cursor-pointer" onClick={() => setIsSlaRiesgoModalOpen(true)}>
                    <div className="flex items-center space-x-2.5">
                      <span className="w-2 h-2 rounded-full bg-[#F59E0B] shrink-0" />
                      <span className="font-semibold font-sans text-amber-900">{stats.slaEnRiesgo} SLA próximos a vencer</span>
                    </div>
                    <ArrowRight size={14} className="text-[#F59E0B]" />
                  </li>
                  <li className="flex items-center justify-between p-2.5 rounded-xl bg-[#ECF5F7] border border-[#C2DFE7]">
                    <div className="flex items-center space-x-2.5">
                      <span className="w-2 h-2 rounded-full bg-[#33798C] shrink-0" />
                      <span className="font-semibold font-sans text-slate-800">{stats.enGestion} OF en gestión iniciada</span>
                    </div>
                  </li>
                  <li className="flex items-center justify-between p-2.5 rounded-xl bg-[#F0F6F8] border border-slate-200">
                    <div className="flex items-center space-x-2.5">
                      <span className="w-2 h-2 rounded-full bg-[#1e4f5e] shrink-0" />
                      <span className="font-semibold font-sans text-slate-800">Revisar redestinaciones</span>
                    </div>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => setIsSlaRiesgoModalOpen(true)}
                className="btn btn-primary w-full space-x-2 mt-4 shadow-sm"
              >
                <AlertTriangle size={14} />
                <span>Ver SLA en riesgo</span>
              </button>
            </div>
          </div>

          {/* Bottom Row Widgets (Motivos Frecuentes & Tendencia) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Donut Chart: Motivos frecuentes */}
            <div className="lg:col-span-4 bg-white rounded-2xl border border-starken-border p-6 shadow-xs flex flex-col justify-between">
              <div>
                <h4 className="font-extrabold text-base text-slate-850 font-din tracking-wide">Motivos frecuentes</h4>
                <p className="text-xs font-bold text-slate-400 mb-3 font-sans">Distribución por causas de excepción</p>
              </div>
 
              <div className="flex-1 flex items-center justify-center p-3">
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="35" fill="none" stroke="#F0F6F8" strokeWidth="12" />
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="35" 
                      fill="none" 
                      stroke="#33798C" /* Teal - Direccion incorrecta */
                      strokeWidth="12" 
                      strokeDasharray="220" 
                      strokeDashoffset={220 - (reasonStats.dashIncorrecta || 0)} 
                    />
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="35" 
                      fill="none" 
                      stroke="#F59E0B" /* Amber - Cliente ausente */
                      strokeWidth="12" 
                      strokeDasharray="220" 
                      strokeDashoffset={220 - (reasonStats.dashAusente || 0)} 
                    />
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="35" 
                      fill="none" 
                      stroke="#10B981" /* Emerald - Rechazo entrega */
                      strokeWidth="12" 
                      strokeDasharray="220" 
                      strokeDashoffset={220 - (reasonStats.dashRechazo || 0)} 
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-2xl font-black text-slate-850 font-din">{reasonStats.total}</span>
                    <span className="text-[10px] font-bold text-slate-400 font-din">Casos</span>
                  </div>
                </div>
              </div>
 
              {/* Legend Items */}
              <div className="grid grid-cols-3 gap-2 text-[11px] font-bold text-slate-600 mt-3 font-din">
                <div className="flex flex-col items-center text-center p-2 bg-[#ECF5F7] rounded-xl">
                  <span className="w-2 h-2 bg-[#33798C] rounded-full mb-1" />
                  <span className="truncate max-w-[75px]" title="Dir. incorrecta">Dir. incorrecta</span>
                  <span className="text-slate-850 font-black mt-0.5">{reasonStats.pctIncorrecta}%</span>
                </div>
                <div className="flex flex-col items-center text-center p-2 bg-[#FFFBEB] rounded-xl">
                  <span className="w-2 h-2 bg-[#F59E0B] rounded-full mb-1" />
                  <span className="truncate max-w-[75px]" title="Cliente ausente">Ausente</span>
                  <span className="text-slate-850 font-black mt-0.5">{reasonStats.pctAusente}%</span>
                </div>
                <div className="flex flex-col items-center text-center p-2 bg-[#ECFDF5] rounded-xl">
                  <span className="w-2 h-2 bg-[#10B981] rounded-full mb-1" />
                  <span className="truncate max-w-[75px]" title="Rechazo entrega">Rechazo</span>
                  <span className="text-slate-850 font-black mt-0.5">{reasonStats.pctRechazo}%</span>
                </div>
              </div>
            </div>

            {/* Widget Right: Tendencia de excepciones */}
            <div className="lg:col-span-8 bg-white rounded-2xl border border-starken-border p-6 shadow-xs flex flex-col justify-between">
              <div>
                <h4 className="font-extrabold text-base text-slate-850 font-din tracking-wide">Tendencia de excepciones</h4>
                <p className="text-xs font-bold text-slate-400 font-sans">Generadas vs resueltas por día laboral</p>
              </div>
              
              {/* Custom SVG Graph Chart */}
              <div className="flex-1 flex items-end justify-between h-44 pt-4 px-2 border-b border-starken-border relative">
                {/* Guide grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-15">
                  <div className="border-t border-slate-400 w-full" />
                  <div className="border-t border-slate-400 w-full" />
                  <div className="border-t border-slate-400 w-full" />
                  <div className="w-full h-0" />
                </div>

                {[
                  { label: 'Lun', gen: 12, res: 8 },
                  { label: 'Mar', gen: 19, res: 14 },
                  { label: 'Mié', gen: 14, res: 18 },
                  { label: 'Jue', gen: 25, res: 22 },
                  { label: 'Vie', gen: 31, res: 24 },
                  { label: 'Sáb', gen: 18, res: 20 },
                ].map((day, idx) => {
                  const maxVal = 40;
                  const genHeight = (day.gen / maxVal) * 100;
                  const resHeight = (day.res / maxVal) * 100;
                  
                  return (
                    <div key={idx} className="flex flex-col items-center space-y-2 w-12 group cursor-pointer z-10">
                      <div className="flex space-x-1.5 items-end justify-center w-full h-28 relative">
                        {/* Generadas (Corporate Teal) */}
                        <div 
                          style={{ height: `${genHeight}%` }} 
                          className="w-3.5 bg-[#33798C] rounded-t-md transition-all duration-300 hover:brightness-110 relative"
                        >
                          <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[11px] font-bold rounded px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-din z-20">
                            {day.gen}
                          </div>
                        </div>
                        {/* Resueltas (Emerald) */}
                        <div 
                          style={{ height: `${resHeight}%` }} 
                          className="w-3.5 bg-[#10B981] rounded-t-md transition-all duration-300 hover:brightness-110 relative"
                        >
                          <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[11px] font-bold rounded px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-din z-20">
                            {day.res}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-slate-500 font-din">{day.label}</span>
                    </div>
                  );
                })}
              </div>

              {/* Graph Legend */}
              <div className="flex items-center justify-center space-x-6 text-xs font-bold text-slate-600 mt-4 font-din">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 bg-[#33798C] rounded-md" />
                  <span>Generadas</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 bg-[#10B981] rounded-md" />
                  <span>Resueltas</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* SLA en Riesgo / Críticas Modal */}
      {isSlaRiesgoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
            onClick={() => setIsSlaRiesgoModalOpen(false)}
          />
          
          <div className="bg-white rounded-3xl shadow-2xl border border-starken-border w-full max-w-4xl p-6 relative z-10 animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
            <button
              onClick={() => setIsSlaRiesgoModalOpen(false)}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition cursor-pointer"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="mb-4 pr-10 sm:pr-0 pb-4 border-b border-slate-200">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A] flex items-center justify-center shrink-0 shadow-xs">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h3 className="font-black text-lg text-slate-850 font-din tracking-wide">Casos críticos / SLA en riesgo</h3>
                  <p className="text-xs font-bold text-slate-400 font-sans">Listado de excepciones críticas (Prioridad Alta) o próximas a vencer (SLA ≤ 2h)</p>
                </div>
              </div>
            </div>

            {/* Table container */}
            <div className="flex-1 border border-starken-border rounded-2xl overflow-y-auto bg-white min-h-0">
              <table className="w-full text-left border-collapse text-xs table-fixed">
                <thead className="sticky top-0 bg-[#F0F6F8] z-10">
                  <tr className="bg-[#F0F6F8] border-b border-starken-border text-slate-600 font-bold font-din tracking-wider text-xs">
                    <th className="py-3 px-3 w-[60%] md:w-[18%]">Orden Flete</th>
                    <th className="py-3 px-4 md:w-[25%] hidden md:table-cell">Tipo Excepción</th>
                    <th className="py-3 px-3 w-[25%] md:w-[20%]">Tiempo / Nivel</th>
                    <th className="py-3 px-4 md:w-[18%] hidden md:table-cell">Destinatario</th>
                    <th className="py-3 px-4 md:w-[11%] hidden md:table-cell">Comuna</th>
                    <th className="py-3 px-3 w-[15%] md:w-[8%] text-center">
                      <span className="hidden md:inline">Acción</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-starken-border font-medium text-slate-700 font-sans">
                  {paginatedSlaShipments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400 italic font-sans">
                        No hay órdenes con SLA en riesgo o críticas actualmente.
                      </td>
                    </tr>
                  ) : (
                    paginatedSlaShipments.map((shipment) => {
                      const isSlaExpanded = expandedSlaRows.includes(shipment.id);
                      return (
                        <React.Fragment key={shipment.id}>
                          <tr 
                            onClick={(e) => handleSlaRowClick(e, shipment.id)}
                            className="hover:bg-[#F0F8FA]/60 transition-colors border-b border-starken-border font-semibold cursor-pointer select-none"
                          >
                            <td className="py-3 px-3 font-bold font-din">
                              <div className="md:hidden space-y-0.5">
                                <div className="text-slate-800 text-xs font-bold">OF: {shipment.id}</div>
                                <div className="text-[10px] text-[#33798C] font-bold truncate max-w-[130px]">{shipment.reason || '-'}</div>
                                <div className="text-[9px] text-slate-400 font-bold">Comuna: {getComuna(shipment)}</div>
                              </div>
                              <span className="hidden md:inline text-[#33798C]">{shipment.id}</span>
                            </td>
                            <td className="py-3 px-4 font-din hidden md:table-cell">{shipment.reason || '-'}</td>
                            <td className="py-3 px-3 font-sans">
                              <div className="flex flex-col sm:flex-row flex-wrap gap-1">
                                {shipment.priority === 'Alta' && (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-700 border border-red-200 font-sans">
                                    Crítica
                                  </span>
                                )}
                                {shipment.slaMinutes !== undefined && (
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-sans ${
                                    shipment.slaMinutes <= 120 
                                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                      : 'bg-slate-100 text-slate-600'
                                  }`}>
                                    SLA: {shipment.slaMinutes} min
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-4 font-sans hidden md:table-cell">{shipment.recipient || '-'}</td>
                            <td className="py-3 px-4 font-semibold font-sans hidden md:table-cell">{getComuna(shipment)}</td>
                            <td className="py-3 px-3 text-center">
                              <div className="hidden md:flex items-center justify-center space-x-1">
                                <button
                                  onClick={() => {
                                    onTriggerAction('gestionar', [shipment.id]);
                                    setIsSlaRiesgoModalOpen(false);
                                  }}
                                  className="p-1.5 bg-[#ECF5F7] hover:bg-[#33798C] hover:text-white rounded-lg text-[#33798C] transition cursor-pointer"
                                  title="Gestionar orden"
                                >
                                  <Edit size={14} />
                                </button>
                                <button
                                  onClick={() => handleDownloadSingleOF(shipment)}
                                  className="p-1.5 bg-[#F4F8FA] hover:bg-[#33798C] hover:text-white rounded-lg text-slate-600 transition cursor-pointer"
                                  title="Descargar orden"
                                >
                                  <Download size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>

                          {isSlaExpanded && (
                            <tr className="bg-[#ECF5F7]/40 border-b border-starken-border animate-in fade-in duration-200">
                              <td colSpan={6} className="py-3 px-4 select-text">
                                <div className="bg-white border border-starken-border rounded-xl p-4 shadow-xs space-y-2 text-xs">
                                  <div className="font-bold text-[#33798C] border-b border-slate-100 pb-1 font-din tracking-wide">
                                    Información del destinatario
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-slate-800 font-sans font-semibold">
                                    <div><span className="text-slate-400 font-din text-[11px]">Nombre:</span> {shipment.recipient || shipment.nombreDestinatario || '-'}</div>
                                    <div><span className="text-slate-400 font-din text-[11px]">Comuna:</span> {getComuna(shipment)}</div>
                                    <div><span className="text-slate-400 font-din text-[11px]">RUT:</span> {shipment.rutDestinatario || '-'}</div>
                                    <div><span className="text-slate-400 font-din text-[11px]">Teléfono:</span> {shipment.telefonoDestinatario || '-'}</div>
                                    <div className="sm:col-span-2"><span className="text-slate-400 font-din text-[11px]">Dirección:</span> {shipment.direccionDestino || '-'}</div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center sm:justify-between gap-4 shrink-0 select-none">
              {totalSlaPages > 1 ? (
                <div className="flex items-center justify-center space-x-2 text-xs font-bold font-din">
                  <button 
                    onClick={() => setSlaCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={slaCurrentPage === 1}
                    className="p-1.5 rounded-lg bg-white border border-starken-border text-slate-600 hover:text-[#33798C] hover:border-[#33798C] disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="px-3 py-1 bg-white border border-starken-border rounded-lg text-slate-800 font-black">
                    {slaCurrentPage} / {totalSlaPages}
                  </span>
                  <button 
                    onClick={() => setSlaCurrentPage(prev => Math.min(totalSlaPages, prev + 1))}
                    disabled={slaCurrentPage === totalSlaPages}
                    className="p-1.5 rounded-lg bg-white border border-starken-border text-slate-600 hover:text-[#33798C] hover:border-[#33798C] disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              ) : (
                <div className="hidden sm:block" />
              )}

              <button
                onClick={() => setIsSlaRiesgoModalOpen(false)}
                className="btn btn-outline"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
