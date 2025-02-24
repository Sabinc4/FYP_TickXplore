import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Helper function to determine the API endpoint based on role
const getEndpoint = (role) => {
  if (role === "vendor") return "vendors";
  if (role === "admin") return "admins";
  return "users";
};

const Profile = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState("user"); // default to user
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

  useEffect(() => {
    console.log("Profile component mounted.");

    // Check login status
    const loggedIn = localStorage.getItem("userLoggedIn");
    console.log("userLoggedIn:", loggedIn);
    if (loggedIn !== "true") {
      console.error("User not logged in. Redirecting to /sign-in");
      navigate("/sign-in");
      return;
    }

    // Retrieve stored role and the appropriate ID from localStorage.
    const storedUserRole = localStorage.getItem("userRole") || "user";
    setUserRole(storedUserRole);
    let storedId;
    if (storedUserRole === "vendor") {
      storedId = localStorage.getItem("vendorId");
    } else {
      // for admin and user, assume it's stored under "userId"
      storedId = localStorage.getItem("userId");
    }
    console.log("storedId:", storedId, "storedUserRole:", storedUserRole);
    if (!storedId) {
      console.error("No ID found in localStorage. Redirecting to /sign-in");
      navigate("/sign-in");
      return;
    }

    const endpoint = getEndpoint(storedUserRole);
    // Fetch the profile using the appropriate endpoint and ID.
    fetch(`http://localhost:3001/${endpoint}/${storedId}`)
      .then((response) => {
        console.log("Fetch response:", response);
        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched user data:", data);
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

  // Toggle edit mode
  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  // Handle changes in text fields
  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Determine the ID field from the fetched user object
  const getIdField = () => {
    if (userRole === "vendor") return "vendorId";
    if (userRole === "admin") return "adminId";
    return "userId";
  };

  // Save updated data
  const handleSave = () => {
    console.log("Saving updated user data:", formData);
    const endpoint = getEndpoint(userRole);
    const idField = getIdField();
    const id = user[idField];
    // Use the auto-incremented ID for the PUT request.
    fetch(`http://localhost:3001/${endpoint}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        console.log("Response from save:", response);
        if (!response.ok) {
          return response.text().then((text) => {
            console.error("Error response text:", text);
            throw new Error(
              `Server responded with status: ${response.status}, ${text}`
            );
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

  // Delete the account
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      const endpoint = getEndpoint(userRole);
      const idField = getIdField();
      const id = user[idField];
      console.log("Deleting user with id:", id);
      fetch(`http://localhost:3001/${endpoint}/${id}`, { method: "DELETE" })
        .then((response) => {
          console.log("Response from delete:", response);
          if (!response.ok) {
            return response.text().then((text) => {
              console.error("Error response text (delete):", text);
              throw new Error(
                `Server responded with status: ${response.status}, ${text}`
              );
            });
          }
          return response.json();
        })
        .then(() => {
          console.log("User account deleted successfully.");
          localStorage.removeItem("userLoggedIn");
          localStorage.removeItem("userId");
          localStorage.removeItem("userRole");
          localStorage.removeItem("vendorId");
          navigate("/");
        })
        .catch((err) => {
          console.error("Error deleting account:", err);
          setError(err.message);
        });
    }
  };

  if (loading)
    return <div className="text-center mt-8">Loading profile...</div>;
  if (error)
    return <div className="text-center mt-8 text-red-600">Error: {error}</div>;
  if (!user)
    return <div className="text-center mt-8">No user data available.</div>;

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
                onChange={handleFormChange}
                className="mt-1 p-2 border border-gray-300 rounded w-full"
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
            {userRole === "admin" && (
              <div className="mb-4">
                <label className="block text-xl font-medium">Role</label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleFormChange}
                  className="mt-1 p-2 border border-gray-300 rounded w-full"
                />
              </div>
            )}
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
            <div className="mb-4">
              <h3 className="text-xl font-medium">Name</h3>
              <p className="text-gray-600">{user.name}</p>
            </div>
            <div className="mb-4">
              <h3 className="text-xl font-medium">Email</h3>
              <p className="text-gray-600">{user.email}</p>
            </div>
            <div className="mb-4">
              <h3 className="text-xl font-medium">Location</h3>
              <p className="text-gray-600">{user.location}</p>
            </div>
            <div className="mb-4">
              <h3 className="text-xl font-medium">Role</h3>
              <p className="text-gray-600">{user.role}</p>
            </div>
            <div className="flex justify-between">
              <button
                onClick={handleEditToggle}
                className="py-2 px-6 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
              >
                Edit Profile
              </button>
              <button
                onClick={handleDelete}
                className="py-2 px-6 bg-red-800 text-white font-bold rounded-lg hover:bg-red-900 transition"
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
