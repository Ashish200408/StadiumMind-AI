import { CalculatedRoute, GraphEdge, GraphNode, RouteSegment, RouteType } from '../types';

interface EdgeWeightContext {
  congestionScore: number;
  accessibilityRequired: boolean;
}

export function calculateRoute(
  startNodeId: string,
  targetNodeId: string,
  nodes: Record<string, GraphNode>,
  edges: GraphEdge[],
  routeType: RouteType,
  context: EdgeWeightContext
): CalculatedRoute | null {
  if (!nodes[startNodeId] || !nodes[targetNodeId]) return null;

  // Distances tracking
  const distances: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
  const unvisited = new Set<string>();

  Object.keys(nodes).forEach((nodeId) => {
    distances[nodeId] = Infinity;
    previous[nodeId] = null;
    unvisited.add(nodeId);
  });
  distances[startNodeId] = 0;

  while (unvisited.size > 0) {
    // Find node with minimum distance
    let currentMinNode: string | null = null;
    for (const nodeId of unvisited) {
      if (currentMinNode === null || distances[nodeId] < distances[currentMinNode]) {
        currentMinNode = nodeId;
      }
    }

    if (currentMinNode === null || distances[currentMinNode] === Infinity) break;
    if (currentMinNode === targetNodeId) break;

    unvisited.delete(currentMinNode);

    // Get neighbors
    const neighbors = edges.filter((e) => e.source === currentMinNode);

    for (const neighbor of neighbors) {
      if (!unvisited.has(neighbor.target)) continue;

      // Check closures
      if (neighbor.isClosed) continue;

      // Check accessibility
      if (context.accessibilityRequired && !neighbor.isAccessible) continue;

      const targetNode = nodes[neighbor.target];
      if (targetNode.isClosed) continue;
      if (context.accessibilityRequired && !targetNode.isAccessible) continue;

      // Calculate weight based on routeType
      let weight = neighbor.baseTime;

      // Adjust for congestion
      const nodeCongestion = targetNode.baseCongestion + context.congestionScore * 0.5;

      if (routeType === 'least_congested') {
        weight = weight * (1 + (nodeCongestion / 100) * 3); // Highly penalized by congestion
      } else if (routeType === 'fastest_exit' || routeType === 'emergency') {
        weight = weight * (1 + nodeCongestion / 100); // Still affected, but baseTime matters more
      } else {
        // shortest
        weight = neighbor.distance; // pure distance if shortest path physically
      }

      const tentativeDistance = distances[currentMinNode] + weight;
      if (tentativeDistance < distances[neighbor.target]) {
        distances[neighbor.target] = tentativeDistance;
        previous[neighbor.target] = currentMinNode;
      }
    }
  }

  // Backtrack to build route
  const path: string[] = [];
  let curr: string | null = targetNodeId;
  if (previous[curr] !== null || curr === startNodeId) {
    while (curr !== null) {
      path.unshift(curr);
      curr = previous[curr];
    }
  }

  if (path.length === 0 || path[0] !== startNodeId) return null;

  // Construct segments
  const segments: RouteSegment[] = [];
  let totalTime = 0;
  let totalCongestion = 0;

  for (let i = 0; i < path.length; i++) {
    const nodeId = path[i];
    const node = nodes[nodeId];
    let timeToNext = 0;
    let congestionToNext = node.baseCongestion;

    if (i < path.length - 1) {
      const nextId = path[i + 1];
      const edge = edges.find((e) => e.source === nodeId && e.target === nextId);
      if (edge) {
        timeToNext = edge.baseTime * (1 + node.baseCongestion / 100);
        totalTime += timeToNext;
      }
    }

    totalCongestion += congestionToNext;

    segments.push({
      nodeId,
      nodeName: node.name,
      type: node.type,
      timeToNext: Math.round(timeToNext),
      congestionToNext: Math.round(congestionToNext),
    });
  }

  return {
    id: `route_${startNodeId}_${targetNodeId}_${Date.now()}`,
    type: routeType,
    segments,
    totalTime: Math.round(totalTime),
    averageCongestion: Math.round(totalCongestion / path.length),
    accessibilityScore: context.accessibilityRequired ? 100 : 80,
    safetyScore: routeType === 'emergency' ? 95 : 85,
    confidenceScore: 90,
  };
}
