
import type { DiagnosticData } from "@/contexts/DiagnosticContext";
import { ALL_KPIS as KPI_DATA, type Kpi } from "./kpi-data";

const calculateRevenue = (data: DiagnosticData): number => {
    // Guard against incomplete data
    if (!data?.funilData || !data?.economia) {
        return 0;
    }

    const funnel = data.funilData;
    const economia = data.economia;
    
    // Ensure ticketMedioAnual is a valid number, default to 0 if not
    const ticketMedioAnual = Number(economia.ticketMedioAnual) || 0;
    if (ticketMedioAnual === 0) return 0;

    // A baseline number of visitors for simulation purposes
    const visitantes = 1000;
    
    // Safely calculate each stage, defaulting to 0 if a metric is missing
    const topoVisitanteLead = (Number(funnel.topoVisitanteLead) || 0) / 100;
    const meioLeadMQL = (Number(funnel.meioLeadMQL) || 0) / 100;
    const fundoMQLSQL = (Number(funnel.fundoMQLSQL) || 0) / 100;
    const fundoSQLVenda = (Number(funnel.fundoSQLVenda) || 0) / 100;

    let leads = visitantes * topoVisitanteLead;
    let mqls = leads * meioLeadMQL;
    let sqls = mqls * fundoMQLSQL;
    let vendas = sqls * fundoSQLVenda;
    
    return vendas * ticketMedioAnual;
}

export const ALL_KPIS: Kpi[] = KPI_DATA.map(kpi => {
    // Apply the revenue impact formula to all core conversion metrics
    if (['topoVisitanteLead', 'meioLeadMQL', 'fundoPropostaFechamento', 'meioShowRate', 'fundoMQLSQL', 'fundoSQLVenda'].includes(kpi.key)) {
        return { ...kpi, impactFormula: calculateRevenue };
    }
    // Return other KPIs without the impact formula for now
    return kpi;
});
