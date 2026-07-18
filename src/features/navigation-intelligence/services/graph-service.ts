import { GraphNode, GraphEdge } from '../types';

export function initializeStadiumGraph(): { nodes: Record<string, GraphNode>; edges: GraphEdge[] } {
  const nodes: Record<string, GraphNode> = {
    entrance_main: {
      id: 'entrance_main',
      type: 'entrance',
      name: 'Main Entrance (North)',
      isAccessible: true,
      baseCongestion: 10,
    },
    entrance_south: {
      id: 'entrance_south',
      type: 'entrance',
      name: 'South Entrance',
      isAccessible: false,
      baseCongestion: 5,
    },
    zone_a: {
      id: 'zone_a',
      type: 'zone',
      name: 'Zone A Concourse',
      isAccessible: true,
      baseCongestion: 20,
    },
    zone_b: {
      id: 'zone_b',
      type: 'zone',
      name: 'Zone B Concourse',
      isAccessible: true,
      baseCongestion: 20,
    },
    food_court_1: {
      id: 'food_court_1',
      type: 'food_court',
      name: 'North Food Court',
      isAccessible: true,
      baseCongestion: 30,
    },
    washroom_1: {
      id: 'washroom_1',
      type: 'washroom',
      name: 'Washroom A',
      isAccessible: true,
      baseCongestion: 15,
    },
    medical_1: {
      id: 'medical_1',
      type: 'medical',
      name: 'Medical Center North',
      isAccessible: true,
      baseCongestion: 0,
    },
    parking_vip: {
      id: 'parking_vip',
      type: 'parking',
      name: 'VIP Parking',
      isAccessible: true,
      baseCongestion: 5,
    },
    parking_general: {
      id: 'parking_general',
      type: 'parking',
      name: 'General Parking',
      isAccessible: true,
      baseCongestion: 40,
    },
    transport_metro: {
      id: 'transport_metro',
      type: 'transport',
      name: 'Metro Station',
      isAccessible: true,
      baseCongestion: 30,
    },
    emergency_exit_1: {
      id: 'emergency_exit_1',
      type: 'emergency_exit',
      name: 'Emergency Exit 1',
      isAccessible: true,
      baseCongestion: 0,
    },
  };

  const edges: GraphEdge[] = [
    {
      source: 'transport_metro',
      target: 'entrance_main',
      distance: 200,
      baseTime: 180,
      isAccessible: true,
    },
    {
      source: 'parking_general',
      target: 'entrance_main',
      distance: 150,
      baseTime: 120,
      isAccessible: true,
    },
    {
      source: 'parking_vip',
      target: 'entrance_south',
      distance: 50,
      baseTime: 60,
      isAccessible: true,
    },
    { source: 'entrance_main', target: 'zone_a', distance: 30, baseTime: 30, isAccessible: true },
    { source: 'entrance_south', target: 'zone_b', distance: 40, baseTime: 45, isAccessible: true },
    { source: 'zone_a', target: 'food_court_1', distance: 20, baseTime: 20, isAccessible: true },
    { source: 'zone_a', target: 'washroom_1', distance: 15, baseTime: 15, isAccessible: true },
    { source: 'zone_a', target: 'medical_1', distance: 25, baseTime: 25, isAccessible: true },
    { source: 'zone_a', target: 'zone_b', distance: 100, baseTime: 90, isAccessible: true },
    {
      source: 'zone_b',
      target: 'emergency_exit_1',
      distance: 10,
      baseTime: 10,
      isAccessible: true,
    },
    {
      source: 'zone_a',
      target: 'emergency_exit_1',
      distance: 120,
      baseTime: 100,
      isAccessible: true,
    },
    // Ensure bi-directional paths for simplicity
  ];

  // Making it bi-directional automatically
  const biEdges = [...edges];
  edges.forEach((e) => {
    biEdges.push({
      source: e.target,
      target: e.source,
      distance: e.distance,
      baseTime: e.baseTime,
      isAccessible: e.isAccessible,
    });
  });

  return { nodes, edges: biEdges };
}

export function toggleNodeClosure(
  nodeId: string,
  isClosed: boolean,
  nodes: Record<string, GraphNode>
): Record<string, GraphNode> {
  if (!nodes[nodeId]) return nodes;
  return {
    ...nodes,
    [nodeId]: {
      ...nodes[nodeId],
      isClosed,
    },
  };
}

export function toggleEdgeClosure(
  source: string,
  target: string,
  isClosed: boolean,
  edges: GraphEdge[]
): GraphEdge[] {
  return edges.map((edge) => {
    if (
      (edge.source === source && edge.target === target) ||
      (edge.source === target && edge.target === source)
    ) {
      return { ...edge, isClosed };
    }
    return edge;
  });
}
