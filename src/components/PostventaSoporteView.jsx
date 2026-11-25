import React, { useState, useMemo } from 'react';
import { 
  Headphones, 
  LifeBuoy, 
  MessageSquare, 
  Plus, 
  Search, 
  Filter, 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  UploadCloud, 
  FileSpreadsheet, 
  Download, 
  ExternalLink, 
  Send, 
  Paperclip, 
  User, 
  UserCheck, 
  ShieldCheck, 
  Package, 
  Bell, 
  BookOpen, 
  HelpCircle, 
  ChevronRight, 
  ChevronDown, 
  X, 
  Check, 
  Layers, 
  RefreshCw, 
  Mail, 
  Lock, 
  Zap, 
  ArrowRight, 
  Eye, 
  DollarSign, 
  Calendar,
  AlertCircle,
  Truck,
  Sparkles
} from 'lucide-react';

// ==========================================
// MOCK DATA: TICKETS
// ==========================================
const INITIAL_TICKETS = [
  {
    id: 'TCK-2026-8812',
    of: '275161618',
    asunto: 'Error en webhook de cambio de estado a En Reparto',
    area: 'TI & Integraciones',
    categoria: 'Webhooks & APIs',
    ejecutivo: {
      nombre: 'Camila Morales V.',
      rol: 'Especialista Integraciones TI',
      avatar: 'CM',
      email: 'cmorales@starken.cl',
      telefono: '+56 9 8451 9021'
    },
    prioridad: 'Alta',
    estado: 'En gestión',
    fechaCreacion: '06-10-2026 10:15',
    ultimaActualizacion: 'Hace 25 min',
    slaRestante: '2.5 hrs restantes',
    slaCumplido: true,
    mensajes: [
      {
        id: 1,
        emisor: 'Cliente (Tú)',
        texto: 'Hola, estamos notando que las OFs emitidas hoy no están disparando el webhook de salida a reparto en nuestro endpoint https://api.empresa.cl/events.',
        fecha: '06-10-2026 10:15',
        tipo: 'cliente',
        adjunto: null
      },
      {
        id: 2,
        emisor: 'Camila Morales V. (Starken TI)',
        texto: 'Estimados, hemos revisado los logs de reintento. Detectamos un timeout 504 en su servidor de recepción a las 09:45 hrs. Reactivamos la cola de reenvío automático.',
        fecha: '06-10-2026 10:50',
        tipo: 'ejecutivo',
        adjunto: 'Logs_Webhook_OF275161618.txt'
      }
    ]
  },
  {
    id: 'TCK-2026-8805',
    of: '275067401',
    asunto: 'Solicitud de reintento urgente con nuevo teléfono de contacto',
    area: 'Operacional',
    categoria: 'Coordinación Domicilio',
    ejecutivo: {
      nombre: 'Ignacio Fuentes R.',
      rol: 'Ejecutivo Operaciones B2B',
      avatar: 'IF',
      email: 'ifuentes@starken.cl',
      telefono: '+56 9 7320 1198'
    },
    prioridad: 'Alta',
    estado: 'Abierto',
    fechaCreacion: '06-10-2026 11:30',
    ultimaActualizacion: 'Hace 40 min',
    slaRestante: '1.2 hrs restantes',
    slaCumplido: true,
    mensajes: [
      {
        id: 1,
        emisor: 'Cliente (Tú)',
        texto: 'El destinatario no contestó al primer intento. Se coordinó telefónicamente y estará disponible de 14:00 a 18:00 hrs. Nuevo celular: +56 9 5555 4444.',
        fecha: '06-10-2026 11:30',
        tipo: 'cliente',
        adjunto: null
      }
    ]
  },
  {
    id: 'TCK-2026-8791',
    of: '275105257',
    asunto: 'Consulta sobre aplicación de tarifa convenio para envíos sobremedida',
    area: 'Comercial',
    categoria: 'Tarifas y Facturación',
    ejecutivo: {
      nombre: 'Marcela Lagos G.',
      rol: 'Ejecutiva Comercial Cuentas Clave',
      avatar: 'ML',
      email: 'mlagos@starken.cl',
      telefono: '+56 9 9123 4400'
    },
    prioridad: 'Media',
    estado: 'Resuelto',
    fechaCreacion: '04-10-2026 14:20',
    ultimaActualizacion: '05-10-2026 09:10',
    slaRestante: 'Cerrado dentro de SLA',
    slaCumplido: true,
    mensajes: [
      {
        id: 1,
        emisor: 'Cliente (Tú)',
        texto: 'Estimada Marcela, quisiéramos validar si los bultos superiores a 1.5 metros aplican el recargo estándar o el factor preferencial acordado en el Anexo 2.',
        fecha: '04-10-2026 14:20',
        tipo: 'cliente',
        adjunto: null
      },
      {
        id: 2,
        emisor: 'Marcela Lagos G. (Comercial Starken)',
        texto: 'Hola Carlos, confirmo que según el anexo vigente de tu Cta Cte 44379, el factor es preferencial (15% de descuento sobre el recargo de sobremedida).',
        fecha: '05-10-2026 09:10',
        tipo: 'ejecutivo',
        adjunto: 'Tabla_Sobredimension_Convenio.pdf'
      }
    ]
  },
  {
    id: 'TCK-2026-8744',
    of: '274942088',
    asunto: 'Habilitación de credenciales para sandbox de nuevo plugin Shopify',
    area: 'Desarrollo APIs',
    categoria: 'Credenciales & Ambientes',
    ejecutivo: {
      nombre: 'Camila Morales V.',
      rol: 'Especialista Integraciones TI',
      avatar: 'CM',
      email: 'cmorales@starken.cl',
      telefono: '+56 9 8451 9021'
    },
    prioridad: 'Baja',
    estado: 'Cerrado',
    fechaCreacion: '01-10-2026 16:00',
    ultimaActualizacion: '02-10-2026 11:30',
    slaRestante: 'Cerrado con éxito',
    slaCumplido: true,
    mensajes: [
      {
        id: 1,
        emisor: 'Cliente (Tú)',
        texto: 'Requerimos API Key de pruebas para probar la integración con nuestra tienda staging de Shopify.',
        fecha: '01-10-2026 16:00',
        tipo: 'cliente',
        adjunto: null
      },
      {
        id: 2,
        emisor: 'Camila Morales V. (Starken TI)',
        texto: 'Credenciales generadas y enviadas al correo técnico registrado. Se adjunta guía de endpoints.',
        fecha: '02-10-2026 11:30',
        tipo: 'ejecutivo',
        adjunto: 'Guia_Shopify_Starken_v2.pdf'
      }
    ]
  }
];

// ==========================================
// MOCK DATA: INDEMNIZACIONES & RECLAMOS
// ==========================================
const INITIAL_INDEMNIZACIONES = [
  {
    id: 'IND-2026-0412',
    of: '274494880',
    tipo: 'Siniestro por Daño',
    motivoDetalle: 'Embalaje exterior perforado y contenido dañado durante traslado.',
    fechaSolicitud: '28-09-2026',
    montoReclamado: 185000,
    montoAprobado: 185000,
    estado: 'Aprobado para pago',
    perito: 'Rodrigo Sanhueza (Peritaje Legal Starken)',
    documentos: ['Factura_Comercial_9821.pdf', 'Acta_Recepcion_Dano.jpg'],
    cuentaBancaria: 'Banco Santander — Cta Cte **** 44379',
    fechaPagoEstimada: '15-10-2026',
    resolucion: 'Dictamen favorable. Se aprueba cobertura total del valor declarado de la factura comercial.'
  },
  {
    id: 'IND-2026-0398',
    of: '274837812',
    tipo: 'Extravío Total',
    motivoDetalle: 'Bulto sin movimiento de escaneo por más de 72 hrs en CD destino.',
    fechaSolicitud: '20-09-2026',
    montoReclamado: 320000,
    montoAprobado: 320000,
    estado: 'En liquidación',
    perito: 'Andrea Cárdenas (Seguros & Siniestros)',
    documentos: ['Boleta_Venta_44019.pdf', 'Certificado_No_Recepcion.pdf'],
    cuentaBancaria: 'Banco de Chile — Cta Cte **** 99120',
    fechaPagoEstimada: '10-10-2026',
    resolucion: 'Aprobada liquidación por extravío definitivo de bulto. Orden de transferencia bancaria emitida.'
  },
  {
    id: 'IND-2026-0425',
    of: '275244124',
    tipo: 'Merma Parcial',
    motivoDetalle: 'Faltante de 1 unidad en caja sellada con cinta original vulnerada.',
    fechaSolicitud: '05-10-2026',
    montoReclamado: 64500,
    montoAprobado: null,
    estado: 'En evaluación',
    perito: 'Perito de Guardia Asignado',
    documentos: ['Factura_5541.pdf', 'Foto_Pesaje_Recepcion.png'],
    cuentaBancaria: 'Banco Santander — Cta Cte **** 44379',
    fechaPagoEstimada: 'En revisión (SLA 5 días)',
    resolucion: 'Expediente ingresado formalmente. En análisis de trazabilidad de pesaje en centros de transferencia.'
  }
];

// ==========================================
// MOCK DATA: INSUMOS & MATERIALES
// ==========================================
const INSUMOS_CATALOG = [
  {
    id: 'MAT-01',
    nombre: 'Rollos Térmicos Etiquetas 100x150mm',
    descripcion: 'Caja con 12 rollos (500 etiquetas autoadhesivas c/u) compatibles con Zebra / TSC.',
    formato: 'Caja de 12 rollos',
    cupoMaxMensual: 10,
    unidad: 'Cajas',
    stockDisponible: 50,
    icono: 'Package'
  },
  {
    id: 'MAT-02',
    nombre: 'Bolsas Courier Plásticas 30x40 cm',
    descripcion: 'Pack de 250 bolsas coextruidas con adhesivo hot-melt inviolable y bolsillo porta guía.',
    formato: 'Pack de 250 unidades',
    cupoMaxMensual: 6,
    unidad: 'Packs',
    stockDisponible: 35,
    icono: 'ShieldCheck'
  },
  {
    id: 'MAT-03',
    nombre: 'Bolsas Courier Plásticas 45x60 cm (XL)',
    descripcion: 'Pack de 100 bolsas extra grandes de alta resistencia para bultos voluminosos.',
    formato: 'Pack de 100 unidades',
    cupoMaxMensual: 4,
    unidad: 'Packs',
    stockDisponible: 20,
    icono: 'ShieldCheck'
  },
  {
    id: 'MAT-04',
    nombre: 'Precintos de Seguridad Foliados',
    descripcion: 'Bolsa de 500 precintos plásticos con numeración consecutiva para sellado de valijas.',
    formato: 'Bolsa de 500 precintos',
    cupoMaxMensual: 8,
    unidad: 'Bolsas',
    stockDisponible: 40,
    icono: 'Lock'
  },
  {
    id: 'MAT-05',
    nombre: 'Cinta Embalaje Starken Pro 48mm x 100m',
    descripcion: 'Pack de 6 rollos con adhesivo acrílico reforzado y advertencia de fragilidad.',
    formato: 'Pack de 6 rollos',
    cupoMaxMensual: 12,
    unidad: 'Packs',
    stockDisponible: 60,
    icono: 'Layers'
  }
];

const INITIAL_MATERIAL_ORDERS = [
  {
    id: 'SOL-MAT-2026-104',
    fecha: '02-10-2026',
    items: '4 Cajas Rollos 100x150mm, 2 Packs Bolsas 30x40cm',
    destino: 'CD San Bernardo (Principal)',
    estado: 'Despachado',
    guiaDespacho: 'GD-88412-PLANITACK',
    fechaEntregaEstimada: '07-10-2026'
  },
  {
    id: 'SOL-MAT-2026-089',
    fecha: '18-09-2026',
    items: '2 Bolsas Precintos Foliados, 4 Packs Cinta Embalaje',
    destino: 'Hub Providencia E-Commerce',
    estado: 'Entregado',
    guiaDespacho: 'GD-87102-PLANITACK',
    fechaEntregaEstimada: '21-09-2026'
  }
];

// ==========================================
// MOCK DATA: MANUALES Y DOCUMENTACIÓN
// ==========================================
const MANUALS_LIST = [
  {
    id: 'MAN-01',
    titulo: 'Manual de Usuario Integral StarkenPro v3.2',
    categoria: 'Plataforma & Autoservicio',
    tamano: '3.4 MB',
    formato: 'PDF',
    fecha: 'Septiembre 2026',
    desc: 'Guía completa paso a paso sobre emisión, seguimiento en tiempo real, gestión de excepciones y descarga de comprobantes.'
  },
  {
    id: 'MAN-02',
    titulo: 'Guía Técnica de Integración API REST & Webhooks',
    categoria: 'Desarrollo & TI',
    tamano: '4.8 MB',
    formato: 'PDF',
    fecha: 'Agosto 2026',
    desc: 'Especificación técnica completa con Swagger, autenticación Bearer Token, modelos de datos de cotización, emisión y webhooks.'
  },
  {
    id: 'MAN-03',
    titulo: 'Manual Oficial de Embalaje Seguro & Acreditación de Siniestros',
    categoria: 'Operaciones & Calidad',
    tamano: '2.1 MB',
    formato: 'PDF',
    fecha: 'Julio 2026',
    desc: 'Normativas de embalaje por tipo de mercancía (líquidos, electrónica, textil) y requisitos para la cobertura de indemnizaciones.'
  },
  {
    id: 'MAN-04',
    titulo: 'Protocolo de Excepciones, Retiros y Devoluciones B2B',
    categoria: 'Operaciones & Logística',
    tamano: '1.9 MB',
    formato: 'PDF',
    fecha: 'Agosto 2026',
    desc: 'Tiempos de custodia en sucursal, intentos de entrega a domicilio y flujo de autorización para redestinaciones.'
  },
  {
    id: 'MAN-05',
    titulo: 'Guía de Restricciones y Sustancias Peligrosas (IATA / Terrestre)',
    categoria: 'Legal & Normativa',
    tamano: '2.6 MB',
    formato: 'PDF',
    fecha: 'Junio 2026',
    desc: 'Listado de mercancías restringidas, baterías de litio, aerosoles y documentación obligatoria requerida por ley.'
  }
];

// ==========================================
// MOCK DATA: FAQS
// ==========================================
const FAQ_LIST = [
  {
    q: '¿Cómo reportar una excepción en entrega antes de que el envío sea devuelto?',
    a: 'Puedes autogestionar el envío directamente en el menú "Panel de Control > Mis gestiones", seleccionando la opción "Reintento de entrega", "Redestinar a sucursal" o "Modificar dirección". Dispones de 48 hrs hábiles de custodia antes de la devolución automática.'
  },
  {
    q: '¿Qué plazo tengo para presentar una solicitud de indemnización por siniestro?',
    a: 'El plazo formal según el reglamento de transporte es de 10 días hábiles posteriores a la entrega para siniestros por daño o merma aparente, y hasta 30 días para casos de extravío total sin movimiento.'
  },
  {
    q: '¿Cómo configuro a qué correos llegan las alertas automáticas de clientes ausentes?',
    a: 'En esta misma sección, ve a la pestaña "Ayuda & Autoservicio > Alertas de Excepciones", activa los tipos de alerta deseados e ingresa los correos de tu equipo de postventa.'
  },
  {
    q: '¿Cuál es el tiempo de entrega de los insumos y materiales solicitados?',
    a: 'Las solicitudes de materiales autogestionadas se procesan en un plazo de 24 a 48 horas hábiles mediante los móviles de la red Planitack de Starken, directamente en la dirección o centro de distribución asignado a tu cuenta.'
  }
];

export default function PostventaSoporteView({ selectedAccount, showToast }) {
  const [activeTab, setActiveTab] = useState('tickets'); // 'tickets' | 'indemnizaciones' | 'ayuda'
  
  // ==========================================
  // TICKETS STATE
  // ==========================================
  const [tickets, setTickets] = useState(INITIAL_TICKETS);
  const [ticketSearch, setTicketSearch] = useState('');
  const [ticketAreaFilter, setTicketAreaFilter] = useState('todos');
  const [ticketStatusFilter, setTicketStatusFilter] = useState('todos');
  const [selectedTicketDetail, setSelectedTicketDetail] = useState(null);
  const [replyText, setReplyText] = useState('');
  
  // New Ticket Modal State
  const [newTicketModalOpen, setNewTicketModalOpen] = useState(false);
  const [newTicketForm, setNewTicketForm] = useState({
    of: '',
    asunto: '',
    area: 'Operacional',
    categoria: 'Coordinación Domicilio',
    prioridad: 'Media',
    mensaje: '',
    archivoNombre: ''
  });

  // ==========================================
  // INDEMNIZACIONES STATE
  // ==========================================
  const [indemnizaciones, setIndemnizaciones] = useState(INITIAL_INDEMNIZACIONES);
  const [indemSearch, setIndemSearch] = useState('');
  const [indemStatusFilter, setIndemStatusFilter] = useState('todos');
  const [selectedIndemDetail, setSelectedIndemDetail] = useState(null);

  // New Single Indemnity Modal
  const [singleIndemModalOpen, setSingleIndemModalOpen] = useState(false);
  const [singleIndemStep, setSingleIndemStep] = useState(1);
  const [singleIndemForm, setSingleIndemForm] = useState({
    of: '',
    tipo: 'Siniestro por Daño',
    motivoDetalle: '',
    montoReclamado: '',
    facturaNumero: '',
    facturaAdjunta: null,
    banco: 'Banco Santander',
    tipoCuenta: 'Cuenta Corriente',
    numeroCuenta: '44379-01',
    rutTitular: '96.554.000-8',
    nombreTitular: 'EMPRESA DEMO S.A.'
  });

  // Bulk Indemnity Modal
  const [bulkIndemModalOpen, setBulkIndemModalOpen] = useState(false);
  const [bulkFileName, setBulkFileName] = useState('');
  const [bulkPreviewRows, setBulkPreviewRows] = useState([]);

  // ==========================================
  // AYUDA & AUTOSERVICIO STATE
  // ==========================================
  const [ayudaSubSection, setAyudaSubSection] = useState('materiales'); // 'materiales' | 'notificaciones' | 'manuales' | 'faq'
  const [materialOrders, setMaterialOrders] = useState(INITIAL_MATERIAL_ORDERS);
  const [materialQuantities, setMaterialQuantities] = useState({
    'MAT-01': 2,
    'MAT-02': 1,
    'MAT-03': 0,
    'MAT-04': 1,
    'MAT-05': 2
  });
  const [materialDestination, setMaterialDestination] = useState('CD San Bernardo (Principal)');
  const [faqSearch, setFaqSearch] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);

  // Notification toggles
  const [notificationsConfig, setNotificationsConfig] = useState({
    notifAusente: true,
    notifDireccion: true,
    notifRedestinado: true,
    notifDevolucion: true,
    notifRetraso: true,
    emails: 'postventa@tuempresa.cl, logistica@tuempresa.cl',
    webhookActive: true,
    webhookUrl: 'https://api.tuempresa.cl/v1/starken/webhooks/exceptions'
  });

  // Filtered Tickets
  const filteredTickets = useMemo(() => {
    return tickets.filter(t => {
      const matchSearch = t.id.toLowerCase().includes(ticketSearch.toLowerCase()) ||
                          t.of.toLowerCase().includes(ticketSearch.toLowerCase()) ||
                          t.asunto.toLowerCase().includes(ticketSearch.toLowerCase()) ||
                          t.ejecutivo.nombre.toLowerCase().includes(ticketSearch.toLowerCase());
      const matchArea = ticketAreaFilter === 'todos' || t.area === ticketAreaFilter;
      const matchStatus = ticketStatusFilter === 'todos' || t.estado === ticketStatusFilter;
      return matchSearch && matchArea && matchStatus;
    });
  }, [tickets, ticketSearch, ticketAreaFilter, ticketStatusFilter]);

  // Filtered Indemnizaciones
  const filteredIndemnizaciones = useMemo(() => {
    return indemnizaciones.filter(ind => {
      const matchSearch = ind.id.toLowerCase().includes(indemSearch.toLowerCase()) ||
                          ind.of.toLowerCase().includes(indemSearch.toLowerCase()) ||
                          ind.tipo.toLowerCase().includes(indemSearch.toLowerCase());
      const matchStatus = indemStatusFilter === 'todos' || ind.estado === indemStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [indemnizaciones, indemSearch, indemStatusFilter]);

  // Filtered FAQs
  const filteredFaqs = useMemo(() => {
    return FAQ_LIST.filter(f => 
      f.q.toLowerCase().includes(faqSearch.toLowerCase()) ||
      f.a.toLowerCase().includes(faqSearch.toLowerCase())
    );
  }, [faqSearch]);

  // ==========================================
  // HANDLERS
  // ==========================================
  const handleCreateTicketSubmit = (e) => {
    e.preventDefault();
    if (!newTicketForm.asunto.trim() || !newTicketForm.mensaje.trim()) {
      if (showToast) showToast('Por favor completa el asunto y la descripción del ticket.', 'info');
      return;
    }

    const newId = `TCK-2026-${Math.floor(8820 + Math.random() * 100)}`;
    const now = new Date();
    const dateStr = `${now.getDate().toString().padStart(2, '0')}-${(now.getMonth()+1).toString().padStart(2, '0')}-${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    // Auto assign dedicated executive according to area
    let executive = {
      nombre: 'Camila Morales V.',
      rol: 'Especialista Integraciones TI',
      avatar: 'CM',
      email: 'cmorales@starken.cl',
      telefono: '+56 9 8451 9021'
    };

    if (newTicketForm.area === 'Operacional') {
      executive = {
        nombre: 'Ignacio Fuentes R.',
        rol: 'Ejecutivo Operaciones B2B',
        avatar: 'IF',
        email: 'ifuentes@starken.cl',
        telefono: '+56 9 7320 1198'
      };
    } else if (newTicketForm.area === 'Comercial') {
      executive = {
        nombre: 'Marcela Lagos G.',
        rol: 'Ejecutiva Comercial Cuentas Clave',
        avatar: 'ML',
        email: 'mlagos@starken.cl',
        telefono: '+56 9 9123 4400'
      };
    }

    const createdTicket = {
      id: newId,
      of: newTicketForm.of || 'N/A',
      asunto: newTicketForm.asunto,
      area: newTicketForm.area,
      categoria: newTicketForm.categoria,
      ejecutivo: executive,
      prioridad: newTicketForm.prioridad,
      estado: 'Abierto',
      fechaCreacion: dateStr,
      ultimaActualizacion: 'Recién creado',
      slaRestante: '4.0 hrs restantes',
      slaCumplido: true,
      mensajes: [
        {
          id: 1,
          emisor: 'Cliente (Tú)',
          texto: newTicketForm.mensaje,
          fecha: dateStr,
          tipo: 'cliente',
          adjunto: newTicketForm.archivoNombre || null
        }
      ]
    };

    setTickets(prev => [createdTicket, ...prev]);
    setNewTicketModalOpen(false);
    setNewTicketForm({
      of: '',
      asunto: '',
      area: 'Operacional',
      categoria: 'Coordinación Domicilio',
      prioridad: 'Media',
      mensaje: '',
      archivoNombre: ''
    });

    if (showToast) {
      showToast(`Ticket ${newId} creado con éxito. Asignado formalmente a ${executive.nombre}.`, 'success');
    }
  };

  const handleSendReply = (ticketId) => {
    if (!replyText.trim()) return;

    const now = new Date();
    const dateStr = `${now.getDate().toString().padStart(2, '0')}-${(now.getMonth()+1).toString().padStart(2, '0')}-${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const newMsg = {
      id: Date.now(),
      emisor: 'Cliente (Tú)',
      texto: replyText,
      fecha: dateStr,
      tipo: 'cliente',
      adjunto: null
    };

    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        const updated = {
          ...t,
          estado: 'En gestión',
          ultimaActualizacion: 'Recién actualizado',
          mensajes: [...t.mensajes, newMsg]
        };
        setSelectedTicketDetail(updated);
        return updated;
      }
      return t;
    }));

    setReplyText('');
    if (showToast) showToast('Respuesta enviada y registrada en el historial del ticket.', 'success');
  };

  const handleCreateSingleIndemSubmit = (e) => {
    e.preventDefault();
    if (!singleIndemForm.of.trim() || !singleIndemForm.montoReclamado) {
      if (showToast) showToast('Por favor completa la OF y el monto reclamado.', 'info');
      return;
    }

    const newId = `IND-2026-0${Math.floor(430 + Math.random() * 50)}`;
    const now = new Date();
    const dateStr = `${now.getDate().toString().padStart(2, '0')}-${(now.getMonth()+1).toString().padStart(2, '0')}-${now.getFullYear()}`;

    const newIndem = {
      id: newId,
      of: singleIndemForm.of,
      tipo: singleIndemForm.tipo,
      motivoDetalle: singleIndemForm.motivoDetalle || 'Solicitud ingresada formalmente por portal StarkenPro.',
      fechaSolicitud: dateStr,
      montoReclamado: parseInt(singleIndemForm.montoReclamado, 10) || 0,
      montoAprobado: null,
      estado: 'En evaluación',
      perito: 'Perito Legal de Guardia Starken',
      documentos: [singleIndemForm.facturaAdjunta ? singleIndemForm.facturaAdjunta.name : 'Factura_Comercial.pdf'],
      cuentaBancaria: `${singleIndemForm.banco} — ${singleIndemForm.tipoCuenta} **** ${singleIndemForm.numeroCuenta.slice(-4) || '44379'}`,
      fechaPagoEstimada: 'En revisión (SLA 5 días hábiles)',
      resolucion: 'Expediente recepcionado correctamente. En proceso de peritaje de trazabilidad.'
    };

    setIndemnizaciones(prev => [newIndem, ...prev]);
    setSingleIndemModalOpen(false);
    setSingleIndemStep(1);
    setSingleIndemForm({
      of: '',
      tipo: 'Siniestro por Daño',
      motivoDetalle: '',
      montoReclamado: '',
      facturaNumero: '',
      facturaAdjunta: null,
      banco: 'Banco Santander',
      tipoCuenta: 'Cuenta Corriente',
      numeroCuenta: '44379-01',
      rutTitular: '96.554.000-8',
      nombreTitular: 'EMPRESA DEMO S.A.'
    });

    if (showToast) {
      showToast(`Solicitud ${newId} ingresada con éxito para evaluación formal por peritaje.`, 'success');
    }
  };

  const handleBulkUploadSimulate = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setBulkFileName(file.name);
      setBulkPreviewRows([
        { of: '275161618', tipo: 'Extravío Total', monto: 120000, factura: 'FAC-8812', estado: 'Válido' },
        { of: '275067401', tipo: 'Siniestro por Daño', monto: 78500, factura: 'FAC-8814', estado: 'Válido' },
        { of: '275105257', tipo: 'Merma Parcial', monto: 34000, factura: 'FAC-8819', estado: 'Válido' },
        { of: '274494880', tipo: 'Siniestro por Daño', monto: 195000, factura: 'FAC-8825', estado: 'Válido' }
      ]);
    }
  };

  const handleConfirmBulkIndem = () => {
    if (bulkPreviewRows.length === 0) return;

    const now = new Date();
    const dateStr = `${now.getDate().toString().padStart(2, '0')}-${(now.getMonth()+1).toString().padStart(2, '0')}-${now.getFullYear()}`;

    const newBatch = bulkPreviewRows.map((r, i) => ({
      id: `IND-2026-0${440 + i}`,
      of: r.of,
      tipo: r.tipo,
      motivoDetalle: `Carga Masiva archivo: ${bulkFileName}`,
      fechaSolicitud: dateStr,
      montoReclamado: r.monto,
      montoAprobado: null,
      estado: 'En evaluación',
      perito: 'Peritaje Masivo Seguros Starken',
      documentos: [`${r.factura}.pdf`],
      cuentaBancaria: 'Banco Santander — Cta Cte **** 44379',
      fechaPagoEstimada: 'En revisión (SLA 5 días hábiles)',
      resolucion: 'Carga masiva procesada con éxito. En análisis de expedientes.'
    }));

    setIndemnizaciones(prev => [...newBatch, ...prev]);
    setBulkIndemModalOpen(false);
    setBulkFileName('');
    setBulkPreviewRows([]);

    if (showToast) {
      showToast(`Carga masiva completada: ${newBatch.length} solicitudes de indemnización ingresadas.`, 'success');
    }
  };

  const handleOrderMaterialsSubmit = () => {
    const selectedItems = Object.entries(materialQuantities)
      .filter(([_, qty]) => qty > 0)
      .map(([id, qty]) => {
        const item = INSUMOS_CATALOG.find(c => c.id === id);
        return `${qty} ${item.unidad} ${item.nombre}`;
      });

    if (selectedItems.length === 0) {
      if (showToast) showToast('Selecciona al menos 1 insumo para realizar la solicitud.', 'info');
      return;
    }

    const newId = `SOL-MAT-2026-${Math.floor(105 + Math.random() * 50)}`;
    const now = new Date();
    const dateStr = `${now.getDate().toString().padStart(2, '0')}-${(now.getMonth()+1).toString().padStart(2, '0')}-${now.getFullYear()}`;

    const newOrder = {
      id: newId,
      fecha: dateStr,
      items: selectedItems.join(', '),
      destino: materialDestination,
      estado: 'En preparación',
      guiaDespacho: 'Asignando móvil...',
      fechaEntregaEstimada: 'En 48 hrs hábiles'
    };

    setMaterialOrders(prev => [newOrder, ...prev]);
    
    // Reset quantities
    setMaterialQuantities({
      'MAT-01': 0,
      'MAT-02': 0,
      'MAT-03': 0,
      'MAT-04': 0,
      'MAT-05': 0
    });

    if (showToast) {
      showToast(`Solicitud ${newId} autogestionada con éxito. Se despachará a ${materialDestination}.`, 'success');
    }
  };

  const handleSaveNotificationConfig = () => {
    if (showToast) {
      showToast('Configuración de alertas automáticas guardada y sincronizada.', 'success');
    }
  };

  const handleDownloadManual = (manualTitle) => {
    if (showToast) {
      showToast(`Descargando documento oficial "${manualTitle}"...`, 'info');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* ========================================================= */}
      {/* HERO BANNER CON DEGRADADO Y FORMAS CIRCULARES            */}
      {/* ========================================================= */}
      <div className="bg-gradient-to-r from-[#1e4f5e] via-[#33798C] to-[#266373] rounded-2xl p-6 sm:p-7 text-white shadow-md relative overflow-hidden">
        {/* Subtle decorative circular shapes matching all other views */}
        <div className="absolute -right-16 -bottom-16 w-72 h-72 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute right-36 -top-16 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full border border-white/10 pointer-events-none" />
        <div className="absolute right-72 -bottom-20 w-40 h-40 rounded-full bg-white/[0.03] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-black font-din tracking-wide text-white">
              Postventa, soporte y ayuda
            </h2>
            <p className="text-xs sm:text-sm text-slate-100/90 font-sans font-medium leading-relaxed">
              Canal único y centralizado para gestión de tickets con ejecutivos Starken dedicados, trazabilidad de indemnizaciones y autoatención de insumos y alertas.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto shrink-0">
            {activeTab === 'tickets' ? (
              <button
                onClick={() => setNewTicketModalOpen(true)}
                className="px-4 py-2.5 bg-white text-[#1e4f5e] hover:bg-slate-50 active:bg-slate-100 rounded-xl text-xs font-bold font-din shadow-sm flex items-center gap-2 transition-all cursor-pointer"
              >
                <Plus size={15} />
                <span>Nuevo ticket de soporte</span>
              </button>
            ) : activeTab === 'indemnizaciones' ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSingleIndemModalOpen(true)}
                  className="px-4 py-2.5 bg-white text-[#1e4f5e] hover:bg-slate-50 active:bg-slate-100 rounded-xl text-xs font-bold font-din shadow-sm flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Plus size={15} />
                  <span>Nueva solicitud unitaria</span>
                </button>
                <button
                  onClick={() => setBulkIndemModalOpen(true)}
                  className="px-3.5 py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-bold font-din border border-white/30 backdrop-blur-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <UploadCloud size={14} />
                  <span>Carga masiva</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setAyudaSubSection('materiales')}
                className="px-4 py-2.5 bg-white text-[#1e4f5e] hover:bg-slate-50 active:bg-slate-100 rounded-xl text-xs font-bold font-din shadow-sm flex items-center gap-2 transition-all cursor-pointer"
              >
                <Package size={15} />
                <span>Solicitar materiales express</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SUB-TABS PRINCIPALES HOMOLOGADAS                         */}
      {/* ========================================================= */}
      <div className="bg-white rounded-xl border border-starken-border p-1.5 shadow-xs flex flex-wrap gap-1.5 font-din">
        <button
          onClick={() => setActiveTab('tickets')}
          className={`flex-1 min-w-[200px] py-2.5 px-4 rounded-lg text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
            activeTab === 'tickets'
              ? 'bg-[#33798C] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
          }`}
        >
          <Headphones size={15} />
          <span>Tickets de soporte & incidencias</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
            activeTab === 'tickets' ? 'bg-white/25 text-white' : 'bg-slate-200 text-slate-700'
          }`}>
            {tickets.filter(t => t.estado !== 'Cerrado').length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('indemnizaciones')}
          className={`flex-1 min-w-[200px] py-2.5 px-4 rounded-lg text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
            activeTab === 'indemnizaciones'
              ? 'bg-[#33798C] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
          }`}
        >
          <ShieldCheck size={15} />
          <span>Indemnizaciones & reclamos</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
            activeTab === 'indemnizaciones' ? 'bg-white/25 text-white' : 'bg-slate-200 text-slate-700'
          }`}>
            {indemnizaciones.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('ayuda')}
          className={`flex-1 min-w-[200px] py-2.5 px-4 rounded-lg text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
            activeTab === 'ayuda'
              ? 'bg-[#33798C] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
          }`}
        >
          <HelpCircle size={15} />
          <span>Ayuda, materiales & notificaciones</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* PESTAÑA 1: TICKETS DE SOPORTE & INCIDENCIAS              */}
      {/* ========================================================= */}
      {activeTab === 'tickets' && (
        <div className="space-y-6">
          
          {/* KPI Cards homologadas en bg-slate-50 sin hover */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex items-center justify-between">
              <div>
                <div className="text-[11px] font-bold text-slate-400 font-din">Tickets activos</div>
                <div className="text-2xl font-black font-din text-slate-900 mt-0.5">
                  {tickets.filter(t => t.estado !== 'Cerrado').length}
                </div>
                <div className="text-[11px] text-[#33798C] font-bold font-sans">Canal formal único</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#ECF5F7] text-[#33798C] flex items-center justify-center shrink-0">
                <Headphones size={18} />
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex items-center justify-between">
              <div>
                <div className="text-[11px] font-bold text-slate-400 font-din">Tiempo promedio resolución</div>
                <div className="text-2xl font-black font-din text-emerald-600 mt-0.5">3.8 hrs</div>
                <div className="text-[11px] text-emerald-600 font-bold font-sans">98.2% dentro de SLA</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Clock size={18} />
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex items-center justify-between">
              <div>
                <div className="text-[11px] font-bold text-slate-400 font-din">Trazabilidad por ejecutivo</div>
                <div className="text-2xl font-black font-din text-slate-900 mt-0.5">100%</div>
                <div className="text-[11px] text-slate-500 font-medium font-sans">Ejecutivo asignado</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <UserCheck size={18} />
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex items-center justify-between">
              <div>
                <div className="text-[11px] font-bold text-slate-400 font-din">Digitalización postventa</div>
                <div className="text-2xl font-black font-din text-[#33798C] mt-0.5">94.5%</div>
                <div className="text-[11px] text-slate-500 font-medium font-sans">vs canales informales</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#ECF5F7] text-[#33798C] flex items-center justify-center shrink-0">
                <Zap size={18} />
              </div>
            </div>
          </div>

          {/* Tabla de Tickets & Filtros */}
          <div className="bg-white rounded-xl border border-starken-border p-5 sm:p-6 space-y-5 shadow-xs">
            
            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Buscar por ID ticket, OF, asunto o ejecutivo..."
                  value={ticketSearch}
                  onChange={(e) => setTicketSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#33798C] focus:bg-white transition-all font-sans"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {/* Area filter */}
                <div className="flex items-center space-x-1.5 text-xs font-din font-bold">
                  <span className="text-slate-400">Área:</span>
                  <select
                    value={ticketAreaFilter}
                    onChange={(e) => setTicketAreaFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 outline-none focus:border-[#33798C] cursor-pointer font-sans"
                  >
                    <option value="todos">Todas las áreas</option>
                    <option value="TI & Integraciones">TI & Integraciones</option>
                    <option value="Operacional">Operacional</option>
                    <option value="Comercial">Comercial</option>
                    <option value="Desarrollo APIs">Desarrollo APIs</option>
                  </select>
                </div>

                {/* Status filter pills */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80 font-sans text-xs font-bold">
                  {['todos', 'Abierto', 'En gestión', 'Resuelto', 'Cerrado'].map(status => (
                    <button
                      key={status}
                      onClick={() => setTicketStatusFilter(status)}
                      className={`px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                        ticketStatusFilter === status
                          ? 'bg-[#33798C] text-white shadow-xs font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {status === 'todos' ? 'Todos' : status}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-starken-border">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-starken-border font-din text-[11px] text-slate-500 font-bold">
                    <th className="p-3.5 pl-4">Ticket ID</th>
                    <th className="p-3.5">OF vinculada</th>
                    <th className="p-3.5">Asunto & categoría</th>
                    <th className="p-3.5">Área</th>
                    <th className="p-3.5">Ejecutivo asignado</th>
                    <th className="p-3.5 text-center">Prioridad</th>
                    <th className="p-3.5 text-center">Estado</th>
                    <th className="p-3.5 text-right pr-4">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-starken-border/60 font-sans">
                  {filteredTickets.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="p-8 text-center text-slate-400 font-medium">
                        No se encontraron tickets con los filtros seleccionados.
                      </td>
                    </tr>
                  ) : (
                    filteredTickets.map(t => (
                      <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-3.5 pl-4 font-din font-bold text-slate-900">
                          {t.id}
                          <div className="text-[10px] text-slate-400 font-sans font-normal">{t.fechaCreacion}</div>
                        </td>
                        <td className="p-3.5">
                          {t.of !== 'N/A' ? (
                            <span className="font-din font-bold text-[#33798C] bg-[#ECF5F7] px-2 py-0.5 rounded-md">
                              OF {t.of}
                            </span>
                          ) : (
                            <span className="text-slate-400 italic">Sin OF</span>
                          )}
                        </td>
                        <td className="p-3.5 max-w-xs">
                          <div className="font-bold text-slate-800 truncate" title={t.asunto}>{t.asunto}</div>
                          <div className="text-[11px] text-slate-500 truncate">{t.categoria}</div>
                        </td>
                        <td className="p-3.5">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold font-sans bg-slate-100 text-slate-700">
                            {t.area}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 rounded-full bg-[#ECF5F7] text-[#33798C] font-din font-black text-[10px] flex items-center justify-center shrink-0">
                              {t.ejecutivo.avatar}
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-slate-800 text-[11px] truncate">{t.ejecutivo.nombre}</div>
                              <div className="text-[10px] text-slate-400 truncate">{t.ejecutivo.rol}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3.5 text-center whitespace-nowrap">
                          <span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold font-sans whitespace-nowrap ${
                            t.prioridad === 'Alta' 
                              ? 'bg-red-50 text-red-600 border border-red-200/60' 
                              : t.prioridad === 'Media'
                              ? 'bg-amber-50 text-amber-600 border border-amber-200/60'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {t.prioridad}
                          </span>
                        </td>
                        <td className="p-3.5 text-center whitespace-nowrap">
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-bold font-sans whitespace-nowrap ${
                            t.estado === 'Abierto'
                              ? 'bg-blue-50 text-blue-700'
                              : t.estado === 'En gestión'
                              ? 'bg-amber-50 text-amber-700'
                              : t.estado === 'Resuelto'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {t.estado}
                          </span>
                        </td>
                        <td className="p-3.5 text-right pr-4">
                          <button
                            onClick={() => setSelectedTicketDetail(t)}
                            className="px-3 py-1.5 bg-[#ECF5F7] hover:bg-[#33798C] text-[#33798C] hover:text-white rounded-lg text-xs font-bold font-din transition-colors cursor-pointer"
                          >
                            Ver detalle
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* PESTAÑA 2: INDEMNIZACIONES & RECLAMOS                     */}
      {/* ========================================================= */}
      {activeTab === 'indemnizaciones' && (
        <div className="space-y-6">
          
          {/* KPI Cards homologadas en bg-slate-50 sin hover */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex items-center justify-between">
              <div>
                <div className="text-[11px] font-bold text-slate-400 font-din">Indemnizaciones en gestión</div>
                <div className="text-2xl font-black font-din text-slate-900 mt-0.5">
                  {indemnizaciones.filter(i => i.estado === 'En evaluación' || i.estado === 'En liquidación').length}
                </div>
                <div className="text-[11px] text-amber-600 font-bold font-sans">En proceso pericial</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Clock size={18} />
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex items-center justify-between">
              <div>
                <div className="text-[11px] font-bold text-slate-400 font-din">Monto total aprobado</div>
                <div className="text-2xl font-black font-din text-emerald-600 mt-0.5">
                  ${indemnizaciones.reduce((acc, i) => acc + (i.montoAprobado || 0), 0).toLocaleString('es-CL')}
                </div>
                <div className="text-[11px] text-emerald-600 font-bold font-sans">Liquidado a cuenta</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <DollarSign size={18} />
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex items-center justify-between">
              <div>
                <div className="text-[11px] font-bold text-slate-400 font-din">SLA promedio dictamen</div>
                <div className="text-2xl font-black font-din text-slate-900 mt-0.5">4.2 días</div>
                <div className="text-[11px] text-[#33798C] font-bold font-sans">Meta: &lt; 5 días hábiles</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#ECF5F7] text-[#33798C] flex items-center justify-center shrink-0">
                <ShieldCheck size={18} />
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex items-center justify-between">
              <div>
                <div className="text-[11px] font-bold text-slate-400 font-din">Tasa de aprobación</div>
                <div className="text-2xl font-black font-din text-[#33798C] mt-0.5">96.8%</div>
                <div className="text-[11px] text-slate-500 font-medium font-sans">Con respaldo comercial</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#ECF5F7] text-[#33798C] flex items-center justify-center shrink-0">
                <CheckCircle2 size={18} />
              </div>
            </div>
          </div>

          {/* Tabla de Indemnizaciones */}
          <div className="bg-white rounded-xl border border-starken-border p-5 sm:p-6 space-y-5 shadow-xs">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Buscar por ID indemnización, OF o tipo de siniestro..."
                  value={indemSearch}
                  onChange={(e) => setIndemSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#33798C] focus:bg-white transition-all font-sans"
                />
              </div>

              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80 font-sans text-xs font-bold">
                {['todos', 'En evaluación', 'Aprobado para pago', 'En liquidación', 'Rechazado'].map(status => (
                  <button
                    key={status}
                    onClick={() => setIndemStatusFilter(status)}
                    className={`px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                      indemStatusFilter === status
                        ? 'bg-[#33798C] text-white shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {status === 'todos' ? 'Todos' : status}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-starken-border">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-starken-border font-din text-[11px] text-slate-500 font-bold">
                    <th className="p-3.5 pl-4">ID reclamo</th>
                    <th className="p-3.5">OF afectada</th>
                    <th className="p-3.5">Tipo siniestro & motivo</th>
                    <th className="p-3.5">Fecha solicitud</th>
                    <th className="p-3.5">Monto reclamado</th>
                    <th className="p-3.5">Perito asignado</th>
                    <th className="p-3.5 text-center">Estado</th>
                    <th className="p-3.5 text-right pr-4">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-starken-border/60 font-sans">
                  {filteredIndemnizaciones.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="p-8 text-center text-slate-400 font-medium">
                        No se encontraron solicitudes de indemnización.
                      </td>
                    </tr>
                  ) : (
                    filteredIndemnizaciones.map(ind => (
                      <tr key={ind.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-3.5 pl-4 font-din font-bold text-slate-900">{ind.id}</td>
                        <td className="p-3.5">
                          <span className="font-din font-bold text-[#33798C] bg-[#ECF5F7] px-2 py-0.5 rounded-md">
                            OF {ind.of}
                          </span>
                        </td>
                        <td className="p-3.5 max-w-xs">
                          <div className="font-bold text-slate-800">{ind.tipo}</div>
                          <div className="text-[11px] text-slate-500 truncate">{ind.motivoDetalle}</div>
                        </td>
                        <td className="p-3.5 text-slate-600 font-medium">{ind.fechaSolicitud}</td>
                        <td className="p-3.5 font-din font-bold text-slate-900">
                          ${ind.montoReclamado.toLocaleString('es-CL')} CLP
                          {ind.montoAprobado && (
                            <div className="text-[10px] text-emerald-600 font-sans">
                              Aprobado: ${ind.montoAprobado.toLocaleString('es-CL')}
                            </div>
                          )}
                        </td>
                        <td className="p-3.5 text-slate-600 font-medium text-[11px]">{ind.perito}</td>
                        <td className="p-3.5 text-center whitespace-nowrap">
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-bold font-sans whitespace-nowrap ${
                            ind.estado === 'Aprobado para pago'
                              ? 'bg-emerald-50 text-emerald-700'
                              : ind.estado === 'En liquidación'
                              ? 'bg-blue-50 text-blue-700'
                              : ind.estado === 'En evaluación'
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-red-50 text-red-600'
                          }`}>
                            {ind.estado}
                          </span>
                        </td>
                        <td className="p-3.5 text-right pr-4">
                          <button
                            onClick={() => setSelectedIndemDetail(ind)}
                            className="px-3 py-1.5 bg-[#ECF5F7] hover:bg-[#33798C] text-[#33798C] hover:text-white rounded-lg text-xs font-bold font-din transition-colors cursor-pointer"
                          >
                            Ver expediente
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* PESTAÑA 3: AYUDA, MATERIALES & NOTIFICACIONES             */}
      {/* ========================================================= */}
      {activeTab === 'ayuda' && (
        <div className="space-y-6">
          
          {/* Inner Sub-navigation Pills */}
          <div className="flex flex-wrap items-center gap-2 border-b border-starken-border pb-3">
            <button
              onClick={() => setAyudaSubSection('materiales')}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-din flex items-center gap-2 transition-all cursor-pointer ${
                ayudaSubSection === 'materiales'
                  ? 'bg-[#33798C] text-white shadow-xs'
                  : 'bg-white border border-starken-border text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Package size={14} />
              <span>Solicitud de materiales express</span>
            </button>

            <button
              onClick={() => setAyudaSubSection('notificaciones')}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-din flex items-center gap-2 transition-all cursor-pointer ${
                ayudaSubSection === 'notificaciones'
                  ? 'bg-[#33798C] text-white shadow-xs'
                  : 'bg-white border border-starken-border text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Bell size={14} />
              <span>Alertas automáticas de excepciones</span>
            </button>

            <button
              onClick={() => setAyudaSubSection('manuales')}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-din flex items-center gap-2 transition-all cursor-pointer ${
                ayudaSubSection === 'manuales'
                  ? 'bg-[#33798C] text-white shadow-xs'
                  : 'bg-white border border-starken-border text-slate-700 hover:bg-slate-50'
              }`}
            >
              <BookOpen size={14} />
              <span>Biblioteca de manuales & APIs</span>
            </button>

            <button
              onClick={() => setAyudaSubSection('faq')}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-din flex items-center gap-2 transition-all cursor-pointer ${
                ayudaSubSection === 'faq'
                  ? 'bg-[#33798C] text-white shadow-xs'
                  : 'bg-white border border-starken-border text-slate-700 hover:bg-slate-50'
              }`}
            >
              <HelpCircle size={14} />
              <span>Preguntas frecuentes (FAQ)</span>
            </button>
          </div>

          {/* 3.1: SOLICITUD DE MATERIALES */}
          {ayudaSubSection === 'materiales' && (
            <div className="space-y-6">
              
              {/* Header Info */}
              <div className="bg-white rounded-xl border border-starken-border p-5 sm:p-6 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-starken-border">
                  <div>
                    <h3 className="font-bold text-base text-slate-850 font-din flex items-center gap-2">
                      <Package size={18} className="text-[#33798C]" />
                      <span>Catálogo de insumos & materiales operativos</span>
                    </h3>
                    <p className="text-xs text-slate-500 font-sans mt-0.5">
                      Autoatención de insumos con despacho directo mediante móviles Planitack de Starken. Sin tickets manuales.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-sans font-bold">Dirección de entrega:</span>
                    <select
                      value={materialDestination}
                      onChange={(e) => setMaterialDestination(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 font-bold outline-none focus:border-[#33798C] cursor-pointer"
                    >
                      <option value="CD San Bernardo (Principal)">CD San Bernardo (Principal)</option>
                      <option value="Hub Providencia E-Commerce">Hub Providencia E-Commerce</option>
                      <option value="Sucursal Concepción Mayorista">Sucursal Concepción Mayorista</option>
                    </select>
                  </div>
                </div>

                {/* Grid of Materials */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {INSUMOS_CATALOG.map(item => (
                    <div key={item.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between space-y-3">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold font-sans text-[#33798C] bg-[#ECF5F7] px-2 py-0.5 rounded">
                            {item.id}
                          </span>
                          <span className="text-[11px] font-bold text-slate-500 font-din">
                            Cupo: máx {item.cupoMaxMensual} {item.unidad}/mes
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm">{item.nombre}</h4>
                        <p className="text-xs text-slate-500 leading-relaxed font-sans">{item.descripcion}</p>
                      </div>

                      <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700 font-din">Cantidad:</span>
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => setMaterialQuantities(prev => ({
                              ...prev,
                              [item.id]: Math.max(0, (prev[item.id] || 0) - 1)
                            }))}
                            className="w-7 h-7 rounded-lg bg-white border border-slate-300 text-slate-700 font-bold flex items-center justify-center hover:bg-slate-100 cursor-pointer"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-black font-din text-sm text-slate-900">
                            {materialQuantities[item.id] || 0}
                          </span>
                          <button
                            type="button"
                            onClick={() => setMaterialQuantities(prev => ({
                              ...prev,
                              [item.id]: Math.min(item.cupoMaxMensual, (prev[item.id] || 0) + 1)
                            }))}
                            className="w-7 h-7 rounded-lg bg-[#33798C] text-white font-bold flex items-center justify-center hover:bg-[#1e4f5e] cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Submit button */}
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleOrderMaterialsSubmit}
                    className="px-5 py-2.5 bg-[#33798C] hover:bg-[#1e4f5e] text-white rounded-xl text-xs font-bold font-din shadow-sm flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Send size={14} />
                    <span>Confirmar solicitud express de insumos</span>
                  </button>
                </div>
              </div>

              {/* History Table */}
              <div className="bg-white rounded-xl border border-starken-border p-5 sm:p-6 shadow-xs space-y-4">
                <h4 className="font-bold text-sm text-slate-850 font-din">
                  Historial de solicitudes autogestionadas
                </h4>

                <div className="overflow-x-auto rounded-xl border border-starken-border">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-starken-border font-din text-[11px] text-slate-500 font-bold">
                        <th className="p-3.5 pl-4">ID solicitud</th>
                        <th className="p-3.5">Fecha</th>
                        <th className="p-3.5">Insumos solicitados</th>
                        <th className="p-3.5">Destino</th>
                        <th className="p-3.5">Guía / móvil</th>
                        <th className="p-3.5 text-center">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-starken-border/60 font-sans">
                      {materialOrders.map(mo => (
                        <tr key={mo.id} className="hover:bg-slate-50/50">
                          <td className="p-3.5 pl-4 font-din font-bold text-slate-900">{mo.id}</td>
                          <td className="p-3.5 text-slate-600">{mo.fecha}</td>
                          <td className="p-3.5 font-bold text-slate-800">{mo.items}</td>
                          <td className="p-3.5 text-slate-600">{mo.destino}</td>
                          <td className="p-3.5 font-din text-[#33798C] font-bold">{mo.guiaDespacho}</td>
                          <td className="p-3.5 text-center whitespace-nowrap">
                            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-bold font-din whitespace-nowrap ${
                              mo.estado === 'Entregado'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-blue-50 text-blue-700'
                            }`}>
                              {mo.estado}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 3.2: NOTIFICACIONES AUTOMÁTICAS */}
          {ayudaSubSection === 'notificaciones' && (
            <div className="bg-white rounded-xl border border-starken-border p-5 sm:p-6 shadow-xs space-y-6 max-w-4xl">
              <div>
                <h3 className="font-black text-base text-slate-850 font-din tracking-wide flex items-center gap-2">
                  <Bell size={18} className="text-[#33798C]" />
                  <span>Configuración de alertas proactivas por correo & webhooks</span>
                </h3>
                <p className="text-xs text-slate-500 font-sans mt-0.5">
                  Recibe notificaciones inmediatas cuando ocurra una excepción operativa o una entrega no concretada.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                {/* Event Toggles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <label className="flex items-start space-x-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100/60 transition-colors">
                    <input
                      type="checkbox"
                      checked={notificationsConfig.notifAusente}
                      onChange={(e) => setNotificationsConfig(prev => ({ ...prev, notifAusente: e.target.checked }))}
                      className="mt-0.5 w-4 h-4 text-[#33798C] rounded border-slate-300 focus:ring-[#33798C]"
                    />
                    <div>
                      <div className="font-bold text-xs text-slate-850">Destinatario ausente (1er y 2do intento)</div>
                      <div className="text-[11px] text-slate-500">Notificar de inmediato para coordinar reintento con el cliente.</div>
                    </div>
                  </label>

                  <label className="flex items-start space-x-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100/60 transition-colors">
                    <input
                      type="checkbox"
                      checked={notificationsConfig.notifDireccion}
                      onChange={(e) => setNotificationsConfig(prev => ({ ...prev, notifDireccion: e.target.checked }))}
                      className="mt-0.5 w-4 h-4 text-[#33798C] rounded border-slate-300 focus:ring-[#33798C]"
                    />
                    <div>
                      <div className="font-bold text-xs text-slate-850">Dirección incorrecta / incompleta</div>
                      <div className="text-[11px] text-slate-500">Alerta cuando el repartidor reporte inconsistencia en la dirección.</div>
                    </div>
                  </label>

                  <label className="flex items-start space-x-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100/60 transition-colors">
                    <input
                      type="checkbox"
                      checked={notificationsConfig.notifRedestinado}
                      onChange={(e) => setNotificationsConfig(prev => ({ ...prev, notifRedestinado: e.target.checked }))}
                      className="mt-0.5 w-4 h-4 text-[#33798C] rounded border-slate-300 focus:ring-[#33798C]"
                    />
                    <div>
                      <div className="font-bold text-xs text-slate-850">Envío redestinado a sucursal</div>
                      <div className="text-[11px] text-slate-500">Aviso cuando el paquete esté disponible para retiro en sucursal Starken.</div>
                    </div>
                  </label>

                  <label className="flex items-start space-x-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100/60 transition-colors">
                    <input
                      type="checkbox"
                      checked={notificationsConfig.notifDevolucion}
                      onChange={(e) => setNotificationsConfig(prev => ({ ...prev, notifDevolucion: e.target.checked }))}
                      className="mt-0.5 w-4 h-4 text-[#33798C] rounded border-slate-300 focus:ring-[#33798C]"
                    />
                    <div>
                      <div className="font-bold text-xs text-slate-850">Inicio de proceso de devolución</div>
                      <div className="text-[11px] text-slate-500">Alerta cuando expire el plazo de custodia y comience el retorno al origen.</div>
                    </div>
                  </label>
                </div>

                {/* Email Recipients */}
                <div className="space-y-1.5 pt-2">
                  <label className="block text-xs font-bold text-slate-700 font-din">
                    Correos electrónicos receptores (separados por coma):
                  </label>
                  <input
                    type="text"
                    value={notificationsConfig.emails}
                    onChange={(e) => setNotificationsConfig(prev => ({ ...prev, emails: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 outline-none focus:border-[#33798C] font-sans"
                  />
                </div>

                {/* Webhook Endpoint */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 font-din">
                      Webhook URL para ERP / Plataforma e-commerce:
                    </label>
                    <span className="text-[10px] text-emerald-600 font-bold font-din flex items-center gap-1">
                      <CheckCircle2 size={12} /> Activo (HTTP 200 OK)
                    </span>
                  </div>
                  <input
                    type="text"
                    value={notificationsConfig.webhookUrl}
                    onChange={(e) => setNotificationsConfig(prev => ({ ...prev, webhookUrl: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 font-mono outline-none focus:border-[#33798C]"
                  />
                </div>

                <div className="pt-3">
                  <button
                    onClick={handleSaveNotificationConfig}
                    className="px-5 py-2.5 bg-[#33798C] hover:bg-[#1e4f5e] text-white rounded-xl text-xs font-bold font-din tracking-wider shadow-sm flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Check size={14} />
                    <span>Guardar configuración de alertas</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 3.3: BIBLIOTECA DE MANUALES */}
          {ayudaSubSection === 'manuales' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MANUALS_LIST.map(man => (
                  <div key={man.id} className="bg-white rounded-xl border border-starken-border p-5 shadow-xs flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold font-din bg-[#ECF5F7] text-[#33798C] px-2 py-0.5 rounded">
                          {man.categoria}
                        </span>
                        <span className="text-[11px] text-slate-400 font-din font-bold">{man.tamano} • {man.formato}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">{man.titulo}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed font-sans">{man.desc}</p>
                    </div>

                    <div className="pt-3 border-t border-starken-border flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 font-sans">Actualizado: {man.fecha}</span>
                      <button
                        onClick={() => handleDownloadManual(man.titulo)}
                        className="px-3.5 py-1.5 bg-slate-100 hover:bg-[#33798C] text-slate-700 hover:text-white rounded-lg text-xs font-bold font-din flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Download size={13} />
                        <span>Descargar guía</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3.4: PREGUNTAS FRECUENTES (FAQ) */}
          {ayudaSubSection === 'faq' && (
            <div className="bg-white rounded-xl border border-starken-border p-5 sm:p-6 shadow-xs space-y-5 max-w-3xl">
              <div className="space-y-1">
                <h3 className="font-black text-base text-slate-850 font-din tracking-wide">
                  Preguntas frecuentes de postventa & soporte
                </h3>
                <p className="text-xs text-slate-500 font-sans">
                  Respuestas rápidas a las consultas operativas más comunes de clientes empresa.
                </p>
              </div>

              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Buscar en preguntas frecuentes..."
                  value={faqSearch}
                  onChange={(e) => setFaqSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#33798C] focus:bg-white transition-all font-sans"
                />
              </div>

              <div className="space-y-2.5 pt-2">
                {filteredFaqs.map((faq, idx) => (
                  <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
                    <button
                      type="button"
                      onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                      className="w-full p-4 text-left font-bold text-xs text-slate-850 flex items-center justify-between gap-3 hover:bg-slate-100/60 transition-colors cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      {expandedFaq === idx ? <ChevronDown size={15} className="shrink-0 text-[#33798C]" /> : <ChevronRight size={15} className="shrink-0 text-slate-400" />}
                    </button>
                    {expandedFaq === idx && (
                      <div className="p-4 pt-1 text-xs text-slate-600 font-sans leading-relaxed border-t border-slate-200/60 bg-white">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: NUEVO TICKET DE SOPORTE                           */}
      {/* ========================================================= */}
      {newTicketModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-starken-border shadow-2xl w-full max-w-xl overflow-hidden my-8">
            {/* Header */}
            <div className="px-5 sm:px-6 pt-5 sm:pt-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-[#ECF5F7] text-[#33798C] flex items-center justify-center shrink-0">
                    <Headphones size={20} />
                  </div>
                  <div>
                    <h3 className="font-black text-base text-slate-850 font-din tracking-wide">
                      Crear nuevo ticket de soporte
                    </h3>
                    <p className="text-xs text-slate-500 font-sans">
                      Ingresa el requerimiento formal. Se asignará automáticamente a tu ejecutivo de cuenta.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setNewTicketModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <form onSubmit={handleCreateTicketSubmit} className="px-5 sm:px-6 pt-4 pb-5 sm:pb-6 space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700 font-din">Área receptora:</label>
                  <select
                    value={newTicketForm.area}
                    onChange={(e) => setNewTicketForm(prev => ({ ...prev, area: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 outline-none focus:border-[#33798C] font-bold"
                  >
                    <option value="Operacional">Operacional (Coordinación y envíos)</option>
                    <option value="TI & Integraciones">TI & integraciones (Webhooks / APIs)</option>
                    <option value="Comercial">Comercial (Tarifas / facturación)</option>
                    <option value="Desarrollo APIs">Desarrollo APIs (Plugins / tokens)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-slate-700 font-din">Prioridad:</label>
                  <select
                    value={newTicketForm.prioridad}
                    onChange={(e) => setNewTicketForm(prev => ({ ...prev, prioridad: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 outline-none focus:border-[#33798C] font-bold"
                  >
                    <option value="Baja">Baja (Consultas generales)</option>
                    <option value="Media">Media (Atrasos o modificaciones)</option>
                    <option value="Alta">Alta (Incidencias críticas / bloqueos)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700 font-din">OF vinculada (opcional):</label>
                  <input
                    type="text"
                    placeholder="Ej. 275161618"
                    value={newTicketForm.of}
                    onChange={(e) => setNewTicketForm(prev => ({ ...prev, of: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 outline-none focus:border-[#33798C] font-din font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-slate-700 font-din">Categoría:</label>
                  <input
                    type="text"
                    placeholder="Ej. Error en webhook, reintento entrega..."
                    value={newTicketForm.categoria}
                    onChange={(e) => setNewTicketForm(prev => ({ ...prev, categoria: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 outline-none focus:border-[#33798C]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-700 font-din">Asunto del ticket:</label>
                <input
                  type="text"
                  placeholder="Resumen claro del problema o solicitud..."
                  value={newTicketForm.asunto}
                  onChange={(e) => setNewTicketForm(prev => ({ ...prev, asunto: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 font-bold outline-none focus:border-[#33798C]"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-700 font-din">Detalle / descripción:</label>
                <textarea
                  rows="4"
                  placeholder="Describe la incidencia con el mayor detalle posible..."
                  value={newTicketForm.mensaje}
                  onChange={(e) => setNewTicketForm(prev => ({ ...prev, mensaje: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 outline-none focus:border-[#33798C] resize-none"
                />
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Paperclip size={15} className="text-slate-400" />
                  <span className="text-xs text-slate-600 font-medium">
                    {newTicketForm.archivoNombre || 'Adjuntar archivo o captura (opcional)'}
                  </span>
                </div>
                <label className="px-3 py-1 bg-white border border-slate-300 rounded-lg text-xs font-bold font-din text-slate-700 hover:bg-slate-100 cursor-pointer">
                  Examinar
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setNewTicketForm(prev => ({ ...prev, archivoNombre: e.target.files[0].name }));
                      }
                    }}
                  />
                </label>
              </div>

              <div className="pt-3 border-t border-starken-border flex items-center justify-between gap-3 w-full">
                <button
                  type="button"
                  onClick={() => setNewTicketModalOpen(false)}
                  className="btn btn-outline flex-1 cursor-pointer font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary flex-1 cursor-pointer font-bold space-x-1.5"
                >
                  <Send size={14} />
                  <span>Crear ticket</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL / DRAWER: DETALLE DEL TICKET                       */}
      {/* ========================================================= */}
      {selectedTicketDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-starken-border shadow-2xl w-full max-w-2xl overflow-hidden my-8 flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="px-5 sm:px-6 pt-5 sm:pt-6 shrink-0">
              <div className="flex items-start justify-between pb-4 border-b border-slate-200">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-din font-black text-sm text-[#33798C] bg-[#ECF5F7] px-2.5 py-0.5 rounded-md">
                      {selectedTicketDetail.id}
                    </span>
                    <span className="text-xs font-bold text-slate-500 font-din">
                      Área: {selectedTicketDetail.area}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-sans">
                      {selectedTicketDetail.slaRestante}
                    </span>
                  </div>
                  <h3 className="font-black text-base text-slate-850 font-din">
                    {selectedTicketDetail.asunto}
                  </h3>
                </div>

                <button
                  onClick={() => setSelectedTicketDetail(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Executive info bar */}
            <div className="px-6 py-3 bg-slate-100/70 border-b border-slate-200/80 flex items-center justify-between text-xs shrink-0 font-sans">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-[#33798C] text-white font-black font-din text-xs flex items-center justify-center">
                  {selectedTicketDetail.ejecutivo.avatar}
                </div>
                <div>
                  <div className="font-bold text-slate-900">{selectedTicketDetail.ejecutivo.nombre}</div>
                  <div className="text-[11px] text-slate-500">{selectedTicketDetail.ejecutivo.rol} • {selectedTicketDetail.ejecutivo.email}</div>
                </div>
              </div>
              <span className="font-bold text-slate-600 font-din text-[11px]">
                {selectedTicketDetail.ejecutivo.telefono}
              </span>
            </div>

            {/* Messages Thread */}
            <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1 font-sans text-xs bg-slate-50/30">
              {selectedTicketDetail.mensajes.map(m => (
                <div 
                  key={m.id}
                  className={`p-4 rounded-xl border max-w-[85%] space-y-2 ${
                    m.tipo === 'cliente'
                      ? 'ml-auto bg-[#ECF5F7]/80 border-[#C2DFE7] text-slate-900'
                      : 'mr-auto bg-white border-slate-200 text-slate-850 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 border-b border-slate-200/50 pb-1.5 text-[11px]">
                    <span className="font-bold font-din text-[#33798C]">{m.emisor}</span>
                    <span className="text-slate-400 font-sans">{m.fecha}</span>
                  </div>
                  <p className="leading-relaxed whitespace-pre-wrap">{m.texto}</p>
                  {m.adjunto && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-[11px] font-bold text-slate-700">
                      <Paperclip size={12} />
                      <span>{m.adjunto}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Reply Input */}
            <div className="p-4 sm:p-5 border-t border-starken-border bg-white shrink-0 space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Escribe una respuesta para el ejecutivo..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendReply(selectedTicketDetail.id);
                  }}
                  className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-[#33798C] font-sans"
                />
                <button
                  onClick={() => handleSendReply(selectedTicketDetail.id)}
                  className="px-4 py-2.5 bg-[#33798C] hover:bg-[#1e4f5e] text-white rounded-xl text-xs font-bold font-din tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                >
                  <Send size={13} />
                  <span>Responder</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: NUEVA SOLICITUD UNITARIA DE INDEMNIZACIÓN          */}
      {/* ========================================================= */}
      {singleIndemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-starken-border shadow-2xl w-full max-w-xl overflow-hidden my-8">
            {/* Header */}
            <div className="px-5 sm:px-6 pt-5 sm:pt-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-[#ECF5F7] text-[#33798C] flex items-center justify-center shrink-0">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h3 className="font-black text-base text-slate-850 font-din tracking-wide">
                      Solicitud de indemnización unitaria
                    </h3>
                    <p className="text-xs text-slate-500 font-sans">
                      Ingreso formal de expediente para liquidación por siniestro, extravío o merma.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSingleIndemModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <form onSubmit={handleCreateSingleIndemSubmit} className="px-5 sm:px-6 pt-4 pb-5 sm:pb-6 space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700 font-din">OF afectada:</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. 275067401"
                    value={singleIndemForm.of}
                    onChange={(e) => setSingleIndemForm(prev => ({ ...prev, of: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 font-din font-bold outline-none focus:border-[#33798C]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-slate-700 font-din">Tipo de siniestro:</label>
                  <select
                    value={singleIndemForm.tipo}
                    onChange={(e) => setSingleIndemForm(prev => ({ ...prev, tipo: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 font-bold outline-none focus:border-[#33798C]"
                  >
                    <option value="Siniestro por Daño">Siniestro por daño (Embalaje/contenido)</option>
                    <option value="Extravío Total">Extravío total sin movimiento</option>
                    <option value="Merma Parcial">Merma parcial de unidades</option>
                    <option value="Retraso Grave con Pérdida">Retraso grave con pérdida comercial</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700 font-din">Monto reclamado ($ CLP):</label>
                  <input
                    type="number"
                    required
                    placeholder="Ej. 145000"
                    value={singleIndemForm.montoReclamado}
                    onChange={(e) => setSingleIndemForm(prev => ({ ...prev, montoReclamado: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 font-din font-bold outline-none focus:border-[#33798C]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-slate-700 font-din">N° factura / boleta comercial:</label>
                  <input
                    type="text"
                    placeholder="Ej. FAC-9821"
                    value={singleIndemForm.facturaNumero}
                    onChange={(e) => setSingleIndemForm(prev => ({ ...prev, facturaNumero: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 outline-none focus:border-[#33798C]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-700 font-din">Detalle del siniestro:</label>
                <textarea
                  rows="3"
                  placeholder="Explica qué ocurrió con el envío y el estado en que fue recibido o no entregado..."
                  value={singleIndemForm.motivoDetalle}
                  onChange={(e) => setSingleIndemForm(prev => ({ ...prev, motivoDetalle: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 outline-none focus:border-[#33798C] resize-none"
                />
              </div>

              {/* Bank Account Info for direct payout */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="font-bold text-slate-850 font-din text-xs flex items-center gap-1.5">
                  <DollarSign size={14} className="text-emerald-600" />
                  <span>Datos de transferencia bancaria para liquidación</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                  <div><strong>Banco:</strong> {singleIndemForm.banco}</div>
                  <div><strong>Tipo de cuenta:</strong> {singleIndemForm.tipoCuenta}</div>
                  <div><strong>N° cuenta:</strong> {singleIndemForm.numeroCuenta}</div>
                  <div><strong>RUT titular:</strong> {singleIndemForm.rutTitular}</div>
                </div>
              </div>

              <div className="pt-3 border-t border-starken-border flex items-center justify-between gap-3 w-full">
                <button
                  type="button"
                  onClick={() => setSingleIndemModalOpen(false)}
                  className="btn btn-outline flex-1 cursor-pointer font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary flex-1 cursor-pointer font-bold space-x-1.5"
                >
                  <ShieldCheck size={14} />
                  <span>Ingresar solicitud</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: CARGA MASIVA DE INDEMNIZACIONES                   */}
      {/* ========================================================= */}
      {bulkIndemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-starken-border shadow-2xl w-full max-w-2xl overflow-hidden my-8">
            {/* Header */}
            <div className="px-5 sm:px-6 pt-5 sm:pt-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-[#ECF5F7] text-[#33798C] flex items-center justify-center shrink-0">
                    <UploadCloud size={20} />
                  </div>
                  <div>
                    <h3 className="font-black text-base text-slate-850 font-din tracking-wide">
                      Carga masiva de indemnizaciones
                    </h3>
                    <p className="text-xs text-slate-500 font-sans">
                      Importa múltiples expedientes de siniestros mediante planilla Excel (.xlsx) o CSV.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setBulkIndemModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="px-5 sm:px-6 pt-4 pb-5 sm:pb-6 space-y-4 text-xs font-sans">
              
              {/* Template Download */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-850">Descarga la plantilla oficial</div>
                  <div className="text-[11px] text-slate-500">Formato preconfigurado con columnas OF, Motivo, Monto y N° Factura.</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (showToast) showToast('Descargando Plantilla_Carga_Masiva_Indemnizaciones_Starken.xlsx...', 'info');
                  }}
                  className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg font-bold font-din text-slate-700 flex items-center gap-1.5 cursor-pointer"
                >
                  <Download size={13} />
                  <span>Descargar plantilla</span>
                </button>
              </div>

              {/* File Uploader */}
              <div className="border-2 border-dashed border-slate-300 hover:border-[#33798C] rounded-2xl p-6 text-center space-y-2 bg-slate-50/50 transition-colors">
                <UploadCloud size={32} className="mx-auto text-[#33798C]" />
                <div className="font-bold text-slate-800 text-sm">
                  {bulkFileName ? bulkFileName : 'Arrastra tu archivo aquí o haz clic para examinar'}
                </div>
                <p className="text-[11px] text-slate-400">Soporta archivos .xlsx, .xls y .csv de hasta 10 MB.</p>
                <label className="inline-block mt-2 px-4 py-2 bg-[#33798C] text-white rounded-xl font-bold font-din text-xs cursor-pointer hover:bg-[#1e4f5e]">
                  Seleccionar archivo
                  <input type="file" accept=".xlsx,.xls,.csv" onChange={handleBulkUploadSimulate} className="hidden" />
                </label>
              </div>

              {/* Preview Table */}
              {bulkPreviewRows.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between font-din text-xs font-bold">
                    <span className="text-slate-700">Previsualización ({bulkPreviewRows.length} registros validados):</span>
                    <span className="text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 size={13} /> Todos los campos validados
                    </span>
                  </div>
                  <div className="max-h-44 overflow-y-auto rounded-xl border border-slate-200">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-100 text-[10px] font-din font-bold text-slate-600">
                          <th className="p-2 pl-3">OF</th>
                          <th className="p-2">Tipo siniestro</th>
                          <th className="p-2">Monto reclamado</th>
                          <th className="p-2">Factura</th>
                          <th className="p-2 text-center">Validación</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {bulkPreviewRows.map((r, i) => (
                          <tr key={i} className="hover:bg-slate-50">
                            <td className="p-2 pl-3 font-din font-bold text-[#33798C]">{r.of}</td>
                            <td className="p-2 text-slate-700">{r.tipo}</td>
                            <td className="p-2 font-din font-bold text-slate-900">${r.monto.toLocaleString('es-CL')}</td>
                            <td className="p-2 text-slate-600">{r.factura}</td>
                            <td className="p-2 text-center text-emerald-600 font-bold font-din">{r.estado}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-starken-border flex items-center justify-between gap-3 w-full">
                <button
                  type="button"
                  onClick={() => setBulkIndemModalOpen(false)}
                  className="btn btn-outline flex-1 cursor-pointer font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  disabled={bulkPreviewRows.length === 0}
                  onClick={handleConfirmBulkIndem}
                  className="btn btn-primary flex-1 cursor-pointer font-bold space-x-1.5"
                >
                  <Check size={14} />
                  <span>Procesar carga ({bulkPreviewRows.length})</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: EXPEDIENTE DE INDEMNIZACIÓN DETALLE               */}
      {/* ========================================================= */}
      {selectedIndemDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-starken-border shadow-2xl w-full max-w-xl overflow-hidden my-8">
            {/* Header */}
            <div className="px-5 sm:px-6 pt-5 sm:pt-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-din font-black text-sm text-[#33798C] bg-[#ECF5F7] px-2 py-0.5 rounded">
                      {selectedIndemDetail.id}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold font-sans whitespace-nowrap ${
                      selectedIndemDetail.estado === 'Aprobado para pago'
                        ? 'bg-emerald-50 text-emerald-700'
                        : selectedIndemDetail.estado === 'En liquidación'
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}>
                      {selectedIndemDetail.estado}
                    </span>
                  </div>
                  <h3 className="font-black text-base text-slate-850 font-din mt-1">
                    Expediente de indemnización — OF {selectedIndemDetail.of}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedIndemDetail(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="px-5 sm:px-6 pt-4 pb-5 sm:pb-6 space-y-4 text-xs font-sans">
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 font-din">Tipo de siniestro</span>
                  <div className="font-bold text-slate-900">{selectedIndemDetail.tipo}</div>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 font-din">Monto solicitado</span>
                  <div className="font-bold font-din text-slate-900 text-sm">
                    ${selectedIndemDetail.montoReclamado.toLocaleString('es-CL')} CLP
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 font-din">Perito responsable</span>
                  <div className="font-bold text-slate-700">{selectedIndemDetail.perito}</div>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 font-din">Fecha dictamen / pago</span>
                  <div className="font-bold text-slate-700">{selectedIndemDetail.fechaPagoEstimada}</div>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-500 font-din">Resolución del dictamen legal:</span>
                <div className="p-3 bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] rounded-xl font-medium leading-relaxed">
                  {selectedIndemDetail.resolucion}
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-500 font-din">Documentos del expediente:</span>
                <div className="flex flex-wrap gap-2">
                  {selectedIndemDetail.documentos.map((doc, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 font-bold text-slate-700">
                      <FileText size={13} className="text-[#33798C]" />
                      <span>{doc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-starken-border flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedIndemDetail(null)}
                  className="px-4 py-2 bg-[#33798C] text-white rounded-xl text-xs font-bold font-din tracking-wider hover:bg-[#1e4f5e] cursor-pointer"
                >
                  Cerrar expediente
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
