import React, { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(""); // Error handling state
  const navigate = useNavigate(); // Navigation hook

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error before making request

    if (!email || !password) {
      setError("⚠️ Email and Password are required.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3001/auth/sign-in", {
        email,
        password,
      });

      if (response.data.redirectURL) {
        // Store login status and user role
        localStorage.setItem("userLoggedIn", "true");
        localStorage.setItem("userRole", response.data.user.role);

        console.log("Navigating to:", response.data.redirectURL); // Debugging log
        navigate(response.data.redirectURL);
      } else {
        setError("❌ Invalid credentials. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      if (err.response) {
        setError(err.response.data.message || "❌ An error occurred. Try again.");
      } else {
        setError("❌ Server is unreachable. Please try again later.");
      }
    }
  };

  return (
    <section className="h-screen bg-gradient-to-r bg-slate-100 flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-4xl font-bold text-center text-slate-900 mb-6">Sign In</h2>

        {/* Error message */}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Email input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Remember me checkbox */}
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-blue-500"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <a href="#!" className="text-sm text-blue-500 hover:text-blue-700">
              Forgot password?
            </a>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full py-3 bg-slate-700 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
          >
            Sign In
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <hr className="flex-1 border-gray-300" />
          <span className="mx-4 text-gray-600">OR</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        {/* Social login buttons */}
        <div className="flex space-x-4">
          <button className="flex items-center justify-center w-full py-3 bg-slate-700 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-500">
            <FaGoogle className="mr-2 text-xl text-red-500" />
            Continue with Google
          </button>
        </div>

        {/* Create new account */}
        <div className="mt-4">
          <NavLink
            to="/signup"
            className={({ isActive }) =>
              `flex items-center justify-center w-full py-3 bg-slate-700 text-white font-semibold rounded-lg shadow-md ${
                isActive ? "bg-blue-700 hover:bg-blue-700" : "hover:bg-blue-600"
              } focus:ring-2 focus:ring-blue-700`
            }
          >
            Create New Account
          </NavLink>
        </div>
      </div>
    </section>
  );
}
