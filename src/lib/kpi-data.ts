
import type { DiagnosticData } from "@/contexts/DiagnosticContext";

export interface Kpi {
    key: keyof NonNullable<DiagnosticData['funilData']>;
    title: string;
    tooltip: string;
    goal: number;
    isLowerBetter?: boolean;
    impactFormula?: (data: DiagnosticData) => number;
}

export const ALL_KPIS: Kpi[] = [
    {
      key: 'topoVisitanteLead',
      title: "Visitante → Lead",
      tooltip: "Conversão de visitantes do site em leads (%)",
      goal: 3.2,
    },
    {
      key: 'meioLeadMQL',
      title: "Lead → MQL",
      tooltip: "Conversão de Leads em Leads Qualificados pelo Marketing (%)",
      goal: 31,
    },
     {
      key: 'fundoPropostaFechamento',
      title: "Proposta → Fechamento",
      tooltip: "Das propostas comerciais enviadas, qual o percentual é ganho (%)",
      goal: 25,
    },
    {
      key: 'posChurn30d',
      title: "Churn em 30 dias",
      tooltip: "Percentual da sua base de clientes que cancela o serviço mensalmente (%)",
      goal: 4,
      isLowerBetter: true,
      // Churn impact is more complex, involving LTV. Simplified for now.
    },
    {
        key: 'topoCTRAnuncios',
        title: "CTR Médio dos Anúncios",
        tooltip: "Taxa de cliques (Cliques ÷ Impressões) média de suas campanhas pagas.",
        goal: 2.1,
    },
    {
        key: 'meioShowRate',
        title: "Show Rate / Comparecimento",
        tooltip: "Das reuniões agendadas, qual o percentual de comparecimento real?",
        goal: 68,
    },
    {
        key: 'fundoMQLSQL',
        title: "MQL → SQL",
        tooltip: "Dos MQLs, qual o percentual se torna uma Oportunidade Qualificada por Vendas?",
        goal: 75,
    },
    {
        key: 'fundoSQLVenda',
        title: "SQL → Venda",
        tooltip: "Das oportunidades (SQLs), qual o percentual se torna cliente?",
        goal: 30,
    },
    {
        key: 'topoFormPreenchido',
        title: 'Preenchimento de Formulário',
        tooltip: 'Das pessoas que iniciam, qual o percentual que completa o preenchimento do seu principal formulário de captura?',
        goal: 40
    },
    {
        key: 'meioTempoPrimeiraResposta',
        title: 'Tempo 1ª Resposta (min)',
        tooltip: 'Em média, quanto tempo (em minutos) seu time leva para fazer o primeiro contato com um novo lead?',
        goal: 15,
        isLowerBetter: true
    },
    {
        key: 'fundoFollowUpsMedios',
        title: 'Follow-ups Médios',
        tooltip: 'Em média, quantos contatos (follow-ups) são feitos por oportunidade até a decisão final?',
        goal: 4,
        isLowerBetter: true
    },
    {
        key: 'posRecompra60d',
        title: 'Recompra em 60 dias (%)',
        tooltip: 'Qual o percentual de clientes que realiza uma segunda compra em até 60 dias?',
        goal: 15
    }
];
