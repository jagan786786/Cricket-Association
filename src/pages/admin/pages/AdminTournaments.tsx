import { useEffect, useState } from "react";
import { PencilLine, Trash2, CheckCircle2, Ban } from "lucide-react";
import { useLocation } from "react-router-dom";

const tabs = [
  { id: "all", label: "All Tournaments" },
  { id: "category", label: "Category" },
  { id: "add", label: "Add Tournaments" },
];

const API_BASE = "http://localhost:4000/api";

const AdminTournaments = () => {
  const location = useLocation();
  const menuItemId = location.state?.menuItemId;
  const [activeTab, setActiveTab] = useState("all");

  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [editServiceId, setEditServiceId] = useState(null);

  const [moduleData, setModuleData] = useState({
    name: "",
    description: "",
    price: "",
    duration: "Monthly",
    skills: [],
    isPopular: false,
    category: "",
  });
  const [featureInput, setFeatureInput] = useState("");

  const [services, setServices] = useState([]);
  const [editServiceIndex, setEditServiceIndex] = useState(null);

  useEffect(() => {
    if (menuItemId) {
      fetchCategories();
    } else {
      console.warn("No menuItemId found in location.state");
    }
  }, [menuItemId]);

  // Fetch categories from backend
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

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    setError("");

    if (!newCategory.trim()) {
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
          name: newCategory,
          menuItemId, // ✅ Send this
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setNewCategory("");
      fetchCategories(); // Refresh list
    } catch (err) {
      setError(err.message || "Failed to create category");
    }
  };

  const handleEdit = (index) => {
    setNewCategory(categories[index].name);
    setEditIndex(index);
    setEditId(categories[index]._id);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    if (!newCategory.trim()) {
      setError("Category name cannot be empty.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/category/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategory }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setEditIndex(null);
      setEditId(null);
      setNewCategory("");
      await fetchCategories();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (index) => {
    const category = categories[index];
    try {
      const res = await fetch(`${API_BASE}/category/${category._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      await fetchCategories();
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleActive = async (index) => {
    const category = categories[index];

    // Count how many are active
    const activeCount = categories.filter((cat) => cat.active).length;

    // Prevent activating more than 4
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
      await fetchCategories();
    } catch (err) {
      setError(err.message);
    }
  };
  // 🟩 Fetch all services/modules
  const fetchModules = async () => {
    try {
      const res = await fetch(`${API_BASE}/modules`);
      const data = await res.json();
      setServices(data.modules);
    } catch (err) {
      console.error("Error fetching modules:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchModules();
  }, []);

  // 🟩 Handle Add or Update Module
  const handleAddService = async () => {
    if (moduleData.skills.length < 3) {
      alert("Please add at least 3 features.");
      return;
    }

    const payload = {
      ...moduleData,
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

      await fetchModules();
      resetModuleForm();
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
      skills: [],
      isPopular: false,
      category: "",
    });
    setEditServiceId(null);
    setFeatureInput("");
  };

  // 🟩 Edit existing service (load into form)
  const handleEditService = (index) => {
    const module = services[index];
    setModuleData({
      name: module.name,
      description: module.description,
      price: module.price,
      duration: module.duration,
      skills: module.skills,
      isPopular: module.isPopular,
      category: module.category._id,
    });
    setEditServiceId(module._id);
    setActiveTab("add");
  };

  // 🟩 Delete a module
  const handleDeleteService = async (index) => {
    const module = services[index];
    if (!window.confirm("Are you sure you want to delete this service?"))
      return;
    try {
      const res = await fetch(`${API_BASE}/module/${module._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      await fetchModules();
    } catch (err) {
      alert("Failed to delete: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-lime-50 p-6">
      <h1 className="text-3xl font-bold text-center text-green-800 mb-10">
        Tournaments Management
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

      {/* Tab Content */}
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        {/* Category Tab */}
        {activeTab === "category" && (
          <div>
            <h2 className="text-2xl font-semibold text-green-800 mb-4">
              Category Management
            </h2>
            {error && <p className="text-red-500 mb-3">{error}</p>}
            <form
              onSubmit={editIndex !== null ? handleUpdate : handleAddCategory}
              className="flex gap-4 mb-6"
            >
              <input
                type="text"
                placeholder="Enter category name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="flex-1 border border-gray-300 rounded px-4 py-2"
              />
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
              >
                {editIndex !== null ? "Update" : "Add"}
              </button>
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
                    <button onClick={() => handleDelete(index)} title="Delete">
                      <Trash2 className="text-red-600 w-5 h-5" />
                    </button>
                    <button
                      onClick={() => toggleActive(index)}
                      title={cat.active ? "Deactivate" : "Activate"}
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
              Add Tournaments
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
                  {categories.map((cat, idx) => (
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
                    disabled={moduleData.skills.length >= 5}
                    className="w-full border rounded px-4 py-2"
                  />
                  <button
                    type="button"
                    className="bg-green-600 text-white px-4 rounded"
                    onClick={() => {
                      const value = featureInput.trim();
                      if (
                        value &&
                        moduleData.skills.length < 5 &&
                        !moduleData.skills.includes(value)
                      ) {
                        setModuleData({
                          ...moduleData,
                          skills: [...moduleData.skills, value],
                        });
                        setFeatureInput("");
                      }
                    }}
                    disabled={
                      !featureInput.trim() || moduleData.skills.length >= 5
                    }
                  >
                    Add
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {moduleData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => {
                          const updated = moduleData.skills.filter(
                            (_, i) => i !== index
                          );
                          setModuleData({ ...moduleData, skills: updated });
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                {moduleData.skills.length < 3 && (
                  <p className="text-sm text-red-500 mt-1">
                    Add at least 3 features
                  </p>
                )}
                {moduleData.skills.length === 5 && (
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
                {editServiceIndex !== null ? "Update Service" : "Save"}
              </button>
            </div>
          </div>
        )}

        {/* All Services Tab */}
        {activeTab === "all" && (
          <div>
            <h2 className="text-2xl font-semibold text-green-800 mb-4">
              All Tournaments
            </h2>
            <table className="w-full table-auto border">
              <thead>
                <tr className="bg-green-100 text-left">
                  <th className="p-2 border">Category</th>
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Price</th>
                  <th className="p-2 border">Duration</th>
                  <th className="p-2 border">Features</th>
                  <th className="p-2 border">Popular</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map((srv, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-3 border">
                      {srv.category?.name || "N/A"}
                    </td>
                    <td className="p-3 border">{srv.name}</td>
                    <td className="p-3 border"> ₹{srv.price}</td>
                    <td className="p-3 border">{srv.duration}</td>
                    <td className="p-3 border">
                      {srv.skills.slice(0, 3).join(", ")}
                      {srv.skills.length > 3 && "..."}
                    </td>
                    <td className="p-3 border">
                      {srv.isPopular ? "Yes" : "No"}
                    </td>
                    <td className="p-3 border flex gap-2">
                      <button onClick={() => handleEditService(index)}>
                        <PencilLine className="w-4  text-blue-600" />
                      </button>
                      <button onClick={() => handleDeleteService(index)}>
                        <Trash2 className="w-4 text-red-600" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

export default AdminTournaments;
