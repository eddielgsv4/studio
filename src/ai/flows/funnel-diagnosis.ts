
'use server';

/**
 * @fileOverview Provides a funnel diagnosis powered by AI, benchmarked against market data.
 *
 * - funnelDiagnosis - A function that handles the funnel diagnosis process.
 * - FunnelDiagnosisInput - The input type for the funnelDiagnosis function.
 * - FunnelDiagnosisOutput - The return type for the funnelDiagnosis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { useCredits } from '../tools/credits';

const FunnelDataBaseSchema = z.object({
      // Topo
      topoVisitanteLead: z.number().optional().describe('Conversão Visitante -> Lead (%)'),
      topoCTRAnuncios: z.number().optional().describe('CTR anúncios (%)'),
      topoFormPreenchido: z.number().optional().describe('Form preenchido (%)'),
      
      // Meio
      meioLeadMQL: z.number().optional().describe('Conversão Lead -> MQL (%)'),
      meioTempoPrimeiraResposta: z.number().optional().describe('Tempo 1ª resposta (min)'),
      meioShowRate: z.number().optional().describe('Show Rate / Comparecimento (%)'),

      // Fundo
      fundoMQLSQL: z.number().optional().describe('Conversão MQL -> SQL (%)'),
      fundoSQLVenda: z.number().optional().describe('Conversão SQL -> Venda (%)'),
      fundoPropostaFechamento: z.number().optional().describe('Conversão Proposta -> Fechamento (%)'),
      fundoFollowUpsMedios: z.number().optional().describe('Follow-ups médios'),
      
      // Pós
      posRecompra60d: z.number().optional().describe('Taxa de Recompra em 60 dias (%)'),
      posChurn30d: z.number().optional().describe('Taxa de Churn em 30 dias (%)'),
});

const FunnelDiagnosisInputSchema = z.object({
  userId: z.string().describe("The user's unique ID."),
  isFirstDiagnosis: z.boolean().optional().describe("Set to true if this is the user's very first diagnosis, which should be free."),
  empresa: z.object({
    propostaDeValor: z.string().describe('The company\'s unique value proposition.'),
    modeloPricing: z.string().describe('The company\'s pricing model.'),
    diferenciais: z.string().describe('The company\'s key competitive differentiators.'),
    // Context added for deeper analysis
    segmento: z.string().describe('The company\'s industry segment (e.g., Tecnologia/SaaS, E-commerce).'),
    porte: z.string().describe('The company\'s size (e.g., Startup, Pequena, Média).'),
    modelo: z.string().describe('The company\'s business model (e.g., B2B - SaaS, B2C - E-commerce).'),
  }),
  funilData: FunnelDataBaseSchema.describe('Data for each stage of the sales funnel for the current period.'),
  funilDataAnterior: FunnelDataBaseSchema.optional().describe('Data for each stage of the sales funnel for the previous period, for comparison.'),
  materialMarketingUri: z.string().optional().describe("A marketing material image, provided as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
  contextoAdicional: z.string().optional().describe("Qualquer contexto adicional relevante para a análise, como tendências de mercado, análise de concorrentes ou informações extraídas de um site, que serão fornecidas pela searchTool."),
  marketing: z.object({
    source: z.string().optional(),
    medium: z.string().optional(),
    campaign: z.string().optional(),
    term: z.string().optional(),
    content: z.string().optional(),
  }).optional().describe('Marketing campaign data used to acquire the user.'),
});
export type FunnelDiagnosisInput = z.infer<typeof FunnelDiagnosisInputSchema>;

const FunnelDiagnosisOutputSchema = z.object({
  diagnosis: z.object({
    topoDeFunil: z.object({
      status: z.string().describe('The status of the top of the funnel (e.g., green, amber, red).'),
      analysis: z.string().describe('The analysis of the top of the funnel performance.'),
      suggestedActions: z.array(z.string()).describe('Suggested actions for improving the top of the funnel.'),
    }),
    meioDeFunil: z.object({
      status: z.string().describe('The status of the middle of the funnel.'),
      analysis: z.string().describe('The analysis of the middle of the funnel performance.'),
      suggestedActions: z.array(z.string()).describe('Suggested actions for improving the middle of the funnel.'),
    }),
    fundoDeFunil: z.object({
      status: z.string().describe('The status of the bottom of the funnel.'),
      analysis: z.string().describe('The analysis of the bottom of the funnel performance.'),
      suggestedActions: z.array(z.string()).describe('Suggested actions for improving the bottom of the funnel.'),
    }),
    posConversao: z.object({
      status: z.string().describe('The status of the post-conversion stage.'),
      analysis: z.string().describe('The analysis of the post-conversion performance.'),
      suggestedActions: z.array(z.string()).describe('Suggested actions for improving the post-conversion stage.'),
    }),
  }).describe('The diagnosis of the sales funnel.'),
});
export type FunnelDiagnosisOutput = z.infer<typeof FunnelDiagnosisOutputSchema>;

export async function funnelDiagnosis(input: FunnelDiagnosisInput): Promise<FunnelDiagnosisOutput> {
  return funnelDiagnosisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'funnelDiagnosisPrompt',
  input: {schema: FunnelDiagnosisInputSchema},
  output: {schema: FunnelDiagnosisOutputSchema},
  config: {
    safetySettings: [
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_LOW_AND_ABOVE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_LOW_AND_ABOVE' },
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_LOW_AND_ABOVE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_LOW_AND_ABOVE' },
    ],
  },
  prompt: `You are an AI sales and marketing expert that can diagnose the health of a sales funnel.

  You will analyze the qualitative company data, the quantitative funnel data, and any provided marketing material or external context.
  Your analysis MUST be contextualized by the company's segment, size, and business model. For example, a 2% conversion rate is good for B2C e-commerce but might be low for a niche B2B service.
  Your analysis should be holistic, connecting potential issues in the company's messaging or positioning with the performance metrics.
  
  {{#if funilDataAnterior}}
  This is a follow-up diagnosis. You MUST compare the current data with the previous period's data to identify trends. Your analysis should focus on what has changed, improved, or worsened. Connect these changes to the previous recommendations to evaluate their effectiveness.
  
  Previous Funnel Data: {{{json funilDataAnterior}}}
  {{/if}}

  If an image is provided, analyze its copy, design, and call-to-action, and connect your visual analysis to the quantitative data. For example, if the Top of Funnel CTR is low, analyze the ad creative provided to suggest specific improvements.
  If marketing campaign data (UTM parameters) is provided, use it to further contextualize your analysis.
  If additional context is provided, use it as a primary source of truth for market trends, competitor analysis, or brand messaging.

  Provide a diagnosis for each stage of the funnel (Topo, Meio, Fundo, Pós Conversão).
  If quantitative data is missing for a metric, use industry averages for benchmarking but note that you are doing so.
  For each stage, provide a status (green, amber, or red), an analysis of the performance, and suggested actions for improvement. These suggested actions should be high-level; DO NOT provide a detailed 14/30/90 day plan. That is handled by a separate, paid 'advancedActionPlan' flow.

  Qualitative Company Data:
  - Value Proposition: {{{empresa.propostaDeValor}}}
  - Pricing Model: {{{empresa.modeloPricing}}}
  - Differentiators: {{{empresa.diferenciais}}}
  - Segment: {{{empresa.segmento}}}
  - Size: {{{empresa.porte}}}
  - Business Model: {{{empresa.modelo}}}

  Current Quantitative Funnel Data: {{{json funilData}}}

  {{#if marketing}}
  Marketing Acquisition Context:
  - Source: {{{marketing.source}}}
  - Campaign: {{{marketing.campaign}}}
  - Medium: {{{marketing.medium}}}
  {{/if}}

  {{#if materialMarketingUri}}
  Marketing Material to Analyze:
  {{media url=materialMarketingUri}}
  {{/if}}

  {{#if contextoAdicional}}
  Additional External Context:
  {{{contextoAdicional}}}
  {{/if}}

  Ensure that the diagnosis and suggested actions are specific and actionable.
  For example, if the Top of Funnel conversion is low and the value proposition is unclear, suggest A/B testing different headlines related to the value proposition on the landing page.
  Focus on providing value and insights that can help the user optimize their sales process.
`,
});

const funnelDiagnosisFlow = ai.defineFlow(
  {
    name: 'funnelDiagnosisFlow',
    inputSchema: FunnelDiagnosisInputSchema,
    outputSchema: FunnelDiagnosisOutputSchema,
  },
  async input => {
    // The first diagnosis is robustly kept free. Subsequent ones cost credits.
    // We explicitly check for `true` to avoid ambiguity with `undefined`.
    if (input.isFirstDiagnosis !== true) {
      await useCredits({ userId: input.userId, amount: 500 });
    }
    const {output} = await prompt(input);
    return output!;
  }
);
