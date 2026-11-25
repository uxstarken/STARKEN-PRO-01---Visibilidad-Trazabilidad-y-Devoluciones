import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Package, 
  Building2, 
  MapPin, 
  User, 
  Clock, 
  Printer, 
  CheckCircle2, 
  ChevronDown, 
  UploadCloud, 
  FileCheck, 
  Download, 
  RefreshCw, 
  X,
  Truck,
  Layers,
  Sparkles,
  Search,
  Home,
  ExternalLink,
  Mail,
  Plus,
  Minus,
  Check,
  AlertTriangle,
  AlertCircle
} from 'lucide-react';

// Comprehensive Starken Branches Database by Region and Comuna with cartographic coordinates
const STARKEN_BRANCHES_DATA = {
  'Metropolitana': {
    'Providencia': [
      {
        id: 'stk-prov-01',
        name: 'Sucursal Pedro de Valdivia',
        address: 'Av. Pedro de Valdivia 1145',
        comuna: 'Providencia',
        region: 'Metropolitana',
        schedule: 'Lun - Vie 08:30 - 18:30 | Sáb 09:00 - 13:00',
        phone: '+56 2 2789 4001',
        services: ['Recepción & Retiro B2B', 'Emisión Express', 'Estacionamiento Clientes'],
        mapCoords: { x: 48, y: 44 },
        badge: 'Sucursal Principal'
      },
      {
        id: 'stk-prov-02',
        name: 'Sucursal Manuel Montt',
        address: 'Av. Manuel Montt 088',
        comuna: 'Providencia',
        region: 'Metropolitana',
        schedule: 'Lun - Vie 09:00 - 18:30',
        phone: '+56 2 2789 4002',
        services: ['Recepción & Entrega', 'Bultos hasta 50kg', 'Metro Manuel Montt'],
        mapCoords: { x: 30, y: 34 },
        badge: 'Cerca de Metro'
      },
      {
        id: 'stk-prov-03',
        name: 'Sucursal Tobalaba / Costanera',
        address: 'Av. Providencia 2653, Local 12',
        comuna: 'Providencia',
        region: 'Metropolitana',
        schedule: 'Lun - Vie 09:00 - 19:00 | Sáb 09:00 - 14:00',
        phone: '+56 2 2789 4003',
        services: ['Recepción & Entrega', 'Horario Extendido', 'E-Commerce'],
        mapCoords: { x: 74, y: 56 },
        badge: 'Horario Extendido'
      }
    ],
    'Santiago Centro': [
      {
        id: 'stk-stgo-01',
        name: 'Sucursal Alameda Central',
        address: 'Av. Libertador Bernardo O’Higgins 1300',
        comuna: 'Santiago Centro',
        region: 'Metropolitana',
        schedule: 'Lun - Vie 08:30 - 19:00 | Sáb 09:00 - 14:00',
        phone: '+56 2 2789 4010',
        services: ['Carga Pesada B2B', 'Emisión Express', 'Atención Preferencial'],
        mapCoords: { x: 44, y: 46 },
        badge: 'Hub Central'
      },
      {
        id: 'stk-stgo-02',
        name: 'Sucursal San Diego',
        address: 'San Diego 820',
        comuna: 'Santiago Centro',
        region: 'Metropolitana',
        schedule: 'Lun - Vie 08:30 - 18:30',
        phone: '+56 2 2789 4011',
        services: ['Recepción & Retiro', 'Bultos Comerciales'],
        mapCoords: { x: 56, y: 66 },
        badge: 'Comercial'
      },
      {
        id: 'stk-stgo-03',
        name: 'Sucursal Parque Almagro',
        address: 'Santa Isabel 580',
        comuna: 'Santiago Centro',
        region: 'Metropolitana',
        schedule: 'Lun - Vie 09:00 - 18:00',
        phone: '+56 2 2789 4012',
        services: ['Recepción Paquetes', 'Metro Parque Almagro'],
        mapCoords: { x: 64, y: 74 },
        badge: 'Rápida Atención'
      }
    ],
    'Las Condes': [
      {
        id: 'stk-lc-01',
        name: 'Sucursal Manquehue Norte',
        address: 'Av. Manquehue Norte 354',
        comuna: 'Las Condes',
        region: 'Metropolitana',
        schedule: 'Lun - Vie 09:00 - 19:00 | Sáb 09:30 - 13:30',
        phone: '+56 2 2789 4020',
        services: ['B2B Express', 'Estacionamiento Subterráneo'],
        mapCoords: { x: 62, y: 38 },
        badge: 'Exclusiva'
      },
      {
        id: 'stk-lc-02',
        name: 'Sucursal Apoquindo / El Golf',
        address: 'Av. Apoquindo 4400, Local 5',
        comuna: 'Las Condes',
        region: 'Metropolitana',
        schedule: 'Lun - Vie 08:30 - 18:30',
        phone: '+56 2 2789 4021',
        services: ['Recepción Rápida', 'Corporativo'],
        mapCoords: { x: 38, y: 48 },
        badge: 'Corporativa'
      }
    ],
    'San Bernardo': [
      {
        id: 'stk-sb-01',
        name: 'Centro de Distribución Lo Boza / San Bernardo',
        address: 'Camino La Vara 0310, Bodega 4',
        comuna: 'San Bernardo',
        region: 'Metropolitana',
        schedule: 'Lun - Vie 08:00 - 20:00 | Sáb 08:30 - 14:00',
        phone: '+56 2 2789 4030',
        services: ['Mega Hub B2B', 'Carga Paletizada', 'Despacho Directo Planitack'],
        mapCoords: { x: 50, y: 50 },
        badge: 'Mega Hub B2B'
      },
      {
        id: 'stk-sb-02',
        name: 'Sucursal San Bernardo Centro',
        address: 'Eyzaguirre 680',
        comuna: 'San Bernardo',
        region: 'Metropolitana',
        schedule: 'Lun - Vie 08:30 - 18:30 | Sáb 09:00 - 13:00',
        phone: '+56 2 2789 4031',
        services: ['Recepción & Entrega', 'Fácil Acceso'],
        mapCoords: { x: 42, y: 62 },
        badge: 'Centro'
      }
    ]
  },
  'Biobío': {
    'Concepción': [
      {
        id: 'stk-ccp-01',
        name: 'Sucursal Los Carrera Concepción',
        address: 'Av. Los Carrera 1420',
        comuna: 'Concepción',
        region: 'Biobío',
        schedule: 'Lun - Vie 08:30 - 18:30 | Sáb 09:00 - 13:00',
        phone: '+56 41 223 9001',
        services: ['Hub Regional Sur', 'Emisión Express', 'Carga Pesada'],
        mapCoords: { x: 50, y: 45 },
        badge: 'Hub Regional'
      },
      {
        id: 'stk-ccp-02',
        name: 'Sucursal Barros Arana Centro',
        address: 'Barros Arana 1090',
        comuna: 'Concepción',
        region: 'Biobío',
        schedule: 'Lun - Vie 09:00 - 18:30',
        phone: '+56 41 223 9002',
        services: ['Recepción & Entrega', 'Centro'],
        mapCoords: { x: 38, y: 55 },
        badge: 'Comercial'
      }
    ],
    'Talcahuano': [
      {
        id: 'stk-tal-01',
        name: 'Sucursal Talcahuano Puerto',
        address: 'Av. Blanco Encalada 450',
        comuna: 'Talcahuano',
        region: 'Biobío',
        schedule: 'Lun - Vie 08:30 - 18:00',
        phone: '+56 41 223 9010',
        services: ['Puerto & Pesca', 'Carga Industrial'],
        mapCoords: { x: 55, y: 35 },
        badge: 'Puerto'
      }
    ]
  },
  'Valparaíso': {
    'Viña del Mar': [
      {
        id: 'stk-vina-01',
        name: 'Sucursal 1 Norte Viña',
        address: '1 Norte 1040',
        comuna: 'Viña del Mar',
        region: 'Valparaíso',
        schedule: 'Lun - Vie 08:30 - 18:30 | Sáb 09:00 - 13:30',
        phone: '+56 32 268 4001',
        services: ['Hub Costa', 'Estacionamiento Clientes', 'Emisión Rápida'],
        mapCoords: { x: 52, y: 40 },
        badge: 'Hub Costa'
      },
      {
        id: 'stk-vina-02',
        name: 'Sucursal Libertad',
        address: 'Av. Libertad 340',
        comuna: 'Viña del Mar',
        region: 'Valparaíso',
        schedule: 'Lun - Vie 09:00 - 18:30',
        phone: '+56 32 268 4002',
        services: ['Recepción & Entrega', 'Urbano'],
        mapCoords: { x: 68, y: 50 },
        badge: 'Urbano'
      }
    ],
    'Valparaíso': [
      {
        id: 'stk-valp-01',
        name: 'Sucursal Puerto Valparaíso',
        address: 'Av. Errázuriz 1140',
        comuna: 'Valparaíso',
        region: 'Valparaíso',
        schedule: 'Lun - Vie 08:30 - 18:00',
        phone: '+56 32 268 4010',
        services: ['B2B Portuario', 'Recepción Paquetes'],
        mapCoords: { x: 45, y: 60 },
        badge: 'Puerto'
      }
    ]
  },
  'Coquimbo': {
    'La Serena': [
      {
        id: 'stk-ser-01',
        name: 'Sucursal Balmaceda La Serena',
        address: 'Av. Balmaceda 2100',
        comuna: 'La Serena',
        region: 'Coquimbo',
        schedule: 'Lun - Vie 08:30 - 18:30 | Sáb 09:00 - 13:00',
        phone: '+56 51 221 4001',
        services: ['Hub Norte Chico', 'Estacionamiento', 'Carga Minera'],
        mapCoords: { x: 48, y: 46 },
        badge: 'Hub Norte Chico'
      }
    ]
  },
  'Antofagasta': {
    'Antofagasta': [
      {
        id: 'stk-ant-01',
        name: 'Sucursal Balmaceda Antofagasta',
        address: 'Av. Balmaceda 2500',
        comuna: 'Antofagasta',
        region: 'Antofagasta',
        schedule: 'Lun - Vie 08:30 - 19:00 | Sáb 09:00 - 14:00',
        phone: '+56 55 224 8000',
        services: ['Hub Minero Norte', 'Carga Pesada', 'Emisión Industrial'],
        mapCoords: { x: 50, y: 50 },
        badge: 'Hub Minero'
      }
    ]
  }
};

// Predictive Chilean Addresses Database for Autocomplete & Georeferencing
const PREDICTIVE_ADDRESSES_DB = [
  {
    address: 'Uva de la Cordillera 880',
    street: 'Uva de la Cordillera',
    number: '880',
    comuna: 'Puente Alto',
    region: 'Metropolitana',
    regionFull: 'Región Metropolitana de Santiago',
    postalCode: '9227729',
    lat: -33.53507,
    lng: -70.54222,
    pinPercent: { x: 45, y: 38 }
  },
  {
    address: 'Av. Providencia 1240',
    street: 'Av. Providencia',
    number: '1240',
    comuna: 'Providencia',
    region: 'Metropolitana',
    regionFull: 'Región Metropolitana de Santiago',
    postalCode: '7500000',
    lat: -33.42851,
    lng: -70.61892,
    pinPercent: { x: 52, y: 44 }
  },
  {
    address: 'Av. Andrés Bello 2457',
    street: 'Av. Andrés Bello',
    number: '2457',
    comuna: 'Providencia',
    region: 'Metropolitana',
    regionFull: 'Región Metropolitana de Santiago',
    postalCode: '7510689',
    lat: -33.41872,
    lng: -70.60741,
    pinPercent: { x: 55, y: 40 }
  },
  {
    address: 'Av. Apoquindo 4800',
    street: 'Av. Apoquindo',
    number: '4800',
    comuna: 'Las Condes',
    region: 'Metropolitana',
    regionFull: 'Región Metropolitana de Santiago',
    postalCode: '7550000',
    lat: -33.41123,
    lng: -70.57945,
    pinPercent: { x: 60, y: 36 }
  },
  {
    address: 'Av. Vitacura 3565',
    street: 'Av. Vitacura',
    number: '3565',
    comuna: 'Vitacura',
    region: 'Metropolitana',
    regionFull: 'Región Metropolitana de Santiago',
    postalCode: '7630000',
    lat: -33.39841,
    lng: -70.59622,
    pinPercent: { x: 58, y: 32 }
  },
  {
    address: 'Av. Libertador Bernardo O\'Higgins 1058',
    street: 'Av. Libertador Bernardo O\'Higgins',
    number: '1058',
    comuna: 'Santiago',
    region: 'Metropolitana',
    regionFull: 'Región Metropolitana de Santiago',
    postalCode: '8320000',
    lat: -33.44489,
    lng: -70.65144,
    pinPercent: { x: 40, y: 50 }
  },
  {
    address: 'Av. Los Carrera 1420',
    street: 'Av. Los Carrera',
    number: '1420',
    comuna: 'Concepción',
    region: 'Biobío',
    regionFull: 'Región del Biobío',
    postalCode: '4030000',
    lat: -36.82415,
    lng: -73.04891,
    pinPercent: { x: 48, y: 46 }
  },
  {
    address: 'Av. Libertad 890',
    street: 'Av. Libertad',
    number: '890',
    comuna: 'Viña del Mar',
    region: 'Valparaíso',
    regionFull: 'Región de Valparaíso',
    postalCode: '2520000',
    lat: -33.01894,
    lng: -71.55112,
    pinPercent: { x: 50, y: 42 }
  },
  {
    address: 'Av. Francisco de Aguirre 450',
    street: 'Av. Francisco de Aguirre',
    number: '450',
    comuna: 'La Serena',
    region: 'Coquimbo',
    regionFull: 'Región de Coquimbo',
    postalCode: '1700000',
    lat: -29.90451,
    lng: -71.25332,
    pinPercent: { x: 46, y: 45 }
  },
  {
    address: 'Av. Alemania 0425',
    street: 'Av. Alemania',
    number: '0425',
    comuna: 'Temuco',
    region: 'La Araucanía',
    regionFull: 'Región de La Araucanía',
    postalCode: '4780000',
    lat: -38.73652,
    lng: -72.60412,
    pinPercent: { x: 47, y: 48 }
  }
];

export default function EmisionView({ selectedAccount, onSwitchToTracking, showToast }) {
  const [emissionMode, setEmissionMode] = useState('unitaria'); // 'unitaria' or 'masiva'
  const [generatedLabel, setGeneratedLabel] = useState(null);

  // Branch Selector states for Sucursal Starken
  const [branchRegion, setBranchRegion] = useState('Metropolitana');
  const [branchComuna, setBranchComuna] = useState('Providencia');
  const [selectedBranchId, setSelectedBranchId] = useState('stk-prov-01');
  const [mapZoom, setMapZoom] = useState(1);

  const [unitForm, setUnitForm] = useState({
    recipientName: '',
    recipientRut: '',
    recipientPhone: '',
    recipientEmail: '',
    destinationRegion: 'Metropolitana',
    destinationComuna: 'Providencia',
    destinationAddress: 'Av. Pedro de Valdivia 1145',
    destinationNumber: '',
    selectedBranchName: 'Sucursal Pedro de Valdivia',
    deliveryType: 'Domicilio', // Domicilio or Sucursal
    serviceType: 'Express', // Express (24h) or Normal (48h)
    packages: 1,
    weight: 2.5,
    length: 25,
    width: 20,
    height: 15,
    declaredValue: 50000,
    invoiceNumber: '',
    contentDescription: 'Artículos electrónicos / accesorios'
  });

  // Bulk emission state
  const [bulkFile, setBulkFile] = useState(null);
  const [bulkValidatedRows, setBulkValidatedRows] = useState([]);
  const [isBulkEmitting, setIsBulkEmitting] = useState(false);
  
  // Predictive Address Autocomplete & Confirmation Modal States
  const [isAddressSuggestionsOpen, setIsAddressSuggestionsOpen] = useState(false);
  const [isConfirmAddressModalOpen, setIsConfirmAddressModalOpen] = useState(false);
  const [confirmAddressData, setConfirmAddressData] = useState({
    address: 'Uva de la Cordillera 880',
    street: 'Uva de la Cordillera',
    number: '880',
    comuna: 'Puente Alto',
    region: 'Metropolitana',
    regionFull: 'Región Metropolitana de Santiago',
    postalCode: '9227729',
    lat: -33.53507,
    lng: -70.54222,
    pinPercent: { x: 45, y: 38 },
    modalSearchInput: 'Uva de la Cordillera 880, Puente Alto'
  });
  const [addressModalZoom, setAddressModalZoom] = useState(1);
  const addressAutocompleteRef = useRef(null);

  // Close predictive suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (addressAutocompleteRef.current && !addressAutocompleteRef.current.contains(event.target)) {
        setIsAddressSuggestionsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter predictive address database
  const filteredPredictiveAddresses = useMemo(() => {
    const query = (unitForm.destinationAddress || '').trim().toLowerCase();
    if (!query) return PREDICTIVE_ADDRESSES_DB.slice(0, 5);
    const matches = PREDICTIVE_ADDRESSES_DB.filter(item => 
      item.address.toLowerCase().includes(query) ||
      item.street.toLowerCase().includes(query) ||
      item.comuna.toLowerCase().includes(query)
    );
    return matches.length > 0 ? matches : PREDICTIVE_ADDRESSES_DB.slice(0, 4);
  }, [unitForm.destinationAddress]);

  // Select an address suggestion to open the confirmation modal
  const handleSelectPredictiveAddress = (item) => {
    setConfirmAddressData({
      address: item.address,
      street: item.street,
      number: item.number,
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

  // Open confirmation modal for custom address or Enter key
  const handleOpenCustomConfirmModal = () => {
    const query = (unitForm.destinationAddress || '').trim();
    const match = PREDICTIVE_ADDRESSES_DB.find(item => item.address.toLowerCase() === query.toLowerCase());
    if (match) {
      handleSelectPredictiveAddress(match);
      return;
    }

    setConfirmAddressData({
      address: query || 'Uva de la Cordillera 880',
      street: query || 'Uva de la Cordillera',
      number: '',
      comuna: unitForm.destinationComuna || 'Puente Alto',
      region: unitForm.destinationRegion || 'Metropolitana',
      regionFull: unitForm.destinationRegion === 'Metropolitana' ? 'Región Metropolitana de Santiago' : `Región del ${unitForm.destinationRegion}`,
      postalCode: '9227729',
      lat: -33.53507,
      lng: -70.54222,
      pinPercent: { x: 45, y: 38 },
      modalSearchInput: query || 'Uva de la Cordillera 880'
    });
    setAddressModalZoom(1);
    setIsAddressSuggestionsOpen(false);
    setIsConfirmAddressModalOpen(true);
  };

  // Click on map to adjust pin position and update coordinates
  const handleMapClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const pctX = Math.max(8, Math.min(92, (clickX / rect.width) * 100));
    const pctY = Math.max(12, Math.min(88, (clickY / rect.height) * 100));

    const baseLat = -33.53507;
    const baseLng = -70.54222;
    const deltaY = (pctY - 38) * -0.0006;
    const deltaX = (pctX - 45) * 0.0006;

    const newLat = parseFloat((baseLat + deltaY).toFixed(5));
    const newLng = parseFloat((baseLng + deltaX).toFixed(5));

    setConfirmAddressData(prev => ({
      ...prev,
      lat: newLat,
      lng: newLng,
      pinPercent: { x: pctX, y: pctY }
    }));
  };

  // Search address or Google Maps URL inside the modal
  const handleModalAddressSearch = (e) => {
    if (e) e.preventDefault();
    const query = (confirmAddressData.modalSearchInput || '').trim().toLowerCase();
    if (!query) return;

    if (query.includes('google.com/maps') || query.includes('@')) {
      const match = query.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (match) {
        setConfirmAddressData(prev => ({
          ...prev,
          lat: parseFloat(match[1]),
          lng: parseFloat(match[2]),
          pinPercent: { x: 50, y: 40 }
        }));
        if (showToast) showToast('Coordenadas detectadas desde enlace de Google Maps', 'success');
        return;
      }
    }

    const found = PREDICTIVE_ADDRESSES_DB.find(item => 
      item.address.toLowerCase().includes(query) ||
      item.street.toLowerCase().includes(query) ||
      item.comuna.toLowerCase().includes(query)
    );

    if (found) {
      setConfirmAddressData({
        ...found,
        pinPercent: found.pinPercent || { x: 45, y: 38 },
        modalSearchInput: `${found.address}, ${found.comuna}`
      });
      if (showToast) showToast(`Dirección localizada: ${found.address}`, 'success');
    } else {
      setConfirmAddressData(prev => ({
        ...prev,
        address: confirmAddressData.modalSearchInput,
        street: confirmAddressData.modalSearchInput
      }));
      if (showToast) showToast('Dirección actualizada en el mapa', 'success');
    }
  };

  // Save the verified address and update destination inputs
  const handleSaveConfirmedAddress = () => {
    setUnitForm(prev => ({
      ...prev,
      destinationAddress: confirmAddressData.address,
      destinationComuna: confirmAddressData.comuna || prev.destinationComuna,
      destinationRegion: confirmAddressData.region || prev.destinationRegion
    }));
    setIsConfirmAddressModalOpen(false);
    if (showToast) {
      showToast('Dirección confirmada y georreferenciada con éxito', 'success');
    }
  };

  // Derived available comunas and branches for the selected region
  const availableComunas = useMemo(() => {
    return STARKEN_BRANCHES_DATA[branchRegion] ? Object.keys(STARKEN_BRANCHES_DATA[branchRegion]) : [];
  }, [branchRegion]);

  const availableBranches = useMemo(() => {
    if (STARKEN_BRANCHES_DATA[branchRegion] && STARKEN_BRANCHES_DATA[branchRegion][branchComuna]) {
      return STARKEN_BRANCHES_DATA[branchRegion][branchComuna];
    }
    return [];
  }, [branchRegion, branchComuna]);

  const selectedBranch = useMemo(() => {
    return availableBranches.find(b => b.id === selectedBranchId) || availableBranches[0] || null;
  }, [availableBranches, selectedBranchId]);

  // Handler when user changes region in branch picker
  const handleRegionChange = (newRegion) => {
    setBranchRegion(newRegion);
    const newComunas = Object.keys(STARKEN_BRANCHES_DATA[newRegion] || {});
    const firstComuna = newComunas[0] || '';
    setBranchComuna(firstComuna);
    if (STARKEN_BRANCHES_DATA[newRegion] && STARKEN_BRANCHES_DATA[newRegion][firstComuna]) {
      const firstBranch = STARKEN_BRANCHES_DATA[newRegion][firstComuna][0];
      if (firstBranch) {
        setSelectedBranchId(firstBranch.id);
        setUnitForm(prev => ({
          ...prev,
          destinationRegion: newRegion,
          destinationComuna: firstComuna,
          destinationAddress: firstBranch.address,
          selectedBranchName: firstBranch.name
        }));
      }
    }
  };

  // Handler when user changes comuna in branch picker
  const handleComunaChange = (newComuna) => {
    setBranchComuna(newComuna);
    if (STARKEN_BRANCHES_DATA[branchRegion] && STARKEN_BRANCHES_DATA[branchRegion][newComuna]) {
      const firstBranch = STARKEN_BRANCHES_DATA[branchRegion][newComuna][0];
      if (firstBranch) {
        setSelectedBranchId(firstBranch.id);
        setUnitForm(prev => ({
          ...prev,
          destinationComuna: newComuna,
          destinationAddress: firstBranch.address,
          selectedBranchName: firstBranch.name
        }));
      }
    }
  };

  // Handler when user clicks on a branch card or map marker
  const handleSelectBranch = (branch) => {
    setSelectedBranchId(branch.id);
    setUnitForm(prev => ({
      ...prev,
      destinationRegion: branch.region,
      destinationComuna: branch.comuna,
      destinationAddress: branch.address,
      selectedBranchName: branch.name
    }));
  };

  // Handler when user toggles between Domicilio and Sucursal
  const handleDeliveryTypeChange = (type) => {
    if (type === 'Sucursal') {
      const currentBranch = selectedBranch;
      setUnitForm(prev => ({
        ...prev,
        deliveryType: 'Sucursal',
        destinationRegion: branchRegion,
        destinationComuna: branchComuna,
        destinationAddress: currentBranch ? currentBranch.address : prev.destinationAddress,
        selectedBranchName: currentBranch ? currentBranch.name : 'Sucursal Starken'
      }));
    } else {
      setUnitForm(prev => ({
        ...prev,
        deliveryType: 'Domicilio'
      }));
    }
  };

  // Handle single shipment emission
  const handleUnitEmission = (e) => {
    e.preventDefault();
    if (!unitForm.recipientName) {
      alert('Por favor completa el nombre del destinatario.');
      return;
    }
    if (unitForm.deliveryType === 'Domicilio' && !unitForm.destinationAddress) {
      alert('Por favor ingresa la calle / dirección de entrega.');
      return;
    }

    const generatedOfNumber = `222${Math.floor(100000 + Math.random() * 900000)}`;
    const destinationText = unitForm.deliveryType === 'Sucursal'
      ? `Retiro en sucursal Starken: ${unitForm.destinationAddress} (${unitForm.destinationComuna})`
      : `${unitForm.destinationAddress} ${unitForm.destinationNumber || ''}, ${unitForm.destinationComuna}`;

    const labelData = {
      of: generatedOfNumber,
      recipient: unitForm.recipientName,
      rut: unitForm.recipientRut || '16.492.381-8',
      phone: unitForm.recipientPhone || '+56 9 8765 4321',
      destination: destinationText,
      comuna: unitForm.destinationComuna,
      service: unitForm.serviceType === 'Express' ? 'Starken Express B2B' : 'Starken Normal B2B',
      deliveryType: unitForm.deliveryType,
      branchName: unitForm.selectedBranchName || '',
      packages: unitForm.packages,
      weight: `${unitForm.weight} kg`,
      declaredValue: `$${Number(unitForm.declaredValue).toLocaleString('es-CL')}`,
      date: '09-10-2026 16:30 hrs',
      sender: selectedAccount
    };

    setGeneratedLabel(labelData);
    if (showToast) {
      showToast(`Orden de flete #${generatedOfNumber} emitida exitosamente. Etiqueta lista para imprimir.`, 'success');
    }
  };

  // Handle bulk file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBulkFile(file);

    setBulkValidatedRows([
      { row: 1, recipient: 'Claudia Fuentes', rut: '15.688.949-0', comuna: 'Concepción', address: 'Av. Los Carrera 1420', bultos: 2, weight: '4.5 kg', status: 'Válido' },
      { row: 2, recipient: 'Juan Carlos Espinoza', rut: '13.910.482-5', comuna: 'La Serena', address: 'Balmaceda 2100', bultos: 1, weight: '2.0 kg', status: 'Válido' },
      { row: 3, recipient: 'Mario Gatta', rut: '9.856.139-7', comuna: 'Paine', address: 'Av Pdte Prieto 0271', bultos: 3, weight: '12.0 kg', status: 'Válido' },
      { row: 4, recipient: 'Alva Rosa Farias', rut: '12.449.812-3', comuna: 'Valparaíso', address: 'Plaza Sotomayor 45', bultos: 1, weight: '1.5 kg', status: 'Válido' },
      { row: 5, recipient: 'Milton Rene Nuñez', rut: '11.832.901-7', comuna: 'San Felipe', address: '9 Nte 555', bultos: 4, weight: '8.0 kg', status: 'Válido' }
    ]);
  };

  const handleBulkProcess = () => {
    setIsBulkEmitting(true);
    setTimeout(() => {
      setIsBulkEmitting(false);
      setBulkFile(null);
      setBulkValidatedRows([]);
      if (showToast) {
        showToast(`Se han emitido 5 órdenes de flete masivas con éxito. Paquete PDF generado.`, 'success');
      }
    }, 1500);
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
              Emisión
            </h1>
            <p className="text-xs sm:text-sm text-slate-100/90 font-medium font-sans leading-relaxed">
              Genera órdenes de flete unitarias con selector interactivo de sucursales Starken y entrega a domicilio, o emite masivamente cargando tus planillas Excel y CSV.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-xl border border-starken-border p-5 sm:p-6 space-y-6 shadow-xs">
        
        {/* Mode Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-sm font-bold font-din text-slate-900">Modalidad de emisión</h2>
            <p className="text-xs text-slate-500 font-sans font-medium">Elige entre emisión individual o procesamiento masivo por archivo.</p>
          </div>

          <div className="bg-slate-100 p-1 rounded-xl flex items-center font-sans text-xs font-bold self-start sm:self-auto">
            <button
              onClick={() => setEmissionMode('unitaria')}
              className={`px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                emissionMode === 'unitaria' ? 'bg-[#33798C] text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Package size={14} />
              <span>Emisión unitaria</span>
            </button>
            <button
              onClick={() => setEmissionMode('masiva')}
              className={`px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                emissionMode === 'masiva' ? 'bg-[#33798C] text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers size={14} />
              <span>Emisión masiva (Excel/CSV)</span>
            </button>
          </div>
        </div>

        {/* Mode A: Emision Unitaria */}
        {emissionMode === 'unitaria' && (
          <form onSubmit={handleUnitEmission} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Form Inputs (8 cols) */}
            <div className="lg:col-span-8 space-y-5">
              

              {/* Destinatario Section */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-2xs">
                <h3 className="font-din font-bold text-xs text-slate-800 flex items-center gap-1.5">
                  <User size={14} className="text-[#33798C]" />
                  <span>1. Datos del destinatario</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                  <div className="space-y-2 sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1.5">Nombre o razón social *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Distribuidora del Sur SpA / Claudia Fuentes"
                      value={unitForm.recipientName}
                      onChange={(e) => setUnitForm({ ...unitForm, recipientName: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-[#33798C] focus:ring-1 focus:ring-[#33798C]/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block font-bold text-slate-700 mb-1.5">RUT destinatario</label>
                    <input
                      type="text"
                      placeholder="Ej. 76.492.118-K"
                      value={unitForm.recipientRut}
                      onChange={(e) => setUnitForm({ ...unitForm, recipientRut: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-[#33798C]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block font-bold text-slate-700 mb-1.5">Teléfono móvil</label>
                    <input
                      type="text"
                      placeholder="+56 9 8475 3622"
                      value={unitForm.recipientPhone}
                      onChange={(e) => setUnitForm({ ...unitForm, recipientPhone: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-[#33798C]"
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1.5">Correo electrónico (notificaciones de entrega)</label>
                    <input
                      type="email"
                      placeholder="cliente@empresa.cl"
                      value={unitForm.recipientEmail}
                      onChange={(e) => setUnitForm({ ...unitForm, recipientEmail: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-[#33798C]"
                    />
                  </div>
                </div>
              </div>

              {/* Destino y Dirección */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <h3 className="font-din font-bold text-xs text-slate-800 flex items-center gap-1.5">
                    <MapPin size={14} className="text-[#33798C]" />
                    <span>2. Destino y modalidad de entrega</span>
                  </h3>
                  <span className="text-[11px] font-sans font-medium text-slate-400">
                    {unitForm.deliveryType === 'Sucursal' ? 'Retiro en red Starken' : 'Despacho a puerta'}
                  </span>
                </div>

                {/* Modalidad de Entrega Selector Radios */}
                <div className="space-y-1.5 bg-slate-50/80 p-3 rounded-xl border border-slate-200/70">
                  <label className="font-bold text-slate-700 text-xs block">Modalidad de entrega *</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-sans text-xs font-bold">
                    <label 
                      onClick={() => handleDeliveryTypeChange('Domicilio')}
                      className={`flex items-center gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-all ${
                        unitForm.deliveryType === 'Domicilio'
                          ? 'border-[#33798C] bg-[#ECF5F7] text-[#1e4f5e] shadow-2xs'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="deliveryTypeRadio"
                        checked={unitForm.deliveryType === 'Domicilio'}
                        onChange={() => handleDeliveryTypeChange('Domicilio')}
                        className="accent-[#33798C]"
                      />
                      <div className="flex items-center gap-1.5">
                        <Truck size={14} className={unitForm.deliveryType === 'Domicilio' ? 'text-[#33798C]' : 'text-slate-400'} />
                        <span>A domicilio (dirección particular)</span>
                      </div>
                    </label>

                    <label 
                      onClick={() => handleDeliveryTypeChange('Sucursal')}
                      className={`flex items-center gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-all ${
                        unitForm.deliveryType === 'Sucursal'
                          ? 'border-[#33798C] bg-[#ECF5F7] text-[#1e4f5e] shadow-2xs'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="deliveryTypeRadio"
                        checked={unitForm.deliveryType === 'Sucursal'}
                        onChange={() => handleDeliveryTypeChange('Sucursal')}
                        className="accent-[#33798C]"
                      />
                      <div className="flex items-center gap-1.5">
                        <Building2 size={14} className={unitForm.deliveryType === 'Sucursal' ? 'text-[#33798C]' : 'text-slate-400'} />
                        <span>Sucursal Starken (retiro en agencia)</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Case A: A DOMICILIO */}
                {unitForm.deliveryType === 'Domicilio' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans animate-in fade-in-50 duration-200">
                    <div className="space-y-2">
                      <label className="block font-bold text-slate-700 mb-1.5">Región destino *</label>
                      <div className="relative">
                        <select
                          value={unitForm.destinationRegion}
                          onChange={(e) => setUnitForm({ ...unitForm, destinationRegion: e.target.value })}
                          className="w-full pl-3 pr-10 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-[#33798C] bg-white cursor-pointer font-sans appearance-none shadow-2xs"
                        >
                          <option value="Metropolitana">Metropolitana de Santiago</option>
                          <option value="Biobío">Biobío (Concepción)</option>
                          <option value="Valparaíso">Valparaíso / Viña del Mar</option>
                          <option value="Coquimbo">Coquimbo / La Serena</option>
                          <option value="Antofagasta">Antofagasta</option>
                          <option value="La Araucanía">La Araucanía (Temuco)</option>
                          <option value="Los Lagos">Los Lagos (Puerto Montt)</option>
                        </select>
                        <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#33798C] pointer-events-none" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block font-bold text-slate-700 mb-1.5">Comuna destino *</label>
                      <div className="relative">
                        <select
                          value={unitForm.destinationComuna}
                          onChange={(e) => setUnitForm({ ...unitForm, destinationComuna: e.target.value })}
                          className="w-full pl-3 pr-10 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-[#33798C] bg-white cursor-pointer font-sans appearance-none shadow-2xs"
                        >
                          <option value="Providencia">Providencia</option>
                          <option value="Santiago">Santiago Centro</option>
                          <option value="Las Condes">Las Condes</option>
                          <option value="Vitacura">Vitacura</option>
                          <option value="Puente Alto">Puente Alto</option>
                          <option value="San Bernardo">San Bernardo</option>
                          <option value="Concepción">Concepción</option>
                          <option value="Viña del Mar">Viña del Mar</option>
                          <option value="La Serena">La Serena</option>
                          <option value="Temuco">Temuco</option>
                          <option value="Antofagasta">Antofagasta</option>
                          <option value="Puerto Montt">Puerto Montt</option>
                        </select>
                        <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#33798C] pointer-events-none" />
                      </div>
                    </div>

                    <div className="space-y-2 sm:col-span-2 relative" ref={addressAutocompleteRef}>
                      <label className="block font-bold text-slate-700 mb-1.5">Calle / avenida *</label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          placeholder="Ej. Uva de la Cordillera / Av. Providencia"
                          value={unitForm.destinationAddress}
                          onFocus={() => setIsAddressSuggestionsOpen(true)}
                          onChange={(e) => {
                            setUnitForm({ ...unitForm, destinationAddress: e.target.value });
                            setIsAddressSuggestionsOpen(true);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleOpenCustomConfirmModal();
                            }
                          }}
                          className="w-full pl-9 pr-24 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-[#33798C] focus:ring-1 focus:ring-[#33798C]/20 shadow-2xs"
                        />
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <button
                          type="button"
                          onClick={handleOpenCustomConfirmModal}
                          className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-[#ECF5F7] hover:bg-[#d8edf1] text-[#33798C] text-[10px] font-bold rounded font-din transition-colors cursor-pointer flex items-center gap-1"
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

                          <div className="max-h-60 overflow-y-auto divide-y divide-slate-100">
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

                            {/* Option to confirm typed text directly */}
                            {unitForm.destinationAddress && (
                              <button
                                type="button"
                                onClick={handleOpenCustomConfirmModal}
                                className="w-full px-3 py-2 text-left flex items-center gap-2 bg-slate-50/50 hover:bg-slate-100 text-[11px] text-slate-600 transition-colors cursor-pointer border-t border-slate-100 font-sans"
                              >
                                <Search size={12} className="text-[#33798C]" />
                                <span>Usar <strong>"{unitForm.destinationAddress}"</strong> y confirmar en el mapa</span>
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                      <label className="block font-bold text-slate-700 mb-1.5">Número / depto / oficina / referencia</label>
                      <input
                        type="text"
                        placeholder="Ej. 1420, Depto 502 (Edificio B)"
                        value={unitForm.destinationNumber}
                        onChange={(e) => setUnitForm({ ...unitForm, destinationNumber: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-[#33798C]"
                      />
                    </div>
                  </div>
                )}

                {/* Case B: SUCURSAL STARKEN (2 inputs: Region + Comuna + Mini-map beside) */}
                {unitForm.deliveryType === 'Sucursal' && (
                  <div className="space-y-4 animate-in fade-in-50 duration-200">
                    {/* Two Dropdown Inputs: Región & Comuna */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans">
                      <div className="space-y-2">
                        <label className="block font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                          <span>Región de retiro *</span>
                          <span className="text-[10px] text-slate-400 font-normal">({Object.keys(STARKEN_BRANCHES_DATA).length} disponibles)</span>
                        </label>
                        <div className="relative">
                          <select
                            value={branchRegion}
                            onChange={(e) => handleRegionChange(e.target.value)}
                            className="w-full pl-3 pr-10 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:border-[#33798C] bg-white cursor-pointer font-sans font-medium appearance-none shadow-2xs"
                          >
                            {Object.keys(STARKEN_BRANCHES_DATA).map(reg => (
                              <option key={reg} value={reg}>Región {reg === 'Metropolitana' ? 'Metropolitana de Santiago' : reg}</option>
                            ))}
                          </select>
                          <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#33798C] pointer-events-none" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                          <span>Comuna de retiro *</span>
                          <span className="text-[10px] text-slate-400 font-normal">({availableComunas.length} con sucursales)</span>
                        </label>
                        <div className="relative">
                          <select
                            value={branchComuna}
                            onChange={(e) => handleComunaChange(e.target.value)}
                            className="w-full pl-3 pr-10 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:border-[#33798C] bg-white cursor-pointer font-sans font-medium appearance-none shadow-2xs"
                          >
                            {availableComunas.map(com => (
                              <option key={com} value={com}>{com}</option>
                            ))}
                          </select>
                          <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#33798C] pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    {/* Main Grid: Left = Available Branch Cards, Right = Interactive Cartographic Mini-Map */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 pt-1">
                      {/* Left: Branch Cards (6 cols) */}
                      <div className="lg:col-span-6 space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                        <div className="text-[11px] font-bold text-slate-500 font-din flex items-center justify-between pb-1 border-b border-slate-100">
                          <span>Sucursales Starken en {branchComuna} ({availableBranches.length})</span>
                          <span className="text-emerald-700 font-bold text-[10px]">Puntos activos</span>
                        </div>

                        {availableBranches.map((branch) => {
                          const isSelected = branch.id === selectedBranchId;
                          return (
                            <div
                              key={branch.id}
                              onClick={() => handleSelectBranch(branch)}
                              className={`p-3 rounded-xl border transition-all cursor-pointer space-y-2 ${
                                isSelected
                                  ? 'border-[#33798C] bg-[#ECF5F7]/70 shadow-xs ring-1 ring-[#33798C]/30'
                                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-start gap-2">
                                  <div className="pt-0.5">
                                    <input
                                      type="radio"
                                      name="selectedBranchRadio"
                                      checked={isSelected}
                                      onChange={() => handleSelectBranch(branch)}
                                      className="accent-[#33798C] cursor-pointer"
                                    />
                                  </div>
                                  <div>
                                    <div className="font-din font-bold text-xs text-slate-900 flex items-center gap-1.5">
                                      <span>{branch.name}</span>
                                      {branch.badge && (
                                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded font-sans ${
                                          isSelected ? 'bg-[#33798C] text-white' : 'bg-slate-100 text-slate-600'
                                        }`}>
                                          {branch.badge}
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-[11px] text-slate-600 font-sans flex items-center gap-1 mt-0.5">
                                      <MapPin size={11} className="text-[#33798C] shrink-0" />
                                      <span>{branch.address}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="text-[10px] text-slate-500 font-sans flex items-center gap-1 bg-white/80 px-2 py-1 rounded border border-slate-200/60">
                                <Clock size={11} className="text-slate-400 shrink-0" />
                                <span className="truncate">{branch.schedule}</span>
                              </div>

                              <div className="flex flex-wrap gap-1">
                                {branch.services.map((srv, idx) => (
                                  <span key={idx} className="text-[9px] bg-slate-100/90 text-slate-600 px-1.5 py-0.5 rounded font-sans">
                                    {srv}
                                  </span>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Right: Mini Mapa Interactivo (6 cols) */}
                      <div className="lg:col-span-6 flex flex-col">
                        <div className="relative h-[290px] w-full rounded-xl overflow-hidden border border-slate-300 bg-[#E8EFF1] shadow-inner flex flex-col justify-between select-none">
                          <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                              <pattern id="grid-pattern-emision" width="28" height="28" patternUnits="userSpaceOnUse">
                                <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#D1DEE2" strokeWidth="0.5" />
                              </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="#EBF1F2" />
                            <rect width="100%" height="100%" fill="url(#grid-pattern-emision)" />
                            
                            <path d="M 20 40 Q 60 10 100 50 T 160 80 L 120 130 Z" fill="#DCF0E2" opacity="0.75" />
                            <path d="M 220 180 Q 280 140 340 200 T 400 240 L 320 280 Z" fill="#DCF0E2" opacity="0.75" />
                            <circle cx="85%" cy="30%" r="35" fill="#DCF0E2" opacity="0.65" />

                            <path d="M -10 120 C 80 100, 140 180, 240 150 S 380 200, 500 170" fill="none" stroke="#C2DFE7" strokeWidth="22" strokeLinecap="round" />
                            <path d="M -10 120 C 80 100, 140 180, 240 150 S 380 200, 500 170" fill="none" stroke="#A8D4DE" strokeWidth="12" strokeLinecap="round" />

                            <path d="M 0 60 L 500 220" stroke="#FFFFFF" strokeWidth="10" />
                            <path d="M 0 60 L 500 220" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="4 4" />
                            
                            <path d="M 120 0 L 160 300" stroke="#FFFFFF" strokeWidth="8" />
                            <path d="M 340 0 L 300 300" stroke="#FFFFFF" strokeWidth="8" />
                          </svg>

                          <div className="relative z-10 p-2.5 flex items-center justify-between">
                            <div className="bg-white/95 backdrop-blur-xs border border-slate-200/90 rounded-lg px-2 py-1 shadow-xs flex items-center gap-1.5 text-[10px] font-sans font-bold text-slate-800">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                              <span>Red Starken · {branchComuna}</span>
                            </div>

                            <div className="flex items-center gap-1 bg-white/95 backdrop-blur-xs border border-slate-200/90 rounded-lg p-0.5 shadow-xs">
                              <button
                                type="button"
                                onClick={() => setMapZoom(prev => Math.min(prev + 0.2, 1.6))}
                                className="w-5 h-5 flex items-center justify-center text-slate-700 hover:bg-slate-100 rounded text-xs font-bold"
                                title="Acercar"
                              >
                                +
                              </button>
                              <button
                                type="button"
                                onClick={() => setMapZoom(prev => Math.max(prev - 0.2, 0.8))}
                                className="w-5 h-5 flex items-center justify-center text-slate-700 hover:bg-slate-100 rounded text-xs font-bold"
                                title="Alejar"
                              >
                                -
                              </button>
                            </div>
                          </div>

                          <div className="absolute inset-0 pointer-events-auto">
                            {availableBranches.map((branch) => {
                              const isSelected = branch.id === selectedBranchId;
                              return (
                                <div
                                  key={branch.id}
                                  onClick={() => handleSelectBranch(branch)}
                                  style={{
                                    left: `${branch.mapCoords.x}%`,
                                    top: `${branch.mapCoords.y}%`,
                                    transform: `translate(-50%, -50%) scale(${isSelected ? 1.05 : 0.95})`
                                  }}
                                  className="absolute cursor-pointer transition-all duration-300 z-20 group"
                                >
                                  {isSelected && (
                                    <span className="absolute -inset-2.5 rounded-full bg-[#33798C]/35 animate-ping"></span>
                                  )}

                                  <div className={`relative flex items-center justify-center rounded-full shadow-lg transition-transform hover:scale-110 ${
                                    isSelected
                                      ? 'w-9 h-9 bg-[#33798C] text-white ring-4 ring-white shadow-[#33798C]/50'
                                      : 'w-7 h-7 bg-white text-[#33798C] border-2 border-[#33798C] hover:bg-[#ECF5F7]'
                                  }`}>
                                    <Building2 size={isSelected ? 16 : 13} />
                                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-inherit rotate-45"></span>
                                  </div>

                                  {isSelected ? (
                                    <div className="absolute bottom-11 left-1/2 -translate-x-1/2 bg-slate-900/95 text-white px-2.5 py-1.5 rounded-lg shadow-xl text-center whitespace-nowrap z-30 animate-in fade-in zoom-in-95 pointer-events-none">
                                      <div className="font-din font-bold text-[10px] text-teal-300 flex items-center justify-center gap-1">
                                        <CheckCircle2 size={10} className="text-teal-300" />
                                        <span>{branch.name}</span>
                                      </div>
                                      <div className="text-[9px] text-slate-300 font-sans mt-0.5">{branch.address}</div>
                                      <div className="w-2 h-2 bg-slate-900 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
                                    </div>
                                  ) : (
                                    <div className="absolute bottom-9 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-2 py-0.5 rounded text-[9px] font-din font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow">
                                      {branch.name}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          <div className="relative z-10 p-2 bg-gradient-to-t from-slate-900/80 via-slate-900/50 to-transparent text-white text-[10px] font-sans flex items-center justify-between">
                            <span className="flex items-center gap-1 truncate text-slate-200">
                              <MapPin size={11} className="text-teal-400 shrink-0" />
                              <span>{selectedBranch ? `${selectedBranch.name} (${selectedBranch.address})` : 'Selecciona una sucursal'}</span>
                            </span>
                            <span className="text-[9px] text-teal-300 font-sans font-bold shrink-0">Red Starken Chile</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Paquetes & Dimensiones */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-2xs">
                <h3 className="font-din font-bold text-xs text-slate-800 flex items-center gap-1.5">
                  <Package size={14} className="text-[#33798C]" />
                  <span>3. Paquetes y dimensiones</span>
                </h3>

                <div className="flex flex-wrap items-end gap-3.5 text-xs font-sans">
                  <div className="space-y-2 w-24 sm:w-28 shrink-0">
                    <label className="block font-bold text-slate-700 mb-1.5">Peso (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={unitForm.weight}
                      onChange={(e) => setUnitForm({ ...unitForm, weight: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-[#33798C] font-sans"
                    />
                  </div>

                  <div className="space-y-2 w-48 sm:w-56 shrink-0">
                    <label className="block font-bold text-slate-700 mb-1.5">Dimensiones (cm)</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      <input type="number" placeholder="L" value={unitForm.length} onChange={(e) => setUnitForm({...unitForm, length: Number(e.target.value)})} className="px-1.5 py-2 text-center border border-slate-200 rounded-lg text-xs outline-none font-sans" />
                      <input type="number" placeholder="An" value={unitForm.width} onChange={(e) => setUnitForm({...unitForm, width: Number(e.target.value)})} className="px-1.5 py-2 text-center border border-slate-200 rounded-lg text-xs outline-none font-sans" />
                      <input type="number" placeholder="Al" value={unitForm.height} onChange={(e) => setUnitForm({...unitForm, height: Number(e.target.value)})} className="px-1.5 py-2 text-center border border-slate-200 rounded-lg text-xs outline-none font-sans" />
                    </div>
                  </div>

                  <div className="space-y-2 flex-1 min-w-[150px] max-w-[200px]">
                    <label className="block font-bold text-slate-700 mb-1.5">Valor declarado ($)</label>
                    <input
                      type="number"
                      value={unitForm.declaredValue}
                      onChange={(e) => setUnitForm({ ...unitForm, declaredValue: e.target.value === '' ? '' : Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-[#33798C] font-sans"
                    />
                  </div>
                </div>

                {/* Notificación condicional si valor declarado >= 50.000 */}
                {Number(unitForm.declaredValue) >= 50000 && (
                  <div className="space-y-2.5 pt-1 animate-in fade-in duration-200">
                    <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-[#FFF8EE] border border-amber-200 rounded-xl text-xs text-slate-700 font-sans shadow-2xs">
                      <AlertTriangle size={15} className="text-amber-500 shrink-0" />
                      <span>Valor &gt; $50.000 requiere adjuntar número de boleta o factura al despachar.</span>
                    </div>

                    <div className="space-y-2">
                      <label className="block font-bold text-slate-700 mb-1.5 text-xs">Número de boleta o factura</label>
                      <input
                        type="text"
                        placeholder="Ej: 123456"
                        value={unitForm.invoiceNumber || ''}
                        onChange={(e) => setUnitForm({ ...unitForm, invoiceNumber: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-[#33798C] bg-white font-sans text-slate-800 placeholder:text-slate-400 transition-colors"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Summary & Action Card (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-gradient-to-b from-[#ECF5F7] to-white border border-[#C2DFE7] rounded-2xl p-5 space-y-4 sticky top-24 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-[#C2DFE7]">
                  <span className="font-din font-bold text-xs text-[#1e4f5e]">Resumen de emisión</span>
                </div>

                <div className="space-y-2 text-xs font-sans">
                  <div className="flex justify-between text-slate-600">
                    <span>Origen:</span>
                    <span className="font-bold text-slate-900">San Bernardo, RM</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Destino:</span>
                    <span className="font-bold text-slate-900 text-right">
                      {unitForm.deliveryType === 'Sucursal' && unitForm.selectedBranchName
                        ? `${unitForm.selectedBranchName} (${unitForm.destinationComuna})`
                        : unitForm.destinationComuna}
                    </span>
                  </div>
                  {unitForm.deliveryType === 'Sucursal' && unitForm.destinationAddress && (
                    <div className="flex justify-between text-slate-600">
                      <span>Dirección sucursal:</span>
                      <span className="font-medium text-slate-700 text-right truncate max-w-[180px]" title={unitForm.destinationAddress}>
                        {unitForm.destinationAddress}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600">
                    <span>Plazo de entrega:</span>
                    <span className="font-bold text-emerald-700">
                      {unitForm.serviceType === 'Express' ? '24h hábiles' : '48h hábiles'}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Descuento cuenta empresa:</span>
                    <span className="font-bold text-emerald-700 font-sans">-25% aplicado</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#C2DFE7] flex items-center justify-between">
                  <span className="font-sans font-bold text-xs text-slate-600">Tarifa:</span>
                  <div className="text-2xl font-black font-din text-[#1e4f5e]">
                    ${unitForm.deliveryType === 'Sucursal' ? '3.350' : (unitForm.serviceType === 'Express' ? '4.890' : '3.450')}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#33798C] hover:bg-[#1e4f5e] text-white py-3 rounded-xl font-sans font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Printer size={15} />
                  <span>Emitir y generar etiqueta</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Mode B: Emision Masiva */}
        {emissionMode === 'masiva' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 border-2 border-dashed border-slate-300 hover:border-[#33798C] rounded-2xl p-8 text-center bg-slate-50/60 transition-all flex flex-col items-center justify-center space-y-3 cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-[#ECF5F7] text-[#33798C] flex items-center justify-center">
                  <UploadCloud size={24} />
                </div>
                <div>
                  <p className="font-din font-bold text-sm text-slate-800">
                    {bulkFile ? bulkFile.name : 'Arrastra tu archivo Excel o CSV aquí'}
                  </p>
                  <p className="text-xs text-slate-400 font-sans mt-0.5">Soporta archivos .xlsx, .xls y .csv hasta 2.000 registros por lote</p>
                </div>
                <label className="btn bg-[#33798C] hover:bg-[#1e4f5e] text-white text-xs font-din font-bold px-4 py-2 rounded-xl cursor-pointer">
                  <span>Seleccionar archivo</span>
                  <input type="file" accept=".xlsx,.xls,.csv" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 flex flex-col justify-between shadow-xs">
                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-[#33798C] font-din flex items-center gap-1.5">
                    <FileCheck size={14} />
                    <span>Plantilla oficial StarkenPro</span>
                  </div>
                  <p className="text-xs text-slate-600 font-sans leading-relaxed">
                    Descarga el formato oficial con columnas pre-configuradas para evitar errores de validación en comunas y direcciones.
                  </p>
                </div>

                <button
                  onClick={() => {
                    if (showToast) showToast('Descargando plantilla_emision_masiva_starken.xlsx...', 'info');
                  }}
                  className="w-full bg-white hover:bg-[#ECF5F7] text-[#33798C] hover:text-[#1e4f5e] border border-[#33798C] hover:border-[#1e4f5e] text-xs font-din font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs active:scale-[0.99]"
                >
                  <Download size={14} />
                  <span>Descargar plantilla Excel</span>
                </button>
              </div>
            </div>

            {/* Pre-validation preview table */}
            {bulkValidatedRows.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden space-y-3 p-4 shadow-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600" />
                    <span className="font-din font-bold text-xs text-slate-800">
                      Pre-validación exitosa ({bulkValidatedRows.length} registros listos)
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-sans">
                    0 errores detectados
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-sans">
                    <thead className="bg-slate-50 font-din text-slate-500 text-[11px]">
                      <tr>
                        <th className="p-2.5">Fila</th>
                        <th className="p-2.5">Destinatario</th>
                        <th className="p-2.5">RUT</th>
                        <th className="p-2.5">Comuna</th>
                        <th className="p-2.5">Dirección</th>
                        <th className="p-2.5">Bultos</th>
                        <th className="p-2.5">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {bulkValidatedRows.map((row) => (
                        <tr key={row.row} className="hover:bg-slate-50/50">
                          <td className="p-2.5 font-din font-bold text-slate-400">#{row.row}</td>
                          <td className="p-2.5 font-bold text-slate-800">{row.recipient}</td>
                          <td className="p-2.5 text-slate-500">{row.rut}</td>
                          <td className="p-2.5 font-bold text-slate-700">{row.comuna}</td>
                          <td className="p-2.5 text-slate-500">{row.address}</td>
                          <td className="p-2.5 font-din font-bold text-slate-700">{row.bultos} ({row.weight})</td>
                          <td className="p-2.5">
                            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded font-sans">
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="pt-3 flex justify-end gap-3">
                  <button
                    onClick={() => setBulkValidatedRows([])}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-din font-bold px-4 py-2 rounded-xl cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleBulkProcess}
                    disabled={isBulkEmitting}
                    className="bg-[#33798C] hover:bg-[#1e4f5e] text-white text-xs font-din font-bold px-5 py-2 rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                  >
                    {isBulkEmitting ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" />
                        <span>Procesando emisión...</span>
                      </>
                    ) : (
                      <>
                        <Printer size={14} />
                        <span>Emitir lote y descargar etiquetas (PDF)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Generated Label Modal Popup */}
        {generatedLabel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
              onClick={() => setGeneratedLabel(null)}
            />
            <div className="bg-white rounded-3xl max-w-md w-full p-6 relative z-10 space-y-4 shadow-2xl border border-starken-border animate-in zoom-in-95 flex flex-col">
              <button 
                onClick={() => setGeneratedLabel(null)} 
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition cursor-pointer"
              >
                <X size={20} />
              </button>

              {/* Header */}
              <div className="mb-2 pr-10 sm:pr-0 pb-4 border-b border-slate-200">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0 shadow-xs">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-850 font-din tracking-wide">
                      Orden de flete generada
                    </h3>
                    <p className="text-xs font-bold text-slate-400 font-sans">
                      Documento oficial emitido exitosamente
                    </p>
                  </div>
                </div>
              </div>

              {/* Simulated Starken Label */}
              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 bg-slate-50 space-y-3 font-mono text-xs">
                <div className="flex justify-between items-start border-b border-slate-200 pb-2">
                  <div className="text-[11px] font-sans">
                    <div className="text-[9px] font-bold text-slate-400 font-din">Destino</div>
                    <div className="font-bold text-slate-800">{generatedLabel.comuna}</div>
                    <div className="text-slate-500 text-[10px] truncate max-w-[240px]">{generatedLabel.destination}</div>
                  </div>
                  <span className="font-sans font-bold text-[10px] bg-[#33798C] text-white px-2 py-0.5 rounded shrink-0">Starken</span>
                </div>

                <div className="text-center py-2 bg-white rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-400 font-din font-bold">Orden de flete</div>
                  <div className="text-2xl font-black font-din text-slate-900">#{generatedLabel.of}</div>
                  <div className="text-[9px] text-slate-400 font-mono tracking-widest mt-1">||||| | |||| ||| |||||| |||||</div>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      if (showToast) showToast(`Preparando impresión de OF #${generatedLabel.of}...`, 'info');
                    }}
                    className="btn btn-primary flex-1 space-x-1.5 cursor-pointer font-bold"
                  >
                    <Printer size={14} />
                    <span>Imprimir</span>
                  </button>

                  <button
                    onClick={() => {
                      if (showToast) showToast(`Descargando etiqueta PDF de OF #${generatedLabel.of}...`, 'success');
                    }}
                    className="btn btn-primary flex-1 space-x-1.5 cursor-pointer font-bold"
                  >
                    <Download size={14} />
                    <span>Descargar</span>
                  </button>
                </div>

                <button
                  onClick={() => {
                    if (onSwitchToTracking) onSwitchToTracking(generatedLabel.of);
                  }}
                  className="btn btn-outline w-full cursor-pointer font-bold"
                >
                  Ver tracking
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: CONFIRMA LA DIRECCIÓN (INTERACTIVE MAP & GEOREFERENCING) */}
        {isConfirmAddressModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 space-y-4 animate-in zoom-in-95 duration-150">
              
              {/* Header */}
              <div className="pb-4 border-b border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-slate-850 font-din">Confirma la dirección</h3>
                  <button
                    type="button"
                    onClick={() => setIsConfirmAddressModalOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Instruction subtitle */}
                <div className="flex items-center gap-2 text-xs font-bold text-[#33798C] font-sans">
                  <MapPin size={16} className="text-[#33798C] shrink-0" />
                  <span>Puedes arrastrar el pin para ajustar la dirección si es necesario</span>
                </div>
              </div>

              {/* Address Search Field & External link to Google Maps */}
              <div className="flex items-center gap-3">
                <form onSubmit={handleModalAddressSearch} className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Ingresa link de Google Maps o la dirección exacta"
                    value={confirmAddressData.modalSearchInput || ''}
                    onChange={(e) => setConfirmAddressData({ ...confirmAddressData, modalSearchInput: e.target.value })}
                    className="w-full pl-3 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-sans text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#33798C] focus:ring-1 focus:ring-[#33798C]/20 shadow-2xs"
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#33798C] hover:text-[#286373] transition-colors cursor-pointer"
                    title="Buscar dirección"
                  >
                    <Search size={16} />
                  </button>
                </form>

                {/* External link to Google Maps */}
                <a
                  href={`https://www.google.com/maps?q=${confirmAddressData.lat || -33.53507},${confirmAddressData.lng || -70.54222}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-[#33798C] transition-colors group cursor-pointer font-sans shrink-0 whitespace-nowrap"
                >
                  <img 
                    src="/google_maps_icon.png" 
                    alt="Google Maps" 
                    className="w-3.5 h-[18px] object-contain shrink-0 drop-shadow-2xs" 
                  />
                  <span className="group-hover:underline">Ver en Google Maps</span>
                </a>
              </div>

              {/* Interactive Vector Map Container */}
              <div 
                onClick={handleMapClick}
                className="relative w-full h-72 sm:h-80 rounded-2xl border border-slate-200 overflow-hidden bg-[#e5ecef] cursor-crosshair select-none shadow-inner"
              >
                {/* Scalable Vector Cartography */}
                <div 
                  className="w-full h-full transition-transform duration-200 ease-out"
                  style={{ 
                    transform: `scale(${addressModalZoom})`, 
                    transformOrigin: `${confirmAddressData.pinPercent?.x || 45}% ${confirmAddressData.pinPercent?.y || 38}%` 
                  }}
                >
                  <svg 
                    viewBox="0 0 800 500" 
                    className="w-full h-full object-cover" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Map background fill */}
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
                    <text x="300" y="250" fontSize="10" fill="#2d6a4f" fontWeight="bold" textAnchor="middle" opacity="0.7">Parque Central</text>

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

                    {/* Diagonal & Curved Arteries */}
                    <line x1="80" y1="0" x2="550" y2="500" stroke="#fef08a" strokeWidth="11" strokeLinecap="round" />
                    <line x1="80" y1="0" x2="550" y2="500" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="6,6" />

                    <line x1="0" y1="150" x2="800" y2="150" stroke="#fed7aa" strokeWidth="10" />
                    
                    {/* Street Labels */}
                    <text x="360" y="85" fontSize="10" fill="#64748b" fontWeight="600" letterSpacing="0.5">Av. Gabriela</text>
                    <text x="210" y="270" fontSize="10" fill="#64748b" fontWeight="600" transform="rotate(45 210, 270)">Av. Concha y Toro</text>
                    <text x="535" y="205" fontSize="10" fill="#33798C" fontWeight="bold">Uva de la Cordillera</text>
                    <text x="60" y="405" fontSize="10" fill="#64748b" fontWeight="600">Las Nieves Oriente</text>
                    <text x="530" y="85" fontSize="10" fill="#64748b" fontWeight="600">Av. Vicuña Mackenna</text>
                  </svg>
                </div>

                {/* Zoom controls (top-left) */}
                <div 
                  className="absolute top-3 left-3 z-20 flex flex-col bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button 
                    type="button" 
                    onClick={() => setAddressModalZoom(prev => Math.min(prev + 0.3, 2.5))}
                    className="w-8 h-8 flex items-center justify-center text-slate-700 hover:bg-slate-100 font-bold border-b border-slate-100 transition-colors cursor-pointer"
                    title="Acercar"
                  >
                    <Plus size={16} />
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setAddressModalZoom(prev => Math.max(prev - 0.3, 0.7))}
                    className="w-8 h-8 flex items-center justify-center text-slate-700 hover:bg-slate-100 font-bold transition-colors cursor-pointer"
                    title="Alejar"
                  >
                    <Minus size={16} />
                  </button>
                </div>

                {/* DRAGGABLE / CLICKABLE PIN (Starken Azul Petróleo #33798C) */}
                <div 
                  className="absolute z-20 pointer-events-none transition-all duration-150 -translate-x-1/2 -translate-y-full flex flex-col items-center select-none"
                  style={{
                    left: `${confirmAddressData.pinPercent?.x || 45}%`,
                    top: `${confirmAddressData.pinPercent?.y || 38}%`
                  }}
                >
                  {/* Pin Droplet */}
                  <div className="relative flex items-center justify-center drop-shadow-md">
                    <svg width="42" height="50" viewBox="0 0 40 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 0C8.954 0 0 8.954 0 20C0 32.5 17.5 46.5 19.1 47.8C19.6 48.2 20.4 48.2 20.9 47.8C22.5 46.5 40 32.5 40 20C40 8.954 31.046 0 20 0Z" fill="#33798C"/>
                      <circle cx="20" cy="19" r="13" fill="white"/>
                    </svg>
                    <div className="absolute top-[10px] text-[#33798C]">
                      <Home size={18} strokeWidth={2.4} />
                    </div>
                  </div>
                  {/* Pin shadow on ground */}
                  <div className="w-5 h-1.5 bg-black/25 rounded-full blur-[1px] -mt-1"></div>
                </div>

                {/* Floating Coordinates Pill (bottom-left) */}
                <div 
                  className="absolute bottom-3 left-3 z-20 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-lg shadow-sm border border-slate-200 text-[11px] font-mono text-slate-700 font-medium flex items-center gap-2 select-all"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span>Y (Lat): {confirmAddressData.lat ? confirmAddressData.lat.toFixed(5) : '-33.53507'}</span>
                  <span className="text-slate-300">|</span>
                  <span>X (Lng): {confirmAddressData.lng ? confirmAddressData.lng.toFixed(5) : '-70.54222'}</span>
                </div>

                {/* Attribution pill (bottom-right) */}
                <div 
                  className="absolute bottom-3 right-3 z-20 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] text-slate-500 font-sans flex items-center gap-1 shadow-2xs border border-slate-200/80"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="inline-block w-2.5 h-1.5 bg-sky-500 rounded-2xs"></span>
                  <span className="inline-block w-2.5 h-1.5 bg-amber-400 rounded-2xs -ml-1"></span>
                  <span className="font-semibold text-slate-600">Leaflet</span>
                </div>
              </div>

              {/* Address Summary Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#ECF5F7] border border-[#C2DFE7] flex items-center justify-center text-[#33798C] shrink-0 shadow-2xs">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-900 font-sans">
                      {confirmAddressData.street || confirmAddressData.address}, {confirmAddressData.comuna}
                    </div>
                    <div className="text-[11px] text-slate-500 font-sans font-medium">
                      {confirmAddressData.regionFull || confirmAddressData.region}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-sans text-slate-700">
                  <Mail size={15} className="text-slate-600" />
                  <span className="font-bold">Código postal:</span>
                  <span className="bg-sky-50 text-sky-700 font-bold px-3 py-1 rounded-md text-xs font-mono border border-sky-100">
                    {confirmAddressData.postalCode || '9227729'}
                  </span>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="w-full flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsConfirmAddressModalOpen(false)}
                  className="btn btn-outline flex-1 cursor-pointer font-bold"
                >
                  Omitir
                </button>
                <button
                  type="button"
                  onClick={handleSaveConfirmedAddress}
                  className="btn btn-primary flex-1 cursor-pointer font-bold"
                >
                  Guardar dirección
                </button>
              </div>

            </div>
          </div>
        )}
      </div>

    </div>
  );
}
