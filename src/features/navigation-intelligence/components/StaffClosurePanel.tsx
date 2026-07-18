import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { initializeStadiumGraph, toggleNodeClosure } from '../services/graph-service';
import { GraphNode } from '../types';
import { ShieldAlert, CheckCircle, AlertTriangle } from 'lucide-react';

export const StaffClosurePanel: React.FC = () => {
  // In a real app, this graph would come from a global store/context that also updates NavigationChat
  const [nodes, setNodes] = useState<Record<string, GraphNode>>(
    () => initializeStadiumGraph().nodes
  );

  const handleToggle = (nodeId: string, currentStatus: boolean) => {
    setNodes((prev) => toggleNodeClosure(nodeId, !currentStatus, prev));
    // Here we would typically dispatch an event or call an API to update the global state
  };

  return (
    <Card className="w-full max-w-2xl mx-auto h-[600px] flex flex-col bg-slate-900/90 border-slate-700/50 backdrop-blur-md">
      <CardHeader className="border-b border-slate-800">
        <CardTitle className="flex items-center gap-2 text-red-400">
          <ShieldAlert className="w-5 h-5" />
          Staff Operations: Route Closures
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50 text-slate-300 text-sm">
          Toggle the status of stadium zones. Closing a zone will immediately route all active fans
          around it.
        </div>

        <div className="space-y-2">
          {Object.values(nodes).map((node) => (
            <div
              key={node.id}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                node.isClosed
                  ? 'bg-red-950/20 border-red-900/50'
                  : 'bg-slate-800/30 border-slate-700/50'
              }`}
            >
              <div>
                <h4 className={`font-medium ${node.isClosed ? 'text-red-400' : 'text-slate-200'}`}>
                  {node.name}
                </h4>
                <p className="text-xs text-slate-500 capitalize">{node.type.replace('_', ' ')}</p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleToggle(node.id, !!node.isClosed)}
                className={`flex items-center gap-2 ${
                  node.isClosed
                    ? 'border-red-500/50 text-red-400 hover:bg-red-950/50 hover:text-red-300'
                    : 'border-emerald-500/50 text-emerald-400 hover:bg-emerald-950/50 hover:text-emerald-300'
                }`}
              >
                {node.isClosed ? (
                  <>
                    <AlertTriangle className="w-4 h-4" />
                    Closed
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Open
                  </>
                )}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
