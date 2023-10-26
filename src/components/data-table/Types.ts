export interface Header {
  text: string;
  value: string;
}

export interface Props {
  headers: Header[];
  items?: any[];
  search?: string;
  itemsPerPage?: number;
  itemsPerPageOptions?: number[];
  searchDelay?: number;
  scroll?: false;
  checkItem: any[];
  isExpanded: boolean;
  serverItems: any[];
  serverItemsTotal: number;
  isCheckbox?: boolean,
  condition?: any;

  isDateOption?: boolean;
  fromDate?: string;
  toDate?: string;
  status?: any;
  padding?: string
}

export interface Option {
  page: number;
  itemsPerPage: number;
  search: string;
  callback(items: any[], totalItems: number): void;
}

export interface OptionWithDate {
  page: number;
  itemsPerPage: number;
  search: string;
  fromDate: string;
  toDate: string;
  callback(items: any[], totalItems: number): void;
}
