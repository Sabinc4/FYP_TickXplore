import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Registration = () => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user");  // Default role is 'user'
  const [vendorName, setVendorName] = useState("");
  const [vendorLocation, setVendorLocation] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // Utility function to trim and clean inputs
  const cleanInput = (input) => input.trim();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");  // Reset error state before submitting

    // Clean inputs before validation
    const cleanedName = cleanInput(name);
    const cleanedLocation = cleanInput(location);
    const cleanedEmail = cleanInput(email);
    const cleanedPassword = cleanInput(password);
    const cleanedConfirmPassword = cleanInput(confirmPassword);
    const cleanedVendorName = cleanInput(vendorName);
    const cleanedVendorLocation = cleanInput(vendorLocation);

    // Form Validation
    if (!cleanedName || !cleanedLocation || !cleanedEmail || !cleanedPassword || !cleanedConfirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(cleanedEmail)) {
      setError("Please provide a valid email address.");
      return;
    }

    if (cleanedPassword !== cleanedConfirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/.test(cleanedPassword)
    ) {
      setError(
        "Password must be at least 8 characters long, include uppercase, lowercase, a number, and a special character."
      );
      return;
    }

    if (role === "vendor" && (!cleanedVendorName || !cleanedVendorLocation)) {
      setError("Vendor name and location are required for vendors.");
      return;
    }

    // Start loading indicator
    setIsLoading(true);

    // Send data to backend
    axios
      .post("http://localhost:3001/signup", {
        name: cleanedName,
        location: cleanedLocation,
        email: cleanedEmail,
        password: cleanedPassword,
        confirmPassword: cleanedConfirmPassword,
        role: role,
        vendorName: role === "vendor" ? cleanedVendorName : undefined,
        vendorLocation: role === "vendor" ? cleanedVendorLocation : undefined,
      })
      .then((result) => {
        console.log("Registered successfully:", result);
        setIsLoading(false);
        navigate("/sign-in"); // Redirect to sign-in page after successful registration
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);

        // Check for specific error messages from the backend
        if (err.response?.data === "Email already exists. Please use a different email.") {
          setError("Email already exists. Please use a different email.");
        } else {
          setError(err.response?.data || "Something went wrong. Please try again.");
        }
      });
  };

  return (
    <div className="min-h-screen py-12 bg-white flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-4xl font-bold text-center text-slate-900 mb-6">
          Create an Account
        </h2>

        {/* Error message */}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="border border-gray-300 py-3 px-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 mt-2"
              aria-label="Full Name"
              autoComplete="off"
              disabled={isLoading}
            />
          </div>

          {/* Location */}
          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700"
            >
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter your location"
              className="border border-gray-300 py-3 px-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 mt-2"
              aria-label="Location"
              autoComplete="off"
              disabled={isLoading}
            />
          </div>

          {/* Role */}
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700"
            >
              I am a:
            </label>
            <select
              id="role"
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="border border-gray-300 py-3 px-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 mt-2"
              disabled={isLoading}
            >
              <option value="user">User</option>
              <option value="vendor">Vendor</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Vendor Name (only shown if role is vendor) */}
          {role === "vendor" && (
            <>
              <div>
                <label
                  htmlFor="vendorName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Vendor Name
                </label>
                <input
                  type="text"
                  id="vendorName"
                  name="vendorName"
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  placeholder="Enter your vendor name"
                  className="border border-gray-300 py-3 px-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 mt-2"
                  aria-label="Vendor Name"
                  autoComplete="off"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label
                  htmlFor="vendorLocation"
                  className="block text-sm font-medium text-gray-700"
                >
                  Vendor Location
                </label>
                <input
                  type="text"
                  id="vendorLocation"
                  name="vendorLocation"
                  value={vendorLocation}
                  onChange={(e) => setVendorLocation(e.target.value)}
                  placeholder="Enter your vendor location"
                  className="border border-gray-300 py-3 px-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 mt-2"
                  aria-label="Vendor Location"
                  autoComplete="off"
                  disabled={isLoading}
                />
              </div>
            </>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}  // This should update the email state
              placeholder="Enter your email"
              className="border border-gray-300 py-3 px-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 mt-2"
              aria-label="Email Address"
              autoComplete="off"
              disabled={isLoading}
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="border border-gray-300 py-3 px-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 mt-2"
              aria-label="Password"
              disabled={isLoading}
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              className="border border-gray-300 py-3 px-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 mt-2"
              aria-label="Confirm Password"
              disabled={isLoading}
            />
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-start gap-x-3 mt-4">
            <input
              type="checkbox"
              id="terms"
              className="mt-1 border border-gray-900 rounded"
              required
              aria-label="Accept Terms"
              disabled={isLoading}
            />
            <span className="text-gray-700 text-sm">
              I accept the{" "}
              <a href="#" className="text-slate-900 font-semibold">
                Terms of Use
              </a>{" "}
              &{" "}
              <a href="#" className="text-purple-500 font-semibold">
                Privacy Policy
              </a>
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-slate-900 py-3 text-center text-white rounded-lg hover:bg-purple-600 transition duration-300 mt-4"
            disabled={isLoading}
          >
            {isLoading ? "Registering..." : "Register Now"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Registration;
