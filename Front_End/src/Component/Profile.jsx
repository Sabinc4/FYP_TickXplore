import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ✅ Function to determine API endpoint based on user role
const getEndpoint = (role) => {
  if (role === "vendor") return "vendors";
  if (role === "admin") return "admins";
  return "users";
};

const Profile = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState("user"); // Default to "user"
  const [user, setUser] = useState(null); // Stores user data from API
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "",
    role: "",
  });

  // ✅ Fetch user data on component mount
  useEffect(() => {
    console.log("Profile component mounted.");

    const loggedIn = localStorage.getItem("userLoggedIn");
    if (loggedIn !== "true") {
      console.error("User not logged in. Redirecting to /sign-in");
      navigate("/sign-in");
      return;
    }

    // ✅ Retrieve stored role & ID from localStorage
    const storedUserRole = localStorage.getItem("userRole") || "user";
    setUserRole(storedUserRole);

    const storedId = storedUserRole === "vendor"
      ? localStorage.getItem("vendorId")
      : localStorage.getItem("userId");

    if (!storedId) {
      console.error("No ID found. Redirecting to /sign-in");
      navigate("/sign-in");
      return;
    }

    // ✅ Determine API endpoint & fetch profile data
    const endpoint = getEndpoint(storedUserRole);
    fetch(`http://localhost:3001/${endpoint}/${storedId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (!data) {
          throw new Error("No user data received.");
        }
        setUser(data);
        setFormData({
          name: data.name || "",
          email: data.email || "",
          location: data.location || "",
          role: data.role || "",
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching user data:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [navigate]);

  // ✅ Handle Edit Mode Toggle
  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  // ✅ Handle Form Change
  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Get correct ID field
  const getIdField = () => {
    if (userRole === "vendor") return "vendorId";
    if (userRole === "admin") return "adminId";
    return "userId";
  };

  // ✅ Save Updated User Data
  const handleSave = () => {
    if (!formData.name.trim()) {
      alert("Name cannot be empty.");
      return;
    }

    const endpoint = getEndpoint(userRole);
    const idField = getIdField();
    const id = user[idField];

    fetch(`http://localhost:3001/${endpoint}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(`Server responded with status: ${response.status}, ${text}`);
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log("User data after update:", data);
        setUser(data);
        setEditMode(false);
      })
      .catch((err) => {
        console.error("Error updating user:", err);
        setError(err.message);
      });
  };

  // ✅ Delete Account
  const handleDelete = () => {
    if (!window.confirm("Are you sure you want to delete your account?")) return;

    const endpoint = getEndpoint(userRole);
    const idField = getIdField();
    const id = user[idField];

    fetch(`http://localhost:3001/${endpoint}/${id}`, { method: "DELETE" })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(`Server responded with status: ${response.status}, ${text}`);
          });
        }
        return response.json();
      })
      .then(() => {
        console.log("User account deleted successfully.");
        localStorage.clear();
        navigate("/");
      })
      .catch((err) => {
        console.error("Error deleting account:", err);
        setError(err.message);
      });
  };

  // ✅ Show Loading/Error Messages
  if (loading) return <div className="text-center mt-8">Loading profile...</div>;
  if (error) return <div className="text-center mt-8 text-red-600">Error: {error}</div>;
  if (!user) return <div className="text-center mt-8">No user data available.</div>;

  // ✅ Render Profile Page
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-3xl font-semibold text-center mb-4">Profile</h2>
        {editMode ? (
          <>
            <div className="mb-4">
              <label className="block text-xl font-medium">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                className="mt-1 p-2 border border-gray-300 rounded w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-xl font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled
                className="mt-1 p-2 border border-gray-300 rounded w-full bg-gray-200"
              />
            </div>
            <div className="mb-4">
              <label className="block text-xl font-medium">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleFormChange}
                className="mt-1 p-2 border border-gray-300 rounded w-full"
              />
            </div>
            <div className="flex justify-between">
              <button
                onClick={handleSave}
                className="py-2 px-6 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
              >
                Save
              </button>
              <button
                onClick={handleEditToggle}
                className="py-2 px-6 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-700 transition"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-xl mb-2"><strong>Name:</strong> {user.name}</p>
            <p className="text-xl mb-2"><strong>Email:</strong> {user.email}</p>
            <p className="text-xl mb-4"><strong>Location:</strong> {user.location}</p>
            <div className="flex justify-between">
              <button onClick={handleEditToggle} className="py-2 px-6 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">Edit</button>
              <button onClick={handleDelete} className="py-2 px-6 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700">Delete</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
