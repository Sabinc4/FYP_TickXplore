import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Dynamically extract fields from profile data
const extractProfileFields = (data, role) => {
  if (role === "vendor") {
    return {
      name: data.vendorName || "",
      location: data.vendorLocation || "",
      email: data.email || "",
      role: data.role || "vendor",
    };
  } else {
    return {
      name: data.name || "",
      location: data.location || "",
      email: data.email || "",
      role: data.role || role,
    };
  }
};

// Prepare correct payload based on role
const getUpdatePayload = (role, formData) => {
  if (role === "vendor") {
    return {
      vendorName: formData.name,
      vendorLocation: formData.location,
    };
  } else {
    return {
      name: formData.name,
      location: formData.location,
    };
  }
};

// Get API endpoint based on role
const getEndpoint = (role) => {
  if (role === "admin") return "admin";
  if (role === "vendor") return "vendor";
  return "users";
};

const Profile = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "",
    role: "",
  });

  useEffect(() => {
    const loggedIn = localStorage.getItem("userLoggedIn");
    const role = localStorage.getItem("userRole");
    const id =
      role === "admin"
        ? localStorage.getItem("adminId")
        : role === "vendor"
        ? localStorage.getItem("vendorId")
        : localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!loggedIn || !role || !id || !token) {
      navigate("/sign-in");
      return;
    }

    setUserRole(role);
    const endpoint = getEndpoint(role);
    fetch(`http://localhost:3001/${endpoint}/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const profile = data.admin || data.vendor || data.user;
        setUser(profile);
        const fields = extractProfileFields(profile, role);
        setFormData(fields);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load profile.");
        setLoading(false);
      });
  }, [navigate]);

  const handleEditToggle = () => setEditMode(!editMode);
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = () => {
    const endpoint = getEndpoint(userRole);
    const token = localStorage.getItem("token");
    const payload = getUpdatePayload(userRole, formData);

    fetch(`http://localhost:3001/${endpoint}/${user._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((updated) => {
        const updatedFields = extractProfileFields(updated, userRole);
        setUser(updated);
        setFormData(updatedFields);
        setEditMode(false);
      })
      .catch(() => setError("Failed to update profile"));
  };

  const handleDelete = () => {
    if (!window.confirm("Are you sure you want to delete your account?")) return;
    const endpoint = getEndpoint(userRole);
    const token = localStorage.getItem("token");

    fetch(`http://localhost:3001/${endpoint}/${user._id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => {
        localStorage.clear();
        navigate("/");
      })
      .catch(() => setError("Failed to delete account"));
  };

  if (loading) return <div className="text-center mt-8 text-white">Loading profile...</div>;
  if (error) return <div className="text-center mt-8 text-red-400">{error}</div>;

  return (
    <div className="min-h-screen bg-slate-200 flex items-center justify-center px-4 py-10">
      <div className="bg-slate-800 rounded-xl shadow-xl w-full max-w-md p-6 md:p-8 border border-slate-700">
        <h1 className="text-3xl font-bold text-center mb-6 text-white">My Profile</h1>
        {editMode ? (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full px-3 py-2 bg-slate-100 border border-slate-100 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-slate-300 cursor-not-allowed"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Location"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-between gap-4">
              <button
                onClick={handleSave}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition duration-200"
              >
                Save Changes
              </button>
              <button
                onClick={handleEditToggle}
                className="flex-1 bg-slate-600 hover:bg-slate-700 text-white py-2 rounded-md transition duration-200"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="mb-4 p-4 bg-slate-700 rounded-lg">
              <p className="text-sm text-slate-300">Name</p>
              <p className="text-lg font-medium text-white">{formData.name || "—"}</p>
            </div>
            <div className="mb-4 p-4 bg-slate-700 rounded-lg">
              <p className="text-sm text-slate-300">Email</p>
              <p className="text-lg font-medium text-white">{formData.email}</p>
            </div>
            <div className="mb-4 p-4 bg-slate-700 rounded-lg">
              <p className="text-sm text-slate-300">Location</p>
              <p className="text-lg font-medium text-white">{formData.location || "—"}</p>
            </div>
            <div className="mb-6 p-4 bg-slate-700 rounded-lg">
              <p className="text-sm text-slate-300">Role</p>
              <p className="text-lg font-medium text-white capitalize">{formData.role}</p>
            </div>
            <div className="flex justify-between gap-4">
              <button
                onClick={handleEditToggle}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition duration-200"
              >
                Edit Profile
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-md transition duration-200"
              >
                Delete Account
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;