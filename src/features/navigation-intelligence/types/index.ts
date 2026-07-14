export type NodeType =
  | 'zone'
  | 'entrance'
  | 'exit'
  | 'food_court'
  | 'washroom'
  | 'medical'
  | 'parking'
  | 'transport'
  | 'emergency_exit';

export interface GraphNode {
  id: string;
  type: NodeType;
  name: string;
  isAccessible: boolean;
  baseCongestion: number;
}

export interface GraphEdge {
  source: string;
  target: string;
  distance: number; // in meters
  baseTime: number; // in seconds
  isAccessible: boolean;
}

export type RouteType =
  'shortest' | 'least_congested' | 'accessible' | 'emergency' | 'fastest_exit';

export interface RouteSegment {
  nodeId: string;
  nodeName: string;
  type: NodeType;
  timeToNext: number; // seconds
  congestionToNext: number; // 0-100
}

export interface CalculatedRoute {
  id: string;
  type: RouteType;
  segments: RouteSegment[];
  totalTime: number; // seconds
  averageCongestion: number; // 0-100
  accessibilityScore: number; // 0-100
  safetyScore: number; // 0-100
  confidenceScore: number; // 0-100
}

export type NavigationRecommendationType =
  | 'best_entrance'
  | 'best_exit'
  | 'best_parking'
  | 'best_food'
  | 'nearest_medical'
  | 'nearest_accessible_washroom'
  | 'emergency_exit'
  | 'alternative_route';

export interface NavigationRecommendation {
  id: string;
  type: NavigationRecommendationType;
  title: string;
  description: string;
  route?: CalculatedRoute;
}

export interface NavigationState {
  nodes: Record<string, GraphNode>;
  edges: GraphEdge[];
  recommendations: NavigationRecommendation[];
  activeRoute: CalculatedRoute | null;
  lastCalculated: string;
}
