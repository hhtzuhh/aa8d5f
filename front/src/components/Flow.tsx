'use client';

import { useCallback, useEffect, useState } from "react";
import {ReactFlow, Background, Controls, MiniMap, useNodesState,
  useEdgesState,} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import FormNode, {FormNodeData} from "@/components/ui/FormNode";
import type { NodeProps } from '@xyflow/react';

import type { ComponentType } from 'react';
import axios from 'axios';
import Modal from "@/components/ui/Modal";

export default function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const onNodeClick = useCallback((event: React.MouseEvent, node: any) => {
    setSelectedNode(node);
    setIsModalOpen(true);
  }, []);
  
  // 👇 customized node type
  const nodeTypes: Record<string, ComponentType<NodeProps>> = {
    form: FormNode as unknown as ComponentType<NodeProps>,
  };

  useEffect(() => {
    async function fetchGraph() {
      try {
        const res = await axios.get('http://localhost:3000/api/v1/123/actions/blueprints/bp_456/graph');
        const data = res.data;
        const formMap = new Map(data.forms.map((form: any) => [form.id, form]));

        const parsedNodes = data.nodes.map((node: any) => {
          const matchingForm = formMap.get(node.data.component_id);        
          return {
            id: node.id,
            type: node.type || "default",
            position: node.position,
            data: {
              label: node.data?.name ?? "Unnamed",
              component_id: node.data?.component_id ?? null,
              form: matchingForm || null,  // pass whole form object into data!
            } as FormNodeData,
          };
        });

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
      <ReactFlow 
        nodes={nodes} 
        edges={edges} 
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        fitView>
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
      <Modal 
      isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
      {selectedNode && (
        <div>
          <h2 className="text-lg font-bold mb-2">{selectedNode.data.label}</h2>
          <p className="text-gray-600 text-sm">
            {selectedNode.data.form 
              ? `${Object.keys(selectedNode.data.form?.field_schema?.properties || {}).length} fields`
              : "No form details"}
          </p>
        </div>
      )}
    </Modal>

    </div>
  );
}
