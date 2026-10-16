import { formatBRL, formatPercent } from './calculations';

/**
 * Exporta a tabela de rateio para arquivo CSV (compatível com Excel PT-BR).
 */
export function exportToCSV(summaryData) {
  const { invoices, totals, rates } = summaryData;

  const headers = [
    'Nota Fiscal',
    'Valor Bruto (R$)',
    'Alíquota Imposto (%)',
    'Simples Nacional (R$)',
    `INSS (${formatPercent(rates.effectiveInssPct)}) (R$)`,
    'Contabilidade Rateada (R$)',
    'Total de Custos (R$)',
    'Valor Líquido (R$)',
    'Custo % Efetivo (%)'
  ];

  const rows = invoices.map(inv => [
    `"${inv.name.replace(/"/g, '""')}"`,
    inv.amount.toFixed(2).replace('.', ','),
    inv.simplesPct.toFixed(2).replace('.', ','),
    inv.simples.toFixed(2).replace('.', ','),
    inv.inss.toFixed(2).replace('.', ','),
    inv.accounting.toFixed(2).replace('.', ','),
    inv.totalCost.toFixed(2).replace('.', ','),
    inv.netAmount.toFixed(2).replace('.', ','),
    inv.effectivePct.toFixed(2).replace('.', ',')
  ]);

  // Linha de TOTAL
  rows.push([
    '"TOTAL DA EMPRESA"',
    totals.totalRevenue.toFixed(2).replace('.', ','),
    '-',
    totals.totalSimples.toFixed(2).replace('.', ','),
    totals.totalINSS.toFixed(2).replace('.', ','),
    totals.accountingAppliedTotal.toFixed(2).replace('.', ','),
    totals.totalCostsOverall.toFixed(2).replace('.', ','),
    totals.totalNetOverall.toFixed(2).replace('.', ','),
    totals.overallEffectivePct.toFixed(2).replace('.', ',')
  ]);

  const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map(e => e.join(';'))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `rateio_impostos_fator_r_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Gera um resumo formatado em texto para copiar para o WhatsApp / E-mail.
 */
export function generateWhatsAppSummary(summaryData) {
  const { invoices, totals, rates } = summaryData;
  const dataHoje = new Date().toLocaleDateString('pt-BR');

  let text = `📊 *RESUMO DE IMPOSTOS & CUSTOS - SIMPLES NACIONAL (FATOR R)*\n`;
  text += `📅 *Data:* ${dataHoje}\n`;
  text += `────────────────────────────\n`;
  text += `💰 *Faturamento Total:* ${formatBRL(totals.totalRevenue)}\n`;
  text += `💼 *Pró-Labore Mínimo (28%):* ${formatBRL(totals.totalProLabore)}\n`;
  text += `🏛️ *Simples Nacional (${rates.simplesPct}% padrão):* ${formatBRL(totals.totalSimples)}\n`;
  text += `🛡️ *INSS do Pró-Labore (${rates.inssPct}%):* ${formatBRL(totals.totalINSS)}\n`;
  text += `🏢 *Contabilidade Fixo Rateado:* ${formatBRL(totals.accountingAppliedTotal)}\n`;
  text += `📉 *Total de Custos & Impostos:* ${formatBRL(totals.totalCostsOverall)}\n`;
  text += `💵 *Valor Líquido Total:* ${formatBRL(totals.totalNetOverall)}\n`;
  text += `⚡ *Custo % Efetivo Médio:* ${formatPercent(totals.overallEffectivePct)}\n`;
  text += `────────────────────────────\n`;
  text += `📋 *RATEIO POR NOTA FISCAL:*\n\n`;

  if (invoices.length === 0) {
    text += `_Nenhuma nota cadastrada._\n`;
  } else {
    invoices.forEach((inv, index) => {
      text += `*${index + 1}. ${inv.name}*\n`;
      text += `   • Valor Bruto: ${formatBRL(inv.amount)}\n`;
      text += `   • Alíquota Imposto: ${inv.simplesPct}%\n`;
      text += `   • Impostos (Simples + INSS): ${formatBRL(inv.simples + inv.inss)}\n`;
      text += `   • Contabilidade: ${formatBRL(inv.accounting)}\n`;
      text += `   • Total Custos: ${formatBRL(inv.totalCost)} (${formatPercent(inv.effectivePct)})\n`;
      text += `   • *Líquido a Receber:* ${formatBRL(inv.netAmount)}\n\n`;
    });
  }

  text += `_Gerado via Calculadora de Fator R Simples Nacional_`;
  return text;
}
