import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Package, 
  Truck, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  Clock, 
  Calendar, 
  MapPin, 
  User, 
  Phone, 
  FileText, 
  Download, 
  Eye, 
  Link as LinkIcon, 
  ExternalLink, 
  ChevronLeft,
  ChevronRight, 
  ChevronDown, 
  ArrowRight, 
  Building2, 
  FileCheck, 
  ShieldCheck, 
  Image as ImageIcon, 
  Camera, 
  ZoomIn, 
  Share2, 
  Copy, 
  Check, 
  Layers, 
  QrCode, 
  Info, 
  Sparkles,
  ArrowUpRight,
  HelpCircle,
  SlidersHorizontal,
  X
} from 'lucide-react';

// Comprehensive mock data for enterprise OFs with 222... numbering
export const MOCK_TRACKING_ORDERS = [
  {
    of: '222041289',
    derivedOf: '222094812',
    derivedType: 'Devolución a Bodega',
    service: 'Starken Express B2B',
    account: 'Cta Cte 44379 — CD San Bernardo (Principal)',
    accountCode: '44379',
    status: 'En reparto',
    statusBadge: 'warning',
    origin: { city: 'San Bernardo', hub: 'Hub Central Lo Boza' },
    destination: { city: 'Concepción', address: 'Av. Los Carrera 1420, Of. 502', comuna: 'Concepción', region: 'Biobío' },
    recipient: { name: 'Distribuidora del Sur SpA (Att: Claudia Fuentes)', rut: '76.492.118-K', phone: '+56 9 8475 3622', email: 'cfuentes@delsur.cl' },
    sender: { name: 'ElectroTech Chile SA', rut: '96.840.100-3', account: '44379' },
    packages: 3,
    weight: '18.5 kg',
    dimensions: '45x30x25 cm',
    declaredValue: '$450.000',
    emissionDate: '06-08-2026 09:15',
    estimatedDelivery: '08-08-2026 (Hoy) · 14:00 - 18:30 hrs',
    slaStatus: 'En Plazo (SLA 48h)',
    carrierInfo: { driver: 'Marcelo Tapia R.', vehicle: 'Furgón Mercedes Sprinter (Patente: LF-88-21)', phone: '+56 9 7123 4455' },
    hasDerived: true,
    isDerived: false,
    returnReason: null,
    microstates: [
      { id: 1, title: 'Orden de Flete Generada', desc: 'Emisión electrónica por cliente en StarkenPro API B2B', location: 'CD San Bernardo', timestamp: '06-08-2026 09:15 hrs', state: 'completed', category: 'Ingreso', technicalScan: 'Pistola Zebra MC3300' },
      { id: 2, title: 'En Tránsito Troncal Sur', desc: 'Carga y traslado en camión ruta Santiago - Concepción', location: 'Hub Central Lo Boza', timestamp: '06-08-2026 21:40 hrs', state: 'completed', category: 'Transporte', technicalScan: 'Precinto PR-882910' },
      { id: 3, title: 'Salida a Reparto', desc: 'Móvil en ruta de entrega prioritaria en Concepción', location: 'Concepción Centro', timestamp: '08-08-2026 09:30 hrs', state: 'active', category: 'Última Milla', technicalScan: 'Móvil LF-88-21' },
      { id: 4, title: 'Entrega en Destino', desc: 'Recepción conforme, fotografía y firma digital', location: 'Destino Final', timestamp: 'Estimado: 08-08-2026 16:30 hrs', state: 'pending', category: 'Cierre', technicalScan: 'Pendiente captura POD' }
    ],
    evidences: {
      attemptPhoto: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=800&auto=format&fit=crop&q=80',
      attemptTimestamp: '07-08-2026 15:10 hrs',
      attemptGeo: '-36.82013, -73.04421 (Av. Los Carrera 1420)',
      deliveryPhoto: null,
      digitalSignature: null,
      receiverRut: null,
      receiverName: null
    },
    documents: [
      { id: 'doc-1', name: 'Factura Electrónica B2B', type: 'PDF', size: '245 KB', folio: 'F-982341', date: '06-08-2026', url: '#' },
      { id: 'doc-2', name: 'Comprobante de Flete y Recepción', type: 'PDF', size: '180 KB', folio: 'CF-2026-8812', date: '06-08-2026', url: '#' },
      { id: 'doc-3', name: 'Guía de Despacho del Remitente', type: 'PDF', size: '310 KB', folio: 'GD-658973', date: '05-08-2026', url: '#' },
      { id: 'doc-4', name: 'Notificación Digital de Intento', type: 'PDF', size: '120 KB', folio: 'NOT-1029', date: '07-08-2026', url: '#' }
    ]
  },
  {
    of: '222094812',
    originalOf: '222041289',
    service: 'Devolución Oficial Starken B2B',
    account: 'Cta Cte 44379 — CD San Bernardo (Principal)',
    accountCode: '44379',
    status: 'En devolución',
    statusBadge: 'danger',
    origin: { city: 'Concepción', hub: 'CD Regional Concepción' },
    destination: { city: 'San Bernardo', address: 'Camino La Vara 0310, Módulo 4', comuna: 'San Bernardo', region: 'Metropolitana' },
    recipient: { name: 'ElectroTech Chile SA (Bodega Central)', rut: '96.840.100-3', phone: '+56 2 2840 9000', email: 'bodega@electrotech.cl' },
    sender: { name: 'Distribuidora del Sur SpA', rut: '76.492.118-K', account: '44379' },
    packages: 1,
    weight: '6.2 kg',
    dimensions: '30x20x15 cm',
    declaredValue: '$180.000',
    emissionDate: '07-08-2026 18:00',
    estimatedDelivery: '10-08-2026 · 11:00 hrs',
    slaStatus: 'En Tránsito Retorno',
    carrierInfo: { driver: 'Transporte Troncal Starken Sur', vehicle: 'Camión Freightliner (Patente: JH-44-19)', phone: '+56 2 2450 6000' },
    hasDerived: false,
    isDerived: true,
    returnReason: 'Rechazo por Cliente: Producto con daño de empaque exterior al primer intento',
    returnTariff: '$16.988 IVA inc. (Cargo en Cuenta Corriente 44379)',
    microstates: [
      { id: 1, title: 'Orden de Devolución Generada', desc: 'Guía de retorno asociada a OF Original #222041289', location: 'CD Concepción', timestamp: '07-08-2026 18:00 hrs', state: 'completed', category: 'Devolución', technicalScan: 'GD-DEV-2026-441' },
      { id: 2, title: 'En Tránsito de Retorno a Santiago', desc: 'Embarque en ruta sur hacia Centro de Distribución San Bernardo', location: 'Terminal Regional Sur', timestamp: '08-08-2026 05:00 hrs', state: 'active', category: 'Troncal Retorno', technicalScan: 'Manifiesto MD-094812' },
      { id: 3, title: 'Llegada a CD San Bernardo', desc: 'Recepción e inspección en muelle de logística inversa', location: 'CD San Bernardo', timestamp: 'Estimado: 09-08-2026 18:00 hrs', state: 'pending', category: 'Recepción', technicalScan: 'Pendiente' },
      { id: 4, title: 'Entrega Conforme en Bodega Remitente', desc: 'Reingreso a inventario y firma conforme de devolución', location: 'Bodega Central San Bernardo', timestamp: 'Estimado: 10-08-2026 11:00 hrs', state: 'pending', category: 'Cierre Devolución', technicalScan: 'Pendiente' }
    ],
    evidences: {
      attemptPhoto: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80',
      attemptTimestamp: '07-08-2026 17:50 hrs',
      attemptGeo: 'CD Concepción - Muelle de Logística Inversa',
      deliveryPhoto: null,
      digitalSignature: null,
      receiverRut: null,
      receiverName: null
    },
    documents: [
      { id: 'doc-dev-1', name: 'Guía Oficial de Devolución Starken', type: 'PDF', size: '290 KB', folio: 'GD-DEV-2026-441', date: '07-08-2026', url: '#' },
      { id: 'doc-dev-2', name: 'Acta de Rechazo y Motivo de Retorno', type: 'PDF', size: '140 KB', folio: 'ACT-9912', date: '07-08-2026', url: '#' },
      { id: 'doc-dev-3', name: 'Comprobante de Cargo por Devolución ($16.988)', type: 'PDF', size: '195 KB', folio: 'CC-44379-DEV', date: '07-08-2026', url: '#' }
    ]
  },
  {
    of: '222158934',
    service: 'Starken Normal B2B',
    account: 'Cta Cte 44379 — CD San Bernardo (Principal)',
    accountCode: '44379',
    status: 'Entregado',
    statusBadge: 'success',
    origin: { city: 'San Bernardo', hub: 'Hub Central Lo Boza' },
    destination: { city: 'Providencia', address: 'Av. Andrés Bello 2711, Piso 14', comuna: 'Providencia', region: 'Metropolitana' },
    recipient: { name: 'Consultores Asociados Chile (Recepción)', rut: '14.882.391-4', phone: '+56 9 9234 1122', email: 'recepcion@consultores.cl' },
    sender: { name: 'ElectroTech Chile SA', rut: '96.840.100-3', account: '44379' },
    packages: 2,
    weight: '8.0 kg',
    dimensions: '35x25x20 cm',
    declaredValue: '$320.000',
    emissionDate: '04-08-2026 11:20',
    estimatedDelivery: '05-08-2026 15:30 hrs',
    deliveredDate: '05-08-2026 15:28 hrs',
    slaStatus: 'Entregado a Tiempo (100% SLA)',
    carrierInfo: { driver: 'Gonzalo Pérez M.', vehicle: 'Peugeot Partner (Patente: KK-12-90)', phone: '+56 9 6344 8899' },
    hasDerived: false,
    isDerived: false,
    microstates: [
      { id: 1, title: 'Orden de Flete Generada', desc: 'Emisión electrónica por cliente en StarkenPro', location: 'CD San Bernardo', timestamp: '04-08-2026 11:20 hrs', state: 'completed', category: 'Ingreso', technicalScan: 'Pistola Zebra MC3300' },
      { id: 2, title: 'Recepción y Clasificación', desc: 'Ingreso y validación en Hub Metropolitano', location: 'Hub Lo Boza', timestamp: '04-08-2026 16:45 hrs', state: 'completed', category: 'Clasificación', technicalScan: 'Báscula Dinámica #01' },
      { id: 3, title: 'Salida a Reparto', desc: 'Asignado a cuadrante de última milla Santiago Oriente', location: 'Hub Providencia', timestamp: '05-08-2026 09:10 hrs', state: 'completed', category: 'Última Milla', technicalScan: 'Móvil KK-12-90' },
      { id: 4, title: 'Entrega Exitosa y Conforme', desc: 'Recepcionado por personal autorizado con firma y fotografía', location: 'Av. Andrés Bello 2711', timestamp: '05-08-2026 15:28 hrs', state: 'completed', category: 'Entregado', technicalScan: 'GPS Validado (-33.4182, -70.6062)' }
    ],
    evidences: {
      attemptPhoto: null,
      deliveryPhoto: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop&q=80',
      deliveryTimestamp: '05-08-2026 15:28 hrs',
      deliveryGeo: '-33.4182, -70.6062 (Av. Andrés Bello 2711, Piso 14)',
      digitalSignature: 'Firma Digital Registrada en Pantalla Táctil',
      receiverRut: '14.882.391-4',
      receiverName: 'Valeria Nicole Morales Soto'
    },
    documents: [
      { id: 'doc-ent-1', name: 'Factura Electrónica B2B', type: 'PDF', size: '210 KB', folio: 'F-981002', date: '04-08-2026', url: '#' },
      { id: 'doc-ent-2', name: 'Comprobante de Entrega Certificado (POD)', type: 'PDF', size: '540 KB', folio: 'POD-222158934', date: '05-08-2026', url: '#' },
      { id: 'doc-ent-3', name: 'Comprobante de Flete y Pago', type: 'PDF', size: '165 KB', folio: 'CF-2026-7910', date: '04-08-2026', url: '#' }
    ]
  },
  {
    of: '222384910',
    service: 'Starken Express B2B',
    account: 'Cta Cte 44380 — Hub Providencia E-Commerce',
    accountCode: '44380',
    status: 'En tránsito',
    statusBadge: 'info',
    origin: { city: 'Santiago', hub: 'Hub Providencia' },
    destination: { city: 'La Serena', address: 'Balmaceda 2100, Local 12', comuna: 'La Serena', region: 'Coquimbo' },
    recipient: { name: 'Comercial Norte Grande Ltda', rut: '78.112.900-2', phone: '+56 9 7788 9900', email: 'ventas@nortegrande.cl' },
    sender: { name: 'ElectroTech Chile SA', rut: '96.840.100-3', account: '44380' },
    packages: 5,
    weight: '34.0 kg',
    dimensions: '60x40x40 cm',
    declaredValue: '$890.000',
    emissionDate: '07-08-2026 16:40',
    estimatedDelivery: '09-08-2026 · 12:00 hrs',
    slaStatus: 'En Plazo (SLA 48h)',
    carrierInfo: { driver: 'Troncal Starken Ruta 5 Norte', vehicle: 'Camión Volvo FH (Patente: PT-77-33)', phone: '+56 2 2450 6000' },
    hasDerived: false,
    isDerived: false,
    microstates: [
      { id: 1, title: 'Orden de Flete Generada', desc: 'Emisión electrónica por cliente en StarkenPro', location: 'Hub Providencia', timestamp: '07-08-2026 16:40 hrs', state: 'completed', category: 'Ingreso', technicalScan: 'Pistola Zebra MC3300' },
      { id: 2, title: 'En Tránsito Troncal', desc: 'Vehículo en desplazamiento por Ruta 5 Norte hacia La Serena', location: 'Ruta 5 Norte', timestamp: '08-08-2026 06:30 hrs', state: 'active', category: 'Transporte', technicalScan: 'Móvil Volvo FH PT-77-33' },
      { id: 3, title: 'Llegada a CD La Serena', desc: 'Recepción y desglose de bultos para reparto local', location: 'CD La Serena', timestamp: 'Estimado: 08-08-2026 19:00 hrs', state: 'pending', category: 'Recepción', technicalScan: 'Pendiente' },
      { id: 4, title: 'Entrega en Destino', desc: 'Salida a última milla y recepción conforme', location: 'La Serena', timestamp: 'Estimado: 09-08-2026 12:00 hrs', state: 'pending', category: 'Cierre', technicalScan: 'Pendiente' }
    ],
    evidences: {
      attemptPhoto: null,
      deliveryPhoto: null,
      digitalSignature: null,
      receiverRut: null,
      receiverName: null
    },
    documents: [
      { id: 'doc-38-1', name: 'Factura Electrónica B2B', type: 'PDF', size: '280 KB', folio: 'F-984420', date: '07-08-2026', url: '#' },
      { id: 'doc-38-2', name: 'Guía de Despacho Electrónica', type: 'PDF', size: '320 KB', folio: 'GD-771920', date: '07-08-2026', url: '#' }
    ]
  },
  {
    of: '222719402',
    service: 'Starken Express B2B',
    account: 'Cta Cte 44381 — Sucursal Concepción Mayorista',
    accountCode: '44381',
    status: 'Con excepción',
    statusBadge: 'danger',
    origin: { city: 'Concepción', hub: 'CD Concepción' },
    destination: { city: 'Temuco', address: 'Av. Alemania 0840, Local 3', comuna: 'Temuco', region: 'La Araucanía' },
    recipient: { name: 'Comercializadora del Valle', rut: '77.890.112-1', phone: '+56 9 8811 2233', email: 'contacto@delvalle.cl' },
    sender: { name: 'ElectroTech Chile SA', rut: '96.840.100-3', account: '44381' },
    packages: 1,
    weight: '4.5 kg',
    dimensions: '25x20x20 cm',
    declaredValue: '$95.000',
    emissionDate: '06-08-2026 10:00',
    estimatedDelivery: '07-08-2026 16:00 hrs',
    slaStatus: 'SLA Excedido (Requiere Gestión)',
    carrierInfo: { driver: 'Roberto Soto C.', vehicle: 'Furgón Hyundai H1 (Patente: RT-66-55)', phone: '+56 9 5544 3322' },
    hasDerived: false,
    isDerived: false,
    exceptionReason: 'Dirección Incompleta: Falta número de departamento / local no identificado',
    microstates: [
      { id: 1, title: 'Orden de Flete Generada', desc: 'Emisión electrónica por cliente en StarkenPro', location: 'CD Concepción', timestamp: '06-08-2026 10:00 hrs', state: 'completed', category: 'Ingreso', technicalScan: 'Pistola MC3300' },
      { id: 2, title: 'En Tránsito a Temuco', desc: 'Llegada a terminal y ruteo local', location: 'CD Temuco', timestamp: '06-08-2026 19:30 hrs', state: 'completed', category: 'Transporte', technicalScan: 'Dock 02' },
      { id: 3, title: 'Intento de Entrega: Dirección Incompleta', desc: 'Dirección inexacta en terreno. Conductor reporta local cerrado sin numeración', location: 'Av. Alemania 0840', timestamp: '07-08-2026 14:15 hrs', state: 'exception', category: 'Incidencia', technicalScan: 'Foto de fachada adjunta' },
      { id: 4, title: 'En Custodia CD Temuco', desc: 'Esperando gestión de cliente empresa para aclaración de dirección o redestinación', location: 'CD Temuco', timestamp: '08-08-2026 08:00 hrs', state: 'active', category: 'Custodia', technicalScan: 'Jaula Custodia #JC-12' }
    ],
    evidences: {
      attemptPhoto: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80',
      attemptTimestamp: '07-08-2026 14:15 hrs',
      attemptGeo: '-38.7359, -72.6022 (Av. Alemania 0840)',
      deliveryPhoto: null,
      digitalSignature: null,
      receiverRut: null,
      receiverName: null
    },
    documents: [
      { id: 'doc-71-1', name: 'Factura Electrónica B2B', type: 'PDF', size: '230 KB', folio: 'F-983110', date: '06-08-2026', url: '#' },
      { id: 'doc-71-2', name: 'Comprobante de Flete', type: 'PDF', size: '170 KB', folio: 'CF-2026-8109', date: '06-08-2026', url: '#' }
    ]
  }
];

export const EXTRA_TRACKING_ORDERS = [
  {
    of: '275161618',
    service: 'Starken Express B2B',
    account: 'Cta Cte 44379 — CD San Bernardo (Principal)',
    accountCode: '44379',
    status: 'Con excepción',
    statusBadge: 'danger',
    origin: { city: 'San Bernardo', hub: 'CD San Bernardo' },
    destination: { city: 'San Bernardo', address: 'Rosales 3436', comuna: 'San Bernardo', region: 'Metropolitana' },
    recipient: { name: 'Jeraldin Alejandra P.', rut: '15.688.949-0', phone: '+56 9 7692 1527', email: 'Info@swisstradinggroup.uk' },
    sender: { name: 'ElectroTech Chile SA', rut: '96.840.100-3', account: '44379' },
    packages: 1,
    weight: '3.2 kg',
    dimensions: '25x20x15 cm',
    declaredValue: '$85.000',
    emissionDate: '04-08-2026 09:30',
    estimatedDelivery: '05-08-2026 18:00 hrs',
    slaStatus: 'En Excepción (SLA 60 min)',
    carrierInfo: { driver: 'Rodrigo Fuentes M.', vehicle: 'Furgón Peugeot Boxer (Patente: LJ-20-44)', phone: '+56 9 6554 1122' },
    hasDerived: false,
    isDerived: false,
    exceptionReason: 'Dirección Incorrecta: Numeración no existe o calle inexacta en terreno',
    microstates: [
      { id: 1, title: 'Orden de Flete Generada', desc: 'Emisión electrónica en StarkenPro', location: 'CD San Bernardo', timestamp: '04-08-2026 09:30 hrs', state: 'completed', category: 'Ingreso', technicalScan: 'Pistola Zebra MC3300' },
      { id: 2, title: 'Salida a Reparto', desc: 'Móvil en ruta San Bernardo', location: 'San Bernardo', timestamp: '05-08-2026 09:00 hrs', state: 'completed', category: 'Última Milla', technicalScan: 'Móvil LJ-20-44' },
      { id: 3, title: 'Intento de Entrega: Dirección Incorrecta', desc: 'Conductor reporta numeración no ubicada en terreno', location: 'Rosales 3436', timestamp: '05-08-2026 12:40 hrs', state: 'exception', category: 'Incidencia', technicalScan: 'GPS (-33.5921, -70.7042)' },
      { id: 4, title: 'En Espera de Gestión EUM', desc: 'Pendiente de aclaración de dirección por el cliente en StarkenPro', location: 'CD San Bernardo', timestamp: '05-08-2026 14:00 hrs', state: 'active', category: 'Gestión', technicalScan: 'Alerta EUM' }
    ],
    evidences: {
      attemptPhoto: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=800&auto=format&fit=crop&q=80',
      attemptTimestamp: '05-08-2026 12:40 hrs',
      attemptGeo: '-33.5921, -70.7042 (Rosales 3436)',
      deliveryPhoto: null,
      digitalSignature: null,
      receiverRut: null,
      receiverName: null
    },
    documents: [
      { id: 'doc-2751-1', name: 'Factura Electrónica B2B', type: 'PDF', size: '215 KB', folio: 'F-982101', date: '04-08-2026', url: '#' },
      { id: 'doc-2751-2', name: 'Comprobante de Flete y Recepción', type: 'PDF', size: '175 KB', folio: 'CF-2026-9011', date: '04-08-2026', url: '#' }
    ]
  },
  {
    of: '275067401',
    service: 'Starken Express B2B',
    account: 'Cta Cte 44379 — CD San Bernardo (Principal)',
    accountCode: '44379',
    status: 'Con excepción',
    statusBadge: 'danger',
    origin: { city: 'San Bernardo', hub: 'CD San Bernardo' },
    destination: { city: 'San Bernardo', address: 'Av. Portales 1820', comuna: 'San Bernardo', region: 'Metropolitana' },
    recipient: { name: 'Juan Carlos Espinoza', rut: '13.910.482-5', phone: '+56 9 5857 9337', email: 'jcespinoza@gmail.com' },
    sender: { name: 'ElectroTech Chile SA', rut: '96.840.100-3', account: '44379' },
    packages: 2,
    weight: '5.8 kg',
    dimensions: '30x25x20 cm',
    declaredValue: '$120.000',
    emissionDate: '04-08-2026 10:15',
    estimatedDelivery: '05-08-2026 17:00 hrs',
    slaStatus: 'En Excepción (SLA 120 min)',
    carrierInfo: { driver: 'Marcelo Tapia R.', vehicle: 'Furgón Mercedes Sprinter (Patente: LF-88-21)', phone: '+56 9 7123 4455' },
    hasDerived: false,
    isDerived: false,
    exceptionReason: 'Cliente Ausente: No responde citófono ni llamadas telefónicas',
    microstates: [
      { id: 1, title: 'Orden de Flete Generada', desc: 'Emisión electrónica por cliente en StarkenPro', location: 'CD San Bernardo', timestamp: '04-08-2026 10:15 hrs', state: 'completed', category: 'Ingreso', technicalScan: 'Pistola MC3300' },
      { id: 2, title: 'Salida a Reparto', desc: 'Asignado a ruta San Bernardo', location: 'CD San Bernardo', timestamp: '05-08-2026 08:45 hrs', state: 'completed', category: 'Última Milla', technicalScan: 'Móvil LF-88-21' },
      { id: 3, title: 'Intento de Entrega: Cliente Ausente', desc: 'Sin moradores en el domicilio. Se notifica vía SMS', location: 'Av. Portales 1820', timestamp: '05-08-2026 14:10 hrs', state: 'exception', category: 'Incidencia', technicalScan: 'GPS Validado' },
      { id: 4, title: 'En Espera de Gestión EUM', desc: 'Pendiente de solicitud de reintento o devolución por cliente', location: 'CD San Bernardo', timestamp: '05-08-2026 15:00 hrs', state: 'active', category: 'Gestión', technicalScan: 'Alerta EUM' }
    ],
    evidences: {
      attemptPhoto: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80',
      attemptTimestamp: '05-08-2026 14:10 hrs',
      attemptGeo: '-33.5980, -70.7100',
      deliveryPhoto: null,
      digitalSignature: null,
      receiverRut: null,
      receiverName: null
    },
    documents: [
      { id: 'doc-2750-1', name: 'Factura Electrónica B2B', type: 'PDF', size: '220 KB', folio: 'F-982055', date: '04-08-2026', url: '#' }
    ]
  },
  {
    of: '274020967',
    service: 'Starken Normal B2B',
    account: 'Cta Cte 44379 — CD San Bernardo (Principal)',
    accountCode: '44379',
    status: 'En gestión',
    statusBadge: 'warning',
    origin: { city: 'San Bernardo', hub: 'CD San Bernardo' },
    destination: { city: 'La Serena', address: 'Los Castanos 1027 Nº 1027', comuna: 'La Serena', region: 'Coquimbo' },
    recipient: { name: 'Alva Rosa Farias Oli', rut: '12.449.812-3', phone: '+56 9 8986 0058', email: 'Alvaf89860058@gmail.com' },
    sender: { name: 'ElectroTech Chile SA', rut: '96.840.100-3', account: '44379' },
    packages: 1,
    weight: '4.0 kg',
    dimensions: '30x20x15 cm',
    declaredValue: '$90.000',
    emissionDate: '14-07-2026',
    estimatedDelivery: '18-07-2026',
    slaStatus: 'En Gestión de Solicitud',
    carrierInfo: { driver: 'Transporte Norte Starken', vehicle: 'Camión Freightliner', phone: '+56 2 2450 6000' },
    hasDerived: false,
    isDerived: false,
    microstates: [
      { id: 1, title: 'Orden de Flete Generada', desc: 'Emisión electrónica StarkenPro', location: 'San Bernardo', timestamp: '14-07-2026 10:00 hrs', state: 'completed', category: 'Ingreso', technicalScan: 'Pistola MC3300' },
      { id: 2, title: 'En Tránsito a La Serena', desc: 'Despacho troncal a centro regional', location: 'CD La Serena', timestamp: '16-07-2026 14:00 hrs', state: 'completed', category: 'Transporte', technicalScan: 'Troncal Norte' },
      { id: 3, title: 'Incidencia en Entrega', desc: 'Cliente solicita cambio de dirección antes de entrega', location: 'La Serena', timestamp: '18-07-2026 11:30 hrs', state: 'exception', category: 'Incidencia', technicalScan: 'Constancia Terreno' },
      { id: 4, title: 'En Gestión de Solicitud', desc: 'Solicitud ingresada por cliente empresa en StarkenPro', location: 'Portal StarkenPro', timestamp: '18-07-2026 16:20 hrs', state: 'active', category: 'Gestión', technicalScan: 'Ticket #TG-994102' }
    ],
    evidences: { attemptPhoto: null, deliveryPhoto: null, digitalSignature: null, receiverRut: null, receiverName: null },
    documents: [{ id: 'doc-2740-1', name: 'Comprobante de Flete', type: 'PDF', size: '180 KB', folio: 'CF-274020', date: '14-07-2026', url: '#' }]
  },
  {
    of: '273752930',
    derivedOf: '273958851',
    derivedType: 'Redestinación',
    service: 'Starken Normal B2B',
    account: 'Cta Cte 44379 — CD San Bernardo (Principal)',
    accountCode: '44379',
    status: 'Entregado',
    statusBadge: 'success',
    origin: { city: 'San Bernardo', hub: 'CD San Bernardo' },
    destination: { city: 'San Felipe', address: '9 Nte 555 Piso 4 Dpto 410 N° 555', comuna: 'San Felipe', region: 'Valparaíso' },
    recipient: { name: 'Milton Rene Nunez Hinojosa', rut: '11.832.901-7', phone: '+56 9 4488 5043', email: 'Info@swisstradinggroup.uk' },
    sender: { name: 'ElectroTech Chile SA', rut: '96.840.100-3', account: '44379' },
    packages: 1,
    weight: '3.5 kg',
    dimensions: '25x20x15 cm',
    declaredValue: '$75.000',
    emissionDate: '09-07-2026',
    estimatedDelivery: '14-07-2026',
    slaStatus: 'Gestionado Exitosamente',
    carrierInfo: { driver: 'Carol Bedwell Mx', vehicle: 'Peugeot Partner', phone: '+56 9 4488 5043' },
    hasDerived: true,
    isDerived: false,
    microstates: [
      { id: 1, title: 'Orden de Flete Generada', desc: 'Emisión electrónica StarkenPro', location: 'San Bernardo', timestamp: '09-07-2026 10:00 hrs', state: 'completed', category: 'Ingreso', technicalScan: 'Pistola MC3300' },
      { id: 2, title: 'Redestinación Procesada', desc: 'Se genera nueva OF #273958851 hacia San Felipe', location: 'Hub Central', timestamp: '14-07-2026 12:00 hrs', state: 'completed', category: 'Gestión', technicalScan: 'Operador C. Bedwell' },
      { id: 3, title: 'Salida a Reparto San Felipe', desc: 'Móvil en cuadrante San Felipe Centro', location: 'San Felipe', timestamp: '15-07-2026 09:30 hrs', state: 'completed', category: 'Última Milla', technicalScan: 'Móvil Partner' },
      { id: 4, title: 'Entrega Conforme en Destino', desc: 'Recepcionado conforme con firma y fotografía', location: '9 Nte 555, San Felipe', timestamp: '15-07-2026 16:30 hrs', state: 'completed', category: 'Cierre', technicalScan: 'POD Firmado' }
    ],
    evidences: { attemptPhoto: null, deliveryPhoto: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop&q=80', deliveryTimestamp: '15-07-2026 16:30 hrs', deliveryGeo: 'San Felipe Centro', digitalSignature: 'Firma Conforme Digital', receiverRut: '11.832.901-7', receiverName: 'Milton Rene Nunez Hinojosa' },
    documents: [{ id: 'doc-2737-1', name: 'POD Certificado', type: 'PDF', size: '340 KB', folio: 'POD-273752930', date: '15-07-2026', url: '#' }]
  }
];

export function generateDynamicTrackingOrder(query, selectedAccount = 'Cta Cte 44379 — CD San Bernardo (Principal)') {
  const cleanQuery = query ? query.trim() : '';
  const isRut = cleanQuery.includes('-') || (cleanQuery.length <= 12 && /\d+[kK\d]/.test(cleanQuery) && !/^\d{6,10}$/.test(cleanQuery));
  const ofNumber = isRut ? `222${Math.floor(100000 + Math.random() * 900000)}` : cleanQuery.replace(/\D/g, '') || cleanQuery || '222041289';
  const rutDisplay = isRut ? cleanQuery.toUpperCase() : '16.492.381-8';

  return {
    of: ofNumber,
    service: 'Starken Express B2B',
    account: selectedAccount || 'Cta Cte 44379 — CD San Bernardo (Principal)',
    accountCode: '44379',
    status: 'En reparto',
    statusBadge: 'warning',
    origin: { city: 'San Bernardo', hub: 'CD Central Lo Boza' },
    destination: { city: 'Santiago', address: 'Av. Providencia 1240, Piso 3', comuna: 'Providencia', region: 'Metropolitana' },
    recipient: { 
      name: isRut ? `Empresa / Destinatario (${cleanQuery})` : `Cliente Destinatario OF #${ofNumber}`, 
      rut: rutDisplay, 
      phone: '+56 9 7890 1234', 
      email: 'contacto@destinatario.cl' 
    },
    sender: { name: 'ElectroTech Chile SA', rut: '96.840.100-3', account: '44379' },
    packages: 2,
    weight: '7.5 kg',
    dimensions: '35x25x20 cm',
    declaredValue: '$210.000',
    emissionDate: '06-08-2026 08:30',
    estimatedDelivery: '08-08-2026 (Hoy) · 14:00 - 18:00 hrs',
    slaStatus: 'En Plazo (SLA 48h)',
    carrierInfo: { driver: 'Carlos Miranda R.', vehicle: 'Furgón Peugeot Boxer (Patente: LJ-20-44)', phone: '+56 9 6554 1122' },
    hasDerived: false,
    isDerived: false,
    returnReason: null,
    microstates: [
      { id: 1, title: 'Orden de Flete Generada', desc: 'Emisión electrónica por cliente en StarkenPro API B2B', location: 'CD San Bernardo', timestamp: '06-08-2026 08:30 hrs', state: 'completed', category: 'Ingreso', technicalScan: 'Pistola Zebra MC3300' },
      { id: 2, title: 'En Tránsito y Clasificación', desc: 'Validación de bultos y ruteo a centro de distribución', location: 'Hub Lo Boza', timestamp: '07-08-2026 07:30 hrs', state: 'completed', category: 'Transporte', technicalScan: 'Báscula #03' },
      { id: 3, title: 'Salida a Reparto', desc: 'Móvil en desplazamiento hacia dirección de entrega', location: 'Providencia / Santiago', timestamp: '08-08-2026 09:15 hrs', state: 'active', category: 'Última Milla', technicalScan: 'Móvil LJ-20-44' },
      { id: 4, title: 'Entrega en Destino', desc: 'Recepción conforme en destino y captura POD', location: 'Destino Final', timestamp: 'Estimado: 08-08-2026 17:30 hrs', state: 'pending', category: 'Cierre', technicalScan: 'Pendiente' }
    ],
    evidences: {
      attemptPhoto: null,
      deliveryPhoto: null,
      digitalSignature: null,
      receiverRut: null,
      receiverName: null
    },
    documents: [
      { id: `doc-${ofNumber}-1`, name: 'Factura Electrónica B2B', type: 'PDF', size: '240 KB', folio: `F-${ofNumber.slice(-6)}`, date: '06-08-2026', url: '#' },
      { id: `doc-${ofNumber}-2`, name: 'Comprobante de Flete y Recepción', type: 'PDF', size: '185 KB', folio: `CF-2026-${ofNumber.slice(-4)}`, date: '06-08-2026', url: '#' }
    ]
  };
}

export default function SeguimientoView({ initialOfQuery, selectedAccount, onSwitchToGestion, onTriggerAction }) {
  const initialOrdersList = useMemo(() => [...MOCK_TRACKING_ORDERS, ...EXTRA_TRACKING_ORDERS], []);
  const [allOrders, setAllOrders] = useState(initialOrdersList);

  // If an initial search was made, match it, otherwise default to first OF
  const [selectedOfNumber, setSelectedOfNumber] = useState(() => {
    if (initialOfQuery && initialOfQuery.trim()) {
      const q = initialOfQuery.trim().toLowerCase();
      const match = initialOrdersList.find(o => 
        o.of.toLowerCase() === q || 
        o.of.toLowerCase().includes(q) || 
        (o.derivedOf && o.derivedOf.toLowerCase().includes(q)) ||
        (o.originalOf && o.originalOf.toLowerCase().includes(q)) ||
        (o.recipient?.rut && o.recipient.rut.toLowerCase().includes(q)) ||
        (o.recipient?.name && o.recipient.name.toLowerCase().includes(q))
      );
      if (match) return match.of;
      return initialOfQuery.trim();
    }
    return '222041289';
  });

  const [searchTableQuery, setSearchTableQuery] = useState(initialOfQuery || '');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [activeDetailTab, setActiveDetailTab] = useState('timeline'); // 'timeline', 'evidences', 'documents', 'returns'
  const [selectedEvidenceModal, setSelectedEvidenceModal] = useState(null);
  const [copiedOf, setCopiedOf] = useState(false);

  // Synchronize when initialOfQuery changes from global search (Sidebar or Header)
  useEffect(() => {
    if (initialOfQuery && initialOfQuery.trim()) {
      const q = initialOfQuery.trim().toLowerCase();
      
      let match = allOrders.find(o => 
        o.of.toLowerCase() === q ||
        (o.derivedOf && o.derivedOf.toLowerCase() === q) ||
        (o.originalOf && o.originalOf.toLowerCase() === q) ||
        (o.recipient?.rut && o.recipient.rut.toLowerCase().includes(q))
      );

      if (!match) {
        match = allOrders.find(o => 
          o.of.toLowerCase().includes(q) ||
          (o.derivedOf && o.derivedOf.toLowerCase().includes(q)) ||
          (o.originalOf && o.originalOf.toLowerCase().includes(q)) ||
          (o.recipient?.name && o.recipient.name.toLowerCase().includes(q)) ||
          (o.recipient?.rut && o.recipient.rut.toLowerCase().includes(q))
        );
      }

      if (match) {
        setSelectedOfNumber(match.of);
        setSearchTableQuery(match.of);
      } else {
        const newOrder = generateDynamicTrackingOrder(initialOfQuery.trim(), selectedAccount);
        setAllOrders(prev => [newOrder, ...prev]);
        setSelectedOfNumber(newOrder.of);
        setSearchTableQuery(newOrder.of);
      }
    }
  }, [initialOfQuery, selectedAccount]);

  // Current active OF object
  const activeOrder = useMemo(() => {
    return allOrders.find(o => o.of.toString() === selectedOfNumber.toString()) || allOrders[0];
  }, [allOrders, selectedOfNumber]);

  // Helper flags for detail tabs
  const isDeliveredOrReturned = useMemo(() => {
    if (!activeOrder) return false;
    return activeOrder.status === 'Entregado' || 
           activeOrder.status === 'En devolución' || 
           activeOrder.status === 'Devolución' || 
           Boolean(activeOrder.hasDerived) || 
           Boolean(activeOrder.isDerived);
  }, [activeOrder]);

  const showEvidencesTab = isDeliveredOrReturned;
  const showDocumentsTab = activeOrder?.status === 'Entregado';
  const showReturnsTab = Boolean(activeOrder?.hasDerived) || Boolean(activeOrder?.isDerived) || activeOrder?.status === 'En devolución' || activeOrder?.status === 'Devolución';

  // Count visible tabs for layout
  const visibleTabsCount = 1 + (showEvidencesTab ? 1 : 0) + (showDocumentsTab ? 1 : 0) + (showReturnsTab ? 1 : 0);

  // Automatically switch tab based on active OF status when order changes
  useEffect(() => {
    if (!activeOrder) return;
    
    if (activeOrder.status === 'En devolución' || activeOrder.isDerived) {
      setActiveDetailTab('returns');
    } else if (activeOrder.status === 'Entregado') {
      setActiveDetailTab('evidences');
    } else {
      // 'En reparto', 'En tránsito', 'Con excepción', etc.
      setActiveDetailTab('timeline');
    }
  }, [activeOrder?.of, activeOrder?.status, activeOrder?.isDerived]);

  // Filtered orders list for the B2B table
  const filteredOrders = useMemo(() => {
    return allOrders.filter(o => {
      // Status filter
      if (statusFilter !== 'Todos') {
        if (statusFilter === 'En Tránsito' && o.status !== 'En tránsito') return false;
        if (statusFilter === 'En Reparto' && o.status !== 'En reparto') return false;
        if (statusFilter === 'Entregado' && o.status !== 'Entregado') return false;
        if (statusFilter === 'Con Excepción' && o.status !== 'Con excepción') return false;
        if (statusFilter === 'En Devolución' && o.status !== 'En devolución') return false;
      }

      // Search query
      if (searchTableQuery.trim() !== '') {
        const query = searchTableQuery.toLowerCase().trim();
        const matchOf = o.of.toLowerCase().includes(query);
        const matchDerived = o.derivedOf && o.derivedOf.toLowerCase().includes(query);
        const matchOriginal = o.originalOf && o.originalOf.toLowerCase().includes(query);
        const matchRecipient = (o.recipient?.name && o.recipient.name.toLowerCase().includes(query)) || (o.recipient?.rut && o.recipient.rut.toLowerCase().includes(query));
        const matchCity = (o.destination?.city && o.destination.city.toLowerCase().includes(query)) || (o.destination?.address && o.destination.address.toLowerCase().includes(query));
        const matchAccount = o.account && o.account.toLowerCase().includes(query);

        return matchOf || matchDerived || matchOriginal || matchRecipient || matchCity || matchAccount;
      }

      return true;
    });
  }, [allOrders, searchTableQuery, statusFilter]);

  // Pagination state for Envíos de la Cuenta
  const [ordersPage, setOrdersPage] = useState(1);
  const ORDERS_PER_PAGE = 6;

  // Reset page when filters change
  useEffect(() => {
    setOrdersPage(1);
  }, [searchTableQuery, statusFilter]);

  // When active order changes, make sure the user is viewing its page
  useEffect(() => {
    if (selectedOfNumber && filteredOrders.length > 0) {
      const idx = filteredOrders.findIndex(o => o.of.toString() === selectedOfNumber.toString());
      if (idx !== -1) {
        const targetPage = Math.floor(idx / ORDERS_PER_PAGE) + 1;
        setOrdersPage(targetPage);
      }
    }
  }, [selectedOfNumber, filteredOrders]);

  const totalOrdersPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE) || 1;

  const paginatedOrders = useMemo(() => {
    const start = (ordersPage - 1) * ORDERS_PER_PAGE;
    return filteredOrders.slice(start, start + ORDERS_PER_PAGE);
  }, [filteredOrders, ordersPage]);

  const handleCopyOf = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedOf(true);
    setTimeout(() => setCopiedOf(false), 2000);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Entregado':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold font-sans bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 size={12} className="stroke-[2.5]" />
            Entregado
          </span>
        );
      case 'En reparto':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold font-sans bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
            <Truck size={12} className="stroke-[2.5]" />
            En reparto
          </span>
        );
      case 'En tránsito':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold font-sans bg-sky-50 text-[#33798C] border border-[#C2DFE7]">
            <Clock size={12} className="stroke-[2.5]" />
            En tránsito
          </span>
        );
      case 'Con excepción':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold font-sans bg-rose-50 text-rose-700 border border-rose-200">
            <AlertTriangle size={12} className="stroke-[2.5]" />
            Excepción
          </span>
        );
      case 'En devolución':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold font-sans bg-orange-50 text-orange-700 border border-orange-200">
            <RotateCcw size={12} className="stroke-[2.5]" />
            En devolución
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold font-sans bg-slate-100 text-slate-700 border border-slate-200">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 1. Header Banner & Quick Enterprise Metrics */}
      <div className="bg-gradient-to-r from-[#1e4f5e] via-[#33798C] to-[#266373] rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        {/* Subtle decorative circular shapes */}
        <div className="absolute -right-16 -bottom-16 w-72 h-72 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute right-36 -top-16 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full border border-white/10 pointer-events-none" />
        <div className="absolute right-72 -bottom-20 w-40 h-40 rounded-full bg-white/[0.03] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-black font-din tracking-tight text-white">
              Visibilidad, trazabilidad y devoluciones
            </h2>
            <p className="text-xs sm:text-sm text-slate-100/90 font-medium font-sans">
              Monitorea el ciclo de vida completo de tus envíos con microestados operacionales, consulta de evidencias fotográficas, respaldo documental y gestión automatizada de logística inversa.
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 shrink-0">
            <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-xl p-3 text-center min-w-[100px]">
              <div className="text-[10px] font-bold tracking-wider text-slate-200 font-din">Total monitoreo</div>
              <div className="text-2xl font-black font-din mt-0.5 text-white">1.428</div>
              <div className="text-[10px] text-emerald-300 font-medium font-sans">98.4% a tiempo</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-xl p-3 text-center min-w-[100px]">
              <div className="text-[10px] font-bold tracking-wider text-slate-200 font-din">En reparto</div>
              <div className="text-2xl font-black font-din mt-0.5 text-amber-300">142</div>
              <div className="text-[10px] text-amber-200 font-medium font-sans">En ruta hoy</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-xl p-3 text-center min-w-[100px]">
              <div className="text-[10px] font-bold tracking-wider text-slate-200 font-din">Entregados</div>
              <div className="text-2xl font-black font-din mt-0.5 text-emerald-300">1.264</div>
              <div className="text-[10px] text-emerald-200 font-medium font-sans">Con firma & foto</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-xl p-3 text-center min-w-[100px]">
              <div className="text-[10px] font-bold tracking-wider text-slate-200 font-din">Devoluciones</div>
              <div className="text-2xl font-black font-din mt-0.5 text-orange-300">22</div>
              <div className="text-[10px] text-orange-200 font-medium font-sans">OF Derivadas</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Top Filter Bar & Search across Enterprise OFs */}
      <div className="bg-white rounded-xl border border-starken-border p-4 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          
          {/* Search box */}
          <div className="relative flex-1 max-w-lg">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <Search size={16} />
            </div>
            <input
              type="text"
              placeholder="Buscar por N° OF (ej. 222041289), Destinatario, RUT, Comuna o N° Guía..."
              value={searchTableQuery}
              onChange={(e) => setSearchTableQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#33798C]/30 focus:border-[#33798C] focus:bg-white transition-all"
            />
            {searchTableQuery && (
              <button 
                onClick={() => setSearchTableQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 font-din text-xs font-bold tracking-wide">
            {['Todos', 'En reparto', 'En tránsito', 'Con excepción', 'En devolución', 'Entregado'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status === 'Todos' ? 'Todos' : status === 'En reparto' ? 'En Reparto' : status === 'En tránsito' ? 'En Tránsito' : status === 'Con excepción' ? 'Con Excepción' : status === 'En devolución' ? 'En Devolución' : status)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  statusFilter.toLowerCase() === status.toLowerCase()
                    ? 'bg-[#33798C] text-white shadow-xs font-black'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Main Dashboard Layout: Table of Company OFs + Deep Tracking Inspector Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Enterprise OFs Table List (5 Cols on large screens) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Package size={16} className="text-[#33798C]" />
              <h3 className="font-din font-black text-slate-800 text-sm tracking-wide">
                Envíos de la cuenta ({filteredOrders.length})
              </h3>
            </div>
            <span className="text-[11px] font-bold text-slate-400 font-sans">
              Selecciona una OF para inspeccionar
            </span>
          </div>

          <div className="space-y-2.5">
            {paginatedOrders.length === 0 ? (
              <div className="p-8 text-center space-y-2 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
                <AlertTriangle size={24} className="mx-auto text-amber-500" />
                <p className="text-xs font-bold text-slate-700 font-sans">No se encontraron envíos con el criterio ingresado</p>
                <button 
                  onClick={() => { setSearchTableQuery(''); setStatusFilter('Todos'); }}
                  className="text-xs text-[#33798C] font-bold underline cursor-pointer"
                >
                  Limpiar filtros
                </button>
              </div>
            ) : (
              paginatedOrders.map((order) => {
                const isSelected = order.of === activeOrder.of;
                return (
                  <div
                    key={order.of}
                    onClick={() => setSelectedOfNumber(order.of)}
                    className={`p-3.5 sm:p-4 rounded-2xl transition-all cursor-pointer relative ${
                      isSelected 
                        ? 'bg-gradient-to-r from-[#ECF5F7] via-[#F3FAFB] to-white border-2 border-[#33798C] shadow-sm ring-2 ring-[#33798C]/15' 
                        : 'bg-white border border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/70 shadow-2xs hover:shadow-xs'
                    }`}
                  >
                    {/* Top Row: OF Number + Lineage Badge (left) & Status Badge + Chevron (right) */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-din font-black text-sm text-slate-900 tracking-wide shrink-0">
                          OF #{order.of}
                        </span>
                        {order.isDerived && (
                          <span className="bg-orange-100 text-orange-800 text-[10px] font-bold px-1.5 py-0.5 rounded font-sans inline-flex items-center gap-1 shrink-0 whitespace-nowrap">
                            <LinkIcon size={9} />
                            <span>OF derivada</span>
                          </span>
                        )}
                        {order.hasDerived && (
                          <span className="bg-orange-50 text-orange-700 border border-orange-200 text-[10px] font-bold px-1.5 py-0.5 rounded font-sans inline-flex items-center gap-1 shrink-0 whitespace-nowrap">
                            <RotateCcw size={9} />
                            <span>OF original</span>
                          </span>
                        )}
                      </div>
                      
                      <div className="shrink-0 flex items-center gap-1.5">
                        {getStatusBadge(order.status)}
                        {isSelected && (
                          <div className="hidden sm:flex text-[#33798C]" title="Detalle visible a la derecha">
                            <ChevronRight size={16} />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Recipient Name */}
                    <div className="mt-1.5">
                      <p className="text-xs font-bold text-slate-700 font-sans truncate">
                        {order.recipient.name}
                      </p>
                    </div>

                    {/* Destination & packages info without gray horizontal divider */}
                    <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 font-sans">
                      <div className="flex items-center gap-1.5 font-medium truncate max-w-[210px]">
                        <MapPin size={13} className="text-[#33798C] shrink-0" />
                        <span className="truncate text-slate-600">{order.destination.city} ({order.destination.comuna})</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-din font-bold text-slate-600 shrink-0">
                        <span>{order.packages} bulto(s)</span>
                        <span className="text-slate-300">·</span>
                        <span>{order.weight}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            {/* Pagination controls as a neat card */}
            {totalOrdersPages > 1 && (
              <div className="p-3 bg-white border border-slate-200/90 rounded-2xl shadow-2xs flex items-center justify-between text-xs font-sans mt-3">
                <span className="text-[11px] text-slate-500 font-medium">
                  Mostrando {((ordersPage - 1) * ORDERS_PER_PAGE) + 1} - {Math.min(ordersPage * ORDERS_PER_PAGE, filteredOrders.length)} de {filteredOrders.length}
                </span>

                <div className="flex items-center space-x-1.5 font-din">
                  <button
                    onClick={() => setOrdersPage(prev => Math.max(prev - 1, 1))}
                    disabled={ordersPage === 1}
                    className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                      ordersPage === 1 
                        ? 'border-slate-200 text-slate-300 cursor-not-allowed bg-white/50' 
                        : 'border-slate-300 text-slate-700 bg-white hover:bg-slate-100 shadow-2xs'
                    }`}
                    title="Página anterior"
                  >
                    <ChevronLeft size={14} />
                  </button>

                  <span className="px-2 py-0.5 text-xs font-bold text-slate-700 font-din">
                    {ordersPage} / {totalOrdersPages}
                  </span>

                  <button
                    onClick={() => setOrdersPage(prev => Math.min(prev + 1, totalOrdersPages))}
                    disabled={ordersPage === totalOrdersPages}
                    className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                      ordersPage === totalOrdersPages 
                        ? 'border-slate-200 text-slate-300 cursor-not-allowed bg-white/50' 
                        : 'border-slate-300 text-slate-700 bg-white hover:bg-slate-100 shadow-2xs'
                    }`}
                    title="Página siguiente"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Deep Tracking Inspector (7 Cols on large screens) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* OF Detail Card with highlighted contour */}
          <div className="bg-white rounded-2xl border-2 border-[#33798C]/40 shadow-md ring-4 ring-[#33798C]/5 overflow-hidden transition-all">
            
            {/* OF Header Titlebar */}
            <div className="p-5 sm:p-6 border-b border-starken-border bg-gradient-to-b from-slate-50/50 to-white">
              
              {/* Linked Derived OF Alert Banner (When viewing Original OF) */}
              {activeOrder.hasDerived && activeOrder.derivedOf && (
                <div className="mb-4 bg-gradient-to-r from-orange-50 via-orange-50/80 to-amber-50 border border-orange-200 rounded-xl p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-orange-950 shadow-2xs">
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5 sm:mt-0">
                      <RotateCcw size={17} />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold font-sans tracking-wide text-orange-700">
                        Orden original de envío
                      </div>
                      <div className="text-xs sm:text-sm font-bold font-sans text-orange-950 mt-0.5 space-y-0.5">
                        <div>
                          Se generó la OF derivada <span className="font-black font-din text-orange-900">#{activeOrder.derivedOf}</span>
                        </div>
                        <div className="text-[11px] sm:text-xs text-orange-800 font-semibold whitespace-nowrap">
                          ({activeOrder.derivedType || 'Devolución a bodega'})
                        </div>
                      </div>
                      <div className="text-[11px] text-orange-700/80 font-medium font-sans mt-0.5">
                        Este envío inicial dio origen a una nueva orden derivada hacia el remitente tras solicitud o incidencia.
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedOfNumber(activeOrder.derivedOf)}
                    className="shrink-0 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white text-xs font-black font-din px-3.5 py-2 rounded-lg transition-all shadow-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-center"
                  >
                    <span>Ver OF derivada #{activeOrder.derivedOf}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              )}

              {/* Linked Original OF Alert Banner (When viewing Derived OF) */}
              {activeOrder.isDerived && activeOrder.originalOf && (
                <div className="mb-4 bg-gradient-to-r from-sky-50 via-[#ECF5F7] to-cyan-50 border border-[#C2DFE7] rounded-xl p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-slate-900 shadow-2xs">
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#33798C] text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5 sm:mt-0">
                      <LinkIcon size={17} />
                    </div>
                    <div>
                      <div className="text-[11px] font-extrabold font-din tracking-wide text-[#33798C]">
                        Orden derivada de retorno
                      </div>
                      <div className="text-xs sm:text-sm font-bold font-sans text-slate-900 mt-0.5 space-y-0.5">
                        <div>
                          Generada a partir de la OF original <span className="font-black font-din text-[#33798C]">#{activeOrder.originalOf}</span>
                        </div>
                        <div className="text-[11px] sm:text-xs text-slate-700 font-semibold whitespace-nowrap">
                          (Envío inicial)
                        </div>
                      </div>
                      <div className="text-[11px] text-slate-600 font-medium font-sans mt-0.5">
                        Orden emitida para gestionar la custodia y retorno del producto al centro de distribución del remitente.
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedOfNumber(activeOrder.originalOf)}
                    className="shrink-0 bg-[#33798C] hover:bg-[#1e4f5e] active:bg-[#153a45] text-white text-xs font-black font-din px-3.5 py-2 rounded-lg transition-all shadow-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-center"
                  >
                    <span>Ver OF original #{activeOrder.originalOf}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              )}

              {/* Main OF ID & Badges */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold tracking-wider text-slate-400 font-sans">
                      {activeOrder.isDerived ? 'Orden de flete derivada' : activeOrder.hasDerived ? 'Orden de flete original' : 'Orden de flete'}
                    </span>
                    {activeOrder.isDerived && (
                      <span className="bg-orange-100 text-orange-800 text-[10px] font-bold px-2 py-0.5 rounded font-sans flex items-center gap-1">
                        <LinkIcon size={10} />
                        Derivada de #{activeOrder.originalOf}
                      </span>
                    )}
                    {activeOrder.hasDerived && (
                      <span className="bg-orange-50 border border-orange-200 text-orange-800 text-[10px] font-bold px-2 py-0.5 rounded font-sans flex items-center gap-1">
                        <RotateCcw size={10} />
                        Envío inicial · Deriva a #{activeOrder.derivedOf}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl sm:text-3xl font-black font-din text-slate-900 tracking-tight">
                      #{activeOrder.of}
                    </h1>
                    <button
                      onClick={() => handleCopyOf(activeOrder.of)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                      title="Copiar N° de Orden"
                    >
                      {copiedOf ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {getStatusBadge(activeOrder.status)}
                  <span className="bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1 rounded-md font-sans border border-slate-200">
                    {activeOrder.slaStatus}
                  </span>
                </div>
              </div>

              {/* Origin / Destination Flow Overview */}
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/80 rounded-xl p-3.5 border border-slate-200/70 text-xs font-sans">
                <div className="space-y-1">
                  <div className="text-[10px] font-black text-slate-400 font-din flex items-center gap-1">
                    <Building2 size={12} className="text-[#33798C]" />
                    <span>{activeOrder.isDerived ? 'Origen de retorno (Punto de incidencia)' : 'Origen & cuenta empresa'}</span>
                  </div>
                  <div className="font-bold text-slate-900">{activeOrder.origin.city} ({activeOrder.origin.hub})</div>
                  <div className="text-slate-500 font-medium text-[11px]">{activeOrder.account}</div>
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] font-black text-slate-400 font-din flex items-center gap-1">
                    <MapPin size={12} className="text-emerald-600" />
                    <span>{activeOrder.isDerived ? 'Destino de devolución (Bodega remitente)' : 'Destino & entrega'}</span>
                  </div>
                  <div className="font-bold text-slate-900">{activeOrder.destination.address}</div>
                  <div className="text-slate-500 font-medium text-[11px]">{activeOrder.recipient.name} · {activeOrder.recipient.phone}</div>
                </div>
              </div>
            </div>

            {/* Interactive Tab Switcher inside OF detail */}
            <div className={`border-b border-starken-border px-2 sm:px-4 bg-white ${
              visibleTabsCount === 4
                ? 'grid grid-cols-4'
                : visibleTabsCount === 3
                ? 'grid grid-cols-3'
                : visibleTabsCount === 2
                ? 'grid grid-cols-2'
                : 'flex'
            } gap-1 sm:gap-2`}>
              <button
                onClick={() => setActiveDetailTab('timeline')}
                className={`py-3 px-3 sm:px-4 text-center font-din font-bold text-[11px] sm:text-xs tracking-wide transition-all border-b-2 cursor-pointer flex flex-col items-center justify-center min-h-[50px] leading-tight ${
                  visibleTabsCount === 1 ? 'w-auto' : ''
                } ${
                  activeDetailTab === 'timeline'
                    ? 'border-[#33798C] text-[#33798C] font-black'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-200'
                }`}
              >
                <span>Microestados y trazabilidad</span>
                <span className="text-[10px] font-medium opacity-75 mt-0.5">({activeOrder.microstates.length})</span>
              </button>

              {showEvidencesTab && (
                <button
                  onClick={() => setActiveDetailTab('evidences')}
                  className={`py-3 px-1.5 text-center font-din font-bold text-[11px] sm:text-xs tracking-wide transition-all border-b-2 cursor-pointer flex flex-col items-center justify-center min-h-[50px] leading-tight ${
                    activeDetailTab === 'evidences'
                      ? 'border-[#33798C] text-[#33798C] font-black'
                      : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-200'
                  }`}
                >
                  <span>Evidencias</span>
                  <span className="text-[10px] font-medium opacity-75 mt-0.5">y firma</span>
                </button>
              )}

              {showDocumentsTab && (
                <button
                  onClick={() => setActiveDetailTab('documents')}
                  className={`py-3 px-1.5 text-center font-din font-bold text-[11px] sm:text-xs tracking-wide transition-all border-b-2 cursor-pointer flex flex-col items-center justify-center min-h-[50px] leading-tight ${
                    activeDetailTab === 'documents'
                      ? 'border-[#33798C] text-[#33798C] font-black'
                      : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-200'
                  }`}
                >
                  <span>Documentos de respaldo</span>
                  <span className="text-[10px] font-medium opacity-75 mt-0.5">({activeOrder.documents.length})</span>
                </button>
              )}

              {showReturnsTab && (
                <button
                  onClick={() => setActiveDetailTab('returns')}
                  className={`py-3 px-1.5 text-center font-din font-bold text-[11px] sm:text-xs tracking-wide transition-all border-b-2 cursor-pointer flex flex-col items-center justify-center min-h-[50px] leading-tight ${
                    activeDetailTab === 'returns'
                      ? 'border-orange-500 text-orange-700 font-black'
                      : 'border-transparent text-orange-600/70 hover:text-orange-800 hover:border-orange-200'
                  }`}
                >
                  <span>Logística inversa</span>
                  <span className="text-[10px] font-medium opacity-75 mt-0.5">& devolución</span>
                </button>
              )}
            </div>

            {/* Tab 1: Historial de Operaciones */}
            {(activeDetailTab === 'timeline' || (!showEvidencesTab && activeDetailTab === 'evidences') || (!showDocumentsTab && activeDetailTab === 'documents') || (!showReturnsTab && activeDetailTab === 'returns')) && (
              <div className="p-5 sm:p-6 space-y-5">
                
                {/* Microstate header controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <h3 className="text-xs font-black font-din text-slate-800 tracking-wider">
                    Historial de operaciones
                  </h3>

                  <button
                    onClick={() => {
                      if (onTriggerAction) {
                        onTriggerAction('gestionar', [activeOrder.of]);
                      } else if (onSwitchToGestion) {
                        onSwitchToGestion();
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#33798C] hover:bg-[#1e4f5e] active:bg-[#153a45] text-white text-xs font-black font-din rounded-lg shadow-xs transition-all cursor-pointer"
                    title="Gestionar excepción o SLA de esta orden de flete"
                  >
                    <SlidersHorizontal size={13} />
                    <span>Gestionar SLA</span>
                  </button>
                </div>

                {/* Timeline Stepper Component */}
                <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {activeOrder.microstates.map((step) => {
                    const isCompleted = step.state === 'completed';
                    const isActive = step.state === 'active';
                    const isException = step.state === 'exception';

                    return (
                      <div key={step.id} className="relative group">
                        
                        {/* Status Icon Marker */}
                        <div className={`absolute -left-6 sm:-left-8 top-0.5 w-6 sm:w-7 h-6 sm:h-7 rounded-full flex items-center justify-center border-2 transition-all shadow-xs ${
                          isCompleted
                            ? 'bg-emerald-500 border-emerald-100 text-white'
                            : isActive
                            ? 'bg-[#33798C] border-[#C2DFE7] text-white ring-4 ring-[#33798C]/20 animate-pulse'
                            : isException
                            ? 'bg-rose-500 border-rose-100 text-white'
                            : 'bg-white border-slate-300 text-slate-300'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle2 size={14} className="stroke-[3]" />
                          ) : isActive ? (
                            <Truck size={13} className="stroke-[2.5]" />
                          ) : isException ? (
                            <AlertTriangle size={13} className="stroke-[2.5]" />
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                          )}
                        </div>

                        {/* Step Card Body */}
                        <div className={`rounded-xl p-3.5 sm:p-4 border transition-all ${
                          isActive
                            ? 'bg-[#ECF5F7]/80 border-[#33798C]/30 shadow-xs'
                            : isException
                            ? 'bg-rose-50/70 border-rose-200 shadow-xs'
                            : 'bg-slate-50/60 border-slate-200/70 hover:bg-slate-50'
                        }`}>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <div className="flex items-center gap-2">
                              <span className="font-din font-black text-sm text-slate-900 tracking-wide">
                                {step.title}
                              </span>
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-sans ${
                                isException 
                                  ? 'bg-rose-200 text-rose-800'
                                  : 'bg-slate-200/80 text-slate-700'
                              }`}>
                                {step.category}
                              </span>
                            </div>

                            <span className="text-[11px] font-bold text-slate-500 font-din">
                              {step.timestamp}
                            </span>
                          </div>

                          <p className="text-xs font-semibold text-slate-600 font-sans mt-1">
                            {step.desc}
                          </p>


                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab 2: Visualización de Evidencias Digitales */}
            {activeDetailTab === 'evidences' && showEvidencesTab && (
              <div className="p-5 sm:p-6 space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-bold font-din text-slate-800 tracking-wide flex items-center gap-1.5">
                      <ShieldCheck size={16} className="text-emerald-600" />
                      <span>Evidencias y comprobantes de recepción</span>
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold font-sans mt-0.5">
                      Visualización de fotografías de entrega, firma digitalizada y cédula de identidad del receptor.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Photo Proof Card */}
                  <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold font-din text-slate-800 flex items-center gap-1.5">
                        <Camera size={14} className="text-[#33798C]" />
                        <span>Fotografía en terreno</span>
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-sans">
                        Entrega Conforme
                      </span>
                    </div>

                    {activeOrder.evidences.deliveryPhoto || activeOrder.evidences.attemptPhoto ? (
                      <div className="relative group rounded-lg overflow-hidden border border-slate-300 bg-black aspect-video">
                        <img 
                          src={activeOrder.evidences.deliveryPhoto || activeOrder.evidences.attemptPhoto} 
                          alt="Evidencia fotográfica" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3 text-white text-[11px] font-sans">
                          <div className="font-bold flex items-center gap-1">
                            <MapPin size={12} className="text-amber-400" />
                            <span>{activeOrder.evidences.deliveryGeo || activeOrder.evidences.attemptGeo}</span>
                          </div>
                          <div className="text-slate-300 text-[10px]">
                            Captura: {activeOrder.evidences.deliveryTimestamp || activeOrder.evidences.attemptTimestamp}
                          </div>
                        </div>

                        <button
                          onClick={() => setSelectedEvidenceModal(activeOrder.evidences.deliveryPhoto || activeOrder.evidences.attemptPhoto)}
                          className="absolute top-2 right-2 bg-black/60 hover:bg-black/90 text-white p-1.5 rounded-md backdrop-blur-xs transition-colors cursor-pointer"
                          title="Ampliar fotografía"
                        >
                          <ZoomIn size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="aspect-video rounded-lg border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 p-4 text-center">
                        <Camera size={24} className="mb-1 text-slate-300" />
                        <span className="text-xs font-bold font-sans">Aún no se registra fotografía</span>
                        <span className="text-[10px]">Se sincronizará automáticamente al momento de la entrega</span>
                      </div>
                    )}
                  </div>

                  {/* Digital Signature Card */}
                  <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold font-din text-slate-800 flex items-center gap-1.5">
                        <FileCheck size={14} className="text-emerald-600" />
                        <span>Firma digital y cédula</span>
                      </span>
                      <span className="text-[10px] font-bold text-slate-600 bg-slate-200 px-2 py-0.5 rounded font-sans">
                        Verificado
                      </span>
                    </div>

                    {activeOrder.evidences.digitalSignature ? (
                      <div className="space-y-3">
                        {/* Stylized Digital Signature Display Box */}
                        <div className="h-28 bg-white border border-slate-200 rounded-lg p-3 flex flex-col justify-between relative overflow-hidden shadow-inner">
                          <div className="text-[9px] font-mono text-slate-400">
                            Firma biométrica táctil · Timestamp {activeOrder.evidences.deliveryTimestamp}
                          </div>
                          {/* Signature SVG stylized preview */}
                          <div className="w-full flex items-center justify-center py-1">
                            <svg className="h-12 w-48 text-[#1e4f5e]" viewBox="0 0 200 60" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                              <path d="M 20 40 Q 50 10, 80 35 T 120 20 Q 150 45, 180 25" />
                              <path d="M 60 45 Q 90 20, 140 40" strokeWidth="1.5" />
                            </svg>
                          </div>
                          <div className="text-[9px] font-mono text-emerald-600 font-bold text-right">
                            ✓ Certificación criptográfica Starken
                          </div>
                        </div>

                        {/* Receiver Details Grid */}
                        <div className="grid grid-cols-2 gap-2 text-xs font-sans">
                          <div className="bg-white p-2 rounded border border-slate-200">
                            <div className="text-[9px] font-bold text-slate-400 font-din">RUT receptor</div>
                            <div className="font-bold text-slate-800">{activeOrder.evidences.receiverRut}</div>
                          </div>
                          <div className="bg-white p-2 rounded border border-slate-200">
                            <div className="text-[9px] font-bold text-slate-400 font-din">Nombre receptor</div>
                            <div className="font-bold text-slate-800 truncate">{activeOrder.evidences.receiverName}</div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="h-44 rounded-lg border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 p-4 text-center">
                        <FileCheck size={24} className="mb-1 text-slate-300" />
                        <span className="text-xs font-bold font-sans">Firma pendiente de captura</span>
                        <span className="text-[10px]">Disponible una vez completada la entrega</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Download Certified POD Button */}
                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => alert(`Descargando Certificado de Entrega POD para OF #${activeOrder.of}...`)}
                    className="btn btn-primary flex items-center gap-2 text-xs font-din font-bold cursor-pointer shadow-sm"
                  >
                    <Download size={14} />
                    <span>Descargar certificado de entrega oficial (POD)</span>
                  </button>
                </div>
              </div>
            )}

            {/* Tab 3: Documentación de Respaldo y Autoservicio (Solo cuando está Entregado) */}
            {activeDetailTab === 'documents' && activeOrder.status === 'Entregado' && (
              <div className="p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-bold font-din text-slate-800 tracking-wide flex items-center gap-1.5">
                      <FileText size={16} className="text-[#33798C]" />
                      <span>Expediente documental de la orden de flete</span>
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold font-sans mt-0.5">
                      Descarga facturas tributarias, comprobantes de flete y guías de despacho sin intervención de ejecutivos ni mesa de ayuda.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeOrder.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl p-4 flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-red-100 text-red-700 flex items-center justify-center shrink-0 font-din font-black text-xs shadow-2xs">
                          {doc.type}
                        </div>
                        <div className="truncate">
                          <div className="text-xs font-bold text-slate-900 truncate font-sans">
                            {doc.name}
                          </div>
                          <div className="text-[11px] text-slate-500 font-din flex items-center gap-2">
                            <span>Folio: <b>{doc.folio}</b></span>
                            <span>·</span>
                            <span>{doc.size}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => alert(`Descargando documento ${doc.name} (Folio ${doc.folio})...`)}
                        className="p-2 bg-white hover:bg-[#33798C] text-slate-600 hover:text-white border border-slate-200 rounded-lg transition-colors shrink-0 cursor-pointer shadow-2xs"
                        title="Descargar archivo"
                      >
                        <Download size={15} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-sans">
                  <span>Expediente digital validado por el SII de Chile</span>
                  <button
                    onClick={() => alert(`Generando archivo ZIP con los ${activeOrder.documents.length} documentos de la OF #${activeOrder.of}...`)}
                    className="text-[#33798C] font-bold hover:underline flex items-center gap-1 font-din cursor-pointer"
                  >
                    <Download size={13} />
                    <span>Descargar todo (.ZIP)</span>
                  </button>
                </div>
              </div>
            )}

            {/* Tab 4: Trazabilidad de Devoluciones y Relación de Órdenes */}
            {activeDetailTab === 'returns' && (
              <div className="p-5 sm:p-6 space-y-5 bg-gradient-to-b from-orange-50/30 to-white">
                <div className="flex items-center justify-between pb-3 border-orange-100">
                  <div>
                    <h3 className="text-sm font-bold font-din text-orange-950 tracking-wide flex items-center gap-1.5">
                      <RotateCcw size={16} className="text-orange-600" />
                      <span>Trazabilidad de logística inversa y relación de órdenes</span>
                    </h3>
                    <p className="text-xs text-slate-600 font-semibold font-sans mt-0.5">
                      Gestión de retorno al centro de distribución, correlación entre orden inicial y orden derivada, emisión de guía oficial y tarifas.
                    </p>
                  </div>
                </div>

                {/* Visual OF Lineage Flowchart */}
                <div className="bg-white rounded-xl border border-orange-200/80 p-4 shadow-2xs space-y-3">
                  <div className="text-xs font-bold font-din text-slate-700 tracking-wide flex items-center gap-1.5">
                    <LinkIcon size={14} className="text-orange-600" />
                    <span>Relación de trazabilidad entre órdenes de flete</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* OF Original Card */}
                    <div className={`p-4 rounded-xl border transition-all ${
                      !activeOrder.isDerived 
                        ? 'bg-orange-50/80 border-orange-300 ring-2 ring-orange-200 shadow-xs' 
                        : 'bg-slate-50 border-slate-200 hover:border-orange-200'
                    }`}>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold font-sans text-orange-800 bg-orange-100 px-2 py-0.5 rounded">
                          OF original (envío inicial)
                        </span>
                        {!activeOrder.isDerived && (
                          <span className="text-[10px] font-bold text-orange-700 font-sans">● Viendo actualmente</span>
                        )}
                      </div>
                      <div className="text-lg font-black font-din text-slate-900 mt-2">
                        #{activeOrder.hasDerived ? activeOrder.of : activeOrder.originalOf}
                      </div>
                      <div className="text-xs text-slate-600 font-sans mt-1">
                        {activeOrder.hasDerived 
                          ? `${activeOrder.origin.city} → ${activeOrder.destination.city} (Entrega inicial)` 
                          : 'Envío inicial generado por el remitente'}
                      </div>
                      {activeOrder.isDerived && (
                        <button
                          onClick={() => setSelectedOfNumber(activeOrder.originalOf)}
                          className="mt-3 text-xs text-[#33798C] font-bold font-din hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <span>Ver OF original #{activeOrder.originalOf}</span>
                          <ArrowRight size={13} />
                        </button>
                      )}
                    </div>

                    {/* OF Derivada Card */}
                    <div className={`p-4 rounded-xl border transition-all ${
                      activeOrder.isDerived 
                        ? 'bg-orange-50/80 border-orange-300 ring-2 ring-orange-200 shadow-xs' 
                        : 'bg-slate-50 border-slate-200 hover:border-orange-200'
                    }`}>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold font-sans text-orange-800 bg-orange-100 px-2 py-0.5 rounded">
                          OF derivada ({activeOrder.derivedType || 'Devolución a bodega'})
                        </span>
                        {activeOrder.isDerived && (
                          <span className="text-[10px] font-bold text-orange-700 font-din">● Viendo actualmente</span>
                        )}
                      </div>
                      <div className="text-lg font-black font-din text-slate-900 mt-2">
                        #{activeOrder.hasDerived ? activeOrder.derivedOf : activeOrder.of}
                      </div>
                      <div className="text-xs text-slate-600 font-sans mt-1">
                        {activeOrder.isDerived 
                          ? `${activeOrder.origin.city} → ${activeOrder.destination.city} (Retorno a bodega)` 
                          : 'Retorno automatizado hacia bodega central'}
                      </div>
                      {!activeOrder.isDerived && activeOrder.derivedOf && (
                        <button
                          onClick={() => setSelectedOfNumber(activeOrder.derivedOf)}
                          className="mt-3 text-xs text-orange-700 font-bold font-din hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <span>Ver OF derivada #{activeOrder.derivedOf}</span>
                          <ArrowRight size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Return Flow Summary Card */}
                <div className="bg-white rounded-xl border border-orange-200 p-4 shadow-xs space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-sans">
                    <div className="bg-orange-50/60 p-3 rounded-lg border border-orange-100">
                      <div className="text-[10px] font-bold text-orange-600 font-din">Motivo de devolución</div>
                      <div className="font-bold text-slate-900 mt-0.5">
                        {activeOrder.returnReason || 'Solicitud por cliente tras intento fallido'}
                      </div>
                    </div>

                    <div className="bg-orange-50/60 p-3 rounded-lg border border-orange-100">
                      <div className="text-[10px] font-bold text-orange-600 font-din">Guía oficial de retorno</div>
                      <div className="font-bold text-orange-950 mt-0.5 font-din text-sm">
                        GD-DEV-2026-441
                      </div>
                    </div>

                    <div className="bg-orange-50/60 p-3 rounded-lg border border-orange-100">
                      <div className="text-[10px] font-bold text-orange-600 font-din">Tarifa de retorno</div>
                      <div className="font-bold text-slate-900 mt-0.5 font-din">
                        {activeOrder.returnTariff || '$16.988 IVA inc.'}
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs font-sans">
                    <span className="font-semibold text-slate-700">
                      ¿Necesitas redestinar este paquete en lugar de devolverlo a bodega?
                    </span>
                    <button
                      onClick={onSwitchToGestion}
                      className="text-[#33798C] font-bold font-din hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Gestionar en EUM</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* High-Resolution Evidence Fullscreen Modal */}
      {selectedEvidenceModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedEvidenceModal(null)}
        >
          <div 
            className="relative max-w-4xl w-full bg-slate-900 rounded-2xl overflow-hidden border border-white/20 shadow-2xl space-y-2 p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-3 py-2 text-white pb-3 border-b border-white/10">
              <span className="text-xs font-bold font-din tracking-wide">
                Evidencia digital · OF #{activeOrder.of}
              </span>
              <button
                onClick={() => setSelectedEvidenceModal(null)}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors text-slate-300 hover:text-white cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="relative aspect-video max-h-[75vh] flex items-center justify-center bg-black rounded-lg overflow-hidden">
              <img 
                src={selectedEvidenceModal} 
                alt="Evidencia Digital" 
                className="max-h-full max-w-full object-contain"
              />
            </div>

            <div className="flex items-center justify-between px-3 py-2 text-slate-300 text-xs font-sans">
              <span>Coordenadas GPS y firma criptográfica validadas</span>
              <button
                onClick={() => alert('Descargando imagen original de entrega...')}
                className="bg-[#33798C] hover:bg-[#1e4f5e] text-white px-3 py-1.5 rounded-lg font-din font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Download size={13} />
                <span>Descargar imagen</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
