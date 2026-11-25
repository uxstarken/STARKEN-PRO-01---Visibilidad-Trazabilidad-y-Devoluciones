import React, { useState, useMemo, useRef } from 'react';
import { 
  Truck, 
  Package, 
  FileText, 
  Calculator, 
  Share2, 
  Plus, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle,
  Clock, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  Download, 
  Printer, 
  FileCheck, 
  UploadCloud, 
  ArrowRight, 
  ExternalLink, 
  Copy, 
  Check, 
  X, 
  Layers, 
  Sparkles, 
  ChevronRight, 
  ChevronDown, 
  Store, 
  Code2, 
  Zap, 
  ShieldCheck, 
  RefreshCw,
  Info,
  CheckCheck,
  Compass,
  ChevronLeft,
  Sun,
  Building2,
  Activity
} from 'lucide-react';

const SAVED_ADDRESSES = [
  { id: 1, name: 'Centro de Distribución San Bernardo (Bodega 4)', address: 'Camino La Vara 0310, Módulo 4', comuna: 'San Bernardo', region: 'Metropolitana', contact: 'Juan Carlos Morales', phone: '+56 9 8877 6655' },
  { id: 2, name: 'Hub Providencia E-Commerce', address: 'Av. Andrés Bello 2711, Piso 2', comuna: 'Providencia', region: 'Metropolitana', contact: 'Claudia Fuentes', phone: '+56 9 7654 3210' },
  { id: 3, name: 'Bodega Central Quilicura', address: 'Av. Américo Vespucio Norte 1400', comuna: 'Quilicura', region: 'Metropolitana', contact: 'Rodrigo Tapia', phone: '+56 9 9123 4567' }
];

// Available pickup days for the horizontal calendar carousel
const AVAILABLE_PICKUP_DAYS = [
  { id: 'day-0', dateStr: '09-10-2026', dayName: 'Viernes', dayNum: '09', month: 'Oct', fullLabel: 'Viernes 09 de octubre', morningAvailable: true, afternoonAvailable: true, tag: 'Hoy' },
  { id: 'day-1', dateStr: '10-10-2026', dayName: 'Sábado', dayNum: '10', month: 'Oct', fullLabel: 'Sábado 10 de octubre', morningAvailable: true, afternoonAvailable: false, tag: 'Mañana' },
  { id: 'day-2', dateStr: '12-10-2026', dayName: 'Lunes', dayNum: '12', month: 'Oct', fullLabel: 'Lunes 12 de octubre', morningAvailable: true, afternoonAvailable: true, tag: 'Disponible' },
  { id: 'day-3', dateStr: '13-10-2026', dayName: 'Martes', dayNum: '13', month: 'Oct', fullLabel: 'Martes 13 de octubre', morningAvailable: true, afternoonAvailable: true, tag: 'Disponible' },
  { id: 'day-4', dateStr: '14-10-2026', dayName: 'Miércoles', dayNum: '14', month: 'Oct', fullLabel: 'Miércoles 14 de octubre', morningAvailable: true, afternoonAvailable: true, tag: 'Disponible' },
  { id: 'day-5', dateStr: '15-10-2026', dayName: 'Jueves', dayNum: '15', month: 'Oct', fullLabel: 'Jueves 15 de octubre', morningAvailable: true, afternoonAvailable: true, tag: 'Disponible' },
  { id: 'day-6', dateStr: '16-10-2026', dayName: 'Viernes', dayNum: '16', month: 'Oct', fullLabel: 'Viernes 16 de octubre', morningAvailable: true, afternoonAvailable: true, tag: 'Disponible' },
  { id: 'day-7', dateStr: '17-10-2026', dayName: 'Sábado', dayNum: '17', month: 'Oct', fullLabel: 'Sábado 17 de octubre', morningAvailable: true, afternoonAvailable: false, tag: 'Solo mañana' },
  { id: 'day-8', dateStr: '19-10-2026', dayName: 'Lunes', dayNum: '19', month: 'Oct', fullLabel: 'Lunes 19 de octubre', morningAvailable: true, afternoonAvailable: true, tag: 'Disponible' },
  { id: 'day-9', dateStr: '20-10-2026', dayName: 'Martes', dayNum: '20', month: 'Oct', fullLabel: 'Martes 20 de octubre', morningAvailable: true, afternoonAvailable: true, tag: 'Disponible' }
];

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
        name: 'Sucursal Apoquindo',
        address: 'Av. Apoquindo 5555, Local 4',
        comuna: 'Las Condes',
        region: 'Metropolitana',
        schedule: 'Lun - Vie 09:00 - 19:00 | Sáb 09:00 - 13:00',
        phone: '+56 2 2789 4020',
        services: ['Recepción B2B Corporativa', 'Estacionamiento', 'Metro Manquehue'],
        mapCoords: { x: 42, y: 40 },
        badge: 'Manquehue'
      },
      {
        id: 'stk-lc-02',
        name: 'Sucursal Cantagallo',
        address: 'Av. Las Condes 12340',
        comuna: 'Las Condes',
        region: 'Metropolitana',
        schedule: 'Lun - Vie 09:00 - 18:30',
        phone: '+56 2 2789 4021',
        services: ['Recepción & Entrega', 'Carga General', 'Estacionamiento'],
        mapCoords: { x: 76, y: 35 },
        badge: 'Cantagallo'
      }
    ],
    'San Bernardo': [
      {
        id: 'stk-sb-01',
        name: 'Centro de Distribución San Bernardo',
        address: 'Camino La Vara 0310, Módulo 4',
        comuna: 'San Bernardo',
        region: 'Metropolitana',
        schedule: 'Lun - Vie 08:00 - 19:00 | Sáb 08:30 - 14:00',
        phone: '+56 2 2789 4030',
        services: ['Hub Mayorista', 'Carga Paletizada', 'Andén de Carga Directa'],
        mapCoords: { x: 38, y: 48 },
        badge: 'Mega Hub CD'
      },
      {
        id: 'stk-sb-02',
        name: 'Sucursal Plaza San Bernardo',
        address: 'Eyzaguirre 550',
        comuna: 'San Bernardo',
        region: 'Metropolitana',
        schedule: 'Lun - Vie 08:30 - 18:30',
        phone: '+56 2 2789 4031',
        services: ['Recepción & Retiro', 'Atención Empresas B2B'],
        mapCoords: { x: 62, y: 64 },
        badge: 'Centro Cívico'
      }
    ],
    'Quilicura': [
      {
        id: 'stk-ql-01',
        name: 'Sucursal CD Quilicura',
        address: 'Av. Américo Vespucio Norte 1400',
        comuna: 'Quilicura',
        region: 'Metropolitana',
        schedule: 'Lun - Vie 08:30 - 18:30 | Sáb 09:00 - 13:00',
        phone: '+56 2 2789 4040',
        services: ['Andén de Carga', 'Grandes Cargas', 'Estacionamiento'],
        mapCoords: { x: 48, y: 38 },
        badge: 'Hub Norte'
      },
      {
        id: 'stk-ql-02',
        name: 'Sucursal San Ignacio',
        address: 'Panamericana Norte 9900',
        comuna: 'Quilicura',
        region: 'Metropolitana',
        schedule: 'Lun - Vie 09:00 - 18:00',
        phone: '+56 2 2789 4041',
        services: ['Recepción B2B', 'Parque Industrial'],
        mapCoords: { x: 66, y: 26 },
        badge: 'Industrial'
      }
    ],
    'Maipú': [
      {
        id: 'stk-mp-01',
        name: 'Sucursal Pajaritos',
        address: 'Av. Gladys Marín / Pajaritos 2100',
        comuna: 'Maipú',
        region: 'Metropolitana',
        schedule: 'Lun - Vie 08:30 - 18:30 | Sáb 09:00 - 13:00',
        phone: '+56 2 2789 4050',
        services: ['Recepción & Entrega', 'Metro Pajaritos'],
        mapCoords: { x: 42, y: 42 },
        badge: 'Pajaritos'
      },
      {
        id: 'stk-mp-02',
        name: 'Sucursal 5 de Abril',
        address: 'Av. 5 de Abril 450',
        comuna: 'Maipú',
        region: 'Metropolitana',
        schedule: 'Lun - Vie 09:00 - 18:00',
        phone: '+56 2 2789 4051',
        services: ['Recepción & Entrega', 'Estacionamiento Clientes'],
        mapCoords: { x: 58, y: 62 },
        badge: 'Plaza Maipú'
      }
    ]
  },
  'Valparaíso': {
    'Viña del Mar': [
      {
        id: 'stk-vina-01',
        name: 'Sucursal 1 Norte',
        address: '1 Norte 1240',
        comuna: 'Viña del Mar',
        region: 'Valparaíso',
        schedule: 'Lun - Vie 08:30 - 18:30 | Sáb 09:00 - 13:00',
        phone: '+56 32 254 1100',
        services: ['Recepción & Entrega', 'Estacionamiento', 'Emisión B2B'],
        mapCoords: { x: 54, y: 38 },
        badge: 'Sucursal Principal'
      },
      {
        id: 'stk-vina-02',
        name: 'Sucursal Arlegui',
        address: 'Arlegui 640',
        comuna: 'Viña del Mar',
        region: 'Valparaíso',
        schedule: 'Lun - Vie 09:00 - 18:30',
        phone: '+56 32 254 1101',
        services: ['Recepción & Entrega', 'Centro Viña'],
        mapCoords: { x: 42, y: 56 },
        badge: 'Centro'
      }
    ],
    'Valparaíso': [
      {
        id: 'stk-valp-01',
        name: 'Sucursal Brasil',
        address: 'Av. Brasil 1850',
        comuna: 'Valparaíso',
        region: 'Valparaíso',
        schedule: 'Lun - Vie 08:30 - 18:30 | Sáb 09:00 - 13:00',
        phone: '+56 32 254 1200',
        services: ['Carga Pesada', 'Emisión B2B', 'Sector Puerto'],
        mapCoords: { x: 46, y: 44 },
        badge: 'Principal Puerto'
      },
      {
        id: 'stk-valp-02',
        name: 'Sucursal Blanco',
        address: 'Blanco 950',
        comuna: 'Valparaíso',
        region: 'Valparaíso',
        schedule: 'Lun - Vie 09:00 - 18:00',
        phone: '+56 32 254 1201',
        services: ['Recepción & Entrega', 'Plaza Sotomayor'],
        mapCoords: { x: 36, y: 62 },
        badge: 'Plaza Sotomayor'
      }
    ],
    'Quilpué': [
      {
        id: 'stk-qlp-01',
        name: 'Sucursal Los Carrera Quilpué',
        address: 'Av. Los Carrera 780',
        comuna: 'Quilpué',
        region: 'Valparaíso',
        schedule: 'Lun - Vie 09:00 - 18:30',
        phone: '+56 32 254 1300',
        services: ['Recepción & Entrega', 'Estacionamiento'],
        mapCoords: { x: 50, y: 46 },
        badge: 'Troncal'
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
        phone: '+56 41 286 4000',
        services: ['Hub Regional', 'Emisión B2B', 'Andén de Carga', 'Estacionamiento'],
        mapCoords: { x: 44, y: 42 },
        badge: 'Hub Regional'
      },
      {
        id: 'stk-ccp-02',
        name: 'Sucursal Barros Arana',
        address: 'Barros Arana 450',
        comuna: 'Concepción',
        region: 'Biobío',
        schedule: 'Lun - Vie 09:00 - 18:30',
        phone: '+56 41 286 4001',
        services: ['Recepción & Retiro', 'Paseo Peatonal'],
        mapCoords: { x: 56, y: 56 },
        badge: 'Centro'
      },
      {
        id: 'stk-ccp-03',
        name: 'Sucursal Paicaví',
        address: 'Av. Paicaví 2340',
        comuna: 'Concepción',
        region: 'Biobío',
        schedule: 'Lun - Vie 08:30 - 18:00',
        phone: '+56 41 286 4002',
        services: ['Recepción B2B', 'Cerca Aeropuerto Carriel Sur'],
        mapCoords: { x: 64, y: 30 },
        badge: 'Paicaví'
      }
    ],
    'Talcahuano': [
      {
        id: 'stk-talc-01',
        name: 'Sucursal Autopista Talcahuano',
        address: 'Autopista Concepción-Talcahuano 7100',
        comuna: 'Talcahuano',
        region: 'Biobío',
        schedule: 'Lun - Vie 08:30 - 18:30',
        phone: '+56 41 286 4100',
        services: ['Carga Pesada', 'Sector Industrial', 'Andén'],
        mapCoords: { x: 48, y: 40 },
        badge: 'Industrial'
      }
    ],
    'Los Ángeles': [
      {
        id: 'stk-la-01',
        name: 'Sucursal Villagrán',
        address: 'Villagrán 580',
        comuna: 'Los Ángeles',
        region: 'Biobío',
        schedule: 'Lun - Vie 08:30 - 18:30 | Sáb 09:00 - 13:00',
        phone: '+56 43 231 2200',
        services: ['Recepción & Entrega', 'Estacionamiento'],
        mapCoords: { x: 50, y: 48 },
        badge: 'Centro'
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
        phone: '+56 51 222 3400',
        services: ['Hub Regional', 'Emisión B2B', 'Estacionamiento'],
        mapCoords: { x: 52, y: 40 },
        badge: 'Hub Regional'
      },
      {
        id: 'stk-ser-02',
        name: 'Sucursal El Milagro',
        address: 'Av. Guillermo Ulriksen 1850',
        comuna: 'La Serena',
        region: 'Coquimbo',
        schedule: 'Lun - Vie 09:00 - 18:30',
        phone: '+56 51 222 3401',
        services: ['Recepción & Entrega', 'Sector Residencial'],
        mapCoords: { x: 65, y: 56 },
        badge: 'El Milagro'
      }
    ],
    'Coquimbo': [
      {
        id: 'stk-coq-01',
        name: 'Sucursal Videla Coquimbo',
        address: 'Av. Videla 350',
        comuna: 'Coquimbo',
        region: 'Coquimbo',
        schedule: 'Lun - Vie 08:30 - 18:30',
        phone: '+56 51 222 3500',
        services: ['Recepción & Entrega', 'Puerto Coquimbo'],
        mapCoords: { x: 46, y: 50 },
        badge: 'Centro'
      }
    ]
  },
  'Antofagasta': {
    'Antofagasta': [
      {
        id: 'stk-ant-01',
        name: 'Sucursal Balmaceda Antofagasta',
        address: 'Av. Balmaceda 2450',
        comuna: 'Antofagasta',
        region: 'Antofagasta',
        schedule: 'Lun - Vie 08:30 - 18:30 | Sáb 09:00 - 13:00',
        phone: '+56 55 265 1000',
        services: ['Hub Norte', 'Emisión B2B Minería', 'Andén de Carga'],
        mapCoords: { x: 45, y: 40 },
        badge: 'Hub Minería'
      },
      {
        id: 'stk-ant-02',
        name: 'Sucursal Prat Centro',
        address: 'Prat 890',
        comuna: 'Antofagasta',
        region: 'Antofagasta',
        schedule: 'Lun - Vie 09:00 - 18:30',
        phone: '+56 55 265 1001',
        services: ['Recepción & Entrega', 'Centro Cívico'],
        mapCoords: { x: 55, y: 56 },
        badge: 'Centro'
      }
    ],
    'Calama': [
      {
        id: 'stk-cal-01',
        name: 'Sucursal Granaderos Calama',
        address: 'Av. Granaderos 2850',
        comuna: 'Calama',
        region: 'Antofagasta',
        schedule: 'Lun - Vie 08:30 - 18:30 | Sáb 09:00 - 13:00',
        phone: '+56 55 265 1100',
        services: ['Recepción & Entrega', 'Despachos Faena'],
        mapCoords: { x: 50, y: 44 },
        badge: 'Faena'
      }
    ]
  },
  'La Araucanía': {
    'Temuco': [
      {
        id: 'stk-tem-01',
        name: 'Sucursal Caupolicán',
        address: 'Av. Caupolicán 850',
        comuna: 'Temuco',
        region: 'La Araucanía',
        schedule: 'Lun - Vie 08:30 - 18:30 | Sáb 09:00 - 13:00',
        phone: '+56 45 221 4500',
        services: ['Hub Sur', 'Emisión B2B', 'Estacionamiento'],
        mapCoords: { x: 48, y: 42 },
        badge: 'Hub Regional'
      },
      {
        id: 'stk-tem-02',
        name: 'Sucursal Alemania',
        address: 'Av. Alemania 01240',
        comuna: 'Temuco',
        region: 'La Araucanía',
        schedule: 'Lun - Vie 09:00 - 18:30',
        phone: '+56 45 221 4501',
        services: ['Recepción & Entrega', 'Sector Poniente'],
        mapCoords: { x: 62, y: 56 },
        badge: 'Alemania'
      }
    ]
  },
  'Los Lagos': {
    'Puerto Montt': [
      {
        id: 'stk-pm-01',
        name: 'Sucursal Urmeneta Puerto Montt',
        address: 'Urmeneta 480',
        comuna: 'Puerto Montt',
        region: 'Los Lagos',
        schedule: 'Lun - Vie 08:30 - 18:30 | Sáb 09:00 - 13:00',
        phone: '+56 65 225 3300',
        services: ['Hub Austral', 'Emisión B2B', 'Estacionamiento'],
        mapCoords: { x: 46, y: 46 },
        badge: 'Hub Austral'
      },
      {
        id: 'stk-pm-02',
        name: 'Sucursal Cardonal',
        address: 'Camino Cardonal 250',
        comuna: 'Puerto Montt',
        region: 'Los Lagos',
        schedule: 'Lun - Vie 08:30 - 18:00',
        phone: '+56 65 225 3301',
        services: ['Carga Pesada', 'Salmones & Agro'],
        mapCoords: { x: 64, y: 36 },
        badge: 'Cardonal'
      }
    ],
    'Osorno': [
      {
        id: 'stk-os-01',
        name: 'Sucursal Errázuriz',
        address: 'Errázuriz 1120',
        comuna: 'Osorno',
        region: 'Los Lagos',
        schedule: 'Lun - Vie 08:30 - 18:30 | Sáb 09:00 - 13:00',
        phone: '+56 64 223 8800',
        services: ['Recepción & Entrega', 'Estacionamiento'],
        mapCoords: { x: 50, y: 45 },
        badge: 'Centro'
      }
    ]
  }
};

// Initial mock pickup orders integrated with Planitack
const INITIAL_PICKUPS = [
  {
    id: 'RET-2026-9041',
    addressName: 'CD San Bernardo (Bodega 4)',
    address: 'Camino La Vara 0310, Módulo 4, San Bernardo',
    date: '05-10-2026 (Hoy)',
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
    notes: 'Ingreso por portón 2. Contactar a Juan Carlos en bodega.'
  },
  {
    id: 'RET-2026-9040',
    addressName: 'Hub Providencia E-Commerce',
    address: 'Av. Andrés Bello 2711, Piso 2, Providencia',
    date: '05-10-2026 (Hoy)',
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
    manifestId: 'MAN-2026-0941'
  },
  {
    id: 'RET-2026-9039',
    addressName: 'Bodega Central Quilicura',
    address: 'Av. Américo Vespucio Norte 1400, Quilicura',
    date: '06-10-2026',
    window: 'Mañana (09:00 - 13:00)',
    packagesCount: 35,
    weightTotal: '120.0 kg',
    status: 'Solicitado',
    statusBadge: 'info',
    driver: 'Asignación automática en curso',
    planitackId: 'PLN-882250',
    notes: 'Carga paletizada. Requiere transpaleta manual.'
  }
];

// Mock synced eCommerce orders
const INITIAL_ECOMMERCE_ORDERS = [
  { id: 'ORD-1092', store: 'Shopify Store', orderNumber: '#1092', customer: 'Fernanda Valenzuela', rut: '16.492.381-8', destination: 'Las Condes, Santiago', items: '2x Smartwatch Pro V2', value: '$189.980', date: 'Hace 15 min', status: 'Listo para emitir' },
  { id: 'ORD-1091', store: 'WooCommerce B2B', orderNumber: '#WC-8840', customer: 'Distribuidora del Sur SpA', rut: '76.492.118-K', destination: 'Concepción Centro', items: '5x Router Industrial 5G', value: '$450.000', date: 'Hace 32 min', status: 'Listo para emitir' },
  { id: 'ORD-1090', store: 'Shopify Store', orderNumber: '#1091', customer: 'Mauricio Palma G.', rut: '14.882.391-4', destination: 'Viña del Mar', items: '1x Teclado Mecánico RGB', value: '$65.000', date: 'Hace 1 hr', status: 'Listo para emitir' },
  { id: 'ORD-1089', store: 'Mercado Libre', orderNumber: '#MLB-77192', customer: 'Camila Andrea Soto', rut: '17.910.482-5', destination: 'La Serena', items: '1x Cámara de Seguridad WiFi', value: '$42.990', date: 'Hace 2 hrs', status: 'Listo para emitir' }
];

export default function OperacionView({ selectedAccount, onSwitchToTracking, showToast }) {
  const [activeSubTab, setActiveSubTab] = useState('retiros'); // 'retiros', 'emision', 'cotizador', 'ecommerce'
  
  // Pickups management state
  const [pickups, setPickups] = useState(INITIAL_PICKUPS);
  const [pickupFilter, setPickupFilter] = useState('Todos');
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

  // Emision state
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
    const firstBranch = (STARKEN_BRANCHES_DATA[newRegion] && STARKEN_BRANCHES_DATA[newRegion][firstComuna]) 
      ? STARKEN_BRANCHES_DATA[newRegion][firstComuna][0] 
      : null;
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
  };

  // Handler when user changes comuna in branch picker
  const handleComunaChange = (newComuna) => {
    setBranchComuna(newComuna);
    const firstBranch = (STARKEN_BRANCHES_DATA[branchRegion] && STARKEN_BRANCHES_DATA[branchRegion][newComuna]) 
      ? STARKEN_BRANCHES_DATA[branchRegion][newComuna][0] 
      : null;
    if (firstBranch) {
      setSelectedBranchId(firstBranch.id);
      setUnitForm(prev => ({
        ...prev,
        destinationComuna: newComuna,
        destinationAddress: firstBranch.address,
        selectedBranchName: firstBranch.name
      }));
    }
  };

  // Handler when user selects a specific branch card or map pin
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

  // Handler for delivery type radio switch (A Domicilio vs Sucursal Starken)
  const handleDeliveryTypeChange = (type) => {
    if (type === 'Sucursal') {
      const currentBranch = selectedBranch || (availableBranches[0] || null);
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

  // Bulk emission state
  const [bulkFile, setBulkFile] = useState(null);
  const [bulkValidatedRows, setBulkValidatedRows] = useState([]);
  const [isBulkEmitting, setIsBulkEmitting] = useState(false);

  // Cotizador state
  const [quoteOrigin, setQuoteOrigin] = useState('San Bernardo');
  const [quoteDestination, setQuoteDestination] = useState('Concepción');
  const [quoteWeight, setQuoteWeight] = useState(3.0);
  const [quoteLength, setQuoteLength] = useState(30);
  const [quoteWidth, setQuoteWidth] = useState(20);
  const [quoteHeight, setQuoteHeight] = useState(15);
  const [quoteDeclaredValue, setQuoteDeclaredValue] = useState(100000);
  const [selectedTariffKey, setSelectedTariffKey] = useState('sucursal');

  // E-commerce state
  const [ecommerceOrders, setEcommerceOrders] = useState(INITIAL_ECOMMERCE_ORDERS);
  const [selectedOrders, setSelectedOrders] = useState(['ORD-1092', 'ORD-1091']);
  const [activeApiTab, setActiveApiTab] = useState('curl');
  const [copiedApiKey, setCopiedApiKey] = useState(false);

  // Filtered pickups
  const filteredPickups = useMemo(() => {
    return pickups.filter(p => {
      if (pickupFilter !== 'Todos') {
        if (pickupFilter === 'Solicitados' && p.status !== 'Solicitado') return false;
        if (pickupFilter === 'En ruta' && p.status !== 'En ruta Planitack') return false;
        if (pickupFilter === 'Retirados' && p.status !== 'Retirado conforme') return false;
      }
      if (pickupSearch.trim()) {
        const q = pickupSearch.toLowerCase();
        return p.id.toLowerCase().includes(q) || 
               p.address.toLowerCase().includes(q) || 
               (p.driver && p.driver.toLowerCase().includes(q)) ||
               (p.planitackId && p.planitackId.toLowerCase().includes(q));
      }
      return true;
    });
  }, [pickups, pickupFilter, pickupSearch]);

  // Handle new pickup schedule
  const handleSchedulePickup = (e) => {
    e.preventDefault();
    const selectedAddr = savedAddresses.find(a => a.id === Number(newPickup.addressId)) || savedAddresses[0];
    const newId = `RET-2026-${Math.floor(9043 + Math.random() * 50)}`;
    const planitackNum = `PLN-${Math.floor(882300 + Math.random() * 500)}`;

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
      notes: newPickup.notes || 'Retiro programado por cliente StarkenPro'
    };

    setPickups([createdPickup, ...pickups]);
    setIsPickupModalOpen(false);
    if (showToast) {
      showToast(`Solicitud de retiro ${newId} programada exitosamente en Planitack.`, 'success');
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
      ? `Retiro en Sucursal Starken: ${unitForm.destinationAddress} (${unitForm.destinationComuna})`
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
      date: '05-10-2026 16:30 hrs',
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

    // Mock validation parsing
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

  // Live calculation for cotizador
  const calculatedQuote = useMemo(() => {
    // 1. Calculate Volumetric Weight and Billable Weight
    const length = Number(quoteLength) || 10;
    const width = Number(quoteWidth) || 10;
    const height = Number(quoteHeight) || 10;
    const physicalWeight = Number(quoteWeight) || 1;
    const volumetricWeight = (length * width * height) / 4000;
    const finalWeight = Math.max(physicalWeight, volumetricWeight);
    const extraKg = Math.max(0, finalWeight - 1);

    // 2. Zone determination based on Origin and Destination
    const getZoneCategory = (city) => {
      const c = (city || '').toLowerCase();
      if (c.includes('bernardo') || c.includes('santiago') || c.includes('providencia') || c.includes('quilicura')) return 'RM';
      if (c.includes('viña') || c.includes('valparaíso') || c.includes('rancagua')) return 'Centro';
      if (c.includes('serena') || c.includes('coquimbo')) return 'NorteChico';
      if (c.includes('concepción') || c.includes('temuco') || c.includes('chillán') || c.includes('talca')) return 'SurCercano';
      if (c.includes('antofagasta') || c.includes('calama') || c.includes('iquique') || c.includes('copiapó')) return 'NorteGrande';
      if (c.includes('puerto montt') || c.includes('valdivia') || c.includes('osorno') || c.includes('chiloé')) return 'SurLejano';
      if (c.includes('arica') || c.includes('parinacota')) return 'ExtremaNorte';
      if (c.includes('punta arenas') || c.includes('coyhaique') || c.includes('magallanes') || c.includes('aysén') || c.includes('natales')) return 'ExtremaSur';
      return 'Centro';
    };

    const originZone = getZoneCategory(quoteOrigin);
    const destZone = getZoneCategory(quoteDestination);

    let slaNormalText = '24 - 48 hrs hábiles';
    let slaExpressText = '24 hrs hábiles';
    let slaExpressBadge = '24H SLA';
    let slaNormalBadge = '48H SLA';
    let slaSucursalText = '24 - 48 hrs';

    // Pricing factors by zone combination
    let baseNormal = 3950;
    let baseExpress = 5600;
    let baseSucursal = 3350;
    let perKgNormal = 520;
    let perKgExpress = 740;
    let perKgSucursal = 440;

    if (originZone === destZone && originZone === 'RM') {
      // Intra-RM
      baseNormal = 2450;
      baseExpress = 3550;
      baseSucursal = 2100;
      perKgNormal = 340;
      perKgExpress = 490;
      perKgSucursal = 290;
      slaNormalText = '24 hrs hábiles';
      slaExpressText = 'Mismo día / 12 - 24 hrs';
      slaExpressBadge = '12H SLA';
      slaNormalBadge = '24H SLA';
      slaSucursalText = '24 hrs hábiles';
    } else if (
      (originZone === 'RM' && destZone === 'Centro') || 
      (originZone === 'Centro' && destZone === 'RM')
    ) {
      // RM <-> V / VI Región
      baseNormal = 3150;
      baseExpress = 4450;
      baseSucursal = 2700;
      perKgNormal = 420;
      perKgExpress = 600;
      perKgSucursal = 360;
      slaNormalText = '24 hrs hábiles';
      slaExpressText = '24 hrs hábiles';
      slaExpressBadge = '24H SLA';
      slaNormalBadge = '24H SLA';
      slaSucursalText = '24 hrs hábiles';
    } else if (
      (originZone === 'RM' && (destZone === 'NorteChico' || destZone === 'SurCercano')) ||
      ((originZone === 'NorteChico' || originZone === 'SurCercano') && destZone === 'RM')
    ) {
      // RM <-> IV, VIII, IX Regiones
      baseNormal = 4150;
      baseExpress = 5900;
      baseSucursal = 3550;
      perKgNormal = 560;
      perKgExpress = 800;
      perKgSucursal = 480;
      slaNormalText = '24 - 48 hrs hábiles';
      slaExpressText = '24 hrs hábiles';
      slaExpressBadge = '24H SLA';
      slaNormalBadge = '48H SLA';
      slaSucursalText = '24 - 48 hrs';
    } else if (
      destZone === 'NorteGrande' || destZone === 'SurLejano' ||
      originZone === 'NorteGrande' || originZone === 'SurLejano'
    ) {
      // II, I, X Regiones (Antofagasta, Iquique, Puerto Montt)
      baseNormal = 5850;
      baseExpress = 8450;
      baseSucursal = 4990;
      perKgNormal = 820;
      perKgExpress = 1180;
      perKgSucursal = 710;
      slaNormalText = '48 - 72 hrs hábiles';
      slaExpressText = '24 - 48 hrs hábiles';
      slaExpressBadge = '48H SLA';
      slaNormalBadge = '72H SLA';
      slaSucursalText = '48 - 72 hrs';
    } else if (
      destZone === 'ExtremaNorte' || destZone === 'ExtremaSur' ||
      originZone === 'ExtremaNorte' || originZone === 'ExtremaSur'
    ) {
      // Arica, Punta Arenas, Aysén
      baseNormal = 8900;
      baseExpress = 13600;
      baseSucursal = 7650;
      perKgNormal = 1250;
      perKgExpress = 1850;
      perKgSucursal = 1080;
      slaNormalText = '3 a 5 días hábiles';
      slaExpressText = '48 hrs hábiles (Vía Aérea)';
      slaExpressBadge = '48H SLA';
      slaNormalBadge = '5 DÍAS';
      slaSucursalText = '3 a 5 días hábiles';
    }

    const declaredVal = Number(quoteDeclaredValue) || 0;
    const hasInsurance = declaredVal >= 50000;

    // 4. Net prices with 25% corporate discount already applied
    const normalPrice = Math.round(baseNormal + (extraKg * perKgNormal));
    const expressPrice = Math.round(baseExpress + (extraKg * perKgExpress));
    const sucursalPrice = Math.round(baseSucursal + (extraKg * perKgSucursal));

    // 5. Savings calculations against list price (25% off)
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

  // Bulk ecommerce fulfillment
  const handleFulfillEcommerce = () => {
    if (selectedOrders.length === 0) return;
    setEcommerceOrders(prev => prev.filter(o => !selectedOrders.includes(o.id)));
    const count = selectedOrders.length;
    setSelectedOrders([]);
    if (showToast) {
      showToast(`Se generaron las etiquetas para ${count} pedidos de e-commerce exitosamente.`, 'success');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-[#1e4f5e] via-[#33798C] to-[#266373] rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        {/* Subtle decorative circular shapes matching Seguimiento */}
        <div className="absolute -right-16 -bottom-16 w-72 h-72 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute right-36 -top-16 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full border border-white/10 pointer-events-none" />
        <div className="absolute right-72 -bottom-20 w-40 h-40 rounded-full bg-white/[0.03] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <h1 className="text-2xl sm:text-3xl font-black font-din tracking-tight">
              Operación: emisión, retiros y pedidos
            </h1>
            <p className="text-xs font-semibold text-slate-200 font-sans leading-relaxed">
              Programa retiros simplificados con seguimiento en vivo de móviles Planitack, emite guías unitarias o masivas con cotizador de convenio, y automatiza etiquetas de tus tiendas online.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPickupModalOpen(true)}
              className="bg-white hover:bg-slate-100 text-[#1e4f5e] px-4 py-2.5 rounded-xl font-din font-black text-xs tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Plus size={16} className="text-[#33798C]" />
              <span>Solicitar Retiro</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sub-tab Navigation Header */}
      <div className="bg-white rounded-xl border border-starken-border p-1.5 shadow-xs flex flex-wrap gap-1.5 font-din">
        <button
          onClick={() => setActiveSubTab('retiros')}
          className={`flex-1 min-w-[170px] py-2.5 px-4 rounded-lg text-xs font-bold tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer ${
            activeSubTab === 'retiros'
              ? 'bg-[#33798C] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
          }`}
        >
          <Truck size={15} />
          <span>Gestión de Retiros</span>
        </button>

        <button
          onClick={() => setActiveSubTab('emision')}
          className={`flex-1 min-w-[170px] py-2.5 px-4 rounded-lg text-xs font-bold tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer ${
            activeSubTab === 'emision'
              ? 'bg-[#33798C] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
          }`}
        >
          <Package size={15} />
          <span>Emisión de Envíos</span>
        </button>

        <button
          onClick={() => setActiveSubTab('cotizador')}
          className={`flex-1 min-w-[170px] py-2.5 px-4 rounded-lg text-xs font-bold tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer ${
            activeSubTab === 'cotizador'
              ? 'bg-[#33798C] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
          }`}
        >
          <Calculator size={15} />
          <span>Cotizador Corporativo</span>
        </button>

        <button
          onClick={() => setActiveSubTab('ecommerce')}
          className={`flex-1 min-w-[170px] py-2.5 px-4 rounded-lg text-xs font-bold tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer ${
            activeSubTab === 'ecommerce'
              ? 'bg-[#33798C] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
          }`}
        >
          <Store size={15} />
          <span>E-commerce & APIs</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* SUB-TAB 1: GESTIÓN DE RETIROS (PLANITACK)                 */}
      {/* ========================================================= */}
      {activeSubTab === 'retiros' && (
        <div className="bg-white rounded-xl border border-starken-border p-5 sm:p-6 space-y-6 shadow-xs">
            
            {/* Quick Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold text-slate-400 font-din">Retiros Hoy</div>
                  <div className="text-2xl font-black font-din text-slate-900 mt-0.5">{pickups.length}</div>
                  <div className="text-[11px] text-emerald-600 font-bold font-sans">100% programados</div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#ECF5F7] text-[#33798C] flex items-center justify-center">
                  <Calendar size={18} />
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold text-slate-400 font-din">En Ruta Planitack</div>
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
                  <div className="text-[11px] font-bold text-slate-400 font-din">Bultos a Retirar</div>
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
                    <span>Conexión Activa</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-sans">SLA 99.4% cumplimiento</div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Zap size={18} />
                </div>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div className="relative flex-1 max-w-md">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Buscar por Folio, Planitack ID, Dirección o Conductor..."
                  value={pickupSearch}
                  onChange={(e) => setPickupSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#33798C] focus:bg-white transition-all font-sans"
                />
              </div>

              <div className="flex items-center gap-1.5 font-din text-xs font-bold ">
                {['Todos', 'Solicitados', 'En ruta', 'Retirados'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setPickupFilter(tab)}
                    className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
                      pickupFilter === tab
                        ? 'bg-[#33798C] text-white font-black shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Pickups Table / Cards */}
            <div className="space-y-3">
              {filteredPickups.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-xl text-slate-500 font-sans text-xs">
                  No se encontraron solicitudes de retiro con los filtros seleccionados.
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
                              En Ruta Móvil
                            </span>
                          )}
                          {pickup.status === 'Retirado conforme' && (
                            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold px-2.5 py-0.5 rounded-md font-sans flex items-center gap-1">
                              <CheckCircle2 size={12} />
                              Retirado Conforme
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
                        {/* 1. Dirección de Retiro */}
                        <div className="space-y-0.5 lg:col-span-3">
                          <div className="text-[10px] font-bold text-slate-400 font-din flex items-center gap-1">
                            <MapPin size={11} className="text-[#33798C]" />
                            <span>Dirección de Retiro</span>
                          </div>
                          <p className="font-bold text-slate-800">{pickup.addressName}</p>
                          <p className="text-slate-500 text-[11px] truncate">{pickup.address}</p>
                        </div>

                        {/* 2. Horario Programado */}
                        <div className="space-y-0.5 lg:col-span-2">
                          <div className="text-[10px] font-bold text-slate-400 font-din flex items-center gap-1">
                            <Calendar size={11} className="text-[#33798C]" />
                            <span>Horario Programado</span>
                          </div>
                          <p className="font-bold text-slate-800">{pickup.date}</p>
                          <p className="text-slate-500 text-[11px]">{pickup.window}</p>
                        </div>

                        {/* 3. Volumen & Conductor (corrido a la izquierda) */}
                        <div className="space-y-0.5 lg:col-span-2">
                          <div className="text-[10px] font-bold text-slate-400 font-din flex items-center gap-1">
                            <Package size={11} className="text-[#33798C]" />
                            <span>Volumen & Conductor</span>
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
                        className="w-full bg-[#33798C] hover:bg-[#1e4f5e] text-white text-xs font-black font-din px-3.5 py-2 rounded-lg transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
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
        )}

      {/* ========================================================= */}
      {/* SUB-TAB 2: EMISIÓN DE GUÍAS / ÓRDENES DE FLETE            */}
      {/* ========================================================= */}
      {activeSubTab === 'emision' && (
        <div className="bg-white rounded-xl border border-starken-border p-5 sm:p-6 space-y-6 shadow-xs">
            
            {/* Mode Switcher */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-base font-black font-din text-slate-900">Emisión Autoservicio de Órdenes de Flete</h2>
                <p className="text-xs text-slate-500 font-sans font-medium">Genera guías unitarias con cálculo de tarifa o carga planillas masivas con pre-validación de errores.</p>
              </div>

              <div className="bg-slate-100 p-1 rounded-xl flex items-center font-din text-xs font-bold ">
                <button
                  onClick={() => setEmissionMode('unitaria')}
                  className={`px-4 py-1.5 rounded-lg transition-all cursor-pointer ${
                    emissionMode === 'unitaria' ? 'bg-[#33798C] text-white shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Emisión Unitaria
                </button>
                <button
                  onClick={() => setEmissionMode('masiva')}
                  className={`px-4 py-1.5 rounded-lg transition-all cursor-pointer ${
                    emissionMode === 'masiva' ? 'bg-[#33798C] text-white shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Emisión Masiva (Excel/CSV)
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
                    <h3 className="font-din font-black text-xs text-slate-800 tracking-wider flex items-center gap-1.5">
                      <User size={14} className="text-[#33798C]" />
                      <span>1. Datos del Destinatario</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                      <div className="space-y-1 sm:col-span-2">
                        <label className="font-bold text-slate-700">Nombre o Razón Social *</label>
                        <input
                          type="text"
                          required
                          placeholder="Ej. Distribuidora del Sur SpA / Claudia Fuentes"
                          value={unitForm.recipientName}
                          onChange={(e) => setUnitForm({ ...unitForm, recipientName: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-[#33798C] focus:ring-1 focus:ring-[#33798C]/20"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-slate-700">RUT Destinatario</label>
                        <input
                          type="text"
                          placeholder="Ej. 76.492.118-K"
                          value={unitForm.recipientRut}
                          onChange={(e) => setUnitForm({ ...unitForm, recipientRut: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-[#33798C]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-slate-700">Teléfono móvil</label>
                        <input
                          type="text"
                          placeholder="+56 9 8475 3622"
                          value={unitForm.recipientPhone}
                          onChange={(e) => setUnitForm({ ...unitForm, recipientPhone: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-[#33798C]"
                        />
                      </div>

                      <div className="space-y-1 sm:col-span-2">
                        <label className="font-bold text-slate-700">Correo Electrónico (Notificaciones de Entrega)</label>
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
                        <div className="space-y-1">
                          <label className="font-bold text-slate-700">Región Destino *</label>
                          <div className="relative">
                            <select
                              value={unitForm.destinationRegion}
                              onChange={(e) => setUnitForm({ ...unitForm, destinationRegion: e.target.value })}
                              className="w-full px-3 py-2 pr-8 border border-slate-200 rounded-lg text-xs outline-none focus:border-[#33798C] bg-white cursor-pointer font-sans appearance-none"
                            >
                              <option value="Metropolitana">Metropolitana de Santiago</option>
                              <option value="Biobío">Biobío (Concepción)</option>
                              <option value="Valparaíso">Valparaíso / Viña del Mar</option>
                              <option value="Coquimbo">Coquimbo / La Serena</option>
                              <option value="Antofagasta">Antofagasta</option>
                              <option value="La Araucanía">La Araucanía (Temuco)</option>
                              <option value="Los Lagos">Los Lagos (Puerto Montt)</option>
                            </select>
                            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-slate-700">Comuna Destino *</label>
                          <div className="relative">
                            <select
                              value={unitForm.destinationComuna}
                              onChange={(e) => setUnitForm({ ...unitForm, destinationComuna: e.target.value })}
                              className="w-full px-3 py-2 pr-8 border border-slate-200 rounded-lg text-xs outline-none focus:border-[#33798C] bg-white cursor-pointer font-sans appearance-none"
                            >
                              <option value="Providencia">Providencia</option>
                              <option value="Santiago">Santiago Centro</option>
                              <option value="Las Condes">Las Condes</option>
                              <option value="San Bernardo">San Bernardo</option>
                              <option value="Concepción">Concepción</option>
                              <option value="Viña del Mar">Viña del Mar</option>
                              <option value="La Serena">La Serena</option>
                              <option value="Temuco">Temuco</option>
                              <option value="Antofagasta">Antofagasta</option>
                              <option value="Puerto Montt">Puerto Montt</option>
                            </select>
                            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                          </div>
                        </div>

                        <div className="space-y-1 sm:col-span-2">
                          <label className="font-bold text-slate-700">Calle / Avenida *</label>
                          <input
                            type="text"
                            required
                            placeholder="Ej. Av. Los Carrera / Andrés Bello"
                            value={unitForm.destinationAddress}
                            onChange={(e) => setUnitForm({ ...unitForm, destinationAddress: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-[#33798C]"
                          />
                        </div>

                        <div className="space-y-1 sm:col-span-2">
                          <label className="font-bold text-slate-700">Número / Depto / Oficina / Referencia</label>
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
                          <div className="space-y-1">
                            <label className="font-bold text-slate-700 flex items-center gap-1">
                              <span>Región de Retiro *</span>
                              <span className="text-[10px] text-slate-400 font-normal">({Object.keys(STARKEN_BRANCHES_DATA).length} disponibles)</span>
                            </label>
                            <div className="relative">
                              <select
                                value={branchRegion}
                                onChange={(e) => handleRegionChange(e.target.value)}
                                className="w-full px-3 py-2 pr-8 border border-slate-300 rounded-lg text-xs outline-none focus:border-[#33798C] bg-white cursor-pointer font-sans font-medium appearance-none shadow-2xs"
                              >
                                {Object.keys(STARKEN_BRANCHES_DATA).map(reg => (
                                  <option key={reg} value={reg}>Región {reg === 'Metropolitana' ? 'Metropolitana de Santiago' : reg}</option>
                                ))}
                              </select>
                              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="font-bold text-slate-700 flex items-center gap-1">
                              <span>Comuna de Retiro *</span>
                              <span className="text-[10px] text-slate-400 font-normal">({availableComunas.length} con sucursales)</span>
                            </label>
                            <div className="relative">
                              <select
                                value={branchComuna}
                                onChange={(e) => handleComunaChange(e.target.value)}
                                className="w-full px-3 py-2 pr-8 border border-slate-300 rounded-lg text-xs outline-none focus:border-[#33798C] bg-white cursor-pointer font-sans font-medium appearance-none shadow-2xs"
                              >
                                {availableComunas.map(com => (
                                  <option key={com} value={com}>{com}</option>
                                ))}
                              </select>
                              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>
                          </div>
                        </div>

                        {/* Main Grid: Left = Available Branch Cards, Right = Interactive Cartographic Mini-Map */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 pt-1">
                          {/* Left: Branch Cards (6 cols) */}
                          <div className="lg:col-span-6 space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                            <div className="text-[11px] font-bold text-slate-500 font-din flex items-center justify-between pb-1 border-b border-slate-100">
                              <span>Sucursales Starken en {branchComuna} ({availableBranches.length})</span>
                              <span className="text-emerald-700 font-bold text-[10px]">Puntos Activos</span>
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
                                        <div className="font-din font-black text-xs text-slate-900 flex items-center gap-1.5">
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

                          {/* Right: Pequeño Mapa Interactivo (6 cols) */}
                          <div className="lg:col-span-6 flex flex-col">
                            <div className="relative h-[290px] w-full rounded-xl overflow-hidden border border-slate-300 bg-[#E8EFF1] shadow-inner flex flex-col justify-between select-none">
                              {/* SVG Background Cartography Simulation */}
                              <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                                <defs>
                                  <pattern id="grid-pattern" width="28" height="28" patternUnits="userSpaceOnUse">
                                    <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#D1DEE2" strokeWidth="0.5" />
                                  </pattern>
                                </defs>
                                <rect width="100%" height="100%" fill="#EBF1F2" />
                                <rect width="100%" height="100%" fill="url(#grid-pattern)" />
                                
                                {/* Green Parks */}
                                <path d="M 20 40 Q 60 10 100 50 T 160 80 L 120 130 Z" fill="#DCF0E2" opacity="0.75" />
                                <path d="M 220 180 Q 280 140 340 200 T 400 240 L 320 280 Z" fill="#DCF0E2" opacity="0.75" />
                                <circle cx="85%" cy="30%" r="35" fill="#DCF0E2" opacity="0.65" />

                                {/* Waterway / River */}
                                <path d="M -10 120 C 80 100, 140 180, 240 150 S 380 200, 500 170" fill="none" stroke="#C2DFE7" strokeWidth="22" strokeLinecap="round" />
                                <path d="M -10 120 C 80 100, 140 180, 240 150 S 380 200, 500 170" fill="none" stroke="#A8D4DE" strokeWidth="12" strokeLinecap="round" />

                                {/* Major Roads / Highways */}
                                <path d="M 0 60 L 500 220" stroke="#FFFFFF" strokeWidth="10" />
                                <path d="M 0 60 L 500 220" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="4 4" />
                                
                                <path d="M 120 0 L 160 300" stroke="#FFFFFF" strokeWidth="8" />
                                <path d="M 340 0 L 300 300" stroke="#FFFFFF" strokeWidth="8" />
                                
                                {/* Secondary Streets */}
                                <path d="M 0 180 L 400 0" stroke="#FFFFFF" strokeWidth="5" />
                                <path d="M 60 280 L 450 100" stroke="#FFFFFF" strokeWidth="5" />
                                <path d="M 220 0 L 260 300" stroke="#E2E8F0" strokeWidth="4" />
                                <circle cx="50%" cy="45%" r="26" fill="none" stroke="#FFFFFF" strokeWidth="6" />
                              </svg>

                              {/* Top Bar Floating Controls */}
                              <div className="relative z-10 p-2.5 flex items-center justify-between">
                                <div className="bg-white/95 backdrop-blur-xs border border-slate-200/90 rounded-lg px-2 py-1 shadow-xs flex items-center gap-1.5 text-[10px] font-din font-bold text-slate-800">
                                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                  <span>RED STARKEN · {branchComuna.toUpperCase()}</span>
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

                              {/* Interactive Markers Layer */}
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
                                      {/* Pulsing Ripple if selected */}
                                      {isSelected && (
                                        <span className="absolute -inset-2.5 rounded-full bg-[#33798C]/35 animate-ping"></span>
                                      )}

                                      {/* Marker Icon */}
                                      <div className={`relative flex items-center justify-center rounded-full shadow-lg transition-transform hover:scale-110 ${
                                        isSelected
                                          ? 'w-9 h-9 bg-[#33798C] text-white ring-4 ring-white shadow-[#33798C]/50'
                                          : 'w-7 h-7 bg-white text-[#33798C] border-2 border-[#33798C] hover:bg-[#ECF5F7]'
                                      }`}>
                                        <Building2 size={isSelected ? 16 : 13} />
                                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-inherit rotate-45"></span>
                                      </div>

                                      {/* Selected Marker Floating Tooltip */}
                                      {isSelected ? (
                                        <div className="absolute bottom-11 left-1/2 -translate-x-1/2 bg-slate-900/95 text-white px-2.5 py-1.5 rounded-lg shadow-xl text-center whitespace-nowrap z-30 animate-in fade-in zoom-in-95 pointer-events-none">
                                          <div className="font-din font-black text-[10px] text-teal-300 flex items-center justify-center gap-1">
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

                              {/* Bottom Footer Info Bar */}
                              <div className="relative z-10 p-2 bg-gradient-to-t from-slate-900/80 via-slate-900/50 to-transparent text-white text-[10px] font-sans flex items-center justify-between">
                                <span className="flex items-center gap-1 truncate text-slate-200">
                                  <MapPin size={11} className="text-teal-400 shrink-0" />
                                  <span>{selectedBranch ? `${selectedBranch.name} (${selectedBranch.address})` : 'Selecciona una sucursal'}</span>
                                </span>
                                <span className="text-[9px] text-teal-300 font-din font-bold shrink-0">Red Starken Chile</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Paquetes & Dimensiones */}
                  <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-2xs">
                    <h3 className="font-din font-black text-xs text-slate-800 tracking-wider flex items-center gap-1.5">
                      <Package size={14} className="text-[#33798C]" />
                      <span>3. Paquetes y dimensiones</span>
                    </h3>

                    <div className="flex flex-wrap items-end gap-3.5 text-xs font-sans">
                      <div className="space-y-1 w-24 sm:w-28 shrink-0">
                        <label className="font-bold text-slate-700 block">Peso (kg)</label>
                        <input
                          type="number"
                          step="0.1"
                          min="0.1"
                          value={unitForm.weight}
                          onChange={(e) => setUnitForm({ ...unitForm, weight: Number(e.target.value) })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-[#33798C] font-sans"
                        />
                      </div>

                      <div className="space-y-1 w-48 sm:w-56 shrink-0">
                        <label className="font-bold text-slate-700 block">Dimensiones (cm)</label>
                        <div className="grid grid-cols-3 gap-1.5">
                          <input type="number" placeholder="L" value={unitForm.length} onChange={(e) => setUnitForm({...unitForm, length: Number(e.target.value)})} className="px-1.5 py-2 text-center border border-slate-200 rounded-lg text-xs outline-none font-sans" />
                          <input type="number" placeholder="An" value={unitForm.width} onChange={(e) => setUnitForm({...unitForm, width: Number(e.target.value)})} className="px-1.5 py-2 text-center border border-slate-200 rounded-lg text-xs outline-none font-sans" />
                          <input type="number" placeholder="Al" value={unitForm.height} onChange={(e) => setUnitForm({...unitForm, height: Number(e.target.value)})} className="px-1.5 py-2 text-center border border-slate-200 rounded-lg text-xs outline-none font-sans" />
                        </div>
                      </div>

                      <div className="space-y-1 flex-1 min-w-[150px] max-w-[200px]">
                        <label className="font-bold text-slate-700 block">Valor declarado ($)</label>
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

                        <div className="space-y-1">
                          <label className="font-bold text-slate-700 block text-xs">Número de boleta o factura</label>
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
                        <h3 className="font-black text-lg text-slate-850 font-din tracking-wide">
                          Orden de Flete Generada
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
                      <span className="font-din font-bold text-[10px] bg-[#33798C] text-white px-2 py-0.5 rounded shrink-0">Starken</span>
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
          </div>
        )}

      {/* ========================================================= */}
      {/* SUB-TAB 3: COTIZADOR CORPORATIVO                          */}
      {/* ========================================================= */}
      {activeSubTab === 'cotizador' && (
        <div className="bg-white rounded-xl border border-starken-border p-5 sm:p-6 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <div>
                <h2 className="text-base font-black font-din text-slate-900">Cotizador de Tarifas con Convenio</h2>
                <p className="text-xs text-slate-500 font-sans font-medium">Calcula al instante los valores y tiempos de entrega para cualquier origen y destino en Chile.</p>
              </div>
              <span className="bg-[#ECF5F7] text-[#33798C] text-xs font-black px-3 py-1 rounded-lg border border-[#C2DFE7] font-din self-start sm:self-auto">
                Descuento: -25%
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Form Input Parameters (5 cols) */}
              <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 shadow-2xs">
                <div className="font-din font-black text-xs text-slate-800 tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-200">
                  <Calculator size={14} className="text-[#33798C]" />
                  <span>Parámetros de Cotización</span>
                </div>

                <div className="space-y-4 text-xs font-sans">
                  
                  {/* Comuna de Origen */}
                  <div className="space-y-2">
                    <label className="block font-bold text-slate-700">Comuna de Origen</label>
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
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-500">
                        <ChevronDown size={15} />
                      </div>
                    </div>
                  </div>

                  {/* Comuna de Destino */}
                  <div className="space-y-2">
                    <label className="block font-bold text-slate-700">Comuna de Destino</label>
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
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-500">
                        <ChevronDown size={15} />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="space-y-2">
                      <label className="block font-bold text-slate-700">Peso Físico (kg)</label>
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
                      <label className="block font-bold text-slate-700">Valor Declarado ($)</label>
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
                      <label className="font-bold text-slate-700">Dimensiones del Bulto (L x An x Al cm)</label>
                      {calculatedQuote.isVolumetricActive && (
                        <span className="text-[10px] text-amber-700 font-din font-bold ">
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
                  <span className="bg-slate-200/70 text-slate-700 font-din font-bold text-[11px] px-2 py-0.5 rounded">
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
                        <h3 className="font-din font-black text-sm sm:text-base text-slate-900 leading-snug">Entrega en Sucursal Starken</h3>
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
                        // Find matching region and branch for quoteDestination
                        let targetRegion = 'Metropolitana';
                        let targetComuna = 'Providencia';
                        let targetBranch = null;

                        for (const [reg, comunas] of Object.entries(STARKEN_BRANCHES_DATA)) {
                          for (const [com, branches] of Object.entries(comunas)) {
                            if (com.toLowerCase().includes(quoteDestination.toLowerCase()) || quoteDestination.toLowerCase().includes(com.toLowerCase())) {
                              targetRegion = reg;
                              targetComuna = com;
                              targetBranch = branches[0];
                              break;
                            }
                          }
                          if (targetBranch) break;
                        }

                        if (!targetBranch) {
                          targetRegion = 'Metropolitana';
                          targetComuna = 'Providencia';
                          targetBranch = STARKEN_BRANCHES_DATA['Metropolitana']['Providencia'][0];
                        }

                        setBranchRegion(targetRegion);
                        setBranchComuna(targetComuna);
                        setSelectedBranchId(targetBranch.id);

                        setUnitForm({
                          ...unitForm,
                          destinationRegion: targetRegion,
                          destinationComuna: targetComuna,
                          destinationAddress: targetBranch.address,
                          selectedBranchName: targetBranch.name,
                          deliveryType: 'Sucursal',
                          weight: calculatedQuote.finalWeight
                        });
                        setEmissionMode('unitaria');
                        setActiveSubTab('emision');
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
                        <h3 className="font-din font-black text-sm sm:text-base text-slate-900 leading-snug">Starken Prioritario</h3>
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
                        setUnitForm({
                          ...unitForm,
                          destinationComuna: quoteDestination,
                          serviceType: 'Express',
                          weight: calculatedQuote.finalWeight
                        });
                        setEmissionMode('unitaria');
                        setActiveSubTab('emision');
                      }}
                      className={`w-full sm:w-auto text-xs font-din font-black px-4 py-2 sm:py-1.5 rounded-xl sm:rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 ${
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
                        <h3 className="font-din font-black text-sm sm:text-base text-slate-900 leading-snug">Starken Normal</h3>
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
                        setUnitForm({
                          ...unitForm,
                          destinationComuna: quoteDestination,
                          serviceType: 'Normal',
                          weight: calculatedQuote.finalWeight
                        });
                        setEmissionMode('unitaria');
                        setActiveSubTab('emision');
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
        )}

      {/* ========================================================= */}
      {/* SUB-TAB 4: INTEGRACIÓN E-COMMERCE & APIS (< 30 MIN)       */}
      {/* ========================================================= */}
      {activeSubTab === 'ecommerce' && (
        <div className="bg-white rounded-xl border border-starken-border p-5 sm:p-6 space-y-6 shadow-xs">
            
            {/* Header */}
            <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-black font-din text-slate-900">Conectores E-commerce & Documentación API B2B</h2>
                <p className="text-xs text-slate-500 font-sans font-medium">Sincroniza tus tiendas online en menos de 30 minutos y genera etiquetas automáticas con un solo clic.</p>
              </div>

              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black px-3 py-1 rounded-lg font-din flex items-center gap-1.5 self-start sm:self-auto">
                <CheckCircle2 size={13} />
                <span>2 Tiendas Conectadas</span>
              </span>
            </div>

            {/* Store Connection Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-din font-black text-xs text-slate-900">Shopify</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <div className="text-[11px] text-emerald-700 font-bold font-sans">Sincronizado</div>
                <div className="text-[10px] text-slate-400 font-sans">Última sync hace 4 min</div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-din font-black text-xs text-slate-900">WooCommerce</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <div className="text-[11px] text-emerald-700 font-bold font-sans">Sincronizado</div>
                <div className="text-[10px] text-slate-400 font-sans">Plugin v3.4.1 Activo</div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-din font-black text-xs text-slate-900">Mercado Libre</span>
                  <span className="w-2 h-2 rounded-full bg-slate-300" />
                </div>
                <div className="text-[11px] text-slate-600 font-bold font-sans">Disponible</div>
                <button className="text-[10px] text-[#33798C] font-bold underline cursor-pointer">Conectar Tienda</button>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-din font-black text-xs text-slate-900">VTEX / Magento</span>
                  <span className="w-2 h-2 rounded-full bg-slate-300" />
                </div>
                <div className="text-[11px] text-slate-600 font-bold font-sans">API REST</div>
                <button className="text-[10px] text-[#33798C] font-bold underline cursor-pointer">Ver Plugin</button>
              </div>
            </div>

            {/* Synced Orders Table */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Store size={16} className="text-[#33798C]" />
                  <h3 className="font-din font-black text-xs text-slate-800 tracking-wider">
                    Pedidos Pendientes de Despacho ({ecommerceOrders.length})
                  </h3>
                </div>

                <button
                  onClick={handleFulfillEcommerce}
                  disabled={selectedOrders.length === 0}
                  className={`px-4 py-2 rounded-xl font-din font-black text-xs tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                    selectedOrders.length > 0
                      ? 'bg-[#33798C] hover:bg-[#1e4f5e] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Printer size={14} />
                  <span>Generar Etiquetas para {selectedOrders.length} Pedido(s)</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead className="bg-slate-50 font-din text-slate-500 text-[11px]">
                    <tr>
                      <th className="p-2.5 w-10">
                        <input
                          type="checkbox"
                          checked={selectedOrders.length === ecommerceOrders.length && ecommerceOrders.length > 0}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedOrders(ecommerceOrders.map(o => o.id));
                            } else {
                              setSelectedOrders([]);
                            }
                          }}
                          className="rounded text-[#33798C] focus:ring-[#33798C] accent-[#33798C]"
                        />
                      </th>
                      <th className="p-2.5">Pedido / Tienda</th>
                      <th className="p-2.5">Destinatario</th>
                      <th className="p-2.5">Comuna Destino</th>
                      <th className="p-2.5">Contenido</th>
                      <th className="p-2.5">Total Venta</th>
                      <th className="p-2.5">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {ecommerceOrders.map((order) => {
                      const isSelected = selectedOrders.includes(order.id);
                      return (
                        <tr key={order.id} className={`hover:bg-slate-50/60 ${isSelected ? 'bg-[#ECF5F7]/40' : ''}`}>
                          <td className="p-2.5">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {
                                setSelectedOrders(prev => 
                                  prev.includes(order.id) ? prev.filter(id => id !== order.id) : [...prev, order.id]
                                );
                              }}
                              className="rounded text-[#33798C] focus:ring-[#33798C] accent-[#33798C]"
                            />
                          </td>
                          <td className="p-2.5">
                            <span className="font-din font-black text-slate-900">{order.orderNumber}</span>
                            <div className="text-[10px] text-slate-400 font-sans">{order.store} · {order.date}</div>
                          </td>
                          <td className="p-2.5">
                            <div className="font-bold text-slate-800">{order.customer}</div>
                            <div className="text-[10px] text-slate-400">{order.rut}</div>
                          </td>
                          <td className="p-2.5 font-bold text-slate-700">{order.destination}</td>
                          <td className="p-2.5 text-slate-600 truncate max-w-[200px]">{order.items}</td>
                          <td className="p-2.5 font-din font-bold text-slate-800">{order.value}</td>
                          <td className="p-2.5">
                            <span className="bg-sky-50 text-sky-700 border border-sky-200 text-[10px] font-bold px-2 py-0.5 rounded font-sans">
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* API Documentation Quick Start Hub */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Code2 size={18} className="text-emerald-400" />
                    <h3 className="font-din font-black text-sm tracking-wide">API B2B StarkenPro — Guía de Conexión en 30 Minutos</h3>
                  </div>
                  <p className="text-xs text-slate-400 font-sans">
                    Endpoints REST autenticados con Bearer Token para cotización, emisión automática y sincronización de tracking en tiempo real.
                  </p>
                </div>

                {/* API Token Box */}
                <div className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 flex items-center gap-2 text-xs font-mono">
                  <span className="text-slate-400 text-[11px]">API Key:</span>
                  <span className="text-emerald-400 font-bold">stk_live_44379_88a91c0</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText('stk_live_44379_88a91c0');
                      setCopiedApiKey(true);
                      setTimeout(() => setCopiedApiKey(false), 2000);
                    }}
                    className="p-1 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title="Copiar API Key"
                  >
                    {copiedApiKey ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                  </button>
                </div>
              </div>

              {/* Code Snippets */}
              <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-[11px] font-mono">
                  <span className="text-slate-400">POST https://api.starken.cl/v2/pro/shipments</span>
                  <span className="text-emerald-400 font-bold">200 OK · 140ms</span>
                </div>
                <pre className="text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
{`curl -X POST https://api.starken.cl/v2/pro/shipments \\
  -H "Authorization: Bearer stk_live_44379_88a91c0" \\
  -H "Content-Type: application/json" \\
  -d '{
    "account": "44379",
    "service": "express",
    "recipient": { "name": "Claudia Fuentes", "rut": "76.492.118-K", "phone": "+56984753622" },
    "destination": { "address": "Av. Los Carrera 1420", "comuna": "Concepción" },
    "packages": [{ "weight": 4.5, "length": 30, "width": 20, "height": 15 }]
  }'`}
                </pre>
              </div>
            </div>
          </div>
        )}

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
                        <span className={`text-[10px] font-black font-din ${isSelected ? 'text-[#33798C]' : 'text-slate-500'}`}>
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

function Building2Icon() {
  return <Package size={13} className="text-[#33798C]" />;
}
