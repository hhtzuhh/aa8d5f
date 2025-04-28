'use client';

import { useCallback, useEffect, useState } from "react";
import {ReactFlow, Background, Controls, MiniMap, useNodesState,
  useEdgesState,} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import FormNode, {FormNodeData} from "@/components/ui/FormNode";
import type { NodeProps } from '@xyflow/react';

import type { ComponentType } from 'react';
import axios from 'axios';
import FormDetailsModal from "@/components/ui/FormDetailsModal";
import PrefillModal from "@/components/ui/PrefillModal";

import { findAvailableSources, findParentNodes } from '@/lib/prefill';



export default function Flow() {
  // react flow node preparation
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loading, setLoading] = useState(true);
  console.log("nodes", nodes);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  
  const [availableSources, setAvailableSources] = useState<{ fromFormId: string, fromFieldName: string }[]>([]);

  // FormDetailModal
  const [isFormDetailsModalOpen, setIsFormDetailsModalOpen] = useState(false);
  
  const onNodeClick = useCallback((event: React.MouseEvent, node: any) => {
    setSelectedNode(node);
    setIsFormDetailsModalOpen(true);
  }, []);
  // PrefillModal
  const [isPrefillModalOpen, setIsPrefillModalOpen] = useState(false);
  const [editingFieldName, setEditingFieldName] = useState<string | null>(null);
  console.log("selectedNode", selectedNode);
  console.log("editingFieldName", editingFieldName); // button or dynamic_check_box
  // When user clicks ✎ edit a field
  const handleEditField = (fieldName: string) => {
    if (!selectedNode) return;
    const sources = findAvailableSources(selectedNode, nodes, edges);
    setAvailableSources(sources);   
    setEditingFieldName(fieldName);
    setIsPrefillModalOpen(true);
  };
  console.log("ava", availableSources);
  
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
              input_mapping: node.data?.input_mapping ?? {},
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

  const handleSelectPrefillSource = (fromFormId: string, fromSourceLabel: string, fromFieldName: string) => {
    // the fromFieldName is the name you select: so probaly button
    if (!selectedNode || !editingFieldName) return;
  
    // 1. Update nodes
    setNodes((nds) =>
      nds.map((n) => 
        n.id === selectedNode.id
          ? {
              ...n,
              data: {
                ...n.data,
                input_mapping: {
                  ...(n.data.input_mapping || {}),
                  [editingFieldName]: {
                    fromFormId,
                    fromFieldName,
                    fromSourceLabel
                  },
                },
              },
            }
          : n
      )
    );
  
    // 2. Update selectedNode
    setSelectedNode((prev: any) => ({
      ...prev,
      data: {
        ...prev.data,
        input_mapping: {
          ...(prev.data.input_mapping || {}),
          [editingFieldName]: {
            fromFormId,
            fromFieldName,
            fromSourceLabel
          },
        },
      },
    }));
  
    // 3. Close modal
    setIsPrefillModalOpen(false);
    setEditingFieldName(null);
  };
  
  const handleClearPrefill = (fieldName: string) => {
    if (!selectedNode) return;
  
    // 1. Create updated input_mapping
    const updatedMapping = { ...(selectedNode.data.input_mapping || {}) };
    delete updatedMapping[fieldName];  // remove the selected field
  
    // 2. Create updated node
    const updatedNode = {
      ...selectedNode,
      data: {
        ...selectedNode.data,
        input_mapping: updatedMapping,
      },
    };
  
    // 3. Update nodes list
    setNodes((nds) =>
      nds.map((n) => (n.id === updatedNode.id ? updatedNode : n))
    );
  
    // 4. Update selected node (to reflect immediately in modal)
    setSelectedNode(updatedNode);
  };
  
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

      <FormDetailsModal 
          isOpen={isFormDetailsModalOpen}
          onClose={() => setIsFormDetailsModalOpen(false)}
          selectedNode={selectedNode}
          onEditField={handleEditField}
          onClearPrefill={handleClearPrefill}
        />

      <PrefillModal
        isOpen={isPrefillModalOpen}
        onClose={() => setIsPrefillModalOpen(false)}
        fieldName={editingFieldName}
        availableSources={availableSources}
        onSelectPrefillSource={handleSelectPrefillSource}
        />
    </div>
  );
}
