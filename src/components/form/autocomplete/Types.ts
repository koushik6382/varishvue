export interface Props {
  modelValue: any;
  label: string;
  placeholder?: string;
  items?: any[];
  itemText?: string;
  itemValue?: string;
  itemsPerPage?: number;
  header?: any[];
  rule?: any;
  multiple?: boolean;
  tag?: string;
  searchDelay : number;
  resultObj? : boolean;
  infoEnable?:boolean;
  disabled: boolean;
  updatedItem : any | null;
}

export interface LoadOption {
  page: number;
  itemsPerPage: number;
  search: string;
  callback(items: any[], totalItems: number): void;
}
