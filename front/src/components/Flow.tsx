'use client';

import { useCallback, useEffect, useState } from "react";
import {ReactFlow, Background, Controls, MiniMap, useNodesState,
  useEdgesState,} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import axios from 'axios';

export default function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchGraph() {
      try {
        const res = await axios.get('http://localhost:3000/api/v1/123/actions/blueprints/bp_456/graph');
        const data = res.data;

        const parsedNodes = data.nodes.map((node: any) => ({
          id: node.id,
          type: node.type || "default",
          position: node.position,
          data: { label: node.data?.name ?? "Unnamed" },
        }));

        const parsedEdges = data.edges.map((edge: any, index: number) => ({
          id: `e-${index}`,
          source: edge.source,
          target: edge.target,
        }));

        setNodes(parsedNodes);
        setEdges(parsedEdges);
      } catch (error) {
        console.error("Failed to fetch graph", error);
      } finally {
        setLoading(false);
      }
    }

    fetchGraph();
  }, []);

  if (loading) {
    return <div>Loading graph...</div>;
  }

  return (
    <div className="w-full h-screen">
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}
