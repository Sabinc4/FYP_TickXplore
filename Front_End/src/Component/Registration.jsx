import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Registration = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Form Validation
    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please provide a valid email address.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Send data to backend only after validation
    axios
      .post("http://localhost:3001/signup", { name, email, password, confirmPassword })
      .then((result) => {
        // On success, display success message in the console
        console.log("Registered successfully:", result);
        // Navigate to the sign-in page
        navigate("/sign-in");
      })
      .catch((err) => {
        console.log(err);
        setError("Something went wrong. Please try again.");
      });
  };

  return (
    <div className="min-h-screen py-12 bg-white flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-4xl font-bold text-center text-slate-900 mb-6">Create an Account</h2>

        {/* Error message */}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
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
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="border border-gray-300 py-3 px-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 mt-2"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
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
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
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
            />
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-start gap-x-3 mt-4">
            <input type="checkbox" id="terms" className="mt-1 border border-gray-900 rounded" required />
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
          >
            Register Now
          </button>
        </form>
      </div>
    </div>
  );
};

export default Registration;
