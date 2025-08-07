import { useEffect, useState } from "react";
import {
  PencilLine,
  CheckCircle2,
  Ban,
  Info,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Award,
  Users,
  Calendar,
  MapPin,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const tabs = [
  { id: "all", label: "All Tournaments" },
  { id: "category", label: "Category" },
  { id: "add", label: "Add Tournaments" },
];

const API_BASE = "https://cricket-association-backend.onrender.com/api";

const AdminTournaments = () => {
  const location = useLocation();
  const menuItemId = location.state?.menuItemId;

  const [activeTab, setActiveTab] = useState("all");
  const [categories, setCategories] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);

  // Enhanced filtering states
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // all, active, inactive
  const [dateFilter, setDateFilter] = useState(""); // all, upcoming, past
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

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
    mapurl: "",
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

  // Enhanced filtering and pagination logic
  const getFilteredTournaments = () => {
    let filtered = tournaments.filter((tournament) => {
      // Search filter
      const matchesSearch =
        tournament.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tournament.description
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        tournament.location?.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCategory = selectedCategoryFilter
        ? tournament.category?._id === selectedCategoryFilter
        : true;

      // Status filter
      const matchesStatus =
        statusFilter === ""
          ? true
          : statusFilter === "active"
          ? tournament.active
          : !tournament.active;

      // Date filter
      const matchesDate =
        dateFilter === ""
          ? true
          : dateFilter === "upcoming"
          ? new Date(tournament.date) >= new Date()
          : new Date(tournament.date) < new Date();

      return matchesSearch && matchesCategory && matchesStatus && matchesDate;
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

  const getPaginatedTournaments = () => {
    const filtered = getFilteredTournaments();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filtered.slice(startIndex, endIndex);
  };

  const getTotalPages = () => {
    return Math.ceil(getFilteredTournaments().length / itemsPerPage);
  };

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    selectedCategoryFilter,
    statusFilter,
    dateFilter,
    sortOrder,
  ]);

  const handleCategorySubmit = async (e) => {
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
      toast.success(
        editId
          ? "Category updated successfully!"
          : "Category added successfully!"
      );
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

  const handleTournamentSubmit = async () => {
    if (!tournamentForm.name.trim()) {
      toast.error("Tournament name is required.");
      return;
    }

    if (!tournamentForm.category) {
      toast.error("Please select a category.");
      return;
    }

    if (!menuItemId) {
      toast.error("Menu item ID is missing.");
      return;
    }

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
      if (!res.ok) throw new Error(data.message || "Operation failed");

      resetTournamentForm();
      fetchTournaments();
      setActiveTab("all");
      toast.success(
        editTournamentId
          ? "Tournament updated successfully!"
          : "Tournament added successfully!"
      );
    } catch (err) {
      toast.error(err.message);
    }
  };

  const resetTournamentForm = () => {
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
      mapurl: "",
    });
    setEditTournamentId(null);
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
      mapurl: tournament.mapurl || "",
    };
    setTournamentForm(cleaned);
    setEditTournamentId(tournament._id);
    setActiveTab("add");
  };

  const toggleTournamentActive = (tournament) => {
    const action = tournament.active ? "deactivate" : "activate";

    toast.info(
      ({ closeToast }) => (
        <div className="flex flex-col">
          <span>
            Are you sure you want to <strong>{action}</strong>{" "}
            <span className="text-green-700 font-semibold">
              {tournament.name}
            </span>
            ?
          </span>
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => {
                confirmTournamentToggle(tournament._id);
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

  const confirmTournamentToggle = async (tournamentId) => {
    try {
      const res = await fetch(
        `${API_BASE}/tournament/${tournamentId}/toggle-active`,
        {
          method: "PATCH",
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      fetchTournaments();
      toast.success("Tournament status updated successfully!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategoryFilter("");
    setStatusFilter("");
    setDateFilter("");
    setSortOrder("asc");
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const isUpcoming = (dateString) => {
    if (!dateString) return false;
    return new Date(dateString) >= new Date();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-lime-50 p-6">
      <h1 className="text-3xl font-bold text-center text-green-800 mb-10">
        Tournament Management
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
              onSubmit={handleCategorySubmit}
              className="flex flex-col md:flex-row md:items-end gap-4 mb-6"
            >
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Category Name
                </label>
                <input
                  type="text"
                  placeholder="Enter category name"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded px-4 py-2"
                />
              </div>
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
                    <button
                      onClick={() => {
                        setNewCategory(cat.name);
                        setEditIndex(index);
                        setEditId(cat._id);
                      }}
                      title="Edit"
                    >
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

        {/* Add Tournament Tab */}
        {activeTab === "add" && (
          <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-500 px-8 py-6">
              <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Award className="w-6 h-6" />
                </div>
                {editTournamentId ? "Edit Tournament" : "Create Tournament"}
              </h2>
              <p className="text-green-100 mt-2">
                {editTournamentId
                  ? "Update tournament information"
                  : "Set up a new tournament event"}
              </p>
            </div>

            {/* Form Content */}
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* Category Selection */}
                <div className="lg:col-span-2 xl:col-span-1">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4 text-green-600" />
                    Tournament Category
                  </label>
                  <div className="relative">
                    <select
                      value={tournamentForm.category}
                      onChange={(e) =>
                        setTournamentForm({
                          ...tournamentForm,
                          category: e.target.value,
                        })
                      }
                      className="w-full h-12 border-2 border-gray-200 rounded-xl px-4 bg-white text-gray-700 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 appearance-none cursor-pointer hover:border-gray-300"
                    >
                      <option value="">Select Category...</option>
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

                {/* Dynamic Form Fields */}
                {Object.entries(tournamentForm).map(([key, value]) => {
                  if (key === "category") return null;

                  const getFieldIcon = (fieldKey) => {
                    switch (fieldKey) {
                      case "date":
                        return <Calendar className="w-4 h-4 text-green-600" />;
                      case "mapurl":
                        return <MapPin className="w-4 h-4 text-green-600" />;
                      default:
                        return null;
                    }
                  };

                  const label =
                    key === "mapurl"
                      ? "Map URL (Google Maps)"
                      : key.charAt(0).toUpperCase() + key.slice(1);
                  const placeholder =
                    key === "mapurl"
                      ? "https://www.google.com/maps/..."
                      : `Enter ${key}...`;

                  return (
                    <div key={key} className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2 capitalize">
                        {getFieldIcon(key)}
                        {label}
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
                        placeholder={placeholder}
                        className="w-full h-12 border-2 border-gray-200 rounded-xl px-4 text-gray-700 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 hover:border-gray-300"
                      />
                    </div>
                  );
                })}
              </div>

              {/* Submit Button */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleTournamentSubmit}
                  className="w-full lg:w-auto h-14 px-12 bg-gradient-to-r from-green-600 to-emerald-500 text-white font-bold text-lg rounded-xl hover:from-green-700 hover:to-emerald-600 focus:ring-4 focus:ring-green-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <Award className="w-5 h-5" />
                  {editTournamentId ? "Update Tournament" : "Create Tournament"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* All Tournaments Tab with Enhanced Filters */}
        {activeTab === "all" && (
          <div>
            <h2 className="text-2xl font-semibold text-green-800 mb-6">
              All Tournaments
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
                    placeholder="Search tournaments..."
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

                {/* Date Filter */}
                <div>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-300"
                  >
                    <option value="">All Dates</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="past">Past</option>
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
                  Showing {getPaginatedTournaments().length} of{" "}
                  {getFilteredTournaments().length} tournaments
                </span>
                <span>
                  Page {currentPage} of {getTotalPages() || 1}
                </span>
              </div>
            </div>

            {/* Tournaments Table */}
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="w-full min-w-[800px] table-auto">
                <thead className="bg-green-100">
                  <tr className="text-left text-sm text-green-800">
                    <th className="p-4 font-semibold">Category</th>
                    <th className="p-4 font-semibold">Tournament Name</th>
                    <th className="p-4 font-semibold">Date</th>
                    <th className="p-4 font-semibold">Location</th>
                    <th className="p-4 font-semibold">Entry Fee</th>
                    <th className="p-4 font-semibold">Prize Pool</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {getPaginatedTournaments().map((tour) => (
                    <tr
                      key={tour._id}
                      className="border-b hover:bg-green-50 transition-colors"
                    >
                      <td className="p-4">
                        <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                          {tour.category?.name || "N/A"}
                        </span>
                      </td>
                      <td className="p-4 font-medium">{tour.name}</td>
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {formatDate(tour.date)}
                          </span>
                          <span
                            className={`text-xs ${
                              isUpcoming(tour.date)
                                ? "text-green-600"
                                : "text-gray-500"
                            }`}
                          >
                            {isUpcoming(tour.date) ? "Upcoming" : "Past"}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        {tour.mapurl ? (
                          <a
                            href={tour.mapurl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline"
                          >
                            {tour.location}
                          </a>
                        ) : (
                          <span>{tour.location}</span>
                        )}
                      </td>
                      <td className="p-4 font-semibold text-green-600">
                        ₹{tour.entryFee}
                      </td>
                      <td className="p-4 font-semibold text-purple-600">
                        ₹{tour.prizePool}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 text-xs rounded-full font-medium ${
                            tour.active
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {tour.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => handleEditTournament(tour)}
                            title="Edit Tournament"
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            <PencilLine className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => toggleTournamentActive(tour)}
                            title={
                              tour.active
                                ? "Deactivate Tournament"
                                : "Activate Tournament"
                            }
                            className="transition-colors"
                          >
                            {tour.active ? (
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
            {getFilteredTournaments().length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  No tournaments found
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

export default AdminTournaments;
