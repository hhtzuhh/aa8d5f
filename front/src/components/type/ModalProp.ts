export type PrefillSourceGroup = {
    id: string;
    label: string;
    fields: string[];
  };
    
export type PrefillModalProps = {
    isOpen: boolean;
    onClose: () => void;
    fieldName: string | null;
    availableSources: PrefillSourceGroup[];
    onSelectPrefillSource: (fromFormId: string, fromSourceLabel: string, fromFieldName: string) => void;
};

export type FormDetailsModalProps = {
    isOpen: boolean;
    onClose: () => void;
    selectedNode: any;
    onEditField: (fieldName: string) => void;
    onClearPrefill: (fieldName: string) => void;
  };