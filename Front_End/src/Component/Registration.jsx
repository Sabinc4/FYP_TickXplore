import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Registration = () => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user");
  const [vendorName, setVendorName] = useState("");
  const [vendorLocation, setVendorLocation] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setShowSuccess(false);

    if (!name || !location || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email.");
      return;
    }

    if (password !== confirmPassword) {
      setError(" Passwords do not match.");
      return;
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/.test(password)) {
      setError(" Password must be at least 8 characters, contain uppercase, lowercase, a number, and a special character.");
      return;
    }

    if (role === "vendor" && (!vendorName || !vendorLocation)) {
      setError(" Vendor name and location are required.");
      return;
    }

    setIsLoading(true);

    try {
      await axios.post("http://localhost:3001/auth/sign-up", {
        name,
        location,
        email,
        password,
        confirmPassword,
        role,
        vendorName: role === "vendor" ? vendorName : undefined,
        vendorLocation: role === "vendor" ? vendorLocation : undefined,
      });

      setIsLoading(false);
      setShowSuccess(true); // Show success box

      // Redirect to login page after 2 seconds
      setTimeout(() => {
        navigate("/sign-in");
      }, 2000);
    } catch (err) {
      setIsLoading(false);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong. Please try again!");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <ToastContainer />
      
      {/*Success Box (Centered) */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-semibold text-green-600">🎉 Registration Successful!</h2>
            <p className="text-gray-600 mt-2">Redirecting to login...</p>
          </div>
        </div>
      )}

      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-6">Create an Account</h2>

        {/* Error Message */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 py-3 px-4 w-full rounded-lg focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="border border-gray-300 py-3 px-4 w-full rounded-lg focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700">I am a:</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="border border-gray-300 py-3 px-4 w-full rounded-lg focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            >
              <option value="user">User</option>
              <option value="vendor">Vendor</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Only for Vendors */}
          {role === "vendor" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Vendor Name</label>
                <input
                  type="text"
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  className="border border-gray-300 py-3 px-4 w-full rounded-lg focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Vendor Location</label>
                <input
                  type="text"
                  value={vendorLocation}
                  onChange={(e) => setVendorLocation(e.target.value)}
                  className="border border-gray-300 py-3 px-4 w-full rounded-lg focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                />
              </div>
            </>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 py-3 px-4 w-full rounded-lg focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 py-3 px-4 w-full rounded-lg focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border border-gray-300 py-3 px-4 w-full rounded-lg focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700" disabled={isLoading}>
            {isLoading ? "Registering..." : "Register Now"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Registration;
