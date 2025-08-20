// KPI Explanations for Tooltips
export const KPI_EXPLANATIONS: Record<string, string> = {
  // Métricas de Topo de Funil
  'Visitante → Lead': 'Taxa de conversão de visitantes em leads. Percentual de pessoas que visitam seu site e se tornam leads qualificados.',
  'CTR Anúncios': 'Taxa de cliques nos seus anúncios. Percentual de pessoas que clicam nos anúncios em relação ao total de visualizações.',
  'Leads/mês': 'Número total de leads gerados mensalmente. Indica o volume de potenciais clientes captados.',
  'Custo por Lead': 'Valor médio investido para gerar cada lead. Quanto menor, mais eficiente é sua estratégia de aquisição.',
  'Qualidade do Lead': 'Pontuação média da qualidade dos leads gerados, baseada em critérios de fit e interesse.',
  'Tempo na Página': 'Tempo médio que visitantes passam nas suas páginas. Indica engajamento e qualidade do conteúdo.',
  'Taxa de Conversão de Visitantes': 'Percentual de visitantes do site que se tornam leads qualificados. Indica a eficácia do seu conteúdo e ofertas.',
  'Custo por Lead (CPL)': 'Valor médio investido para gerar cada lead. Quanto menor, mais eficiente é sua estratégia de aquisição.',
  'Leads Qualificados': 'Número de leads que atendem aos critérios de qualificação da empresa. Representa o potencial real de vendas.',
  'Taxa de Abertura': 'Percentual de emails abertos em relação aos enviados. Indica a qualidade da sua lista e assunto dos emails.',
  'CTR (Click-Through Rate)': 'Taxa de cliques em links dos seus emails ou anúncios. Mede o engajamento do seu conteúdo.',
  'Tempo no Site': 'Tempo médio que visitantes passam no seu site. Indica o interesse e qualidade do conteúdo.',
  
  // Métricas de Meio de Funil
  'Lead → MQL': 'Taxa de conversão de leads em Marketing Qualified Leads. Percentual de leads que se tornam qualificados para vendas.',
  'Tempo Resposta': 'Tempo médio para primeira resposta a um lead. Crucial para manter o interesse e aumentar conversão.',
  'Show Rate': 'Taxa de comparecimento em reuniões agendadas. Percentual de leads que comparecem às reuniões marcadas.',
  'Email Open Rate': 'Taxa de abertura de emails de nutrição. Percentual de emails abertos pelos leads em processo.',
  'Click Rate': 'Taxa de cliques em emails e conteúdos. Indica engajamento dos leads com o material enviado.',
  'Lead Score Médio': 'Pontuação média dos leads baseada em comportamento e características. Indica qualidade geral.',
  'Taxa de Conversão MQL para SQL': 'Percentual de leads qualificados de marketing que se tornam leads qualificados de vendas.',
  'Taxa de Agendamento': 'Percentual de leads que agendam uma reunião ou demonstração. Indica eficácia do processo comercial.',
  'Score de Engajamento': 'Pontuação baseada na interação do lead com seus conteúdos e comunicações.',
  'Taxa de Nutrição': 'Percentual de leads em processo de educação e relacionamento antes da venda.',
  
  // Métricas de Fundo de Funil
  'MQL → SQL': 'Taxa de conversão de Marketing Qualified Leads em Sales Qualified Leads. Indica eficácia da qualificação.',
  'SQL → Venda': 'Taxa de conversão de Sales Qualified Leads em vendas fechadas. Mede eficiência do time comercial.',
  'Ciclo de Vendas': 'Tempo médio desde a qualificação até o fechamento da venda. Indica velocidade do processo.',
  'Ticket Médio': 'Valor médio de cada venda realizada. Indica o potencial de receita por cliente.',
  'Proposta → Fechamento': 'Taxa de conversão de propostas enviadas em vendas fechadas. Mede qualidade das propostas.',
  'Reuniões/Vendedor': 'Número médio de reuniões por vendedor no período. Indica atividade e produtividade da equipe.',
  'Taxa de Conversão de Vendas': 'Percentual de oportunidades que se convertem em vendas fechadas.',
  'Taxa de Fechamento': 'Percentual de propostas enviadas que resultam em vendas fechadas.',
  'Tempo de Fechamento': 'Tempo médio para fechar uma venda após a primeira reunião comercial.',
  'Pipeline de Vendas': 'Valor total das oportunidades em andamento no funil de vendas.',
  'Taxa de Desconto': 'Percentual médio de desconto aplicado nas vendas. Impacta diretamente na margem.',
  
  // Métricas de Pós-Venda
  'Churn 30d': 'Taxa de cancelamento nos primeiros 30 dias. Percentual de clientes que cancelam no primeiro mês.',
  'Recompra 60d': 'Taxa de recompra em 60 dias. Percentual de clientes que fazem nova compra em 2 meses.',
  'NPS': 'Net Promoter Score. Métrica de satisfação que mede probabilidade de recomendação (escala 0-10).',
  'LTV': 'Lifetime Value. Valor total que um cliente gera durante todo relacionamento com a empresa.',
  'Tempo Onboarding': 'Tempo médio para cliente começar a usar efetivamente o produto após a compra.',
  'Upsell Rate': 'Taxa de vendas adicionais para clientes existentes. Percentual que compra produtos complementares.',
  'Taxa de Retenção': 'Percentual de clientes que renovam ou continuam comprando. Indica satisfação e valor entregue.',
  'Upsell/Cross-sell': 'Receita adicional gerada através de vendas complementares para clientes existentes.',
  'Churn Rate': 'Taxa de cancelamento ou perda de clientes. Quanto menor, melhor a retenção.',
  
  // Métricas Gerais
  'ROI de Marketing': 'Retorno sobre investimento das ações de marketing. Mede a eficiência dos gastos.',
  'CAC (Custo de Aquisição)': 'Custo total para adquirir um novo cliente, incluindo marketing e vendas.',
  'Payback': 'Tempo necessário para recuperar o investimento feito na aquisição de um cliente.',
  'Taxa de Qualificação': 'Percentual de leads que passam pelos critérios de qualificação estabelecidos.',
  'Velocidade do Pipeline': 'Rapidez com que as oportunidades avançam pelas etapas do funil.',
  'Taxa de Rejeição': 'Percentual de visitantes que saem do site sem interagir. Indica problemas de UX ou conteúdo.',
  
  // Benchmarks
  'Conversão Visitante-Lead': 'Taxa de conversão de visitantes em leads comparada com benchmark do mercado SaaS B2B.',
  'Lead para MQL': 'Taxa de conversão de leads em MQLs comparada com padrão da indústria SaaS B2B.',
  'SQL para Venda': 'Taxa de conversão de SQLs em vendas comparada com benchmark do mercado SaaS B2B.',
  'Churn 30 dias': 'Taxa de cancelamento em 30 dias comparada com padrão da indústria SaaS B2B.',
  'Tempo de Resposta': 'Tempo médio de resposta comparado com benchmark do mercado SaaS B2B.',
  'Benchmark do Mercado': 'Comparação da sua performance com a média do seu setor de atuação.',
  'Performance vs Concorrentes': 'Como suas métricas se comparam com empresas similares do mercado.',
  'Índice de Maturidade': 'Nível de desenvolvimento dos seus processos comerciais comparado ao mercado.',
};

// Função para obter explicação de um KPI
export function getKPIExplanation(kpiName: string): string {
  return KPI_EXPLANATIONS[kpiName] || 'Métrica importante para acompanhar a performance do seu funil de vendas.';
}

// Explicações específicas por tipo de métrica
export const METRIC_TYPE_EXPLANATIONS = {
  primary: 'Métricas principais que impactam diretamente nos resultados da etapa.',
  secondary: 'Métricas complementares que ajudam a entender o contexto e performance.',
  benchmarks: 'Comparação com padrões do mercado para avaliar sua posição competitiva.',
};
