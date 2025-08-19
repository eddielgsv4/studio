
import type { DiagnosisStage } from './types';

export const navLinks = [
  { href: '#o-que-e', label: 'O que é' },
  { href: '#diagnostico', label: 'Diagnóstico' },
  { href: '#copiloto', label: 'Copiloto' },
  { href: '#ecosistema', label: 'Ecossistema' },
  { href: '#payperknow', label: 'Preços' },
  { href: '#faq', label: 'FAQ' },
];

export const heroData = {
    titlePart1: "O Ecossistema de Evolução Comercial que coloca sua operação no",
    titleHighlight: "Piloto Automático.",
    titlePart2: "",
    subtitle: "Audite seu funil, compare com benchmarks de mercado e execute planos de ação com seu Copiloto de IA. Comece com um diagnóstico 100% gratuito.",
    pill: "Diagnóstico com IA + Plano de Ação + Créditos Iniciais Grátis",
    ctaPrimary: {
        text: "Quero Meu Diagnóstico Gratuito",
        href: "/diagnostico/inicio",
        analyticsId: "hero_cta_primary_click"
    },
    bullets: [
        { text: "Benchmarks Reais por Setor", icon: "target" },
        { text: "IA que Explica e Prioriza", icon: "brain" },
        { text: "Plano de Ação Guiado", icon: "listChecks" }
    ]
};

export const aboutData = {
    title: "O que é o V4SalesAI?",
    subtitle: "Uma plataforma completa para escalar suas vendas com inteligência artificial — do diagnóstico preciso à execução otimizada.",
    paragraph: "O V4SalesAI é mais que uma ferramenta, é um ecossistema que integra análise de dados, benchmarking e um copiloto de IA para transformar sua operação comercial. Mapeamos seu funil, comparamos com milhões de dados da V4 Company e do seu setor, geramos um score de performance e entregamos um plano de ação priorizado. Execute projetos, monitore indicadores e evolua com uma jornada guiada por IA em todas as etapas do seu funil.",
    cta: {
        text: "Pronto para evoluir suas vendas?",
        buttonText: "Começar Diagnóstico Gratuito",
        href: "/diagnostico/inicio"
    }
};

export const aboutBullets = [
    {
      name: 'Diagnóstico Avançado',
      description: 'Análise contínua do seu funil comercial, benchmarked com o mercado.',
      icon: 'barChart',
    },
    {
      name: 'Copiloto Comercial IA',
      description: 'Seu assistente que monitora métricas, detecta gargalos e sugere melhorias.',
      icon: 'bot',
    },
    {
      name: 'Analytics Preditivo',
      description: 'Projete cenários, antecipe riscos e tome decisões antes dos problemas acontecerem.',
      icon: 'zap',
    },
    {
      name: 'Treinamento Inteligente',
      description: 'Simule negociações com roleplays e otimize scripts de venda com IA.',
      icon: 'brain',
    },
    {
      name: 'Preparo Pré-Reunião',
      description: 'Entre em cada call sabendo tudo sobre seu lead e com um roteiro de insights.',
      icon: 'shield',
    },
    {
      name: 'Execução Guiada',
      description: 'Receba um plano de ação claro e priorizado para focar no que gera mais resultado.',
      icon: 'listChecks',
    },
];

export const journeyData = {
    title: "Sua Jornada de Evolução Começa Agora",
    subtitle: "Em três passos simples, você transforma dados em resultados e ganha um copiloto para guiar sua execução.",
    steps: [
        {
            title: "Diagnóstico Instantâneo",
            description: "Preencha os dados do seu funil e nossa IA analisa e compara com o mercado e benchmarks da V4 Company."
        },
        {
            title: "Plano de Ação Inteligente",
            description: "Receba um score detalhado do seu funil e um plano de ação priorizado para atacar os maiores gargalos."
        },
        {
            title: "Ative seu Copiloto",
            description: "Ganhe créditos para ativar seu agente de IA, que te ajudará a executar o plano e otimizar suas vendas."
        }
    ],
    pills: ["Sem Cartão", "Sem Mensalidade", "Resultado Imediato"],
    cta: {
        text: "Gerar Meu Diagnóstico Agora",
        analyticsId: "journey_cta_click"
    }
};

export const diagnosisData: { stages: DiagnosisStage[] } = {
    stages: [
        {
            icon: 'megaphone',
            title: "Topo de Funil",
            description: "Atração e Captura",
            metrics: [
                { label: "Visitante→Lead (%)", value: 3, marketValue: 5, status: 'red' },
                { label: "CTR anúncios (%)", value: 1.5, marketValue: 2, status: 'amber' },
                { label: "Form. preenchido (%)", value: 25, marketValue: 20, status: 'green' }
            ],
            tips: ["Otimizar copy do anúncio.", "Simplificar formulário de captura.", "Testar novas chamadas (CTAs)."]
        },
        {
            icon: 'handshake',
            title: "Meio de Funil",
            description: "Engajamento e Qualificação",
            metrics: [
                { label: "Lead→MQL (%)", value: 40, marketValue: 35, status: 'green' },
                { label: "Tempo 1ª resposta", value: 60, marketValue: 15, status: 'red' },
                { label: "Show Rate (%)", value: 50, marketValue: 60, status: 'amber' }
            ],
            tips: ["Automatizar contato inicial.", "Enviar lembretes de reunião.", "Qualificar leads com mais precisão."]
        },
        {
            icon: 'target',
            title: "Fundo de Funil",
            description: "Conversão e Fechamento",
            metrics: [
                { label: "MQL→SQL (%)", value: 70, marketValue: 75, status: 'amber' },
                { label: "Proposta→Fechamento (%)", value: 20, marketValue: 25, status: 'red' },
                { label: "Follow-ups médios", value: 6, marketValue: 4, status: 'amber' }
            ],
            tips: ["Criar script de follow-up.", "Analisar propostas perdidas.", "Oferecer social proof na proposta."]
        },
        {
            icon: 'heart',
            title: "Pós-Conversão",
            description: "Retenção e Fidelização",
            metrics: [
                { label: "Recompra 60d (%)", value: 15, marketValue: 10, status: 'green' },
                { label: "Churn 30d (%)", value: 8, marketValue: 5, status: 'red' },
                { label: "NPS", value: 45, marketValue: 50, status: 'amber' }
            ],
            tips: ["Implementar pesquisa de NPS.", "Criar campanha de reativação.", "Oferecer benefícios exclusivos."]
        }
    ]
};

export const copilotData = {
    initialMessages: [
        { agent: 'bot', text: 'Olá! Sou seu Copiloto de IA. Pronto para encontrar os gargalos na sua operação de vendas? Escolha um exemplo para simular um diagnóstico.' }
    ],
    examples: [
        { label: 'SaaS B2B', id: 'saas' },
        { label: 'E-commerce D2C', id: 'ecommerce' },
        { label: 'Serviços High-Ticket', id: 'services' }
    ]
};

export const sampleFunnelData = {
    saas: { topoVisitanteLead: 2, topoCTRAnuncios: 1.2, topoFormPreenchido: 30, meioLeadMQL: 25, meioTempoPrimeiraResposta: 120, meioShowRate: 40, fundoMQLSQL: 60, fundoPropostaFechamento: 15, fundoFollowUpsMedios: 7, posRecompra60d: 25, posChurn30d: 7 },
    ecommerce: { topoVisitanteLead: 4, topoCTRAnuncios: 3, topoFormPreenchido: 10, meioLeadMQL: 5, meioTempoPrimeiraResposta: 1440, meioShowRate: 90, fundoMQLSQL: 100, fundoPropostaFechamento: 5, fundoFollowUpsMedios: 1, posRecompra60d: 20, posChurn30d: 3 },
    services: { topoVisitanteLead: 1, topoCTRAnuncios: 0.8, topoFormPreenchido: 15, meioLeadMQL: 50, meioTempoPrimeiraResposta: 30, meioShowRate: 70, fundoMQLSQL: 80, fundoPropostaFechamento: 30, fundoFollowUpsMedios: 5, posRecompra60d: 5, posChurn30d: 2 },
};

export const ecosystemData = {
    title: "Um Ecossistema de Vendas Inteligente e Conectado",
    subtitle: "Todas as ferramentas que você precisa para diagnosticar, executar e evoluir sua operação comercial, integradas em uma única plataforma.",
    features: [
        { title: "Copiloto Comercial", description: "Seu assistente IA que monitora métricas, detecta gargalos e sugere melhorias em tempo real.", icon: "bot" },
        { title: "Diagnóstico Contínuo", description: "Compare seu funil com benchmarks do mercado e dados da V4 Company, e acompanhe sua evolução.", icon: "barChart" },
        { title: "Treinamento com IA", description: "Use roleplays e simulações para treinar sua equipe e aprimorar scripts de vendas.", icon: "brain" },
        { title: "Inteligência Pré-Reunião", description: "Entre em cada call com um dossiê completo do seu lead e um roteiro de insights.", icon: "shield" },
        { title: "Análise Preditiva", description: "Antecipe resultados, projete cenários e tome decisões estratégicas baseadas em dados.", icon: "zap" },
        { title: "Conteúdo de Experts", description: "Acesse treinamentos exclusivos com os maiores especialistas em vendas da V4 Company.", icon: "headset" }
    ]
};

export const pricingData = {
    title: "Pay-Per-Know: Pague apenas pelo que usar",
    paragraph: "Sem mensalidade, sem contrato e sem surpresas. Adicione créditos à sua carteira e utilize em diagnósticos, simulações ou automações. Totalmente transparente e sob demanda.",
    steps: [
        { title: "Carregue sua Carteira", description: "Adicione créditos via PIX ou Cartão. Simples e sem contrato.", icon: "wallet" },
        { title: "Use Sob Demanda", description: "Consuma créditos apenas quando precisar das ferramentas de IA.", icon: "zap" },
        { title: "Recarregue Quando Quiser", description: "Flexibilidade total para adicionar mais créditos conforme sua necessidade.", icon: "refresh" }
    ],
    pills: ["Zero Mensalidade", "Controle Total", "Transparência", "Flexibilidade", "Sem Contrato"],
    cta: {
        text: "Comece com um diagnóstico gratuito e créditos para testar!",
        buttonText: "Criar Conta Gratuita",
        href: "/diagnostico/inicio",
        analyticsId: "pay_cta_click"
    }
};

export const partnersData = {
    title: "Tecnologia Validada por Líderes de Mercado",
    subtitle: "O ecossistema V4 Company é a escolha de startups e gigantes para construir resultados reais e escaláveis.",
    logos: [
        { name: "Google", src: "https://v4company.com/assets/img/partners/google.svg", width: 120, height: 40 },
        { name: "Meta", src: "https://v4company.com/assets/img/partners/meta.svg", width: 120, height: 40 },
        { name: "TikTok", src: "https://v4company.com/assets/img/partners/tiktok.svg", width: 120, height: 40 },
        { name: "Salesforce", src: "https://v4company.com/assets/img/partners/salesforce.svg", width: 120, height: 40 },
        { name: "RDStation", src: "https://v4company.com/assets/img/partners/rd-station.svg", width: 140, height: 50 },
        { name: "Hubspot", src: "https://v4company.com/assets/img/partners/hubspot.svg", width: 120, height: 40 },
    ]
};

export const faqData = {
    title: "Perguntas Frequentes",
    items: [
        { id: "faq1", question: "Existe alguma mensalidade ou taxa de assinatura?", answer: "Não. O V4SalesAI opera no modelo Pay-Per-Know. Você adquire créditos e os utiliza conforme sua necessidade, sem nenhum tipo de assinatura ou taxa recorrente.", analyticsId: 'faq_open_0' },
        { id: "faq2", question: "Como os créditos funcionam?", answer: "Cada ação na plataforma, como gerar um diagnóstico detalhado ou usar o Copiloto IA, consome uma quantidade específica de créditos. Tudo é mostrado de forma transparente antes de você confirmar a ação.", analyticsId: 'faq_open_1' },
        { id: "faq3", question: "Preciso integrar meu CRM para usar a plataforma?", answer: "Não é obrigatório. Você pode inserir os dados do seu funil manualmente. A integração com CRM é uma funcionalidade futura que tornará o processo ainda mais automático.", analyticsId: 'faq_open_2' },
        { id: "faq4", question: "O que está incluso no teste gratuito?", answer: "O seu primeiro diagnóstico completo do funil de vendas é 100% gratuito. Além disso, você recebe um pacote de créditos iniciais para testar as funcionalidades do Copiloto IA.", analyticsId: 'faq_open_3' },
        { id: "faq5", question: "Como o plano de ação funciona na prática?", answer: "A IA analisa seu diagnóstico, identifica os maiores gargalos e cria uma lista de tarefas priorizadas por impacto. Isso te ajuda a focar no que realmente vai gerar resultados.", analyticsId: 'faq_open_4' },
        { id: "faq6", question: "A plataforma serve para o meu tipo de negócio (B2B/B2C)?", answer: "Sim. O V4SalesAI é projetado para ser agnóstico ao modelo de negócio. Nossa metodologia e IA se aplicam a qualquer processo de vendas, seja B2B, B2C, D2C ou Enterprise.", analyticsId: 'faq_open_5' },
    ]
};

export const footerData = {
    tagline: "A plataforma de inteligência comercial que transforma dados em resultados.",
    copyright: "V4 Company © {ano} · Todos os direitos reservados."
};

    