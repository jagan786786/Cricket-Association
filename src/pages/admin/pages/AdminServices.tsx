import { useEffect, useState } from "react";
import {
  PencilLine,
  Trash2,
  CheckCircle2,
  Ban,
  Info,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Star,
  Plus,
  Clock,
  Award,
  Zap,
  X
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const tabs = [
  { id: "all", label: "All Services" },
  { id: "category", label: "Category" },
  { id: "add", label: "Add Services" },
];

const API_BASE = "https://cricket-association-backend.onrender.com/api";

const AdminServices = () => {
  const location = useLocation();
  const menuItemId = location.state?.menuItemId;

  const [activeTab, setActiveTab] = useState("all");
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: "", icon: "" });
  const [editIndex, setEditIndex] = useState(null);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [editServiceId, setEditServiceId] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);

  // Enhanced filtering states
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // all, active, inactive
  const [popularFilter, setPopularFilter] = useState(""); // all, popular, not-popular
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [moduleData, setModuleData] = useState({
    name: "",
    description: "",
    price: "",
    duration: "Monthly",
    features: [],
    isPopular: false,
    category: "",
  });

  const [featureInput, setFeatureInput] = useState("");
  const [allServices, setAllServices] = useState([]);
  const [services, setServices] = useState([]);
  const [featureError, setFeatureError] = useState(""); // New state for feature validation messages

  useEffect(() => {
    if (menuItemId) {
      fetchCategories();
    }
  }, [menuItemId]);

  const fetchCategories = async () => {
    try {
      if (!menuItemId) return;
      const res = await fetch(`${API_BASE}/categories/menuItem/${menuItemId}`);
      const data = await res.json();
      setCategories(data.categories);
    } catch (err) {
      setError("Failed to load categories");
    }
  };

  const fetchModules = async () => {
    try {
      const res = await fetch(`${API_BASE}/modules`);
      const data = await res.json();
      setAllServices(data.modules || []);

      if (categories.length > 0) {
        const categoryIds = categories.map((cat) => cat._id);
        const filtered = data.modules.filter((mod) =>
          categoryIds.includes(mod.category?._id)
        );
        setServices(filtered);
      } else {
        setServices([]);
      }
    } catch (err) {
      console.error("Error fetching modules:", err);
    }
  };

  useEffect(() => {
    if (menuItemId) {
      fetchCategories();
    }
    fetchModules();
  }, [menuItemId]);

  useEffect(() => {
    fetchModules();
  }, [categories]);

  // Enhanced filtering and pagination logic
  const getFilteredServices = () => {
    let filtered = services.filter((service) => {
      // Search filter
      const matchesSearch =
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCategory = selectedCategoryFilter
        ? service.category?._id === selectedCategoryFilter
        : true;

      // Status filter
      const matchesStatus =
        statusFilter === ""
          ? true
          : statusFilter === "active"
          ? service.active
          : !service.active;

      // Popular filter
      const matchesPopular =
        popularFilter === ""
          ? true
          : popularFilter === "popular"
          ? service.isPopular
          : !service.isPopular;

      return (
        matchesSearch && matchesCategory && matchesStatus && matchesPopular
      );
    });

    // Sort filtered results
    filtered = filtered.sort((a, b) => {
      const nameA = a.category?.name?.toLowerCase() || "";
      const nameB = b.category?.name?.toLowerCase() || "";
      return sortOrder === "asc"
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });

    return filtered;
  };

  const getPaginatedServices = () => {
    const filtered = getFilteredServices();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filtered.slice(startIndex, endIndex);
  };

  const getTotalPages = () => {
    return Math.ceil(getFilteredServices().length / itemsPerPage);
  };

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    selectedCategoryFilter,
    statusFilter,
    popularFilter,
    sortOrder,
  ]);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    setError("");

    if (!newCategory.name.trim()) {
      setError("Category name cannot be empty.");
      return;
    }

    if (!menuItemId) {
      setError("Menu item ID is missing.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/category`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCategory.name,
          icon: newCategory.icon,
          menuItemId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setNewCategory({ name: "", icon: "" });
      fetchCategories();
      toast.success("Category added successfully!");
    } catch (err) {
      setError(err.message || "Failed to create category");
      toast.error(err.message || "Failed to create category");
    }
  };

  const handleEdit = (index) => {
    setNewCategory({
      name: categories[index].name,
      icon: categories[index].icon || "",
    });
    setEditIndex(index);
    setEditId(categories[index]._id);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    if (!newCategory.name.trim()) {
      setError("Category name cannot be empty.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/category/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCategory.name,
          icon: newCategory.icon,
        }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setEditIndex(null);
      setEditId(null);
      setNewCategory({ name: "", icon: "" });
      fetchCategories();
      toast.success("Category updated successfully!");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  const toggleCategoryActive = (index) => {
    const category = categories[index];
    const action = category.active ? "deactivate" : "activate";
    const activeCount = categories.filter((cat) => cat.active).length;

    if (!category.active && activeCount >= 4) {
      toast.error(
        "Only 4 active categories allowed. Please deactivate one first."
      );
      return;
    }

    toast.info(
      ({ closeToast }) => (
        <div className="flex flex-col">
          <span>
            Are you sure you want to <strong>{action}</strong>{" "}
            <span className="text-green-700 font-semibold">
              {category.name}
            </span>
            ?
          </span>
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => {
                confirmCategoryToggle(category._id);
                closeToast();
              }}
              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
            >
              Yes
            </button>
            <button
              onClick={closeToast}
              className="bg-gray-300 text-gray-800 px-3 py-1 rounded text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      }
    );
  };

  const confirmCategoryToggle = async (categoryId) => {
    try {
      const res = await fetch(
        `${API_BASE}/category/${categoryId}/toggle-active`,
        {
          method: "PATCH",
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      fetchCategories();
      toast.success("Category status updated successfully!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleAddService = async () => {
    // Clear previous feature error
    setFeatureError("");

    if (moduleData.features.length < 3) {
      setFeatureError("Please add at least 3 features.");
      return;
    }

    if (!menuItemId) {
      toast.error("Menu item ID is missing.");
      return;
    }

    if (!moduleData.category) {
      toast.error("Please select a category.");
      return;
    }

    const payload = {
      ...moduleData,
      menuItem: menuItemId,
    };

    const url = editServiceId
      ? `${API_BASE}/module/${editServiceId}`
      : `${API_BASE}/module`;
    const method = editServiceId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Operation failed");

      fetchModules();
      resetModuleForm();
      setActiveTab("all");
      toast.success(
        editServiceId
          ? "Service updated successfully!"
          : "Service added successfully!"
      );
    } catch (err) {
      toast.error(err.message);
    }
  };

  const resetModuleForm = () => {
    setModuleData({
      name: "",
      description: "",
      price: "",
      duration: "Monthly",
      features: [],
      isPopular: false,
      category: "",
    });
    setEditServiceId(null);
    setFeatureInput("");
    setFeatureError(""); // Clear feature error when resetting form
  };

  const handleEditService = (service) => {
    setModuleData({
      name: service.name,
      description: service.description,
      price: service.price,
      duration: service.duration,
      features: service.features,
      isPopular: service.isPopular,
      category: service.category?._id || "",
    });
    setEditServiceId(service._id);
    setFeatureError(""); // Clear any previous error when editing
    setActiveTab("add");
  };

  const addFeature = () => {
    const value = featureInput.trim();

    // Clear previous errors
    setFeatureError("");

    if (!value) {
      return;
    }

    // if (moduleData.features.length >= 5) {
    //   setFeatureError("Maximum 5 features can be added.");
    //   return;
    // }

    if (moduleData.features.includes(value)) {
      setFeatureError("This feature already exists.");
      return;
    }

    setModuleData({
      ...moduleData,
      features: [...moduleData.features, value],
    });
    setFeatureInput("");
  };

  const removeFeature = (index) => {
    const updated = moduleData.features.filter((_, i) => i !== index);
    setModuleData({ ...moduleData, features: updated });
    // Clear error when removing features
    if (featureError && updated.length <= 5) {
      setFeatureError("");
    }
  };

  const toggleServiceActive = (service) => {
    const action = service.active ? "deactivate" : "activate";

    toast.info(
      ({ closeToast }) => (
        <div className="flex flex-col">
          <span>
            Are you sure you want to <strong>{action}</strong>{" "}
            <span className="text-green-700 font-semibold">{service.name}</span>
            ?
          </span>
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => {
                confirmServiceToggle(service._id);
                closeToast();
              }}
              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
            >
              Yes
            </button>
            <button
              onClick={closeToast}
              className="bg-gray-300 text-gray-800 px-3 py-1 rounded text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      }
    );
  };

  const confirmServiceToggle = async (serviceId) => {
    try {
      const res = await fetch(`${API_BASE}/module/${serviceId}/toggle-active`, {
        method: "PATCH",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      fetchModules();
      toast.success("Service status updated successfully!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategoryFilter("");
    setStatusFilter("");
    setPopularFilter("");
    setSortOrder("asc");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-lime-50 p-6">
      <h1 className="text-3xl font-bold text-center text-green-800 mb-10">
        Services Management
      </h1>

      <ToastContainer />

      {/* Tabs */}
      <div className="grid grid-cols-3 max-w-4xl mx-auto gap-4 mb-10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full py-2 rounded-3xl text-md font-semibold transition-all duration-300 ${
              activeTab === tab.id
                ? "bg-green-600 text-white shadow-lg"
                : "bg-white text-gray-700 border hover:bg-green-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="max-w-7xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        {activeTab === "category" && (
          <div>
            <h2 className="text-2xl font-semibold text-green-800 mb-4">
              Category Management
            </h2>
            {error && <p className="text-red-500 mb-3">{error}</p>}
            <form
              onSubmit={editIndex !== null ? handleUpdate : handleAddCategory}
              className="flex flex-col md:flex-row md:items-end gap-4 mb-6"
            >
              {/* Category Name */}
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Category Name
                </label>
                <input
                  type="text"
                  placeholder="Enter category name"
                  value={newCategory.name}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, name: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-4 py-2"
                />
              </div>

              {/* Icon Input with Tooltip */}
              <div className="flex-1 relative">
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Icon
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Icon name (e.g., star, home)"
                    value={newCategory.icon}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, icon: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded px-4 py-2 pr-10"
                  />
                  {/* Info Icon Inside Input */}
                  <button
                    type="button"
                    onClick={() => setShowTooltip(!showTooltip)}
                    className="absolute right-2 top-2.5 text-gray-500 hover:text-gray-700"
                  >
                    <Info className="w-5 h-5" />
                  </button>

                  {/* Tooltip */}
                  {showTooltip && (
                    <div className="absolute z-50 top-14 right-0 w-72 bg-white border border-gray-300 shadow-xl rounded-xl p-4 text-sm text-gray-700 animate-fade-in">
                      <div className="flex items-start gap-2">
                        <Info className="w-5 h-5 text-purple-600 mt-0.5" />
                        <div>
                          <p className="font-semibold text-purple-700 text-base">
                            Helpful tip
                          </p>
                          <p className="text-gray-600 mt-1">
                            You can visit{" "}
                            <a
                              href="https://lucide.dev/icons/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline hover:text-blue-800"
                            >
                              this link
                            </a>{" "}
                            to find the icon name (e.g., <code>star</code>,{" "}
                            <code>home</code>).
                          </p>
                        </div>
                      </div>
                      {/* Tooltip arrow */}
                      <div className="absolute -top-2 right-6 w-3 h-3 bg-white rotate-45 border-l border-t border-gray-300"></div>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex-shrink-1">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-7 py-3 h-15 rounded hover:bg-green-700 transition text-sm"
                >
                  {editIndex !== null ? "Update" : "Add"}
                </button>
              </div>
            </form>

            <ul className="space-y-4">
              {categories.map((cat, index) => (
                <li
                  key={cat._id}
                  className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border"
                >
                  <div>
                    <p
                      className={`font-medium ${
                        cat.active
                          ? "text-green-800"
                          : "text-gray-400 line-through"
                      }`}
                    >
                      {cat.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Status: {cat.active ? "Active" : "Inactive"}
                    </p>
                  </div>
                  <div className="space-x-2 flex">
                    <button onClick={() => handleEdit(index)} title="Edit">
                      <PencilLine className="text-blue-600 w-5 h-5" />
                    </button>
                    <button
                      onClick={() => toggleCategoryActive(index)}
                      title={
                        cat.active
                          ? "Deactivate"
                          : categories.filter((c) => c.active).length >= 4
                          ? "Limit reached: Max 4 active categories"
                          : "Activate"
                      }
                      disabled={
                        !cat.active &&
                        categories.filter((c) => c.active).length >= 4
                      }
                      className={`${
                        !cat.active &&
                        categories.filter((c) => c.active).length >= 4
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {cat.active ? (
                        <Ban className="text-yellow-600 w-5 h-5" />
                      ) : (
                        <CheckCircle2 className="text-green-600 w-5 h-5" />
                      )}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Add Services Tab */}
        {activeTab === "add" && (
          <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-500 px-8 py-6">
              <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Zap className="w-6 h-6" />
                </div>
                {editServiceId ? "Edit Service" : "Create New Service"}
              </h2>
              <p className="text-green-100 mt-2">
                {editServiceId
                  ? "Update service details"
                  : "Add a new service to your platform"}
              </p>
            </div>

            {/* Form Content */}
            <div className="p-8 space-y-8">
              {/* Category Selection */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Award className="w-4 h-4 text-green-600" />
                  Service Category
                </label>
                <div className="relative">
                  <select
                    value={moduleData.category}
                    onChange={(e) =>
                      setModuleData({ ...moduleData, category: e.target.value })
                    }
                    className="w-full h-12 border-2 border-gray-200 rounded-xl px-4 bg-white text-gray-700 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 appearance-none cursor-pointer hover:border-gray-300"
                  >
                    <option value="">Choose a category...</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name} {cat.active ? "" : "(Inactive)"}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Service Name & Description */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    Service Name
                  </label>
                  <input
                    value={moduleData.name}
                    onChange={(e) =>
                      setModuleData({ ...moduleData, name: e.target.value })
                    }
                    placeholder="Enter service name..."
                    className="w-full h-12 border-2 border-gray-200 rounded-xl px-4 text-gray-700 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 hover:border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    Description
                  </label>
                  <input
                    value={moduleData.description}
                    onChange={(e) =>
                      setModuleData({
                        ...moduleData,
                        description: e.target.value,
                      })
                    }
                    placeholder="Brief service description..."
                    className="w-full h-12 border-2 border-gray-200 rounded-xl px-4 text-gray-700 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 hover:border-gray-300"
                  />
                </div>
              </div>

              {/* Price & Duration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <span className="text-green-600">₹</span>
                    Price
                  </label>
                  <input
                    value={moduleData.price}
                    onChange={(e) =>
                      setModuleData({ ...moduleData, price: e.target.value })
                    }
                    placeholder="0.00"
                    className="w-full h-12 border-2 border-gray-200 rounded-xl px-4 text-gray-700 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 hover:border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-green-600" />
                    Duration
                  </label>
                  <div className="relative">
                    <select
                      className="w-full h-12 border-2 border-gray-200 rounded-xl px-4 bg-white text-gray-700 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 appearance-none cursor-pointer hover:border-gray-300"
                      value={moduleData.duration}
                      onChange={(e) =>
                        setModuleData({
                          ...moduleData,
                          duration: e.target.value,
                        })
                      }
                    >
                      <option value="Monthly">Monthly</option>
                      <option value="Yearly">Yearly</option>
                      <option value="Day">Day</option>
                      <option value="hour">Hour</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features Section */}
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Service Features
                </label>

                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <input
                      value={featureInput}
                      onChange={(e) => setFeatureInput(e.target.value)}
                      placeholder="Add a service feature..."
                      className="w-full h-12 border-2 border-gray-200 rounded-xl px-4 pr-12 text-gray-700 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 hover:border-gray-300"
                      onKeyPress={(e) => e.key === "Enter" && addFeature()}
                    />
                  </div>
                  <button
                    type="button"
                    className="h-12 px-6 bg-gradient-to-r from-green-600 to-emerald-500 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-600 focus:ring-4 focus:ring-green-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                    onClick={addFeature}
                    disabled={!featureInput.trim()}
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>

                {/* Feature Error Message */}
                {featureError && (
                  <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                    <X className="w-4 h-4" />
                    {featureError}
                  </div>
                )}

                {/* Feature Tags */}
                <div className="flex flex-wrap gap-3 mt-4">
                  {moduleData.features.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-gradient-to-r from-green-100 to-emerald-50 text-green-800 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 border border-green-200 hover:shadow-md transition-all duration-200"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full p-1 transition-all duration-200"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                {/* Info messages */}
                {moduleData.features.length === 5 && (
                  <div className="flex items-center gap-2 text-green-600 text-sm bg-green-50 p-3 rounded-lg">
                    <CheckCircle2 className="w-4 h-4" />
                    Maximum of 5 features added
                  </div>
                )}
              </div>

              {/* Popular Toggle */}
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={moduleData.isPopular}
                    onChange={(e) =>
                      setModuleData({
                        ...moduleData,
                        isPopular: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-semibold text-gray-800">
                    Mark as Most Popular
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleAddService}
                className="w-full h-14 bg-gradient-to-r from-green-600 to-emerald-500 text-white font-bold text-lg rounded-xl hover:from-green-700 hover:to-emerald-600 focus:ring-4 focus:ring-green-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                {editServiceId !== null ? "Update Service" : "Create Service"}
              </button>
            </div>
          </div>
        )}

        {/* All Services Tab with Enhanced Filters */}
        {activeTab === "all" && (
          <div>
            <h2 className="text-2xl font-semibold text-green-800 mb-6">
              All Services
            </h2>

            {/* Advanced Filters */}
            <div className="bg-gray-50 p-6 rounded-lg mb-6 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-medium text-green-800">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="ml-auto text-sm text-red-600 hover:text-red-800 underline"
                >
                  Clear All Filters
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search services..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-300"
                  />
                </div>

                {/* Category Filter */}
                <div>
                  <select
                    value={selectedCategoryFilter}
                    onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-300"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Filter */}
                <div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-300"
                  >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                {/* Popular Filter */}
                <div>
                  <select
                    value={popularFilter}
                    onChange={(e) => setPopularFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-300"
                  >
                    <option value="">All Services</option>
                    <option value="popular">Popular Only</option>
                    <option value="not-popular">Not Popular</option>
                  </select>
                </div>

                {/* Sort */}
                <div>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-300"
                  >
                    <option value="asc">Sort A → Z</option>
                    <option value="desc">Sort Z → A</option>
                  </select>
                </div>
              </div>

              {/* Results Summary */}
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>
                  Showing {getPaginatedServices().length} of{" "}
                  {getFilteredServices().length} services
                </span>
                <span>
                  Page {currentPage} of {getTotalPages() || 1}
                </span>
              </div>
            </div>

            {/* Services Table */}
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="w-full min-w-[800px] table-auto">
                <thead className="bg-green-100">
                  <tr className="text-left text-sm text-green-800">
                    <th className="p-4 font-semibold">Category</th>
                    <th className="p-4 font-semibold">Name</th>
                    <th className="p-4 font-semibold">Price</th>
                    <th className="p-4 font-semibold">Duration</th>
                    <th className="p-4 font-semibold">Features</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold">Popular</th>
                    <th className="p-4 font-semibold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {getPaginatedServices().map((srv, index) => (
                    <tr
                      key={srv._id}
                      className="border-b hover:bg-green-50 transition-colors"
                    >
                      <td className="p-4">
                        <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                          {srv.category?.name || "N/A"}
                        </span>
                      </td>
                      <td className="p-4 font-medium">{srv.name}</td>
                      <td className="p-4 font-semibold text-green-600">
                        ₹{srv.price}
                      </td>
                      <td className="p-4">{srv.duration}</td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {srv.features.slice(0, 2).map((feature, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                            >
                              {feature}
                            </span>
                          ))}
                          {srv.features.length > 2 && (
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                              +{srv.features.length - 2} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 text-xs rounded-full font-medium ${
                            srv.active
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {srv.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="p-4">
                        {srv.isPopular ? (
                          <span className="px-3 py-1 text-xs rounded-full bg-orange-100 text-orange-800 font-medium">
                            Popular
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs">—</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => handleEditService(srv)}
                            title="Edit Service"
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            <PencilLine className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => toggleServiceActive(srv)}
                            title={
                              srv.active
                                ? "Deactivate Service"
                                : "Activate Service"
                            }
                            className="transition-colors"
                          >
                            {srv.active ? (
                              <Ban className="text-yellow-600 hover:text-yellow-800 w-4 h-4" />
                            ) : (
                              <CheckCircle2 className="text-green-600 hover:text-green-800 w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {getTotalPages() > 1 && (
              <div className="flex justify-center items-center gap-4 mt-6">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-4 py-2 text-sm border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                <div className="flex gap-2">
                  {Array.from({ length: getTotalPages() }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 text-sm rounded-lg ${
                          page === currentPage
                            ? "bg-green-600 text-white"
                            : "border hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage(Math.min(getTotalPages(), currentPage + 1))
                  }
                  disabled={currentPage === getTotalPages()}
                  className="flex items-center gap-2 px-4 py-2 text-sm border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* No Results */}
            {getFilteredServices().length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  No services found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search criteria or clearing the filters.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminServices;
