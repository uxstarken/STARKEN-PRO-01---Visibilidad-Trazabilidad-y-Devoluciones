import React, { useState, useRef, useMemo } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MisGestionesTab from './components/MisGestionesTab';
import MisEnvíosTab from './components/MisEnvíosTab';
import ActionModal from './components/ActionModal';
import SeguimientoView from './components/SeguimientoView';
import RetirosView from './components/RetirosView';
import EmisionView from './components/EmisionView';
import CotizadorView from './components/CotizadorView';
import EcommerceApisView from './components/EcommerceApisView';
import LegalFinancieroView from './components/LegalFinancieroView';
import PostventaSoporteView from './components/PostventaSoporteView';
import MisCuentasView from './components/MisCuentasView';
import { Calendar, RefreshCw, AlertCircle, Info, CheckCircle2, ShieldAlert, Truck, X, Package, SlidersHorizontal } from 'lucide-react';

const INITIAL_ACCOUNTS = [
  'Cta Cte 44379 — Cuenta Starkin',
  'Cta Cte 44380 — Hub Providencia',
  'Cta Cte 44381 — Sucursal Concepción',
  'Cta Cte 44382 — CD Antofagasta'
];

const INITIAL_SHIPMENTS = [
  // =========================================================================
  // 1. EXCEPCIONES POR GESTIONAR (Cuenta 44379 - Cuenta Starkin / CD San Bernardo)
  // =========================================================================
  { 
    id: 275161618, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'Excepción', priority: 'Alta', 
    reason: 'Dirección incorrecta', slaMinutes: 60, recipient: 'Jeraldin Alejandra P.', phone: '976921527', actionTaken: null,
    fechaExcepcion: '08-10-2026', fechaSolicitud: '08-10-2026', diasEnGestion: 0, nDocumento: 659012, fechaCompromiso: '09-10-2026', 
    comunaDestino: 'San Bernardo', direccionDestino: 'Av. Los Robles 1020, Depto 401', rutDestinatario: '18.420.911-3', 
    emailDestinatario: 'jeraldin.p@empresa.cl', telefonoDestinatario: '976921527', 
    fechaEmision: '07-10-2026', fechaRecepcion: '08-10-2026', tipoEntrega: 'Domicilio', tipoServicio: 'Express', comunaOrigen: 'San Bernardo' 
  },
  { 
    id: 275067401, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'Excepción', priority: 'Alta', 
    reason: 'Cliente ausente', slaMinutes: 120, recipient: 'Juan Carlos Espinoza', phone: '958579337', actionTaken: null,
    fechaExcepcion: '08-10-2026', fechaSolicitud: '08-10-2026', diasEnGestion: 0, nDocumento: 658990, fechaCompromiso: '09-10-2026', 
    comunaDestino: 'Paine', direccionDestino: 'Av. Presidente Prieto 0271', rutDestinatario: '15.932.104-5', 
    emailDestinatario: 'jc.espinoza@retail.cl', telefonoDestinatario: '958579337', 
    fechaEmision: '06-10-2026', fechaRecepcion: '07-10-2026', tipoEntrega: 'Domicilio', tipoServicio: 'Normal', comunaOrigen: 'San Bernardo' 
  },
  { 
    id: 275105257, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'Excepción', priority: 'Media', 
    reason: 'Rechazo entrega', slaMinutes: 720, recipient: 'Luis Humberto Lucero', phone: '988204005', actionTaken: null,
    fechaExcepcion: '07-10-2026', fechaSolicitud: '07-10-2026', diasEnGestion: 1, nDocumento: 658821, fechaCompromiso: '10-10-2026', 
    comunaDestino: 'Calama', direccionDestino: 'Calle Granaderos 2140', rutDestinatario: '12.809.332-9', 
    emailDestinatario: 'luis.lucero@mineria.cl', telefonoDestinatario: '988204005', 
    fechaEmision: '05-10-2026', fechaRecepcion: '06-10-2026', tipoEntrega: 'Domicilio', tipoServicio: 'Express', comunaOrigen: 'San Bernardo' 
  },
  { 
    id: 274942088, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'Excepción', priority: 'Baja', 
    reason: 'Devolución', slaMinutes: 2880, recipient: 'Jose Jaime Sarovic L.', phone: '976956978', actionTaken: null,
    fechaExcepcion: '07-10-2026', fechaSolicitud: '07-10-2026', diasEnGestion: 1, nDocumento: 658744, fechaCompromiso: '12-10-2026', 
    comunaDestino: 'Concepción', direccionDestino: 'Barros Arana 1090', rutDestinatario: '10.554.890-K', 
    emailDestinatario: 'jsarovic@distribuidora.cl', telefonoDestinatario: '976956978', 
    fechaEmision: '04-10-2026', fechaRecepcion: '05-10-2026', tipoEntrega: 'Sucursal', tipoServicio: 'Normal', comunaOrigen: 'San Bernardo' 
  },
  { 
    id: 274494880, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'Excepción', priority: 'Alta', 
    reason: 'Cliente ausente', slaMinutes: 80, recipient: 'Jose Roberto Mondaca', phone: '982164216', actionTaken: null,
    fechaExcepcion: '08-10-2026', fechaSolicitud: '08-10-2026', diasEnGestion: 0, nDocumento: 658601, fechaCompromiso: '09-10-2026', 
    comunaDestino: 'Antofagasta', direccionDestino: 'Av. Balmaceda 2500', rutDestinatario: '16.782.110-8', 
    emailDestinatario: 'jmondaca@norte.cl', telefonoDestinatario: '982164216', 
    fechaEmision: '05-10-2026', fechaRecepcion: '06-10-2026', tipoEntrega: 'Domicilio', tipoServicio: 'Normal', comunaOrigen: 'San Bernardo' 
  },
  { 
    id: 900002, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'Excepción', priority: 'Media', 
    reason: 'Dirección incorrecta', slaMinutes: 300, recipient: 'Francisca Rubio', phone: '+56 9 2222 3333', actionTaken: null,
    fechaExcepcion: '07-10-2026', fechaSolicitud: '07-10-2026', diasEnGestion: 1, nDocumento: 658512, fechaCompromiso: '10-10-2026', 
    comunaDestino: 'Providencia', direccionDestino: 'Av. Tobalaba 1450', rutDestinatario: '17.432.889-1', 
    emailDestinatario: 'frubio@correo.cl', telefonoDestinatario: '922223333', 
    fechaEmision: '06-10-2026', fechaRecepcion: '07-10-2026', tipoEntrega: 'Domicilio', tipoServicio: 'Normal', comunaOrigen: 'San Bernardo' 
  },
  { 
    id: 900003, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'Excepción', priority: 'Baja', 
    reason: 'Rechazo entrega', slaMinutes: 1200, recipient: 'Esteban Paredes', phone: '+56 9 3333 4444', actionTaken: null,
    fechaExcepcion: '06-10-2026', fechaSolicitud: '07-10-2026', diasEnGestion: 2, nDocumento: 658420, fechaCompromiso: '11-10-2026', 
    comunaDestino: 'Macul', direccionDestino: 'Av. Marathon 5300', rutDestinatario: '13.204.556-7', 
    emailDestinatario: 'eparedes@futbol.cl', telefonoDestinatario: '933334444', 
    fechaEmision: '04-10-2026', fechaRecepcion: '05-10-2026', tipoEntrega: 'Domicilio', tipoServicio: 'Normal', comunaOrigen: 'San Bernardo' 
  },
  { 
    id: 900004, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'Excepción', priority: 'Alta', 
    reason: 'Cliente ausente', slaMinutes: 110, recipient: 'Daniela Castro', phone: '+56 9 4444 5555', actionTaken: null,
    fechaExcepcion: '08-10-2026', fechaSolicitud: '08-10-2026', diasEnGestion: 0, nDocumento: 658399, fechaCompromiso: '09-10-2026', 
    comunaDestino: 'Las Condes', direccionDestino: 'Isidora Goyenechea 3000', rutDestinatario: '19.112.443-2', 
    emailDestinatario: 'dcastro@chef.cl', telefonoDestinatario: '944445555', 
    fechaEmision: '07-10-2026', fechaRecepcion: '08-10-2026', tipoEntrega: 'Domicilio', tipoServicio: 'Express', comunaOrigen: 'San Bernardo' 
  },
  { 
    id: 900005, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'Excepción', priority: 'Media', 
    reason: 'Devolución', slaMinutes: 450, recipient: 'Claudio Maldonado', phone: '+56 9 5555 6666', actionTaken: null,
    fechaExcepcion: '07-10-2026', fechaSolicitud: '07-10-2026', diasEnGestion: 1, nDocumento: 658310, fechaCompromiso: '10-10-2026', 
    comunaDestino: 'Curicó', direccionDestino: 'Carmen 450', rutDestinatario: '14.882.301-4', 
    emailDestinatario: 'cmaldonado@agricola.cl', telefonoDestinatario: '955556666', 
    fechaEmision: '05-10-2026', fechaRecepcion: '06-10-2026', tipoEntrega: 'Sucursal', tipoServicio: 'Normal', comunaOrigen: 'San Bernardo' 
  },
  { 
    id: 900006, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'Excepción', priority: 'Baja', 
    reason: 'Dirección incorrecta', slaMinutes: 1800, recipient: 'Camila Vallejo', phone: '+56 9 6666 7777', actionTaken: null,
    fechaExcepcion: '06-10-2026', fechaSolicitud: '06-10-2026', diasEnGestion: 2, nDocumento: 658255, fechaCompromiso: '11-10-2026', 
    comunaDestino: 'Santiago', direccionDestino: 'Teatinos 120', rutDestinatario: '16.901.445-8', 
    emailDestinatario: 'cvallejo@gob.cl', telefonoDestinatario: '966667777', 
    fechaEmision: '04-10-2026', fechaRecepcion: '05-10-2026', tipoEntrega: 'Domicilio', tipoServicio: 'Normal', comunaOrigen: 'San Bernardo' 
  },
  { 
    id: 900007, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'Excepción', priority: 'Alta', 
    reason: 'Rechazo entrega', slaMinutes: 45, recipient: 'Sebastián Piñera', phone: '+56 9 7777 8888', actionTaken: null,
    fechaExcepcion: '08-10-2026', fechaSolicitud: '08-10-2026', diasEnGestion: 0, nDocumento: 658190, fechaCompromiso: '09-10-2026', 
    comunaDestino: 'Vitacura', direccionDestino: 'Av. Kennedy 7800', rutDestinatario: '07.441.209-1', 
    emailDestinatario: 'spinera@fundacion.cl', telefonoDestinatario: '977778888', 
    fechaEmision: '07-10-2026', fechaRecepcion: '08-10-2026', tipoEntrega: 'Domicilio', tipoServicio: 'Express', comunaOrigen: 'San Bernardo' 
  },
  { 
    id: 900008, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'Excepción', priority: 'Media', 
    reason: 'Cliente ausente', slaMinutes: 320, recipient: 'Michelle Bachelet', phone: '+56 9 8888 9999', actionTaken: null,
    fechaExcepcion: '07-10-2026', fechaSolicitud: '07-10-2026', diasEnGestion: 1, nDocumento: 658100, fechaCompromiso: '10-10-2026', 
    comunaDestino: 'La Reina', direccionDestino: 'Príncipe de Gales 750', rutDestinatario: '08.112.554-3', 
    emailDestinatario: 'mbachelet@onu.org', telefonoDestinatario: '988889999', 
    fechaEmision: '05-10-2026', fechaRecepcion: '06-10-2026', tipoEntrega: 'Domicilio', tipoServicio: 'Normal', comunaOrigen: 'San Bernardo' 
  },
  { 
    id: 900009, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'Excepción', priority: 'Baja', 
    reason: 'Devolución', slaMinutes: 2000, recipient: 'Ricardo Lagos', phone: '+56 9 9999 0000', actionTaken: null,
    fechaExcepcion: '06-10-2026', fechaSolicitud: '06-10-2026', diasEnGestion: 2, nDocumento: 658040, fechaCompromiso: '12-10-2026', 
    comunaDestino: 'Ñuñoa', direccionDestino: 'Av. Irarrazaval 2400', rutDestinatario: '05.201.884-9', 
    emailDestinatario: 'rlagos@democracia.cl', telefonoDestinatario: '999990000', 
    fechaEmision: '03-10-2026', fechaRecepcion: '04-10-2026', tipoEntrega: 'Domicilio', tipoServicio: 'Normal', comunaOrigen: 'San Bernardo' 
  },
  { 
    id: 900010, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'Excepción', priority: 'Alta', 
    reason: 'Dirección incorrecta', slaMinutes: 50, recipient: 'Gabriel Boric', phone: '+56 9 0000 1111', actionTaken: null,
    fechaExcepcion: '08-10-2026', fechaSolicitud: '08-10-2026', diasEnGestion: 0, nDocumento: 657980, fechaCompromiso: '09-10-2026', 
    comunaDestino: 'Santiago', direccionDestino: 'Morandé 130', rutDestinatario: '16.220.198-4', 
    emailDestinatario: 'gboric@presidencia.cl', telefonoDestinatario: '900001111', 
    fechaEmision: '07-10-2026', fechaRecepcion: '08-10-2026', tipoEntrega: 'Domicilio', tipoServicio: 'Express', comunaOrigen: 'San Bernardo' 
  },
  { 
    id: 900011, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'Excepción', priority: 'Media', 
    reason: 'Rechazo entrega', slaMinutes: 540, recipient: 'José Antonio Kast', phone: '+56 9 1111 3333', actionTaken: null,
    fechaExcepcion: '07-10-2026', fechaSolicitud: '07-10-2026', diasEnGestion: 1, nDocumento: 657890, fechaCompromiso: '10-10-2026', 
    comunaDestino: 'Paine', direccionDestino: 'Camino Real 100', rutDestinatario: '09.882.114-6', 
    emailDestinatario: 'jakast@partido.cl', telefonoDestinatario: '911113333', 
    fechaEmision: '05-10-2026', fechaRecepcion: '06-10-2026', tipoEntrega: 'Domicilio', tipoServicio: 'Normal', comunaOrigen: 'San Bernardo' 
  },
  { 
    id: 900012, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'Excepción', priority: 'Baja', 
    reason: 'Cliente ausente', slaMinutes: 1440, recipient: 'Evelyn Matthei', phone: '+56 9 2222 4444', actionTaken: null,
    fechaExcepcion: '06-10-2026', fechaSolicitud: '06-10-2026', diasEnGestion: 2, nDocumento: 657801, fechaCompromiso: '11-10-2026', 
    comunaDestino: 'Providencia', direccionDestino: 'Pedro de Valdivia 963', rutDestinatario: '08.991.203-0', 
    emailDestinatario: 'ematthei@muniprovidencia.cl', telefonoDestinatario: '922224444', 
    fechaEmision: '04-10-2026', fechaRecepcion: '05-10-2026', tipoEntrega: 'Domicilio', tipoServicio: 'Normal', comunaOrigen: 'San Bernardo' 
  },

  // =========================================================================
  // 2. EN GESTIÓN (5 Casos activos - Cuenta 44379)
  // =========================================================================
  { 
    id: 274020967, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'En gestión', priority: 'Alta', reason: 'Dirección incorrecta', slaMinutes: 1440, 
    recipient: 'Alva Rosa Farias Oli', phone: '989860058', actionTaken: 'Validando nueva dirección con destinatario',
    fechaExcepcion: '06-10-2026', fechaSolicitud: '07-10-2026', diasEnGestion: 1, nDocumento: 658660, fechaCompromiso: '09-10-2026', 
    comunaDestino: 'La Serena', direccionDestino: 'Los Castanos 1027 Nº 1027', rutDestinatario: '14.502.911-2', 
    emailDestinatario: 'alva.farias@gmail.com', telefonoDestinatario: '989860058', 
    fechaEmision: '04-10-2026', fechaRecepcion: '05-10-2026', tipoEntrega: 'Domicilio', tipoServicio: 'Normal', comunaOrigen: 'San Bernardo' 
  },
  { 
    id: 275067550, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'En gestión', priority: 'Media', reason: 'Rechazado Por Cliente', slaMinutes: 720, 
    recipient: 'Mario Eduardo Gatta', phone: '985613979', actionTaken: 'Reintento coordinado con cliente',
    fechaExcepcion: '06-10-2026', fechaSolicitud: '07-10-2026', diasEnGestion: 1, nDocumento: 658666, fechaCompromiso: '10-10-2026', 
    comunaDestino: 'Paine', direccionDestino: 'Av Pdte Prieto 0271 Nº 0271', rutDestinatario: '11.890.334-K', 
    emailDestinatario: 'mgatta0271@gmail.com', telefonoDestinatario: '985613979', 
    fechaEmision: '03-10-2026', fechaRecepcion: '04-10-2026', tipoEntrega: 'Domicilio', tipoServicio: 'Normal', comunaOrigen: 'San Bernardo' 
  },
  { 
    id: 275244124, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'En gestión', priority: 'Alta', reason: 'Rechazado Por Cliente', slaMinutes: 180, 
    recipient: 'Margarita Del Carmen', phone: '984753622', actionTaken: 'Confirmación de recepción pendiente',
    fechaExcepcion: '07-10-2026', fechaSolicitud: '07-10-2026', diasEnGestion: 1, nDocumento: 658973, fechaCompromiso: '09-10-2026', 
    comunaDestino: 'Calama', direccionDestino: 'Uruguay 1102 Nº 1102', rutDestinatario: '15.221.904-8', 
    emailDestinatario: 'margarita.carmen@empresa.cl', telefonoDestinatario: '984753622', 
    fechaEmision: '05-10-2026', fechaRecepcion: '06-10-2026', tipoEntrega: 'Domicilio', tipoServicio: 'Express', comunaOrigen: 'San Bernardo' 
  },
  { 
    id: 275244116, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'En gestión', priority: 'Baja', reason: 'Rechazado Por Cliente', slaMinutes: 2880, 
    recipient: 'Fernando Hernan Paredes', phone: '999792142', actionTaken: 'En espera de instrucción comercial',
    fechaExcepcion: '06-10-2026', fechaSolicitud: '07-10-2026', diasEnGestion: 1, nDocumento: 658969, fechaCompromiso: '12-10-2026', 
    comunaDestino: 'San Bernardo', direccionDestino: 'Cresibio 124 Nº 124', rutDestinatario: '13.445.890-7', 
    emailDestinatario: 'fhernandez@comercial.cl', telefonoDestinatario: '999792142', 
    fechaEmision: '05-10-2026', fechaRecepcion: '06-10-2026', tipoEntrega: 'Domicilio', tipoServicio: 'Normal', comunaOrigen: 'San Bernardo' 
  },
  { 
    id: 274667002, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'En gestión', priority: 'Media', reason: 'No Se Ubica Destinatario', slaMinutes: 120, 
    recipient: 'Ana Carrasco', phone: '999166246', actionTaken: 'Reenvío agendado para mañana AM',
    fechaExcepcion: '05-10-2026', fechaSolicitud: '06-10-2026', diasEnGestion: 2, nDocumento: 658105, fechaCompromiso: '09-10-2026', 
    comunaDestino: 'El Bosque', direccionDestino: 'Sgto. Aldea 950, Casa B', rutDestinatario: '17.899.412-1', 
    emailDestinatario: 'ana.carrasco@gmail.com', telefonoDestinatario: '999166246', 
    fechaEmision: '03-10-2026', fechaRecepcion: '04-10-2026', tipoEntrega: 'Domicilio', tipoServicio: 'Normal', comunaOrigen: 'San Bernardo' 
  },

  // =========================================================================
  // 3. GESTIONADOS (10 Casos cerrados - Cuenta 44379)
  // =========================================================================
  { 
    id: 273752930, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'Gestionado', priority: 'Alta', reason: 'Redestinación', slaMinutes: 1440, 
    recipient: 'Milton Rene Nunez Hinojosa', phone: '944885043', actionTaken: 'Redestinacion',
    fechaExcepcion: '02-10-2026', fechaSolicitud: '03-10-2026', ofActualizada: 273958851, nDocumento: 657110, fechaCompromiso: '06-10-2026', 
    comunaDestino: 'San Felipe', estado: 'Redestinada Por Solicitud Del Cliente',
    direccionDestino: '9 Nte 555 Piso 4 Dpto 410 N° 555', rutDestinatario: '10.899.201-3', 
    nombreDestinatario: 'Milton Rene Nunez Hinojosa', emailDestinatario: 'mnunez@empresa.cl', telefonoDestinatario: '944885043', 
    fechaEmision: '01-10-2026', fechaGestion: '04-10-2026', tipoEntrega: 'Domicilio', tipoServicio: 'Normal', comunaOrigen: 'San Bernardo',
    accionRealizada: 'Redestinacion', valorTotal: '10.640', nombreGestor: 'Carol Bedwell'
  },
  { 
    id: 274423469, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'Gestionado', priority: 'Media', reason: 'Devolución', slaMinutes: 1440, 
    recipient: 'Victor Patricio Hernandez', phone: '957110363', actionTaken: 'Devolucion',
    fechaExcepcion: '03-10-2026', fechaSolicitud: '04-10-2026', ofActualizada: 274691288, nDocumento: 657220, fechaCompromiso: '07-10-2026', 
    comunaDestino: 'Viña Del Mar', estado: 'Devolución a Bodega Origen Finalizada',
    direccionDestino: 'Pje Siete 27 N° 27', rutDestinatario: '12.441.802-9', 
    nombreDestinatario: 'Victor Patricio Hernandez', emailDestinatario: 'vhernandez@retail.cl', telefonoDestinatario: '957110363', 
    fechaEmision: '02-10-2026', fechaGestion: '05-10-2026', tipoEntrega: 'Domicilio', tipoServicio: 'Normal', comunaOrigen: 'San Bernardo',
    accionRealizada: 'Devolucion', valorTotal: '9.940', nombreGestor: 'Carol Bedwell'
  },
  { 
    id: 274837812, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'Gestionado', priority: 'Baja', reason: 'Rechazado Por Cliente', slaMinutes: 1440, 
    recipient: 'Manuel Osvaldo Espinoza', phone: '951963890', actionTaken: 'Sacar Reparto Sin Modificacion',
    fechaExcepcion: '01-10-2026', fechaSolicitud: '01-10-2026', ofActualizada: 274991100, nDocumento: 658452, fechaCompromiso: '05-10-2026', 
    comunaDestino: 'San Bernardo', estado: 'Entregado en Segundo Reintento',
    direccionDestino: 'San Alfonso 42 N° 42', rutDestinatario: '14.990.221-5', 
    nombreDestinatario: 'Manuel Osvaldo Espinoza', emailDestinatario: 'mespinoza@correo.cl', telefonoDestinatario: '951963890', 
    fechaEmision: '29-09-2026', fechaGestion: '04-10-2026', tipoEntrega: 'Domicilio', tipoServicio: 'Normal', comunaOrigen: 'San Bernardo',
    accionRealizada: 'Sacar Reparto Sin Modificacion', valorTotal: '4.567', nombreGestor: 'Carol Bedwell'
  },
  { 
    id: 273941965, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'Gestionado', priority: 'Media', reason: 'Rechazado Por Cliente', slaMinutes: 1440, 
    recipient: 'Nuri Del Carmen Mora', phone: '920818800', actionTaken: 'Modificacion',
    fechaExcepcion: '30-09-2026', fechaSolicitud: '01-10-2026', ofActualizada: 274001920, nDocumento: 656907, fechaCompromiso: '04-10-2026', 
    comunaDestino: 'Concón', estado: 'Entregada con Nueva Dirección',
    direccionDestino: 'Jose Yanez 1150 Piso 3 Dpto 303 Block V', rutDestinatario: '16.502.811-0', 
    nombreDestinatario: 'Nuri Del Carmen Mora', emailDestinatario: 'nmora@concon.cl', telefonoDestinatario: '920818800', 
    fechaEmision: '28-09-2026', fechaGestion: '04-10-2026', tipoEntrega: 'Domicilio', tipoServicio: 'Normal', comunaOrigen: 'San Bernardo',
    accionRealizada: 'Modificacion', valorTotal: '4.920', nombreGestor: 'Carol Bedwell'
  },
  { 
    id: 273110944, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'Gestionado', priority: 'Alta', reason: 'Dirección incorrecta', slaMinutes: 1440, 
    recipient: 'Rodrigo Alejandro Silva', phone: '933221100', actionTaken: 'Redestinacion',
    fechaExcepcion: '29-09-2026', fechaSolicitud: '30-09-2026', ofActualizada: 273299102, nDocumento: 656100, fechaCompromiso: '03-10-2026', 
    comunaDestino: 'Rancagua', estado: 'Entregado en Sucursal Rancagua',
    direccionDestino: 'Av. Libertador 450', rutDestinatario: '13.801.442-9', 
    nombreDestinatario: 'Rodrigo Alejandro Silva', emailDestinatario: 'rsilva@gmail.com', telefonoDestinatario: '933221100', 
    fechaEmision: '27-09-2026', fechaGestion: '02-10-2026', tipoEntrega: 'Sucursal', tipoServicio: 'Normal', comunaOrigen: 'San Bernardo',
    accionRealizada: 'Redestinacion', valorTotal: '6.450', nombreGestor: 'Carol Bedwell'
  },
  { 
    id: 273220491, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'Gestionado', priority: 'Media', reason: 'Cliente ausente', slaMinutes: 1440, 
    recipient: 'Patricia Andrea Morales', phone: '944556677', actionTaken: 'Sacar Reparto Sin Modificacion',
    fechaExcepcion: '28-09-2026', fechaSolicitud: '29-09-2026', ofActualizada: 273350100, nDocumento: 655900, fechaCompromiso: '02-10-2026', 
    comunaDestino: 'Talca', estado: 'Entregado con Firma Digital',
    direccionDestino: 'Calle 1 Sur 1420', rutDestinatario: '15.902.114-1', 
    nombreDestinatario: 'Patricia Andrea Morales', emailDestinatario: 'pmorales@talca.cl', telefonoDestinatario: '944556677', 
    fechaEmision: '26-09-2026', fechaGestion: '01-10-2026', tipoEntrega: 'Domicilio', tipoServicio: 'Normal', comunaOrigen: 'San Bernardo',
    accionRealizada: 'Sacar Reparto Sin Modificacion', valorTotal: '5.890', nombreGestor: 'Carol Bedwell'
  },
  { 
    id: 273440182, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'Gestionado', priority: 'Baja', reason: 'Devolución', slaMinutes: 1440, 
    recipient: 'Gonzalo Andrés Valdés', phone: '955667788', actionTaken: 'Devolucion',
    fechaExcepcion: '27-09-2026', fechaSolicitud: '28-09-2026', ofActualizada: 273510990, nDocumento: 655400, fechaCompromiso: '01-10-2026', 
    comunaDestino: 'San Bernardo', estado: 'Retorno a Origen Completado',
    direccionDestino: 'Av. Portales 890', rutDestinatario: '12.809.445-3', 
    nombreDestinatario: 'Gonzalo Andrés Valdés', emailDestinatario: 'gvaldes@empresa.cl', telefonoDestinatario: '955667788', 
    fechaEmision: '25-09-2026', fechaGestion: '30-09-2026', tipoEntrega: 'Domicilio', tipoServicio: 'Normal', comunaOrigen: 'San Bernardo',
    accionRealizada: 'Devolucion', valorTotal: '7.120', nombreGestor: 'Carol Bedwell'
  },
  { 
    id: 273550882, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'Gestionado', priority: 'Media', reason: 'Rechazo entrega', slaMinutes: 1440, 
    recipient: 'Marcela Paz Soto', phone: '966778899', actionTaken: 'Modificacion',
    fechaExcepcion: '26-09-2026', fechaSolicitud: '27-09-2026', ofActualizada: 273610200, nDocumento: 654990, fechaCompromiso: '30-09-2026', 
    comunaDestino: 'Quillota', estado: 'Entregado a Tercero Autorizado',
    direccionDestino: 'O\'Higgins 340', rutDestinatario: '16.702.119-8', 
    nombreDestinatario: 'Marcela Paz Soto', emailDestinatario: 'msoto@quillota.cl', telefonoDestinatario: '966778899', 
    fechaEmision: '24-09-2026', fechaGestion: '29-09-2026', tipoEntrega: 'Domicilio', tipoServicio: 'Normal', comunaOrigen: 'San Bernardo',
    accionRealizada: 'Modificacion', valorTotal: '4.800', nombreGestor: 'Carol Bedwell'
  },
  { 
    id: 273660301, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'Gestionado', priority: 'Alta', reason: 'Dirección incorrecta', slaMinutes: 1440, 
    recipient: 'Jorge Esteban Tapia', phone: '977889900', actionTaken: 'Redestinacion',
    fechaExcepcion: '25-09-2026', fechaSolicitud: '26-09-2026', ofActualizada: 273720990, nDocumento: 654120, fechaCompromiso: '29-09-2026', 
    comunaDestino: 'Arica', estado: 'Entregado en Hub Norte',
    direccionDestino: 'Av. Santa María 2100', rutDestinatario: '11.402.991-K', 
    nombreDestinatario: 'Jorge Esteban Tapia', emailDestinatario: 'jtapia@arica.cl', telefonoDestinatario: '977889900', 
    fechaEmision: '22-09-2026', fechaGestion: '28-09-2026', tipoEntrega: 'Domicilio', tipoServicio: 'Express', comunaOrigen: 'San Bernardo',
    accionRealizada: 'Redestinacion', valorTotal: '14.200', nombreGestor: 'Carol Bedwell'
  },
  { 
    id: 273880499, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'Gestionado', priority: 'Baja', reason: 'Cliente ausente', slaMinutes: 1440, 
    recipient: 'Lorena Isabel Castro', phone: '988990011', actionTaken: 'Sacar Reparto Sin Modificacion',
    fechaExcepcion: '24-09-2026', fechaSolicitud: '25-09-2026', ofActualizada: 273910550, nDocumento: 653890, fechaCompromiso: '28-09-2026', 
    comunaDestino: 'Temuco', estado: 'Entregado con Evidencia Fotográfica',
    direccionDestino: 'Alemania 0890', rutDestinatario: '14.112.503-4', 
    nombreDestinatario: 'Lorena Isabel Castro', emailDestinatario: 'lcastro@temuco.cl', telefonoDestinatario: '988990011', 
    fechaEmision: '21-09-2026', fechaGestion: '27-09-2026', tipoEntrega: 'Domicilio', tipoServicio: 'Normal', comunaOrigen: 'San Bernardo',
    accionRealizada: 'Sacar Reparto Sin Modificacion', valorTotal: '8.900', nombreGestor: 'Carol Bedwell'
  },

  // =========================================================================
  // 4. ENVÍOS REGULARES (Flujo operativo Mis Envíos - Cuenta 44379)
  // =========================================================================
  { id: 100001, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'En reparto', priority: 'Media', recipient: 'Pedro Pascal', actionTaken: null },
  { id: 100002, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'En reparto', priority: 'Media', recipient: 'Alexis Sánchez', actionTaken: null },
  { id: 100003, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'En reparto', priority: 'Alta', recipient: 'Gary Medel', actionTaken: null },
  { id: 100004, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'En reparto', priority: 'Media', recipient: 'Arturo Vidal', actionTaken: null },
  { id: 100005, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'En reparto', priority: 'Baja', recipient: 'Claudio Bravo', actionTaken: null },
  { id: 100006, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'En reparto', priority: 'Baja', recipient: 'Ben Brereton', actionTaken: null },
  { id: 100007, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'En reparto', priority: 'Media', recipient: 'Charles Aránguiz', actionTaken: null },
  { id: 100008, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'En reparto', priority: 'Baja', recipient: 'Mauricio Isla', actionTaken: null },
  { id: 100009, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'En reparto', priority: 'Media', recipient: 'Manuel Pellegrini', actionTaken: null },
  { id: 100010, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'En reparto', priority: 'Alta', recipient: 'Marcelo Salas', actionTaken: null },
  { id: 100011, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'En reparto', priority: 'Media', recipient: 'Iván Zamorano', actionTaken: null },
  { id: 100012, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'En reparto', priority: 'Baja', recipient: 'Matías Fernández', actionTaken: null },
  { id: 100013, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'En reparto', priority: 'Media', recipient: 'Jorge Valdivia', actionTaken: null },
  { id: 100014, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'En reparto', priority: 'Alta', recipient: 'Jean Beausejour', actionTaken: null },

  { id: 100020, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'En origen', priority: 'Baja', recipient: 'Felipe Camiroaga', actionTaken: null },
  { id: 100021, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'En origen', priority: 'Media', recipient: 'Cecilia Bolocco', actionTaken: null },
  { id: 100022, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'En origen', priority: 'Baja', recipient: 'Don Francisco', actionTaken: null },
  { id: 100023, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'En origen', priority: 'Alta', recipient: 'Stefan Kramer', actionTaken: null },
  { id: 100024, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'En origen', priority: 'Media', recipient: 'Diana Bolocco', actionTaken: null },
  { id: 100025, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'En origen', priority: 'Baja', recipient: 'Martín Cárcamo', actionTaken: null },
  { id: 100026, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'En origen', priority: 'Media', recipient: 'Pancho Saavedra', actionTaken: null },
  { id: 100027, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'En origen', priority: 'Alta', recipient: 'Soledad Onetto', actionTaken: null },

  { id: 100030, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'En tránsito', priority: 'Media', recipient: 'Pablo Neruda', actionTaken: null },
  { id: 100031, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'En tránsito', priority: 'Baja', recipient: 'Gabriela Mistral', actionTaken: null },
  { id: 100032, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'En tránsito', priority: 'Alta', recipient: 'Violeta Parra', actionTaken: null },
  { id: 100033, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'En tránsito', priority: 'Media', recipient: 'Nicanor Parra', actionTaken: null },
  { id: 100034, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'En tránsito', priority: 'Baja', recipient: 'Vicente Huidobro', actionTaken: null },
  { id: 100035, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'En tránsito', priority: 'Media', recipient: 'Isabel Allende', actionTaken: null },
  { id: 100036, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'En tránsito', priority: 'Alta', recipient: 'Roberto Bolaño', actionTaken: null },
  { id: 100037, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'En tránsito', priority: 'Media', recipient: 'Jorge Edwards', actionTaken: null },
  { id: 100038, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'En tránsito', priority: 'Baja', recipient: 'Gonzalo Rojas', actionTaken: null },
  { id: 100039, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'En tránsito', priority: 'Alta', recipient: 'Alejandro Jodorowsky', actionTaken: null },
  { id: 100040, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'En tránsito', priority: 'Media', recipient: 'Raúl Zurita', actionTaken: null },
  { id: 100041, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'En tránsito', priority: 'Baja', recipient: 'Elicura Chihuailaf', actionTaken: null },

  { id: 100050, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'En destino', priority: 'Media', recipient: 'Claudio Arrau', actionTaken: null },
  { id: 100051, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'En destino', priority: 'Alta', recipient: 'Víctor Jara', actionTaken: null },
  { id: 100052, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'En destino', priority: 'Baja', recipient: 'Los Jaivas', actionTaken: null },
  { id: 100053, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'En destino', priority: 'Media', recipient: 'Los Prisioneros', actionTaken: null },
  { id: 100054, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'En destino', priority: 'Alta', recipient: 'Mon Laferte', actionTaken: null },
  { id: 100055, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'En destino', priority: 'Baja', recipient: 'Beto Cuevas', actionTaken: null },
  { id: 100056, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'En destino', priority: 'Media', recipient: 'Ana Tijoux', actionTaken: null },

  { id: 100060, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'Entregado', priority: 'Baja', recipient: 'Nicolás Massú', actionTaken: null },
  { id: 100061, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'Entregado', priority: 'Media', recipient: 'Fernando González', actionTaken: null },
  { id: 100062, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'Entregado', priority: 'Baja', recipient: 'Marcelo Ríos', actionTaken: null },
  { id: 100063, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'Entregado', priority: 'Media', recipient: 'Kristel Köbrich', actionTaken: null },
  { id: 100064, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'Entregado', priority: 'Alta', recipient: 'Bárbara Riveros', actionTaken: null },
  { id: 100065, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'Entregado', priority: 'Baja', recipient: 'Tomás González', actionTaken: null },
  { id: 100066, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'Entregado', priority: 'Media', recipient: 'Francisca Crovetto', actionTaken: null },
  { id: 100067, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'Entregado', priority: 'Baja', recipient: 'Yasmani Acosta', actionTaken: null },

  { id: 100070, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'Redestinado', priority: 'Media', recipient: 'Ignacio Valenzuela', actionTaken: 'Redestinado a Sucursal Providencia' },
  { id: 100071, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'Redestinado', priority: 'Baja', recipient: 'Claudio Palma', actionTaken: 'Redestinado a CD San Bernardo' },
  { id: 100072, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'Redestinado', priority: 'Alta', recipient: 'Aldo Schiappacasse', actionTaken: 'Redestinado a Domicilio Alternativo' },
  { id: 100073, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'Redestinado', priority: 'Media', recipient: 'Rodrigo Sepúlveda', actionTaken: 'Redestinado a Sucursal Las Condes' },

  { id: 100080, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'Otros', priority: 'Baja', recipient: 'Felipe Braun', actionTaken: null },
  { id: 100081, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'Otros', priority: 'Baja', recipient: 'Benjamín Vicuña', actionTaken: null },
  { id: 100082, account: 'Cta Cte 44379 — Cuenta Starkin', nCtaCte: '44379', status: 'Otros', priority: 'Baja', recipient: 'Jorge Zabaleta', actionTaken: null },

  // =========================================================================
  // 5. OTRAS CUENTAS (44380, 44381, 44382)
  // =========================================================================
  { id: 555666, account: 'Cta Cte 44380 — Hub Providencia', nCtaCte: '44380', status: 'Excepción', priority: 'Alta', reason: 'Dirección incorrecta', slaMinutes: 90, recipient: 'Gonzalo Jara', phone: '+56 9 5678 9012', actionTaken: null },
  { id: 555667, account: 'Cta Cte 44380 — Hub Providencia', nCtaCte: '44380', status: 'En gestión', priority: 'Media', reason: 'Cliente ausente', slaMinutes: 360, recipient: 'Claudia Conserva', phone: '+56 9 5678 9013', actionTaken: 'Coordinando reintento' },
  { id: 555668, account: 'Cta Cte 44380 — Hub Providencia', nCtaCte: '44380', status: 'Gestionado', priority: 'Baja', reason: 'Redestinación', slaMinutes: 1440, recipient: 'Pollo Valdivia', phone: '+56 9 5678 9014', actionTaken: 'Redestinado a Hub Providencia' },
  { id: 555669, account: 'Cta Cte 44380 — Hub Providencia', nCtaCte: '44380', status: 'En reparto', priority: 'Media', recipient: 'Julián Elfenbein', phone: '+56 9 5678 9015', actionTaken: null },

  { id: 333222, account: 'Cta Cte 44381 — Sucursal Concepción', nCtaCte: '44381', status: 'Excepción', priority: 'Media', reason: 'Cliente ausente', slaMinutes: 480, recipient: 'Patricia Maldonado', phone: '+56 9 6789 0123', actionTaken: null },
  { id: 333223, account: 'Cta Cte 44381 — Sucursal Concepción', nCtaCte: '44381', status: 'En gestión', priority: 'Alta', reason: 'Dirección incorrecta', slaMinutes: 120, recipient: 'Raquel Argandoña', phone: '+56 9 6789 0124', actionTaken: 'Validando calle' },
  { id: 333224, account: 'Cta Cte 44381 — Sucursal Concepción', nCtaCte: '44381', status: 'Gestionado', priority: 'Media', reason: 'Devolución', slaMinutes: 1440, recipient: 'Kel Calderón', phone: '+56 9 6789 0125', actionTaken: 'Devuelto a bodega Concepción' },
  { id: 333225, account: 'Cta Cte 44381 — Sucursal Concepción', nCtaCte: '44381', status: 'En reparto', priority: 'Baja', recipient: 'Nano Calderón', phone: '+56 9 6789 0126', actionTaken: null },

  { id: 111000, account: 'Cta Cte 44382 — CD Antofagasta', nCtaCte: '44382', status: 'Excepción', priority: 'Baja', reason: 'Rechazo entrega', slaMinutes: 1440, recipient: 'Roberto Belmar', phone: '+56 9 7890 1234', actionTaken: null },
  { id: 111001, account: 'Cta Cte 44382 — CD Antofagasta', nCtaCte: '44382', status: 'En gestión', priority: 'Alta', reason: 'Cliente ausente', slaMinutes: 60, recipient: 'Andrés Caniulef', phone: '+56 9 7890 1235', actionTaken: 'Reintento solicitado' },
  { id: 111002, account: 'Cta Cte 44382 — CD Antofagasta', nCtaCte: '44382', status: 'Gestionado', priority: 'Media', reason: 'Redestinación', slaMinutes: 1440, recipient: 'Michael Roldán', phone: '+56 9 7890 1236', actionTaken: 'Redestinado a Sucursal Antofagasta' },
  { id: 111003, account: 'Cta Cte 44382 — CD Antofagasta', nCtaCte: '44382', status: 'En reparto', priority: 'Media', recipient: 'Mariela Sotomayor', phone: '+56 9 7890 1237', actionTaken: null }
];

const INITIAL_ACCOUNTS_DATA = [
  {
    id: '44379',
    nombre: 'Cuenta Starkin',
    numero: '44379',
    sucursal: 'CD San Bernardo (Principal)',
    rut: '96.554.000-8',
    razonSocial: 'STARKEN S.A. / LOGISTICA EMPRESAS',
    tipoFacturacion: 'Crédito Cuenta Corriente 30 días',
    centroCosto: 'CC-STK-01',
    creditoDisponible: 14500000,
    creditoTotal: 20000000
  },
  {
    id: '44380',
    nombre: 'Hub Providencia',
    numero: '44380',
    sucursal: 'Hub Providencia E-Commerce',
    rut: '96.554.000-8',
    razonSocial: 'STARKEN S.A. / HUB RETAIL',
    tipoFacturacion: 'Crédito Cuenta Corriente 30 días',
    centroCosto: 'CC-STK-02',
    creditoDisponible: 8200000,
    creditoTotal: 10000000
  },
  {
    id: '44381',
    nombre: 'Sucursal Concepción',
    numero: '44381',
    sucursal: 'Sucursal Concepción Mayorista',
    rut: '96.554.000-8',
    razonSocial: 'STARKEN S.A. / BIOBIO DIST',
    tipoFacturacion: 'Crédito Cuenta Corriente 30 días',
    centroCosto: 'CC-STK-03',
    creditoDisponible: 6800000,
    creditoTotal: 10000000
  },
  {
    id: '44382',
    nombre: 'CD Antofagasta',
    numero: '44382',
    sucursal: 'Centro Distribución Antofagasta',
    rut: '96.554.000-8',
    razonSocial: 'STARKEN S.A. / NORTE GRANDE',
    tipoFacturacion: 'Crédito Cuenta Corriente 30 días',
    centroCosto: 'CC-STK-04',
    creditoDisponible: 11300000,
    creditoTotal: 15000000
  },
  {
    id: '44383',
    nombre: 'Hub Viña del Mar',
    numero: '44383',
    sucursal: 'Sucursal Viña Costa',
    rut: '96.554.000-8',
    razonSocial: 'STARKEN S.A. / VALPARAISO COSTA',
    tipoFacturacion: 'Crédito Cuenta Corriente 30 días',
    centroCosto: 'CC-STK-05',
    creditoDisponible: 5400000,
    creditoTotal: 8000000
  },
  {
    id: '44384',
    nombre: 'Sucursal Temuco',
    numero: '44384',
    sucursal: 'CD Temuco Industrial',
    rut: '96.554.000-8',
    razonSocial: 'STARKEN S.A. / ARAUCANIA DIST',
    tipoFacturacion: 'Crédito Cuenta Corriente 30 días',
    centroCosto: 'CC-STK-06',
    creditoDisponible: 7900000,
    creditoTotal: 10000000
  },
  {
    id: '44385',
    nombre: 'Puerto Montt Logística',
    numero: '44385',
    sucursal: 'Hub Puerto Montt Llanquihue',
    rut: '96.554.000-8',
    razonSocial: 'STARKEN S.A. / SUR AUSTRAL',
    tipoFacturacion: 'Crédito Cuenta Corriente 30 días',
    centroCosto: 'CC-STK-07',
    creditoDisponible: 9100000,
    creditoTotal: 12000000
  },
  {
    id: '44386',
    nombre: 'Hub La Serena',
    numero: '44386',
    sucursal: 'Sucursal La Serena Elqui',
    rut: '96.554.000-8',
    razonSocial: 'STARKEN S.A. / NORTE CHICO',
    tipoFacturacion: 'Crédito Cuenta Corriente 30 días',
    centroCosto: 'CC-STK-08',
    creditoDisponible: 4600000,
    creditoTotal: 6000000
  },
  {
    id: '44387',
    nombre: 'Sucursal Iquique Zofri',
    numero: '44387',
    sucursal: 'CD Iquique Puerto',
    rut: '96.554.000-8',
    razonSocial: 'STARKEN S.A. / TARAPACA TRADE',
    tipoFacturacion: 'Crédito Cuenta Corriente 30 días',
    centroCosto: 'CC-STK-09',
    creditoDisponible: 13200000,
    creditoTotal: 15000000
  },
  {
    id: '44388',
    nombre: 'Santiago Centro Hub',
    numero: '44388',
    sucursal: 'Hub Santiago Corporativo',
    rut: '96.554.000-8',
    razonSocial: 'STARKEN S.A. / SANTIAGO CENTRO',
    tipoFacturacion: 'Crédito Cuenta Corriente 30 días',
    centroCosto: 'CC-STK-10',
    creditoDisponible: 16800000,
    creditoTotal: 25000000
  }
];

export default function App() {
  const [accountsList, setAccountsList] = useState(INITIAL_ACCOUNTS_DATA);
  const [selectedAccount, setSelectedAccount] = useState('Cta Cte 44379 — Cuenta Starkin');
  const [activeMenu, setActiveMenu] = useState('dashboard'); // 'dashboard', 'mis-cuentas', 'seguimiento', etc.
  const [activeTab, setActiveTab] = useState('Mis envíos'); // "Mis envíos" or "Mis gestiones"
  const [searchTerm, setSearchTerm] = useState('');
  const [trackingOfQuery, setTrackingOfQuery] = useState('');
  
  // App state for shipments
  const [shipments, setShipments] = useState(INITIAL_SHIPMENTS);

  // Active tracking OF selection
  const [selectedOF, setSelectedOF] = useState(275161618);

  // Favorites state for Panel de Control
  const [favorites, setFavorites] = useState([
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

  const handleToggleFavorite = (shipment) => {
    setFavorites(prev => {
      const exists = prev.some(f => f.id === shipment.id);
      if (exists) {
        showToast(`OF #${shipment.id} quitada de favoritos.`, 'info');
        return prev.filter(f => f.id !== shipment.id);
      } else {
        showToast(`OF #${shipment.id} agregada a favoritos.`, 'success');
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
  };

  // Modal State
  const [modalState, setModalState] = useState({ isOpen: false, type: '', ids: [] });

  // Toast alert notification state
  const [toastMessage, setToastMessage] = useState(null);
  const toastTimeoutRef = useRef(null);

  // Sidebar Collapse/Toggle States
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Filtered shipments by account with smart fallback
  const accountShipments = useMemo(() => {
    const match = (selectedAccount || '').match(/\d+/);
    const accountCode = match ? match[0] : '44379';
    
    const filtered = shipments.filter(s => 
      s.account === selectedAccount || 
      (s.account && s.account.includes(accountCode)) ||
      s.nCtaCte === accountCode
    );

    return filtered.length > 0 ? filtered : shipments.filter(s => s.account.includes('44379') || s.nCtaCte === '44379');
  }, [shipments, selectedAccount]);

  const showToast = (message, type = 'success') => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToastMessage({ message, type });
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 5000);
  };

  const handleCloseToast = () => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToastMessage(null);
  };

  const handleTriggerAction = (type, ids) => {
    setModalState({ isOpen: true, type, ids });
  };

  const handleSearchOF = (ofNumber) => {
    setTrackingOfQuery(ofNumber);
    setActiveMenu('seguimiento');
  };

  const handleModalConfirm = (type, ids, formData) => {
    setShipments(prev => prev.map(s => {
      if (ids.includes(s.id)) {
        let actionDesc = '';
        let newStatus = s.status;
        
        if (type === 'redestinar') {
          actionDesc = `Redestinado a ${formData.direccion}, ${formData.comuna}`;
          newStatus = 'Redestinado';
        } else if (type === 'reparto') {
          actionDesc = `Salida a reparto confirmada — ${formData.direccion} ${formData.numeracion}, ${formData.comuna}`;
          newStatus = 'En reparto';
        } else if (type === 'devolver') {
          actionDesc = `Devolución solicitada hacia bodega de origen`;
          newStatus = 'Devuelto';
        }

        return {
          ...s,
          status: newStatus,
          actionTaken: actionDesc,
          recipient: formData.nombre || s.recipient,
          phone: formData.telefono || s.phone
        };
      }
      return s;
    }));

    setModalState({ isOpen: false, type: '', ids: [] });
    showToast(`Se ha guardado la gestión de ${ids.length} orden(es) de flete exitosamente.`, 'success');
  };

  const handleCompleteGestion = (id) => {
    setShipments(prev => prev.map(s => {
      if (s.id === id) {
        return { ...s, status: 'Gestionado' };
      }
      return s;
    }));
    showToast(`Se ha finalizado la gestión de la orden ${id} exitosamente.`, 'success');
  };

  const handleExport = (ids) => {
    const listToExport = ids.length > 0 
      ? shipments.filter(s => ids.includes(s.id)) 
      : accountShipments.filter(s => s.status === 'Excepción');

    const headers = 'ID,Cuenta,Estado,Prioridad,Motivo,SLA (minutos),Destinatario,Accion Realizada\n';
    const csvContent = headers + listToExport.map(s => 
      `${s.id},"${s.account}","${s.status}","${s.priority}","${s.reason}",${s.slaMinutes || 0},"${s.recipient}","${s.actionTaken || 'Ninguna'}"`
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `reporte_excepciones_starken_${selectedAccount.replace(/ /g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Se ha descargado el reporte CSV con ${listToExport.length} envíos.`, 'info');
  };

  return (
    <div className="h-screen overflow-hidden bg-starken-bg flex font-sans antialiased text-starken-text-dark">
      
      {/* Mobile Sidebar backdrop overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-25 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar controls - Dark Teal design matching Starken Pro */}
      <Sidebar 
        activeMenu={activeMenu} 
        setActiveMenu={setActiveMenu} 
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        isOpen={isMobileSidebarOpen}
        setIsOpen={setIsMobileSidebarOpen}
      />

      {/* Right Column: Top Header and dynamic content viewport */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        
        {/* Top Header navbar with search and dropdowns */}
        <Header 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onSearchOF={handleSearchOF}
          toggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        />

        {/* Dynamic content viewport area */}
        <main className="flex-1 overflow-y-auto bg-starken-bg">
          <div className="max-w-7xl mx-auto p-5 md:p-8 space-y-6 w-full">
          
            {/* Dynamic Title Banner based on active menu */}
            {activeMenu === 'dashboard' && (
              <div className="bg-gradient-to-r from-[#1e4f5e] via-[#33798C] to-[#266373] rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
                {/* Subtle decorative circular shapes */}
                <div className="absolute -right-16 -bottom-16 w-72 h-72 rounded-full bg-white/5 pointer-events-none" />
                <div className="absolute right-36 -top-16 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
                <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full border border-white/10 pointer-events-none" />
                <div className="absolute right-72 -bottom-20 w-40 h-40 rounded-full bg-white/[0.03] pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-1.5 max-w-2xl">
                    <h1 className="text-2xl sm:text-3xl font-black font-din tracking-tight text-white">
                      Excepciones de última milla
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-100/90 font-medium font-sans">
                      Accede, monitorea y gestiona todas las excepciones de tus órdenes de flete en tránsito con trazabilidad en tiempo real.
                    </p>
                  </div>

                  {/* Quick Stats Grid matching Seguimiento design */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 shrink-0">
                    <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-xl p-3 text-center min-w-[100px]">
                      <div className="text-[10px] font-bold tracking-wider text-slate-200 font-sans">Total monitoreo</div>
                      <div className="text-2xl font-black font-din mt-0.5 text-white">{accountShipments.length || 24}</div>
                      <div className="text-[10px] text-emerald-300 font-medium font-sans">Últimos 7 días</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-xl p-3 text-center min-w-[100px]">
                      <div className="text-[10px] font-bold tracking-wider text-slate-200 font-sans">En reparto</div>
                      <div className="text-2xl font-black font-din mt-0.5 text-amber-300">
                        {accountShipments.filter(s => s.status === 'En reparto' || s.status === 'Redestinado').length || 14}
                      </div>
                      <div className="text-[10px] text-amber-200 font-medium font-sans">En ruta hoy</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-xl p-3 text-center min-w-[100px]">
                      <div className="text-[10px] font-bold tracking-wider text-slate-200 font-sans">Gestionadas</div>
                      <div className="text-2xl font-black font-din mt-0.5 text-emerald-300">
                        {accountShipments.filter(s => s.status === 'Gestionado' || s.status === 'Devuelto' || Boolean(s.actionTaken)).length || 12}
                      </div>
                      <div className="text-[10px] text-emerald-200 font-medium font-sans">En resolución</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-xl p-3 text-center min-w-[100px]">
                      <div className="text-[10px] font-bold tracking-wider text-slate-200 font-sans">Prioridad alta</div>
                      <div className="text-2xl font-black font-din mt-0.5 text-orange-300">
                        {accountShipments.filter(s => s.priority === 'Alta' || s.priority === 'Crítica').length || 6}
                      </div>
                      <div className="text-[10px] text-orange-200 font-medium font-sans">SLA urgente</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Active Navigation Views router */}
            {activeMenu === 'dashboard' ? (
              <div className="space-y-6">
                {/* Sub-tab Navigation Header matching Operación and Legal y Financiero */}
                <div className="bg-white rounded-xl border border-starken-border p-1.5 shadow-xs flex flex-wrap gap-1.5 font-din">
                  <button
                    onClick={() => setActiveTab('Mis envíos')}
                    className={`flex-1 min-w-[170px] py-2.5 px-4 rounded-lg text-xs font-bold tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                      activeTab === 'Mis envíos' 
                        ? 'bg-[#33798C] text-white shadow-xs' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                  >
                    <Package size={15} />
                    <span>Mis envíos</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('Mis gestiones')}
                    className={`flex-1 min-w-[170px] py-2.5 px-4 rounded-lg text-xs font-bold tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                      activeTab === 'Mis gestiones' 
                        ? 'bg-[#33798C] text-white shadow-xs' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                  >
                    <SlidersHorizontal size={15} />
                    <span>Mis gestiones</span>
                  </button>
                </div>

                {/* Dynamic Tab Body selection */}
                {activeTab === 'Mis envíos' ? (
                  <MisEnvíosTab 
                    shipmentsData={accountShipments} 
                    favorites={favorites}
                    onToggleFavorite={handleToggleFavorite}
                    onSearchOF={handleSearchOF}
                  />
                ) : (
                  <MisGestionesTab 
                    shipmentsData={accountShipments} 
                    onTriggerAction={handleTriggerAction}
                    onExport={handleExport}
                    selectedOF={selectedOF}
                    setSelectedOF={setSelectedOF}
                    onCompleteGestion={handleCompleteGestion}
                    favorites={favorites}
                    onToggleFavorite={handleToggleFavorite}
                  />
                )}
              </div>
            ) : activeMenu === 'mis-cuentas' ? (
              <MisCuentasView 
                accountsList={accountsList}
                setAccountsList={setAccountsList}
                selectedAccount={selectedAccount}
                setSelectedAccount={setSelectedAccount}
                showToast={showToast}
              />
            ) : activeMenu === 'retiros' ? (
              <RetirosView 
                selectedAccount={selectedAccount}
                showToast={showToast}
              />
            ) : activeMenu === 'emision' ? (
              <EmisionView 
                selectedAccount={selectedAccount}
                onSwitchToTracking={handleSearchOF}
                showToast={showToast}
              />
            ) : activeMenu === 'cotizador' ? (
              <CotizadorView 
                selectedAccount={selectedAccount}
                showToast={showToast}
                onSelectTariffForEmission={() => setActiveMenu('emision')}
              />
            ) : activeMenu === 'ecommerce-apis' ? (
              <EcommerceApisView 
                selectedAccount={selectedAccount}
                showToast={showToast}
              />
            ) : activeMenu === 'seguimiento' ? (
              <SeguimientoView 
                initialOfQuery={trackingOfQuery} 
                selectedAccount={selectedAccount}
                onSwitchToGestion={() => {
                  setActiveMenu('dashboard');
                  setActiveTab('Mis gestiones');
                }}
                onTriggerAction={handleTriggerAction}
              />
            ) : activeMenu === 'legal-financiero' ? (
              <LegalFinancieroView
                selectedAccount={selectedAccount}
                showToast={showToast}
              />
            ) : activeMenu === 'postventa-soporte' ? (
              <PostventaSoporteView
                selectedAccount={selectedAccount}
                showToast={showToast}
              />
            ) : (
              // Informes view fallback
              <div className="bg-white rounded-2xl border border-starken-border p-8 shadow-sm text-center space-y-4 max-w-lg mx-auto mt-12">
                <div className="w-14 h-14 rounded-2xl bg-[#ECF5F7] text-[#33798C] flex items-center justify-center mx-auto border border-[#C2DFE7] shadow-xs">
                  <Info size={28} />
                </div>
                <h3 className="font-black text-xl text-slate-800 font-din tracking-wide">Módulo de Informes Starken Pro</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold font-sans">
                  Genera estadísticas consolidadas, tiempos de resolución de incidencias, SLA por comuna e informes consolidados mensuales.
                </p>
                <button 
                  onClick={() => handleExport([])}
                  className="btn btn-primary space-x-2 cursor-pointer"
                >
                  <RefreshCw size={14} />
                  <span>Descargar reporte completo CSV</span>
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Floating Action Modal dialogue overlays */}
      <ActionModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, type: '', ids: [] })}
        actionType={modalState.type}
        selectedIds={modalState.ids}
        onConfirm={handleModalConfirm}
      />

      {/* Interactive Toast Notifications with Close Button */}
      {toastMessage && (
        <div className={`fixed bottom-6 z-50 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] md:w-auto md:left-auto md:right-6 md:translate-x-0 p-3.5 sm:p-4 rounded-xl shadow-2xl border flex items-center justify-between gap-3 max-w-sm sm:max-w-md animate-in fade-in slide-in-from-bottom-5 duration-300 ${
          toastMessage.type === 'success' 
            ? 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]' 
            : 'bg-[#ECF5F7] text-[#1e4f5e] border-[#C2DFE7]'
        }`}>
          <div className="flex items-center gap-2.5 min-w-0">
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="text-[#10B981] shrink-0" size={20} />
            ) : (
              <AlertCircle className="text-[#33798C] shrink-0" size={20} />
            )}
            <span className="text-xs font-bold leading-normal font-sans">{toastMessage.message}</span>
          </div>

          <button
            onClick={handleCloseToast}
            className={`p-1 rounded-lg transition-colors cursor-pointer shrink-0 ${
              toastMessage.type === 'success'
                ? 'hover:bg-[#D1FAE5] text-[#065F46]/70 hover:text-[#065F46]'
                : 'hover:bg-[#D5EAF0] text-[#1e4f5e]/70 hover:text-[#1e4f5e]'
            }`}
            title="Cerrar notificación"
            aria-label="Cerrar notificación"
          >
            <X size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
