import React, { useState } from 'react';
import { Trash2, Edit2, Check, X, Layers, Sparkles, AlertCircle } from 'lucide-react';
import { formatBRL, formatPercent } from '../utils/calculations';

export function InvoiceTable({ summaryData, onDeleteInvoice, onUpdateInvoice, onLoadMock }) {
  const { invoices, totals, rates } = summaryData;
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editAmountStr, setEditAmountStr] = useState('');
  const [editSimplesPctStr, setEditSimplesPctStr] = useState('');

  const handleStartEdit = (inv) => {
    setEditingId(inv.id);
    setEditName(inv.name);
    setEditAmountStr(inv.amount.toString());
    setEditSimplesPctStr(inv.simplesPct !== undefined ? inv.simplesPct.toString() : rates.simplesPct.toString());
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditAmountStr('');
    setEditSimplesPctStr('');
  };

  const handleSaveEdit = (id) => {
    const cleanName = editName.trim();
    let numericAmount = parseFloat(editAmountStr.replace(/\./g, '').replace(',', '.'));
    let numericSimplesPct = parseFloat(editSimplesPctStr.replace(',', '.'));

    if (!cleanName || isNaN(numericAmount) || numericAmount <= 0) {
      alert('Por favor, informe um nome e valor válidos para a nota.');
      return;
    }

    onUpdateInvoice(id, {
      name: cleanName,
      amount: numericAmount,
      simplesPct: !isNaN(numericSimplesPct) && numericSimplesPct >= 0 ? numericSimplesPct : rates.simplesPct,
    });

    setEditingId(null);
  };

  const handleKeyDown = (e, id) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveEdit(id);
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  if (invoices.length === 0) {
    return (
      <div className="glass-card p-12 rounded-2xl border border-slate-800/80 text-center my-6 relative overflow-hidden">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 flex items-center justify-center mx-auto mb-4 text-emerald-400 shadow-xl">
          <Layers className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-black text-white mb-2 tracking-tight">Nenhuma Nota Fiscal Cadastrada</h3>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mb-6 leading-relaxed">
          Adicione suas notas fiscais de prestação de serviços acima para visualizar o rateio exato de impostos e apuração do Fator R.
        </p>
        <button
          onClick={onLoadMock}
          className="px-4 py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold inline-flex items-center gap-2 transition duration-200 active:scale-95 shadow-lg shadow-emerald-500/5"
        >
          <Sparkles className="w-4 h-4 text-emerald-400" />
          Carregar 3 Notas de Demonstração (Neo, Dark Stores, PQS)
        </button>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl border border-slate-800/80 overflow-hidden my-6 shadow-2xl relative">
      
      {/* Top Banner da Tabela */}
      <div className="px-5 py-3.5 bg-slate-900/60 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <h3 className="text-xs font-bold text-slate-200 tracking-wider uppercase">
            Rateio Analítico de Custos & Impostos por Nota
          </h3>
        </div>
        <div className="text-[11px] text-slate-400 font-medium">
          Total de <strong className="text-white">{invoices.length}</strong> nota{invoices.length === 1 ? '' : 's'} emitida{invoices.length === 1 ? '' : 's'}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          
          {/* Header da Tabela */}
          <thead>
            <tr className="bg-slate-950/80 text-slate-400 text-[11px] font-black uppercase tracking-wider border-b border-slate-800">
              <th className="py-3.5 px-4 sm:px-6">Nota (Cliente / Projeto)</th>
              <th className="py-3.5 px-4 text-right">Valor Bruto</th>
              <th className="py-3.5 px-4 text-right">
                Simples / Imposto
                <span className="block text-[10px] font-semibold text-emerald-400 lowercase">
                  (alíquota aplicada)
                </span>
              </th>
              <th className="py-3.5 px-4 text-right">
                INSS Retido
                <span className="block text-[10px] font-semibold text-indigo-400 lowercase">
                  ({formatPercent(rates.effectiveInssPct)} da nota)
                </span>
              </th>
              <th className="py-3.5 px-4 text-right">Contabilidade</th>
              <th className="py-3.5 px-4 text-right text-rose-400">Total Custos</th>
              <th className="py-3.5 px-4 text-right text-emerald-400">Líquido a Receber</th>
              <th className="py-3.5 px-4 text-right text-teal-300">Custo % Efetivo</th>
              <th className="py-3.5 px-4 text-center no-print">Ações</th>
            </tr>
          </thead>

          {/* Corpo da Tabela */}
          <tbody className="divide-y divide-slate-800/50 font-medium text-xs">
            {invoices.map((inv) => {
              const isEditing = editingId === inv.id;
              const revenueShare = totals.totalRevenue > 0 ? (inv.amount / totals.totalRevenue) * 100 : 0;

              return (
                <tr key={inv.id} className="hover:bg-slate-800/30 transition-colors group">
                  
                  {/* Nome da Nota */}
                  <td className="py-3.5 px-4 sm:px-6 font-bold text-white">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, inv.id)}
                        autoFocus
                        className="px-2.5 py-1 bg-slate-950 border border-emerald-500/60 rounded-lg text-white text-xs w-full focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-inner"
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="truncate max-w-xs">{inv.name}</span>
                        {inv.hasCustomSimples && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30 shrink-0">
                            Taxa Custom
                          </span>
                        )}
                      </div>
                    )}
                  </td>

                  {/* Valor Bruto com barra de participação percentual */}
                  <td className="py-3.5 px-4 text-right font-black text-slate-100 tabular-nums">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editAmountStr}
                        onChange={(e) => setEditAmountStr(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, inv.id)}
                        className="px-2.5 py-1 bg-slate-950 border border-emerald-500/60 rounded-lg text-emerald-400 text-xs w-28 text-right focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-inner"
                      />
                    ) : (
                      <div>
                        <div>{formatBRL(inv.amount)}</div>
                        <div className="w-full bg-slate-800/80 h-1 rounded-full overflow-hidden mt-1 max-w-[80px] ml-auto">
                          <div
                            className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                            style={{ width: `${revenueShare}%` }}
                            title={`${revenueShare.toFixed(1)}% do faturamento total`}
                          />
                        </div>
                      </div>
                    )}
                  </td>

                  {/* Simples / Imposto */}
                  <td className="py-3.5 px-4 text-right text-slate-300 tabular-nums">
                    {isEditing ? (
                      <div className="relative inline-block">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          max="100"
                          value={editSimplesPctStr}
                          onChange={(e) => setEditSimplesPctStr(e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, inv.id)}
                          className="px-2 py-1 bg-slate-950 border border-emerald-500/60 rounded-lg text-emerald-400 text-xs w-20 text-right focus:outline-none pr-5 shadow-inner"
                        />
                        <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-500 text-[10px] font-bold pointer-events-none">%</span>
                      </div>
                    ) : (
                      <div>
                        <div className="font-semibold text-slate-200">{formatBRL(inv.simples)}</div>
                        <div className="text-[10px] text-slate-400">
                          {inv.simplesPct}%
                        </div>
                      </div>
                    )}
                  </td>

                  {/* INSS Rateado */}
                  <td className="py-3.5 px-4 text-right text-slate-300 tabular-nums">
                    <div>
                      <div className="font-semibold text-slate-200">{formatBRL(inv.inss)}</div>
                      <div className="text-[10px] text-indigo-400/80">3,08%</div>
                    </div>
                  </td>

                  {/* Contabilidade Rateada */}
                  <td className="py-3.5 px-4 text-right text-slate-300 tabular-nums">
                    <div className="font-semibold text-slate-200">{formatBRL(inv.accounting)}</div>
                  </td>

                  {/* Total de Custos */}
                  <td className="py-3.5 px-4 text-right font-black text-rose-400 bg-rose-500/5 tabular-nums">
                    {formatBRL(inv.totalCost)}
                  </td>

                  {/* Valor Líquido */}
                  <td className="py-3.5 px-4 text-right font-black text-emerald-400 bg-emerald-500/10 tabular-nums">
                    {formatBRL(inv.netAmount)}
                  </td>

                  {/* Custo % Efetivo */}
                  <td className="py-3.5 px-4 text-right font-black text-teal-300 tabular-nums">
                    <span className="px-2 py-0.5 rounded-md bg-teal-500/10 border border-teal-500/20 text-xs font-bold inline-block">
                      {formatPercent(inv.effectivePct)}
                    </span>
                  </td>

                  {/* Ações (Editar / Excluir) */}
                  <td className="py-3.5 px-4 text-center no-print">
                    {isEditing ? (
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleSaveEdit(inv.id)}
                          className="p-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg transition shadow-md shadow-emerald-500/20"
                          title="Salvar alterações (Enter)"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-lg transition"
                          title="Cancelar edição (Esc)"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleStartEdit(inv)}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                          title="Editar nota fiscal e alíquota"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteInvoice(inv.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition"
                          title="Excluir nota"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </td>

                </tr>
              );
            })}
          </tbody>

          {/* Rodapé Totais Consolidados */}
          <tfoot>
            <tr className="bg-slate-950 border-t-2 border-emerald-500/40 text-white font-black text-xs sm:text-sm shadow-2xl">
              <td className="py-4 px-4 sm:px-6 uppercase tracking-wider text-emerald-400 font-extrabold flex items-center gap-2">
                TOTAL DA EMPRESA
              </td>
              <td className="py-4 px-4 text-right text-slate-100 tabular-nums text-sm font-black">
                {formatBRL(totals.totalRevenue)}
              </td>
              <td className="py-4 px-4 text-right text-slate-300 tabular-nums">
                {formatBRL(totals.totalSimples)}
              </td>
              <td className="py-4 px-4 text-right text-slate-300 tabular-nums">
                {formatBRL(totals.totalINSS)}
              </td>
              <td className="py-4 px-4 text-right text-slate-300 tabular-nums">
                {formatBRL(totals.accountingAppliedTotal)}
              </td>
              <td className="py-4 px-4 text-right text-rose-400 text-sm bg-rose-500/10 tabular-nums font-black">
                {formatBRL(totals.totalCostsOverall)}
              </td>
              <td className="py-4 px-4 text-right text-emerald-400 text-sm bg-emerald-500/20 tabular-nums font-black">
                {formatBRL(totals.totalNetOverall)}
              </td>
              <td className="py-4 px-4 text-right text-teal-300 tabular-nums">
                <span className="px-2.5 py-1 rounded-lg bg-teal-400 text-slate-950 font-black shadow-md inline-block">
                  {formatPercent(totals.overallEffectivePct)}
                </span>
              </td>
              <td className="py-4 px-4 no-print"></td>
            </tr>
          </tfoot>

        </table>
      </div>
    </div>
  );
}
