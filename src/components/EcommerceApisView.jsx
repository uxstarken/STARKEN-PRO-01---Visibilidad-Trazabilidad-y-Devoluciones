import React, { useState } from 'react';
import { 
  Store, 
  Code2, 
  CheckCircle2, 
  Printer, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles,
  Zap,
  RefreshCw
} from 'lucide-react';

const INITIAL_ECOMMERCE_ORDERS = [
  { id: 'ORD-1092', store: 'Shopify Store', orderNumber: '#1092', customer: 'Fernanda Valenzuela', rut: '16.492.381-8', destination: 'Las Condes, Santiago', items: '2x Smartwatch Pro V2', value: '$189.980', date: 'Hace 15 min', status: 'Listo para emitir' },
  { id: 'ORD-1091', store: 'WooCommerce B2B', orderNumber: '#WC-8840', customer: 'Distribuidora del Sur SpA', rut: '76.492.118-K', destination: 'Concepción Centro', items: '5x Router Industrial 5G', value: '$450.000', date: 'Hace 32 min', status: 'Listo para emitir' },
  { id: 'ORD-1090', store: 'Shopify Store', orderNumber: '#1091', customer: 'Mauricio Palma G.', rut: '14.882.391-4', destination: 'Viña del Mar', items: '1x Teclado Mecánico RGB', value: '$65.000', date: 'Hace 1 hr', status: 'Listo para emitir' },
  { id: 'ORD-1089', store: 'Mercado Libre', orderNumber: '#MLB-77192', customer: 'Camila Andrea Soto', rut: '17.910.482-5', destination: 'La Serena', items: '1x Cámara de Seguridad WiFi', value: '$42.990', date: 'Hace 2 hrs', status: 'Listo para emitir' }
];

export default function EcommerceApisView({ selectedAccount, showToast }) {
  const [ecommerceOrders, setEcommerceOrders] = useState(INITIAL_ECOMMERCE_ORDERS);
  const [selectedOrders, setSelectedOrders] = useState(['ORD-1092', 'ORD-1091']);
  const [activeApiTab, setActiveApiTab] = useState('curl');
  const [copiedApiKey, setCopiedApiKey] = useState(false);

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
      
      {/* 1. Header Hero Banner */}
      <div className="bg-gradient-to-r from-[#1e4f5e] via-[#33798C] to-[#266373] rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute -right-16 -bottom-16 w-72 h-72 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute right-36 -top-16 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full border border-white/10 pointer-events-none" />
        <div className="absolute right-72 -bottom-20 w-40 h-40 rounded-full bg-white/[0.03] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <h1 className="text-2xl sm:text-3xl font-black font-din tracking-tight text-white">
              E-commerce y APIs
            </h1>
            <p className="text-xs sm:text-sm text-slate-100/90 font-medium font-sans leading-relaxed">
              Conecta tu tienda online con Shopify, WooCommerce y Mercado Libre o integra nuestra API REST B2B para emitir y rastrear de forma automatizada.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3.5 py-2 rounded-xl text-xs font-sans font-bold self-start sm:self-auto shrink-0 shadow-xs">
            <CheckCircle2 size={16} className="text-emerald-600" />
            <span>2 tiendas conectadas</span>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-xl border border-starken-border p-5 sm:p-6 space-y-6 shadow-xs">
        
        {/* Store Connection Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-din font-bold text-xs text-slate-900">Shopify</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <div className="text-[11px] text-emerald-700 font-bold font-sans">Sincronizado</div>
            <div className="text-[10px] text-slate-400 font-sans">Última sync hace 4 min</div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-din font-bold text-xs text-slate-900">WooCommerce</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <div className="text-[11px] text-emerald-700 font-bold font-sans">Sincronizado</div>
            <div className="text-[10px] text-slate-400 font-sans">Plugin v3.4.1 activo</div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-din font-bold text-xs text-slate-900">Mercado Libre</span>
              <span className="w-2 h-2 rounded-full bg-slate-300" />
            </div>
            <div className="text-[11px] text-slate-600 font-bold font-sans">Disponible</div>
            <button 
              onClick={() => showToast && showToast('Abriendo flujo de autenticación Mercado Libre...', 'info')}
              className="text-[10px] text-[#33798C] font-bold underline cursor-pointer"
            >
              Conectar tienda
            </button>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-din font-bold text-xs text-slate-900">VTEX / Magento</span>
              <span className="w-2 h-2 rounded-full bg-slate-300" />
            </div>
            <div className="text-[11px] text-slate-600 font-bold font-sans">API REST</div>
            <button 
              onClick={() => showToast && showToast('Descargando documentación de plugins para VTEX / Magento...', 'info')}
              className="text-[10px] text-[#33798C] font-bold underline cursor-pointer"
            >
              Ver plugin
            </button>
          </div>
        </div>

        {/* Synced Orders Table */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Store size={16} className="text-[#33798C]" />
              <h3 className="font-din font-bold text-xs text-slate-800 tracking-wider">
                Pedidos pendientes de despacho ({ecommerceOrders.length})
              </h3>
            </div>

            <button
              onClick={handleFulfillEcommerce}
              disabled={selectedOrders.length === 0}
              className={`px-4 py-2 rounded-xl font-din font-bold text-xs tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedOrders.length > 0
                  ? 'bg-[#33798C] hover:bg-[#1e4f5e] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Printer size={14} />
              <span>Generar etiquetas para {selectedOrders.length} pedido(s)</span>
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
                  <th className="p-2.5">Pedido / tienda</th>
                  <th className="p-2.5">Destinatario</th>
                  <th className="p-2.5">Comuna destino</th>
                  <th className="p-2.5">Contenido</th>
                  <th className="p-2.5">Total venta</th>
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
                <h3 className="font-din font-bold text-sm tracking-wide">API B2B StarkenPro — Guía de conexión rápida</h3>
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
    "origin": { "comuna": "San Bernardo" },
    "destination": { "comuna": "Concepción", "address": "Av. Los Carrera 1420" },
    "recipient": { "name": "Fernanda Valenzuela", "rut": "16.492.381-8", "phone": "+56984753622" },
    "packages": [{ "weight": 2.5, "declaredValue": 189980 }],
    "service": "express"
  }'`}
            </pre>
          </div>
        </div>

      </div>

    </div>
  );
}
