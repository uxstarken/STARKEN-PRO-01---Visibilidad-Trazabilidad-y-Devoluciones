import React, { useState, useEffect, useMemo } from 'react';
import { 
  CreditCard, 
  Check, 
  Lock, 
  Pencil, 
  Building2, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Store,
  Sparkles,
  ArrowRight,
  Search,
  X,
  LayoutGrid,
  Rows3,
  ChevronLeft,
  ChevronRight,
  Wallet
} from 'lucide-react';

export default function MisCuentasView({
  accountsList,
  setAccountsList,
  selectedAccount,
  setSelectedAccount,
  showToast
}) {
  // Find current active account ID from selectedAccount string (e.g. "Cta Cte 44379 — Cuenta Starkin")
  const activeCodeMatch = (selectedAccount || '').match(/\d+/);
  const activeAccountId = activeCodeMatch ? activeCodeMatch[0] : (accountsList[0]?.id || '44379');

  // Currently inspected account in the view (defaults to active account)
  const [inspectedAccountId, setInspectedAccountId] = useState(activeAccountId);

  // Search and view mode controls
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('detailed'); // 'detailed' | 'compact'
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  // When activeAccountId changes from outside, sync inspected account
  useEffect(() => {
    if (activeAccountId) {
      setInspectedAccountId(activeAccountId);
    }
  }, [activeAccountId]);

  // Filter accounts by name/alias or account number
  const filteredAccounts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return accountsList;
    return accountsList.filter(acc => 
      (acc.nombre && acc.nombre.toLowerCase().includes(term)) ||
      (acc.numero && acc.numero.includes(term)) ||
      (acc.sucursal && acc.sucursal.toLowerCase().includes(term))
    );
  }, [accountsList, searchTerm]);

  // Pagination for detailed view
  const totalPages = Math.max(1, Math.ceil(filteredAccounts.length / ITEMS_PER_PAGE));

  // Reset to page 1 if current page becomes out of bounds after filtering
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const pagedAccounts = useMemo(() => {
    if (viewMode === 'compact') {
      return filteredAccounts;
    }
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAccounts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAccounts, currentPage, viewMode]);

  // The account object currently being viewed in detail
  const currentAccount = accountsList.find(a => a.id === inspectedAccountId) || accountsList[0] || {};

  // The globally active account object for the entire portal
  const globallyActiveAccount = accountsList.find(a => a.id === activeAccountId) || accountsList[0] || {};

  // Local editable state for the only editable field: "nombre" (alias)
  const [aliasValue, setAliasValue] = useState(currentAccount.nombre || '');
  const [isSavedRecently, setIsSavedRecently] = useState(false);

  // Sync aliasValue when inspected account changes
  useEffect(() => {
    if (currentAccount?.nombre) {
      setAliasValue(currentAccount.nombre);
      setIsSavedRecently(false);
    }
  }, [inspectedAccountId, currentAccount?.nombre]);

  // Handler to select account globally for the portal
  const handleSelectActiveAccount = (acc) => {
    const fullLabel = `Cta Cte ${acc.numero} — ${acc.nombre}`;
    setSelectedAccount(fullLabel);
    if (showToast) {
      showToast(`Cuenta activa cambiada a: ${acc.nombre} (${acc.numero})`, 'info');
    }
  };

  // Handler to save the edited alias
  const handleSaveAlias = (e) => {
    e.preventDefault();
    const trimmed = aliasValue.trim();
    if (!trimmed) {
      if (showToast) showToast('El nombre o alias de la cuenta no puede estar vacío.', 'error');
      return;
    }

    // Update the accounts list in state
    setAccountsList(prev => prev.map(a => {
      if (a.id === currentAccount.id) {
        return { ...a, nombre: trimmed };
      }
      return a;
    }));

    // If this account is the globally active one, update selectedAccount string as well
    if (currentAccount.id === activeAccountId) {
      setSelectedAccount(`Cta Cte ${currentAccount.numero} — ${trimmed}`);
    }

    setIsSavedRecently(true);
    setTimeout(() => setIsSavedRecently(false), 3000);

    if (showToast) {
      showToast(`Nombre / alias de la cuenta corriente ${currentAccount.numero} actualizado con éxito.`, 'success');
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
              Mis cuentas
            </h1>
            <p className="text-xs sm:text-sm text-slate-100/90 font-medium font-sans leading-relaxed">
              Visualiza tus cuentas corrientes Starken Pro asociadas, selecciona la cuenta activa para operar y personaliza el nombre o alias de cada una.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-white/10 border border-white/20 rounded-xl p-3 text-center min-w-[130px] backdrop-blur-xs">
              <div className="text-[10px] text-slate-200 font-din font-bold uppercase tracking-wider">Cuentas vinculadas</div>
              <div className="text-2xl font-black font-din text-white">{accountsList.length}</div>
            </div>
            <div className="bg-white/10 border border-white/20 rounded-xl p-3 text-center min-w-[150px] backdrop-blur-xs">
              <div className="text-[10px] text-slate-200 font-din font-bold uppercase tracking-wider">Cuenta en uso</div>
              <div className="text-sm font-black font-din text-[#A7F3D0] truncate max-w-[140px]" title={globallyActiveAccount.nombre}>
                {globallyActiveAccount.nombre || 'Cuenta activa'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Two-Column Layout: Left (Accounts Selector) & Right (Account Details Inputs) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: List of available accounts to select (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xl border border-starken-border p-5 space-y-4 shadow-xs">
            
            {/* Header: Title and Subtitle (Badge removed as requested) */}
            <div>
              <h2 className="text-sm font-bold font-din text-slate-900 flex items-center gap-2">
                <CreditCard size={16} className="text-[#33798C]" />
                <span>Cuentas disponibles</span>
              </h2>
              <p className="text-xs text-slate-500 font-sans mt-0.5">
                Haz clic en una cuenta para revisar sus datos o en "Usar esta cuenta" para activarla.
              </p>
            </div>

            {/* Toolbar: Search input + View mode toggle buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1 border-t border-slate-100">
              
              {/* Search Input */}
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Buscar por nombre o N° de cuenta..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-8 pr-7 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-[#33798C] focus:ring-1 focus:ring-[#33798C] transition-all font-sans"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm('');
                      setCurrentPage(1);
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer transition-colors"
                    title="Limpiar búsqueda"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>

              {/* View Mode Toggle Buttons (Detailed vs Compact - Icon only) */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80 shrink-0 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => setViewMode('detailed')}
                  className={`p-1.5 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                    viewMode === 'detailed'
                      ? 'bg-[#33798C] text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="Visualización detallada"
                  aria-label="Visualización detallada"
                >
                  <Rows3 size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('compact')}
                  className={`p-1.5 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                    viewMode === 'compact'
                      ? 'bg-[#33798C] text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="Visualización compacta"
                  aria-label="Visualización compacta"
                >
                  <LayoutGrid size={15} />
                </button>
              </div>

            </div>

            {/* Empty search results message */}
            {filteredAccounts.length === 0 && (
              <div className="py-8 text-center space-y-2 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                <CreditCard size={28} className="mx-auto text-slate-300" />
                <p className="text-xs font-bold font-din text-slate-700">
                  No se encontraron cuentas para "{searchTerm}"
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    setCurrentPage(1);
                  }}
                  className="text-xs font-din font-bold text-[#33798C] hover:underline cursor-pointer"
                >
                  Limpiar búsqueda
                </button>
              </div>
            )}

            {/* ======================================================== */}
            {/* VIEW MODE 1: CARDS GRANDES / DETALLADAS (5 POR PÁGINA)   */}
            {/* ======================================================== */}
            {viewMode === 'detailed' && filteredAccounts.length > 0 && (
              <div className="space-y-3">
                <div className="space-y-2.5">
                  {pagedAccounts.map((acc) => {
                    const isGloballyActive = acc.id === activeAccountId;
                    const isInspected = acc.id === currentAccount.id;

                    return (
                      <div
                        key={acc.id}
                        onClick={() => {
                          setInspectedAccountId(acc.id);
                        }}
                        className={`rounded-xl p-3.5 sm:p-4 transition-all cursor-pointer relative overflow-hidden border ${
                          isGloballyActive && isInspected
                            ? 'border-2 border-[#33798C] bg-[#F4F9FB] shadow-xs'
                            : isGloballyActive
                            ? 'border-2 border-emerald-600/60 bg-[#F4F9FB]/60 shadow-xs'
                            : isInspected
                            ? 'border-2 border-[#33798C] bg-white ring-2 ring-[#33798C]/20 shadow-xs'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70 shadow-2xs'
                        }`}
                      >
                        <div className="flex items-stretch justify-between gap-3 min-h-[66px]">
                          {/* Avatar initial circle + text info con separación armónica */}
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className={`w-9.5 h-9.5 rounded-xl font-din font-black text-xs flex items-center justify-center shrink-0 shadow-inner transition-colors ${
                              isGloballyActive 
                                ? 'bg-[#1e4f5e] text-white' 
                                : isInspected
                                  ? 'bg-[#33798C] text-white'
                                  : 'bg-slate-100 text-slate-600'
                            }`}>
                              {acc.nombre?.charAt(0)?.toUpperCase() || 'C'}
                            </div>

                            <div className="min-w-0 flex-1 flex flex-col justify-center space-y-1 py-0.5">
                              <h3 className="font-din font-bold text-[13.5px] text-slate-900 truncate leading-snug">
                                {acc.nombre}
                              </h3>
                              
                              <div className="text-xs font-mono font-bold text-[#33798C] leading-none">
                                Cta Cte: {acc.numero}
                              </div>

                              <div className="text-[11px] text-slate-500 font-sans truncate leading-none">
                                {acc.sucursal || acc.razonSocial}
                              </div>
                            </div>
                          </div>

                          {/* Botón arriba y Crédito disponible al fondo, distribuidos armónicamente */}
                          <div className="flex flex-col items-end justify-between self-stretch shrink-0 py-0.5">
                            {isGloballyActive ? (
                              <div 
                                className="text-[11px] font-din font-bold text-emerald-800 bg-emerald-50 border border-emerald-300/80 px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-2xs cursor-default"
                                title="Cuenta actualmente activa y preseleccionada en Starken Pro"
                              >
                                <Check size={12} className="stroke-[3] text-emerald-600" />
                                <span>Activa</span>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setInspectedAccountId(acc.id);
                                  handleSelectActiveAccount(acc);
                                }}
                                className="text-[11px] font-din font-bold text-[#33798C] hover:text-white bg-[#ECF5F7] hover:bg-[#33798C] px-3 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 border border-[#C2DFE7] hover:border-transparent shadow-2xs"
                                title="Establecer como cuenta activa preseleccionada"
                              >
                                <span>Usar esta cuenta</span>
                                <ArrowRight size={11} />
                              </button>
                            )}

                            {/* Crédito disponible ubicado al fondo con separación natural */}
                            <div className="flex items-center gap-1.5 text-xs font-din">
                              <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Crédito disp:</span>
                              <span className="text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-2 py-0.5 rounded-md">
                                ${(acc.creditoDisponible || 10000000).toLocaleString('es-CL')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination Controls (5 per page) */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs font-din font-bold text-slate-600">
                    <div className="text-[11px] text-slate-400 font-medium font-sans">
                      {(currentPage - 1) * ITEMS_PER_PAGE + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredAccounts.length)} de {filteredAccounts.length} cuentas
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        className="p-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                        title="Página anterior"
                      >
                        <ChevronLeft size={14} />
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          type="button"
                          onClick={() => setCurrentPage(page)}
                          className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            currentPage === page
                              ? 'bg-[#33798C] text-white shadow-xs'
                              : 'text-slate-600 hover:bg-slate-100 border border-slate-200'
                          }`}
                        >
                          {page}
                        </button>
                      ))}

                      <button
                        type="button"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        className="p-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                        title="Página siguiente"
                      >
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ======================================================== */}
            {/* VIEW MODE 2: CARDS PEQUEÑAS / COMPACTAS (MÁS EN PANTALLA) */}
            {/* ======================================================== */}
            {viewMode === 'compact' && filteredAccounts.length > 0 && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[580px] overflow-y-auto pr-1">
                  {filteredAccounts.map((acc) => {
                    const isGloballyActive = acc.id === activeAccountId;
                    const isInspected = acc.id === currentAccount.id;

                    return (
                      <div
                        key={acc.id}
                        onClick={() => {
                          setInspectedAccountId(acc.id);
                        }}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isGloballyActive && isInspected
                            ? 'border-2 border-[#33798C] bg-[#F4F9FB] shadow-xs'
                            : isGloballyActive
                            ? 'border-2 border-emerald-600/60 bg-[#F4F9FB]/60 shadow-xs'
                            : isInspected
                            ? 'border-2 border-[#33798C] bg-white ring-2 ring-[#33798C]/20 shadow-xs'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70 shadow-2xs'
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <h4 className="font-din font-bold text-xs text-slate-900 truncate leading-snug" title={acc.nombre}>
                            {acc.nombre}
                          </h4>
                          <div className="text-[10px] font-mono font-bold text-[#33798C] mt-0.5">
                            Cta {acc.numero}
                          </div>
                        </div>

                        <div className="shrink-0">
                          {isGloballyActive ? (
                            <div 
                              className="text-[10px] font-din font-bold text-emerald-800 bg-emerald-50 border border-emerald-300/80 px-2.5 py-1 rounded-md flex items-center gap-1 shadow-2xs cursor-default"
                              title="Cuenta actualmente activa"
                            >
                              <Check size={11} className="stroke-[3] text-emerald-600" />
                              <span>Activa</span>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setInspectedAccountId(acc.id);
                                handleSelectActiveAccount(acc);
                              }}
                              className="text-[10px] font-din font-bold text-[#33798C] hover:text-white bg-[#ECF5F7] hover:bg-[#33798C] px-2.5 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1 border border-[#C2DFE7] hover:border-transparent shadow-2xs"
                              title="Establecer como cuenta activa"
                            >
                              <span>Usar</span>
                              <ArrowRight size={10} />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="text-[11px] text-slate-400 font-medium font-sans text-right pt-1">
                  Total: {filteredAccounts.length} cuentas disponibles
                </div>
              </div>
            )}

          </div>
        </div>

        {/* RIGHT COLUMN: Account Details Form & Editable Alias (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-xl border border-starken-border p-5 sm:p-6 space-y-6 shadow-xs">
            
            {/* Header of Detail Card */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider font-sans bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                    Ficha de Cuenta
                  </span>
                  {currentAccount.id === activeAccountId ? (
                    <span className="text-[10px] font-bold font-sans bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded flex items-center gap-1">
                      <Check size={10} className="stroke-[3]" />
                      <span>Cuenta activa en portal</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold font-sans bg-sky-50 text-[#1e4f5e] border border-[#C2DFE7] px-2 py-0.5 rounded flex items-center gap-1">
                      <span>Revisando información</span>
                    </span>
                  )}
                </div>
                <h2 className="text-lg font-black font-din text-slate-900 mt-1">
                  {currentAccount.nombre}
                </h2>
                <p className="text-xs text-slate-500 font-sans font-medium">
                  Información administrativa registrada para la Cta Cte N° {currentAccount.numero}.
                </p>
              </div>

              {currentAccount.id !== activeAccountId && (
                <button
                  type="button"
                  onClick={() => handleSelectActiveAccount(currentAccount)}
                  className="btn btn-primary self-start sm:self-auto text-xs font-din font-bold px-4 py-2 rounded-xl flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Check size={14} />
                  <span>Usar esta cuenta</span>
                </button>
              )}
            </div>

            {/* Editable Form */}
            <form onSubmit={handleSaveAlias} className="space-y-5">
              
              {/* THE ONLY EDITABLE FIELD: Nombre / Alias */}
              <div className="bg-[#ECF5F7]/40 border-2 border-[#33798C]/30 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black font-din text-[#1e4f5e] flex items-center gap-1.5">
                    <Pencil size={13} className="text-[#33798C]" />
                    <span>Nombre o alias de la cuenta (Editable)</span>
                  </label>
                </div>
                <p className="text-[11px] text-slate-600 font-sans">
                  Asigna un nombre personalizado o alias reconocible para identificar esta cuenta en tus envíos, retiros y reportes.
                </p>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1">
                  <input
                    type="text"
                    required
                    value={aliasValue}
                    onChange={(e) => setAliasValue(e.target.value)}
                    placeholder="Ej. Cuenta Starkin Casa Matriz"
                    className="flex-1 bg-white border border-[#33798C] rounded-xl px-3.5 py-2.5 text-xs font-bold font-sans text-slate-800 outline-none focus:ring-2 focus:ring-[#33798C]/20 shadow-2xs transition-all"
                  />
                  <button
                    type="submit"
                    className={`btn text-xs font-din font-bold px-4 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 ${
                      isSavedRecently
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white shadow-xs'
                    }`}
                  >
                    {isSavedRecently ? (
                      <>
                        <Check size={14} className="stroke-[3]" />
                        <span>¡Guardado!</span>
                      </>
                    ) : (
                      <>
                        <Check size={14} />
                        <span>Guardar alias</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* READ ONLY / LOCKED FIELDS */}
              <div className="space-y-4 pt-1">
                <div className="flex items-center pb-1 border-b border-slate-100">
                  <span className="text-xs font-bold font-din text-slate-700 flex items-center gap-1.5">
                    <Lock size={12} className="text-slate-400" />
                    <span>Datos contractuales (Solo lectura)</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                  
                  {/* Número de Cuenta Corriente */}
                  <div className="space-y-2">
                    <label className="font-bold text-slate-700 font-sans flex items-center gap-1.5 mb-1.5">
                      <span>Número de cuenta corriente:</span>
                      <Lock size={11} className="text-slate-400 shrink-0" />
                    </label>
                    <input
                      type="text"
                      readOnly
                      disabled
                      value={currentAccount.numero || ''}
                      className="w-full bg-slate-100/80 border border-slate-200 rounded-xl px-3 py-2 text-xs font-sans font-semibold text-slate-700 cursor-not-allowed select-all"
                    />
                  </div>

                  {/* RUT Empresa */}
                  <div className="space-y-2">
                    <label className="font-bold text-slate-700 font-sans flex items-center gap-1.5 mb-1.5">
                      <span>RUT empresa:</span>
                      <Lock size={11} className="text-slate-400 shrink-0" />
                    </label>
                    <input
                      type="text"
                      readOnly
                      disabled
                      value={currentAccount.rut || '96.554.000-8'}
                      className="w-full bg-slate-100/80 border border-slate-200 rounded-xl px-3 py-2 text-xs font-sans font-semibold text-slate-700 cursor-not-allowed select-all"
                    />
                  </div>

                  {/* Razón Social */}
                  <div className="space-y-2 sm:col-span-2">
                    <label className="font-bold text-slate-700 font-sans flex items-center gap-1.5 mb-1.5">
                      <span>Razón social:</span>
                      <Lock size={11} className="text-slate-400 shrink-0" />
                    </label>
                    <input
                      type="text"
                      readOnly
                      disabled
                      value={currentAccount.razonSocial || 'STARKEN S.A. / LOGISTICA EMPRESAS'}
                      className="w-full bg-slate-100/80 border border-slate-200 rounded-xl px-3 py-2 text-xs font-sans font-semibold text-slate-700 cursor-not-allowed select-all"
                    />
                  </div>

                  {/* Saldo / Crédito Disponible */}
                  <div className="space-y-2">
                    <label className="font-bold text-slate-700 font-sans flex items-center gap-1.5 mb-1.5">
                      <span>Crédito disponible / Saldo:</span>
                      <Lock size={11} className="text-slate-400 shrink-0" />
                    </label>
                    <input
                      type="text"
                      readOnly
                      disabled
                      value={`$${(currentAccount.creditoDisponible || 0).toLocaleString('es-CL')} (Límite: $${(currentAccount.creditoTotal || 0).toLocaleString('es-CL')})`}
                      className="w-full bg-slate-100/80 border border-slate-200 rounded-xl px-3 py-2 text-xs font-sans font-bold text-emerald-700 cursor-not-allowed"
                    />
                  </div>

                  {/* Tipo de Facturación */}
                  <div className="space-y-2">
                    <label className="font-bold text-slate-700 font-sans flex items-center gap-1.5 mb-1.5">
                      <span>Condición de facturación:</span>
                      <Lock size={11} className="text-slate-400 shrink-0" />
                    </label>
                    <input
                      type="text"
                      readOnly
                      disabled
                      value={currentAccount.tipoFacturacion || 'Crédito Cuenta Corriente 30 días'}
                      className="w-full bg-slate-100/80 border border-slate-200 rounded-xl px-3 py-2 text-xs font-sans font-semibold text-slate-700 cursor-not-allowed"
                    />
                  </div>

                  {/* Centro de Costo */}
                  <div className="space-y-2">
                    <label className="font-bold text-slate-700 font-sans flex items-center gap-1.5 mb-1.5">
                      <span>Centro de costo:</span>
                      <Lock size={11} className="text-slate-400 shrink-0" />
                    </label>
                    <input
                      type="text"
                      readOnly
                      disabled
                      value={currentAccount.centroCosto || 'CC-STK-01'}
                      className="w-full bg-slate-100/80 border border-slate-200 rounded-xl px-3 py-2 text-xs font-sans font-semibold text-slate-700 cursor-not-allowed"
                    />
                  </div>

                  {/* Sucursal / CD Asociado */}
                  <div className="space-y-2">
                    <label className="font-bold text-slate-700 font-sans flex items-center gap-1.5 mb-1.5">
                      <span>Sucursal o CD principal:</span>
                      <Lock size={11} className="text-slate-400 shrink-0" />
                    </label>
                    <input
                      type="text"
                      readOnly
                      disabled
                      value={currentAccount.sucursal || 'CD San Bernardo (Principal)'}
                      className="w-full bg-slate-100/80 border border-slate-200 rounded-xl px-3 py-2 text-xs font-sans font-semibold text-slate-700 cursor-not-allowed"
                    />
                  </div>

                </div>
              </div>

            </form>

          </div>
        </div>

      </div>

    </div>
  );
}
