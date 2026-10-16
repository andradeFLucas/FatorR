# 🧮 Calculadora de Fator R & Rateio de Impostos (Simples Nacional)

Aplicação web moderna, responsiva e de alta precisão para microempresas (ME) enquadradas no **Simples Nacional (Anexo III)** realizarem a simulação e o rateio proporcional exato de impostos (**Simples Nacional 6%**, **INSS do Pró-Labore 11%**) e custos fixos (**Contabilidade Rateada**) por Nota Fiscal emitida.

---

## 💡 Regras de Negócio & Fórmulas Aplicadas

1. **Faturamento Total ($F$):** Soma de todas as notas fiscais do mês.
2. **Alíquota de Imposto / Simples Nacional ($S_i$):** Customizável pelo usuário (padrão $6\%$ do $Anexo\ III$), podendo ser ajustada globalmente na barra rápida ou individualmente por Nota Fiscal.
3. **Pró-Labore Mínimo ($PL$):** Para manter a empresa no Anexo III ($6\%$), o Pró-Labore total da empresa precisa corresponder obrigatoriamente a **$28\%$ do Faturamento Total** (Fator R $\ge 0,28$).
4. **INSS Retido do Pró-Labore ($INSS_i$):** $11\%$ de alíquota sobre o Pró-Labore total.
   - *Rateio Proporcional por Nota:* O INSS referente a cada nota corresponde exatamente a **$3,08\%$** do valor da própria nota ($28\% \times 11\%$).
5. **Rateio Fixo da Contabilidade ($C_i$):** O valor fixo mensal da contabilidade (ex: R$ 150,00, editável diretamente) é dividido **em partes exatamente iguais** entre a quantidade total de notas cadastradas.
6. **Total de Custos por Nota ($TC_i$):** $S_i + INSS_i + C_i$.
7. **Custo % Efetivo ($E_i$):** $\left(\frac{TC_i}{\text{Valor da Nota}_i}\right) \times 100$.

---

## 🚀 Como Executar Localmente em Localhost

### Pré-requisitos
- Node.js instalado (v18+)

### Passo a Passo:
1. Abra o terminal na pasta do projeto:
   ```bash
   npm install
   ```

2. Inicie o servidor de desenvolvimento local:
   ```bash
   npm run dev
   ```

3. Acesse a aplicação no navegador em `http://localhost:5173`.

---

## ☁️ Como Fazer Deploy na Vercel (1-Clique)

### Opção 1: Via Vercel CLI
```bash
npx vercel
```

### Opção 2: Via Interface Web da Vercel (GitHub/GitLab)
1. Suba o código para um repositório no GitHub.
2. Acesse [vercel.com/new](https://vercel.com/new).
3. Importe o repositório.
4. A Vercel detectará automaticamente a configuração do Vite. Clique em **Deploy**.

---

## 🛠️ Tecnologias Utilizadas
- **React 18** + **Vite**
- **Tailwind CSS** (Design Responsivo, Glassmorphism 2.0 & Radial Lighting)
- **Lucide React** (Ícones Executivos)
- **jsPDF & jspdf-autotable** (Download Direto de Relatório Executivo em PDF)
- **LocalStorage API** (Persistência Automática de Dados no Navegador)
- **UTF-8 CSV & WhatsApp Formatter** (Exportação de Relatórios e Planilhas)
