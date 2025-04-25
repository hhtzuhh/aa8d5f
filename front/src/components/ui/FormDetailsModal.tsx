'use client';

import Modal from "@/components/ui/Modal"; // Import your base Modal!

type FormDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedNode: any; // later can type stronger
  onEditField: (fieldName: string) => void;
};

export default function FormDetailsModal({
  isOpen,
  onClose,
  selectedNode,
  onEditField,
}: FormDetailsModalProps) {
  if (!isOpen || !selectedNode || !selectedNode.data?.form) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-lg font-bold mb-4">{selectedNode.data.label}</h2>

      <div className="space-y-2">
        {Object.keys(selectedNode.data.form.field_schema.properties || {}).map((fieldName) => (
          <div
            key={fieldName}
            className="flex justify-between items-center border p-2 rounded hover:bg-gray-100 cursor-pointer"
            onClick={() => onEditField(fieldName)}
          >
            <div className="font-medium">{fieldName}</div>
            <div className="text-sm text-gray-500">Edit Prefill</div>
          </div>
        ))}
      </div>
    </Modal>
  );
}
