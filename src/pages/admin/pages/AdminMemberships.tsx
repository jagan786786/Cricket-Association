import { useEffect, useState } from "react";
import {
  PencilLine,
  CheckCircle2,
  Ban,
  X,
  Users,
  Star,
  Clock,
  Plus,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const tabs = [
  { id: "all", label: "All Memberships" },
  { id: "add", label: "Add Memberships" },
];

const API_BASE = "http://localhost:4000/api";

const AdminMemberships = () => {
  const location = useLocation();
  const menuItemId = location.state?.menuItemId;

  const [activeTab, setActiveTab] = useState("all");
  const [memberships, setMemberships] = useState([]);
  const [featureLimitInfo, setFeatureLimitInfo] = useState("");
  const [error, setError] = useState("");

  // Enhanced filtering states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // all, active, inactive
  const [durationFilter, setDurationFilter] = useState(""); // all, Monthly, Yearly, Day, Hour
  const [popularFilter, setPopularFilter] = useState(""); // all, popular, not-popular
  const [sortOrder, setSortOrder] = useState("asc"); // asc, desc
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [membershipForm, setMembershipForm] = useState({
    name: "",
    description: "",
    price: "",
    duration: "Monthly",
    features: [],
    isPopular: false,
    active: true,
  });
  const [featureInput, setFeatureInput] = useState("");
  const [featureError, setFeatureError] = useState("");
  const [editMembershipId, setEditMembershipId] = useState(null);

  useEffect(() => {
    if (menuItemId) {
      fetchMemberships();
    }
  }, [menuItemId]);

  // Enhanced filtering and pagination logic
  const getFilteredMemberships = () => {
    let filtered = memberships.filter((membership) => {
      // Search filter
      const matchesSearch =
        membership.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        membership.description
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());

      // Status filter
      const matchesStatus =
        statusFilter === ""
          ? true
          : statusFilter === "active"
          ? membership.active
          : !membership.active;

      // Duration filter
      const matchesDuration = durationFilter
        ? membership.duration === durationFilter
        : true;

      // Popular filter
      const matchesPopular =
        popularFilter === ""
          ? true
          : popularFilter === "popular"
          ? membership.isPopular
          : !membership.isPopular;

      return (
        matchesSearch && matchesStatus && matchesDuration && matchesPopular
      );
    });

    // Sort filtered results
    filtered = filtered.sort((a, b) => {
      const nameA = a.name?.toLowerCase() || "";
      const nameB = b.name?.toLowerCase() || "";
      return sortOrder === "asc"
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });

    return filtered;
  };

  const getPaginatedMemberships = () => {
    const filtered = getFilteredMemberships();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filtered.slice(startIndex, endIndex);
  };

  const getTotalPages = () => {
    return Math.ceil(getFilteredMemberships().length / itemsPerPage);
  };

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, durationFilter, popularFilter, sortOrder]);

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("");
    setDurationFilter("");
    setPopularFilter("");
    setSortOrder("asc");
    setCurrentPage(1);
  };

  const fetchMemberships = async () => {
    try {
      const res = await fetch(`${API_BASE}/memberships/menuitem/${menuItemId}`);
      const data = await res.json();
      setMemberships(data.memberships);
    } catch (err) {
      setError("Failed to load memberships");
    }
  };

  const handleMembershipSubmit = async () => {
    if (
      membershipForm.features.length < 3 ||
      membershipForm.features.length > 12
    ) {
      setFeatureError("Please add between 3 and 12 features.");
      return;
    } else {
      setFeatureError("");
    }

    const payload = {
      ...membershipForm,
      menuItem: menuItemId,
    };

    try {
      const url = editMembershipId
        ? `${API_BASE}/memberships/${editMembershipId}`
        : `${API_BASE}/membership`;
      const method = editMembershipId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setMembershipForm({
        name: "",
        description: "",
        price: "",
        duration: "Monthly",
        features: [],
        isPopular: false,
        active: true,
      });
      setFeatureInput("");
      setEditMembershipId(null);
      fetchMemberships();
      setActiveTab("all");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEditMembership = (membership) => {
    setMembershipForm({
      name: membership.name || "",
      description: membership.description || "",
      price: membership.price || "",
      duration: membership.duration || "",
      features: Array.isArray(membership.features) ? membership.features : [],
      isPopular: membership.isPopular || false,
      active: membership.active || true,
    });
    setEditMembershipId(membership._id);
    setActiveTab("add");
  };

  const toggleMembershipActive = (id, name, active) => {
    const action = active ? "deactivate" : "activate";

    toast.info(
      ({ closeToast }) => (
        <div className="flex flex-col">
          <span>
            Are you sure you want to <strong>{action}</strong>{" "}
            <span className="text-green-700 font-semibold">{name}</span>?
          </span>
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => {
                confirmToggle(id);
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

  const confirmToggle = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/memberships/toggle/${id}`, {
        method: "PATCH",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      fetchMemberships();
      toast.success("Membership status updated successfully!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleAddFeature = () => {
    const trimmed = featureInput.trim();

    if (!trimmed) return;

    if (membershipForm.features.includes(trimmed)) return;

    if (membershipForm.features.length >= 12) {
      setFeatureError("");
      setFeatureLimitInfo("Maximum 12 features added");
      return;
    }

    const updatedFeatures = [...membershipForm.features, trimmed];

    setMembershipForm({ ...membershipForm, features: updatedFeatures });
    setFeatureInput("");
    setFeatureError("");

    if (updatedFeatures.length === 12) {
      setFeatureLimitInfo("Maximum 12 features added");
    } else {
      setFeatureLimitInfo("");
    }
  };

  const handleRemoveFeature = (index) => {
    const newFeatures = [...membershipForm.features];
    newFeatures.splice(index, 1);
    setMembershipForm({ ...membershipForm, features: newFeatures });

    if (newFeatures.length >= 3 && newFeatures.length <= 12) {
      setFeatureError("");
    }

    if (newFeatures.length < 12) {
      setFeatureLimitInfo("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddFeature();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-lime-50 p-6">
      <h1 className="text-3xl font-bold text-center text-green-800 mb-10">
        Membership Management
      </h1>
      <ToastContainer />
      <div className="grid grid-cols-2 max-w-4xl mx-auto gap-4 mb-10">
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

      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        {activeTab === "add" && (
          <div>
            {/* Header Section */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-500 px-8 py-6">
              <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Users className="w-6 h-6" />
                </div>
                {editMembershipId
                  ? "Edit Membership"
                  : "Create Membership Plan"}
              </h2>
              <p className="text-green-100 mt-2">
                {editMembershipId
                  ? "Update membership details"
                  : "Design a new membership tier for your users"}
              </p>
            </div>

            {/* Form Content */}
            <div className="p-8 space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    Membership Name
                  </label>
                  <input
                    type="text"
                    value={membershipForm.name}
                    onChange={(e) =>
                      setMembershipForm({
                        ...membershipForm,
                        name: e.target.value,
                      })
                    }
                    placeholder="Premium, Gold, VIP..."
                    className="w-full h-12 border-2 border-gray-200 rounded-xl px-4 text-gray-700 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 hover:border-gray-300"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    Description
                  </label>
                  <input
                    type="text"
                    value={membershipForm.description}
                    onChange={(e) =>
                      setMembershipForm({
                        ...membershipForm,
                        description: e.target.value,
                      })
                    }
                    placeholder="Brief membership description..."
                    className="w-full h-12 border-2 border-gray-200 rounded-xl px-4 text-gray-700 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 hover:border-gray-300"
                  />
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <span className="text-green-600">₹</span>
                    Price
                  </label>
                  <input
                    type="text"
                    value={membershipForm.price}
                    onChange={(e) =>
                      setMembershipForm({
                        ...membershipForm,
                        price: e.target.value,
                      })
                    }
                    placeholder="0.00"
                    className="w-full h-12 border-2 border-gray-200 rounded-xl px-4 text-gray-700 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 hover:border-gray-300"
                  />
                </div>

                {/* Duration */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-green-600" />
                    Duration
                  </label>
                  <div className="relative">
                    <select
                      value={membershipForm.duration}
                      onChange={(e) =>
                        setMembershipForm({
                          ...membershipForm,
                          duration: e.target.value,
                        })
                      }
                      className="w-full h-12 border-2 border-gray-200 rounded-xl px-4 bg-white text-gray-700 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 appearance-none cursor-pointer hover:border-gray-300"
                    >
                      <option value="Monthly">Monthly</option>
                      <option value="Yearly">Yearly</option>
                      <option value="Day">Day</option>
                      <option value="Hour">Hour</option>
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
                  Membership Features
                </label>

                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={featureInput}
                      onChange={(e) => setFeatureInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Add membership benefits..."
                      className="w-full h-12 border-2 border-gray-200 rounded-xl px-4 pr-12 text-gray-700 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 hover:border-gray-300"
                    />
                  </div>
                  <button
                    onClick={handleAddFeature}
                    className="h-12 px-6 bg-gradient-to-r from-green-600 to-emerald-500 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-600 focus:ring-4 focus:ring-green-100 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>

                {featureError && (
                  <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                    <X className="w-4 h-4" />
                    {featureError}
                  </div>
                )}

                {featureLimitInfo && (
                  <div className="flex items-center gap-2 text-green-600 text-sm bg-green-50 p-3 rounded-lg">
                    <CheckCircle2 className="w-4 h-4" />
                    {featureLimitInfo}
                  </div>
                )}

                <div className="flex flex-wrap gap-3 mt-4">
                  {membershipForm.features.map((feature, idx) => (
                    <span
                      key={idx}
                      className="bg-gradient-to-r from-green-100 to-emerald-50 text-green-800 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 border border-green-200 hover:shadow-md transition-all duration-200"
                    >
                      <span>{feature}</span>
                      <button
                        onClick={() => handleRemoveFeature(idx)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full p-1 transition-all duration-200"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Popular Toggle */}
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={membershipForm.isPopular}
                    onChange={(e) =>
                      setMembershipForm({
                        ...membershipForm,
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
                onClick={handleMembershipSubmit}
                className="w-full h-14 bg-gradient-to-r from-green-600 to-emerald-500 text-white font-bold text-lg rounded-xl hover:from-green-700 hover:to-emerald-600 focus:ring-4 focus:ring-green-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                {editMembershipId ? "Update Membership" : "Create Membership"}
              </button>
            </div>
          </div>
        )}

        {activeTab === "all" && (
          <div>
            {/* Header Section */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-500 px-8 py-6">
              <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Users className="w-6 h-6" />
                </div>
                All Memberships
              </h2>
              <p className="text-green-100 mt-2">
                Manage your membership plans and pricing
              </p>
            </div>

            {/* Advanced Filters */}
            <div className="p-6">
              <div className="bg-gray-50 p-6 rounded-lg mb-6 space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-medium text-green-800">
                    Filters
                  </h3>
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
                      placeholder="Search memberships..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-300"
                    />
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

                  {/* Duration Filter */}
                  <div>
                    <select
                      value={durationFilter}
                      onChange={(e) => setDurationFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-300"
                    >
                      <option value="">All Durations</option>
                      <option value="Monthly">Monthly</option>
                      <option value="Yearly">Yearly</option>
                      <option value="Day">Day</option>
                      <option value="Hour">Hour</option>
                    </select>
                  </div>

                  {/* Popular Filter */}
                  <div>
                    <select
                      value={popularFilter}
                      onChange={(e) => setPopularFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-300"
                    >
                      <option value="">All Memberships</option>
                      <option value="popular">Popular Only</option>
                      <option value="not-popular">Regular Only</option>
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
                    Showing {getPaginatedMemberships().length} of{" "}
                    {getFilteredMemberships().length} memberships
                  </span>
                  <span>
                    Page {currentPage} of {getTotalPages() || 1}
                  </span>
                </div>
              </div>

              {/* Table Content */}
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100 text-left">
                      <th className="p-4 text-sm font-semibold text-gray-700 border-b">
                        Name
                      </th>
                      <th className="p-4 text-sm font-semibold text-gray-700 border-b">
                        Price
                      </th>
                      <th className="p-4 text-sm font-semibold text-gray-700 border-b">
                        Duration
                      </th>
                      <th className="p-4 text-sm font-semibold text-gray-700 border-b text-center">
                        Popular
                      </th>
                      <th className="p-4 text-sm font-semibold text-gray-700 border-b text-center">
                        Status
                      </th>
                      <th className="p-4 text-sm font-semibold text-gray-700 border-b text-center">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {getPaginatedMemberships().map((mem) => (
                      <tr
                        key={mem._id}
                        className="border-b hover:bg-green-50/50 transition-colors duration-200"
                      >
                        <td className="p-4">
                          <div>
                            <p className="font-medium text-gray-800">
                              {mem.name}
                            </p>
                            {mem.description && (
                              <p className="text-sm text-gray-500 mt-1">
                                {mem.description}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-gray-700">
                          <span className="font-semibold text-green-600">
                            ₹{mem.price}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-800 font-medium">
                            {mem.duration}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          {mem.isPopular ? (
                            <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                              <Star className="w-3 h-3" />
                              Yes
                            </span>
                          ) : (
                            <span className="text-gray-400 text-xs">No</span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          <span
                            className={`px-3 py-1 text-xs rounded-full font-medium ${
                              mem.active
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {mem.active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex justify-center gap-3">
                            <button
                              onClick={() => handleEditMembership(mem)}
                              title="Edit"
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                            >
                              <PencilLine className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                toggleMembershipActive(
                                  mem._id,
                                  mem.name,
                                  mem.active
                                )
                              }
                              title={mem.active ? "Deactivate" : "Activate"}
                              className="p-2 rounded-lg transition-colors duration-200 hover:bg-yellow-50"
                            >
                              {mem.active ? (
                                <Ban className="w-4 h-4 text-yellow-600" />
                              ) : (
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* No Results */}
                {getFilteredMemberships().length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <Search className="w-16 h-16 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-600 mb-2">
                      No memberships found
                    </h3>
                    <p className="text-gray-500">
                      Try adjusting your search criteria or clearing the
                      filters.
                    </p>
                  </div>
                )}
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
                    {Array.from(
                      { length: getTotalPages() },
                      (_, i) => i + 1
                    ).map((page) => (
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
                    ))}
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMemberships;
