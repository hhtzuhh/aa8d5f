import { Node, Edge } from '@xyflow/react';

export function findAvailableSources(
    selectedNode: Node, 
    allNodes: Node[], 
    allEdges: Edge[]
  ): { id: string; label: string; fields: string[] }[] {
  
    const parents = findParentNodes(selectedNode.id, allEdges, allNodes);
  
    const groupedSources = parents
      .filter(parent => parent.data?.form?.field_schema?.properties)
      .map(parent => {
        const fieldNames = Object.keys(parent.data.form.field_schema.properties);
        return {
          id: parent.id,
          label: typeof parent.data.label === 'string' ? parent.data.label : parent.id, // ensure label is string
          fields: fieldNames,
        };
      });
  
    return groupedSources;
  }
  
  
  
export function findParentNodes(nodeId: string, edges: Edge[], nodes: Node[]): Node[] {
    const parents: Node[] = [];
    const visited = new Set<string>();

    function dfs(currentId: string) {
        for (const edge of edges) {
        if (edge.target === currentId && !visited.has(edge.source)) {
            visited.add(edge.source);
            const parentNode = nodes.find((n) => n.id === edge.source);
            if (parentNode) {
            parents.push(parentNode);
            dfs(parentNode.id); // recursively go upward
            }
        }
        }
    }

    dfs(nodeId);

    return parents;
}
  