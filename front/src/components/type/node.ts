export type MyNode = {
  id: string;
  measured: Record<string, number>;
  position: Record<string, number>;
  data: {
    component_id: string;
    input_mapping: Record<string, any>;
    label?: string;
    form?: Form;
  };
};

export type Form = {
  field_schema?: {
    properties?: Record<string, any>;
  };
}


