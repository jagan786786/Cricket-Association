import { useState, useEffect } from "react";
import type {
  FormConfig,
  FormField,
  FormLayout,
  SubmitButton,
  FormSubmission,
} from "../../types/form-builder";
import { FormFieldConfig } from "./FormFieldConfig";
import { FormPreview } from "./FormPreview"; // Assuming FormPreview is also in the same directory
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Plus,
  Settings,
  Eye,
  Save,
  Palette,
  Layers,
  Zap,
  Sparkles,
  Info,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

// API URL -- change as needed if using a prefix like /api, /v1, etc.
const API_BASE_URL = "http://localhost:4000/api";

// Generate frontend "fake" field id, only for builder
const generateId = () => Math.random().toString(36).substr(2, 9);

const createDefaultFormConfig = (): FormConfig => ({
  id: generateId(),
  name: "New Form",
  description: "",
  fields: [],
  layout: {
    columns: 2,
    fieldsPerRow: 2,
    spacing: "medium",
  },
  submitButton: {
    type: "primary",
    text: "Submit",
    color: "#3b82f6",
  },
  submission: {
    callbackUrl: "",
    method: "POST",
  },
  createdAt: new Date(),
  updatedAt: new Date(),
});

export function FormBuilder() {
  const [config, setConfig] = useState<FormConfig | null>(null);
  const [activeTab, setActiveTab] = useState("fields");
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [menuItems, setMenuItems] = useState<{ id: string; name: string }[]>(
    []
  );
  const [selectedMenuItem, setSelectedMenuItem] = useState<string>("");
  const [instances, setInstances] = useState<{ id: string; name: string }[]>(
    []
  );
  const [selectedInstanceId, setSelectedInstanceId] = useState<string>("");

  // --- Load menu items and config ---
  useEffect(() => {
    async function fetchMenuItems() {
      try {
        const res = await fetch(`${API_BASE_URL}/menuitems`);
        const arr = await res.json();
        if (Array.isArray(arr)) {
          setMenuItems(arr.map((m: any) => ({ id: m._id, name: m.name })));
        } else if (Array.isArray(arr.menuItems)) {
          setMenuItems(
            arr.menuItems.map((m: any) => ({ id: m._id, name: m.name }))
          );
        }
      } catch (error) {
        console.error("Failed to fetch menu items:", error);
        setMenuItems([]);
        toast({
          title: "Error fetching menu items",
          description: "Could not load available menu items from the backend.",
          variant: "destructive",
        });
      }
    }

    const initializeConfig = () => {
      try {
        const savedConfig = localStorage.getItem("formBuilderConfig");
        if (savedConfig) {
          const parsedConfig = JSON.parse(savedConfig);
          parsedConfig.createdAt = new Date(parsedConfig.createdAt);
          parsedConfig.updatedAt = new Date(parsedConfig.updatedAt);

          // ✅ ADDED: prevent loading if no valid menu/instance context
          if (!selectedMenuItem || !selectedInstanceId) {
            throw new Error("No context");
          }

          setConfig(parsedConfig);
        } else {
          setConfig(createDefaultFormConfig());
        }
      } catch (error) {
        console.error("Failed to load config from localStorage:", error);
        localStorage.removeItem("formBuilderConfig"); // ✅ ADDED
        setConfig(createDefaultFormConfig());
        toast({
          title: "Error loading saved form",
          description: "Starting with a fresh form configuration.",
          variant: "default",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenuItems();
    initializeConfig();
  }, []);

  // --- Fetch instances when menu changes ---
  useEffect(() => {
    if (selectedMenuItem) {
      setInstances([]);
      setSelectedInstanceId("");
      (async () => {
        try {
          const res = await fetch(
            `${API_BASE_URL}/instances/${selectedMenuItem}`
          );
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          const data = await res.json();
          if (Array.isArray(data.instances)) {
            setInstances(
              data.instances.map((i: any) => ({ id: i._id, name: i.name }))
            );
          } else {
            setInstances([]);
          }
        } catch (error) {
          console.error("Failed to fetch instances:", error);
          setInstances([]);
          toast({
            title: "Error fetching instances",
            description: "Could not load instances for the selected menu item.",
            variant: "destructive",
          });
        }
      })();
    } else {
      setInstances([]);
      setSelectedInstanceId("");
    }
  }, [selectedMenuItem]);

  if (isLoading || !config) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-600">Loading Form Builder...</p>
        </div>
      </div>
    );
  }

  // --- State Updaters ---
  const updateConfig = (updates: Partial<FormConfig>) => {
    setConfig((prev) =>
      prev
        ? {
            ...prev,
            ...updates,
            updatedAt: new Date(),
          }
        : null
    );
  };
  const addField = () => {
    setIsAnimating(true);
    const newField: FormField = {
      id: generateId(),
      name: `field_${config.fields.length + 1}`,
      label: `Field ${config.fields.length + 1}`,
      fieldType: "text",
      dataType: "string",
      position: {
        row: Math.floor(config.fields.length / config.layout.fieldsPerRow),
        column: config.fields.length % config.layout.fieldsPerRow,
      },
      validation: [],
      required: false,
      placeholder: "",
    };
    setTimeout(() => {
      updateConfig({
        fields: [...config.fields, newField],
      });
      setIsAnimating(false);
    }, 150);
  };
  const updateField = (updatedField: FormField) => {
    updateConfig({
      fields: config.fields.map((field) =>
        field.id === updatedField.id ? updatedField : field
      ),
    });
  };
  const deleteField = (fieldId: string) => {
    updateConfig({
      fields: config.fields.filter((field) => field.id !== fieldId),
    });
  };
  const updateLayout = (layout: Partial<FormLayout>) => {
    updateConfig({
      layout: { ...config.layout, ...layout },
    });
    // reposition fields
    const perRow = layout.fieldsPerRow || config.layout.fieldsPerRow;
    updateConfig({
      fields: config.fields.map((field, index) => ({
        ...field,
        position: {
          row: Math.floor(index / perRow),
          column: index % perRow,
        },
      })),
    });
  };
  const updateSubmitButton = (btn: Partial<SubmitButton>) => {
    updateConfig({ submitButton: { ...config.submitButton, ...btn } });
  };
  const updateSubmission = (sub: Partial<FormSubmission>) => {
    updateConfig({
      submission: { ...config.submission, ...sub },
    });
  };

  // --- Main save flow (sync field/validation to backend, then form) ---
  const saveForm = async () => {
    if (!selectedMenuItem || !selectedInstanceId) {
      toast({
        title: "Choose menu item & instance",
        description:
          "You must select a menu item and instance to save the form.",
        variant: "destructive",
      });
      return;
    }

    try {
      const savedFieldIds = await Promise.all(
        config.fields.map(async (frontendField) => {
          const valIds = await Promise.all(
            (frontendField.validation || []).map(async (v) => {
              const r = await fetch(`${API_BASE_URL}/form-validation`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  rule: v.type,
                  value: v.value,
                  message: v.message,
                }),
              });
              if (!r.ok) throw new Error("Validation save failed");
              const d = await r.json();
              return d._id;
            })
          );

          const fieldBody: Omit<FormField, "id"> & { validation: string[] } = {
            ...frontendField,
            validation: valIds,
          };
          const fRes = await fetch(`${API_BASE_URL}/form-field`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(fieldBody),
          });
          if (!fRes.ok) throw new Error("Field save failed");
          const d = await fRes.json();
          return d._id;
        })
      );

      const payload = {
        name: config.name,
        description: config.description,
        fields: savedFieldIds,
        layout: config.layout,
        submitButton: config.submitButton,
        callbackUrl: config.submission.callbackUrl,
        callbackMethod: config.submission.method,
        menuItem: selectedMenuItem,
        instanceId: selectedInstanceId,
      };

      const res = await fetch(`${API_BASE_URL}/form`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save form");

      toast({
        title: "✨ Form saved",
        description:
          "The form and its fields/validations are saved in backend.",
      });

      // ✅ ADDED — Clear form and local state
      const newForm = createDefaultFormConfig();
      setConfig(newForm);
      setSelectedMenuItem("");
      setSelectedInstanceId("");
      localStorage.setItem("formBuilderConfig", JSON.stringify(newForm));
      setActiveTab("fields"); // Optional: reset tab to fields
    } catch (err: any) {
      toast({
        title: "❌ Could not save form",
        description: err?.message || "Unknown error",
        variant: "destructive",
      });
    }
  };

  // --- render ---
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 font-inter">
        <div className="container mx-auto p-6">
          {/* HEADER */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-indigo-500 to-green-600 rounded-xl shadow-lg">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-green-600 to-purple-600 bg-clip-text text-transparent">
                      Form Builder
                    </h1>
                    <p className="text-slate-600 text-lg">
                      Create beautiful, dynamic forms with ease
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge
                  variant="secondary"
                  className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 text-blue-700 font-medium"
                >
                  <Layers className="h-4 w-4 mr-2" />
                  {config.fields.length} fields
                </Badge>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={saveForm}
                      className="bg-white/80 backdrop-blur-sm border-slate-200 hover:bg-white hover:shadow-md transition-all duration-200 text-slate-700"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Form
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Save your form configuration</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-220px)]">
            {/* Left: Configuration Panel */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden flex flex-col">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="h-full flex flex-col"
              >
                <TabsList className="grid w-full grid-cols-4 bg-slate-50/80 backdrop-blur-sm m-2 rounded-xl p-1">
                  <TabsTrigger
                    value="fields"
                    className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200 text-slate-700"
                  >
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">Fields</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="layout"
                    className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200 text-slate-700"
                  >
                    <Layers className="h-4 w-4" />
                    <span className="hidden sm:inline">Layout</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="style"
                    className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200 text-slate-700"
                  >
                    <Palette className="h-4 w-4" />
                    <span className="hidden sm:inline">Style</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="config"
                    className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200 text-slate-700"
                  >
                    <Settings className="h-4 w-4" />
                    <span className="hidden sm:inline">Config</span>
                  </TabsTrigger>
                </TabsList>

                <div className="flex-1 overflow-auto">
                  <TabsContent value="fields" className="p-6 space-y-6 m-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-slate-800">
                          Form Fields
                        </h3>
                        <p className="text-slate-600 text-sm">
                          Add and configure your form fields
                        </p>
                      </div>
                      <Button
                        onClick={addField}
                        disabled={isAnimating}
                        className="bg-green-600 shadow-lg hover:shadow-xl transition-all duration-200 text-white"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Field
                      </Button>
                    </div>
                    <div className="space-y-4">
                      {config.fields.length === 0 ? (
                        <Card className="p-12 text-center bg-gradient-to-br from-slate-50 to-blue-50/30 border-dashed border-2 border-slate-200 hover:border-blue-300 transition-colors duration-200">
                          <div className="space-y-4">
                            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                              <Plus className="h-8 w-8 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="text-lg font-medium text-slate-800 mb-2">
                                No fields added yet
                              </h4>
                              <p className="text-slate-600 mb-6">
                                Start building your form by adding your first
                                field
                              </p>
                              <Button
                                onClick={addField}
                                className="bg-green-600 hover:bg-green-700 text-white shadow-lg transition-all duration-200"
                              >
                                <Zap className="h-4 w-4 mr-2" />
                                Add Your First Field
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ) : (
                        <div className="space-y-4">
                          {config.fields.map((field, index) => (
                            <div
                              key={field.id}
                              className="animate-in slide-in-from-top-2 duration-300"
                              style={{ animationDelay: `${index * 50}ms` }}
                            >
                              <FormFieldConfig
                                field={field}
                                onUpdate={updateField}
                                onDelete={deleteField}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="layout" className="p-6 space-y-6 m-0">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-800">
                        Layout Settings
                      </h3>
                      <p className="text-slate-600 text-sm">
                        Configure how your form is displayed
                      </p>
                    </div>
                    <Card className="bg-gradient-to-br from-white to-slate-50/50 border-0 shadow-lg">
                      <CardContent className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <Label className="text-sm font-medium text-slate-700">
                              Grid Columns
                            </Label>
                            <Select
                              value={config.layout.columns.toString()}
                              onValueChange={(value) =>
                                updateLayout({
                                  columns: Number(value) as 2 | 3,
                                })
                              }
                            >
                              <SelectTrigger className="bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 text-slate-700">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="2">2 Columns</SelectItem>
                                <SelectItem value="3">3 Columns</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-3">
                            <Label className="text-sm font-medium text-slate-700">
                              Fields Per Row
                            </Label>
                            <Select
                              value={config.layout.fieldsPerRow.toString()}
                              onValueChange={(value) =>
                                updateLayout({
                                  fieldsPerRow: Number(value) as 2 | 3,
                                })
                              }
                            >
                              <SelectTrigger className="bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 text-slate-700">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="2">2 Fields</SelectItem>
                                <SelectItem value="3">3 Fields</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <Label className="text-sm font-medium text-slate-700">
                            Spacing
                          </Label>
                          <Select
                            value={config.layout.spacing}
                            onValueChange={(
                              value: "small" | "medium" | "large"
                            ) => updateLayout({ spacing: value })}
                          >
                            <SelectTrigger className="bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 text-slate-700">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="small">small</SelectItem>
                              <SelectItem value="medium">medium</SelectItem>
                              <SelectItem value="large">large</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="style" className="p-6 space-y-6 m-0">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-800">
                        Submit Button Style
                      </h3>
                      <p className="text-slate-600 text-sm">
                        Customize your form's submit button
                      </p>
                    </div>
                    <Card className="bg-gradient-to-br from-white to-slate-50/50 border-0 shadow-lg">
                      <CardContent className="p-6 space-y-6">
                        <div className="space-y-3">
                          <Label className="text-sm font-medium text-slate-700">
                            Button Text
                          </Label>
                          <Input
                            value={config.submitButton.text}
                            onChange={(e) =>
                              updateSubmitButton({ text: e.target.value })
                            }
                            placeholder="Submit"
                            className="bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 text-slate-700"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <Label className="text-sm font-medium text-slate-700">
                              Button Style
                            </Label>
                            <Select
                              value={config.submitButton.type}
                              onValueChange={(value: SubmitButton["type"]) =>
                                updateSubmitButton({ type: value })
                              }
                            >
                              <SelectTrigger className="bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 text-slate-700">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="primary">Primary</SelectItem>
                                <SelectItem value="secondary">
                                  Secondary
                                </SelectItem>
                                <SelectItem value="outline">Outline</SelectItem>
                                <SelectItem value="gradient">
                                  Gradient
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-3">
                            <Label className="text-sm font-medium text-slate-700">
                              Custom Color
                            </Label>
                            <div className="flex gap-2">
                              <Input
                                type="color"
                                value={config.submitButton.color || "#3b82f6"}
                                onChange={(e) =>
                                  updateSubmitButton({ color: e.target.value })
                                }
                                className="w-16 h-10 p-1 bg-white border-slate-200"
                              />
                              <Input
                                value={config.submitButton.color || "#3b82f6"}
                                onChange={(e) =>
                                  updateSubmitButton({ color: e.target.value })
                                }
                                placeholder="#3b82f6"
                                className="flex-1 bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 text-slate-700"
                              />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="config" className="p-6 space-y-6 m-0">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-800">
                        Form Configuration
                      </h3>
                      <p className="text-slate-600 text-sm">
                        Set up form details and submission settings
                      </p>
                    </div>
                    <Card className="bg-gradient-to-br from-white to-slate-50/50 border-0 shadow-lg">
                      <CardContent className="p-6 space-y-6">
                        <div className="space-y-3">
                          <Label className="text-sm font-medium text-slate-700">
                            Form Name
                          </Label>
                          <Input
                            value={config.name}
                            onChange={(e) =>
                              updateConfig({ name: e.target.value })
                            }
                            placeholder="My Awesome Form"
                            className="bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 text-slate-700"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label className="text-sm font-medium text-slate-700">
                            Description
                          </Label>
                          <Textarea
                            value={config.description || ""}
                            onChange={(e) =>
                              updateConfig({ description: e.target.value })
                            }
                            placeholder="Describe what this form is for..."
                            className="bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 min-h-[100px] text-slate-700"
                          />
                        </div>
                        {/* Dynamic Menu dropdown */}
                        <div className="space-y-3">
                          <Label className="text-sm font-medium text-slate-700">
                            Menu Item
                          </Label>
                          <Select
                            value={selectedMenuItem}
                            onValueChange={(val) => setSelectedMenuItem(val)}
                          >
                            <SelectTrigger className="bg-white border-slate-200 text-slate-700">
                              <SelectValue placeholder="Select a menu item" />
                            </SelectTrigger>
                            <SelectContent>
                              {menuItems.map((item) => (
                                <SelectItem key={item.id} value={item.id}>
                                  {item.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        {/* Dynamic Instance dropdown */}
                        <div className="space-y-3">
                          <Label className="text-sm font-medium text-slate-700">
                            Instance
                          </Label>
                          <Select
                            value={selectedInstanceId}
                            onValueChange={(val) => setSelectedInstanceId(val)}
                            disabled={!selectedMenuItem}
                          >
                            <SelectTrigger className="bg-white border-slate-200 text-slate-700">
                              <SelectValue placeholder="Select an instance" />
                            </SelectTrigger>
                            <SelectContent>
                              {instances.length > 0 ? (
                                instances.map((ins) => (
                                  <SelectItem key={ins.id} value={ins.id}>
                                    {ins.name}
                                  </SelectItem>
                                ))
                              ) : (
                                // Radix requires SelectItem to have value!=empty, so message must not be a SelectItem
                                <div className="px-3 py-2 text-slate-500 text-sm select-none">
                                  {selectedMenuItem
                                    ? "No instance found"
                                    : "Select a menu item first"}
                                </div>
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                        <Separator className="bg-slate-200" />
                        <div className="space-y-6">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-medium text-slate-700">
                              Submission Settings
                            </h4>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="h-4 w-4 text-slate-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Configure where form data should be sent</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <div className="space-y-3">
                            <Label className="text-sm font-medium text-slate-700">
                              Callback URL
                            </Label>
                            <Input
                              value={config.submission.callbackUrl}
                              onChange={(e) =>
                                updateSubmission({
                                  callbackUrl: e.target.value,
                                })
                              }
                              placeholder="https://api.example.com/submit"
                              className="bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 text-slate-700"
                            />
                          </div>
                          <div className="space-y-3">
                            <Label className="text-sm font-medium text-slate-700">
                              HTTP Method
                            </Label>
                            <Select
                              value={config.submission.method}
                              onValueChange={(value: "POST" | "PUT") =>
                                updateSubmission({ method: value })
                              }
                            >
                              <SelectTrigger className="bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 text-slate-700">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="POST">POST</SelectItem>
                                <SelectItem value="PUT">PUT</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
            {/* Right: Preview */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
              <div className="p-6 border-b bg-gradient-to-r from-slate-50/80 to-blue-50/30 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg">
                    <Eye className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">
                      Live Preview
                    </h3>
                    <p className="text-slate-600 text-sm">
                      See your form in real-time
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6 overflow-auto h-full">
                <FormPreview config={config} mode="preview" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
