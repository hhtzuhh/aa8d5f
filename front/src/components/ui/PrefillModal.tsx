'use client';

import Modal from "./Modal";

type PrefillModalProps = {
  isOpen: boolean;
  onClose: () => void;
  fieldName: string | null;
  availableSources: { fromFormId: string; fromFieldName: string }[];
  onSelectPrefillSource: (fromFormId: string, fromFieldName: string) => void;
};

export default function PrefillModal({
  isOpen,
  onClose,
  fieldName,
  availableSources,
  onSelectPrefillSource,
}: PrefillModalProps) {
  if (!fieldName) return null; // No field selected

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div>
        <h2 className="text-lg font-bold mb-4">
          Select a Prefill Source for <span className="text-primary">{fieldName}</span>
        </h2>

        <div className="flex flex-col gap-2">
          {availableSources.length === 0 ? (
            <div className="text-sm text-gray-500">No available sources.</div>
          ) : (
            availableSources.map((source, index) => (
              <button
                key={index}
                className="p-2 border rounded hover:bg-gray-100 text-left"
                onClick={() => onSelectPrefillSource(source.fromFormId, source.fromFieldName)}
              >
                {source.fromFormId} ➔ {source.fromFieldName}
              </button>
            ))
          )}
        </div>

        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}
