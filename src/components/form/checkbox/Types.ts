interface Checkbox {
  value: any;
  checked: boolean;
}

export interface CheckboxGroup {
  dir: string;
  get(): any;
  set(val: Checkbox): void;
}
