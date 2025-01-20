import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null); // Store user data
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate fetching user data (for example, from a backend or localStorage)
    const userData = localStorage.getItem("userLoggedIn");
    
    if (userData === "true") {
      // If user is logged in, retrieve user data from localStorage
      const storedUserData = JSON.parse(localStorage.getItem("userData"));
      setUser(storedUserData);
    } else {
      // If not logged in, redirect to the sign-in page
      navigate("/sign-in");
    }
  }, [navigate]);

  const handleLogout = () => {
    // Remove login status from localStorage and redirect to home
    localStorage.removeItem("userLoggedIn");
    localStorage.removeItem("userData");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        {user ? (
          <>
            <h2 className="text-3xl font-semibold text-center mb-4">Profile</h2>
            <div className="mb-4">
              <h3 className="text-xl font-medium">Name</h3>
              <p className="text-gray-600">{user.name}</p>
            </div>
            <div className="mb-4">
              <h3 className="text-xl font-medium">Email</h3>
              <p className="text-gray-600">{user.email}</p>
            </div>
            <div className="flex justify-center">
              <button
                onClick={handleLogout}
                className="py-2 px-6 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition"
              >
                Log Out
              </button>
            </div>
          </>
        ) : (
          <p className="text-center">Loading profile...</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
