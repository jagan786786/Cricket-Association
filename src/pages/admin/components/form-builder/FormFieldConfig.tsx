import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Info,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import {
  DataType,
  FieldType,
  FormField,
  ValidationRule,
} from "../../types/form-builder";

interface FormFieldConfigProps {
  field: FormField;
  onUpdate: (field: FormField) => void;
  onDelete: (fieldId: string) => void;
}

const generateValidationId = () => Math.random().toString(36).substr(2, 9);

export function FormFieldConfig({
  field,
  onUpdate,
  onDelete,
}: FormFieldConfigProps) {
  const [isOpen, setIsOpen] = useState(false);

  const updateFieldProperty = <K extends keyof FormField>(
    key: K,
    value: FormField[K]
  ) => {
    onUpdate({ ...field, [key]: value });
  };

  const addValidationRule = () => {
    const newRule: ValidationRule = {
      id: generateValidationId(),
      type: "required", // Default rule type
      value: "",
      message: "This field is required.",
    };
    updateFieldProperty("validation", [...(field.validation || []), newRule]);
  };

  const updateValidationRule = (
    ruleId: string,
    updates: Partial<ValidationRule>
  ) => {
    updateFieldProperty(
      "validation",
      (field.validation || []).map((rule) =>
        rule.id === ruleId ? { ...rule, ...updates } : rule
      )
    );
  };

  const deleteValidationRule = (ruleId: string) => {
    updateFieldProperty(
      "validation",
      (field.validation || []).filter((rule) => rule.id !== ruleId)
    );
  };

  const getValidationRuleValueType = (ruleType: string) => {
    switch (ruleType) {
      case "minLength":
      case "maxLength":
      case "minValue":
      case "maxValue":
        return "number";
      case "pattern":
        return "text";
      case "email":
      case "url":
      case "required":
      default:
        return "none";
    }
  };

  return (
    <Card className="bg-white border-slate-200 shadow-md hover:shadow-lg transition-all duration-200">
      {/* Collapsible component now wraps both the trigger and content */}
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="flex flex-row items-center justify-between p-4 bg-slate-50/50 border-b border-slate-100 rounded-t-xl">
          <div className="flex items-center gap-3">
            <Badge
              variant="secondary"
              className="px-3 py-1 bg-blue-50 text-blue-700 font-medium"
            >
              {field.fieldType.toUpperCase()}
            </Badge>
            <h4 className="font-semibold text-slate-800">
              {field.label || "Untitled Field"}
            </h4>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(field.id)}
              className="text-red-500 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            {/* CollapsibleTrigger is now correctly nested within Collapsible */}
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-500 hover:bg-slate-100 hover:text-slate-700"
              >
                {isOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
          </div>
        </CardHeader>
        <CollapsibleContent className="CollapsibleContent animate-in slide-in-from-top-2 duration-300">
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label
                  htmlFor={`label-${field.id}`}
                  className="text-sm font-medium text-slate-700"
                >
                  Label
                </Label>
                <Input
                  id={`label-${field.id}`}
                  value={field.label}
                  onChange={(e) => updateFieldProperty("label", e.target.value)}
                  placeholder="Field Label"
                  className="bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 text-slate-700"
                />
              </div>
              <div className="space-y-3">
                <Label
                  htmlFor={`name-${field.id}`}
                  className="text-sm font-medium text-slate-700"
                >
                  Name (for backend)
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 ml-1 inline-block text-slate-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Unique identifier for backend processing (e.g.,
                        'firstName')
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <Input
                  id={`name-${field.id}`}
                  value={field.name}
                  onChange={(e) => updateFieldProperty("name", e.target.value)}
                  placeholder="fieldName"
                  className="bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 text-slate-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label
                  htmlFor={`fieldType-${field.id}`}
                  className="text-sm font-medium text-slate-700"
                >
                  Field Type
                </Label>
                <Select
                  value={field.fieldType}
                  onValueChange={(value: FieldType) =>
                    updateFieldProperty("fieldType", value)
                  }
                >
                  <SelectTrigger
                    id={`fieldType-${field.id}`}
                    className="bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 text-slate-700"
                  >
                    <SelectValue placeholder="Select field type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text Input</SelectItem>
                    <SelectItem value="textarea">Textarea</SelectItem>
                    <SelectItem value="email">Email Input</SelectItem>
                    <SelectItem value="number">Number Input</SelectItem>
                    <SelectItem value="password">Password Input</SelectItem>
                    <SelectItem value="date">Date Input</SelectItem>
                    <SelectItem value="file">File Input</SelectItem>
                    <SelectItem value="select">Dropdown (Select)</SelectItem>
                    <SelectItem value="checkbox">Checkbox</SelectItem>
                    <SelectItem value="radio">Radio Buttons</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label
                  htmlFor={`dataType-${field.id}`}
                  className="text-sm font-medium text-slate-700"
                >
                  Data Type
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 ml-1 inline-block text-slate-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Expected data type for backend storage</p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <Select
                  value={field.dataType}
                  onValueChange={(value: DataType) =>
                    updateFieldProperty("dataType", value)
                  }
                >
                  <SelectTrigger
                    id={`dataType-${field.id}`}
                    className="bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 text-slate-700"
                  >
                    <SelectValue placeholder="Select data type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="string">String</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="boolean">Boolean</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                    {/* Add more data types as needed */}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <Label
                htmlFor={`placeholder-${field.id}`}
                className="text-sm font-medium text-slate-700"
              >
                Placeholder
              </Label>
              <Input
                id={`placeholder-${field.id}`}
                value={field.placeholder || ""}
                onChange={(e) =>
                  updateFieldProperty("placeholder", e.target.value)
                }
                placeholder="Enter text here..."
                className="bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 text-slate-700"
              />
            </div>

            {field.fieldType === "select" && (
              <div className="space-y-3">
                <Label
                  htmlFor={`options-${field.id}`}
                  className="text-sm font-medium text-slate-700"
                >
                  Options (comma-separated)
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 ml-1 inline-block text-slate-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Enter options for dropdown/radio, e.g., Option 1, Option
                        2
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <Textarea
                  id={`options-${field.id}`}
                  value={(field.options || []).join(", ")}
                  onChange={(e) =>
                    updateFieldProperty(
                      "options",
                      e.target.value.split(",").map((s) => s.trim())
                    )
                  }
                  placeholder="Option 1, Option 2, Option 3"
                  className="bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 min-h-[80px] text-slate-700"
                />
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Checkbox
                id={`required-${field.id}`}
                checked={field.required}
                onCheckedChange={(checked: boolean) =>
                  updateFieldProperty("required", checked)
                }
                className="border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white"
              />
              <Label
                htmlFor={`required-${field.id}`}
                className="text-sm font-medium text-slate-700"
              >
                Required Field
              </Label>
            </div>

            <Separator className="bg-slate-200" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h5 className="text-md font-semibold text-slate-800">
                  Validation Rules
                </h5>
                <Button
                  onClick={addValidationRule}
                  variant="outline"
                  size="sm"
                  className="bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                >
                  <Plus className="h-3 w-3 mr-1" /> Add Rule
                </Button>
              </div>
              {field.validation && field.validation.length > 0 ? (
                <div className="space-y-3">
                  {field.validation.map((rule) => (
                    <Card
                      key={rule.id}
                      className="bg-slate-50/50 border-slate-200 shadow-sm"
                    >
                      <CardContent className="p-4 space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-xs font-medium text-slate-600">
                              Rule Type
                            </Label>
                            <Select
                              value={rule.type}
                              onValueChange={(value: ValidationRule["type"]) =>
                                updateValidationRule(rule.id, {
                                  type: value,
                                  value: "",
                                  message: "",
                                })
                              }
                            >
                              <SelectTrigger className="bg-white border-slate-200 text-slate-700">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="required">
                                  Required
                                </SelectItem>
                                <SelectItem value="email">
                                  Email Format
                                </SelectItem>
                                <SelectItem value="minLength">
                                  Min Length
                                </SelectItem>
                                <SelectItem value="maxLength">
                                  Max Length
                                </SelectItem>
                                <SelectItem value="minValue">
                                  Min Value
                                </SelectItem>
                                <SelectItem value="maxValue">
                                  Max Value
                                </SelectItem>
                                <SelectItem value="pattern">
                                  Regex Pattern
                                </SelectItem>
                                <SelectItem value="url">URL Format</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs font-medium text-slate-600">
                              Error Message
                            </Label>
                            <Input
                              value={rule.message || ""}
                              onChange={(e) =>
                                updateValidationRule(rule.id, {
                                  message: e.target.value,
                                })
                              }
                              placeholder="e.g., This field is required."
                              className="bg-white border-slate-200 text-slate-700"
                            />
                          </div>
                        </div>
                        {getValidationRuleValueType(rule.type) !== "none" && (
                          <div className="space-y-2">
                            <Label className="text-xs font-medium text-slate-600">
                              Rule Value
                            </Label>
                            <Input
                              type={
                                getValidationRuleValueType(rule.type) ===
                                "number"
                                  ? "number"
                                  : "text"
                              }
                              value={rule.value || ""}
                              onChange={(e) =>
                                updateValidationRule(rule.id, {
                                  value: e.target.value,
                                })
                              }
                              placeholder={
                                getValidationRuleValueType(rule.type) ===
                                "number"
                                  ? "e.g., 5"
                                  : "e.g., ^\\d{3}-\\d{2}-\\d{4}$"
                              }
                              className="bg-white border-slate-200 text-slate-700"
                            />
                          </div>
                        )}
                        <div className="flex justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteValidationRule(rule.id)}
                            className="text-red-500 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="h-3 w-3 mr-1" /> Remove
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 text-center py-4">
                  No validation rules added.
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className="p-4 bg-slate-50/50 border-t border-slate-100 rounded-b-xl flex justify-end">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
            >
              <Check className="h-4 w-4 mr-2" /> Done
            </Button>
          </CardFooter>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
