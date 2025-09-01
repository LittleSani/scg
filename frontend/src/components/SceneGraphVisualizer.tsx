
import React, { useCallback } from 'react';
import ReactFlow, { MiniMap, Controls, Background, useNodesState, useEdgesState, addEdge, Node, Edge } from 'reactflow';

import 'reactflow/dist/style.css';

interface SceneGraphVisualizerProps {
  sceneGraph: {
    objects: Array<{ id: string; x: number; y: number; width: number; height: number; }>;
    relationships: string[];
  };
  showMiniMap: boolean;
}

const SceneGraphVisualizer: React.FC<SceneGraphVisualizerProps> = ({ sceneGraph, showMiniMap }) => {
  const initialNodes: Node[] = sceneGraph.objects.map((obj, index) => ({
    id: obj.id,
    position: { x: obj.x, y: obj.y },
    data: { label: obj.id },
    style: { width: obj.width, height: obj.height, border: '1px solid #3B82F6', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(219, 234, 254, 0.7)' },
  }));

  const initialEdges: Edge[] = sceneGraph.relationships.map((rel, index) => {
    const parts = rel.split(' ');
    const source = parts[0];
    const target = parts[parts.length - 1];
    const label = parts.slice(1, parts.length - 1).join(' '); // Predicate

    return {
      id: `e${index}`,
      source: source,
      target: target,
      label: label,
      animated: true,
      style: { strokeWidth: 2, stroke: '#3B82F6' },
      labelBgPadding: [8, 4],
      labelBgBorderRadius: 4,
      labelBgStyle: { fill: '#DBEAFE', color: '#1E40AF', fillOpacity: 0.7 },
    };
  });

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((params: any) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        {showMiniMap && <MiniMap />}
        <Controls />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};

export default SceneGraphVisualizer;
