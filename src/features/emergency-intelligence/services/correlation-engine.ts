import { useEmergencyStore } from '../store/emergency-store';
import { logEvent } from './event-logger';
import { CorrelatedIncident, IncidentDependency } from '../types';

export const evaluateCorrelations = () => {
  const store = useEmergencyStore.getState();
  const {
    incidents,
    addCorrelatedIncident,
    correlatedIncidents,
    addDependency,
    incidentDependencies,
  } = store;

  // Filter active incidents
  const activeIncidents = incidents.filter(
    (i) => i.lifecycleState !== 'Closed' && i.lifecycleState !== 'Resolved'
  );

  if (activeIncidents.length < 2) return;

  activeIncidents.forEach((primary) => {
    activeIncidents.forEach((secondary) => {
      if (primary.id === secondary.id) return;

      // Check if correlation already exists
      const exists = correlatedIncidents.some(
        (c) =>
          (c.primaryIncidentId === primary.id && c.relatedIncidentIds.includes(secondary.id)) ||
          (c.primaryIncidentId === secondary.id && c.relatedIncidentIds.includes(primary.id))
      );
      if (exists) return;

      let correlationReason = '';
      let relationshipType: 'Causes' | 'Exacerbates' | 'OccursWith' | null = null;

      // Rule: High Crowd Density (Overcrowding) + Medical Emergency
      if (
        (primary.type === 'Overcrowding' && secondary.type === 'Medical') ||
        (primary.type === 'Medical' && secondary.type === 'Overcrowding')
      ) {
        correlationReason = 'High crowd density exacerbates medical emergency response.';
        relationshipType = 'Exacerbates';
      }

      // Rule: Power Failure + Accessibility Risk
      if (
        (primary.type === 'Power' && secondary.type === 'Infrastructure') ||
        (primary.type === 'Infrastructure' && secondary.type === 'Power')
      ) {
        correlationReason =
          'Power failure causes infrastructure/accessibility risks (e.g., elevators down).';
        relationshipType = 'Causes';
      }

      // Rule: Weather Hazard + Transport Delay
      if (
        (primary.type === 'Weather' && secondary.type === 'Transport') ||
        (primary.type === 'Transport' && secondary.type === 'Weather')
      ) {
        correlationReason = 'Weather hazard causes transport delays.';
        relationshipType = 'Causes';
      }

      // Rule: Fire Risk + Evacuation Trigger
      if (
        (primary.type === 'Fire' && secondary.type === 'Evacuation') ||
        (primary.type === 'Evacuation' && secondary.type === 'Fire')
      ) {
        correlationReason = 'Fire risk necessitates evacuation.';
        relationshipType = 'Causes';
      }

      if (correlationReason && relationshipType) {
        // Create correlation
        const correlation: CorrelatedIncident = {
          id: `corr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          primaryIncidentId: primary.id,
          relatedIncidentIds: [secondary.id],
          combinedSeverity:
            primary.severity === 'Critical' || secondary.severity === 'Critical'
              ? 'Critical'
              : 'High',
          correlationReason,
          timestamp: new Date().toISOString(),
        };

        addCorrelatedIncident(correlation);

        // Check if dependency already exists
        const depExists = incidentDependencies.some(
          (d) =>
            (d.sourceId === primary.id && d.targetId === secondary.id) ||
            (d.sourceId === secondary.id && d.targetId === primary.id)
        );

        if (!depExists) {
          const dependency: IncidentDependency = {
            id: `dep-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            sourceId: primary.id, // Simplification: assuming primary is source for now
            targetId: secondary.id,
            relationshipType,
          };
          addDependency(dependency);
        }

        logEvent(
          primary.id,
          'CorrelationEngine',
          'Correlate Incident',
          correlation.combinedSeverity,
          undefined,
          `Correlated with ${secondary.id}: ${correlationReason}`
        );
      }
    });
  });
};
