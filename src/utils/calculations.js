/**
 * Módulo de utilitários financeiros e fórmulas de cálculo para Fator R / Simples Nacional.
 */

/**
 * Formata um número para moeda brasileira (BRL).
 * @param {number} value 
 * @returns {string} Ex: "R$ 1.500,00"
 */
export function formatBRL(value) {
  if (isNaN(value) || value === null || value === undefined) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Formata um número em percentual com casas decimais configuráveis.
 * @param {number} value 
 * @param {number} decimals 
 * @returns {string} Ex: "11.64%"
 */
export function formatPercent(value, decimals = 2) {
  if (isNaN(value) || value === null || value === undefined) return '0,00%';
  return `${value.toFixed(decimals).replace('.', ',')}%`;
}

/**
 * Dados de exemplo padrão (Mock Data) que podem ser carregados via botão.
 */
export const DEFAULT_MOCK_INVOICES = [
  { id: '1', name: 'Neo', amount: 3500.00 },
  { id: '2', name: 'Dark Stores', amount: 2000.00 },
  { id: '3', name: 'PQS', amount: 300.00 },
];

export const DEFAULT_CONFIG = {
  simplesPct: 6.0,       // 6% Anexo III
  proLaborePct: 28.0,    // 28% Pró-labore Fator R
  inssPct: 11.0,         // 11% INSS do Pró-labore
  accountingCost: 150.00 // R$ 150,00 fixo
};

/**
 * Realiza os cálculos financeiros completos por nota e totais consolidados.
 * @param {Array<{id: string, name: string, amount: number}>} invoices 
 * @param {{simplesPct: number, proLaborePct: number, inssPct: number, accountingCost: number}} config 
 */
export function calculateTaxBreakdown(invoices = [], config = DEFAULT_CONFIG) {
  const defaultSimplesPct = Number(config.simplesPct ?? 6.0);
  const defaultSimplesRate = defaultSimplesPct / 100;
  const proLaboreRate = (config.proLaborePct ?? 28.0) / 100;
  const inssRate = (config.inssPct ?? 11.0) / 100;
  const effectiveInssRate = proLaboreRate * inssRate; // 28% * 11% = 3.08%
  
  const accountingTotalCost = Number(config.accountingCost ?? 150.00);
  const invoiceCount = invoices.length;
  const accountingPerInvoice = invoiceCount > 0 ? accountingTotalCost / invoiceCount : 0;

  let totalRevenue = 0;
  let totalSimples = 0;
  let totalINSS = 0;
  let totalCostsOverall = 0;

  const invoiceResults = invoices.map((inv) => {
    const amount = Number(inv.amount) || 0;
    const hasCustomSimples = inv.simplesPct !== undefined && inv.simplesPct !== null && inv.simplesPct !== '';
    const invoiceSimplesPct = hasCustomSimples ? Number(inv.simplesPct) : defaultSimplesPct;
    const simples = amount * (invoiceSimplesPct / 100);
    const inss = amount * effectiveInssRate;
    const accounting = accountingPerInvoice;
    const totalCost = simples + inss + accounting;
    const netAmount = amount - totalCost;
    const effectivePct = amount > 0 ? (totalCost / amount) * 100 : 0;

    totalRevenue += amount;
    totalSimples += simples;
    totalINSS += inss;
    totalCostsOverall += totalCost;

    return {
      ...inv,
      amount,
      simplesPct: invoiceSimplesPct,
      hasCustomSimples,
      simples,
      inss,
      accounting,
      totalCost,
      netAmount,
      effectivePct,
    };
  });

  const totalProLabore = totalRevenue * proLaboreRate;
  const accountingAppliedTotal = invoiceCount > 0 ? accountingTotalCost : 0;
  const totalNetOverall = totalRevenue - totalCostsOverall;
  const overallEffectivePct = totalRevenue > 0 ? (totalCostsOverall / totalRevenue) * 100 : 0;
  const effectiveInssPctDisplay = effectiveInssRate * 100; // 3.08%

  return {
    invoices: invoiceResults,
    totals: {
      invoiceCount,
      totalRevenue,
      totalProLabore,
      totalSimples,
      totalINSS,
      accountingAppliedTotal,
      totalCostsOverall,
      totalNetOverall,
      overallEffectivePct,
      effectiveInssPctDisplay,
    },
    rates: {
      simplesPct: config.simplesPct,
      proLaborePct: config.proLaborePct,
      inssPct: config.inssPct,
      effectiveInssPct: effectiveInssPctDisplay,
    }
  };
}
