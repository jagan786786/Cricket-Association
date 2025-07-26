export type FieldType = 
  | 'text' 
  | 'number' 
  | 'email' 
  | 'password' 
  | 'textarea' 
  | 'select' 
  | 'checkbox' 
  | 'radio' 
  | 'date' 
  | 'file';

export type DataType = 'string' | 'number' | 'boolean' | 'date' | 'file';

export type ValidationRule = {
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'min' | 'max' | 'email';
  value?: string | number;
  message?: string;
};

export type FormField = {
  id: string;
  name: string;
  label: string;
  fieldType: FieldType;
  dataType: DataType;
  position: {
    row: number;
    column: number;
  };
  validation: ValidationRule[];
  required: boolean;
  placeholder?: string;
  options?: string[]; // for select, radio, checkbox
  defaultValue?: string | number | boolean;
};

export type FormLayout = {
  columns: 2 | 3;
  fieldsPerRow: 2 | 3;
  spacing: 'sm' | 'md' | 'lg';
};

export type SubmitButton = {
  type: 'primary' | 'secondary' | 'outline' | 'gradient';
  color?: string;
  text: string;
};

export type FormSubmission = {
  callbackUrl: string;
  method: 'POST' | 'PUT';
  headers?: Record<string, string>;
};

export type FormConfig = {
  id: string;
  name: string;
  description?: string;
  fields: FormField[];
  layout: FormLayout;
  submitButton: SubmitButton;
  submission: FormSubmission;
  createdAt: Date;
  updatedAt: Date;
};

export type FormData = Record<string, string | number | boolean | File | Date | undefined>;