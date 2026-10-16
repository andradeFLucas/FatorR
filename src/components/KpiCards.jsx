import React from 'react';
import { DollarSign, ShieldCheck, PieChart, Building2, Percent, ArrowUpRight, TrendingUp, Wallet } from 'lucide-react';
import { formatBRL, formatPercent } from '../utils/calculations';

export function KpiCards({ totals, rates, accountingCost }) {
  const cards = [
    {
      id: 'revenue',
      title: 'Faturamento Total',
      value: formatBRL(totals.totalRevenue),
      subtitle: `${totals.invoiceCount} nota${totals.invoiceCount === 1 ? '' : 's'} emitida${totals.invoiceCount === 1 ? '' : 's'} no mês`,
      badge: 'Receita Bruta',
      icon: DollarSign,
      glow: 'from-emerald-500/15 via-teal-500/5 to-transparent',
      borderColor: 'border-emerald-500/30 hover:border-emerald-500/50',
      iconColor: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30',
      valueColor: 'text-white',
    },
    {
      id: 'prolabore',
      title: 'Pró-Labore Mínimo',
      value: formatBRL(totals.totalProLabore),
      subtitle: `${rates.proLaborePct}% do Faturamento (Base Fator R)`,
      badge: 'Folha Fator R',
      icon: ShieldCheck,
      glow: 'from-indigo-500/15 via-blue-500/5 to-transparent',
      borderColor: 'border-indigo-500/30 hover:border-indigo-500/50',
      iconColor: 'text-indigo-400 bg-indigo-500/15 border-indigo-500/30',
      valueColor: 'text-white',
    },
    {
      id: 'taxes',
      title: 'Impostos Totais',
      value: formatBRL(totals.totalSimples + totals.totalINSS),
      subtitle: `DAS Simples + INSS (${formatPercent(rates.effectiveInssPct)} efetivo)`,
      badge: 'Tributos',
      icon: PieChart,
      glow: 'from-purple-500/15 via-pink-500/5 to-transparent',
      borderColor: 'border-purple-500/30 hover:border-purple-500/50',
      iconColor: 'text-purple-400 bg-purple-500/15 border-purple-500/30',
      valueColor: 'text-white',
    },
    {
      id: 'accounting',
      title: 'Contabilidade Fixa',
      value: formatBRL(Number(accountingCost)),
      subtitle: totals.invoiceCount > 0 
        ? `${formatBRL(totals.accountingAppliedTotal / totals.invoiceCount)} por nota`
        : 'Rateado igualmente',
      badge: 'Custo Fixo',
      icon: Building2,
      glow: 'from-amber-500/15 via-orange-500/5 to-transparent',
      borderColor: 'border-amber-500/30 hover:border-amber-500/50',
      iconColor: 'text-amber-400 bg-amber-500/15 border-amber-500/30',
      valueColor: 'text-white',
    },
    {
      id: 'net',
      title: 'Lucro Líquido Real',
      value: formatBRL(totals.totalNetOverall),
      subtitle: `Custo médio: ${formatPercent(totals.overallEffectivePct)} da receita`,
      badge: totals.totalRevenue > 0 ? `${formatPercent(100 - totals.overallEffectivePct)} líquido` : 'Líquido',
      icon: Wallet,
      glow: 'from-teal-500/20 via-emerald-500/10 to-transparent',
      borderColor: 'border-teal-500/40 hover:border-teal-400',
      iconColor: 'text-teal-300 bg-teal-500/20 border-teal-500/40',
      valueColor: 'text-emerald-300',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 my-6">
      {cards.map((card) => {
        const IconComponent = card.icon;
        return (
          <div
            key={card.id}
            className={`glass-card glass-card-hover bg-gradient-to-br ${card.glow} p-4 rounded-2xl border ${card.borderColor} relative overflow-hidden group`}
          >
            {/* Top Bar Card */}
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-bold text-slate-300 tracking-wider uppercase">
                {card.title}
              </span>
              <div className={`p-2 rounded-xl border ${card.iconColor} transition-transform duration-300 group-hover:scale-110 shadow-sm`}>
                <IconComponent className="w-4 h-4 stroke-[2.4]" />
              </div>
            </div>
            
            {/* Value */}
            <div className={`text-xl sm:text-2xl font-black ${card.valueColor} tracking-tight mb-1.5 tabular-nums flex items-baseline gap-1.5`}>
              {card.value}
            </div>
            
            {/* Subtitle & Badge */}
            <div className="flex items-center justify-between gap-1 pt-1 border-t border-white/5">
              <p className="text-[11px] text-slate-400 font-medium leading-tight truncate">
                {card.subtitle}
              </p>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-white/5 text-slate-300 shrink-0">
                {card.badge}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
