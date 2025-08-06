import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Loader2, CheckCircle, AlertCircle, FileText } from "lucide-react";
import clsx from "clsx";

const API_BASE = "https://cricket-association-backend.onrender.com/api";

const spacingMap = {
  small: "gap-6",
  medium: "gap-8",
  large: "gap-12",
};

const columnClassMap = {
  1: "grid-cols-1",
  2: "grid-cols-1 lg:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
};

const RegisterForm = () => {
  const { menuItemName, instanceId } = useParams();
  const [form, setForm] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loadForm = async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/forms`);
        const forms = data.filter(
          (f) =>
            f.menuItemName === menuItemName &&
            f.instanceName &&
            f.formId &&
            f.isActive
        );

        const instanceForm = forms.find(
          (f) =>
            f.formId &&
            f.formId._id &&
            f.instanceName &&
            f.formId.fields.length > 0 &&
            f.formId._id
        );

        if (!instanceForm) {
          setMessage("No form linked for this item.");
          setLoading(false);
          return;
        }

        const { data: fullForm } = await axios.get(
          `${API_BASE}/form/${instanceForm.formId._id}`
        );
        setForm(fullForm);

        const initialData = {};
        fullForm.fields.forEach((field) => {
          initialData[field.name] =
            field.defaultValue || (field.fieldType === "checkbox" ? false : "");
        });
        setFormData(initialData);

        setLoading(false);
      } catch (err) {
        console.error("Form load error", err);
        setMessage("Error loading form.");
        setLoading(false);
      }
    };

    loadForm();
  }, [menuItemName, instanceId]);

  const validateField = (field, value) => {
    if (
      field.required &&
      (!value || (typeof value === "string" && !value.trim()))
    ) {
      return `${field.label} is required`;
    }

    if (field.fieldType === "email" && value && !/\S+@\S+\.\S+/.test(value)) {
      return "Please enter a valid email address";
    }

    return null;
  };

  const handleChange = (e, field) => {
    const value =
      field.fieldType === "checkbox" ? e.target.checked : e.target.value;

    setFormData((prev) => ({ ...prev, [field.name]: value }));

    // Clear error when user starts typing
    if (errors[field.name]) {
      setErrors((prev) => ({ ...prev, [field.name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {};
    form.fields.forEach((field) => {
      const error = validateField(field, formData[field.name]);
      if (error) {
        newErrors[field.name] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await axios.post(
        `http://localhost:4000/api/submission/${form._id}`,
        formData
      );

      setSubmitSuccess(true);
      setMessage(data.message || "Form submitted successfully!");

      setTimeout(() => {
        setSubmitSuccess(false);
        setMessage("");
      }, 3000);

      // Optionally reset the form
      const resetData = {};
      form.fields.forEach((field) => {
        resetData[field.name] =
          field.defaultValue || (field.fieldType === "checkbox" ? false : "");
      });
      setFormData(resetData);
    } catch (err) {
      console.error("Form submit error", err);
      alert("Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl opacity-20 animate-pulse" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">
              Loading Form
            </h3>
            <p className="text-gray-600">
              Please wait while we prepare your form...
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (message) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-6 max-w-md mx-auto px-6">
            <div className="w-20 h-20 mx-auto bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
              <AlertCircle className="w-10 h-10 text-white" />
            </div>
            <div className="space-y-2">
              
              <p className="text-gray-600 leading-relaxed">{message}</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const layoutCols = form.layout?.columns || 2;
  const spacing = spacingMap[form.layout?.spacing] || spacingMap.medium;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navigation />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10" />
        <div className="relative max-w-4xl mx-auto px-6 pt-16 pb-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-600 to-indigo-500 rounded-2xl mb-6 shadow-lg">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            {form?.name}
          </h1>
          {form?.description && (
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {form.description}
            </p>
          )}
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
          <div className="p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-12">
              {/* Form Fields Grid */}
              <div
                className={clsx(
                  "grid",
                  columnClassMap[layoutCols],
                  spacing,
                  "w-full"
                )}
              >
                {form.fields
                  .sort((a, b) => {
                    if (a.position?.row !== b.position?.row) {
                      return a.position?.row - b.position?.row;
                    }
                    return (
                      (a.position?.column || 0) - (b.position?.column || 0)
                    );
                  })
                  .map((field) => {
                    const commonProps = {
                      id: field.name,
                      name: field.name,
                      required: field.required,
                      value: formData[field.name],
                      onChange: (e) => handleChange(e, field),
                      placeholder: field.placeholder || field.label || "",
                    };

                    const hasError = errors[field.name];

                    const label = (
                      <label
                        htmlFor={field.name}
                        className="block text-sm font-semibold mb-3 text-gray-800 tracking-wide"
                      >
                        {field.label}
                        {field.required && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </label>
                    );

                    const errorMessage = hasError && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {hasError}
                      </p>
                    );

                    const wrapper = (children) => (
                      <div key={field._id} className="group">
                        <div className="transform transition-transform duration-200 hover:scale-[1.02]">
                          {label}
                          <div className="relative">
                            {children}
                            {hasError && (
                              <div className="absolute inset-0 pointer-events-none border-2 border-red-300 rounded-xl animate-pulse" />
                            )}
                          </div>
                          {errorMessage}
                        </div>
                      </div>
                    );

                    switch (field.fieldType) {
                      case "text":
                      case "email":
                      case "number":
                      case "date":
                      case "time":
                        return wrapper(
                          <Input
                            type={field.fieldType}
                            {...commonProps}
                            className={clsx(
                              "h-12 px-4 text-base rounded-xl border-2 transition-all duration-200",
                              "bg-white/50 backdrop-blur-sm",
                              "border-gray-200",
                              "focus:ring-4 focus:ring-blue-100",
                              "placeholder:text-gray-400",
                              hasError &&
                                "border-red-300 focus:border-red-500 focus:ring-red-100"
                            )}
                          />
                        );

                      case "textarea":
                        return wrapper(
                          <Textarea
                            {...commonProps}
                            rows={4}
                            className={clsx(
                              "p-4 text-base rounded-xl border-2 transition-all duration-200",
                              "bg-white/50 backdrop-blur-sm resize-none",
                              "border-gray-200 hover:border-blue-300 focus:border-blue-500",
                              "focus:ring-4 focus:ring-blue-100",
                              "placeholder:text-gray-400",
                              hasError &&
                                "border-red-300 focus:border-red-500 focus:ring-red-100"
                            )}
                          />
                        );

                      case "select":
                        return wrapper(
                          <select
                            {...commonProps}
                            className={clsx(
                              "h-12 px-4 text-base rounded-xl border-2 transition-all duration-200",
                              "bg-white/50 backdrop-blur-sm cursor-pointer",
                              "border-gray-200 hover:border-blue-300 focus:border-blue-500",
                              "focus:ring-4 focus:ring-blue-100 focus:outline-none",
                              hasError &&
                                "border-red-300 focus:border-red-500 focus:ring-red-100"
                            )}
                          >
                            <option value="">Select an option</option>
                            {field.options.map((opt, idx) => (
                              <option key={idx} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        );

                      case "checkbox":
                        return (
                          <div key={field._id} className="group">
                            <div className="flex items-start space-x-4 p-4 rounded-xl bg-white/30 border-2 border-gray-200 hover:border-blue-300 transition-all duration-200 hover:bg-white/50">
                              <div className="relative flex items-center justify-center mt-1">
                                <input
                                  type="checkbox"
                                  id={field.name}
                                  name={field.name}
                                  checked={formData[field.name]}
                                  onChange={(e) => handleChange(e, field)}
                                  className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded-md focus:ring-blue-500 focus:ring-2 transition-all duration-200"
                                />
                              </div>
                              <label
                                htmlFor={field.name}
                                className="text-base text-gray-800 cursor-pointer select-none leading-relaxed"
                              >
                                {field.label}
                                {field.required && (
                                  <span className="text-red-500 ml-1">*</span>
                                )}
                              </label>
                            </div>
                            {errors[field.name] && (
                              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" />
                                {errors[field.name]}
                              </p>
                            )}
                          </div>
                        );

                      default:
                        return null;
                    }
                  })}
              </div>

              {/* Submit Button */}
              <div className="text-center pt-8">
                <Button
                  type="submit"
                  variant={form.submitButton?.type || "default"}
                  className="rounded-xl px-6 py-3 text-white"
                  style={{
                    backgroundColor: form.submitButton?.color || "#2563eb", // fallback to Tailwind's blue-600
                  }}
                >
                  {form.submitButton?.text || "Submit"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RegisterForm;
