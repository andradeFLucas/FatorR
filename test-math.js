import { calculateTaxBreakdown, DEFAULT_MOCK_INVOICES, DEFAULT_CONFIG } from './src/utils/calculations.js';

const result = calculateTaxBreakdown(DEFAULT_MOCK_INVOICES, DEFAULT_CONFIG);

console.log('--- TESTE DE CÁLCULOS DO RATEIO ---');
console.log('Faturamento Total:', result.totals.totalRevenue); // Expect 5800
console.log('Pró-Labore Mínimo (28%):', result.totals.totalProLabore); // Expect 1624
console.log('Simples Total (6%):', result.totals.totalSimples); // Expect 348
console.log('INSS Total (11% de 1624 / 3,08%):', result.totals.totalINSS); // Expect 178.64
console.log('Contabilidade Total:', result.totals.accountingAppliedTotal); // Expect 150
console.log('Custos Totais Empresa:', result.totals.totalCostsOverall); // Expect 676.64
console.log('Valor Líquido Total Empresa:', result.totals.totalNetOverall); // Expect 5123.36
console.log('Custo Efetivo Médio (%):', result.totals.overallEffectivePct.toFixed(2) + '%'); // Expect 11.67%

console.log('\n--- DETALHAMENTO POR NOTA ---');
result.invoices.forEach(inv => {
  console.log(`Nota: ${inv.name}`);
  console.log(`  Valor Bruto: R$ ${inv.amount.toFixed(2)}`);
  console.log(`  Simples (6%): R$ ${inv.simples.toFixed(2)}`);
  console.log(`  INSS (3,08%): R$ ${inv.inss.toFixed(2)}`);
  console.log(`  Contabilidade Rateada: R$ ${inv.accounting.toFixed(2)}`);
  console.log(`  Total Custos: R$ ${inv.totalCost.toFixed(2)}`);
  console.log(`  Valor Líquido: R$ ${inv.netAmount.toFixed(2)}`);
  console.log(`  Custo % Efetivo: ${inv.effectivePct.toFixed(2)}%\n`);
});
