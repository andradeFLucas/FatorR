import React from 'react';
import { PieChart, Info, TrendingDown, ArrowDownRight, CheckCircle2 } from 'lucide-react';
import { formatBRL, formatPercent } from '../utils/calculations';

export function ChartSection({ totals, rates }) {
  if (totals.totalCostsOverall <= 0) return null;

  const simplesCost = totals.totalSimples;
  const inssCost = totals.totalINSS;
  const accountingCost = totals.accountingAppliedTotal;
  const totalCost = totals.totalCostsOverall;

  const simplesPctOfCost = totalCost > 0 ? (simplesCost / totalCost) * 100 : 0;
  const inssPctOfCost = totalCost > 0 ? (inssCost / totalCost) * 100 : 0;
  const accountingPctOfCost = totalCost > 0 ? (accountingCost / totalCost) * 100 : 0;

  // Simulação de Economia Real: Anexo V (15.5%) vs Anexo III (6% + 3.08% INSS)
  const revenue = totals.totalRevenue;
  const anexo5Simples = revenue * 0.155; // 15.5%
  const anexo3Combined = simplesCost + inssCost; // ~9.08%
  const estimatedSavings = Math.max(0, anexo5Simples - anexo3Combined);

  return (
    <div className="glass-card p-6 rounded-2xl border border-slate-800/80 my-6 no-print shadow-xl relative overflow-hidden">
      
      {/* Top Bar Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <span className="p-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
            <PieChart className="w-4 h-4 stroke-[2.3]" />
          </span>
          <h3 className="text-base font-black text-white tracking-tight">
            Composição dos Custos & Decomposição Tributária
          </h3>
        </div>
        <div className="text-xs text-slate-400">
          Custo Geral Apurado: <strong className="text-emerald-400 font-bold tabular-nums">{formatBRL(totalCost)}</strong>
        </div>
      </div>

      {/* Visual Multi-Segment Bar Graph */}
      <div className="w-full h-6 rounded-xl bg-slate-950 overflow-hidden flex p-1 border border-slate-800 mb-6 shadow-inner gap-1">
        {simplesPctOfCost > 0 && (
          <div
            style={{ width: `${simplesPctOfCost}%` }}
            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-500 rounded-lg flex items-center justify-center text-[10px] font-black text-slate-950 overflow-hidden"
            title={`Simples Nacional: ${formatBRL(simplesCost)} (${simplesPctOfCost.toFixed(1)}%)`}
          >
            {simplesPctOfCost > 15 ? `${simplesPctOfCost.toFixed(0)}%` : ''}
          </div>
        )}
        {inssPctOfCost > 0 && (
          <div
            style={{ width: `${inssPctOfCost}%` }}
            className="bg-gradient-to-r from-indigo-500 to-blue-500 h-full transition-all duration-500 rounded-lg flex items-center justify-center text-[10px] font-black text-white overflow-hidden"
            title={`INSS do Pró-Labore: ${formatBRL(inssCost)} (${inssPctOfCost.toFixed(1)}%)`}
          >
            {inssPctOfCost > 15 ? `${inssPctOfCost.toFixed(0)}%` : ''}
          </div>
        )}
        {accountingPctOfCost > 0 && (
          <div
            style={{ width: `${accountingPctOfCost}%` }}
            className="bg-gradient-to-r from-amber-500 to-orange-400 h-full transition-all duration-500 rounded-lg flex items-center justify-center text-[10px] font-black text-slate-950 overflow-hidden"
            title={`Contabilidade Fixo: ${formatBRL(accountingCost)} (${accountingPctOfCost.toFixed(1)}%)`}
          >
            {accountingPctOfCost > 15 ? `${accountingPctOfCost.toFixed(0)}%` : ''}
          </div>
        )}
      </div>

      {/* Legenda de Custos em Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-6">
        
        {/* Item 1: Simples Nacional */}
        <div className="p-4 bg-slate-950/60 rounded-xl border border-emerald-500/20 hover:border-emerald-500/40 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
              Simples Nacional
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
              DAS Mensal
            </span>
          </div>
          <div className="text-lg font-black text-white tabular-nums mb-1">
            {formatBRL(simplesCost)}
          </div>
          <div className="text-[11px] text-slate-400">
            Representa <strong className="text-slate-200">{formatPercent(simplesPctOfCost)}</strong> dos custos totais
          </div>
        </div>

        {/* Item 2: INSS do Pró-Labore */}
        <div className="p-4 bg-slate-950/60 rounded-xl border border-indigo-500/20 hover:border-indigo-500/40 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 shadow-sm shadow-indigo-400/50" />
              INSS do Pró-Labore
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400">
              11% s/ Pró-Labore
            </span>
          </div>
          <div className="text-lg font-black text-white tabular-nums mb-1">
            {formatBRL(inssCost)}
          </div>
          <div className="text-[11px] text-slate-400">
            Representa <strong className="text-slate-200">{formatPercent(inssPctOfCost)}</strong> dos custos totais
          </div>
        </div>

        {/* Item 3: Contabilidade Fixa */}
        <div className="p-4 bg-slate-950/60 rounded-xl border border-amber-500/20 hover:border-amber-500/40 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400/50" />
              Contabilidade Fixa
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400">
              Fixo Mensal
            </span>
          </div>
          <div className="text-lg font-black text-white tabular-nums mb-1">
            {formatBRL(accountingCost)}
          </div>
          <div className="text-[11px] text-slate-400">
            Representa <strong className="text-slate-200">{formatPercent(accountingPctOfCost)}</strong> dos custos totais
          </div>
        </div>

      </div>

      {/* Caixa de Comparativo e Economia Gerada com o Fator R */}
      {revenue > 0 && estimatedSavings > 0 && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 to-teal-950/30 border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shrink-0 mt-0.5">
              <TrendingDown className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-black text-white flex items-center gap-2">
                Economia Tributária Estimada com o Fator R
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Anexo III vs Anexo V
                </span>
              </h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Ao manter a folha em 28%, sua empresa evita o enquadramento no <strong>Anexo V (15,5%)</strong>, gerando economia líquida direta:
              </p>
            </div>
          </div>
          <div className="text-right shrink-0 bg-slate-950/60 p-3 rounded-xl border border-emerald-500/20">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-0.5">
              Economia Estimada no Mês
            </span>
            <span className="text-xl font-black text-emerald-400 tabular-nums">
              + {formatBRL(estimatedSavings)}
            </span>
          </div>
        </div>
      )}

      {/* Dica Legal Fator R */}
      <div className="mt-4 p-3 bg-slate-950/50 border border-slate-800 rounded-xl flex items-start gap-2 text-xs text-slate-400">
        <Info className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
        <span>
          <strong>Base Legal:</strong> Art. 18, § 5º-J da Lei Complementar nº 123/2006. O Fator R igual ou superior a 0,28 (28%) garante tributação no Anexo III em atividades de tecnologia, desenvolvimento de software, consultoria e serviços regulamentados.
        </span>
      </div>

    </div>
  );
}
