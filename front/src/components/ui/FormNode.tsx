'use client';

import { memo } from "react";
import { Handle, NodeProps, Position } from '@xyflow/react';
export type FormNodeData = {
    label: string;
    component_id: string | null;
    form: any; // or you can define full form structure later
  };
  
const FormNode = memo(({ data, selected }:  NodeProps<FormNodeData>) => {
  return (
    <div className={`p-4 rounded-lg border shadow-md bg-white relative ${selected ? 'border-blue-500' : 'border-gray-300'}`}>
      {/* Output Handle (Top/Right/Bottom) */}
      <Handle
        type="source"
        position={Position.Right}
        id="source"
        style={{ background: 'blue' }}
      />
      
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        id="target"
        style={{ background: 'red' }}
      />

      {/* Node Content */}
      <div className="font-bold text-lg">{data.label}</div>
      {data.form ? (
        <div className="text-xs text-gray-500">
          {data.form?.field_schema?.properties
            ? `${Object.keys(data.form.field_schema.properties).length} fields`
            : 'No fields'}
        </div>
      ) : (
        <div className="text-xs text-red-500">
          No form attached
        </div>
      )}
    </div>
  );
});

export default FormNode;
