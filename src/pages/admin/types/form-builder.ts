export type FieldType =
  | "text"
  | "textarea"
  | "email"
  | "number"
  | "password"
  | "date"
  | "select"
  | "checkbox"
  | "radio";

export type DataType = "string" | "number" | "boolean" | "date";

export type ValidationRuleType =
  | "required"
  | "email"
  | "minLength"
  | "maxLength"
  | "minValue"
  | "maxValue"
  | "pattern"
  | "url";

export interface ValidationRule {
  id: string; // Frontend only ID for list rendering
  type: ValidationRuleType;
  value?: string | number; // Value for rules like minLength, pattern, etc.
  message: string; // Custom error message
}

export interface FormField {
  id: string; // Frontend only ID for builder
  name: string; // Unique name for the field (e.g., "firstName")
  label: string; // Display label for the field (e.g., "First Name")
  fieldType: FieldType;
  dataType: DataType; // Expected data type for backend
  position: {
    row: number;
    column: number;
  };
  validation?: ValidationRule[];
  required: boolean;
  placeholder?: string;
  options?: string[]; // For select and radio types
}

export interface FormLayout {
  columns: 2 | 3; // Number of columns in the grid
  fieldsPerRow: 2 | 3; // How many fields per row
  spacing: "small" | "medium" | "large";
}

export interface SubmitButton {
  type: "primary" | "secondary" | "outline" | "gradient";
  text: string;
  color?: string; // Custom color for primary/gradient types
}

export interface FormSubmission {
  callbackUrl: string; // URL to send form data
  method: "POST" | "PUT"; // HTTP method for submission
}

export interface FormConfig {
  id: string; // Unique ID for the form
  name: string;
  description?: string;
  fields: FormField[];
  layout: FormLayout;
  submitButton: SubmitButton;
  submission: FormSubmission;
  createdAt: Date;
  updatedAt: Date;
}

export type FormData = Record<string, unknown>;