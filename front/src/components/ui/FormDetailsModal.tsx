'use client';

import Modal from "@/components/ui/Modal"; 
import { TiDeleteOutline } from "react-icons/ti";

type FormDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedNode: any;
  onEditField: (fieldName: string) => void;
  onClearPrefill: (fieldName: string) => void;
};

export default function FormDetailsModal({
  isOpen,
  onClose,
  selectedNode,
  onEditField,
  onClearPrefill,
}: FormDetailsModalProps) {
  if (!isOpen || !selectedNode || !selectedNode.data?.form) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-lg font-bold mb-4">{selectedNode.data.label}</h2>

      <div className="space-y-2">
        {Object.keys(selectedNode.data.form.field_schema.properties || {}).map((fieldName) => {
          const mapping = selectedNode.data.input_mapping?.[fieldName];

          return (
            <div
              key={fieldName}
              className="flex justify-between items-center border p-2 rounded hover:bg-gray-100 cursor-pointer"
              onClick={() => !mapping && onEditField(fieldName)} 
            >
              {/* Left side */}
              <div className="flex flex-col">
                <div className="font-medium">{fieldName}</div>
              </div>

              {/* Right side */}
              <div className="flex items-center gap-2">
                {mapping && (
                  <>
                    <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                      {mapping.fromSourceLabel}.{mapping.fromFieldName}
                    </span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation(); // Stop click bubbling
                        onClearPrefill(fieldName);
                      }}
                      className="text-red-500 text-lg hover:underline"
                    >
                      <TiDeleteOutline />
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
}
