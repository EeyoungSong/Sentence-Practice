export interface InputInfo {
  type?: string;
  info?: string | undefined;
  required?: boolean;
  errorComment?: string;
  align?: 'horizontal' | 'vertical';
  name: string;
  value: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  classNameProp?: string;
  InputclassNameProp?: string;
}
