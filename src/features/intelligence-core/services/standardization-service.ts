// The intelligence stores use varied structures for their metrics in this prototype.
// Type assertions are used locally to allow dynamic aggregation without strict typing overhead.
import { StandardizedModule } from '../types';
import { useIntelligenceStore as useCrowdStore } from '../../crowd-intelligence/store/intelligence-store';
import { useMobilityStore } from '../../mobility-intelligence/store/mobility-store';
import { useAccessibilityStore } from '../../accessibility-intelligence/store/accessibility-store';
import { useSustainabilityStore } from '../../sustainability-intelligence/store/sustainability-store';
import { useEmergencyStore } from '../../emergency-intelligence/store/emergency-store';
import { useNavigationStore } from '../../navigation-intelligence/store/navigation-store';

export const mapCrowdToStandard = (): StandardizedModule => {
  try {
    const crowdState = useCrowdStore.getState();
    const metrics: any = crowdState.metrics || {};
    const detections: any[] = (crowdState as any).detections || [];
    return {
      moduleName: 'Crowd Intelligence',
      healthScore: metrics.healthScore || 85,
      riskLevel: metrics.riskLevel || 'Low',
      confidenceScore: 92,
      status: 'Active',
      metrics: {
        totalAttendance: metrics.totalAttendance || 0,
        densityScore: metrics.densityScore || 0,
        flowRate: metrics.flowRate || 0,
      },
      recommendations: crowdState.recommendations?.map((r: any) => r.message || r) || [],
      alerts:
        detections.map((a: any) => ({
          id: a.id,
          moduleSource: 'Crowd Intelligence',
          severity: a.severity || 'Medium',
          priority:
            a.severity === 'Critical'
              ? 1
              : a.severity === 'High'
                ? 2
                : a.severity === 'Medium'
                  ? 3
                  : 4,
          message: a.message || a.type || 'Anomaly detected',
          timestamp: a.timestamp || new Date().toISOString(),
        })) || [],
      lastUpdated: new Date().toISOString(),
    };
  } catch {
    return getFallbackModule('Crowd Intelligence');
  }
};

export const mapMobilityToStandard = (): StandardizedModule => {
  try {
    const state = useMobilityStore.getState();
    const metrics: any = state.metrics || {};
    const alerts: any[] = (state as any).alerts || [];
    return {
      moduleName: 'Mobility Intelligence',
      healthScore: metrics.mobilityHealthScore || metrics.mobilityScore || 80,
      riskLevel: metrics.bottleneckRisk > 75 ? 'High' : 'Low',
      confidenceScore: 88,
      status: 'Active',
      metrics: {
        activeVehicles: metrics.activeVehicles || 0,
        averageWaitTime: metrics.averageWaitTime || 0,
      },
      recommendations: (state as any).recommendations?.map((r: any) => r.message || r) || [],
      alerts:
        alerts.map((a: any) => ({
          id: a.id,
          moduleSource: 'Mobility Intelligence',
          severity: a.severity || 'Medium',
          priority: a.severity === 'Critical' ? 1 : 2,
          message: a.message || 'Mobility alert',
          timestamp: a.timestamp || new Date().toISOString(),
        })) || [],
      lastUpdated: new Date().toISOString(),
    };
  } catch {
    return getFallbackModule('Mobility Intelligence');
  }
};

export const mapAccessibilityToStandard = (): StandardizedModule => {
  try {
    const state = useAccessibilityStore.getState();
    const metrics: any = state.metrics || {};
    const alerts: any[] = (state as any).alerts || [];
    return {
      moduleName: 'Accessibility Intelligence',
      healthScore: metrics.overallAccessibilityScore || metrics.accessibilityScore || 90,
      riskLevel: metrics.activeAssistanceRequests > 10 ? 'Medium' : 'Low',
      confidenceScore: 95,
      status: 'Active',
      metrics: {
        activeRequests: metrics.activeAssistanceRequests || 0,
        wheelchairAvailable: metrics.wheelchairAvailability || 0,
      },
      recommendations: (state as any).recommendations?.map((r: any) => r.message || r) || [],
      alerts:
        alerts.map((a: any) => ({
          id: a.id,
          moduleSource: 'Accessibility Intelligence',
          severity: a.severity || 'Medium',
          priority: 3,
          message: a.message || 'Accessibility alert',
          timestamp: a.timestamp || new Date().toISOString(),
        })) || [],
      lastUpdated: new Date().toISOString(),
    };
  } catch {
    return getFallbackModule('Accessibility Intelligence');
  }
};

export const mapSustainabilityToStandard = (): StandardizedModule => {
  try {
    const state = useSustainabilityStore.getState();
    const metrics: any = state.metrics || {};
    const alerts: any[] = (state as any).alerts || [];
    return {
      moduleName: 'Sustainability Intelligence',
      healthScore: metrics.sustainabilityScore || 85,
      riskLevel:
        metrics.carbonFootprint > 5000 || metrics.carbonFootprintScore < 50 ? 'Medium' : 'Low',
      confidenceScore: 90,
      status: 'Active',
      metrics: {
        powerConsumption: metrics.powerConsumption || 0,
        waterUsage: metrics.waterUsage || metrics.waterConsumption || 0,
      },
      recommendations: (state as any).recommendations?.map((r: any) => r.message || r) || [],
      alerts:
        alerts.map((a: any) => ({
          id: a.id,
          moduleSource: 'Sustainability Intelligence',
          severity: a.severity || 'Medium',
          priority: 4,
          message: a.message || 'Sustainability alert',
          timestamp: a.timestamp || new Date().toISOString(),
        })) || [],
      lastUpdated: new Date().toISOString(),
    };
  } catch {
    return getFallbackModule('Sustainability Intelligence');
  }
};

export const mapEmergencyToStandard = (): StandardizedModule => {
  try {
    const state = useEmergencyStore.getState();
    const metrics: any = state.metrics || {};
    const kpis: any = (state as any).kpis || {};
    const queue: any[] = state.getPriorityQueue() || [];

    return {
      moduleName: 'Emergency Intelligence',
      healthScore: metrics.emergencyHealthScore || 100,
      riskLevel: metrics.operationalRiskScore > 50 ? 'High' : 'Low',
      confidenceScore: 99,
      status: 'Active',
      metrics: {
        activeIncidents: kpis.totalActiveIncidents || 0,
        criticalIncidents: kpis.criticalIncidents || 0,
      },
      recommendations: queue[0]?.recommendedActions || [],
      alerts: queue.map((inc: any) => ({
        id: inc.id,
        moduleSource: 'Emergency Intelligence',
        severity: inc.severity || 'Medium',
        priority: inc.severity === 'Critical' ? 1 : 2,
        message: `${inc.type} at ${inc.location}`,
        timestamp: inc.timestamp || new Date().toISOString(),
      })),
      lastUpdated: new Date().toISOString(),
    };
  } catch {
    return getFallbackModule('Emergency Intelligence');
  }
};

export const mapNavigationToStandard = (): StandardizedModule => {
  try {
    const state = useNavigationStore.getState();
    const activeRoute: any = state.activeRoute;
    const hasCongestion = activeRoute?.segments?.some((s: any) => s.congestionScore > 50);
    const hasIncident = activeRoute?.segments?.some((s: any) => s.hasIncident);

    return {
      moduleName: 'Navigation Intelligence',
      healthScore: hasIncident ? 60 : hasCongestion ? 80 : 95,
      riskLevel: hasIncident ? 'High' : hasCongestion ? 'Medium' : 'Low',
      confidenceScore: 95,
      status: 'Active',
      metrics: {
        activeRoutes: state.activeRoute ? 1 : 0,
        nodes: Object.keys(state.nodes || {}).length,
      },
      recommendations: (state as any).recommendations?.map((r: any) => r.reason || r.type) || [],
      alerts: hasIncident
        ? [
            {
              id: `nav-inc-${Date.now()}`,
              moduleSource: 'Navigation Intelligence',
              severity: 'High',
              priority: 2,
              message: 'Active route passes through incident zone',
              timestamp: new Date().toISOString(),
            },
          ]
        : hasCongestion
          ? [
              {
                id: `nav-cong-${Date.now()}`,
                moduleSource: 'Navigation Intelligence',
                severity: 'Medium',
                priority: 3,
                message: 'Active route experiencing high congestion',
                timestamp: new Date().toISOString(),
              },
            ]
          : [],
      lastUpdated: new Date().toISOString(),
    };
  } catch {
    return getFallbackModule('Navigation Intelligence');
  }
};

const getFallbackModule = (name: string): StandardizedModule => ({
  moduleName: name,
  healthScore: 100,
  riskLevel: 'Low',
  confidenceScore: 100,
  status: 'Active',
  metrics: {},
  recommendations: [],
  alerts: [],
  lastUpdated: new Date().toISOString(),
});
