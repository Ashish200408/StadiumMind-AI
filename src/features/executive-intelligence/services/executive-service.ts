import { callGemini } from '../../ai-copilot/services/gemini-service';
import { ReportType, GeneratedReport, AIExplanation, DecisionSupportData } from '../types';
import { UnifiedIntelligence } from '../../intelligence-core/types';
import { logger } from '../../../utils/logger';

export const generateExecutiveReport = async (
  reportType: ReportType,
  intelligenceData: UnifiedIntelligence,
  generatedBy: string = 'Executive Intelligence Suite'
): Promise<GeneratedReport> => {
  const startTime = Date.now();
  const prompt = `
    You are the Executive Intelligence Assistant for StadiumMind AI.
    Generate a comprehensive ${reportType} based on the following Unified Intelligence data:
    ${JSON.stringify(intelligenceData, null, 2)}
    
    The report must be in Markdown format and include:
    - Executive Summary
    - Key Metrics
    - Operational Highlights
    - Recommendations
    - Incident Timeline (if applicable)
    - Action Items
    - Generated Timestamp

    Do not hallucinate data. Derive all insights solely from the provided JSON.
  `;

  const content = await callGemini(prompt);

  const id = `rep-${Date.now()}`;
  const generatedTime = new Date().toISOString();

  const summaryPrompt = `Provide a strict 2-sentence summary of the following report:\n\n${content}`;
  const summary = await callGemini(summaryPrompt);

  const report: GeneratedReport = {
    id,
    type: reportType,
    generatedTime,
    generatedBy,
    content,
    exportStatus: 'Pending',
    reportSizeKb: new Blob([content]).size / 1024,
    summary: summary.trim(),
  };

  logger.log(
    'report_generation',
    `Generated ${reportType} report`,
    { size: report.reportSizeKb },
    startTime
  );
  return report;
};

export const getAIExplanation = async (
  recommendation: string,
  intelligenceData: UnifiedIntelligence
): Promise<AIExplanation> => {
  const prompt = `
    Analyze this recommendation: "${recommendation}"
    Using the provided Operational Data:
    ${JSON.stringify({
      scores: intelligenceData.overallScores,
      alerts: intelligenceData.globalAlerts,
    })}
    
    Provide a JSON response with the following structure exactly (no markdown formatting):
    {
      "recommendation": "${recommendation}",
      "reasoning": "Detailed logical explanation based on data.",
      "supportingData": { "Metric 1": "Value", "Metric 2": "Value" },
      "confidence": 95,
      "relatedAlertIds": ["id1", "id2"],
      "relatedTimelineEventIds": ["id1", "id2"]
    }
    
    Derive all reasoning from the data. Ensure confidence is a number 0-100.
  `;

  try {
    const response = await callGemini(prompt);
    const cleanedJson = response
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();
    return JSON.parse(cleanedJson) as AIExplanation;
  } catch (error) {
    console.error('Failed to parse AI Explanation:', error);
    return {
      recommendation,
      reasoning: 'Explanation generation failed. Using deterministic fallback.',
      supportingData: {},
      confidence: 50,
      relatedAlertIds: [],
      relatedTimelineEventIds: [],
    };
  }
};

export const getDecisionSupportInsights = async (
  intelligenceData: UnifiedIntelligence
): Promise<DecisionSupportData> => {
  const prompt = `
    Extract decision support data from this intelligence payload:
    ${JSON.stringify({
      alerts: intelligenceData.globalAlerts,
      recommendations: intelligenceData.globalRecommendations,
    })}
    
    Provide a JSON response matching exactly this TypeScript interface:
    {
      topRecommendedActions: { id: string, title: string, priority: 'High' | 'Medium' | 'Low' | 'Critical', department: string, estimatedImpact: string }[],
      highestPriorityIncidents: { id: string, title: string, severity: 'Critical' | 'High' | 'Medium' | 'Low', status: 'Active' | 'Investigating' | 'Resolved', time: string }[],
      operationalRisks: { id: string, description: string, likelihood: 'High' | 'Medium' | 'Low', impact: 'High' | 'Medium' | 'Low' }[],
      resourceConstraints: { id: string, resource: string, currentLevel: number, threshold: number, status: 'Warning' | 'Critical' }[],
      immediateActions: { id: string, title: string, priority: 'High' | 'Medium' | 'Low' | 'Critical', department: string, estimatedImpact: string }[]
    }
  `;

  try {
    const response = await callGemini(prompt);
    const cleanedJson = response
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();
    return JSON.parse(cleanedJson) as DecisionSupportData;
  } catch (error) {
    console.error('Failed to parse Decision Support Data:', error);
    return {
      topRecommendedActions: [],
      highestPriorityIncidents: [],
      operationalRisks: [],
      resourceConstraints: [],
      immediateActions: [],
    };
  }
};
