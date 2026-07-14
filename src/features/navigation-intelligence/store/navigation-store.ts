import { create } from 'zustand';
import {
  NavigationState,
  NavigationRecommendation,
  CalculatedRoute,
  GraphNode,
  GraphEdge,
} from '../types';

interface NavigationStore extends NavigationState {
  setGraph: (nodes: Record<string, GraphNode>, edges: GraphEdge[]) => void;
  setRecommendations: (recommendations: NavigationRecommendation[]) => void;
  setActiveRoute: (route: CalculatedRoute | null) => void;
}

export const useNavigationStore = create<NavigationStore>((set) => ({
  nodes: {},
  edges: [],
  recommendations: [],
  activeRoute: null,
  lastCalculated: new Date().toISOString(),

  setGraph: (nodes, edges) =>
    set({
      nodes,
      edges,
      lastCalculated: new Date().toISOString(),
    }),

  setRecommendations: (recommendations) =>
    set({
      recommendations,
      lastCalculated: new Date().toISOString(),
    }),

  setActiveRoute: (route) => set({ activeRoute: route }),
}));
