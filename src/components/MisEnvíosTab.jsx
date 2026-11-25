import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Home, Truck, Inbox, AlertTriangle, ThumbsUp, RefreshCw, MoreHorizontal, 
  ArrowRight, ChevronDown, ChevronUp, Star, Trash2, Calendar, Package, Gauge,
  Search, X, ChevronLeft, ChevronRight, Copy, Check, ExternalLink
} from 'lucide-react';

const DATE_RANGE_OPTIONS = [
  { value: 'dia_actual', label: 'Día actual' },
  { value: 'ayer', label: 'Ayer' },
  { value: '7_dias', label: 'Últimos 7 días' },
  { value: 'este_mes', label: 'Este mes' },
];

export default function MisEnvíosTab({ 
  shipmentsData, 
  favorites: propFavorites, 
  onToggleFavorite, 
  onSearchOF 
}) {
  const [filterType, setFilterType] = useState('comprometidas'); // comprometidas or creadas
  const [dateRange, setDateRange] = useState('dia_actual');
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const dateDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dateDropdownRef.current && !dateDropdownRef.current.contains(event.target)) {
        setIsDateDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [slaType, setSlaType] = useState('nacional'); // nacional or regional
  const [showHistoricTable, setShowHistoricTable] = useState(true);
  const [historicPage, setHistoricPage] = useState(1);

  // Favorites state (supports prop or internal fallback)
  const [localFavorites, setLocalFavorites] = useState([
    {
      id: 275161618,
      status: 'Excepción',
      recipient: 'Jeraldin Alejandra P.',
      phone: '976921527',
      rutDestinatario: '18.420.911-3',
      comunaDestino: 'San Bernardo',
      direccionDestino: 'Av. Los Robles 1020, Depto 401',
      fechaCompromiso: '09-10-2026',
      fechaEmision: '07-10-2026',
      bultos: 2,
      peso: '4.5',
      tipoEntrega: 'Domicilio'
    },
    {
      id: 275067401,
      status: 'En reparto',
      recipient: 'Juan Carlos Espinoza',
      phone: '958579337',
      rutDestinatario: '15.932.104-5',
      comunaDestino: 'Paine',
      direccionDestino: 'Av. Presidente Prieto 0271',
      fechaCompromiso: '09-10-2026',
      fechaEmision: '06-10-2026',
      bultos: 1,
      peso: '1.8',
      tipoEntrega: 'Domicilio'
    },
    {
      id: 273251360,
      status: 'Entregado',
      recipient: 'Luis Humberto Lucero',
      phone: '988204005',
      rutDestinatario: '12.809.332-9',
      comunaDestino: 'Calama',
      direccionDestino: 'Calle Granaderos 2140',
      fechaCompromiso: '08-10-2026',
      fechaEmision: '05-10-2026',
      bultos: 3,
      peso: '6.2',
      tipoEntrega: 'Sucursal'
    }
  ]);

  const currentFavorites = propFavorites || localFavorites;

  const handleToggleFav = (shipment) => {
    if (onToggleFavorite) {
      onToggleFavorite(shipment);
    } else {
      setLocalFavorites(prev => {
        const exists = prev.some(f => f.id === shipment.id);
        if (exists) {
          return prev.filter(f => f.id !== shipment.id);
        } else {
          return [
            {
              id: shipment.id,
              status: shipment.status || 'En tránsito',
              recipient: shipment.recipient || shipment.nombreDestinatario || 'Cliente Starken',
              phone: shipment.phone || shipment.telefonoDestinatario || '',
              rutDestinatario: shipment.rutDestinatario || '',
              comunaDestino: shipment.comunaDestino || 'Santiago',
              direccionDestino: shipment.direccionDestino || 'Dirección de entrega',
              fechaCompromiso: shipment.fechaCompromiso || shipment.fechaEmision || '09-10-2026',
              fechaEmision: shipment.fechaEmision || '07-10-2026',
              bultos: shipment.bultos || 1,
              peso: shipment.peso || '2.5',
              tipoEntrega: shipment.tipoEntrega || 'Domicilio'
            },
            ...prev
          ];
        }
      });
    }
  };

  const isFavorite = (id) => currentFavorites.some(f => f.id === id);

  // Favorites table search & pagination
  const [favSearchQuery, setFavSearchQuery] = useState('');
  const [favCurrentPage, setFavCurrentPage] = useState(1);
  const FAVS_PER_PAGE = 5;

  const filteredFavorites = useMemo(() => {
    if (!favSearchQuery.trim()) return currentFavorites;
    const q = favSearchQuery.toLowerCase();
    return currentFavorites.filter(f => 
      String(f.id).includes(q) ||
      (f.recipient && f.recipient.toLowerCase().includes(q)) ||
      (f.comunaDestino && f.comunaDestino.toLowerCase().includes(q)) ||
      (f.status && f.status.toLowerCase().includes(q))
    );
  }, [currentFavorites, favSearchQuery]);

  const totalFavPages = Math.ceil(filteredFavorites.length / FAVS_PER_PAGE) || 1;
  const paginatedFavorites = useMemo(() => {
    const start = (favCurrentPage - 1) * FAVS_PER_PAGE;
    return filteredFavorites.slice(start, start + FAVS_PER_PAGE);
  }, [filteredFavorites, favCurrentPage]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Excepción': return '#D64545';
      case 'En reparto': return '#33798C';
      case 'Entregado': 
      case 'Gestionado': return '#2A9D76';
      case 'En tránsito': return '#E58A2B';
      case 'En origen': return '#3B68B8';
      case 'En destino': return '#7D9436';
      case 'Redestinado': return '#D96B27';
      default: return '#7E57A0';
    }
  };

  // Range-based data presets for automatic reactive updates on dropdown change
  const RANGE_METRICS = {
    dia_actual: {
      counts: { origen: 8, transito: 12, destino: 7, reparto: 14, excepcion: 16, entregado: 8, redestinado: 4, otros: 3 },
      nacionalSla: 18.00,
      regionalSla: 88.50,
      chartData: [
        { day: 'Lun', generadas: 15, resueltas: 11 },
        { day: 'Mar', generadas: 24, resueltas: 18 },
        { day: 'Mié', generadas: 20, resueltas: 27 },
        { day: 'Jue', generadas: 36, resueltas: 31 },
        { day: 'Vie', generadas: 48, resueltas: 38 },
        { day: 'Sáb', generadas: 23, resueltas: 28 },
      ],
      historicTable: [
        { fechaCompromiso: '31-08-2026', fechaCreacion: '28-08-2026', ep: 2, fp: 0, pe: 2, total: 4, ns: '50 %' },
        { fechaCompromiso: '28-08-2026', fechaCreacion: '25-08-2026', ep: 0, fp: 0, pe: 1, total: 1, ns: '0 %' },
        { fechaCompromiso: '26-08-2026', fechaCreacion: '24-08-2026', ep: 0, fp: 0, pe: 2, total: 2, ns: '0 %' },
        { fechaCompromiso: '24-08-2026', fechaCreacion: '20-08-2026', ep: 0, fp: 0, pe: 1, total: 1, ns: '0 %' },
        { fechaCompromiso: '24-08-2026', fechaCreacion: '21-08-2026', ep: 0, fp: 0, pe: 1, total: 1, ns: '0 %' },
        { fechaCompromiso: '22-08-2026', fechaCreacion: '20-08-2026', ep: 0, fp: 0, pe: 1, total: 1, ns: '0 %' },
        { fechaCompromiso: '17-08-2026', fechaCreacion: '13-08-2026', ep: 0, fp: 0, pe: 1, total: 1, ns: '0 %' },
      ]
    },
    ayer: {
      counts: { origen: 5, transito: 9, destino: 6, reparto: 18, excepcion: 12, entregado: 22, redestinado: 3, otros: 2 },
      nacionalSla: 82.30,
      regionalSla: 91.00,
      chartData: [
        { day: 'Lun', generadas: 13, resueltas: 9 },
        { day: 'Mar', generadas: 21, resueltas: 15 },
        { day: 'Mié', generadas: 19, resueltas: 25 },
        { day: 'Jue', generadas: 33, resueltas: 29 },
        { day: 'Vie', generadas: 45, resueltas: 36 },
        { day: 'Sáb', generadas: 21, resueltas: 26 },
      ],
      historicTable: [
        { fechaCompromiso: '30-08-2026', fechaCreacion: '27-08-2026', ep: 1, fp: 0, pe: 1, total: 2, ns: '50 %' },
        { fechaCompromiso: '27-08-2026', fechaCreacion: '24-08-2026', ep: 2, fp: 1, pe: 0, total: 3, ns: '67 %' },
        { fechaCompromiso: '25-08-2026', fechaCreacion: '22-08-2026', ep: 1, fp: 0, pe: 0, total: 1, ns: '100 %' },
        { fechaCompromiso: '23-08-2026', fechaCreacion: '19-08-2026', ep: 0, fp: 0, pe: 1, total: 1, ns: '0 %' },
        { fechaCompromiso: '21-08-2026', fechaCreacion: '18-08-2026', ep: 2, fp: 0, pe: 0, total: 2, ns: '100 %' },
        { fechaCompromiso: '19-08-2026', fechaCreacion: '16-08-2026', ep: 1, fp: 1, pe: 0, total: 2, ns: '50 %' },
        { fechaCompromiso: '16-08-2026', fechaCreacion: '12-08-2026', ep: 0, fp: 0, pe: 1, total: 1, ns: '0 %' },
      ]
    },
    '7_dias': {
      counts: { origen: 42, transito: 68, destino: 45, reparto: 84, excepcion: 53, entregado: 148, redestinado: 19, otros: 11 },
      nacionalSla: 85.40,
      regionalSla: 93.20,
      chartData: [
        { day: 'Lun', generadas: 18, resueltas: 14 },
        { day: 'Mar', generadas: 28, resueltas: 22 },
        { day: 'Mié', generadas: 25, resueltas: 33 },
        { day: 'Jue', generadas: 42, resueltas: 37 },
        { day: 'Vie', generadas: 56, resueltas: 45 },
        { day: 'Sáb', generadas: 28, resueltas: 34 },
      ],
      historicTable: [
        { fechaCompromiso: '31-08-2026', fechaCreacion: '28-08-2026', ep: 14, fp: 2, pe: 4, total: 20, ns: '70 %' },
        { fechaCompromiso: '28-08-2026', fechaCreacion: '25-08-2026', ep: 12, fp: 1, pe: 2, total: 15, ns: '80 %' },
        { fechaCompromiso: '26-08-2026', fechaCreacion: '24-08-2026', ep: 15, fp: 3, pe: 1, total: 19, ns: '79 %' },
        { fechaCompromiso: '24-08-2026', fechaCreacion: '20-08-2026', ep: 18, fp: 2, pe: 0, total: 20, ns: '90 %' },
        { fechaCompromiso: '22-08-2026', fechaCreacion: '20-08-2026', ep: 10, fp: 1, pe: 3, total: 14, ns: '71 %' },
        { fechaCompromiso: '20-08-2026', fechaCreacion: '17-08-2026', ep: 11, fp: 0, pe: 2, total: 13, ns: '85 %' },
        { fechaCompromiso: '17-08-2026', fechaCreacion: '13-08-2026', ep: 16, fp: 2, pe: 1, total: 19, ns: '84 %' },
      ]
    },
    este_mes: {
      counts: { origen: 154, transito: 240, destino: 182, reparto: 310, excepcion: 186, entregado: 620, redestinado: 58, otros: 34 },
      nacionalSla: 89.10,
      regionalSla: 94.60,
      chartData: [
        { day: 'Lun', generadas: 92, resueltas: 74 },
        { day: 'Mar', generadas: 135, resueltas: 108 },
        { day: 'Mié', generadas: 118, resueltas: 152 },
        { day: 'Jue', generadas: 190, resueltas: 170 },
        { day: 'Vie', generadas: 255, resueltas: 205 },
        { day: 'Sáb', generadas: 130, resueltas: 150 },
      ],
      historicTable: [
        { fechaCompromiso: '31-08-2026', fechaCreacion: '28-08-2026', ep: 45, fp: 5, pe: 10, total: 60, ns: '75 %' },
        { fechaCompromiso: '28-08-2026', fechaCreacion: '25-08-2026', ep: 52, fp: 4, pe: 6, total: 62, ns: '84 %' },
        { fechaCompromiso: '24-08-2026', fechaCreacion: '20-08-2026', ep: 48, fp: 6, pe: 8, total: 62, ns: '77 %' },
        { fechaCompromiso: '20-08-2026', fechaCreacion: '17-08-2026', ep: 50, fp: 3, pe: 5, total: 58, ns: '86 %' },
        { fechaCompromiso: '15-08-2026', fechaCreacion: '12-08-2026', ep: 42, fp: 7, pe: 9, total: 58, ns: '72 %' },
        { fechaCompromiso: '10-08-2026', fechaCreacion: '07-08-2026', ep: 55, fp: 4, pe: 4, total: 63, ns: '87 %' },
        { fechaCompromiso: '05-08-2026', fechaCreacion: '02-08-2026', ep: 49, fp: 5, pe: 6, total: 60, ns: '82 %' },
      ]
    }
  };

  const currentMetric = RANGE_METRICS[dateRange] || RANGE_METRICS.dia_actual;
  const filterMultiplier = filterType === 'creadas' ? 1.08 : 1.0;

  // Pagination for historic SLA table (7 items per page matching design)
  const HISTORIC_ITEMS_PER_PAGE = 7;
  const totalHistoricPages = Math.ceil((currentMetric.historicTable?.length || 0) / HISTORIC_ITEMS_PER_PAGE) || 1;
  const pagedHistoricTable = useMemo(() => {
    const start = (historicPage - 1) * HISTORIC_ITEMS_PER_PAGE;
    return (currentMetric.historicTable || []).slice(start, start + HISTORIC_ITEMS_PER_PAGE);
  }, [currentMetric.historicTable, historicPage]);

  // Dynamically calculated status counts that automatically update with dateRange and filterType
  const counts = {
    origen: Math.round(currentMetric.counts.origen * (filterType === 'creadas' ? 1.25 : 1)),
    transito: Math.round(currentMetric.counts.transito * filterMultiplier),
    destino: Math.round(currentMetric.counts.destino * filterMultiplier),
    reparto: Math.round(currentMetric.counts.reparto * filterMultiplier),
    excepcion: Math.round(currentMetric.counts.excepcion * (filterType === 'creadas' ? 0.9 : 1)),
    entregado: Math.round(currentMetric.counts.entregado * (filterType === 'creadas' ? 0.95 : 1)),
    redestinado: Math.round(currentMetric.counts.redestinado * filterMultiplier),
    otros: Math.round(currentMetric.counts.otros * filterMultiplier),
  };

  // SVG parameters for the Service Level Gauge (automatically responds to date range & SLA type)
  const percentage = slaType === 'nacional' ? currentMetric.nacionalSla : currentMetric.regionalSla;
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Determine color based on SLA percentage bands
  const getGaugeColor = (val) => {
    if (val <= 79.0) return '#EF4444'; // Red
    if (val <= 86.0) return '#F97316'; // Orange
    if (val <= 91.0) return '#EAB308'; // Yellow
    return '#10B981'; // Green
  };

  const removeFavorite = (id) => {
    setFavorites(prev => prev.filter(f => f.id !== id));
  };

  // State for active KPI card and table pagination
  const [activeCard, setActiveCard] = useState(null); // 'origen', 'transito', 'destino', 'reparto', 'excepcion', 'entregado', 'redestinado', 'otros'
  const [tableCurrentPage, setTableCurrentPage] = useState(1);
  const [tableSearchQuery, setTableSearchQuery] = useState('');
  const [copiedOf, setCopiedOf] = useState(null);

  const handleCardClick = (cardKey) => {
    setActiveCard(prev => prev === cardKey ? null : cardKey);
    setTableCurrentPage(1);
    setTableSearchQuery('');
  };

  const handleHomeClick = () => {
    setActiveCard(null);
    setTableCurrentPage(1);
    setTableSearchQuery('');
  };

  const handleCopyOf = (e, ofNumber) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(String(ofNumber));
    setCopiedOf(ofNumber);
    setTimeout(() => setCopiedOf(null), 2000);
  };

  // KPI card configurations matching the official design system palette
  const CARD_CONFIGS = [
    {
      key: 'origen',
      title: 'En origen',
      count: counts.origen,
      badgeText: 'Ingresados',
      subtitle: 'Centro origen',
      color: '#3B68B8',
      activeBg: 'bg-[#3B68B8]/10',
      activeBorder: 'border-[#3B68B8] border-l-6 border-l-[#3B68B8] ring-2 ring-[#3B68B8]/20',
      inactiveBorder: 'border-l-4 border-l-[#3B68B8]/40',
      normalBorder: 'border-l-4 border-l-[#3B68B8] hover:border-[#3B68B8]/50',
      badgeTextColor: 'text-[#3B68B8]',
      statusName: 'En origen',
      icon: Home
    },
    {
      key: 'transito',
      title: 'En tránsito',
      count: counts.transito,
      badgeText: 'En ruta',
      subtitle: 'Entre centros',
      color: '#E58A2B',
      activeBg: 'bg-[#E58A2B]/10',
      activeBorder: 'border-[#E58A2B] border-l-6 border-l-[#E58A2B] ring-2 ring-[#E58A2B]/20',
      inactiveBorder: 'border-l-4 border-l-[#E58A2B]/40',
      normalBorder: 'border-l-4 border-l-[#E58A2B] hover:border-[#E58A2B]/50',
      badgeTextColor: 'text-[#E58A2B]',
      statusName: 'En tránsito',
      icon: Inbox
    },
    {
      key: 'destino',
      title: 'En destino',
      count: counts.destino,
      badgeText: 'Arribados',
      subtitle: 'Centro destino',
      color: '#7D9436',
      activeBg: 'bg-[#7D9436]/10',
      activeBorder: 'border-[#7D9436] border-l-6 border-l-[#7D9436] ring-2 ring-[#7D9436]/20',
      inactiveBorder: 'border-l-4 border-l-[#7D9436]/40',
      normalBorder: 'border-l-4 border-l-[#7D9436] hover:border-[#7D9436]/50',
      badgeTextColor: 'text-[#7D9436]',
      statusName: 'En destino',
      icon: Truck
    },
    {
      key: 'reparto',
      title: 'En reparto',
      count: counts.reparto,
      badgeText: 'Última milla',
      subtitle: 'En móvil hoy',
      color: '#33798C',
      activeBg: 'bg-[#33798C]/10',
      activeBorder: 'border-[#33798C] border-l-6 border-l-[#33798C] ring-2 ring-[#33798C]/20',
      inactiveBorder: 'border-l-4 border-l-[#33798C]/40',
      normalBorder: 'border-l-4 border-l-[#33798C] hover:border-[#33798C]/50',
      badgeTextColor: 'text-[#33798C]',
      statusName: 'En reparto',
      icon: Truck
    },
    {
      key: 'excepcion',
      title: 'Excepciones',
      count: counts.excepcion,
      badgeText: 'Con alerta',
      subtitle: 'Requiere atención',
      color: '#D64545',
      activeBg: 'bg-[#D64545]/10',
      activeBorder: 'border-[#D64545] border-l-6 border-l-[#D64545] ring-2 ring-[#D64545]/20',
      inactiveBorder: 'border-l-4 border-l-[#D64545]/40',
      normalBorder: 'border-l-4 border-l-[#D64545] hover:border-[#D64545]/50',
      badgeTextColor: 'text-[#D64545]',
      statusName: 'Excepción',
      icon: AlertTriangle
    },
    {
      key: 'entregado',
      title: 'Entregados',
      count: counts.entregado,
      badgeText: 'Conforme',
      subtitle: 'Recepción ok',
      color: '#2A9D76',
      activeBg: 'bg-[#2A9D76]/10',
      activeBorder: 'border-[#2A9D76] border-l-6 border-l-[#2A9D76] ring-2 ring-[#2A9D76]/20',
      inactiveBorder: 'border-l-4 border-l-[#2A9D76]/40',
      normalBorder: 'border-l-4 border-l-[#2A9D76] hover:border-[#2A9D76]/50',
      badgeTextColor: 'text-[#2A9D76]',
      statusName: 'Entregado',
      icon: ThumbsUp
    },
    {
      key: 'redestinado',
      title: 'Redestinado',
      count: counts.redestinado,
      badgeText: 'Reasignados',
      subtitle: 'Nueva ruta',
      color: '#B84A74',
      activeBg: 'bg-[#B84A74]/10',
      activeBorder: 'border-[#B84A74] border-l-6 border-l-[#B84A74] ring-2 ring-[#B84A74]/20',
      inactiveBorder: 'border-l-4 border-l-[#B84A74]/40',
      normalBorder: 'border-l-4 border-l-[#B84A74] hover:border-[#B84A74]/50',
      badgeTextColor: 'text-[#B84A74]',
      statusName: 'Redestinado',
      icon: RefreshCw
    },
    {
      key: 'otros',
      title: 'Otros',
      count: counts.otros,
      badgeText: 'Especiales',
      subtitle: 'Retiros y dev.',
      color: '#7E57A0',
      activeBg: 'bg-[#7E57A0]/10',
      activeBorder: 'border-[#7E57A0] border-l-6 border-l-[#7E57A0] ring-2 ring-[#7E57A0]/20',
      inactiveBorder: 'border-l-4 border-l-[#7E57A0]/40',
      normalBorder: 'border-l-4 border-l-[#7E57A0] hover:border-[#7E57A0]/50',
      badgeTextColor: 'text-[#7E57A0]',
      statusName: 'Otros',
      icon: MoreHorizontal
    }
  ];

  const activeCardData = CARD_CONFIGS.find(c => c.key === activeCard);

  // Memoized dynamic shipments corresponding to the selected KPI card
  const activeTableShipments = useMemo(() => {
    if (!activeCard) return [];
    const cardConfig = CARD_CONFIGS.find(c => c.key === activeCard);
    if (!cardConfig) return [];
    
    const targetCount = cardConfig.count;
    const statusName = cardConfig.statusName;
    
    // Existing shipments from prop if matching status
    const matching = (shipmentsData || []).filter(s => {
      if (activeCard === 'excepcion') return s.status === 'Excepción';
      if (activeCard === 'reparto') return s.status === 'En reparto';
      if (activeCard === 'transito') return s.status === 'En tránsito';
      if (activeCard === 'entregado') return s.status === 'Entregado' || s.status === 'Gestionado';
      if (activeCard === 'redestinado') return s.status === 'Redestinado';
      if (activeCard === 'origen') return s.status === 'En origen';
      if (activeCard === 'destino') return s.status === 'En destino';
      return s.status === 'Devuelto' || s.status === 'Otros';
    });

    const CITIES = ['San Bernardo', 'Providencia', 'Las Condes', 'Paine', 'Calama', 'Concepción', 'Antofagasta', 'Viña del Mar', 'Valparaíso', 'Curicó', 'La Serena', 'Temuco', 'Puerto Montt', 'Rancagua', 'Talca', 'Arica'];
    const NAMES = [
      'Jeraldin Alejandra P.', 'Juan Carlos Espinoza', 'Luis Humberto Lucero', 'Francisca Rubio', 
      'Esteban Paredes', 'Daniela Castro', 'Claudio Maldonado', 'Camila Vallejo', 
      'Sebastián Piñera', 'Michelle Bachelet', 'Ricardo Lagos', 'Gabriel Boric', 
      'José Antonio Kast', 'Evelyn Matthei', 'Mario Eduardo Gatta', 'Margarita del Carmen',
      'Fernando Hernán Paredes', 'Ana Carrasco', 'Milton René Núñez', 'Víctor Patricio Hernández'
    ];
    const ADDRESSES = [
      'Av. Los Robles 1020, Depto 401', 'Av. Presidente Prieto 0271', 'Calle Granaderos 2140', 'Av. Tobalaba 1450',
      'Av. Marathon 5300', 'Isidora Goyenechea 3000', 'Carmen 450', 'Teatinos 120',
      'Av. Kennedy 7800', 'Príncipe de Gales 750', 'Av. Irarrázaval 2400', 'Morandé 130',
      'Camino Real 100', 'Pedro de Valdivia 963', 'Los Castaños 1027', 'Uruguay 1102'
    ];
    
    const result = [...matching];
    const baseOf = 275100000;
    
    while (result.length < targetCount) {
      const i = result.length;
      const city = CITIES[i % CITIES.length];
      const name = NAMES[i % NAMES.length];
      const addr = ADDRESSES[i % ADDRESSES.length];
      const ofId = baseOf + (i * 137) + (activeCard.charCodeAt(0) * 11);
      
      result.push({
        id: ofId,
        status: statusName,
        recipient: name,
        comunaDestino: city,
        direccionDestino: addr,
        fechaEmision: `0${(i % 5) + 3}-10-2026`,
        fechaCompromiso: `0${(i % 5) + 6}-10-2026`,
        bultos: (i % 3) + 1,
        peso: ((i % 5) * 1.5 + 1.2).toFixed(1),
        tipoEntrega: i % 4 === 0 ? 'Sucursal' : 'Domicilio',
        tipoServicio: i % 2 === 0 ? 'Express' : 'Normal',
        rutDestinatario: `1${(i % 9) + 1}.${(100 + i * 23)}.${(200 + i * 17)}-${(i % 9)}`
      });
    }
    
    return result.slice(0, targetCount);
  }, [activeCard, shipmentsData, counts]);

  const filteredTableShipments = useMemo(() => {
    if (!tableSearchQuery.trim()) return activeTableShipments;
    const q = tableSearchQuery.toLowerCase().trim();
    return activeTableShipments.filter(s => 
      s.id.toString().includes(q) ||
      (s.recipient && s.recipient.toLowerCase().includes(q)) ||
      (s.comunaDestino && s.comunaDestino.toLowerCase().includes(q)) ||
      (s.direccionDestino && s.direccionDestino.toLowerCase().includes(q))
    );
  }, [activeTableShipments, tableSearchQuery]);

  const ITEMS_PER_PAGE = 10;
  const totalTablePages = Math.ceil(filteredTableShipments.length / ITEMS_PER_PAGE) || 1;
  const paginatedShipments = useMemo(() => {
    const start = (tableCurrentPage - 1) * ITEMS_PER_PAGE;
    return filteredTableShipments.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredTableShipments, tableCurrentPage]);

  // Truncated pagination items (first 3 pages, ellipsis, and last page)
  const paginationItems = useMemo(() => {
    if (totalTablePages <= 5) {
      return Array.from({ length: totalTablePages }, (_, i) => i + 1);
    }
    
    // When on one of the first 3 pages
    if (tableCurrentPage <= 3) {
      return [1, 2, 3, '...', totalTablePages];
    }
    
    // When on the 4th page
    if (tableCurrentPage === 4) {
      return [1, 2, 3, 4, '...', totalTablePages];
    }
    
    // When on the last page
    if (tableCurrentPage === totalTablePages) {
      return [1, 2, 3, '...', totalTablePages];
    }
    
    // When on the second to last page
    if (tableCurrentPage === totalTablePages - 1) {
      return [1, 2, 3, '...', totalTablePages - 1, totalTablePages];
    }
    
    // Middle page
    return [1, 2, 3, '...', tableCurrentPage, '...', totalTablePages];
  }, [tableCurrentPage, totalTablePages]);

  return (
    <div className="space-y-6">
      {/* Top Filter Bar */}
      <div className="bg-white rounded-2xl border border-starken-border p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#ECF5F7] text-[#33798C] border border-[#33798C]/20 flex items-center justify-center shrink-0 shadow-xs">
            <Package size={20} />
          </div>
          <div>
            <h3 className="font-black text-base text-slate-850 font-din tracking-wide">
              Resumen de tus envíos
            </h3>
            <p className="text-xs text-slate-500 font-sans mt-0.5 font-medium">
              Monitoreo consolidado del estado operativo y flujo de entregas.
            </p>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-3.5 text-xs font-semibold">
          {/* Segmented radio control for Comprometidas / Creadas (matching Emisión switch style) */}
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80">
            <span className="text-slate-500 font-sans text-xs px-2 font-medium">Ver por:</span>
            <button
              type="button"
              onClick={() => setFilterType('comprometidas')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-sans font-bold transition-all cursor-pointer ${
                filterType === 'comprometidas'
                  ? 'bg-[#33798C] text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Comprometidas
            </button>
            <button
              type="button"
              onClick={() => setFilterType('creadas')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-sans font-bold transition-all cursor-pointer ${
                filterType === 'creadas'
                  ? 'bg-[#33798C] text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Creadas
            </button>
          </div>

          <div className="flex items-center">
            {/* Custom Dropdown (Verde menta suave / petróleo tenue) */}
            <div className="relative" ref={dateDropdownRef}>
              <button
                type="button"
                onClick={() => setIsDateDropdownOpen(prev => !prev)}
                className="flex items-center justify-between gap-2.5 bg-[#f0f8f6] hover:bg-[#e4f3ef] text-[#1e544c] border border-[#9fd3c8] hover:border-[#4fa395] focus:outline-none focus:ring-2 focus:ring-[#4fa395]/20 rounded-xl pl-3.5 pr-3 py-2 cursor-pointer transition-all font-sans font-bold text-xs shadow-2xs"
              >
                <span>{DATE_RANGE_OPTIONS.find(o => o.value === dateRange)?.label || 'Día actual'}</span>
                <ChevronDown 
                  size={14} 
                  className={`text-[#3f8f82] transition-transform duration-200 ${isDateDropdownOpen ? 'rotate-180' : ''}`} 
                />
              </button>

              {isDateDropdownOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-40 bg-white border border-[#cbe4de] rounded-xl shadow-lg py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  {DATE_RANGE_OPTIONS.map((opt) => {
                    const isSelected = opt.value === dateRange;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          setDateRange(opt.value);
                          setIsDateDropdownOpen(false);
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
          </div>
        </div>
      </div>

      {/* KPI Cards Container with Empresas / Mis Gestiones styling & Home Button */}
      <div className="flex flex-col md:flex-row gap-3 sm:gap-4 items-stretch">
        {/* KPI Cards 4x2 Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 flex-1">
          {CARD_CONFIGS.map(card => {
            const isSelected = activeCard === card.key;
            const isOtherSelected = activeCard !== null && !isSelected;
            return (
              <div
                key={card.key}
                onClick={() => handleCardClick(card.key)}
                className={`rounded-xl p-3.5 flex flex-col justify-between border transition-all duration-200 cursor-pointer select-none ${
                  isSelected
                    ? `${card.activeBg} ${card.activeBorder} shadow-md scale-[1.01]`
                    : isOtherSelected
                      ? `bg-white/80 border-starken-border ${card.inactiveBorder} opacity-50 hover:opacity-90`
                      : `bg-white border-starken-border ${card.normalBorder} shadow-xs hover:shadow-md`
                }`}
                title={`Ver órdenes en estado: ${card.title}`}
              >
                <div className="text-[11px] sm:text-xs font-bold text-slate-600 font-din tracking-wide truncate">
                  {card.title}
                </div>
                <div className="mt-1.5 flex flex-col sm:flex-row sm:items-baseline sm:space-x-2">
                  <span className="text-2xl sm:text-3xl font-black text-slate-850 font-din leading-none">
                    {card.count}
                  </span>
                  <span className={`text-[10px] sm:text-xs font-bold ${card.badgeTextColor} font-sans mt-0.5 sm:mt-0`}>
                    {card.badgeText}
                  </span>
                </div>
                <div className="hidden sm:block text-[11px] text-slate-400 mt-2 font-bold font-sans">
                  {card.subtitle}
                </div>
              </div>
            );
          })}
        </div>

        {/* Small Navigation Home Card (Identical to Mis Gestiones) */}
        <div
          onClick={handleHomeClick}
          className={`rounded-xl py-2 px-4 md:p-0 flex items-center justify-center border transition-all duration-200 cursor-pointer select-none text-xs font-bold font-sans h-12 md:h-auto md:w-14 shrink-0 shadow-xs ${
            activeCard === null 
              ? 'bg-[#33798C] text-white border-[#33798C] shadow-md' 
              : 'bg-white border-starken-border hover:bg-[#ECF5F7] hover:border-[#33798C] text-slate-600 hover:text-[#33798C]'
          }`}
          title="Ir al inicio / Quitar tabla"
        >
          <Home size={22} className={activeCard === null ? 'text-white' : 'text-slate-600'} />
        </div>
      </div>

      {/* Dynamic Detail Table or Default Dashboard Cards (Replaces lower cards when a KPI is active, identical to Mis Gestiones) */}
      {activeCard !== null && activeCardData ? (
        <div className="bg-white rounded-2xl border border-starken-border shadow-xs p-4 sm:p-6 space-y-4 animate-in fade-in slide-in-from-top-3 duration-250">
          {/* Table Header with Card Title, Count & Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-starken-border/70">
            <div className="flex items-center space-x-2.5">
              <span className="w-2 h-2 rounded-full bg-[#10B981] shrink-0" />
              <div>
                <div className="flex items-center space-x-2.5">
                  <h3 className="text-base font-black text-slate-850 font-din tracking-wide">
                    Órdenes en estado: {activeCardData.title}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-sans bg-slate-100 text-slate-700 border border-slate-200/80">
                    {filteredTableShipments.length} {filteredTableShipments.length === 1 ? 'orden' : 'órdenes'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-sans mt-0.5 font-medium">
                  Desglose detallado de órdenes de flete asociadas al indicador seleccionado.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 self-stretch md:self-auto">
              {/* Quick Search in Table */}
              <div className="relative flex-1 md:w-64">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Filtrar por OF, destinatario o comuna..."
                  value={tableSearchQuery}
                  onChange={(e) => {
                    setTableSearchQuery(e.target.value);
                    setTableCurrentPage(1);
                  }}
                  className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-starken-border rounded-xl pl-8 pr-7 py-1.5 text-xs font-medium font-sans text-slate-800 placeholder-slate-400 outline-none focus:border-[#33798C] focus:ring-1 focus:ring-[#33798C]/20 transition-all"
                />
                {tableSearchQuery && (
                  <button
                    onClick={() => {
                      setTableSearchQuery('');
                      setTableCurrentPage(1);
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>

              {/* Home / Close Table Button */}
              <button
                onClick={handleHomeClick}
                className="btn btn-outline space-x-1.5 py-1.5 px-3 text-xs font-bold font-sans hover:bg-slate-100 text-slate-700 cursor-pointer shrink-0"
                title="Quitar tabla y volver a la vista general"
              >
                <Home size={14} className="text-[#33798C]" />
                <span className="hidden sm:inline">Quitar tabla</span>
              </button>
            </div>
          </div>

          {/* Table Container (Max 10 OFs per page) */}
          <div className="overflow-x-auto border border-starken-border rounded-xl bg-white shadow-2xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F0F6F8] border-b border-starken-border text-slate-600 font-bold text-xs font-din tracking-wider">
                  <th className="py-3 px-3.5 w-32">N° OF</th>
                  <th className="py-3 px-3 w-28">Fecha</th>
                  <th className="py-3 px-3.5">Destinatario</th>
                  <th className="py-3 px-3.5">Destino / Dirección</th>
                  <th className="py-3 px-3 text-center w-28">Bultos / Peso</th>
                  <th className="py-3 px-3 text-center w-28">Tipo entrega</th>
                  <th className="py-3 px-3 text-center w-32">Estado</th>
                  <th className="py-3 px-3 text-center w-16">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-starken-border/70 font-sans text-xs">
                {paginatedShipments.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-500 font-medium font-sans">
                      No se encontraron órdenes para el filtro aplicado.
                    </td>
                  </tr>
                ) : (
                  paginatedShipments.map((shipment, idx) => (
                    <tr 
                      key={shipment.id || idx} 
                      className="hover:bg-[#F0F8FA]/60 transition-colors group"
                    >
                      {/* N° OF with Star at beginning */}
                      <td className="py-2.5 px-3.5">
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleFav(shipment);
                            }}
                            className="p-1 hover:scale-125 transition-transform cursor-pointer group/star"
                            title={isFavorite(shipment.id) ? "Quitar de favoritos" : "Agregar a favoritos"}
                          >
                            <Star 
                              size={15} 
                              className={`transition-colors ${
                                isFavorite(shipment.id)
                                  ? "fill-amber-400 text-amber-400 drop-shadow-2xs"
                                  : "text-slate-300 group-hover/star:text-amber-400 group-hover/star:fill-amber-100"
                              }`}
                            />
                          </button>
                          <span className="font-din font-black text-[#33798C] text-xs tracking-wide">
                            #{shipment.id}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => handleCopyOf(e, shipment.id)}
                            className="p-1 text-slate-400 hover:text-[#33798C] transition-colors cursor-pointer rounded"
                            title="Copiar N° de Orden de Flete"
                          >
                            {copiedOf === shipment.id ? (
                              <Check size={12} className="text-emerald-600" />
                            ) : (
                              <Copy size={12} />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Fecha */}
                      <td className="py-2.5 px-3 font-din font-semibold text-slate-700">
                        {shipment.fechaCompromiso || shipment.fechaEmision || '08-10-2026'}
                      </td>

                      {/* Destinatario */}
                      <td className="py-2.5 px-3.5">
                        <div className="font-sans font-bold text-slate-850 truncate max-w-[190px]">
                          {shipment.recipient || shipment.nombreDestinatario || 'Cliente Starken'}
                        </div>
                        <div className="text-[11px] text-slate-400 font-medium font-sans">
                          {shipment.phone ? `+56 ${shipment.phone}` : (shipment.rutDestinatario || 'RUT no registrado')}
                        </div>
                      </td>

                      {/* Destino */}
                      <td className="py-2.5 px-3.5">
                        <div className="font-sans font-bold text-slate-800">
                          {shipment.comunaDestino || 'Santiago'}
                        </div>
                        <div className="text-[11px] text-slate-400 font-medium font-sans truncate max-w-[210px]">
                          {shipment.direccionDestino || 'Dirección de entrega'}
                        </div>
                      </td>

                      {/* Bultos / Peso */}
                      <td className="py-2.5 px-3 text-center">
                        <span className="font-din font-bold text-slate-700">
                          {shipment.bultos || 1} bulto{shipment.bultos > 1 ? 's' : ''}
                        </span>
                        <div className="text-[11px] font-din text-slate-400">
                          {shipment.peso || '2.5'} kg
                        </div>
                      </td>

                      {/* Tipo Entrega */}
                      <td className="py-2.5 px-3 text-center">
                        <span className="font-sans font-bold text-[11px] text-slate-700 bg-slate-100 border border-slate-200/70 px-2 py-0.5 rounded-full inline-flex items-center space-x-1">
                          <span>{shipment.tipoEntrega || 'Domicilio'}</span>
                        </span>
                      </td>

                      {/* Estado Badge (Nunito font) */}
                      <td className="py-2.5 px-3 text-center">
                        <span 
                          className="font-sans font-bold text-[11px] px-2.5 py-1 rounded-full border inline-block whitespace-nowrap"
                          style={{
                            backgroundColor: `${activeCardData.color}15`,
                            color: activeCardData.color,
                            borderColor: `${activeCardData.color}35`
                          }}
                        >
                          {activeCardData.title}
                        </span>
                      </td>

                      {/* Acciones */}
                      <td className="py-2.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={(e) => handleCopyOf(e, shipment.id)}
                          className="p-1.5 text-slate-400 hover:text-[#33798C] hover:bg-[#ECF5F7] rounded-lg transition-colors cursor-pointer"
                          title={`Copiar OF #${shipment.id}`}
                        >
                          <ExternalLink size={13} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Pagination Footer (Max 10 OFs per page) */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs font-sans">
            <div className="text-slate-500 font-medium">
              Mostrando <span className="font-din font-bold text-slate-850">{(tableCurrentPage - 1) * ITEMS_PER_PAGE + 1}</span> - <span className="font-din font-bold text-slate-850">{Math.min(tableCurrentPage * ITEMS_PER_PAGE, filteredTableShipments.length)}</span> de <span className="font-din font-bold text-slate-850">{filteredTableShipments.length}</span> órdenes
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center space-x-1.5 font-din font-bold">
              <button
                type="button"
                disabled={tableCurrentPage === 1}
                onClick={() => setTableCurrentPage(prev => Math.max(1, prev - 1))}
                className="p-1.5 rounded-lg border border-starken-border bg-white hover:bg-[#ECF5F7] text-slate-600 hover:text-[#33798C] disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                title="Página anterior"
              >
                <ChevronLeft size={15} />
              </button>

              {paginationItems.map((item, idx) => 
                item === '...' ? (
                  <span 
                    key={`ellipsis-${idx}`} 
                    className="px-1 text-slate-400 font-din font-bold text-xs select-none"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setTableCurrentPage(item)}
                    className={`min-w-[28px] h-7 px-2 rounded-lg text-xs font-black transition-all cursor-pointer ${
                      tableCurrentPage === item
                        ? 'bg-[#33798C] text-white shadow-xs'
                        : 'border border-starken-border bg-white text-slate-700 hover:bg-[#ECF5F7] hover:text-[#33798C]'
                    }`}
                  >
                    {item}
                  </button>
                )
              )}

              <button
                type="button"
                disabled={tableCurrentPage === totalTablePages}
                onClick={() => setTableCurrentPage(prev => Math.min(totalTablePages, prev + 1))}
                className="p-1.5 rounded-lg border border-starken-border bg-white hover:bg-[#ECF5F7] text-slate-600 hover:text-[#33798C] disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                title="Página siguiente"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Horizontal 2-Column Grid: Nivel de Servicio & Distribución de Envíos */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Left Column: Nivel de Servicio Domicilio */}
        <div className="bg-white rounded-2xl shadow-xs border border-starken-border overflow-hidden flex flex-col justify-between">
          {/* Section Header */}
          <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-starken-border bg-slate-50/50">
            <div>
              <h3 className="font-black text-base text-slate-850 font-din tracking-wide flex items-center space-x-2">
                <Gauge size={17} className="text-[#33798C]" />
                <span>Nivel de servicio domicilio</span>
              </h3>
              <p className="text-xs text-slate-500 font-sans mt-0.5 font-medium">
                Métrica de cumplimiento de SLA en entregas a domicilio.
              </p>
            </div>

            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/80 text-xs font-sans font-bold self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setSlaType('nacional')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  slaType === 'nacional' ? 'bg-[#33798C] text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Nacional
              </button>
              <button
                type="button"
                onClick={() => setSlaType('regional')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  slaType === 'regional' ? 'bg-[#33798C] text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Regional
              </button>
            </div>
          </div>

          {/* Speedometer Gauge Body */}
          <div className="p-5 flex-1 flex flex-col items-center justify-center">
            <div className="relative flex items-center justify-center w-52 h-28 overflow-hidden mb-2">
              <svg className="w-52 h-52 -rotate-180 origin-center absolute -top-4" viewBox="0 0 160 160">
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="none"
                  stroke="#e2e7ec"
                  strokeWidth="10"
                  strokeDasharray={`${circumference / 2} ${circumference}`}
                  strokeLinecap="round"
                />
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="none"
                  stroke={getGaugeColor(percentage)}
                  strokeWidth="10"
                  strokeDasharray={`${circumference / 2} ${circumference}`}
                  strokeDashoffset={strokeDashoffset / 2}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute top-12 flex flex-col items-center text-center">
                <span className="text-3xl font-black text-slate-850 tracking-tight font-din">{percentage.toFixed(2)}%</span>
              </div>
            </div>
            
            {/* Gauge Color Ranges scale matching reference image */}
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] font-bold text-slate-600 font-din border-b border-slate-100 pb-4 w-full">
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                <span>01% - 79%</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F97316]" />
                <span>80% - 86%</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EAB308]" />
                <span>87% - 91%</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                <span>92% - 100%</span>
              </div>
            </div>

            {/* Collapsible Historic SLA Table Section */}
            <div className="w-full mt-3">
              <button
                type="button"
                onClick={() => setShowHistoricTable(!showHistoricTable)}
                className="w-full flex items-center justify-between text-xs font-bold text-slate-700 py-1.5 hover:text-[#33798C] transition-colors outline-none font-din tracking-wide cursor-pointer"
              >
                <span>Nivel de Servicio Histórico</span>
                {showHistoricTable ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {showHistoricTable && (
                <div className="mt-2 overflow-hidden border border-starken-border rounded-xl shadow-xs bg-white animate-in fade-in duration-200">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead className="bg-[#F8FAFB] border-b border-starken-border">
                        <tr className="text-slate-600 font-bold text-[11px] font-din tracking-wide">
                          <th className="py-2.5 px-3 text-left">Fecha Compromiso</th>
                          <th className="py-2.5 px-3 text-left">Fecha Creación</th>
                          <th className="py-2.5 px-2.5 text-left">EP</th>
                          <th className="py-2.5 px-2.5 text-left">FP</th>
                          <th className="py-2.5 px-2.5 text-left">PE</th>
                          <th className="py-2.5 px-2.5 text-left">Total</th>
                          <th className="py-2.5 px-3 text-left">NS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-starken-border font-sans text-xs text-slate-700">
                        {pagedHistoricTable.map((row, idx) => {
                          const total = row.total ?? (row.ep + row.fp + row.pe);
                          const nsVal = row.ns !== undefined ? row.ns : (total > 0 ? `${Math.round((row.ep / total) * 100)} %` : '0 %');
                          return (
                            <tr key={idx} className="hover:bg-[#F0F8FA]/50 transition-colors">
                              <td className="py-2 px-3 font-sans text-slate-700">{row.fechaCompromiso || row.comp}</td>
                              <td className="py-2 px-3 font-sans text-slate-700">{row.fechaCreacion || '-'}</td>
                              <td className="py-2 px-2.5 font-sans text-slate-700">{row.ep}</td>
                              <td className="py-2 px-2.5 font-sans text-slate-700">{row.fp}</td>
                              <td className="py-2 px-2.5 font-sans text-slate-700">{row.pe}</td>
                              <td className="py-2 px-2.5 font-sans text-slate-700 font-semibold">{total}</td>
                              <td className="py-2 px-3 font-sans text-slate-700">{typeof nsVal === 'number' ? `${nsVal} %` : nsVal}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination: < [ 1 ] > matching reference image */}
                  <div className="flex items-center justify-end gap-1 px-3 py-2 border-t border-slate-100 text-xs font-din text-slate-500 bg-white">
                    <button
                      type="button"
                      disabled={historicPage === 1}
                      onClick={() => setHistoricPage(p => Math.max(1, p - 1))}
                      className="px-1.5 py-0.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      title="Anterior"
                    >
                      <ChevronLeft size={13} />
                    </button>
                    <span className="w-5 h-5 border border-slate-300 rounded text-slate-700 flex items-center justify-center font-bold text-xs bg-white shadow-2xs">
                      {historicPage}
                    </span>
                    <button
                      type="button"
                      disabled={historicPage === totalHistoricPages}
                      onClick={() => setHistoricPage(p => Math.min(totalHistoricPages, p + 1))}
                      className="px-1.5 py-0.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      title="Siguiente"
                    >
                      <ChevronRight size={13} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Distribución de envíos diarios */}
        <div className="bg-white rounded-2xl border border-starken-border shadow-xs flex flex-col justify-between overflow-hidden">
          <div className="p-4 sm:p-5 flex items-center justify-between border-b border-starken-border bg-slate-50/50">
            <div>
              <h3 className="font-black text-base text-slate-850 font-din tracking-wide flex items-center space-x-2">
                <Calendar size={17} className="text-[#33798C]" />
                <span>Distribución de envíos diarios</span>
              </h3>
              <p className="text-xs text-slate-500 font-sans mt-0.5 font-medium">
                Órdenes generadas y resueltas por día.
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-8 flex-1 flex flex-col justify-center">
            {/* Chart Area */}
            <div className="w-full">
              {/* Plot area with 3 horizontal guidelines */}
              <div className="relative h-52 sm:h-56 w-full flex items-end">
                {/* Horizontal Guide Lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  <div className="border-b border-slate-200/70 w-full" />
                  <div className="border-b border-slate-200/70 w-full" />
                  <div className="border-b border-slate-300 w-full" />
                </div>

                {/* Day Columns */}
                <div className="w-full flex items-end justify-between px-4 sm:px-10 relative z-10 h-full">
                  {(() => {
                    const maxVal = Math.max(
                      ...currentMetric.chartData.map(d => Math.max(d.generadas, d.resueltas)),
                      1
                    );
                    const chartMax = Math.ceil(maxVal * 1.18);
                    const plotHeightPx = 200;

                    return currentMetric.chartData.map((item, idx) => {
                      const genPx = Math.max(12, Math.round((item.generadas / chartMax) * plotHeightPx));
                      const resPx = Math.max(12, Math.round((item.resueltas / chartMax) * plotHeightPx));

                      return (
                        <div key={idx} className="flex flex-col items-center group cursor-pointer">
                          {/* Bars Pair Container */}
                          <div className="h-[200px] flex items-end justify-center gap-1.5 sm:gap-2 relative px-1">
                            {/* Floating Hover Tooltip */}
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[11px] font-bold rounded-md px-2.5 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30 font-din pointer-events-none shadow-md flex items-center gap-2">
                              <span className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-[#2B697A]" />
                                Gen: {item.generadas}
                              </span>
                              <span className="text-slate-500">|</span>
                              <span className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-[#00B67A]" />
                                Res: {item.resueltas}
                              </span>
                            </div>

                            {/* Generadas Bar (Teal) */}
                            <div
                              style={{ height: `${genPx}px` }}
                              className="w-3.5 sm:w-4.5 bg-[#2B697A] rounded-t-full transition-all duration-300 group-hover:brightness-110 shadow-2xs origin-bottom"
                              title={`Generadas: ${item.generadas}`}
                            />

                            {/* Resueltas Bar (Emerald Green) */}
                            <div
                              style={{ height: `${resPx}px` }}
                              className="w-3.5 sm:w-4.5 bg-[#00B67A] rounded-t-full transition-all duration-300 group-hover:brightness-110 shadow-2xs origin-bottom"
                              title={`Resueltas: ${item.resueltas}`}
                            />
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>

              {/* Day Labels directly below the baseline */}
              <div className="w-full flex justify-between px-4 sm:px-10 pt-3">
                {currentMetric.chartData.map((item, idx) => (
                  <div key={idx} className="w-9 sm:w-11 text-center">
                    <span className="text-xs sm:text-sm font-bold text-slate-700 font-din tracking-wide">
                      {item.day}
                    </span>
                  </div>
                ))}
              </div>

              {/* Centered Legend */}
              <div className="flex items-center justify-center gap-8 pt-6 pb-2">
                <div className="flex items-center space-x-2 cursor-default">
                  <span className="w-3 h-3 rounded-full bg-[#2B697A]" />
                  <span className="text-xs sm:text-[13px] font-bold text-slate-700 font-din">Generadas</span>
                </div>
                <div className="flex items-center space-x-2 cursor-default">
                  <span className="w-3 h-3 rounded-full bg-[#00B67A]" />
                  <span className="text-xs sm:text-[13px] font-bold text-slate-700 font-din">Resueltas</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* ========================================================================= */}
      {/* Favoritos Table Section (Always present at the end of the dashboard)      */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-starken-border shadow-xs overflow-hidden mt-6">
        {/* Card Header */}
        <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-starken-border bg-slate-50/50">
          <div>
            <div className="flex items-center space-x-2.5">
              <h3 className="font-black text-base text-slate-850 font-din tracking-wide flex items-center space-x-2">
                <Star size={17} className="fill-amber-400 text-amber-500" />
                <span>Órdenes de flete favoritas</span>
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-sans bg-amber-50 text-amber-700 border border-amber-200">
                {currentFavorites.length} {currentFavorites.length === 1 ? 'favorita' : 'favoritas'}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-sans mt-0.5 font-medium">
              Monitoreo directo de las órdenes marcadas con estrella para seguimiento prioritario.
            </p>
          </div>

          <div className="flex items-center space-x-3 self-stretch md:self-auto">
            {/* Quick Search */}
            <div className="relative flex-1 md:w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Filtrar favoritas por OF, destinatario o comuna..."
                value={favSearchQuery}
                onChange={(e) => {
                  setFavSearchQuery(e.target.value);
                  setFavCurrentPage(1);
                }}
                className="w-full bg-white border border-starken-border rounded-xl pl-8 pr-7 py-1.5 text-xs font-medium font-sans text-slate-800 placeholder-slate-400 outline-none focus:border-[#33798C] focus:ring-1 focus:ring-[#33798C]/20 transition-all shadow-2xs"
              />
              {favSearchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setFavSearchQuery('');
                    setFavCurrentPage(1);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Table or Empty State */}
        {filteredFavorites.length === 0 ? (
          <div className="p-10 text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200/80">
              <Star size={24} className="text-slate-300 stroke-1" />
            </div>
            <div className="space-y-1 max-w-md">
              <h4 className="text-sm font-bold text-slate-700 font-din">
                {favSearchQuery ? 'No se encontraron favoritas con ese filtro' : 'Aún no tienes órdenes favoritas'}
              </h4>
              <p className="text-xs text-slate-400 font-sans">
                {favSearchQuery 
                  ? 'Intenta con otro término de búsqueda o limpia el filtro.' 
                  : 'Haz clic en la estrella ★ junto al número de cualquier orden en las tablas de KPI para guardarla aquí y monitorearla rápidamente.'}
              </p>
            </div>
          </div>
        ) : (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#F0F6F8] border-b border-starken-border text-slate-600 font-bold text-xs font-din tracking-wider">
                    <th className="py-3 px-3.5 w-12 text-center">★</th>
                    <th className="py-3 px-3.5 w-32">N° OF</th>
                    <th className="py-3 px-3 w-28">Compromiso</th>
                    <th className="py-3 px-3.5">Destinatario</th>
                    <th className="py-3 px-3.5">Destino / Dirección</th>
                    <th className="py-3 px-3 text-center w-28">Bultos / Peso</th>
                    <th className="py-3 px-3 text-center w-28">Tipo entrega</th>
                    <th className="py-3 px-3 text-center w-32">Estado</th>
                    <th className="py-3 px-3 text-center w-24">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-starken-border/70 font-sans text-xs">
                  {paginatedFavorites.map((fav, idx) => {
                    const statusColor = getStatusColor(fav.status);

                    return (
                      <tr key={fav.id || idx} className="hover:bg-[#F0F8FA]/60 transition-colors group">
                        {/* Star icon / Remove */}
                        <td className="py-2.5 px-3.5 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleFav(fav)}
                            className="p-1 hover:scale-125 transition-transform cursor-pointer text-amber-400 hover:text-amber-500"
                            title="Quitar de favoritos"
                          >
                            <Star size={16} className="fill-amber-400 text-amber-400" />
                          </button>
                        </td>

                        {/* N° OF */}
                        <td className="py-2.5 px-3.5">
                          <div className="flex items-center space-x-1.5">
                            <span className="font-din font-black text-[#33798C] text-xs tracking-wide">
                              #{fav.id}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => handleCopyOf(e, fav.id)}
                              className="p-1 text-slate-400 hover:text-[#33798C] transition-colors cursor-pointer rounded"
                              title="Copiar N° de Orden de Flete"
                            >
                              {copiedOf === fav.id ? (
                                <Check size={12} className="text-emerald-600" />
                              ) : (
                                <Copy size={12} />
                              )}
                            </button>
                          </div>
                        </td>

                        {/* Fecha */}
                        <td className="py-2.5 px-3 font-din font-semibold text-slate-700">
                          {fav.fechaCompromiso || fav.fechaEmision || '09-10-2026'}
                        </td>

                        {/* Destinatario */}
                        <td className="py-2.5 px-3.5">
                          <div className="font-sans font-bold text-slate-850 truncate max-w-[190px]">
                            {fav.recipient || 'Cliente Starken'}
                          </div>
                          <div className="text-[11px] text-slate-400 font-medium font-sans">
                            {fav.phone ? `+56 ${fav.phone}` : (fav.rutDestinatario || 'RUT no registrado')}
                          </div>
                        </td>

                        {/* Destino */}
                        <td className="py-2.5 px-3.5">
                          <div className="font-sans font-bold text-slate-800">
                            {fav.comunaDestino || 'Santiago'}
                          </div>
                          <div className="text-[11px] text-slate-400 font-medium font-sans truncate max-w-[210px]">
                            {fav.direccionDestino || 'Dirección de entrega'}
                          </div>
                        </td>

                        {/* Bultos / Peso */}
                        <td className="py-2.5 px-3 text-center">
                          <span className="font-din font-bold text-slate-700">
                            {fav.bultos || 1} bulto{(fav.bultos || 1) > 1 ? 's' : ''}
                          </span>
                          <div className="text-[11px] font-din text-slate-400">
                            {fav.peso || '2.5'} kg
                          </div>
                        </td>

                        {/* Tipo Entrega */}
                        <td className="py-2.5 px-3 text-center">
                          <span className="font-sans font-bold text-[11px] text-slate-700 bg-slate-100 border border-slate-200/70 px-2 py-0.5 rounded-full inline-flex items-center space-x-1">
                            <span>{fav.tipoEntrega || 'Domicilio'}</span>
                          </span>
                        </td>

                        {/* Estado Badge */}
                        <td className="py-2.5 px-3 text-center">
                          <span 
                            className="font-sans font-bold text-[11px] px-2.5 py-1 rounded-full border inline-block whitespace-nowrap"
                            style={{
                              backgroundColor: `${statusColor}15`,
                              color: statusColor,
                              borderColor: `${statusColor}35`
                            }}
                          >
                            {fav.status || 'En tránsito'}
                          </span>
                        </td>

                        {/* Acciones */}
                        <td className="py-2.5 px-3 text-center">
                          <div className="flex items-center justify-center space-x-1">
                            {onSearchOF && (
                              <button
                                type="button"
                                onClick={() => onSearchOF(fav.id)}
                                className="p-1.5 text-slate-400 hover:text-[#33798C] hover:bg-[#ECF5F7] rounded-lg transition-colors cursor-pointer"
                                title={`Ver trazabilidad de OF #${fav.id}`}
                              >
                                <ExternalLink size={13} />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleToggleFav(fav)}
                              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Quitar de favoritos"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            {filteredFavorites.length > FAVS_PER_PAGE && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3 border-t border-starken-border text-xs font-sans bg-slate-50/40">
                <div className="text-slate-500 font-medium">
                  Mostrando <span className="font-din font-bold text-slate-850">{(favCurrentPage - 1) * FAVS_PER_PAGE + 1}</span> - <span className="font-din font-bold text-slate-850">{Math.min(favCurrentPage * FAVS_PER_PAGE, filteredFavorites.length)}</span> de <span className="font-din font-bold text-slate-850">{filteredFavorites.length}</span> favoritas
                </div>

                <div className="flex items-center space-x-1.5 font-din font-bold">
                  <button
                    type="button"
                    disabled={favCurrentPage === 1}
                    onClick={() => setFavCurrentPage(p => Math.max(1, p - 1))}
                    className="p-1.5 rounded-lg border border-starken-border bg-white hover:bg-[#ECF5F7] text-slate-600 hover:text-[#33798C] disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                    title="Página anterior"
                  >
                    <ChevronLeft size={15} />
                  </button>
                  <span className="px-2.5 py-1 text-slate-700 bg-white border border-slate-200 rounded-lg font-bold shadow-2xs">
                    {favCurrentPage} / {totalFavPages}
                  </span>
                  <button
                    type="button"
                    disabled={favCurrentPage === totalFavPages}
                    onClick={() => setFavCurrentPage(p => Math.min(totalFavPages, p + 1))}
                    className="p-1.5 rounded-lg border border-starken-border bg-white hover:bg-[#ECF5F7] text-slate-600 hover:text-[#33798C] disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                    title="Página siguiente"
                  >
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
