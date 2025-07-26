import type React from "react"

import { useState } from "react"
import type { FormConfig, FormField as FormFieldType, FormData } from "../../types/form-builder"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { CalendarIcon, Download, Eye, Sparkles, Code, ExternalLink } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface FormPreviewProps {
  config: FormConfig
  mode?: "preview" | "live"
}

function FormField({
  field,
  value,
  onChange,
}: {
  field: FormFieldType
  value: string | number | boolean | File | Date | undefined
  onChange: (value: string | number | boolean | File | Date | undefined) => void
}) {
  const [date, setDate] = useState<Date>()
  const [isFocused, setIsFocused] = useState(false)

  const renderField = () => {
    const baseClasses =
      "transition-all duration-200 focus:shadow-lg focus:shadow-blue-500/20 focus:border-blue-400 focus:ring-blue-400/20"

    switch (field.fieldType) {
      case "text":
      case "email":
      case "password":
        return (
          <Input
            type={field.fieldType}
            placeholder={field.placeholder}
            value={typeof value === "string" || typeof value === "number" ? value : ""}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            required={field.required}
            className={cn(baseClasses, "bg-white/80 backdrop-blur-sm border-slate-200")}
          />
        )

      case "number":
        return (
          <Input
            type="number"
            placeholder={field.placeholder}
            value={typeof value === "string" || typeof value === "number" ? value : ""}
            onChange={(e) => onChange(Number(e.target.value))}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            required={field.required}
            className={cn(baseClasses, "bg-white/80 backdrop-blur-sm border-slate-200")}
          />
        )

      case "textarea":
        return (
          <Textarea
            placeholder={field.placeholder}
            value={typeof value === "string" || typeof value === "number" ? value : ""}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            required={field.required}
            className={cn(baseClasses, "bg-white/80 backdrop-blur-sm border-slate-200 min-h-[120px] resize-none")}
          />
        )

      case "select":
        return (
          <Select
            value={typeof value === "string" ? value : value !== undefined && value !== null ? String(value) : ""}
            onValueChange={(val) => onChange(val)}
          >
            <SelectTrigger className={cn(baseClasses, "bg-white/80 backdrop-blur-sm border-slate-200")}>
              <SelectValue placeholder={field.placeholder || "Select an option"} />
            </SelectTrigger>
            <SelectContent className="bg-white/95 backdrop-blur-sm">
              {field.options?.map((option, index) => (
                <SelectItem key={index} value={option} className="hover:bg-blue-50">
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case "checkbox":
        return (
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-50/50 border border-slate-200 hover:bg-slate-50 transition-colors">
            <Checkbox
              id={field.id}
              checked={typeof value === "boolean" ? value : false}
              onCheckedChange={onChange}
              className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
            />
            <Label htmlFor={field.id} className="text-sm font-normal cursor-pointer">
              {field.placeholder || "Check this box"}
            </Label>
          </div>
        )

      case "radio":
        return (
          <RadioGroup
            value={typeof value === "string" ? value : value !== undefined && value !== null ? String(value) : ""}
            onValueChange={onChange}
            className="space-y-3"
          >
            {field.options?.map((option, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 rounded-lg bg-slate-50/50 border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                <RadioGroupItem
                  value={option}
                  id={`${field.id}-${index}`}
                  className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                />
                <Label htmlFor={`${field.id}-${index}`} className="text-sm font-normal cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )

      case "date":
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  baseClasses,
                  "w-full justify-start text-left font-normal bg-white/80 backdrop-blur-sm border-slate-200",
                  !date && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>{field.placeholder || "Pick a date"}</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white/95 backdrop-blur-sm" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(selectedDate) => {
                  setDate(selectedDate)
                  onChange(selectedDate)
                }}
                initialFocus
                className="p-3"
              />
            </PopoverContent>
          </Popover>
        )

      case "file":
        return (
          <div className="relative">
            <Input
              type="file"
              onChange={(e) => onChange(e.target.files?.[0])}
              required={field.required}
              className={cn(
                baseClasses,
                "bg-white/80 backdrop-blur-sm border-slate-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100",
              )}
            />
          </div>
        )

      default:
        return (
          <Input
            placeholder={field.placeholder}
            value={typeof value === "string" || typeof value === "number" ? value : ""}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
            className={cn(baseClasses, "bg-white/80 backdrop-blur-sm border-slate-200")}
          />
        )
    }
  }

  return (
    <div className="space-y-3 group">
      <Label htmlFor={field.id} className="text-sm font-medium text-slate-700 flex items-center gap-2">
        {field.label}
        {field.required && <span className="text-red-500 text-xs bg-red-50 px-2 py-0.5 rounded-full">Required</span>}
      </Label>
      <div className={cn("transition-all duration-200", isFocused && "transform scale-[1.02]")}>{renderField()}</div>
      {field.validation.length > 0 && (
        <div className="flex flex-wrap gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {field.validation.map((rule, index) => (
            <Badge key={index} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
              {rule.type}
              {rule.value && `: ${rule.value}`}
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}

export function FormPreview({ config, mode = "preview" }: FormPreviewProps) {
  const [formData, setFormData] = useState<FormData>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showCode, setShowCode] = useState(false)

  // Add safety checks for config
  if (!config) {
    return (
      <Card className="bg-gradient-to-br from-white via-blue-50/20 to-indigo-50/10 border-0 shadow-2xl max-w-4xl mx-auto overflow-hidden">
        <CardContent className="p-8 text-center">
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-slate-100 to-blue-100 rounded-full flex items-center justify-center">
              <Eye className="h-8 w-8 text-slate-400" />
            </div>
            <div>
              <h3 className="text-xl font-medium text-slate-600 mb-2">No form configuration</h3>
              <p className="text-slate-500">Please configure your form to see the preview.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Ensure config has required properties with defaults
  const safeConfig = {
    name: config.name || "Untitled Form",
    description: config.description || "",
    fields: config.fields || [],
    layout: config.layout || { columns: 2, fieldsPerRow: 2, spacing: "md" },
    submitButton: config.submitButton || { type: "primary", text: "Submit" },
    submission: config.submission || { callbackUrl: "", method: "POST" },
  }

  const updateFormData = (fieldId: string, value: string | number | boolean | File | Date | undefined) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === "preview") return

    setIsSubmitting(true)
    try {
      const response = await fetch(safeConfig.submission.callbackUrl, {
        method: safeConfig.submission.method,
        headers: {
          "Content-Type": "application/json",
          ...safeConfig.submission.headers,
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        console.log("Form submitted successfully")
        setFormData({})
      } else {
        console.error("Form submission failed")
      }
    } catch (error) {
      console.error("Form submission error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const downloadSchema = () => {
    const schema = JSON.stringify(safeConfig, null, 2)
    const blob = new Blob([schema], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${safeConfig.name.toLowerCase().replace(/\s+/g, "-")}-schema.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Group fields by row with safety check
  const fieldsByRow = (safeConfig.fields || []).reduce(
    (acc, field) => {
      const row = field.position?.row || 0
      if (!acc[row]) acc[row] = []
      acc[row].push(field)
      return acc
    },
    {} as Record<number, FormFieldType[]>,
  )

  const sortedRows = Object.keys(fieldsByRow)
    .map(Number)
    .sort((a, b) => a - b)

  const getButtonVariant = () => {
    switch (safeConfig.submitButton.type) {
      case "gradient":
        return "default"
      case "secondary":
        return "secondary"
      case "outline":
        return "outline"
      default:
        return "default"
    }
  }

  const getButtonClasses = () => {
    const baseClasses =
      "w-full text-lg py-6 font-semibold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"

    switch (safeConfig.submitButton.type) {
      case "gradient":
        return `${baseClasses} bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl`
      case "primary":
        return `${baseClasses} bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl`
      default:
        return baseClasses
    }
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <Card className="bg-gradient-to-br from-white via-blue-50/20 to-indigo-50/10 border-0 shadow-2xl max-w-4xl mx-auto overflow-hidden">
          <CardHeader className="border-b bg-gradient-to-r from-slate-50/80 via-blue-50/50 to-indigo-50/30 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-slate-800">{safeConfig.name}</CardTitle>
                    {safeConfig.description && <p className="text-slate-600 mt-1">{safeConfig.description}</p>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {mode === "preview" && (
                  <>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        {/* <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowCode(!showCode)}
                          className="bg-white/80 backdrop-blur-sm"
                        >
                          <Code className="h-4 w-4 mr-2" />
                          {showCode ? "Hide" : "Show"} Data
                        </Button> */}
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Toggle form data preview</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={downloadSchema}
                          className="bg-white/80 backdrop-blur-sm"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Download form schema</p>
                      </TooltipContent>
                    </Tooltip>

                    <Badge variant="secondary" className="gap-2 bg-green-50 text-green-700 border-green-200">
                      <Eye className="h-3 w-3" />
                      Preview Mode
                    </Badge>
                  </>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {safeConfig.fields.length === 0 ? (
                <div className="text-center py-16 space-y-4">
                  <div className="mx-auto w-20 h-20 bg-gradient-to-r from-slate-100 to-blue-100 rounded-full flex items-center justify-center">
                    <Eye className="h-10 w-10 text-slate-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-slate-600 mb-2">No fields to preview</h3>
                    <p className="text-slate-500">Add some fields to see your form come to life!</p>
                  </div>
                </div>
              ) : (
                <>
                  {sortedRows.map((rowIndex) => {
                    const rowFields = fieldsByRow[rowIndex].sort(
                      (a, b) => (a.position?.column || 0) - (b.position?.column || 0),
                    )
                    const gridCols =
                      safeConfig.layout.columns === 3 ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1 md:grid-cols-2"
                    const spacing =
                      safeConfig.layout.spacing === "lg"
                        ? "gap-8"
                        : safeConfig.layout.spacing === "sm"
                          ? "gap-4"
                          : "gap-6"

                    return (
                      <div key={rowIndex} className={`grid ${gridCols} ${spacing}`}>
                        {rowFields.map((field, index) => (
                          <div
                            key={field.id}
                            className="animate-in slide-in-from-bottom-2 duration-300"
                            style={{ animationDelay: `${index * 100}ms` }}
                          >
                            <FormField
                              field={field}
                              value={formData[field.id]}
                              onChange={(value) => updateFormData(field.id, value)}
                            />
                          </div>
                        ))}
                      </div>
                    )
                  })}

                  <div className="pt-8 border-t border-slate-200">
                    <Button
                      type="submit"
                      disabled={isSubmitting || mode === "preview"}
                      className={getButtonClasses()}
                      style={
                        safeConfig.submitButton.color ? { backgroundColor: safeConfig.submitButton.color } : undefined
                      }
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Submitting...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          {safeConfig.submitButton.type === "gradient" && <Sparkles className="h-5 w-5" />}
                          {safeConfig.submitButton.text}
                          {mode === "live" && <ExternalLink className="h-4 w-4" />}
                        </div>
                      )}
                    </Button>
                  </div>
                </>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Enhanced Data Preview */}
        {mode === "preview" && showCode && (
          <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-0 shadow-2xl max-w-4xl mx-auto text-white overflow-hidden">
            <CardHeader className="border-b border-slate-700 bg-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg">
                  <Code className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">Form Data Preview</CardTitle>
                  <p className="text-slate-400 text-sm">Real-time form data as you type</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <pre className="text-sm overflow-auto bg-slate-900/50 p-4 rounded-lg border border-slate-700 font-mono">
                {JSON.stringify(formData, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </TooltipProvider>
  )
}
