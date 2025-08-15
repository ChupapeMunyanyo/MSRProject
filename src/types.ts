
export interface Option {
  label: string;
  value: string;
}

export interface MultiselectProps {
  options: Option[];
  selectedOptions: string[];
  onSelectionChange: (selected: string[]) => void;
  placeholder?: string;
}