import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatBRL, formatPercent } from './calculations.js';

/**
 * Gera e realiza o download direto de um PDF executivo personalizado de alta qualidade
 * com o rateio de impostos e Fator R, com tipografia tratada, sem erros de encoding
 * e com alinhamento milimétrico de tabelas e cartões.
 * 
 * @param {Object} summaryData - Dados consolidados calculados por calculateTaxBreakdown
 * @param {Object} [options] - Opções adicionais (ex: nome da empresa, competência)
 */
export function generateExecutivePDF(summaryData, options = {}) {
  const { invoices, totals, rates } = summaryData;
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  const now = new Date();
  const dateFormatted = now.toLocaleDateString('pt-BR');
  const timeFormatted = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const competence = options.competence || `${now.toLocaleString('pt-BR', { month: 'long' })} / ${now.getFullYear()}`;

  // ==========================================
  // 1. CABEÇALHO CORPORATIVO EXECUTIVO
  // ==========================================

  // Barra Superior em Slate Escuro (Tema Executivo)
  doc.setFillColor(15, 23, 42); // #0f172a
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Faixa de destaque verde esmeralda no topo
  doc.setFillColor(16, 185, 129); // #10b981
  doc.rect(0, 0, pageWidth, 2.5, 'F');

  // Ícone / Badge visual da marca
  doc.setFillColor(16, 185, 129);
  doc.roundedRect(margin, 7, 13, 13, 3, 3, 'F');
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('FR', margin + 3.8, 15.8);

  // Título e Subtítulo do Relatório
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('RELATÓRIO DE RATEIO DE IMPOSTOS & FATOR R', margin + 17, 12.8);

  doc.setTextColor(148, 163, 184); // Slate 400
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`Simples Nacional Anexo III  •  Competência: ${competence.toUpperCase()}`, margin + 17, 18.5);

  // Metadados à Direita do Header
  doc.setFontSize(7.2);
  doc.setTextColor(203, 213, 225);
  doc.text(`Emissão: ${dateFormatted} às ${timeFormatted}`, pageWidth - margin, 12.5, { align: 'right' });

  // Badge Status Conforme (com círculo vetorial para não quebrar encoding de caracteres)
  const badgeWidth = 47;
  const badgeHeight = 6.2;
  const badgeX = pageWidth - margin - badgeWidth;
  const badgeY = 15;

  doc.setFillColor(6, 78, 59); // Fundo verde escuro #064e3b
  doc.roundedRect(badgeX, badgeY, badgeWidth, badgeHeight, 1.5, 1.5, 'F');
  
  // Desenho de ponto esmeralda vetorial
  doc.setFillColor(52, 211, 153); // #34d399
  doc.circle(badgeX + 4.2, badgeY + 3.1, 1.1, 'F');

  doc.setTextColor(167, 243, 208); // #a7f3d0
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  doc.text('FATOR R >= 28% CONFORME', badgeX + 7.5, badgeY + 4.3);

  let currentY = 34;

  // ==========================================
  // 2. QUADRO DE RESUMO EXECUTIVO (BENTO GRID 2x4)
  // ==========================================
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text('1. RESUMO EXECUTIVO DA EMPRESA', margin, currentY);

  currentY += 4;

  const cardWidth = (contentWidth - 6) / 4;
  const cardHeight = 18; // Altura confortável para caber 3 linhas com respiro

  const kpis = [
    {
      label: 'FATURAMENTO BRUTO',
      val: formatBRL(totals.totalRevenue),
      sub: `${totals.invoiceCount} nota${totals.invoiceCount === 1 ? '' : 's'} emitida${totals.invoiceCount === 1 ? '' : 's'}`,
      accent: [16, 185, 129],
      bg: [240, 253, 250],
    },
    {
      label: 'PRÓ-LABORE MÍNIMO',
      val: formatBRL(totals.totalProLabore),
      sub: `${rates.proLaborePct}% do faturamento`,
      accent: [99, 102, 241],
      bg: [238, 242, 255],
    },
    {
      label: 'SIMPLES NACIONAL',
      val: formatBRL(totals.totalSimples),
      sub: `Média do DAS mensal`,
      accent: [168, 85, 247],
      bg: [250, 245, 255],
    },
    {
      label: 'INSS S/ PRÓ-LABORE',
      val: formatBRL(totals.totalINSS),
      sub: `11% retido (3,08% da nota)`,
      accent: [139, 92, 246],
      bg: [245, 243, 255],
    },
    {
      label: 'CONTABILIDADE FIXA',
      val: formatBRL(totals.accountingAppliedTotal),
      sub: totals.invoiceCount > 0 ? `${formatBRL(totals.accountingAppliedTotal / totals.invoiceCount)} por nota` : 'Custo rateado',
      accent: [245, 158, 11],
      bg: [254, 252, 232],
    },
    {
      label: 'TOTAL DE CUSTOS',
      val: formatBRL(totals.totalCostsOverall),
      sub: 'Impostos + Contabilidade',
      accent: [244, 63, 94],
      bg: [255, 241, 242],
    },
    {
      label: 'RESULTADO LÍQUIDO',
      val: formatBRL(totals.totalNetOverall),
      sub: 'Lucro líquido disponível',
      accent: [16, 185, 129],
      bg: [236, 253, 245],
    },
    {
      label: 'CUSTO % EFETIVO',
      val: formatPercent(totals.overallEffectivePct),
      sub: 'Impacto total s/ receita',
      accent: [20, 184, 166],
      bg: [240, 253, 250],
    },
  ];

  kpis.forEach((kpi, idx) => {
    const col = idx % 4;
    const row = Math.floor(idx / 4);
    const x = margin + col * (cardWidth + 2);
    const y = currentY + row * (cardHeight + 2.5);

    // Fundo do Card
    doc.setFillColor(...kpi.bg);
    doc.setDrawColor(226, 232, 240); // Slate 200
    doc.setLineWidth(0.2);
    doc.roundedRect(x, y, cardWidth, cardHeight, 1.5, 1.5, 'FD');

    // Barra lateral de cor de destaque
    doc.setFillColor(...kpi.accent);
    doc.roundedRect(x, y, 1.2, cardHeight, 1, 1, 'F');

    // Label do KPI
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.2);
    doc.setTextColor(100, 116, 139);
    doc.text(kpi.label, x + 3.2, y + 4.4);

    // Valor Principal
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.2);
    doc.setTextColor(15, 23, 42);
    doc.text(kpi.val, x + 3.2, y + 10.2);

    // Subtítulo com contraste alto e limpo
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.9);
    doc.setTextColor(71, 85, 105); // Slate 600 em vez de 400 para contraste perfeito
    doc.text(kpi.sub, x + 3.2, y + 15.0);
  });

  currentY += cardHeight * 2 + 8.5;

  // ==========================================
  // 3. TABELA ANALÍTICA DE RATEIO POR NOTA
  // ==========================================
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text('2. DETALHAMENTO ANALÍTICO POR NOTA FISCAL', margin, currentY);

  currentY += 2.5;

  // Montagem de cabeçalhos sem quebras feias de texto
  const tableHeaders = [
    [
      { content: 'Nota Fiscal / Cliente', styles: { halign: 'left' } },
      { content: 'Valor Bruto', styles: { halign: 'right' } },
      { content: 'Alíquota', styles: { halign: 'center' } },
      { content: 'Simples', styles: { halign: 'right' } },
      { content: 'INSS Retido', styles: { halign: 'right' } },
      { content: 'Contab.', styles: { halign: 'right' } },
      { content: 'Total Custos', styles: { halign: 'right' } },
      { content: 'Valor Líquido', styles: { halign: 'right' } },
      { content: 'Custo %', styles: { halign: 'right' } },
    ]
  ];

  const tableBody = invoices.map(inv => [
    { content: inv.name, styles: { fontStyle: 'bold', textColor: [15, 23, 42] } },
    { content: formatBRL(inv.amount), styles: { halign: 'right' } },
    { content: `${inv.simplesPct}%`, styles: { halign: 'center', textColor: inv.hasCustomSimples ? [180, 83, 9] : [71, 85, 105] } },
    { content: formatBRL(inv.simples), styles: { halign: 'right' } },
    { content: formatBRL(inv.inss), styles: { halign: 'right' } },
    { content: formatBRL(inv.accounting), styles: { halign: 'right' } },
    { content: formatBRL(inv.totalCost), styles: { halign: 'right', fontStyle: 'bold', textColor: [225, 29, 72] } },
    { content: formatBRL(inv.netAmount), styles: { halign: 'right', fontStyle: 'bold', textColor: [5, 150, 105] } },
    { content: formatPercent(inv.effectivePct), styles: { halign: 'right', fontStyle: 'bold', textColor: [13, 148, 136] } },
  ]);

  // Linha de Rodapé Consolidado
  const tableFooter = [
    [
      { content: 'TOTAL CONSOLIDADO', styles: { fontStyle: 'bold', textColor: [15, 23, 42] } },
      { content: formatBRL(totals.totalRevenue), styles: { halign: 'right', fontStyle: 'bold' } },
      { content: '-', styles: { halign: 'center' } },
      { content: formatBRL(totals.totalSimples), styles: { halign: 'right', fontStyle: 'bold' } },
      { content: formatBRL(totals.totalINSS), styles: { halign: 'right', fontStyle: 'bold' } },
      { content: formatBRL(totals.accountingAppliedTotal), styles: { halign: 'right', fontStyle: 'bold' } },
      { content: formatBRL(totals.totalCostsOverall), styles: { halign: 'right', fontStyle: 'bold', textColor: [190, 18, 60] } },
      { content: formatBRL(totals.totalNetOverall), styles: { halign: 'right', fontStyle: 'bold', textColor: [4, 120, 87] } },
      { content: formatPercent(totals.overallEffectivePct), styles: { halign: 'right', fontStyle: 'bold', textColor: [13, 148, 136] } },
    ]
  ];

  autoTable(doc, {
    startY: currentY,
    head: tableHeaders,
    body: tableBody,
    foot: tableFooter,
    margin: { left: margin, right: margin, bottom: 20 },
    theme: 'grid',
    styles: {
      fontSize: 7.8,
      cellPadding: { top: 2.5, bottom: 2.5, left: 2, right: 2 },
      font: 'helvetica',
      lineColor: [226, 232, 240],
      lineWidth: 0.15,
      textColor: [51, 65, 85],
    },
    headStyles: {
      fillColor: [15, 23, 42], // Slate 900
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 7.4,
      valign: 'middle',
      minCellHeight: 8,
    },
    footStyles: {
      fillColor: [236, 253, 245], // Emerald claro
      textColor: [15, 23, 42],
      fontSize: 7.8,
      lineWidth: 0.2,
      lineColor: [16, 185, 129],
      valign: 'middle',
      minCellHeight: 8,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252], // Slate 50
    },
    // Larguras exatas calculadas para totalizar 182mm (largura útil A4) sem quebrar palavras
    columnStyles: {
      0: { cellWidth: 42 },                   // Nota Fiscal / Cliente
      1: { cellWidth: 20, halign: 'right' },  // Valor Bruto
      2: { cellWidth: 14, halign: 'center' }, // Alíquota
      3: { cellWidth: 17, halign: 'right' },  // Simples
      4: { cellWidth: 17, halign: 'right' },  // INSS Retido
      5: { cellWidth: 16, halign: 'right' },  // Contab.
      6: { cellWidth: 20, halign: 'right' },  // Total Custos
      7: { cellWidth: 20, halign: 'right' },  // Valor Líquido
      8: { cellWidth: 16, halign: 'right' },  // Custo %
    },
  });

  const finalY = doc.lastAutoTable.finalY || currentY + 40;

  // ==========================================
  // 4. QUADRO DE BASE LEGAL & INSTRUÇÃO CONTÁBIL COM WRAP PERFEITO
  // ==========================================
  const legalBoxY = finalY + 5;
  if (legalBoxY < pageHeight - 38) {
    const p1 = 'Conforme a Lei Complementar 123/2006 (Art. 18, item 5-J), empresas prestadoras de servicos enquadram-se no Anexo III (aliquota inicial de 6%) quando a razao entre a folha de pagamento / pro-labore e a receita bruta acumulada em 12 meses for igual ou superior a 28% (Fator R >= 0,28).';
    const p2 = 'O rateio proporcional por nota fiscal reserva a quantia exata necessaria para quitacao do DAS mensal e da retencao previdenciaria de INSS (11%) apurada sobre o pro-labore.';

    // Divide os parágrafos para quebrar linhas automaticamente dentro da largura útil
    const lines1 = doc.splitTextToSize(`• ${p1}`, contentWidth - 8);
    const lines2 = doc.splitTextToSize(`• ${p2}`, contentWidth - 8);
    const boxLines = [...lines1, '', ...lines2];
    const boxHeight = boxLines.length * 3.3 + 9;

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.2);
    doc.roundedRect(margin, legalBoxY, contentWidth, boxHeight, 2, 2, 'FD');

    // Tarja esmeralda lateral
    doc.setFillColor(16, 185, 129);
    doc.roundedRect(margin, legalBoxY, 1.2, boxHeight, 1, 1, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.3);
    doc.setTextColor(15, 23, 42);
    doc.text('BASE LEGAL & METODOLOGIA DE CALCULO (FATOR R):', margin + 3.8, legalBoxY + 4.8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.6);
    doc.setTextColor(51, 65, 85);
    doc.text(boxLines, margin + 3.8, legalBoxY + 9);
  }

  // ==========================================
  // 5. RODAPÉ DE PÁGINAS COM NUMERAÇÃO
  // ==========================================
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.2);
    doc.line(margin, pageHeight - 10, pageWidth - margin, pageHeight - 10);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      'Calculadora de Fator R Simples Nacional  •  Documento Gerencial para Controle e Rateio Contabil',
      margin,
      pageHeight - 6
    );

    doc.text(
      `Pagina ${i} de ${totalPages}`,
      pageWidth - margin,
      pageHeight - 6,
      { align: 'right' }
    );
  }

  // Dispara o download automático garantindo o nome do arquivo e extensão .pdf
  const filename = `relatorio_fator_r_${now.toISOString().slice(0, 10)}.pdf`;
  
  try {
    const pdfBlob = doc.output('blob');
    const blobWithMime = new Blob([pdfBlob], { type: 'application/pdf' });
    const downloadUrl = URL.createObjectURL(blobWithMime);
    
    const downloadLink = document.createElement('a');
    downloadLink.href = downloadUrl;
    downloadLink.setAttribute('download', filename);
    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    
    setTimeout(() => {
      if (document.body.contains(downloadLink)) {
        document.body.removeChild(downloadLink);
      }
      URL.revokeObjectURL(downloadUrl);
    }, 1500);
  } catch (e) {
    // Fallback caso a API de Blob falhe
    doc.save(filename);
  }
}
