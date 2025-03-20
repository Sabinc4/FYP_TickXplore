import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const getEndpoint = (role) => {
  if (role === "admin") return "admin/get-admin";
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
  const [formData, setFormData] = useState({ name: "", email: "", location: "", role: "" });

  useEffect(() => {
    console.log("✅ Profile Component Mounted");

    // ✅ Fetch from localStorage
    const loggedIn = localStorage.getItem("userLoggedIn");
    const storedUserRole = localStorage.getItem("userRole");
    const storedId = localStorage.getItem(
      storedUserRole === "admin" ? "adminId" : storedUserRole === "vendor" ? "vendorId" : "userId"
    );

    console.log("📌 Stored Role:", storedUserRole);
    console.log("📌 Stored ID:", storedId);

    if (!loggedIn || loggedIn !== "true") {
      console.error("❌ User not logged in. Redirecting...");
      navigate("/sign-in");
      return;
    }

    if (!storedUserRole || !storedId) {
      console.error("❌ No role or ID found in localStorage.");
      setError("No role or ID found. Please log in again.");
      setLoading(false);
      return;
    }

    setUserRole(storedUserRole);

    const endpoint = getEndpoint(storedUserRole);
    const apiUrl = `http://localhost:3001/${endpoint}/${storedId}`;
    console.log(`🔗 Fetching user data from: ${apiUrl}`);

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("📡 API Response:", data);

        const profileData = data.admin || data.vendor || data.user;
        if (!data.success || !profileData) {
          throw new Error("User data is incomplete or missing.");
        }

        setUser(profileData);
        setFormData({
          name: profileData.name || "",
          email: profileData.email || "",
          location: profileData.location || "",
          role: profileData.role || "",
        });

        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error fetching user data:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [navigate]);

  const handleEditToggle = () => setEditMode(!editMode);
  const handleFormChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert("⚠️ Name cannot be empty.");
      return;
    }
    const endpoint = getEndpoint(userRole);
    fetch(`http://localhost:3001/${endpoint}/${user._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        setUser(data);
        setEditMode(false);
      })
      .catch(() => setError("Error updating user"));
  };

  const handleDelete = () => {
    if (!window.confirm("❗ Are you sure you want to delete your account?")) return;
    const endpoint = getEndpoint(userRole);
    fetch(`http://localhost:3001/${endpoint}/${user._id}`, { method: "DELETE" })
      .then(() => {
        localStorage.clear();
        navigate("/");
      })
      .catch(() => setError("Error deleting account"));
  };

  if (loading) return <div className="text-center mt-8">⏳ Loading profile...</div>;
  if (error) return <div className="text-center mt-8 text-red-600">❌ {error}</div>;
  if (!user) return <div className="text-center mt-8">⚠️ No user data available.</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-3xl font-semibold text-center mb-4">Profile</h2>
        {editMode ? (
          <>
            <input type="text" name="name" value={formData.name} onChange={handleFormChange} className="w-full p-2 border rounded" />
            <input type="email" name="email" value={formData.email} disabled className="w-full p-2 border rounded bg-gray-200 mt-2" />
            <input type="text" name="location" value={formData.location} onChange={handleFormChange} className="w-full p-2 border rounded mt-2" />
            <div className="flex justify-between mt-4">
              <button onClick={handleSave} className="py-2 px-6 bg-blue-600 text-white rounded">Save</button>
              <button onClick={handleEditToggle} className="py-2 px-6 bg-gray-600 text-white rounded">Cancel</button>
            </div>
          </>
        ) : (
          <>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Location:</strong> {user.location}</p>
            <div className="flex justify-between mt-4">
              <button onClick={handleEditToggle} className="py-2 px-6 bg-blue-600 text-white rounded">Edit</button>
              <button onClick={handleDelete} className="py-2 px-6 bg-red-600 text-white rounded">Delete</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
