import React, { useState } from 'react';
import { X, Settings, RotateCcw, Check } from 'lucide-react';
import { DEFAULT_CONFIG } from '../utils/calculations';

export function ConfigModal({ isOpen, onClose, config, onSaveConfig }) {
  if (!isOpen) return null;

  const [simplesPct, setSimplesPct] = useState(config.simplesPct ?? 6.0);
  const [proLaborePct, setProLaborePct] = useState(config.proLaborePct ?? 28.0);
  const [inssPct, setInssPct] = useState(config.inssPct ?? 11.0);
  const [accountingCost, setAccountingCost] = useState(config.accountingCost ?? 150.00);

  const handleSave = (e) => {
    e.preventDefault();
    onSaveConfig({
      simplesPct: Number(simplesPct),
      proLaborePct: Number(proLaborePct),
      inssPct: Number(inssPct),
      accountingCost: Number(accountingCost),
    });
    onClose();
  };

  const handleResetDefaults = () => {
    setSimplesPct(DEFAULT_CONFIG.simplesPct);
    setProLaborePct(DEFAULT_CONFIG.proLaborePct);
    setInssPct(DEFAULT_CONFIG.inssPct);
    setAccountingCost(DEFAULT_CONFIG.accountingCost);
  };

  const currentEffectiveInssPct = (Number(proLaborePct) / 100) * (Number(inssPct) / 100) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in no-print">
      <div className="glass-card w-full max-w-md p-6 rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl relative">
        
        {/* Header Modal */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-emerald-400" />
            Parâmetros & Alíquotas
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSave} className="space-y-4">
          
          {/* Simples Nacional */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Alíquota Simples Nacional (% Anexo III)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={simplesPct}
              onChange={(e) => setSimplesPct(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm font-bold text-emerald-400 focus:outline-none focus:border-emerald-500"
            />
            <p className="text-[11px] text-slate-400 mt-1">Padrão: 6,0% (1ª Faixa Anexo III)</p>
          </div>

          {/* Pró-Labore % Fator R */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Fator R - Pró-Labore Mínimo (%)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="100"
              value={proLaborePct}
              onChange={(e) => setProLaborePct(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm font-bold text-indigo-400 focus:outline-none focus:border-indigo-500"
            />
            <p className="text-[11px] text-slate-400 mt-1">Padrão: 28,0% do Faturamento Total</p>
          </div>

          {/* INSS % */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              INSS Retido sobre Pró-Labore (%)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="100"
              value={inssPct}
              onChange={(e) => setInssPct(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm font-bold text-purple-400 focus:outline-none focus:border-purple-500"
            />
            <div className="mt-1.5 p-2 bg-slate-950/60 rounded-lg border border-slate-800 text-[11px] text-slate-300">
              ⚡ INSS Efetivo por Nota: <strong>{currentEffectiveInssPct.toFixed(2).replace('.', ',')}%</strong> ({proLaborePct}% × {inssPct}%)
            </div>
          </div>

          {/* Contabilidade Fixo */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Custo Fixo Mensal de Contabilidade (R$)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={accountingCost}
              onChange={(e) => setAccountingCost(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm font-bold text-amber-400 focus:outline-none focus:border-amber-500"
            />
            <p className="text-[11px] text-slate-400 mt-1">Será dividido em partes exatamente iguais entre as notas</p>
          </div>

          {/* Footer Ações */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800 gap-2">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 rounded-xl transition flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Restaurar Padrões
            </button>

            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              Salvar Parâmetros
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
