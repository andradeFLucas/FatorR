import React from 'react';
import { Calculator, Settings, RefreshCw, Sparkles, FileDown, Share2, FileSpreadsheet, Loader2, CheckCircle } from 'lucide-react';

export function Header({
  onOpenConfig,
  onReset,
  onLoadMock,
  onExportCSV,
  onCopyWhatsApp,
  onDownloadPDF,
  isGeneratingPDF,
  hasInvoices,
}) {
  return (
    <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-40 no-print transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Brand & Title */}
          <div className="flex items-center gap-3.5">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl blur opacity-35 group-hover:opacity-75 transition duration-300"></div>
              <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-slate-900 to-slate-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold shadow-lg shadow-emerald-500/10">
                <Calculator className="w-5 h-5 stroke-[2.3]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  Simples Nacional <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent font-extrabold">Fator R</span>
                </h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Anexo III • Fator R ≥ 28%
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Simulação e rateio analítico de impostos e custo fixo por Nota Fiscal
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            {!hasInvoices && (
              <button
                onClick={onLoadMock}
                className="px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-all flex items-center gap-2 shadow-sm hover:scale-[1.02] active:scale-95"
                title="Carregar 3 notas fiscais de exemplo (Neo, Dark Stores, PQS)"
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Carregar Exemplo
              </button>
            )}

            {hasInvoices && (
              <div className="flex items-center p-1 bg-slate-900/90 rounded-xl border border-slate-800/80 shadow-inner gap-1">
                {/* Copiar WhatsApp */}
                <button
                  onClick={onCopyWhatsApp}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition flex items-center gap-1.5 active:scale-95"
                  title="Copiar resumo formatado para enviar no WhatsApp"
                >
                  <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </button>

                {/* Exportar Excel / CSV */}
                <button
                  onClick={onExportCSV}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition flex items-center gap-1.5 active:scale-95"
                  title="Baixar planilha CSV compatível com Excel"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">Excel</span> / CSV
                </button>

                {/* Baixar PDF Personalizado com jspdf */}
                <button
                  onClick={onDownloadPDF}
                  disabled={isGeneratingPDF}
                  className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition flex items-center gap-1.5 shadow-sm active:scale-95 disabled:opacity-50"
                  title="Baixar Relatório Executivo Personalizado em PDF"
                >
                  {isGeneratingPDF ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                      <span>Gerando...</span>
                    </>
                  ) : (
                    <>
                      <FileDown className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Baixar PDF</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Configurações Globais */}
            <button
              onClick={onOpenConfig}
              className="p-2 text-slate-400 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-800 rounded-xl transition shadow-sm active:scale-95"
              title="Configurações avançadas de Alíquotas e Parâmetros"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Reset / Limpar */}
            {hasInvoices && (
              <button
                onClick={onReset}
                className="p-2 text-slate-400 hover:text-rose-400 bg-slate-900/90 hover:bg-rose-950/30 border border-slate-800 hover:border-rose-500/40 rounded-xl transition shadow-sm active:scale-95"
                title="Limpar todas as notas fiscais cadastradas"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
