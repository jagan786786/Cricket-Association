import { useEffect, useState } from "react";
import { PencilLine, Trash2, CheckCircle2, Ban, Info } from "lucide-react";
import { useLocation } from "react-router-dom";

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
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); // or "desc"

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
    } catch (err) {
      setError(err.message || "Failed to create category");
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
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleActive = async (index) => {
    const category = categories[index];

    const action = category.active ? "deactivate" : "activate";
    if (!window.confirm(`Are you sure you want to ${action} this category?`))
      return;

    const activeCount = categories.filter((cat) => cat.active).length;

    if (!category.active && activeCount >= 4) {
      setError(
        "Only 4 active categories allowed. Please deactivate one first."
      );
      return;
    }

    try {
      const res = await fetch(
        `${API_BASE}/category/${category._id}/toggle-active`,
        { method: "PATCH" }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      fetchCategories();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddService = async () => {
    if (moduleData.features.length < 3) {
      alert("Please add at least 3 features.");
      return;
    }

    if (!menuItemId) {
      alert("Menu item ID is missing.");
      return;
    }

    if (!moduleData.category) {
      alert("Please select a category.");
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
    } catch (err) {
      alert(err.message);
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
  };

  const handleEditService = (index) => {
    const module = services[index];
    setModuleData({
      name: module.name,
      description: module.description,
      price: module.price,
      duration: module.duration,
      features: module.features,
      isPopular: module.isPopular,
      category: module.category?._id || "",
    });
    setEditServiceId(module._id);
    setActiveTab("add");
  };

  const handleToggleServiceActive = async (index) => {
    const module = services[index];
    const action = module.active ? "deactivate" : "activate";
    if (!window.confirm(`Are you sure you want to ${action} this service?`))
      return;

    try {
      const res = await fetch(
        `${API_BASE}/module/${module._id}/toggle-active`,
        {
          method: "PATCH",
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      fetchModules();
    } catch (err) {
      alert("Error toggling service status: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-lime-50 p-6">
      <h1 className="text-3xl font-bold text-center text-green-800 mb-10">
        Services Management
      </h1>

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

      <div className="max-w-6xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
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
                    {/* <button onClick={() => handleDelete(index)} title="Delete">
                      <Trash2 className="text-red-600 w-5 h-5" />
                    </button> */}
                    <button
                      onClick={() => toggleActive(index)}
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
          <div>
            <h2 className="text-2xl font-semibold text-green-800 mb-4">
              Add Services
            </h2>
            <div className="space-y-4">
              <div>
                <label>Category</label>
                <select
                  value={moduleData.category}
                  onChange={(e) =>
                    setModuleData({ ...moduleData, category: e.target.value })
                  }
                  className="w-full h-10 border rounded px-2"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name} {cat.active ? "" : "(Inactive)"}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label>Module Name</label>
                <input
                  value={moduleData.name}
                  onChange={(e) =>
                    setModuleData({ ...moduleData, name: e.target.value })
                  }
                  className="w-full border rounded px-4 py-2"
                />
              </div>

              <div>
                <label>Description</label>
                <input
                  value={moduleData.description}
                  onChange={(e) =>
                    setModuleData({
                      ...moduleData,
                      description: e.target.value,
                    })
                  }
                  className="w-full border rounded px-4 py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label>Price</label>
                  <input
                    value={moduleData.price}
                    onChange={(e) =>
                      setModuleData({ ...moduleData, price: e.target.value })
                    }
                    className="w-full border rounded px-4 py-2"
                  />
                </div>
                <div>
                  <label>Duration</label>
                  <select
                    className="w-full h-10 border rounded px-2"
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
                    <option value="hour">hour</option>
                  </select>
                </div>
              </div>

              <div>
                <label>Features</label>
                <div className="flex gap-2">
                  <input
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    placeholder="Enter a feature"
                    disabled={moduleData.features.length >= 5}
                    className="w-full border rounded px-4 py-2"
                  />
                  <button
                    type="button"
                    className="bg-green-600 text-white px-4 rounded"
                    onClick={() => {
                      const value = featureInput.trim();
                      if (
                        value &&
                        moduleData.features.length < 5 &&
                        !moduleData.features.includes(value)
                      ) {
                        setModuleData({
                          ...moduleData,
                          features: [...moduleData.features, value],
                        });
                        setFeatureInput("");
                      }
                    }}
                    disabled={
                      !featureInput.trim() || moduleData.features.length >= 5
                    }
                  >
                    Add
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {moduleData.features.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => {
                          const updated = moduleData.features.filter(
                            (_, i) => i !== index
                          );
                          setModuleData({ ...moduleData, features: updated });
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                {moduleData.features.length < 3 && (
                  <p className="text-sm text-red-500 mt-1">
                    Add at least 3 features
                  </p>
                )}
                {moduleData.features.length === 5 && (
                  <p className="text-sm text-green-600 mt-1">
                    Maximum of 5 features added
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={moduleData.isPopular}
                  onChange={(e) =>
                    setModuleData({
                      ...moduleData,
                      isPopular: e.target.checked,
                    })
                  }
                />
                <label>Most Popular</label>
              </div>

              <button
                onClick={handleAddService}
                className="bg-green-700 text-white w-full py-2 rounded"
              >
                {editServiceId !== null ? "Update Service" : "Save"}
              </button>
            </div>
          </div>
        )}

        {/* All Services Tab */}
        {activeTab === "all" && (
          <div>
            <h2 className="text-2xl font-semibold text-green-800 mb-4">
              All Services
            </h2>
            <div className="overflow-x-auto">
              <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                <div>
                  <label className="mr-2 text-sm font-medium text-gray-700">
                    Filter by Category:
                  </label>
                  <select
                    value={selectedCategoryFilter}
                    onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="">All</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mr-2 text-sm font-medium text-gray-700">
                    Sort by Category:
                  </label>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="asc">A → Z</option>
                    <option value="desc">Z → A</option>
                  </select>
                </div>
              </div>

              <table className="w-full min-w-[800px] table-auto border border-gray-300 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-green-100 text-left text-sm text-green-800">
                    <th className="p-3 border border-gray-200">Category</th>
                    {/* <th className="p-3 border border-gray-200">Category Status</th> */}
                    <th className="p-3 border border-gray-200">Name</th>
                    <th className="p-3 border border-gray-200">Price</th>
                    <th className="p-3 border border-gray-200">Duration</th>
                    <th className="p-3 border border-gray-200">Features</th>
                    <th className="p-3 border border-gray-200">Popular</th>
                    <th className="p-3 border border-gray-200 text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {services
                    .filter((srv) =>
                      selectedCategoryFilter
                        ? srv.category?._id === selectedCategoryFilter
                        : true
                    )
                    .sort((a, b) => {
                      const nameA = a.category?.name?.toLowerCase() || "";
                      const nameB = b.category?.name?.toLowerCase() || "";
                      return sortOrder === "asc"
                        ? nameA.localeCompare(nameB)
                        : nameB.localeCompare(nameA);
                    })
                    .map((srv, index) => (
                      <tr key={index} className="hover:bg-green-50 transition">
                        <td className="p-3 border border-gray-200">
                          {srv.category?.name || "N/A"}
                        </td>
                        {/* <td className="p-3 border border-gray-200">
                        {srv.category?.active ? (
                          <span className="text-green-600">Active</span>
                        ) : (
                          <span className="text-red-500">Inactive</span>
                        )}
                      </td> */}
                        <td className="p-3 border border-gray-200">
                          {srv.name}
                        </td>
                        <td className="p-3 border border-gray-200">
                          ₹{srv.price}
                        </td>
                        <td className="p-3 border border-gray-200">
                          {srv.duration}
                        </td>
                        <td className="p-3 border border-gray-200">
                          {srv.features.slice(0, 3).join(", ")}
                          {srv.features.length > 3 && (
                            <span className="text-gray-400">...</span>
                          )}
                        </td>
                        <td className="p-3 border border-gray-200">
                          {srv.isPopular ? (
                            <span className="text-green-600 font-semibold">
                              Yes
                            </span>
                          ) : (
                            <span className="text-gray-500">No</span>
                          )}
                        </td>
                        <td className="p-3 border border-gray-200 text-center">
                          <div className="flex justify-center gap-3">
                            <button
                              onClick={() => handleEditService(index)}
                              title="Edit"
                              className="hover:text-blue-600"
                            >
                              <PencilLine className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleToggleServiceActive(index)}
                              title={
                                services[index].active
                                  ? "Deactivate"
                                  : "Activate"
                              }
                            >
                              {services[index].active ? (
                                <Ban className="text-yellow-600 w-4 h-4" />
                              ) : (
                                <CheckCircle2 className="text-green-600 w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            {services.length === 0 && (
              <p className="text-center text-gray-500 mt-4">
                No services added.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminServices;
