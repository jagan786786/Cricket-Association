import { useEffect, useState } from "react";
import { PencilLine, CheckCircle2, Ban, X } from "lucide-react";
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

      <div className="max-w-6xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        {activeTab === "add" && (
          <div>
            <h2 className="text-2xl font-semibold text-green-800 mb-6">
              {editMembershipId ? "Edit Membership" : "Add Membership"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-green-700">Name</label>
                <input
                  type="text"
                  value={membershipForm.name}
                  onChange={(e) =>
                    setMembershipForm({
                      ...membershipForm,
                      name: e.target.value,
                    })
                  }
                  placeholder="Enter name"
                  className="border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300"
                />
              </div>

              {/* Description */}
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-green-700">
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
                  placeholder="Enter description"
                  className="border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300"
                />
              </div>

              {/* Price */}
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-green-700">
                  Price (₹)
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
                  placeholder="Enter price"
                  className="border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300"
                />
              </div>

              {/* Duration (Dropdown) */}
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-green-700">
                  Duration
                </label>
                <select
                  value={membershipForm.duration}
                  onChange={(e) =>
                    setMembershipForm({
                      ...membershipForm,
                      duration: e.target.value,
                    })
                  }
                  className="border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300"
                >
                  {/* <option value="">Select duration</option> */}
                  <option value="Monthly">Monthly</option>
                  <option value="Yearly">Yearly</option>
                  <option value="Day">Day</option>
                  <option value="Hour">Hour</option>
                </select>
              </div>

              {/* Features */}
              <div className="col-span-1 md:col-span-2">
                <label className="mb-1 font-medium text-green-700">
                  Features
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Add a feature and press Enter"
                    className="border border-gray-300 rounded-lg px-4 py-2 w-full shadow-sm"
                  />
                  <button
                    onClick={handleAddFeature}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    Add
                  </button>
                </div>
                {featureError && (
                  <p className="text-sm text-red-600 mt-1">{featureError}</p>
                )}
                {featureLimitInfo && (
                  <p className="text-sm text-green-600 mt-1">
                    {featureLimitInfo}
                  </p>
                )}
                <div className="mt-3 flex flex-wrap gap-2">
                  {membershipForm.features.map((feature, idx) => (
                    <span
                      key={idx}
                      className="bg-green-100 text-green-700 px-3 py-1 rounded-full flex items-center gap-1"
                    >
                      {feature}
                      <button
                        onClick={() => handleRemoveFeature(idx)}
                        className="ml-1 text-red-500 hover:text-red-700"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Popular Checkbox */}
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  checked={membershipForm.isPopular}
                  onChange={(e) =>
                    setMembershipForm({
                      ...membershipForm,
                      isPopular: e.target.checked,
                    })
                  }
                />
                <label className="font-medium text-green-700">
                  Most Popular
                </label>
              </div>
            </div>

            <button
              onClick={handleMembershipSubmit}
              className="mt-8 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700"
            >
              {editMembershipId ? "Update Membership" : "Add Membership"}
            </button>
          </div>
        )}

        {activeTab === "all" && (
          <div>
            <h2 className="text-2xl font-semibold text-green-800 mb-4">
              All Memberships
            </h2>

            <table className="w-full table-auto border">
              <thead>
                <tr className="bg-green-100 text-left">
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Price</th>
                  <th className="p-2 border">Duration</th>
                  <th className="p-2 border">Popular</th>
                  <th className="p-2 border text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {memberships.map((mem) => (
                  <tr key={mem._id} className="border-b hover:bg-green-50">
                    <td className="p-2 border">{mem.name}</td>
                    <td className="p-2 border">₹{mem.price}</td>
                    <td className="p-2 border">{mem.duration}</td>
                    <td className="p-2 border text-center">
                      {mem.isPopular ? "Yes" : "No"}
                    </td>
                    <td className="p-2 border text-center flex justify-center gap-4">
                      <button
                        onClick={() => handleEditMembership(mem)}
                        title="Edit"
                      >
                        <PencilLine className="w-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() =>
                          toggleMembershipActive(mem._id, mem.name, mem.active)
                        }
                        title={mem.active ? "Deactivate" : "Activate"}
                      >
                        {mem.active ? (
                          <Ban className="w-4 text-yellow-600" />
                        ) : (
                          <CheckCircle2 className="w-4 text-green-600" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {memberships.length === 0 && (
              <p className="text-center text-gray-500 mt-4">
                No memberships available.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMemberships;
