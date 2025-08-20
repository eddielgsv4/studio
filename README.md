# V4 SalesAI - Ecossistema de Evolução Comercial

Uma plataforma completa de inteligência artificial para diagnóstico, otimização e automação de funis de vendas, desenvolvida pela V4 Company.

## 🚀 Visão Geral

O V4 SalesAI é um ecossistema integrado que combina análise de dados, benchmarking de mercado e inteligência artificial para transformar operações comerciais. A plataforma oferece diagnósticos precisos do funil de vendas, comparações com benchmarks do setor e planos de ação priorizados para maximizar resultados.

### Principais Características

- **Diagnóstico Inteligente**: Análise completa do funil de vendas com IA
- **Benchmarking de Mercado**: Comparação com dados reais do setor
- **Copiloto Comercial**: Assistente IA para otimização contínua
- **Modelo Pay-Per-Know**: Sem mensalidade, pague apenas pelo que usar
- **Planos de Ação Priorizados**: Foco nos gargalos que mais impactam resultados

## 🏗️ Arquitetura Técnica

### Stack Principal

- **Frontend**: Next.js 15.3.3 com App Router
- **UI Framework**: React 18 + TypeScript
- **Styling**: Tailwind CSS + Shadcn/UI
- **IA/ML**: Google Genkit AI Framework
- **Backend**: Firebase (Auth, Database, Hosting)
- **Deployment**: Firebase App Hosting

### Estrutura do Projeto

```
studio/
├── src/
│   ├── ai/                     # Fluxos de IA e ferramentas
│   │   ├── flows/              # Fluxos específicos de IA
│   │   │   ├── ai-sales-diagnosis.ts
│   │   │   ├── funnel-diagnosis.ts
│   │   │   ├── generate-ad-creative.ts
│   │   │   └── ...
│   │   └── tools/              # Ferramentas auxiliares
│   ├── app/                    # Páginas e rotas (App Router)
│   │   ├── (auth)/             # Rotas autenticadas
│   │   │   └── diagnostico/    # Fluxo de diagnóstico
│   │   ├── diagnostico/        # Fluxo público
│   │   └── page.tsx            # Landing page
│   ├── components/             # Componentes reutilizáveis
│   │   ├── landing/            # Componentes da landing
│   │   ├── diagnostico/        # Componentes do diagnóstico
│   │   └── ui/                 # Componentes base (Shadcn)
│   ├── contexts/               # Contextos React
│   │   ├── AuthContext.tsx
│   │   └── DiagnosticContext.tsx
│   └── lib/                    # Utilitários e configurações
├── docs/                       # Documentação
└── package.json
```

## 🤖 Funcionalidades de IA

### 1. Diagnóstico de Vendas (`ai-sales-diagnosis.ts`)
- Análise de respostas do usuário
- Identificação de gargalos e oportunidades
- Recomendações acionáveis

### 2. Diagnóstico de Funil (`funnel-diagnosis.ts`)
- Análise detalhada por estágio do funil
- Comparação com benchmarks de mercado
- Status por cores (verde/âmbar/vermelho)
- Ações sugeridas específicas

### 3. Geração de Criativos (`generate-ad-creative.ts`)
- Criação de materiais de marketing
- Otimização baseada em dados do funil

### 4. Análise Preditiva (`weekly-analysis.ts`)
- Projeções de performance
- Identificação de tendências

## 📊 Fluxo de Diagnóstico

### Etapas do Processo

1. **Início** (`/diagnostico/inicio`)
   - Apresentação da proposta
   - Criação de conta gratuita

2. **Dados da Empresa** (`/diagnostico/conta`)
   - Informações básicas da empresa
   - Segmento e modelo de negócio

3. **Produto/Serviço** (`/diagnostico/produto`)
   - Proposta de valor
   - Diferenciais competitivos
   - Modelo de pricing

4. **Métricas do Funil** (`/diagnostico/funil/metricas`)
   - Dados quantitativos por estágio
   - Conversões e tempos de resposta

5. **Análise e Resultados** (`/diagnostico/gerar`)
   - Processamento via IA
   - Geração do diagnóstico completo

### Estrutura de Dados

```typescript
interface FunnelData {
  // Topo de Funil
  topoVisitanteLead: number;      // Conversão Visitante → Lead (%)
  topoCTRAnuncios: number;        // CTR anúncios (%)
  topoFormPreenchido: number;     // Formulário preenchido (%)
  
  // Meio de Funil
  meioLeadMQL: number;            // Lead → MQL (%)
  meioTempoPrimeiraResposta: number; // Tempo 1ª resposta (min)
  meioShowRate: number;           // Show Rate (%)
  
  // Fundo de Funil
  fundoMQLSQL: number;            // MQL → SQL (%)
  fundoPropostaFechamento: number; // Proposta → Fechamento (%)
  fundoFollowUpsMedios: number;   // Follow-ups médios
  
  // Pós-Conversão
  posRecompra60d: number;         // Recompra 60d (%)
  posChurn30d: number;            // Churn 30d (%)
}
```

## 🎨 Design System

### Cores
- **Primária**: `#primary` (definida no Tailwind)
- **Secundária**: `#secondary`
- **Background**: `#background`
- **Foreground**: `#foreground`
- **Muted**: `#muted-foreground`

### Tipografia
- **Headline**: Bebas Neue (bold, impactante)
- **Body**: Inter (legibilidade, moderno)

### Componentes UI
- Baseados no Shadcn/UI
- Totalmente customizáveis via Tailwind
- Acessibilidade integrada (Radix UI)

## 🔧 Configuração e Desenvolvimento

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Conta Firebase

### Instalação

```bash
# Clone o repositório
git clone <repository-url>
cd studio

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local

# Execute em modo desenvolvimento
npm run dev
```

### Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Next.js dev server (porta 9002)
npm run genkit:dev       # Genkit AI development
npm run genkit:watch     # Genkit com watch mode

# Build e Deploy
npm run build            # Build para produção
npm run start            # Servidor de produção
npm run lint             # ESLint
npm run typecheck        # Verificação TypeScript
```

### Configuração do Firebase

1. Crie um projeto no Firebase Console
2. Configure Authentication, Firestore e Hosting
3. Adicione as credenciais em `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
# ... outras configurações
```

## 🧠 Integração com IA

### Google Genkit
A plataforma utiliza o Google Genkit para orquestração de IA:

```typescript
// Exemplo de fluxo de IA
const aiSalesDiagnosisFlow = ai.defineFlow({
  name: 'aiSalesDiagnosisFlow',
  inputSchema: AiSalesDiagnosisInputSchema,
  outputSchema: AiSalesDiagnosisOutputSchema,
}, async (input) => {
  const { output } = await prompt(input);
  return output;
});
```

### Sistema de Créditos
- Primeiro diagnóstico gratuito
- Diagnósticos subsequentes consomem créditos
- Modelo transparente pay-per-use

## 📱 Funcionalidades por Seção

### Landing Page
- **Hero**: Proposta de valor principal
- **About**: Explicação detalhada da plataforma
- **Journey**: Jornada do usuário em 3 passos
- **Diagnosis**: Demonstração interativa
- **Copilot**: Simulação do assistente IA
- **Ecosystem**: Visão geral das ferramentas
- **Pricing**: Modelo pay-per-know
- **Partners**: Validação social
- **FAQ**: Perguntas frequentes

### Dashboard (Autenticado)
- Histórico de diagnósticos
- Métricas de performance
- Acesso ao copiloto IA
- Gestão de créditos

## 🔒 Autenticação e Segurança

### Firebase Auth
- Autenticação via email/senha
- Integração com contexto React
- Proteção de rotas sensíveis

### Segurança de IA
- Filtros de segurança configurados
- Validação de entrada via Zod
- Rate limiting por usuário

## 📈 Analytics e Monitoramento

### Eventos Rastreados
- Cliques em CTAs principais
- Conclusão de diagnósticos
- Uso de funcionalidades IA
- Conversões por etapa

### Métricas de Negócio
- Taxa de conversão do diagnóstico
- Engajamento com o copiloto
- Retenção de usuários
- Consumo de créditos

## 🚀 Deploy e Produção

### Firebase App Hosting
```yaml
# apphosting.yaml
runConfig:
  cpu: 1
  memoryMiB: 512
  minInstances: 0
  maxInstances: 10
```

### Processo de Deploy
1. Build da aplicação: `npm run build`
2. Deploy via Firebase CLI: `firebase deploy`
3. Configuração de domínio customizado

## 🤝 Contribuição

### Padrões de Código
- TypeScript obrigatório
- ESLint + Prettier configurados
- Componentes funcionais com hooks
- Nomenclatura em português para domínio de negócio

### Estrutura de Commits
```
feat: adiciona nova funcionalidade de diagnóstico
fix: corrige bug no cálculo de métricas
docs: atualiza documentação da API
style: ajusta espaçamento dos componentes
```

## 📞 Suporte

Para dúvidas técnicas ou sugestões:
- **Email**: suporte@v4company.com
- **Documentação**: [docs.v4salesai.com]
- **Status**: [status.v4salesai.com]

## 📄 Licença

© 2024 V4 Company. Todos os direitos reservados.

---

**V4 SalesAI** - Transformando dados em resultados através da inteligência artificial.
