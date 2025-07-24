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
  const menuItemName = location.state?.menuItemName;

  const [activeTab, setActiveTab] = useState("all");
  const [categories, setCategories] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [tournamentForm, setTournamentForm] = useState({
    name: "",
    description: "",
    date: "",
    format: "",
    teams: "",
    location: "",
    entryFee: "",
    prizePool: "",
    category: "",
  });
  const [editTournamentId, setEditTournamentId] = useState(null);

  useEffect(() => {
    if (menuItemId) {
      fetchCategories();
      fetchTournaments();
    }
  }, [menuItemId]);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/categories/menuItem/${menuItemId}`);
      const data = await res.json();
      setCategories(data.categories);
    } catch (err) {
      setError("Failed to load categories");
    }
  };

  const fetchTournaments = async () => {
    try {
      const res = await fetch(`${API_BASE}/tournaments/menuItem/${menuItemId}`);
      const data = await res.json();
      setTournaments(data.tournaments);
    } catch (err) {
      setError("Failed to load tournaments");
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return setError("Category name cannot be empty.");
    if (!menuItemId) return setError("Menu item ID is missing.");

    try {
      const url = editId
        ? `${API_BASE}/category/${editId}`
        : `${API_BASE}/category`;
      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategory, menuItemId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setNewCategory("");
      setEditId(null);
      setEditIndex(null);
      fetchCategories();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/category/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      fetchCategories();
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleCategoryActive = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/category/${id}/toggle-active`, {
        method: "PATCH",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      fetchCategories();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleTournamentSubmit = async () => {
    const payload = {
      ...tournamentForm,
      menuItem: menuItemId,
    };

    try {
      const url = editTournamentId
        ? `${API_BASE}/tournaments/${editTournamentId}`
        : `${API_BASE}/tournament`;
      const method = editTournamentId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setTournamentForm({
        name: "",
        description: "",
        date: "",
        format: "",
        teams: "",
        location: "",
        entryFee: "",
        prizePool: "",
        category: "",
      });
      setEditTournamentId(null);
      fetchTournaments();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEditTournament = (tournament) => {
    const cleaned = {
      name: tournament.name || "",
      description: tournament.description || "",
      date: tournament.date?.slice(0, 10) || "",
      format: tournament.format || "",
      teams: tournament.teams || "",
      location: tournament.location || "",
      entryFee: tournament.entryFee || "",
      prizePool: tournament.prizePool || "",
      category: tournament.category?._id || "",
    };
    setTournamentForm(cleaned);
    setEditTournamentId(tournament._id);
    setActiveTab("add");
  };

  const handleDeleteTournament = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/tournaments/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      fetchTournaments();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-lime-50 p-6">
      <h1 className="text-3xl font-bold text-center text-green-800 mb-10">
        Tournament Management
      </h1>

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
            <form onSubmit={handleCategorySubmit} className="flex gap-4 mb-6">
              <input
                type="text"
                placeholder="Enter category name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-green-500 focus:border-green-500"
              />
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow-md"
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
                    <button
                      onClick={() => {
                        setNewCategory(cat.name);
                        setEditIndex(index);
                        setEditId(cat._id);
                      }}
                    >
                      <PencilLine className="text-blue-600 w-5 h-5" />
                    </button>
                    <button onClick={() => handleDeleteCategory(cat._id)}>
                      <Trash2 className="text-red-600 w-5 h-5" />
                    </button>
                    <button onClick={() => toggleCategoryActive(cat._id)}>
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

        {activeTab === "add" && (
          <div>
            <h2 className="text-2xl font-semibold text-green-800 mb-6">
              {editTournamentId ? "Edit Tournament" : "Add Tournament"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category Dropdown */}
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-green-700">
                  Category
                </label>
                <select
                  value={tournamentForm.category}
                  onChange={(e) =>
                    setTournamentForm({
                      ...tournamentForm,
                      category: e.target.value,
                    })
                  }
                  className="border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Other Fields */}
              {Object.entries(tournamentForm).map(([key, value]) => {
                if (key === "category") return null;
                return (
                  <div key={key} className="flex flex-col">
                    <label className="mb-1 capitalize font-medium text-green-700">
                      {key}
                    </label>
                    <input
                      type={key === "date" ? "date" : "text"}
                      value={value}
                      onChange={(e) =>
                        setTournamentForm({
                          ...tournamentForm,
                          [key]: e.target.value,
                        })
                      }
                      placeholder={`Enter ${key}`}
                      className="border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                );
              })}
            </div>

            <button
              onClick={handleTournamentSubmit}
              className="mt-8 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl shadow-md transition-all duration-200"
            >
              {editTournamentId ? "Update Tournament" : "Add Tournament"}
            </button>
          </div>
        )}

        {activeTab === "all" && (
          <div>
            <h2 className="text-2xl font-semibold text-green-800 mb-4">
              All Tournaments ({menuItemName})
            </h2>
            <table className="w-full table-auto border">
              <thead>
                <tr className="bg-green-100 text-left">
                  <th className="p-2 border">Category</th>
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Date</th>
                  <th className="p-2 border">Location</th>
                  <th className="p-2 border">Entry Fee</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tournaments.map((tour) => (
                  <tr key={tour._id} className="border-b">
                    <td className="p-2 border">{tour.category?.name}</td>
                    <td className="p-2 border">{tour.name}</td>
                    <td className="p-2 border">{tour.date?.slice(0, 10)}</td>
                    <td className="p-2 border">{tour.location}</td>
                    <td className="p-2 border">₹{tour.entryFee}</td>
                    <td className="p-2 border flex gap-2">
                      <button onClick={() => handleEditTournament(tour)}>
                        <PencilLine className="w-4 text-blue-600" />
                      </button>
                      <button onClick={() => handleDeleteTournament(tour._id)}>
                        <Trash2 className="w-4 text-red-600" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTournaments;
