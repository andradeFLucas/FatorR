import React, { useState } from 'react';
import { PlusCircle, FileText, DollarSign, Percent, SlidersHorizontal, Sparkles } from 'lucide-react';

export function InvoiceForm({
  onAddInvoice,
  accountingCost,
  onChangeAccountingCost,
  simplesPct,
  onChangeSimplesPct,
}) {
  const [name, setName] = useState('');
  const [amountStr, setAmountStr] = useState('');
  const [customSimplesPct, setCustomSimplesPct] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const cleanName = name.trim();
    if (!cleanName) {
      alert('Por favor, informe o nome da Nota Fiscal.');
      return;
    }

    // Normaliza input de valor (ex: "3500", "3.500,00", "3500,50")
    let numericAmount = parseFloat(
      amountStr.replace(/\./g, '').replace(',', '.')
    );

    if (isNaN(numericAmount) || numericAmount <= 0) {
      alert('Por favor, informe um valor em R$ válido maior que zero.');
      return;
    }

    const newInvoice = {
      name: cleanName,
      amount: numericAmount,
    };

    if (customSimplesPct.trim() !== '') {
      const parsedPct = parseFloat(customSimplesPct.replace(',', '.'));
      if (!isNaN(parsedPct) && parsedPct >= 0) {
        newInvoice.simplesPct = parsedPct;
      }
    }

    onAddInvoice(newInvoice);

    setName('');
    setAmountStr('');
    setCustomSimplesPct('');
  };

  const handleQuickTax = (pct) => {
    onChangeSimplesPct(pct);
  };

  return (
    <div className="glass-card p-5 sm:p-6 rounded-2xl border border-slate-800/80 mb-6 no-print shadow-xl relative overflow-hidden">
      
      {/* Decorative top sheen */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent"></div>

      {/* Header & Cockpit de Parâmetros Rápidos */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5 pb-5 border-b border-slate-800/70">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              <FileText className="w-4 h-4 stroke-[2.3]" />
            </span>
            <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
              Cadastrar Nota Fiscal & Custos Mensais
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Informe as notas emitidas no mês e ajuste a alíquota geral e custo contábil
          </p>
        </div>

        {/* Dock de Parâmetros do Mês */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* Alíquota de Imposto Simples Nacional com Presets */}
          <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-2 rounded-xl border border-slate-800 shadow-inner">
            <div className="flex items-center gap-1.5">
              <Percent className="w-3.5 h-3.5 text-emerald-400" />
              <label htmlFor="simplesInput" className="text-xs font-bold text-slate-300 whitespace-nowrap">
                Alíquota Geral:
              </label>
            </div>
            
            <div className="relative">
              <input
                id="simplesInput"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={simplesPct}
                onChange={(e) => onChangeSimplesPct(e.target.value)}
                className="w-20 pl-2.5 pr-6 py-1 text-xs font-black bg-slate-900 border border-slate-700/80 rounded-lg text-emerald-400 focus:outline-none focus:border-emerald-500 text-right tabular-nums transition"
                placeholder="6.00"
                title="Alíquota Geral do Simples Nacional (%)"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold pointer-events-none">
                %
              </span>
            </div>

            {/* Quick Presets Chips */}
            <div className="hidden sm:flex items-center gap-1 pl-1 border-l border-slate-800">
              <button
                type="button"
                onClick={() => handleQuickTax(6.0)}
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded transition ${Number(simplesPct) === 6.0 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white'}`}
                title="6% (1ª Faixa Anexo III com Fator R)"
              >
                6%
              </button>
              <button
                type="button"
                onClick={() => handleQuickTax(8.5)}
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded transition ${Number(simplesPct) === 8.5 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white'}`}
                title="8.5% (2ª Faixa Anexo III)"
              >
                8.5%
              </button>
            </div>
          </div>

          {/* Input de Contabilidade Fixo */}
          <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-2 rounded-xl border border-slate-800 shadow-inner">
            <div className="flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-amber-400" />
              <label htmlFor="accountingInput" className="text-xs font-bold text-slate-300 whitespace-nowrap">
                Contabilidade:
              </label>
            </div>
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-bold pointer-events-none">
                R$
              </span>
              <input
                id="accountingInput"
                type="number"
                step="0.01"
                min="0"
                value={accountingCost}
                onChange={(e) => onChangeAccountingCost(e.target.value)}
                className="w-24 pl-8 pr-2.5 py-1 text-xs font-black bg-slate-900 border border-slate-700/80 rounded-lg text-amber-400 focus:outline-none focus:border-amber-500 text-right tabular-nums transition"
                placeholder="150.00"
                title="Custo fixo mensal de contabilidade rateado"
              />
            </div>
          </div>

        </div>
      </div>

      {/* Form para Nova Nota Fiscal */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
        
        {/* Nome da Nota */}
        <div className="sm:col-span-5">
          <label className="block text-xs font-bold text-slate-300 mb-1.5">
            Nome da Nota Fiscal (Cliente / Projeto)
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Neo, Dark Stores, Consultoria TI..."
            className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/50 transition shadow-inner"
          />
        </div>

        {/* Valor da Nota */}
        <div className="sm:col-span-3">
          <label className="block text-xs font-bold text-slate-300 mb-1.5">
            Valor da Nota Bruto (R$)
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-bold">
              R$
            </span>
            <input
              type="text"
              value={amountStr}
              onChange={(e) => setAmountStr(e.target.value)}
              placeholder="0,00"
              className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-emerald-400 font-black placeholder-slate-600 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/50 transition tabular-nums shadow-inner"
            />
          </div>
        </div>

        {/* Alíquota do Imposto da Nota (Opcional / Customizável) */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
            <span>Alíquota</span>
            <span className="text-[10px] text-emerald-400 font-semibold px-1 rounded bg-emerald-500/10">
              Padrão: {simplesPct}%
            </span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={customSimplesPct}
              onChange={(e) => setCustomSimplesPct(e.target.value)}
              placeholder={`${simplesPct}%`}
              className="w-full pl-3.5 pr-7 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-emerald-400 font-black placeholder-slate-600 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/50 transition tabular-nums shadow-inner"
              title="Deixe em branco para usar a alíquota padrão, ou digite uma taxa específica para esta nota"
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-bold pointer-events-none">
              %
            </span>
          </div>
        </div>

        {/* Botão de Adicionar */}
        <div className="sm:col-span-2">
          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-emerald-600/20 transition duration-200 flex items-center justify-center gap-2 active:scale-95"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.6]" />
            Adicionar
          </button>
        </div>

      </form>
    </div>
  );
}
