import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function FormPreview() {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await axios.get(
          `https://cricket-association-backend.onrender.com/api/form/${id}`
        );
        console.log(res.data);
        setForm(res.data);
      } catch (err) {
        console.error("Failed to fetch form:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [id]);

  if (loading) return <p className="p-4">Loading form...</p>;
  if (!form) return <p className="p-4">Form not found.</p>;

  // Layout settings
  const columns = form.layout?.columns || 2;
  const spacingMap = {
    small: "gap-2",
    medium: "gap-4",
    large: "gap-6",
  };
  const spacing = spacingMap[form.layout?.spacing || "medium"];

  const renderField = (field) => {
    const key = field._id;
    const positionStyle = `row-start-${field.position?.row || 1} col-start-${
      field.position?.column || 1
    }`;
    const spanClass =
      field.fieldType === "textarea" ? `col-span-${columns}` : "col-span-1";

    switch (field.fieldType) {
      case "text":
      case "email":
      case "number":
      case "date":
      case "time":
        return (
          <div key={key} className={`${spanClass} ${positionStyle} space-y-1`}>
            <Label>{field.label}</Label>
            <Input
              type={field.fieldType}
              placeholder={field.placeholder}
              defaultValue={field.defaultValue}
            />
          </div>
        );
      case "textarea":
        return (
          <div key={key} className={`${spanClass} ${positionStyle} space-y-1`}>
            <Label>{field.label}</Label>
            <Textarea placeholder={field.placeholder} />
          </div>
        );
      case "select":
        return (
          <div key={key} className={`col-span-1 ${positionStyle} space-y-1`}>
            <Label>{field.label}</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder={field.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((opt, idx) => (
                  <SelectItem key={idx} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      case "checkbox":
        return (
          <div
            key={key}
            className={`col-span-1 ${positionStyle} flex items-center space-x-2`}
          >
            <Checkbox id={field.name} />
            <Label htmlFor={field.name}>{field.label}</Label>
          </div>
        );
      default:
        return null;
    }
  };

  const getButtonClass = () => {
    const base = "px-6 py-2 rounded font-medium";
    const btn = form.submitButton || {};

    switch (btn.type) {
      case "primary":
      case "secondary":
        return `${base} text-white hover:opacity-90`;
      case "outline":
        return `${base} bg-transparent`;
      case "gradient":
        return `${base} text-white bg-gradient-to-r from-indigo-500 to-purple-600`;
      default:
        return `${base} text-white bg-blue-600`;
    }
  };

  const getButtonStyle = () => {
    const btn = form.submitButton || {};
    if (!btn.color) return {};

    if (["primary", "secondary"].includes(btn.type)) {
      return {
        backgroundColor: btn.color,
      };
    }

    if (btn.type === "outline") {
      return {
        borderColor: btn.color,
        color: btn.color,
        borderWidth: "1px",
        borderStyle: "solid",
      };
    }

    return {};
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{form.name}</CardTitle>
          <CardDescription>{form.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className={`grid grid-cols-${columns} ${spacing}`}
            style={{ gridAutoRows: "minmax(min-content, max-content)" }}
          >
            {form.fields?.map((field) => renderField(field))}
          </form>

          <div className="mt-6 text-right">
            <button
              type="submit"
              className={getButtonClass()}
              style={getButtonStyle()}
            >
              {form.submitButton?.text || "Submit"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
