'use client';

import { useState } from "react";
import Modal from "./Modal";

type PrefillSourceGroup = {
  id: string;
  label: string;
  fields: string[];
};

type PrefillModalProps = {
  isOpen: boolean;
  onClose: () => void;
  fieldName: string | null;
  availableSources: PrefillSourceGroup[];
  onSelectPrefillSource: (fromFormId: string, fromFieldName: string) => void;
};

export default function PrefillModal({
  isOpen,
  onClose,
  fieldName,
  availableSources,
  onSelectPrefillSource,
}: PrefillModalProps) {
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  if (!isOpen || !fieldName) return null;

  const toggleExpand = (groupId: string) => {
    setExpandedGroup((prev) => (prev === groupId ? null : groupId));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div>
        <h2 className="text-lg font-bold mb-4">
          Select a Prefill Source for <span className="text-primary">{fieldName}</span>
        </h2>

        <div className="flex flex-col gap-4">
          {availableSources.length === 0 ? (
            <div className="text-sm text-gray-500">No available sources.</div>
          ) : (
            availableSources.map((sourceGroup) => (
              <div key={sourceGroup.id} className="border rounded">
                {/* Group Title (Clickable) */}
                <button
                  className="w-full flex items-center justify-between p-2 hover:bg-gray-100 rounded-t"
                  onClick={() => toggleExpand(sourceGroup.id)}
                >
                  <span className="font-medium">{sourceGroup.label}</span>
                  <span className="text-gray-500 text-xs">
                    {expandedGroup === sourceGroup.id ? "▼" : "▶"}
                  </span>
                </button>

                {/* Expanded fields */}
                {expandedGroup === sourceGroup.id && (
                  <div className="flex flex-col gap-1 mt-1 px-4 pb-2">
                    {sourceGroup.fields.map((field) => (
                      <button
                        key={field}
                        className="text-left text-sm p-1 hover:bg-gray-50 rounded"
                        onClick={() => onSelectPrefillSource(sourceGroup.id, sourceGroup.label, field)}
                      >
                        {field}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <div className="flex justify-end mt-6">
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}
