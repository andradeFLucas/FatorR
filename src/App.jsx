import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { KpiCards } from './components/KpiCards';
import { InvoiceForm } from './components/InvoiceForm';
import { InvoiceTable } from './components/InvoiceTable';
import { ChartSection } from './components/ChartSection';
import { ConfigModal } from './components/ConfigModal';
import { 
  calculateTaxBreakdown, 
  DEFAULT_CONFIG, 
  DEFAULT_MOCK_INVOICES,
  formatBRL, 
  formatPercent 
} from './utils/calculations';
import { exportToCSV, generateWhatsAppSummary } from './utils/exportUtils';
import { generateExecutivePDF } from './utils/pdfGenerator';
import { CheckCircle2, HelpCircle } from 'lucide-react';

const STORAGE_INVOICES_KEY = 'fator_r_invoices_v1';
const STORAGE_CONFIG_KEY = 'fator_r_config_v1';

export default function App() {
  // Inicialização do LocalStorage (Inicia com lista VAZIA conforme solicitação do usuário)
  const [invoices, setInvoices] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_INVOICES_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [config, setConfig] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CONFIG_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
    } catch (e) {
      return DEFAULT_CONFIG;
    }
  });

  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Persistência em LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_INVOICES_KEY, JSON.stringify(invoices));
    } catch (e) {
      console.error('Erro ao salvar notas no LocalStorage:', e);
    }
  }, [invoices]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CONFIG_KEY, JSON.stringify(config));
    } catch (e) {
      console.error('Erro ao salvar configurações no LocalStorage:', e);
    }
  }, [config]);

  // Toast Helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Cálculo consolidado das regras do negócio
  const summaryData = calculateTaxBreakdown(invoices, config);

  // Handlers
  const handleAddInvoice = (newInv) => {
    const invoiceObj = {
      id: Date.now().toString(),
      ...newInv,
    };
    setInvoices((prev) => [...prev, invoiceObj]);
  };

  const handleDeleteInvoice = (id) => {
    setInvoices((prev) => prev.filter((inv) => inv.id !== id));
  };

  const handleUpdateInvoice = (id, updatedData) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, ...updatedData } : inv))
    );
  };

  const handleLoadMock = () => {
    setInvoices(DEFAULT_MOCK_INVOICES);
    showToast('Notas de exemplo carregadas com sucesso!');
  };

  const handleResetInvoices = () => {
    if (window.confirm('Deseja realmente limpar todas as notas cadastradas?')) {
      setInvoices([]);
      showToast('Lista de notas limpa.');
    }
  };

  const handleChangeAccountingCost = (newCost) => {
    const val = parseFloat(newCost);
    setConfig((prev) => ({
      ...prev,
      accountingCost: isNaN(val) ? 0 : val,
    }));
  };

  const handleChangeSimplesPct = (newPct) => {
    const val = parseFloat(newPct);
    setConfig((prev) => ({
      ...prev,
      simplesPct: isNaN(val) ? 0 : val,
    }));
  };

  const handleExportCSV = () => {
    if (invoices.length === 0) {
      alert('Nenhuma nota cadastrada para exportar.');
      return;
    }
    exportToCSV(summaryData);
    showToast('Planilha CSV gerada e baixada com sucesso!');
  };

  const handleCopyWhatsApp = () => {
    const summaryText = generateWhatsAppSummary(summaryData);
    navigator.clipboard.writeText(summaryText);
    showToast('Resumo formatado copiado! Cole no WhatsApp ou E-mail.');
  };

  const handleDownloadPDF = async () => {
    if (invoices.length === 0) {
      alert('Adicione ao menos uma nota fiscal para gerar o relatório PDF.');
      return;
    }

    try {
      setIsGeneratingPDF(true);
      // Simula um delay micro-perceptível para feedback de UX
      await new Promise((resolve) => setTimeout(resolve, 350));
      generateExecutivePDF(summaryData, {
        companyName: 'Minha Empresa ME',
      });
      showToast('Relatório PDF Executivo gerado e baixado!');
    } catch (err) {
      console.error('Erro ao gerar PDF:', err);
      alert('Ocorreu um erro ao gerar o documento PDF.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 px-4 py-3 rounded-2xl shadow-2xl font-black text-xs sm:text-sm flex items-center gap-2 border border-emerald-300 animate-fade-in shadow-emerald-500/20">
          <CheckCircle2 className="w-4 h-4 stroke-[3]" />
          {toastMessage}
        </div>
      )}

      {/* Main Container */}
      <div>
        <Header
          onOpenConfig={() => setIsConfigOpen(true)}
          onReset={handleResetInvoices}
          onLoadMock={handleLoadMock}
          onExportCSV={handleExportCSV}
          onCopyWhatsApp={handleCopyWhatsApp}
          onDownloadPDF={handleDownloadPDF}
          isGeneratingPDF={isGeneratingPDF}
          hasInvoices={invoices.length > 0}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

          {/* Cards KPIs */}
          <KpiCards
            totals={summaryData.totals}
            rates={summaryData.rates}
            accountingCost={config.accountingCost}
          />

          {/* Formulário de Notas e Contabilidade */}
          <InvoiceForm
            onAddInvoice={handleAddInvoice}
            accountingCost={config.accountingCost}
            onChangeAccountingCost={handleChangeAccountingCost}
            simplesPct={config.simplesPct}
            onChangeSimplesPct={handleChangeSimplesPct}
          />

          {/* Tabela de Resultados */}
          <InvoiceTable
            summaryData={summaryData}
            onDeleteInvoice={handleDeleteInvoice}
            onUpdateInvoice={handleUpdateInvoice}
            onLoadMock={handleLoadMock}
          />

          {/* Gráfico de Composição & Economia Fator R */}
          <ChartSection
            totals={summaryData.totals}
            rates={summaryData.rates}
          />

        </main>
      </div>

      {/* Rodapé da Aplicação */}
      <footer className="border-t border-slate-900 bg-slate-950/90 py-6 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Calculadora de Fator R Simples Nacional — 100% Local (Client-Side)</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">
              <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
              Simples Nacional ({config.simplesPct}%) com {config.proLaborePct}% Pró-Labore
            </span>
          </div>
        </div>
      </footer>

      {/* Modal de Configurações */}
      <ConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        config={config}
        onSaveConfig={(newConfig) => {
          setConfig(newConfig);
          showToast('Parâmetros salvos com sucesso!');
        }}
      />

    </div>
  );
}
