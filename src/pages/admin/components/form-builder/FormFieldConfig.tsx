import { useState } from "react";
import type {
  FormField,
  FieldType,
  DataType,
  ValidationRule,
} from "../../types/form-builder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  X,
  Plus,
  GripVertical,
  ChevronDown,
  ChevronRight,
  Trash2,
  Settings2,
  AlertCircle,
} from "lucide-react";

interface FormFieldConfigProps {
  field: FormField;
  onUpdate: (field: FormField) => void;
  onDelete: (fieldId: string) => void;
}

const fieldTypeOptions: {
  value: FieldType;
  label: string;
  dataTypes: DataType[];
  icon: string;
}[] = [
  { value: "text", label: "Text Input", dataTypes: ["string"], icon: "📝" },
  { value: "number", label: "Number Input", dataTypes: ["number"], icon: "🔢" },
  { value: "email", label: "Email Input", dataTypes: ["string"], icon: "📧" },
  {
    value: "password",
    label: "Password Input",
    dataTypes: ["string"],
    icon: "🔒",
  },
  { value: "textarea", label: "Text Area", dataTypes: ["string"], icon: "📄" },
  { value: "select", label: "Dropdown", dataTypes: ["string"], icon: "📋" },
  { value: "checkbox", label: "Checkbox", dataTypes: ["boolean"], icon: "☑️" },
  { value: "radio", label: "Radio Buttons", dataTypes: ["string"], icon: "🔘" },
  { value: "date", label: "Date Picker", dataTypes: ["date"], icon: "📅" },
  { value: "file", label: "File Upload", dataTypes: ["file"], icon: "📎" },
];

export function FormFieldConfig({
  field,
  onUpdate,
  onDelete,
}: FormFieldConfigProps) {
  const [newOption, setNewOption] = useState("");
  const [newValidation, setNewValidation] = useState<Partial<ValidationRule>>(
    {}
  );
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Add safety checks for field properties
  const safeField = field
    ? {
        ...field,
        label: field.label || "New Field",
        name: field.name || "field_name",
        fieldType: field.fieldType || "text",
        dataType: field.dataType || "string",
        placeholder: field.placeholder || "",
        required: field.required || false,
        validation: field.validation || [],
        options: field.options || [],
      }
    : null;

  if (!safeField) {
    return null;
  }

  const updateField = (updates: Partial<FormField>) => {
    onUpdate({ ...safeField, ...updates });
  };

  const addOption = () => {
    if (newOption.trim()) {
      updateField({
        options: [...(safeField.options || []), newOption.trim()],
      });
      setNewOption("");
    }
  };

  const removeOption = (index: number) => {
    const newOptions = [...(safeField.options || [])];
    newOptions.splice(index, 1);
    updateField({ options: newOptions });
  };

  const addValidation = () => {
    if (newValidation.type) {
      updateField({
        validation: [...safeField.validation, newValidation as ValidationRule],
      });
      setNewValidation({});
    }
  };

  const removeValidation = (index: number) => {
    const newValidation = [...safeField.validation];
    newValidation.splice(index, 1);
    updateField({ validation: newValidation });
  };

  const selectedFieldType = fieldTypeOptions.find(
    (opt) => opt.value === safeField.fieldType
  );

  return (
    <TooltipProvider>
      <Card
        className="bg-gradient-to-br from-white to-slate-50/30 border-0 shadow-lg hover:shadow-xl transition-all duration-300 group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 cursor-grab active:cursor-grabbing">
                <GripVertical className="h-5 w-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
                <div className="text-2xl">{selectedFieldType?.icon}</div>
              </div>
              <div>
                <CardTitle className="text-lg text-slate-800">
                  {safeField.label || "New Field"}
                </CardTitle>
                <p className="text-sm text-slate-500">
                  {selectedFieldType?.label}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {safeField.required && (
                <Badge
                  variant="secondary"
                  className="bg-red-50 text-red-700 border-red-200"
                >
                  Required
                </Badge>
              )}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(safeField.id)}
                    className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete field</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Basic Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor={`label-${safeField.id}`}
                className="text-sm font-medium text-slate-700"
              >
                Field Label
              </Label>
              <Input
                id={`label-${safeField.id}`}
                value={safeField.label}
                onChange={(e) => updateField({ label: e.target.value })}
                placeholder="Enter field label"
                className="bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-200"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor={`name-${safeField.id}`}
                className="text-sm font-medium text-slate-700"
              >
                Field Name
              </Label>
              <Input
                id={`name-${safeField.id}`}
                value={safeField.name}
                onChange={(e) => updateField({ name: e.target.value })}
                placeholder="field_name"
                className="bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-200 font-mono text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">
                Field Type
              </Label>
              <Select
                value={safeField.fieldType}
                onValueChange={(value: FieldType) => {
                  const fieldTypeOption = fieldTypeOptions.find(
                    (opt) => opt.value === value
                  );
                  updateField({
                    fieldType: value,
                    dataType: fieldTypeOption?.dataTypes[0] || "string",
                  });
                }}
              >
                <SelectTrigger className="bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fieldTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <span>{option.icon}</span>
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">
                Data Type
              </Label>
              <Select
                value={safeField.dataType}
                onValueChange={(value: DataType) =>
                  updateField({ dataType: value })
                }
              >
                <SelectTrigger className="bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {selectedFieldType?.dataTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor={`placeholder-${safeField.id}`}
              className="text-sm font-medium text-slate-700"
            >
              Placeholder Text
            </Label>
            <Input
              id={`placeholder-${safeField.id}`}
              value={safeField.placeholder || ""}
              onChange={(e) => updateField({ placeholder: e.target.value })}
              placeholder="Enter placeholder text"
              className="bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-200"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-lg border border-slate-200">
            <div className="flex items-center space-x-3">
              <Switch
                id={`required-${safeField.id}`}
                checked={safeField.required}
                onCheckedChange={(checked) =>
                  updateField({ required: checked })
                }
              />
              <div>
                <Label
                  htmlFor={`required-${safeField.id}`}
                  className="text-sm font-medium text-slate-700"
                >
                  Required field
                </Label>
                <p className="text-xs text-slate-500">
                  Users must fill this field
                </p>
              </div>
            </div>
            {safeField.required && (
              <AlertCircle className="h-4 w-4 text-red-500" />
            )}
          </div>

          {/* Options for select/radio fields */}
          {(safeField.fieldType === "select" ||
            safeField.fieldType === "radio") && (
            <div className="space-y-4 p-4 bg-blue-50/30 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium text-slate-700">
                  Options
                </Label>
                <Badge variant="outline" className="text-xs">
                  {safeField.options?.length || 0} options
                </Badge>
              </div>
              <div className="space-y-3">
                {safeField.options?.map((option, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 group/option"
                  >
                    <div className="flex-1 p-2 bg-white rounded border border-slate-200 text-sm">
                      {option}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeOption(index)}
                      className="h-8 w-8 opacity-0 group-hover/option:opacity-100 transition-opacity text-red-500 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input
                    value={newOption}
                    onChange={(e) => setNewOption(e.target.value)}
                    placeholder="Add new option"
                    onKeyPress={(e) => e.key === "Enter" && addOption()}
                    className="bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20"
                  />
                  <Button
                    onClick={addOption}
                    disabled={!newOption.trim()}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Advanced Settings */}
          <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between p-4 bg-slate-50/50 hover:bg-slate-100/50 rounded-lg border border-slate-200"
              >
                <div className="flex items-center gap-2">
                  <Settings2 className="h-4 w-4" />
                  <span className="font-medium">Validation Rules</span>
                  {safeField.validation.length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {safeField.validation.length}
                    </Badge>
                  )}
                </div>
                {isAdvancedOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 pt-4">
              <div className="space-y-3">
                {safeField.validation.map((rule, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-3 bg-white rounded-lg border border-slate-200 shadow-sm"
                  >
                    <Badge
                      variant="outline"
                      className="flex-1 justify-between bg-slate-50"
                    >
                      <span className="font-medium">{rule.type}</span>
                      {rule.value && (
                        <span className="text-slate-600">: {rule.value}</span>
                      )}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeValidation(index)}
                      className="h-8 w-8 text-red-500 hover:bg-red-50"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}

                <div className="flex gap-2 p-3 bg-slate-50/50 rounded-lg border border-slate-200">
                  <Select
                    value={newValidation.type || ""}
                    onValueChange={(type: ValidationRule["type"]) =>
                      setNewValidation({ ...newValidation, type })
                    }
                  >
                    <SelectTrigger className="w-40 bg-white">
                      <SelectValue placeholder="Rule type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="required">Required</SelectItem>
                      <SelectItem value="minLength">Min Length</SelectItem>
                      <SelectItem value="maxLength">Max Length</SelectItem>
                      <SelectItem value="pattern">Pattern</SelectItem>
                      <SelectItem value="min">Min Value</SelectItem>
                      <SelectItem value="max">Max Value</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                    </SelectContent>
                  </Select>

                  {newValidation.type &&
                    newValidation.type !== "required" &&
                    newValidation.type !== "email" && (
                      <Input
                        value={newValidation.value || ""}
                        onChange={(e) =>
                          setNewValidation({
                            ...newValidation,
                            value:
                              newValidation.type === "pattern"
                                ? e.target.value
                                : Number(e.target.value),
                          })
                        }
                        placeholder="Value"
                        className="flex-1 bg-white"
                      />
                    )}

                  <Button
                    onClick={addValidation}
                    disabled={!newValidation.type}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
